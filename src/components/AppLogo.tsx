import logo from "@/assets/astrapilot-logo.png";
import { cn } from "@/lib/utils";

export function AppLogo({ size = 36, withWordmark = true, className }: { size?: number; withWordmark?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <img
        src={logo}
        alt="AstraPilot"
        width={size}
        height={size}
        className="rounded-[10px] shadow-[0_8px_24px_-12px_oklch(0.62_0.22_18/60%)]"
      />
      {withWordmark && (
        <div className="flex flex-col leading-none">
          <span className="font-extrabold tracking-tight text-foreground" style={{ fontSize: size * 0.55 }}>
            <span className="text-gradient-primary">Astra</span>Pilot
          </span>
          <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Autonomous Trade Agent
          </span>
        </div>
      )}
    </div>
  );
}
