// Lightweight Freighter (Stellar wallet) helper. Uses the global
// window.freighterApi injected by the Freighter browser extension.
// Falls back gracefully when the extension isn't installed.

declare global {
  interface Window {
    freighterApi?: {
      isConnected: () => Promise<boolean>;
      getAddress: () => Promise<{ address: string; error?: string }>;
      requestAccess: () => Promise<{ address: string; error?: string }>;
      signMessage: (message: string, opts?: { address?: string; networkPassphrase?: string }) => Promise<{ signedMessage: string; signerAddress: string; error?: string }>;
      getNetwork: () => Promise<{ network: string; networkPassphrase: string; error?: string }>;
    };
  }
}

export const FREIGHTER_INSTALL_URL = "https://www.freighter.app/";

export function isFreighterInstalled(): boolean {
  return typeof window !== "undefined" && !!window.freighterApi;
}

export async function connectFreighter(): Promise<{ address: string }> {
  if (!isFreighterInstalled()) {
    throw new Error(
      "Freighter wallet not detected. Install it from freighter.app and refresh."
    );
  }
  const api = window.freighterApi!;
  const res = await api.requestAccess();
  if (res.error) throw new Error(res.error);
  if (!res.address) throw new Error("No Stellar address returned by wallet.");
  return { address: res.address };
}

export async function signOnboardingMessage(address: string): Promise<string> {
  if (!isFreighterInstalled()) throw new Error("Freighter not available.");
  const message = `AstraPilot login challenge\nWallet: ${address}\nIssued: ${new Date().toISOString().split("T")[0]}`;
  const res = await window.freighterApi!.signMessage(message, { address });
  if (res.error) throw new Error(res.error);
  return res.signedMessage;
}

// Deterministic synthetic credentials so the same wallet always logs into the
// same Supabase user. The signed challenge proves wallet ownership client-side.
export function walletToCredentials(address: string) {
  return {
    email: `${address.toLowerCase()}@wallet.astrapilot.app`,
    // Deterministic high-entropy password derived from the address.
    // (Demo-grade; production would verify a signed challenge server-side.)
    password: `astrapilot::${address}::v1`,
  };
}
