import { cn } from "@/lib/utils";

export function ParafMark({ className, light }: { className?: string; light?: boolean }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-8", className)} aria-hidden>
      <rect width="32" height="32" rx="6" fill={light ? "#fff" : "#E85D04"} />
      <path
        d="M9 23 V9 h8.2 c3.3 0 5.4 1.9 5.4 4.7 0 2.9-2.1 4.8-5.5 4.8H13.2"
        fill="none"
        stroke={light ? "#E85D04" : "#fff"}
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ParafLogo({ compact, light }: { compact?: boolean; light?: boolean }) {
  return (
    <div className="flex items-center gap-2">
      <ParafMark light={light} />
      {compact ? null : (
        <div className={`text-[17px] font-semibold tracking-tight ${light ? "text-surface" : "text-ink"}`}>Paraf</div>
      )}
    </div>
  );
}
