import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, ArrowLeft, Check, Wallet, Loader2 } from "lucide-react";
import { Card, PageHeader } from "@/components/ui-kit";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useMode } from "@/lib/mode";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { deployUnsignedEscrow, submitSignedTransaction } from "@/lib/trustless-work.functions";
import { signStellarXdr, isFreighterInstalled, STELLAR_TESTNET_PASSPHRASE } from "@/lib/freighter";
import { toast } from "sonner";

export const Route = createFileRoute("/app/new-deal")({ component: NewDeal });

const STEPS = ["Trade Details", "Parties", "Milestones", "Documents", "Escrow Preview", "Deploy"];

const DEFAULT_MILESTONES = [
  { name: "Initial Deposit", percent: 30 },
  { name: "Production / QA", percent: 30 },
  { name: "Bill of Lading", percent: 30 },
  { name: "Delivery", percent: 10 },
];

const DEFAULT_DOCS = ["Commercial Invoice", "Purchase Order", "Bill of Lading (Ocean)", "QA Inspection Report", "Certificate of Origin"];

function NewDeal() {
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: "Shenzhen Solar Panels Q4",
    commodity: "Solar Panels — 280W Mono",
    amount: 50000,
    route: "Shenzhen → Los Angeles",
    counterparty: "Shenzhen TechSolar Ltd.",
    arbiter: "Kleros (default)",
  });
  const { profile, user } = useAuth();
  const { mode } = useMode();
  const navigate = useNavigate();
  const deployUnsigned = useServerFn(deployUnsignedEscrow);
  const submitSigned = useServerFn(submitSignedTransaction);

  async function deploy() {
    setBusy(true);
    try {
      const milestones = DEFAULT_MILESTONES.map((m) => ({
        name: m.name,
        percent: m.percent,
        amount: (form.amount * m.percent) / 100,
        status: "pending" as const,
      }));

      // Persist the deal (only if signed in). Demo mode skips DB.
      let dealId: string = crypto.randomUUID();
      if (user) {
        const { data: deal, error } = await supabase
          .from("deals")
          .insert({
            user_id: user.id,
            title: form.title,
            commodity: form.commodity,
            amount: form.amount,
            currency: "USDC",
            origin: form.route.split("→")[0]?.trim(),
            destination: form.route.split("→")[1]?.trim(),
            counterparty: form.counterparty,
            status: "funded",
            milestones,
            documents: DEFAULT_DOCS,
            risk_score: 18,
          })
          .select()
          .single();
        if (error) throw error;
        dealId = deal.id;
      }

      const wallet = profile?.wallet_address;

      // No wallet → demo deploy (no on-chain signing).
      if (!wallet || !isFreighterInstalled()) {
        const fakeId = `tw_demo_${dealId.slice(0, 8)}`;
        if (user) await supabase.from("deals").update({ trustless_contract_id: fakeId }).eq("id", dealId);
        toast.success(`Escrow saved in demo mode · ${fakeId}`);
        navigate({ to: "/app/escrows" });
        return;
      }

      // Real on-chain Stellar flow via Trustless Work.
      toast.info("Building escrow transaction…");
      const { unsignedTransaction } = await deployUnsigned({
        data: {
          dealId,
          title: form.title,
          description: form.commodity,
          amount: form.amount,
          platformFee: 0.5,
          signerAddress: wallet,
          approverAddress: wallet,
          serviceProviderAddress: wallet, // demo: same wallet acts as supplier
          releaseSignerAddress: wallet,
          platformAddress: wallet,
          disputeResolverAddress: wallet,
          receiverAddress: wallet,
          // Stellar testnet USDC issuer (Circle)
          trustlineAddress: "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5",
          milestones: milestones.map((m) => ({ description: m.name })),
        },
      });

      toast.info("Sign the transaction in Freighter…");
      const signedXdr = await signStellarXdr(unsignedTransaction, wallet, STELLAR_TESTNET_PASSPHRASE);

      toast.info("Broadcasting to Stellar…");
      const result = await submitSigned({ data: { signedXdr } });
      const contractId = result.contractId ?? `tw_${dealId.slice(0, 8)}`;

      if (user) await supabase.from("deals").update({ trustless_contract_id: contractId }).eq("id", dealId);
      toast.success(`Escrow deployed on Stellar · ${contractId}`);
      navigate({ to: "/app/escrows" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to deploy escrow");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader title="New Deal" subtitle="Initialize a Trustless Work escrow contract on Stellar." />
      <Card className="p-6">
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-1 items-center gap-2">
              <div className={cn("grid h-8 w-8 place-items-center rounded-full text-xs font-bold border-2",
                i < step && "border-primary bg-primary text-primary-foreground",
                i === step && "border-primary text-primary",
                i > step && "border-border text-muted-foreground")}>
                {i < step ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <div className={cn("hidden text-xs font-medium md:block", i === step ? "text-foreground" : "text-muted-foreground")}>{s}</div>
              {i < STEPS.length - 1 && <div className={cn("h-0.5 flex-1", i < step ? "bg-primary" : "bg-border")} />}
            </div>
          ))}
        </div>

        <div className="mt-8 min-h-[320px]">
          {step === 0 && (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Deal Title" value={form.title} onChange={(v) => setForm({ ...form, title: v })} />
              <Field label="Commodity" value={form.commodity} onChange={(v) => setForm({ ...form, commodity: v })} />
              <Field label="Amount (USDC)" value={String(form.amount)} onChange={(v) => setForm({ ...form, amount: Number(v) || 0 })} />
              <Field label="Origin → Destination" value={form.route} onChange={(v) => setForm({ ...form, route: v })} />
            </div>
          )}
          {step === 1 && (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Buyer (Payer)" value={profile?.display_name ?? "You"} onChange={() => {}} readOnly />
              <Field label="Supplier (Payee)" value={form.counterparty} onChange={(v) => setForm({ ...form, counterparty: v })} />
              <Field label="Arbiter" value={form.arbiter} onChange={(v) => setForm({ ...form, arbiter: v })} />
              <Field label="Inspection Partner" value="SGS / Optional" onChange={() => {}} />
            </div>
          )}
          {step === 2 && (
            <div className="space-y-2">
              {DEFAULT_MILESTONES.map((m) => (
                <div key={m.name} className="flex items-center gap-3 rounded-2xl border border-border bg-background/40 p-3">
                  <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-xs font-bold text-primary">{m.percent}%</div>
                  <div className="flex-1 text-sm font-medium">{m.name}</div>
                  <div className="font-mono text-sm text-muted-foreground">${(form.amount * m.percent / 100).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
          {step === 3 && (
            <div className="grid gap-3 md:grid-cols-2">
              {DEFAULT_DOCS.map((d) => (
                <label key={d} className="flex items-center gap-2 rounded-xl border border-border bg-background/40 p-3 text-sm">
                  <input type="checkbox" defaultChecked className="accent-[oklch(0.62_0.22_18)]" /> {d}
                </label>
              ))}
            </div>
          )}
          {step === 4 && (
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-primary">Trustless Work Contract Preview</div>
              <pre className="mt-3 overflow-auto rounded-xl bg-background/60 p-4 font-mono text-[11px]">
{`network: stellar-mainnet
asset: USDC
amount: ${form.amount}
buyer: ${profile?.wallet_address ?? "<connect wallet>"}
supplier: ${form.counterparty}
arbiter: ${form.arbiter}
milestones: ${DEFAULT_MILESTONES.length}
timeout: 21d
estimated_fee: 100 XLM`}
              </pre>
            </div>
          )}
          {step === 5 && (
            <div className="grid place-items-center py-8 text-center">
              <div className="grid h-16 w-16 place-items-center rounded-3xl bg-gradient-to-br from-primary to-primary-glow text-primary-foreground glow-primary">
                <Wallet className="h-7 w-7" />
              </div>
              <h3 className="mt-4 text-2xl font-bold">Deploy escrow</h3>
              <p className="mt-2 max-w-md text-sm text-muted-foreground">
                Sign the transaction to lock funds in the Trustless Work escrow contract on Stellar. The deal is bound to your wallet identity.
              </p>
              <Button onClick={deploy} disabled={busy} className="mt-5 bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
                {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {busy ? "Deploying…" : "Deploy Escrow"}
              </Button>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between">
          <Button variant="outline" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0 || busy} className="border-border">
            <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
          </Button>
          {step < STEPS.length - 1 && (
            <Button onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))} className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
              Continue <ArrowRight className="ml-1.5 h-4 w-4" />
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function Field({ label, value, onChange, readOnly }: { label: string; value: string; onChange: (v: string) => void; readOnly?: boolean }) {
  return (
    <label className="block">
      <div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        className="h-11 w-full rounded-xl border border-border bg-background/40 px-3 text-sm placeholder:text-muted-foreground focus:border-primary/50 focus:outline-none focus:ring-2 focus:ring-ring/40"
      />
    </label>
  );
}
