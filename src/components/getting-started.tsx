import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useBoot } from "@/components/app-shell";
import { useT } from "@/lib/lang";

function WelcomeArt() {
  return (
    <svg viewBox="0 0 280 180" className="h-40 w-auto" aria-hidden>
      <rect x="18" y="28" width="120" height="88" rx="10" fill="var(--color-surface)" stroke="var(--color-border-strong)" />
      <rect x="30" y="44" width="96" height="8" rx="4" fill="var(--color-brand)" />
      <rect x="30" y="62" width="72" height="5" rx="2" fill="var(--color-border-strong)" />
      <rect x="30" y="74" width="84" height="5" rx="2" fill="var(--color-border)" />
      <rect x="30" y="86" width="52" height="5" rx="2" fill="var(--color-border)" />
      <circle cx="196" cy="64" r="22" fill="var(--color-brand-soft)" />
      <circle cx="196" cy="58" r="12" fill="var(--color-rail)" />
      <path d="M168 148c8-36 16-48 28-48s20 12 28 48" fill="var(--color-rail)" />
      <rect x="188" y="92" width="22" height="36" rx="4" fill="var(--color-ink)" />
      <rect x="192" y="96" width="14" height="22" rx="2" fill="var(--color-surface)" />
      <circle cx="86" cy="148" r="10" fill="var(--color-info-soft)" />
      <circle cx="118" cy="140" r="8" fill="var(--color-warning-soft)" />
      <circle cx="248" cy="40" r="12" fill="var(--color-success-soft)" />
    </svg>
  );
}

export function GettingStarted() {
  const t = useT();
  const boot = useBoot();
  const remain = Math.max(0, boot.quota.emeteraiTotal - boot.quota.emeteraiUsed);

  return (
    <div className="px-4 py-5 md:px-8">
      <section className="flex flex-col items-center gap-6 rounded-lg border border-border bg-surface px-6 py-8 md:flex-row md:justify-between">
        <div className="max-w-lg">
          <h1 className="text-2xl font-semibold tracking-tight">{t.welcomeParaf}</h1>
          <p className="mt-2 text-sm text-muted">{t.welcomeBody}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Button asChild>
              <Link to="/send">{t.startUsing}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/esignature/$folder" params={{ folder: "getting-started" }}>
                {t.learnMore}
              </Link>
            </Button>
          </div>
        </div>
        <WelcomeArt />
      </section>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        <article className="rounded-lg border border-border bg-surface p-5">
          <div className="text-xs font-semibold tracking-wide text-brand uppercase">eSign</div>
          <h2 className="mt-2 font-semibold">Send, track, and sign documents</h2>
          <p className="mt-1 text-sm text-muted">Upload a file, place fields, and collect legally binding signatures.</p>
          <Button size="sm" className="mt-4" asChild>
            <Link to="/send">{t.startNow}</Link>
          </Button>
        </article>
        <article className="rounded-lg border border-border bg-surface p-5">
          <div className="text-xs font-semibold tracking-wide text-brand uppercase">eMeterai</div>
          <h2 className="mt-2 font-semibold">Buy and attach legally-valid stamps</h2>
          <p className="mt-1 text-sm text-muted">Quota remaining {remain.toLocaleString("en-US")} eMeterai.</p>
          <Button size="sm" className="mt-4" asChild>
            <Link to="/emeterai">{t.startNow}</Link>
          </Button>
        </article>
        <article className="rounded-lg border border-border bg-surface p-5">
          <div className="text-xs font-semibold tracking-wide text-brand uppercase">PSrE</div>
          <h2 className="mt-2 font-semibold">Verify identity for qualified signing</h2>
          <p className="mt-1 text-sm text-muted">Issue a PSrE or GlobalSign certificate from Settings.</p>
          <Button size="sm" className="mt-4" asChild>
            <Link to="/settings">{t.startNow}</Link>
          </Button>
        </article>
      </div>

      <h2 className="mt-8 mb-3 text-sm font-semibold">{t.learnHow}</h2>
      <div className="grid gap-4 md:grid-cols-3">
        {(
          [
            { title: "How to send a document", href: "/send" },
            { title: "How to request eMeterai", href: "/send?intent=emeterai" },
            { title: "How to set up your eSignature", href: "/settings" },
          ] as const
        ).map((item) => (
          <a key={item.title} href={item.href} className="overflow-hidden rounded-lg border border-border bg-surface hover:border-brand">
            <div className="grid h-32 place-items-center bg-rail text-surface/80">
              <span className="grid size-12 place-items-center rounded-full bg-surface/15 text-lg">▶</span>
            </div>
            <div className="p-3 text-sm font-medium">{item.title}</div>
          </a>
        ))}
      </div>

      <div className="mt-10 mb-6 text-center text-sm text-muted">
        <a href="/ai" className="font-medium text-brand hover:underline">
          {t.chatWithUs}
        </a>
      </div>
    </div>
  );
}
