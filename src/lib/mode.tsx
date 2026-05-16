import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type AppMode = "demo" | "live";
const KEY = "astrapilot:mode";

type Ctx = { mode: AppMode; setMode: (m: AppMode) => void; toggle: () => void };
const ModeContext = createContext<Ctx | null>(null);

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<AppMode>("demo");

  useEffect(() => {
    const stored = (typeof window !== "undefined" && localStorage.getItem(KEY)) as AppMode | null;
    if (stored === "demo" || stored === "live") setModeState(stored);
  }, []);

  function setMode(m: AppMode) {
    setModeState(m);
    try { localStorage.setItem(KEY, m); } catch { /* ignore */ }
  }

  return (
    <ModeContext.Provider value={{ mode, setMode, toggle: () => setMode(mode === "demo" ? "live" : "demo") }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode() {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error("useMode must be used inside <ModeProvider>");
  return ctx;
}
