import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Bot,
  Shield,
  FileSearch,
  Scale,
  Activity,
  Sparkles,
  Globe2,
  CheckCircle2,
  Zap,
  Lock,
  Rocket,
} from "lucide-react";
import { AppLogo } from "@/components/AppLogo";
import { Button } from "@/components/ui/button";
import { GlobalTradeMap } from "@/components/GlobalTradeMap";

export const Route = createFileRoute("/")({
  component: Landing,
  head: () => ({
    meta: [
      { title: "AstraPilot — Autonomous AI Commerce Agent on Stellar" },
      { name: "description", content: "Verify suppliers, design milestone-based escrow, and release stablecoin payments only when trade conditions are met. Powered by Trustless Work on Stellar." },
      { property: "og:title", content: "AstraPilot — Autonomous AI for Trustless Global Commerce" },
      { property: "og:description", content: "AI-native trade coordination with non-custodial Stellar escrow." },
    ],
  }),
});

const FEATURES = [
  { icon: Shield, title: "AI Supplier Verification", desc: "Risk-scored suppliers with sanctions, compliance, and historical performance signals." },
  { icon: Bot, title: "Milestone Contract Generation", desc: "Natural-language deal terms become structured milestone escrows in seconds." },
  { icon: Lock, title: "Non-Custodial Stablecoin Escrow", desc: "Funds locked on Stellar via Trustless Work — released only when conditions are met." },
  { icon: FileSearch, title: "Document Intelligence", desc: "POs, invoices, and Bills of Lading parsed and verified automatically." },
  { icon: Scale, title: "Dispute Coordination", desc: "AI-assisted dispute briefs and arbiter routing through Kleros and partners." },
  { icon: Activity, title: "Real-Time Escrow Monitoring", desc: "Live contract state, balances, and milestone progression in the Escrow Viewer." },
];

const STATS = [
  { label: "Protected Trade Volume", value: "$24.5M+" },
  { label: "Active Escrows", value: "128" },
  { label: "Avg Settlement", value: "38 hrs" },
  { label: "Verified Suppliers", value: "412" },
];

function Landing() {
  return (
    <div className="min-h-screen overflow-hidden">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/70 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <AppLogo size={34} />
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#product" className="hover:text-foreground">Product</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#trust" className="hover:text-foreground">Trust layer</a>
            <a href="#demo" className="hover:text-foreground">Demo</a>
          </nav>
          <div className="flex items-center gap-2">
            <Link to="/onboarding">
              <Button variant="ghost" className="hidden md:inline-flex">Sign In</Button>
            </Link>
            <Link to="/onboarding">
              <Button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground glow-primary">
                Launch App <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative px-6 pb-24 pt-20">
        <div className="absolute inset-0 grid-overlay opacity-30 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,oklch(0.62_0.22_18/30%),transparent)]" />

        <div className="relative mx-auto max-w-6xl text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-surface/80 px-3 py-1 text-xs text-muted-foreground backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Powered by Stellar · Soroban · Trustless Work
          </div>
          <h1 className="mt-6 text-balance text-5xl font-extrabold leading-[1.05] tracking-tight md:text-7xl">
            Autonomous AI for{" "}
            <span className="text-gradient-primary">Trustless Global Commerce</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
            AstraPilot verifies suppliers, designs milestone-based escrow contracts, and releases
            stablecoin payments only when trade conditions are met — across borders, automatically.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/app/agent">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground glow-primary">
                Start Demo <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/app">
              <Button size="lg" variant="outline" className="border-border bg-surface/60">
                <Globe2 className="mr-2 h-4 w-4" /> Watch Live Escrow
              </Button>
            </Link>
            <Button size="lg" variant="ghost" className="text-muted-foreground">
              Connect Wallet
            </Button>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-xs uppercase tracking-[0.2em] text-muted-foreground/70">
            <span>Stellar</span>
            <span>Soroban</span>
            <span>Trustless Work</span>
            <span>USDC · USDT</span>
            <span>Kleros Arbiter</span>
          </div>

          {/* Map */}
          <div className="relative mx-auto mt-16 max-w-5xl">
            <GlobalTradeMap className="aspect-[2/1] w-full" />
            <div className="pointer-events-none absolute inset-x-0 -bottom-6 mx-auto h-12 w-3/4 bg-[radial-gradient(closest-side,oklch(0.62_0.22_18/35%),transparent)] blur-2xl" />
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-surface/60 p-5 text-left backdrop-blur">
                <div className="text-2xl font-bold text-foreground">{s.value}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="product" className="border-t border-border bg-background px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Capabilities</div>
            <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">An autonomous trade desk in your browser</h2>
            <p className="mt-4 text-muted-foreground">
              From supplier discovery to dispute resolution, AstraPilot orchestrates every step of a
              cross-border deal — and proves every move on-chain.
            </p>
          </div>

          <div className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="group relative rounded-3xl border border-border bg-surface/60 p-6 transition-all hover:-translate-y-0.5 hover:border-primary/40">
                  <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-primary/30 to-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* DEMO */}
      <section id="demo" className="relative border-t border-border px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">AI Trade Agent</div>
            <h2 className="mt-3 text-4xl font-bold tracking-tight md:text-5xl">Talk to it like a trade analyst</h2>
            <p className="mt-4 text-muted-foreground">
              Describe a deal in plain language. AstraPilot parses commodity, route, and counterparty risk,
              then proposes a milestone-based escrow ready to deploy on Stellar.
            </p>
            <ul className="mt-8 space-y-3 text-sm">
              {[
                "Supplier risk assessment with match scores",
                "Auto-generated milestone payment schedule",
                "Required document checklist (PO, BoL, QA)",
                "One-click deploy to Trustless Work escrow",
                "Live state visible in the Escrow Viewer",
              ].map((t) => (
                <li key={t} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" /> <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex gap-3">
              <Link to="/app/agent">
                <Button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
                  Try the agent <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="rounded-3xl border border-border bg-surface/70 p-2 shadow-[var(--shadow-elegant)] backdrop-blur">
            <div className="rounded-2xl bg-background/60 p-5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="h-2 w-2 rounded-full bg-primary animate-pulse" /> AstraPilot · Live
              </div>
              <div className="mt-4 space-y-3 text-sm">
                <div className="ml-auto max-w-[80%] rounded-2xl rounded-br-sm border border-border bg-surface px-4 py-3">
                  Import $50k solar panels from Shenzhen. Needs to be milestone-based escrow.
                </div>
                <div className="max-w-[90%] rounded-2xl rounded-bl-sm bg-gradient-to-br from-primary/15 to-primary/5 px-4 py-3">
                  Parsed intent. Proposing a 3-phase milestone escrow on Stellar:
                  <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                    {[
                      ["30%", "Deposit"],
                      ["50%", "Bill of Lading"],
                      ["20%", "Delivery"],
                    ].map(([p, l]) => (
                      <div key={l} className="rounded-xl border border-border bg-background/60 p-2 text-center">
                        <div className="font-bold text-foreground">{p}</div>
                        <div className="text-muted-foreground">{l}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="max-w-[60%] rounded-2xl rounded-bl-sm border border-primary/30 bg-primary/10 px-4 py-3 text-primary">
                  ⚡ Suggest: Add Freight Forwarder
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section id="trust" className="border-t border-border bg-surface/30 px-6 py-24">
        <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-3">
          {[
            { icon: Lock, title: "Non-custodial by design", desc: "Funds never touch AstraPilot. Smart contracts on Stellar custody assets." },
            { icon: Zap, title: "Sub-5s settlement rails", desc: "Stellar's ~5s ledger close means near-instant releases at minimal fees." },
            { icon: Rocket, title: "Built for scale", desc: "From a $5k freelance gig to $5M trade lots — same trust primitives." },
          ].map((c) => {
            const Icon = c.icon;
            return (
              <div key={c.title} className="rounded-3xl border border-border bg-background/60 p-6">
                <Icon className="h-6 w-6 text-primary" />
                <h3 className="mt-4 text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{c.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="relative border-t border-border px-6 py-24">
        <div className="absolute inset-0 grid-overlay opacity-20" />
        <div className="relative mx-auto max-w-4xl rounded-3xl border border-border bg-gradient-to-br from-primary/15 via-surface to-background p-12 text-center shadow-[var(--shadow-elegant)]">
          <h2 className="text-balance text-4xl font-bold tracking-tight md:text-5xl">
            Ship trustless trade workflows this week.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Open the AstraPilot dashboard, simulate a cross-border deal, and inspect a live escrow on Stellar — no signup required.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/app">
              <Button size="lg" className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground glow-primary">
                Open Demo Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/onboarding">
              <Button size="lg" variant="outline" className="border-border">Create Account</Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-border px-6 py-10 text-sm text-muted-foreground">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
          <AppLogo size={28} />
          <div className="flex flex-wrap gap-6 text-xs">
            <a href="#" className="hover:text-foreground">Docs</a>
            <a href="#" className="hover:text-foreground">API</a>
            <a href="#" className="hover:text-foreground">Privacy</a>
            <a href="#" className="hover:text-foreground">Terms of Trade</a>
          </div>
          <span className="text-xs">© 2026 AstraPilot · Built for the Boundless × Trustless Work hackathon</span>
        </div>
      </footer>
    </div>
  );
}
