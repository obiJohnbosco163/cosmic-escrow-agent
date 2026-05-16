import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const TW_BASE_URL = "https://api.trustlesswork.com";

function authHeaders() {
  const apiKey = process.env.TRUSTLESS_WORK_API_KEY;
  const apiId = process.env.TRUSTLESS_WORK_API_ID;
  if (!apiKey) throw new Error("TRUSTLESS_WORK_API_KEY not configured");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${apiKey}`,
    ...(apiId ? { "X-API-ID": apiId } : {}),
  };
}

async function twPost<T = unknown>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${TW_BASE_URL}${path}`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  const text = await res.text();
  if (!res.ok) {
    console.error(`Trustless Work ${path} ${res.status}: ${text}`);
    throw new Error(`Trustless Work ${path} failed (${res.status}): ${text.slice(0, 240)}`);
  }
  return text ? (JSON.parse(text) as T) : ({} as T);
}

const milestoneSchema = z.object({
  description: z.string().min(1).max(200),
  amount: z.number().positive().optional(),
});

const deploySchema = z.object({
  dealId: z.string().uuid(),
  title: z.string().min(1).max(200),
  description: z.string().max(500).optional(),
  amount: z.number().positive(),
  platformFee: z.number().min(0).default(0.5),
  signerAddress: z.string().min(1).max(120),
  approverAddress: z.string().min(1).max(120),
  serviceProviderAddress: z.string().min(1).max(120),
  releaseSignerAddress: z.string().min(1).max(120),
  platformAddress: z.string().min(1).max(120),
  disputeResolverAddress: z.string().min(1).max(120),
  receiverAddress: z.string().min(1).max(120),
  trustlineAddress: z.string().min(1).max(120),
  milestones: z.array(milestoneSchema).min(1).max(20),
});

/** Step 1 — ask Trustless Work for an unsigned deploy transaction (XDR). */
export const deployUnsignedEscrow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => deploySchema.parse(d))
  .handler(async ({ data }) => {
    const json = await twPost<{ unsignedTransaction: string }>("/deployer/single-release", {
      signer: data.signerAddress,
      engagementId: data.dealId,
      title: data.title,
      description: data.description ?? data.title,
      roles: {
        approver: data.approverAddress,
        serviceProvider: data.serviceProviderAddress,
        platformAddress: data.platformAddress,
        releaseSigner: data.releaseSignerAddress,
        disputeResolver: data.disputeResolverAddress,
        receiver: data.receiverAddress,
      },
      amount: data.amount,
      platformFee: data.platformFee,
      milestones: data.milestones.map((m) => ({ description: m.description })),
      trustline: { address: data.trustlineAddress },
    });
    return { unsignedTransaction: json.unsignedTransaction };
  });

const submitSchema = z.object({ signedXdr: z.string().min(10) });

/** Step 2 — broadcast a wallet-signed transaction to Stellar via TW helper. */
export const submitSignedTransaction = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => submitSchema.parse(d))
  .handler(async ({ data }) => {
    const json = await twPost<Record<string, unknown>>("/helper/send-transaction", {
      signedXdr: data.signedXdr,
    });
    // TW returns escrow data including contractId on deploy
    const contractId =
      (json as { contractId?: string }).contractId ??
      (json as { escrow?: { contractId?: string } }).escrow?.contractId ??
      null;
    return { contractId, raw: json };
  });

const releaseSchema = z.object({
  contractId: z.string().min(1),
  releaseSigner: z.string().min(1),
});

/** Step 1 (release) — get an unsigned release-funds transaction. */
export const releaseFundsUnsigned = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => releaseSchema.parse(d))
  .handler(async ({ data }) => {
    const json = await twPost<{ unsignedTransaction: string }>(
      "/escrow/single-release/release-funds",
      { contractId: data.contractId, releaseSigner: data.releaseSigner },
    );
    return { unsignedTransaction: json.unsignedTransaction };
  });
