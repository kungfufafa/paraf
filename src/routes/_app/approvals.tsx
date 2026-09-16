import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/app-shell";
import { Onboarding } from "@/components/empty-art";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { decideApproval, listApprovals, listDocuments, requestApproval, saveApprovalTemplate } from "@/lib/api";
import { useT } from "@/lib/lang";

export const Route = createFileRoute("/_app/approvals")({ component: ApprovalsPage });

function ApprovalsPage() {
  const t = useT();
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["approvals"], queryFn: () => listApprovals() });
  const { data: docs = [] } = useQuery({
    queryKey: ["docs", "all"],
    queryFn: () => listDocuments({ data: { folder: "all-inbox" } }),
  });
  const has = (data?.approvals ?? []).length > 0;
  const [started, setStarted] = useState(false);
  const [tab, setTab] = useState<"requests" | "settings">("requests");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    documentId: "",
    name: "Document approval",
    approverName: "",
    approverEmail: "",
    mode: "all",
    message: "",
  });
  const [tplName, setTplName] = useState("");
  const [tplLayers, setTplLayers] = useState("Legal, Finance, Direksi");
  const [tplMode, setTplMode] = useState<"all" | "any">("all");

  useEffect(() => {
    if (!form.documentId && docs[0]) setForm((f) => ({ ...f, documentId: docs[0]!.id }));
  }, [docs, form.documentId]);

  if (!started && !has) {
    return (
      <Onboarding
        steps={[
          { n: "1", title: "Set up approval flow", body: "Choose who must approve before a document is sent." },
          { n: "2", title: "Set up approval template", body: "Reuse layers so every contract follows the same path." },
          { n: "3", title: "Set up approval request", body: "Send a request and track each decision in one place." },
        ]}
        onStart={() => {
          setStarted(true);
          setOpen(true);
        }}
        startLabel={t.startNow}
        learnLabel={t.learnMore}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title={t.approvals}
        actions={
          <Button size="sm" onClick={() => setOpen(true)}>
            Request approval
          </Button>
        }
      />
      <div className="flex gap-1 border-b border-border px-4 md:px-6">
        {(["requests", "settings"] as const).map((k) => (
          <button
            key={k}
            type="button"
            className={`border-b-2 px-3 py-2 text-sm ${tab === k ? "border-brand font-medium text-brand" : "border-transparent text-muted"}`}
            onClick={() => setTab(k)}
          >
            {k === "requests" ? "Requests" : "Settings"}
          </button>
        ))}
      </div>
      {tab === "requests" ? (
        <div className="grid gap-4 p-4 lg:grid-cols-2 md:p-6">
          {(data?.approvals ?? []).map((a) => (
            <article key={a.id} className="rounded-lg border border-border bg-surface p-4">
              <div className="text-xs text-muted">
                Layer {a.layer} · {a.mode === "all" ? "All must approve" : "Any can approve"}
              </div>
              <h2 className="font-semibold">{a.documentTitle || a.name}</h2>
              <p className="text-sm text-muted">
                {a.approverName} · {a.approverEmail} · {a.status}
              </p>
              {a.note ? <p className="mt-1 text-xs text-muted">{a.note}</p> : null}
              {a.status === "pending" ? (
                <div className="mt-3 flex gap-2">
                  <Button
                    size="sm"
                    onClick={async () => {
                      await decideApproval({ data: { id: a.id, status: "approved" } });
                      toast.success("Approved");
                      void qc.invalidateQueries();
                    }}
                  >
                    Approve
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={async () => {
                      await decideApproval({ data: { id: a.id, status: "rejected", note: "Rejected from dashboard" } });
                      toast.success("Rejected");
                      void qc.invalidateQueries();
                    }}
                  >
                    Reject
                  </Button>
                </div>
              ) : null}
            </article>
          ))}
          {(data?.approvals ?? []).length === 0 ? (
            <p className="text-sm text-muted">No approval requests yet.</p>
          ) : null}
        </div>
      ) : (
        <div className="p-4 md:p-6">
          <h2 className="font-semibold">Flow templates</h2>
          <p className="mt-1 text-sm text-muted">Pick a template when uploading — all must approve, or any user can approve.</p>
          <div className="mt-4 grid gap-2 rounded-lg border border-border bg-surface p-4 md:grid-cols-[1fr_1fr_auto_auto]">
            <Input placeholder="Template name" value={tplName} onChange={(e) => setTplName(e.target.value)} />
            <Input placeholder="Layers, comma-separated" value={tplLayers} onChange={(e) => setTplLayers(e.target.value)} />
            <select
              className="h-10 rounded-md border border-border px-2 text-sm"
              value={tplMode}
              onChange={(e) => setTplMode(e.target.value as "all" | "any")}
            >
              <option value="all">All must approve</option>
              <option value="any">Any can approve</option>
            </select>
            <Button
              onClick={async () => {
                if (!tplName.trim()) return;
                const layers = tplLayers
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
                  .map((name, i) => ({ layer: i + 1, name, mode: tplMode }));
                await saveApprovalTemplate({ data: { name: tplName.trim(), layers } });
                toast.success("Template saved");
                setTplName("");
                void qc.invalidateQueries({ queryKey: ["approvals"] });
              }}
            >
              Save template
            </Button>
          </div>
          <ul className="mt-4 space-y-3">
            {(data?.templates ?? []).map((tpl) => (
              <li key={tpl.id} className="flex items-start justify-between gap-3 rounded-lg border border-border bg-surface p-4">
                <div>
                  <div className="text-sm font-medium">{tpl.name}</div>
                  <ol className="mt-1 text-xs text-muted">
                    {(tpl.layers as { layer: number; name: string; mode: string }[]).map((l) => (
                      <li key={l.layer}>
                        {l.layer}. {l.name} ({l.mode === "all" ? "all" : "any"})
                      </li>
                    ))}
                  </ol>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={async () => {
                    await saveApprovalTemplate({ data: { id: tpl.id, name: tpl.name, remove: true } });
                    toast.success("Template deleted");
                    void qc.invalidateQueries({ queryKey: ["approvals"] });
                  }}
                >
                  Delete
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title="Request approval">
          <div className="space-y-2">
            <select
              className="h-10 w-full rounded-md border border-border px-3 text-sm"
              value={form.documentId}
              onChange={(e) => setForm({ ...form, documentId: e.target.value })}
            >
              <option value="">No document</option>
              {docs.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                </option>
              ))}
            </select>
            <Input placeholder="Request name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Approver name" value={form.approverName} onChange={(e) => setForm({ ...form, approverName: e.target.value })} />
            <Input placeholder="Approver email" value={form.approverEmail} onChange={(e) => setForm({ ...form, approverEmail: e.target.value })} />
            <select
              className="h-10 w-full rounded-md border border-border px-3 text-sm"
              value={form.mode}
              onChange={(e) => setForm({ ...form, mode: e.target.value })}
            >
              <option value="all">All user(s) must approve</option>
              <option value="any">Any user can approve</option>
            </select>
            <Textarea placeholder="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            <Button
              className="w-full"
              onClick={async () => {
                if (!form.approverName || !form.approverEmail) return;
                await requestApproval({
                  data: {
                    documentId: form.documentId || undefined,
                    name: form.name,
                    approverName: form.approverName,
                    approverEmail: form.approverEmail,
                    mode: form.mode,
                    message: form.message,
                  },
                });
                toast.success("Request sent");
                setOpen(false);
                void qc.invalidateQueries();
              }}
            >
              Send
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}


