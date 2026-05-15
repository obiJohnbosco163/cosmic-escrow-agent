import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const TW_BASE_URL = "https://api.trustlesswork.com";

const milestoneSchema = z.object({
  description: z.string().min(1).max(200),
  amount: z.number().positive(),
});

const createEscrowSchema = z.object({
  dealId: z.string().uuid(),
  title: z.string().min(1).max(200),
  amount: z.number().positive(),
  currency: z.string().min(1).max(10),
  buyerAddress: z.string().min(1).max(120),
  supplierAddress: z.string().min(1).max(120),
  milestones: z.array(milestoneSchema).min(1).max(20),
});

/**
 * Initialize a Trustless Work escrow contract for a deal.
 * Falls back to a deterministic mock contract id when the API is unreachable
 * (so the demo always shows a "deployed" state).
 */
export const initializeTrustlessEscrow = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d) => createEscrowSchema.parse(d))
  .handler(async ({ data, context }) => {
    const apiKey = process.env.TRUSTLESS_WORK_API_KEY;
    const apiId = process.env.TRUSTLESS_WORK_API_ID;

    const fallbackContractId = `tw_demo_${data.dealId.slice(0, 8)}`;

    if (!apiKey) {
      return { contractId: fallbackContractId, mode: "demo" as const };
    }

    try {
      const res = await fetch(`${TW_BASE_URL}/deployer/single-release`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
          ...(apiId ? { "X-API-ID": apiId } : {}),
        },
        body: JSON.stringify({
          engagementId: data.dealId,
          title: data.title,
          amount: data.amount,
          asset: data.currency,
          buyer: data.buyerAddress,
          serviceProvider: data.supplierAddress,
          platformAddress: data.buyerAddress,
          milestones: data.milestones,
          metadata: { ownerUserId: context.userId, source: "astrapilot" },
        }),
      });

      if (!res.ok) {
        console.warn("Trustless Work API non-OK:", res.status, await res.text());
        return { contractId: fallbackContractId, mode: "fallback" as const };
      }
      const json = await res.json();
      return {
        contractId: json.contractId ?? json.id ?? fallbackContractId,
        mode: "live" as const,
      };
    } catch (err) {
      console.error("Trustless Work request failed:", err);
      return { contractId: fallbackContractId, mode: "fallback" as const };
    }
  });
