import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";

export const Route = createFileRoute("/app")({
  component: GuardedApp,
});

function GuardedApp() {
  // Wallet connection is optional — the app is accessible in demo mode
  // without an authenticated wallet. Features that require identity will
  // prompt for connection inline.
  return <AppShell />;
}
