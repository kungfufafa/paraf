import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ParafLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getPublicDocument, lookupEmeterai } from "@/lib/api";
import { lookupTsa } from "@/lib/integrations-api";
import { STATUS_LABEL } from "@/lib/types";
import { formatIdDate } from "@/lib/utils";

export const Route = createFileRoute("/verify")({
  validateSearch: (s: Record<string, unknown>): { serial?: string; token?: string } => ({
    serial: typeof s.serial === "string" ? s.serial : undefined,
    token: typeof s.token === "string" ? s.token : undefined,
  }),
  component: VerifyPage,
});

function VerifyPage() {
  const search = Route.useSearch();
  const [token, setToken] = useState(search.token ?? "");
  const [serial, setSerial] = useState(search.serial ?? "");
  const [msg, setMsg] = useState("");
  const [info, setInfo] = useState<{ title: string; status: string; completed: string | null; parties: string } | null>(
    null,
  );
  const [stamp, setStamp] = useState<{
    serial: string;
    legal: boolean;
    provider: string;
    hash: string;
    title: string;
    createdAt: string;
  } | null>(null);
  const [tsa, setTsa] = useState<{
    serial: string;
    title: string;
    createdAt: string;
    valid?: boolean;
    token: { genTime?: string; hash?: string; prev?: string; [k: string]: unknown };
  } | null>(null);

  async function checkSerial(sn: string) {
    setMsg("");
    setStamp(null);
    setTsa(null);
    const [row, tok] = await Promise.all([lookupEmeterai({ data: sn.trim() }), lookupTsa({ data: sn.trim() })]);
    if (row) setStamp(row);
    if (tok) setTsa(tok);
    if (!row && !tok) setMsg("Serial not found.");
  }

  useEffect(() => {
    if (search.serial) void checkSerial(search.serial);
    if (search.token) {
      void getPublicDocument({ data: search.token }).then((doc) => {
        if (!doc) return;
        setInfo({
          title: doc.title,
          status: STATUS_LABEL[doc.status].id,
          completed: doc.completedAt,
          parties: doc.recipients.map((r) => r.name).join(", "),
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.serial, search.token]);

  return (
    <div className="min-h-screen bg-bg">
      <header className="border-b border-border bg-surface px-5 py-4">
        <ParafLogo />
      </header>
      <main className="mx-auto max-w-lg px-5 py-12">
        <h1 className="text-2xl font-semibold">Verify document / e-Meterai / TSA</h1>
        <p className="mt-2 text-sm text-muted">Paste a signing token, an e-Meterai serial, or a Paraf TSA serial.</p>
        <div className="mt-6 space-y-3">
          <div className="flex gap-2">
            <Input value={token} onChange={(e) => setToken(e.target.value)} placeholder="tok_… signing token" />
            <Button
              onClick={async () => {
                setMsg("");
                setInfo(null);
                const doc = await getPublicDocument({ data: token.trim() });
                if (!doc) {
                  setMsg("Token not found.");
                  return;
                }
                setInfo({
                  title: doc.title,
                  status: STATUS_LABEL[doc.status].id,
                  completed: doc.completedAt,
                  parties: doc.recipients.map((r) => r.name).join(", "),
                });
              }}
            >
              Check
            </Button>
          </div>
          <div className="flex gap-2">
            <Input value={serial} onChange={(e) => setSerial(e.target.value)} placeholder="e-Meterai or TSA-… serial" />
            <Button variant="outline" onClick={() => void checkSerial(serial)}>
              Serial
            </Button>
          </div>
        </div>
        {msg ? <p className="mt-4 text-sm text-danger">{msg}</p> : null}
        {info ? (
          <div className="mt-6 rounded-xl border border-border bg-surface p-5">
            <div className="text-xs font-semibold tracking-wide text-success uppercase">Found in Paraf ledger</div>
            <h2 className="mt-2 font-semibold">{info.title}</h2>
            <p className="mt-1 text-sm">Status: {info.status}</p>
            <p className="text-sm text-muted">Parties: {info.parties}</p>
            {info.completed ? <p className="text-sm">Locked {formatIdDate(info.completed, true)}</p> : null}
          </div>
        ) : null}
        {stamp ? (
          <div className={`mt-6 rounded-xl border p-5 ${stamp.legal ? "border-success/40 bg-success-soft" : "border-warning/40 bg-warning-soft"}`}>
            <div className="text-xs font-semibold tracking-wide uppercase">
              {stamp.legal ? "Legally valid e-Meterai serial" : "DEMO stamp — not legally valid"}
            </div>
            <h2 className="mt-2 font-semibold">{stamp.serial}</h2>
            <p className="mt-1 text-sm">{stamp.title || "Document"}</p>
            <p className="text-xs text-muted">
              Provider: {stamp.provider} · Hash {stamp.hash.slice(0, 16)}… · {stamp.createdAt}
            </p>
          </div>
        ) : null}
        {tsa ? (
          <div className={`mt-6 rounded-xl border p-5 ${tsa.valid === false ? "border-danger/40 bg-danger-soft" : "border-success/40 bg-success-soft"}`}>
            <div className="text-xs font-semibold tracking-wide uppercase">
              {tsa.valid === false ? "TSA token failed HMAC check" : "Paraf TSA token — chain intact"}
            </div>
            <h2 className="mt-2 font-semibold font-mono text-sm">{tsa.serial}</h2>
            <p className="mt-1 text-sm">{tsa.title || "Event sealed"}</p>
            <p className="text-xs text-muted">
              {String(tsa.token.genTime ?? "")} · hash {String(tsa.token.hash || "").slice(0, 16)}… · prev {String(tsa.token.prev || "").slice(0, 8)}
            </p>
          </div>
        ) : null}
      </main>
    </div>
  );
}
