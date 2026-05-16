import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Wallet, Plus, Search } from "lucide-react";
import { Card, PageHeader, StatusBadge } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { escrows as mockEscrows } from "@/lib/mock-data";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useMode } from "@/lib/mode";

export const Route = createFileRoute("/app/escrows/")({
  component: EscrowsList,
});

type DealRow = {
  id: string;
  title: string;
  amount: number;
  counterparty: string | null;
  origin: string | null;
  destination: string | null;
  status: string;
  risk_score: number | null;
  trustless_contract_id: string | null;
  created_at: string;
};

function EscrowsList() {
  const { user } = useAuth();
  const { mode } = useMode();
  const [deals, setDeals] = useState<DealRow[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("deals")
      .select("id,title,amount,counterparty,origin,destination,status,risk_score,trustless_contract_id,created_at")
      .order("created_at", { ascending: false })
      .then(({ data }) => setDeals((data as DealRow[]) ?? []));
  }, [user]);

  return (
    <div>
      <PageHeader
        title="Escrows"
        subtitle="All Trustless Work contracts initialized through AstraPilot — bound to your wallet."
        actions={
          <Link to="/app/new-deal">
            <Button className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground glow-primary">
              <Plus className="mr-2 h-4 w-4" /> New Escrow
            </Button>
          </Link>
        }
      />

      <div className="mb-4 flex items-center gap-2 rounded-2xl border border-border bg-surface/60 px-4 py-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input placeholder="Filter by ID, supplier, or buyer…" className="flex-1 bg-transparent py-1 text-sm outline-none placeholder:text-muted-foreground" />
        <div className="flex gap-1 text-xs">
          {["All", "Mine", "Demo"].map((t, i) => (
            <button key={t} className={`rounded-full px-3 py-1 ${i === 0 ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"}`}>{t}</button>
          ))}
        </div>
      </div>

      {deals.length > 0 && (
        <Card className="mb-4 overflow-hidden">
          <div className="border-b border-border bg-primary/5 px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-primary">
            Your deals
          </div>
          <table className="w-full text-sm">
            <thead className="bg-surface-elevated text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-5 py-3 text-left font-medium">Escrow</th>
                <th className="px-5 py-3 text-left font-medium">Route</th>
                <th className="px-5 py-3 text-right font-medium">Amount</th>
                <th className="px-5 py-3 text-left font-medium">Status</th>
                <th className="px-5 py-3 text-left font-medium">Trustless ID</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {deals.map((d) => (
                <tr key={d.id} className="hover:bg-surface-elevated/50">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary"><Wallet className="h-4 w-4" /></div>
                      <div>
                        <div className="font-mono text-[10px] text-muted-foreground">{d.id.slice(0, 8)}</div>
                        <div className="font-medium">{d.title}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-xs text-muted-foreground">{d.origin} → {d.destination}</td>
                  <td className="px-5 py-4 text-right font-mono">${Number(d.amount).toLocaleString()}</td>
                  <td className="px-5 py-4"><StatusBadge status={d.status} /></td>
                  <td className="px-5 py-4 font-mono text-[11px] text-muted-foreground">{d.trustless_contract_id ?? "—"}</td>
                  <td className="px-5 py-4 text-right text-xs text-muted-foreground">Live</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}

      <Card className="overflow-hidden">
        <div className="border-b border-border bg-surface-elevated/40 px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Demo network activity
        </div>
        <table className="w-full text-sm">
          <thead className="bg-surface-elevated text-[11px] uppercase tracking-wider text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-left font-medium">Escrow</th>
              <th className="px-5 py-3 text-left font-medium">Parties</th>
              <th className="px-5 py-3 text-right font-medium">Amount</th>
              <th className="px-5 py-3 text-right font-medium">Released</th>
              <th className="px-5 py-3 text-left font-medium">Status</th>
              <th className="px-5 py-3 text-left font-medium">Risk</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {mockEscrows.map((e) => (
              <tr key={e.id} className="hover:bg-surface-elevated/50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary"><Wallet className="h-4 w-4" /></div>
                    <div>
                      <div className="font-mono text-xs text-muted-foreground">{e.id}</div>
                      <div className="font-medium">{e.title}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-xs">
                  <div>{e.supplier} <span className="text-muted-foreground">({e.supplierCountry})</span></div>
                  <div className="text-muted-foreground">→ {e.buyer}</div>
                </td>
                <td className="px-5 py-4 text-right font-mono">${e.amount.toLocaleString()}</td>
                <td className="px-5 py-4 text-right font-mono text-success">${e.released.toLocaleString()}</td>
                <td className="px-5 py-4"><StatusBadge status={e.status} /></td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                      <div className="h-full rounded-full"
                        style={{ width: `${e.riskScore}%`, background: e.riskScore > 50 ? "oklch(0.62 0.24 25)" : e.riskScore > 30 ? "oklch(0.78 0.16 75)" : "oklch(0.7 0.16 165)" }} />
                    </div>
                    <span className="text-xs">{e.riskScore}</span>
                  </div>
                </td>
                <td className="px-5 py-4 text-right">
                  <Link to="/app/escrows/$id" params={{ id: e.id }} className="text-xs font-semibold text-primary hover:underline">View →</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
