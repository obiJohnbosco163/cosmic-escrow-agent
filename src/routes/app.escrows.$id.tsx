import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Building2, Upload, FileText, Shield, ExternalLink, AlertTriangle, CheckCircle2, Clock, Lock, Loader2 } from "lucide-react";
import { Card, PageHeader, StatusBadge } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { escrows } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useServerFn } from "@tanstack/react-start";
import { releaseFundsUnsigned, submitSignedTransaction } from "@/lib/trustless-work.functions";
import { signStellarXdr, isFreighterInstalled, STELLAR_TESTNET_PASSPHRASE } from "@/lib/freighter";
import { toast } from "sonner";

export const Route = createFileRoute("/app/escrows/$id")({
  component: EscrowDetail,
  notFoundComponent: () => (
    <div className="grid place-items-center py-20">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Escrow not found</h2>
        <Link to="/app/escrows" className="mt-4 inline-block text-sm text-primary">← Back to escrows</Link>
      </div>
    </div>
  ),
  loader: ({ params }) => {
    const escrow = escrows.find((e) => e.id === params.id);
    if (!escrow) throw notFound();
    return { escrow };
  },
});

function EscrowDetail() {
  const { escrow } = Route.useLoaderData();
  return (
    <div>
      <Link to="/app/escrows" className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-3.5 w-3.5" /> Back to escrows
      </Link>

      <PageHeader
        title={escrow.title}
        subtitle="Autonomous Escrow Agreement via Trustless Work Protocol"
        badge={<StatusBadge status={escrow.status} />}
        actions={
          <>
            <Button variant="outline" className="border-border bg-surface">
              <FileText className="mr-2 h-4 w-4" /> View Contract
            </Button>
            <Button className="bg-gradient-to-r from-destructive to-primary text-primary-foreground">
              <AlertTriangle className="mr-2 h-4 w-4" /> Raise Dispute
            </Button>
          </>
        }
      />
      <div className="-mt-4 mb-6 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
        Smart Contract ID: <span className="text-foreground">{escrow.contractId}</span> · ESCROW {escrow.id}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_360px]">
        <div className="space-y-4">
          {/* Balance */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Building2 className="h-3.5 w-3.5" /> Escrow Balance
              </div>
              <span className="rounded-md border border-success/30 bg-success/10 px-2 py-0.5 text-[10px] font-bold text-success">{escrow.currency}-Stellar</span>
            </div>
            <div className="mt-4 font-mono text-5xl font-bold tracking-tight">
              {escrow.amount.toLocaleString()}<span className="text-2xl text-muted-foreground">.00</span>
            </div>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              <Stat label="Funded By" value={escrow.buyer} />
              <Stat label="Pending Release" value={`${escrow.pending.toLocaleString()} USDC`} accent />
              <Stat label="Already Released" value={`${escrow.released.toLocaleString()} USDC`} />
            </div>
          </Card>

          {/* Milestones */}
          <Card className="p-6">
            <div className="mb-6 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              📈 Milestone Progression
            </div>
            <div className="relative">
              <div className="absolute left-0 right-0 top-5 h-0.5 bg-border" />
              <div className="absolute left-0 top-5 h-0.5 bg-gradient-to-r from-primary to-primary-glow"
                style={{ width: `${(escrow.milestones.filter((m: { status: string }) => m.status === "released" || m.status === "in_progress").length / escrow.milestones.length) * 100}%` }} />
              <div className="relative grid grid-cols-4 gap-2">
                {escrow.milestones.map((m: { id: string; name: string; amount: number; percent: number; status: string; date?: string }) => {
                  const released = m.status === "released";
                  const active = m.status === "in_progress";
                  return (
                    <div key={m.id} className="flex flex-col items-center text-center">
                      <div className={cn(
                        "grid h-10 w-10 place-items-center rounded-full border-2",
                        released && "border-primary bg-primary text-primary-foreground",
                        active && "border-primary bg-background text-primary",
                        !released && !active && "border-border bg-surface text-muted-foreground",
                      )}>
                        {released ? <CheckCircle2 className="h-4 w-4" /> : active ? <Clock className="h-4 w-4" /> : <Lock className="h-3.5 w-3.5" />}
                      </div>
                      <div className="mt-3 text-sm font-semibold">{m.name}</div>
                      <div className="mt-1 text-[10px] text-muted-foreground">${m.amount.toLocaleString()} · {m.percent}%</div>
                      <div className="mt-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
                        {m.date ?? (released ? "Released" : active ? "In Progress" : "Pending")}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card>

          {/* Documents */}
          <Card className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <FileText className="h-3.5 w-3.5" /> Document Vault
              </div>
              <Button variant="outline" size="sm" className="border-border bg-surface">
                <Upload className="mr-1.5 h-3.5 w-3.5" /> Upload
              </Button>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { name: "Commercial_Invoice_v2.pdf", meta: "Added by Supplier · 2.4 MB", verified: false },
                { name: "QA_Inspection_Report.pdf", meta: "Verified by AI Agent · 1.1 MB", verified: true },
                { name: "Bill_of_Lading_92341.pdf", meta: "Pending AI verification · 3.2 MB", verified: false },
                { name: "Certificate_of_Origin.pdf", meta: "Verified by AI Agent · 0.8 MB", verified: true },
              ].map((d) => (
                <div key={d.name} className="flex items-center gap-3 rounded-2xl border border-border bg-background/40 p-3">
                  <div className={cn("grid h-10 w-10 place-items-center rounded-xl", d.verified ? "bg-success/10 text-success" : "bg-primary/10 text-primary")}>
                    {d.verified ? <CheckCircle2 className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{d.name}</div>
                    <div className="truncate text-[11px] text-muted-foreground">{d.meta}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Trustless Work viewer panel */}
          <Card className="border-primary/30 p-5">
            <div className="flex items-center gap-2">
              <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/15 text-primary">
                <Shield className="h-4 w-4" />
              </div>
              <div>
                <div className="font-bold">Trustless Work</div>
                <div className="text-[11px] text-muted-foreground">Escrow Protocol Viewer</div>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-border bg-background/60 p-3 font-mono text-[11px] leading-relaxed">
              <div><span className="text-success">●</span> Live Contract State</div>
              <div className="mt-2 text-muted-foreground">
                <div><span className="text-foreground">state:</span> ACTIVE_LOCKED</div>
                <div><span className="text-foreground">arbiter:</span> 0x4a7b...9f2b (Kleros)</div>
                <div><span className="text-foreground">timeout:</span> 14 days remaining</div>
                <div><span className="text-foreground">hash:</span> {escrow.contractId}</div>
              </div>
            </div>
            <Button variant="outline" className="mt-4 w-full border-border">
              Open in Explorer <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Card>

          {/* Parties */}
          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              👥 Parties
            </div>
            <div className="space-y-3">
              <Party name={escrow.supplier} role="Supplier (Payee)" badge="VERIFIED" tone="success" />
              <Party name={escrow.buyer} role="Buyer (Payer)" badge="YOU" tone="primary" />
            </div>
          </Card>

          {/* Required Action */}
          <Card className="p-5">
            <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Required Actions</div>
            <p className="mt-3 text-sm text-muted-foreground">
              Confirm receipt of goods to release the final escrow tranche of <span className="font-semibold text-foreground">{escrow.pending.toLocaleString()} USDC</span> to the supplier.
            </p>
            <Button className="mt-4 w-full bg-gradient-to-r from-primary to-primary-glow text-primary-foreground glow-primary">
              <Shield className="mr-2 h-4 w-4" /> Release Funds
            </Button>
            <div className="mt-2 text-center text-[11px] text-muted-foreground">
              Action locked until Shipping phase completes.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={cn("rounded-2xl border border-border p-4", accent && "border-primary/40 bg-primary/5")}>
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 truncate text-sm font-semibold">{value}</div>
    </div>
  );
}

function Party({ name, role, badge, tone }: { name: string; role: string; badge: string; tone: "success" | "primary" }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-border bg-background/40 p-3">
      <div className={cn("grid h-9 w-9 place-items-center rounded-xl",
        tone === "success" ? "bg-success/10 text-success" : "bg-primary/15 text-primary")}>
        <Building2 className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold">{name}</div>
        <div className="text-[11px] text-muted-foreground">{role}</div>
      </div>
      <span className={cn("rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase",
        tone === "success" ? "border-success/40 bg-success/10 text-success" : "border-primary/40 bg-primary/10 text-primary")}>{badge}</span>
    </div>
  );
}
