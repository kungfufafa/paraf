import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader, useBoot } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createApiKey,
  getIntegrations,
  revokeApiKey,
  saveAiConnector,
  saveByok,
  testAiConnector,
  testByok,
} from "@/lib/integrations-api";
import { useT } from "@/lib/lang";

export const Route = createFileRoute("/_app/byok")({ component: ByokPage });

function ByokPage() {
  const t = useT();
  const boot = useBoot();
  const qc = useQueryClient();
  const { data, refetch } = useQuery({ queryKey: ["integrations"], queryFn: () => getIntegrations() });
  const [secret, setSecret] = useState("");
  const [pem, setPem] = useState("");
  const [shown, setShown] = useState("");
  const [keyName, setKeyName] = useState("HRIS");
  const [freshKey, setFreshKey] = useState("");
  const [provider, setProvider] = useState("xai");
  const [apiKey, setApiKey] = useState("");
  const [model, setModel] = useState(data?.ai.model || "");
  const [baseUrl, setBaseUrl] = useState("");
  const [busy, setBusy] = useState(false);
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  useEffect(() => {
    if (!data) return;
    setProvider(data.ai.provider);
    setModel(data.ai.model);
  }, [data]);

  const signing = data?.byok.legalReady;
  const inbound = (data?.apiKeys.length ?? 0) > 0;
  const ai = data?.ai.connected;
  const ready = Boolean(signing || inbound || ai);

  return (
    <div>
      <PageHeader
        title={t.byok}
        subtitle="Bring your own signing key, inbound API key, and AI key. Same connector pattern as eMeterai."
      />
      <div className={`mx-4 mb-4 rounded-lg border px-4 py-3 text-sm md:mx-6 ${ready ? "border-success/40 bg-success-soft" : "border-warning/40 bg-warning-soft"}`}>
        {ready ? (
          <>
            Connected. TSA seals with {signing ? "your HMAC key" : "the platform key"} · inbound REST {inbound ? "on" : "off"} · AI{" "}
            {ai ? `${data?.ai.provider}/${data?.ai.model}` : "local scan"}.
          </>
        ) : (
          <>
            Nothing plugged in yet. Generate a signing key (or paste one), mint an inbound <code>paraf_live_</code> key, and/or paste an AI provider key.
            Until then TSA still seals with the platform secret — DEMO for your own key.
          </>
        )}
      </div>
      <div className="grid gap-3 px-4 md:grid-cols-3 md:px-6">
        <Kpi label="Signing key" value={signing ? "Live" : "Demo"} hint={data?.byok.keyHint || "Platform HMAC until you paste a key"} />
        <Kpi label="Inbound keys" value={String(data?.apiKeys.length ?? 0)} hint="HRIS → Paraf Bearer paraf_live_…" />
        <Kpi label="AI review" value={ai ? data!.ai.provider : "Off"} hint={data?.ai.keyHint || "Paste OpenAI / xAI / Claude / Groq"} />
      </div>

      <div className="px-4 pt-8 md:px-6">
        <h2 className="mb-4 text-sm font-semibold">How to bring your own key</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { n: "1", title: "Signing secret", body: "Generate or paste an HMAC secret. Every send/sign/void seals a TSA token with it." },
            { n: "2", title: "Inbound API key", body: "Mint paraf_live_… and POST documents from payroll / HRIS / n8n." },
            { n: "3", title: "AI key", body: "Paste a provider key. Contract review on Help uses it automatically." },
          ].map((s) => (
            <article key={s.n} className="rounded-lg border border-border bg-surface p-4">
              <div className="mb-2 grid size-7 place-items-center rounded-full bg-brand text-xs font-bold text-white">{s.n}</div>
              <h3 className="font-semibold">{s.title}</h3>
              <p className="mt-1 text-xs text-muted">{s.body}</p>
            </article>
          ))}
        </div>
      </div>

      <div className="grid gap-4 p-4 md:grid-cols-2 md:p-6">
        <section className="rounded-lg border border-border bg-surface p-5">
          <h2 className="font-semibold">Signing key (TSA)</h2>
          <p className="mt-1 mb-3 text-sm text-muted">
            Env plug-and-play: <code>PARAF_BYOK_SECRET</code>. Optional PEM is stored as a fingerprint on the workspace.
          </p>
          <label className="mb-1 block text-xs text-muted">HMAC secret</label>
          <Input type="password" value={secret} onChange={(e) => setSecret(e.target.value)} placeholder={data?.byok.keyHint || "paraf_byok_…"} />
          <label className="mt-3 mb-1 block text-xs text-muted">PEM certificate (optional)</label>
          <textarea
            className="h-24 w-full rounded-md border border-border px-3 py-2 font-mono text-xs"
            value={pem}
            onChange={(e) => setPem(e.target.value)}
            placeholder={"-----BEGIN CERTIFICATE-----\n…"}
          />
          {data?.byok.pemHint ? <p className="mt-1 text-[11px] text-muted">{data.byok.pemHint} {data.byok.fingerprint ? `· fp ${data.byok.fingerprint}` : ""}</p> : null}
          {shown ? <p className="mt-3 rounded-md bg-warning-soft px-3 py-2 font-mono text-xs break-all">Generated (once): {shown}</p> : null}
          <div className="mt-4 flex flex-wrap justify-end gap-2">
            <Button
              variant="outline"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  const res = await saveByok({ data: { generate: true } });
                  if (res.secret) setShown(res.secret);
                  toast.success("Workspace key generated");
                  void refetch();
                  void qc.invalidateQueries({ queryKey: ["boot"] });
                } finally {
                  setBusy(false);
                }
              }}
            >
              Generate
            </Button>
            <Button
              variant="outline"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  const ping = await testByok();
                  if (ping.ok) toast.success(ping.message);
                  else toast.error(ping.message);
                  void refetch();
                } finally {
                  setBusy(false);
                }
              }}
            >
              Test connection
            </Button>
            <Button
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await saveByok({ data: { secret, pem } });
                  toast.success("BYOK saved");
                  setSecret("");
                  void refetch();
                  void qc.invalidateQueries({ queryKey: ["boot"] });
                } finally {
                  setBusy(false);
                }
              }}
            >
              Save
            </Button>
          </div>
        </section>

        <section className="rounded-lg border border-border bg-surface p-5">
          <h2 className="font-semibold">Inbound REST (HRIS → Paraf)</h2>
          <p className="mt-1 mb-3 text-sm text-muted">Authorization: Bearer paraf_live_… Workspace {boot.company.name}.</p>
          <ul className="mb-3 list-disc space-y-1 pl-5 font-mono text-[12px]">
            <li>POST {origin}/api/v1/hooks</li>
            <li>POST {origin}/api/v1/documents</li>
            <li>GET {origin}/api/v1/documents</li>
            <li>GET {origin}/api/v1/events</li>
            <li>GET {origin}/api/v1/openapi</li>
          </ul>
          <div className="mb-3 flex gap-2">
            <Input value={keyName} onChange={(e) => setKeyName(e.target.value)} />
            <Button
              onClick={async () => {
                const res = await createApiKey({ data: { name: keyName } });
                setFreshKey(res.key);
                toast.success("Copy this key now — shown once");
                void refetch();
              }}
            >
              Create key
            </Button>
          </div>
          {freshKey ? <p className="mb-3 rounded-md bg-warning-soft px-3 py-2 font-mono text-xs break-all">{freshKey}</p> : null}
          <ul className="space-y-1 text-sm">
            {(data?.apiKeys ?? []).map((k) => (
              <li key={k.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                <span>
                  {k.name} · {k.key_prefix}
                </span>
                <Button size="sm" variant="ghost" onClick={() => void revokeApiKey({ data: k.id }).then(() => refetch())}>
                  Revoke
                </Button>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-border bg-surface p-5 md:col-span-2">
          <h2 className="font-semibold">AI provider key</h2>
          <p className="mt-1 mb-3 text-sm text-muted">Used by Help → Analyze. Switch provider without leaving this page.</p>
          <div className="grid gap-3 md:grid-cols-3">
            <select
              className="h-10 rounded-md border border-border px-3 text-sm"
              value={provider}
              onChange={(e) => setProvider(e.target.value)}
            >
              <option value="xai">xAI Grok</option>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic Claude</option>
              <option value="google">Google Gemini</option>
              <option value="groq">Groq</option>
              <option value="custom">Custom OpenAI-compatible</option>
            </select>
            <Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder={data?.ai.keyHint || "sk-…"} />
            <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="model" />
          </div>
          {provider === "custom" ? (
            <Input className="mt-3" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://api.example.com/v1/chat/completions" />
          ) : null}
          <div className="mt-4 flex justify-end gap-2">
            <Button
              variant="outline"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await saveAiConnector({ data: { provider, apiKey, baseUrl, model } });
                  const ping = await testAiConnector();
                  if (ping.ok) toast.success(`AI ok — ${ping.provider} / ${ping.text.slice(0, 80)}`);
                  else toast.error(ping.error || "AI test failed");
                  void refetch();
                } finally {
                  setBusy(false);
                }
              }}
            >
              Test
            </Button>
            <Button
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await saveAiConnector({ data: { provider, apiKey, baseUrl, model } });
                  toast.success("AI key saved");
                  void refetch();
                } finally {
                  setBusy(false);
                }
              }}
            >
              Save
            </Button>
          </div>
        </section>
      </div>
      <p className="px-4 pb-8 text-sm text-muted md:px-6">
        Outbound events live on{" "}
        <Link to="/webhooks" className="font-medium text-brand underline">
          Webhooks
        </Link>
        . eMeterai distributor token is still under Settings → eMeterai API.
      </p>
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
