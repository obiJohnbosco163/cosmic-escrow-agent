import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Building2, ShoppingCart, Wallet, ArrowRight, Sparkles, Loader2, AlertCircle } from "lucide-react";
import { AppLogo } from "@/components/AppLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { isFreighterInstalled, FREIGHTER_INSTALL_URL } from "@/lib/freighter";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

function Onboarding() {
  const [role, setRole] = useState<"supplier" | "buyer" | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { connectWallet, session } = useAuth();
  const navigate = useNavigate();

  async function handleConnect() {
    if (!role) {
      setError("Pick a role first.");
      return;
    }
    setError(null);
    setBusy(true);
    try {
      await connectWallet(role);
      navigate({ to: "/app" });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Wallet connection failed.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative grid min-h-screen place-items-center px-6">
      <div className="absolute inset-0 grid-overlay opacity-30" />
      <div className="absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.62_0.22_18/30%),transparent)]" />
      <div className="relative w-full max-w-xl">
        <div className="mb-8 flex justify-center"><AppLogo size={40} /></div>
        <div className="rounded-3xl border border-border bg-surface/80 p-8 backdrop-blur-xl shadow-[var(--shadow-elegant)]">
          <div className="mb-1 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" /> Get started
          </div>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Join AstraPilot</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Connecting a Stellar wallet is <span className="text-foreground font-medium">optional</span> — it binds deals to your identity and lets you deploy real escrows. You can also explore the AI agent and dashboard in demo mode without a wallet.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-2">
            <RoleCard active={role === "supplier"} onClick={() => setRole("supplier")} icon={Building2} title="Supplier / Exporter" desc="Sell goods cross-border, get paid as milestones complete." />
            <RoleCard active={role === "buyer"} onClick={() => setRole("buyer")} icon={ShoppingCart} title="Buyer / Importer" desc="Source verified suppliers, pay only when conditions are met." />
          </div>

          {error && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> <span>{error}</span>
            </div>
          )}

          <div className="mt-6 space-y-2">
            <Button
              onClick={handleConnect}
              disabled={busy || !role}
              className="h-11 w-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground glow-primary"
            >
              {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wallet className="mr-2 h-4 w-4" />}
              {busy ? "Connecting…" : "Continue with Freighter Wallet"}
            </Button>
            {!isFreighterInstalled() && (
              <a
                href={FREIGHTER_INSTALL_URL}
                target="_blank"
                rel="noreferrer"
                className="block text-center text-xs text-muted-foreground hover:text-foreground"
              >
                Don't have Freighter? Install it →
              </a>
            )}
          </div>

          <div className="mt-6 flex flex-col items-center gap-2 border-t border-border pt-5 text-xs text-muted-foreground">
            <div className="font-semibold uppercase tracking-wider text-[10px]">Or skip — wallet is optional</div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link to="/app/agent" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 hover:text-foreground hover:border-primary/40">
                <Sparkles className="h-3 w-3 text-primary" /> Try the AI Agent
              </Link>
              <Link to="/app" className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1.5 hover:text-foreground hover:border-primary/40">
                Open demo dashboard <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            {session && (
              <Link to="/app" className="mt-1 flex items-center justify-center gap-1.5 hover:text-foreground">
                Already signed in — continue <ArrowRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleCard({ active, onClick, icon: Icon, title, desc }: { active: boolean; onClick: () => void; icon: typeof Building2; title: string; desc: string }) {
  return (
    <button onClick={onClick} className={cn(
      "rounded-2xl border bg-background/40 p-4 text-left transition-all hover:-translate-y-0.5",
      active ? "border-primary bg-primary/10" : "border-border hover:border-primary/40",
    )}>
      <Icon className={cn("h-5 w-5", active ? "text-primary" : "text-muted-foreground")} />
      <div className="mt-3 text-sm font-bold">{title}</div>
      <div className="mt-1 text-xs text-muted-foreground">{desc}</div>
    </button>
  );
}
