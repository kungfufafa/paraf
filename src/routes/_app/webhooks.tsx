import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader, useBoot } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { emitTestEvent, getIntegrations, pingWebhook, saveWebhook } from "@/lib/integrations-api";
import { useT } from "@/lib/lang";
import { formatIdDate } from "@/lib/utils";

export const Route = createFileRoute("/_app/webhooks")({ component: WebhooksPage });

function WebhooksPage() {
  const t = useT();
  const boot = useBoot();
  const qc = useQueryClient();
  const { data, refetch } = useQuery({ queryKey: ["integrations"], queryFn: () => getIntegrations() });
  const [url, setUrl] = useState("");
  const events: string[] = data?.events ? [...data.events] : [];
  const [picked, setPicked] = useState<string[]>([]);
  const [freshSecret, setFreshSecret] = useState("");
  const [busy, setBusy] = useState(false);
  const hooks = data?.webhooks ?? [];
  const live = hooks.filter((h) => h.active).length + (data?.envWebhook.connected ? 1 : 0);
  const last = hooks[0]?.lastStatus ?? data?.deliveries[0]?.status ?? null;
  const ready = live > 0;
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const sample = useMemo(
    () =>
      JSON.stringify(
        {
          id: "evt_demo",
          event: "document.signed",
          ts: "1710000000",
          data: { documentId: "doc_…", title: "Offer letter", recipientId: "rc_…" },
        },
        null,
        2,
      ),
    [],
  );

  async function addHook() {
    if (!url.trim()) return;
    setBusy(true);
    try {
      const res = await saveWebhook({ data: { url: url.trim(), events: picked.length ? picked : events } });
      if (res.secret) {
        setFreshSecret(res.secret);
        toast.success("Webhook live. Copy the secret — shown once.");
      } else toast.success("Webhook saved");
      setUrl("");
      void refetch();
      void qc.invalidateQueries({ queryKey: ["boot"] });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Invalid URL");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader
        title={t.webhooks}
        subtitle="Paraf → your HRIS / n8n / Slack. Same plug-and-play pattern as eMeterai."
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              await emitTestEvent();
              toast.success("Test event written to the stream");
              void refetch();
            }}
          >
            Send test event
          </Button>
        }
      />
      <div className={`mx-4 mb-4 rounded-lg border px-4 py-3 text-sm md:mx-6 ${ready ? "border-success/40 bg-success-soft" : "border-warning/40 bg-warning-soft"}`}>
        {ready ? (
          <>
            Live. {live} endpoint{live === 1 ? "" : "s"} receive document events with HMAC-SHA256. Stream below always records, even if a URL is down.
          </>
        ) : (
          <>
            No URL yet — events still land in the stream (DEMO inbox). Paste a https URL to forward them live, the same way you connect an eMeterai API.
          </>
        )}
      </div>
      <div className="grid gap-3 px-4 md:grid-cols-3 md:px-6">
        <Kpi label="Endpoints" value={String(live)} hint="Active URLs + env PARAF_WEBHOOK_URL" />
        <Kpi label="Events captured" value={String(data?.stream.length ?? 0)} hint="Internal stream (always on)" />
        <Kpi label="Last delivery" value={last == null ? "—" : String(last)} hint="HTTP status of the newest POST" />
      </div>

      <div className="px-4 pt-8 md:px-6">
        <h2 className="mb-4 text-sm font-semibold">How to plug in a webhook</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { n: "1", title: "Paste a URL", body: "webhook.site, n8n, Zapier, Slack, or your ERP. HTTPS required." },
            { n: "2", title: "Pick events", body: "sent, signed, completed, declined, voided, reminded, approval.*" },
            { n: "3", title: "Send a document", body: "Paraf POSTs JSON with X-Paraf-Signature. Verify HMAC of timestamp.payload." },
          ].map((s) => (
            <article key={s.n} className="rounded-lg border border-border bg-surface p-4">
              <div className="mb-2 grid size-7 place-items-center rounded-full bg-brand text-xs font-bold text-white">{s.n}</div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-1 text-xs text-muted">{s.body}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="grid gap-4 p-4 md:grid-cols-[1.2fr_0.8fr] md:p-6">
        <section className="rounded-lg border border-border bg-surface p-5">
          <h2 className="mb-1 font-semibold">Plug-and-play connector</h2>
          <p className="mb-4 text-sm text-muted">
            Env: <code>PARAF_WEBHOOK_URL</code> + <code>PARAF_WEBHOOK_SECRET</code>. Workspace URL below wins in addition to env.
          </p>
          <Input placeholder="https://hooks.company.com/paraf" value={url} onChange={(e) => setUrl(e.target.value)} />
          <div className="mt-3 flex flex-wrap gap-2">
            {(events.length ? events : ["document.sent", "document.signed", "document.completed"]).map((ev) => {
              const catalog: string[] = events.length ? events : ["document.sent", "document.signed", "document.completed"];
              const current: string[] = picked.length ? picked : catalog;
              const on = current.includes(ev);
              return (
                <button
                  key={ev}
                  type="button"
                  onClick={() => setPicked(on ? current.filter((x) => x !== ev) : [...current, ev])}
                  className={`rounded-full border px-2.5 py-1 text-[11px] ${on ? "border-brand bg-brand-soft text-brand" : "border-border text-muted"}`}
                >
                  {ev}
                </button>
              );
            })}
          </div>
          <div className="mt-4 flex justify-end">
            <Button disabled={busy || !url.trim()} onClick={() => void addHook()}>
              Connect
            </Button>
          </div>
          {freshSecret ? (
            <p className="mt-3 rounded-md bg-warning-soft px-3 py-2 font-mono text-xs break-all">Secret (once): {freshSecret}</p>
          ) : null}
          {data?.envWebhook.connected ? (
            <div className="mt-4 rounded-md border border-success/40 bg-success-soft px-3 py-2 text-sm">
              Environment endpoint connected · {data.envWebhook.urlHint}
              <Button
                size="sm"
                variant="ghost"
                className="ml-2"
                onClick={() =>
                  void pingWebhook({ data: "env" }).then((r) => {
                    toast.success(r.status ? `Env ping HTTP ${r.status}` : "Ping sent");
                    void refetch();
                  })
                }
              >
                Ping
              </Button>
            </div>
          ) : null}
          <ul className="mt-4 space-y-2 text-sm">
            {hooks.map((h) => (
              <li key={h.id} className="flex items-center justify-between gap-2 rounded-md border border-border px-3 py-2">
                <div className="min-w-0">
                  <div className="truncate font-medium">{h.url}</div>
                  <div className="text-[11px] text-muted">
                    {h.events.join(", ")} · last {h.lastStatus ?? "—"} {h.lastError ? `· ${h.lastError}` : ""}
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      void pingWebhook({ data: h.id }).then((r) => {
                        toast.success(r.status ? `Ping HTTP ${r.status}` : "Ping sent");
                        void refetch();
                      })
                    }
                  >
                    Ping
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => void saveWebhook({ data: { id: h.id, url: h.url, remove: true } }).then(() => refetch())}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
            {!hooks.length && !data?.envWebhook.connected ? <li className="text-sm text-muted">No external URL yet.</li> : null}
          </ul>
        </section>

        <section className="rounded-lg border border-border bg-surface p-5">
          <h2 className="mb-1 font-semibold">Verify a delivery</h2>
          <p className="mb-3 text-sm text-muted">HMAC-SHA256 of <code>{"{timestamp}.{rawBody}"}</code> using the endpoint secret.</p>
          <pre className="overflow-x-auto rounded-md bg-surface-2 p-3 text-[11px] leading-relaxed">{sample}</pre>
          <p className="mt-3 text-[11px] text-muted">
            Headers: X-Paraf-Event, X-Paraf-Timestamp, X-Paraf-Signature: sha256=…
          </p>
          <p className="mt-3 text-[11px] text-muted">Inbound the other way (HRIS → Paraf) uses a BYOK API key at {origin}/api/v1/hooks</p>
          <Button size="sm" variant="outline" className="mt-3" asChild>
            <Link to="/byok">Open BYOK</Link>
          </Button>
        </section>
      </div>

      <div className="px-4 pb-8 md:px-6">
        <h2 className="mb-3 text-sm font-semibold">Event stream</h2>
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          <table className="w-full text-sm">
            <thead className="text-left text-[12px] font-medium text-muted">
              <tr className="border-b border-border">
                <th className="px-4 py-3">Event</th>
                <th className="px-4 py-3">When</th>
                <th className="px-4 py-3">Payload</th>
              </tr>
            </thead>
            <tbody>
              {(data?.stream ?? []).length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-4 py-12 text-center text-sm text-muted">
                    Send a document — or click Send test event. Workspace: {boot.company.name}.
                  </td>
                </tr>
              ) : (
                data!.stream.map((e) => (
                  <tr key={e.id} className="border-t border-border align-top">
                    <td className="px-4 py-3 font-medium">{e.event}</td>
                    <td className="px-4 py-3 text-muted">{formatIdDate(e.createdAt, true)}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-muted break-all">{e.payload.slice(0, 180)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {(data?.deliveries ?? []).length ? (
          <div className="mt-4">
            <div className="text-xs font-semibold tracking-wide text-muted uppercase">Outbound POSTs</div>
            <ul className="mt-2 space-y-1 text-[11px] text-muted">
              {data!.deliveries.slice(0, 12).map((d) => (
                <li key={d.id}>
                  {d.event} · HTTP {d.status ?? "—"} {d.error ? `· ${d.error}` : ""} · {formatIdDate(d.createdAt, true)}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Kpi({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <article className="rounded-lg border border-border bg-surface p-4">
      <div className="text-[12px] text-muted">{label}</div>
      <div className="mt-1 text-2xl font-semibold">{value}</div>
      <p className="mt-2 text-[11px] text-muted">{hint}</p>
    </article>
  );
}
