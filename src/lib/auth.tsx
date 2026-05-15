import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import {
  connectFreighter,
  signOnboardingMessage,
  walletToCredentials,
} from "./freighter";

export type Profile = {
  id: string;
  user_id: string;
  wallet_address: string | null;
  role: "supplier" | "buyer" | null;
  display_name: string | null;
  company: string | null;
};

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  connectWallet: (role: "supplier" | "buyer") => Promise<{ address: string }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
      if (s?.user) {
        // Defer to avoid deadlock with auth callback
        setTimeout(() => loadProfile(s.user.id), 0);
      } else {
        setProfile(null);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session?.user) loadProfile(data.session.user.id);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadProfile(userId: string) {
    const { data } = await supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle();
    setProfile(data as Profile | null);
  }

  async function refreshProfile() {
    if (session?.user) await loadProfile(session.user.id);
  }

  async function connectWallet(role: "supplier" | "buyer") {
    const { address } = await connectFreighter();
    // Prove wallet ownership (best-effort; ignore if user cancels signing)
    try { await signOnboardingMessage(address); } catch { /* user may dismiss */ }

    const { email, password } = walletToCredentials(address);

    // Try sign in first; fall back to sign up
    const signIn = await supabase.auth.signInWithPassword({ email, password });
    if (signIn.error) {
      const signUp = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/app`,
          data: { wallet_address: address, role, display_name: `${address.slice(0,4)}…${address.slice(-4)}` },
        },
      });
      if (signUp.error) throw signUp.error;
    }

    // Ensure profile reflects this wallet + role (in case row already existed)
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").upsert(
        {
          user_id: user.id,
          wallet_address: address,
          role,
          display_name: `${address.slice(0,4)}…${address.slice(-4)}`,
        },
        { onConflict: "user_id" }
      );
      await loadProfile(user.id);
    }
    return { address };
  }

  async function signOut() {
    await supabase.auth.signOut();
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        user: session?.user ?? null,
        profile,
        loading,
        connectWallet,
        signOut,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
