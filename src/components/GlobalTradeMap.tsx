import { tradeRoutes } from "@/lib/mock-data";

/**
 * Decorative animated world map of trade routes.
 * Stylized continents with glowing arcs between trade nodes.
 */
export function GlobalTradeMap({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border bg-[radial-gradient(ellipse_at_center,oklch(0.18_0.02_18/40%),transparent_70%)] ${className}`}>
      <div className="absolute inset-0 grid-overlay opacity-40" />
      <svg viewBox="0 0 960 480" className="relative h-full w-full">
        <defs>
          <radialGradient id="globe-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.62 0.22 18 / 35%)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <linearGradient id="arc" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.7 0.25 22 / 0%)" />
            <stop offset="50%" stopColor="oklch(0.7 0.25 22 / 90%)" />
            <stop offset="100%" stopColor="oklch(0.7 0.25 22 / 0%)" />
          </linearGradient>
        </defs>

        <ellipse cx="480" cy="240" rx="430" ry="200" fill="url(#globe-glow)" />

        {/* Stylized landmasses (abstract blobs) */}
        <g fill="oklch(0.4 0.05 18 / 18%)" stroke="oklch(0.6 0.15 18 / 35%)" strokeWidth="0.8">
          <path d="M120,160 Q180,120 250,140 T340,170 Q360,210 320,250 T240,260 Q170,250 130,220 Z" />
          <path d="M380,150 Q450,110 520,130 T610,160 Q620,220 560,250 T440,260 Q380,230 380,180 Z" />
          <path d="M620,160 Q700,130 800,160 T880,210 Q860,260 780,270 T650,260 Q610,220 620,180 Z" />
          <path d="M260,290 Q320,280 360,310 T380,380 Q340,410 290,400 T240,360 Z" />
          <path d="M540,290 Q600,280 640,320 T620,380 Q570,400 540,380 T520,330 Z" />
          <path d="M740,290 Q800,290 830,320 T810,360 Q770,370 740,350 Z" />
        </g>

        {/* Latitude lines */}
        <g stroke="oklch(1 0 0 / 4%)" fill="none">
          {[120, 180, 240, 300, 360].map((y) => (
            <ellipse key={y} cx="480" cy={y} rx="420" ry={(y - 80) / 4 + 40} />
          ))}
        </g>

        {/* Trade route arcs */}
        {tradeRoutes.map((r, i) => {
          const mx = (r.from.x + r.to.x) / 2;
          const my = Math.min(r.from.y, r.to.y) - 80;
          return (
            <g key={i}>
              <path
                d={`M${r.from.x},${r.from.y} Q${mx},${my} ${r.to.x},${r.to.y}`}
                fill="none"
                stroke="url(#arc)"
                strokeWidth={1.4 + r.intensity}
                opacity={0.7}
              />
              <circle cx={r.from.x} cy={r.from.y} r="4" fill="oklch(0.7 0.25 22)">
                <animate attributeName="r" values="3;6;3" dur="2.4s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
                <animate attributeName="opacity" values="1;0.4;1" dur="2.4s" repeatCount="indefinite" begin={`${i * 0.3}s`} />
              </circle>
              <circle cx={r.to.x} cy={r.to.y} r="3" fill="oklch(0.95 0.02 250)" />
              <circle r="3" fill="oklch(0.95 0.02 250)">
                <animateMotion
                  dur={`${4 + i * 0.5}s`}
                  repeatCount="indefinite"
                  path={`M${r.from.x},${r.from.y} Q${mx},${my} ${r.to.x},${r.to.y}`}
                />
              </circle>
              <text x={r.from.x + 8} y={r.from.y - 6} fontSize="9" fill="oklch(0.85 0.05 250 / 70%)" fontFamily="JetBrains Mono">
                {r.from.label}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
