import * as React from "react";
import { Link as TLink, Outlet, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Bot,
  PlusCircle,
  Wallet,
  Building2,
  FileText,
  Shield,
  BarChart3,
  Settings,
  Search,
  Bell,
  HelpCircle,
  Radio,
  ChevronRight,
} from "lucide-react";
import { AppLogo } from "@/components/AppLogo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const Link = TLink as unknown as React.ComponentType<{
  to: string;
  params?: Record<string, string>;
  className?: string;
  children?: React.ReactNode;
}>;

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const NAV: NavItem[] = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/app/agent", label: "AI Trade Agent", icon: Bot },
  { to: "/app/new-deal", label: "New Deal", icon: PlusCircle },
  { to: "/app/escrows", label: "Escrows", icon: Wallet },
  { to: "/app/suppliers", label: "Suppliers", icon: Building2 },
  { to: "/app/documents", label: "Documents", icon: FileText },
  { to: "/app/risk", label: "Risk Analysis", icon: Shield },
  { to: "/app/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

export function AppShell() {
  const { location } = useRouterState();
  const path = location.pathname;
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();
  const wallet = profile?.wallet_address ?? null;
  const initials = wallet ? `${wallet.slice(0, 2)}` : "AP";

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="hidden w-[260px] shrink-0 flex-col border-r border-border bg-surface/60 backdrop-blur-xl md:flex">
        <div className="px-6 py-6">
          <Link to="/">
            <AppLogo size={36} />
          </Link>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((item) => {
            const active = item.exact ? path === item.to : path.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground hover:bg-surface-elevated hover:text-foreground",
                )}
              >
                {active && <span className="absolute -left-3 top-1/2 h-6 -translate-y-1/2 w-[3px] rounded-r bg-primary" />}
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="space-y-3 p-4">
          <div className="rounded-2xl border border-border bg-background/40 p-3">
            <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Connected wallet</div>
            <div className="mt-1 truncate font-mono text-xs text-foreground" title={wallet ?? ""}>
              {wallet ? `${wallet.slice(0, 6)}…${wallet.slice(-6)}` : "Not connected"}
            </div>
            {profile?.role && (
              <div className="mt-1 inline-flex rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
                {profile.role.toUpperCase()}
              </div>
            )}
          </div>
          <Button
            onClick={async () => { await signOut(); navigate({ to: "/onboarding" }); }}
            variant="outline"
            className="w-full border-border"
            size="sm"
          >
            Disconnect
          </Button>
          <div className="space-y-1 border-t border-border pt-3 text-xs">
            <button className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-muted-foreground hover:bg-surface-elevated">
              <HelpCircle className="h-3.5 w-3.5" /> Support
            </button>
            <div className="flex items-center justify-between rounded-lg px-2 py-1.5 text-muted-foreground">
              <span className="flex items-center gap-2"><Radio className="h-3.5 w-3.5" /> Network Status</span>
              <span className="h-2 w-2 rounded-full bg-success shadow-[0_0_8px_oklch(0.7_0.16_165)]" />
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/70 px-4 backdrop-blur-xl md:px-8">
          <div className="relative flex-1 max-w-2xl">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              placeholder="Search escrows, documents, or suppliers…"
              className="h-11 w-full rounded-full border border-border bg-surface/80 pl-11 pr-16 text-sm text-foreground placeholder:text-muted-foreground/70 focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/40"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md border border-border bg-surface-elevated px-2 py-0.5 text-[10px] font-mono text-muted-foreground">⌘K</kbd>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium md:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-success" /> Stellar Mainnet
            </div>
            <button className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-muted-foreground hover:text-foreground">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
            </button>
            <button className="hidden h-10 w-10 place-items-center rounded-full border border-border bg-surface text-muted-foreground hover:text-foreground md:grid">
              <Wallet className="h-4 w-4" />
            </button>
            <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-glow text-xs font-bold text-primary-foreground">
              AP
            </div>
          </div>
        </header>

        {/* Crumbs */}
        <div className="flex items-center gap-2 px-4 pt-6 text-xs text-muted-foreground md:px-8">
          <Link to="/app" className="hover:text-foreground">App</Link>
          {NAV.find((n) => !n.exact && path.startsWith(n.to)) && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground">{NAV.find((n) => !n.exact && path.startsWith(n.to))?.label}</span>
            </>
          )}
        </div>

        <main className="flex-1 px-4 pb-12 pt-4 md:px-8">
          <Outlet />
        </main>

        <footer className="border-t border-border px-4 py-4 text-xs text-muted-foreground md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span>© 2026 AstraPilot · Stellar Network <span className="text-success">Active</span> · Soroban <span className="text-success">Operational</span></span>
            <div className="flex gap-4">
              <Link to="/" className="hover:text-foreground">Network Health</Link>
              <Link to="/" className="hover:text-foreground">Privacy Protocol</Link>
              <Link to="/" className="hover:text-foreground">Terms of Trade</Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
