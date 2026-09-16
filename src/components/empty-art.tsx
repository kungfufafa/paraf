import { Button } from "@/components/ui/button";

export function DeskEmpty({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" className={className} aria-hidden>
      <ellipse cx="160" cy="178" rx="110" ry="10" fill="var(--color-surface-2)" />
      <rect x="36" y="128" width="248" height="12" rx="2" fill="var(--color-border-strong)" />
      <rect x="48" y="140" width="14" height="40" rx="2" fill="var(--color-border)" />
      <rect x="258" y="140" width="14" height="40" rx="2" fill="var(--color-border)" />
      <rect x="118" y="86" width="84" height="52" rx="6" fill="var(--color-surface)" stroke="var(--color-border-strong)" />
      <rect x="128" y="96" width="64" height="6" rx="3" fill="var(--color-brand)" />
      <rect x="128" y="108" width="48" height="4" rx="2" fill="var(--color-border-strong)" />
      <rect x="128" y="118" width="36" height="4" rx="2" fill="var(--color-border)" />
      <circle cx="92" cy="78" r="16" fill="var(--color-brand-soft)" />
      <circle cx="92" cy="74" r="9" fill="var(--color-rail)" />
      <path d="M70 128c6-28 12-38 22-38s16 10 22 38" fill="var(--color-rail)" />
      <circle cx="228" cy="82" r="15" fill="var(--color-info-soft)" />
      <circle cx="228" cy="78" r="8" fill="var(--color-info)" />
      <path d="M208 128c5-24 11-32 20-32s15 8 20 32" fill="var(--color-info)" />
      <rect x="214" y="98" width="16" height="26" rx="3" fill="var(--color-ink)" />
    </svg>
  );
}

export function TemplateEmpty({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 200" className={className} aria-hidden>
      <rect x="70" y="36" width="72" height="96" rx="8" fill="var(--color-surface-2)" stroke="var(--color-border)" />
      <rect x="124" y="24" width="80" height="108" rx="8" fill="var(--color-surface)" stroke="var(--color-border-strong)" />
      <rect x="138" y="40" width="52" height="7" rx="3" fill="var(--color-brand)" />
      <rect x="138" y="56" width="52" height="4" rx="2" fill="var(--color-border-strong)" />
      <rect x="138" y="68" width="36" height="4" rx="2" fill="var(--color-border)" />
      <circle cx="232" cy="86" r="18" fill="var(--color-brand-soft)" />
      <circle cx="232" cy="80" r="10" fill="var(--color-rail)" />
      <path d="M208 150c7-32 14-42 24-42s17 10 24 42" fill="var(--color-rail)" />
      <rect x="224" y="102" width="18" height="30" rx="3" fill="var(--color-ink)" />
    </svg>
  );
}

export function ContactEmpty({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 320 180" className={className} aria-hidden>
      <circle cx="160" cy="64" r="28" fill="var(--color-brand-soft)" />
      <circle cx="160" cy="56" r="14" fill="var(--color-rail)" />
      <path d="M118 140c10-36 22-48 42-48s32 12 42 48" fill="var(--color-rail)" />
      <circle cx="96" cy="88" r="14" fill="var(--color-info-soft)" />
      <circle cx="224" cy="88" r="14" fill="var(--color-warning-soft)" />
    </svg>
  );
}

export function OnboardFigure({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 120" className={className} aria-hidden>
      <rect x="18" y="28" width="70" height="52" rx="6" fill="var(--color-surface-2)" stroke="var(--color-border-strong)" />
      <rect x="26" y="38" width="54" height="6" rx="3" fill="var(--color-brand)" />
      <rect x="26" y="50" width="40" height="4" rx="2" fill="var(--color-border-strong)" />
      <rect x="26" y="60" width="48" height="4" rx="2" fill="var(--color-border)" />
      <circle cx="118" cy="46" r="16" fill="var(--color-brand-soft)" />
      <circle cx="118" cy="42" r="9" fill="var(--color-rail)" />
      <path d="M98 96c6-20 12-28 20-28s14 8 20 28" fill="var(--color-rail)" />
    </svg>
  );
}

export function Onboarding({
  steps,
  onStart,
  startLabel,
  learnLabel,
}: {
  steps: { n: string; title: string; body: string }[];
  onStart: () => void;
  startLabel: string;
  learnLabel: string;
}) {
  return (
    <div className="flex min-h-[calc(100vh-48px)] flex-col items-center justify-center px-6 py-12">
      <div className={`grid w-full max-w-5xl gap-5 ${steps.length > 3 ? "md:grid-cols-4" : "md:grid-cols-3"}`}>
        {steps.map((s) => (
          <article key={s.n} className="rounded-lg border border-border bg-surface p-5 text-center">
            <div className="mx-auto mb-3 grid size-8 place-items-center rounded-full bg-brand text-sm font-bold text-white">{s.n}</div>
            <OnboardFigure className="mx-auto h-24 w-auto" />
            <h2 className="mt-2 font-semibold">{s.title}</h2>
            <p className="mt-1 text-xs text-muted">{s.body}</p>
          </article>
        ))}
      </div>
      <div className="mt-8 flex gap-3">
        <Button onClick={onStart}>{startLabel}</Button>
        <Button variant="outline" asChild>
          <a href="/ai">{learnLabel}</a>
        </Button>
      </div>
    </div>
  );
}
