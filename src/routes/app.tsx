import { createFileRoute, Navigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/app")({
  component: GuardedApp,
});

function GuardedApp() {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="text-sm text-muted-foreground">Loading workspace…</div>
      </div>
    );
  }
  if (!session) return <Navigate to="/onboarding" />;
  return <AppShell />;
}
