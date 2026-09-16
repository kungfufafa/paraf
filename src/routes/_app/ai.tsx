import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { PageHeader, useBoot } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { analyzeDocument, getDocument, listDocuments } from "@/lib/api";
import { getIntegrations } from "@/lib/integrations-api";
import type { DocContent } from "@/lib/types";

export const Route = createFileRoute("/_app/ai")({
  validateSearch: (s: Record<string, unknown>): { id?: string } => ({
    id: typeof s.id === "string" ? s.id : undefined,
  }),
  component: HelpPage,
});

const GUIDES = [
  {
    title: "Send a document",
    body: "Upload → add recipients → place signature fields → send. Recipients get a signing link.",
    to: "/send",
    cta: "Upload now",
  },
  {
    title: "Sign a document",
    body: "Open Need to sign, click Sign, agree to the terms, Start signing, pick an eSignature, then Finish.",
    folder: "need-to-sign",
    cta: "Go to Need to sign",
  },
  {
    title: "Request eMeterai",
    body: "Place a stamp while sending. Quota deducts from this workspace.",
    to: "/send?intent=emeterai",
    cta: "Request eMeterai",
  },
  {
    title: "Approvals",
    body: "Send a request before a document goes out. Approvers can approve or reject from the dashboard.",
    to: "/approvals",
    cta: "Open Approvals",
  },
  {
    title: "Templates",
    body: "Reuse a template, then Create document to jump into the send wizard with fields already placed.",
    to: "/templates",
    cta: "Open Templates",
  },
  {
    title: "eSignature settings",
    body: "Draw, type, or upload a signature once. It appears when you sign documents.",
    to: "/settings",
    cta: "Open Settings",
  },
  {
    title: "Webhooks",
    body: "Paste your HRIS / n8n URL. Send, sign, and void events POST out with HMAC — same plug-and-play as eMeterai.",
    to: "/webhooks",
    cta: "Connect webhook",
  },
  {
    title: "BYOK",
    body: "Bring your own signing secret, inbound API key, and AI provider key. Test, then every document uses them.",
    to: "/byok",
    cta: "Connect BYOK",
  },
];

function HelpPage() {
  const { id } = Route.useSearch();
  const boot = useBoot();
  const nav = useNavigate();
  const { data: docs = [] } = useQuery({
    queryKey: ["docs", "all"],
    queryFn: () => listDocuments({ data: { folder: "all-inbox" } }),
  });
  const { data: integ } = useQuery({ queryKey: ["integrations"], queryFn: () => getIntegrations() });
  const [picked, setPicked] = useState(id);
  const [out, setOut] = useState("");
  const [local, setLocal] = useState<{ summary: string; findings: { level: string; title: string; detail: string }[] } | null>(
    null,
  );
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [provider, setProvider] = useState("");

  async function run() {
    const target = picked || docs[0]?.id;
    if (!target) return;
    setBusy(true);
    setOut("");
    setLocal(null);
    setErr("");
    try {
      const packed = await getDocument({ data: target });
      if (!packed?.document) return;
      const res = await analyzeDocument({
        data: { title: packed.document.title, content: packed.document.content as DocContent },
      });
      setProvider(res.provider);
      if (!res.ok && res.error && res.error !== "unavailable") setErr(res.error);
      const pack = res.local ?? { summary: res.text ?? "", findings: [] as { level: string; title: string; detail: string }[] };
      setLocal(pack);
      setOut(pack.summary || res.text || "");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <PageHeader title="Help" subtitle={`Hi ${boot.user.name.split(" ")[0]} — pick a flow and run it.`} />
      <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 md:p-6">
        {GUIDES.map((g) => (
          <article key={g.title} className="flex flex-col rounded-lg border border-border bg-surface p-4">
            <h2 className="font-semibold">{g.title}</h2>
            <p className="mt-1 flex-1 text-sm text-muted">{g.body}</p>
            <Button
              size="sm"
              className="mt-4"
              onClick={() => {
                if (g.folder) nav({ to: "/esignature/$folder", params: { folder: g.folder } });
                else window.location.href = g.to!;
              }}
            >
              {g.cta}
            </Button>
          </article>
        ))}
      </div>
      <div className="mx-4 mb-8 rounded-lg border border-border bg-surface p-4 md:mx-6">
        <h2 className="font-semibold">AI contract review</h2>
        <p className="mt-1 text-sm text-muted">
          {integ?.ai.connected
            ? `Using ${integ.ai.provider} / ${integ.ai.model}. Switch keys in Settings → AI review.`
            : "No remote key — local clause scan still runs. Plug xAI, OpenAI, Anthropic, Gemini, Groq, or a custom URL in Settings → AI review."}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <select
            className="h-9 min-w-56 rounded-md border border-border px-2 text-sm"
            value={picked ?? ""}
            onChange={(e) => setPicked(e.target.value)}
          >
            <option value="">Pick a document</option>
            {docs.map((d) => (
              <option key={d.id} value={d.id}>
                {d.title}
              </option>
            ))}
          </select>
          <Button size="sm" disabled={busy || !docs.length} onClick={() => void run()}>
            {busy ? "Analyzing…" : "Analyze"}
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link to="/esignature/$folder" params={{ folder: "all-inbox" }}>
              Back to inbox
            </Link>
          </Button>
        </div>
        {err ? <p className="mt-3 text-sm text-danger">{err}</p> : null}
        {provider ? <p className="mt-2 text-[11px] text-muted">Provider: {provider}</p> : null}
        {out ? <p className="mt-3 text-sm whitespace-pre-wrap">{out}</p> : null}
        {local?.findings?.length ? (
          <ul className="mt-2 space-y-1 text-sm">
            {local.findings.map((f) => (
              <li key={f.title + f.detail.slice(0, 24)}>
                <strong>{f.level}</strong> — {f.title}: {f.detail}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
