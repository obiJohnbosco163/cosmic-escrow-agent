import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Banknote,
  Wallet,
  ShieldAlert,
  Building2,
  Activity,
  Clock,
  Plus,
  Download,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  Coins,
  Bot,
} from "lucide-react";
import { PageHeader, StatCard, Card, StatusBadge } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { GlobalTradeMap } from "@/components/GlobalTradeMap";
import { activity, escrows, escrowLiquiditySeries, kpis } from "@/lib/mock-data";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from "recharts";

export const Route = createFileRoute("/app/")({
  component: Dashboard,
});

const ICONS: Record<string, typeof CheckCircle2> = {
  document_verified: FileCheck,
  funds_released: Coins,
  milestone_approved: CheckCircle2,
  dispute: AlertTriangle,
  escrow_created: Wallet,
  risk_alert: ShieldAlert,
};

function Dashboard() {
  return (
    <div>
      <PageHeader
        title="Global Trade Operations"
        subtitle="Autonomous oversight of active escrows and supply chain integrity."
        badge={
          <span className="rounded-md border border-success/30 bg-success/10 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-success">
            ● Live
          </span>
        }
        actions={
          <>
            <Button variant="outline" className="border-border bg-surface">
              <Download className="mr-2 h-4 w-4" /> Export Report
            </Button>
            <Link to="/app/new-deal">
              <Button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground glow-primary">
                <Plus className="mr-2 h-4 w-4" /> Init Escrow
              </Button>
            </Link>
          </>
        }
      />

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatCard
          label="Protected Volume"
          value="$24.5M"
          icon={Banknote}
          delta="↗ +12.4%"
          hint="● Across 42 jurisdictions"
        />
        <StatCard label="Active Escrows" value={`${kpis.activeEscrows}`} icon={Wallet} hint={`Awaiting Release: ${kpis.awaitingRelease}  ·  Completed (24h): ${kpis.completedToday}`}>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-[66%] rounded-full bg-gradient-to-r from-primary to-primary-glow" />
          </div>
        </StatCard>
        <StatCard label="Risk Alerts" value={kpis.riskAlerts} icon={ShieldAlert} tone="default">
          <div className="mt-3 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-warning">
              <AlertTriangle className="h-3.5 w-3.5" /> Compliance flag on #ESC-992
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-3.5 w-3.5" /> Delay expected Route APAC-1
            </div>
          </div>
        </StatCard>
        <StatCard label="Verified Suppliers" value={kpis.verifiedSuppliers} icon={Building2} hint="Across 28 categories" />
        <StatCard label="Funds Released MTD" value="$8.24M" icon={Coins} delta="↗ +6.8%" />
        <StatCard label="Avg Settlement" value={`${kpis.avgSettlementHours}h`} icon={TrendingUp} hint="From milestone approval to payout" />
      </div>

      {/* Map + Liquidity */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">🌐 Live Routes & Nodes</h2>
              <p className="text-xs text-muted-foreground">Real-time shipment telemetry</p>
            </div>
            <div className="flex gap-2 text-xs">
              <button className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-medium text-primary">Sea Freight</button>
              <button className="rounded-full border border-border px-3 py-1 text-muted-foreground hover:text-foreground">Air Cargo</button>
            </div>
          </div>
          <GlobalTradeMap className="aspect-[2/1] w-full" />
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold">Escrow Liquidity</h2>
            <span className="text-xs text-muted-foreground">···</span>
          </div>
          <div className="mt-4 text-right">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Current Lockup</div>
            <div className="text-3xl font-bold">$8.2M</div>
          </div>
          <div className="mt-4 h-44">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={escrowLiquiditySeries}>
                <XAxis dataKey="day" tick={{ fontSize: 10, fill: "oklch(0.7 0.02 260)" }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: "oklch(1 0 0 / 4%)" }}
                  contentStyle={{
                    background: "oklch(0.18 0.012 275)",
                    border: "1px solid oklch(1 0 0 / 10%)",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                  formatter={(v: number) => [`$${v}M`, "Liquidity"]}
                />
                <Bar dataKey="value" radius={[8, 8, 2, 2]}>
                  {escrowLiquiditySeries.map((d, i) => (
                    <Cell key={i} fill={i === escrowLiquiditySeries.length - 1 ? "oklch(0.7 0.25 22)" : "oklch(0.45 0.18 18 / 70%)"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Activity + Recent Escrows */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Recent Escrows</h2>
            <Link to="/app/escrows" className="text-xs text-primary hover:underline">View all →</Link>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-surface-elevated text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 text-left font-medium">ID</th>
                  <th className="px-4 py-3 text-left font-medium">Title</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                  <th className="px-4 py-3 text-left font-medium">Status</th>
                  <th className="px-4 py-3 text-left font-medium">Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {escrows.map((e) => (
                  <tr key={e.id} className="transition-colors hover:bg-surface-elevated/50">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                      <Link to="/app/escrows/$id" params={{ id: e.id }} className="hover:text-primary">{e.id}</Link>
                    </td>
                    <td className="px-4 py-3 font-medium">{e.title}</td>
                    <td className="px-4 py-3 text-right font-mono">${e.amount.toLocaleString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={e.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${e.riskScore}%`,
                              background: e.riskScore > 50 ? "oklch(0.62 0.24 25)" : e.riskScore > 30 ? "oklch(0.78 0.16 75)" : "oklch(0.7 0.16 165)",
                            }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">{e.riskScore}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Activity Log</h2>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="space-y-3">
            {activity.map((a) => {
              const Icon = ICONS[a.type] ?? Activity;
              const tone =
                a.type === "dispute" || a.type === "risk_alert"
                  ? "text-destructive bg-destructive/10"
                  : a.type === "funds_released"
                  ? "text-success bg-success/10"
                  : "text-primary bg-primary/10";
              return (
                <div key={a.id} className="flex items-start gap-3">
                  <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${tone}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="truncate text-sm font-medium">{a.title}</div>
                      <div className="shrink-0 text-[10px] text-muted-foreground">{a.time}</div>
                    </div>
                    <div className="truncate text-xs text-muted-foreground">{a.subtitle}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <Link to="/app/agent">
            <Button variant="outline" className="mt-5 w-full border-border bg-surface">
              <Bot className="mr-2 h-4 w-4" /> Ask the AI agent
            </Button>
          </Link>
        </Card>
      </div>
    </div>
  );
}
