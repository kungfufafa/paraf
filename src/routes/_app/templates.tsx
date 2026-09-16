import { useNavigate, createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { EmptyState, PageHeader, useBoot } from "@/components/app-shell";
import { TemplateEmpty } from "@/components/empty-art";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Menu, MenuContent, MenuItem, MenuSep, MenuTrigger } from "@/components/ui/dropdown";
import { Input } from "@/components/ui/input";
import { listTemplates, saveTemplate } from "@/lib/api";
import { blankContent } from "@/lib/doc-helpers";
import { useT } from "@/lib/lang";
import { DOC_TYPE_LABEL, type DocContent, type DocField } from "@/lib/types";

export const Route = createFileRoute("/_app/templates")({ component: TemplatesPage });

type Tpl = {
  id: string;
  name: string;
  docType: string;
  description: string;
  content: DocContent;
  fields: DocField[];
  compliance: string;
  uses: number;
};

function TemplatesPage() {
  const t = useT();
  const boot = useBoot();
  const nav = useNavigate();
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["templates"], queryFn: () => listTemplates() });
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [docType, setDocType] = useState("pkwt");
  const [description, setDescription] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [preview, setPreview] = useState<Tpl | null>(null);
  const [q, setQ] = useState("");
  const shown = data.filter((t) => !q.trim() || t.name.toLowerCase().includes(q.toLowerCase()) || t.docType.toLowerCase().includes(q.toLowerCase()));

  function startCreate() {
    setEditId(null);
    setName("");
    setDocType("pkwt");
    setDescription("");
    setOpen(true);
  }

  function startEdit(tpl: Tpl) {
    setEditId(tpl.id);
    setName(tpl.name);
    setDocType(tpl.docType);
    setDescription(tpl.description);
    setOpen(true);
  }

  return (
    <div>
      <PageHeader
        title={t.myTemplates}
        actions={
          <Button size="sm" onClick={startCreate}>
            {t.newTemplate}
          </Button>
        }
      />
      <div className="flex justify-end px-4 md:px-6">
        <input
          className="h-8 w-56 rounded-md border border-border bg-surface px-3 text-xs"
          placeholder={t.searchTemplates}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>
      {shown.length === 0 ? (
        <div className="mx-4 mt-3 rounded-lg border border-border bg-surface md:mx-6">
          <EmptyState art={<TemplateEmpty />} title={t.noTemplates} />
        </div>
      ) : (
        <div className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-3 md:p-6">
          {shown.map((tpl) => (
            <article key={tpl.id} className="flex flex-col rounded-lg border border-border bg-surface p-4">
              <div className="text-[11px] font-semibold tracking-wide text-brand uppercase">
                {DOC_TYPE_LABEL[tpl.docType] ?? tpl.docType}
              </div>
              <h2 className="mt-1 font-semibold">{tpl.name}</h2>
              <p className="mt-1 flex-1 text-sm text-muted">{tpl.description}</p>
              <div className="mt-3 text-[11px] text-subtle">
                {tpl.uses} uses · {tpl.compliance === "globalsign" ? "GlobalSign" : "PSrE"}
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" onClick={() => nav({ to: "/send", search: { template: tpl.id } })}>
                  Create document
                </Button>
                <Menu>
                  <MenuTrigger asChild>
                    <Button size="sm" variant="outline">
                      Actions
                    </Button>
                  </MenuTrigger>
                  <MenuContent>
                    <MenuItem onSelect={() => setPreview(tpl)}>Preview template</MenuItem>
                    <MenuItem onSelect={() => startEdit(tpl)}>Edit</MenuItem>
                    <MenuItem onSelect={() => nav({ to: "/send", search: { template: tpl.id } })}>Create document</MenuItem>
                    <MenuItem onSelect={() => nav({ to: "/bulk", search: { template: tpl.id } })}>Bulk send</MenuItem>
                    <MenuSep />
                    <MenuItem
                      danger
                      onSelect={async () => {
                        await saveTemplate({
                          data: { id: tpl.id, name: tpl.name, docType: tpl.docType, content: tpl.content, remove: true },
                        });
                        toast.success("Template deleted");
                        void qc.invalidateQueries({ queryKey: ["templates"] });
                      }}
                    >
                      Delete
                    </MenuItem>
                  </MenuContent>
                </Menu>
              </div>
            </article>
          ))}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title={editId ? "Edit template" : "Create template"}>
          <div className="space-y-2">
            <Input placeholder="Template name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            <select
              className="h-10 w-full rounded-md border border-border px-3 text-sm"
              value={docType}
              onChange={(e) => setDocType(e.target.value)}
            >
              {Object.entries(DOC_TYPE_LABEL).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
            <Button
              className="w-full"
              onClick={async () => {
                if (!name.trim()) return;
                const existing = editId ? data.find((x) => x.id === editId) : undefined;
                await saveTemplate({
                  data: {
                    id: editId ?? undefined,
                    name,
                    docType,
                    description: description || "Custom template · " + boot.company.name,
                    content: existing?.content ?? blankContent(docType, name, boot.company.name),
                    fields: existing?.fields,
                  },
                });
                toast.success(editId ? "Template updated" : "Template created");
                setOpen(false);
                setName("");
                setEditId(null);
                void qc.invalidateQueries({ queryKey: ["templates"] });
              }}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={Boolean(preview)} onOpenChange={() => setPreview(null)}>
        <DialogContent title={preview?.name ?? "Preview"}>
          <p className="text-sm text-muted">{preview?.description}</p>
          <ol className="mt-3 list-decimal space-y-1 pl-4 text-sm">
            {preview?.content.clauses.map((c) => (
              <li key={c.title}>
                <strong>{c.title}</strong> — {c.body.slice(0, 120)}
              </li>
            ))}
          </ol>
        </DialogContent>
      </Dialog>
    </div>
  );
}
