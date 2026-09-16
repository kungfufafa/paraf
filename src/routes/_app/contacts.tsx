import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { MoreHorizontal, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { EmptyState, PageHeader } from "@/components/app-shell";
import { ContactEmpty } from "@/components/empty-art";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Menu, MenuContent, MenuItem, MenuTrigger } from "@/components/ui/dropdown";
import { Input } from "@/components/ui/input";
import { listContacts, saveContact } from "@/lib/api";
import { useT } from "@/lib/lang";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/contacts")({ component: ContactsPage });

function ContactsPage() {
  const t = useT();
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["contacts"], queryFn: () => listContacts() });
  const [tab, setTab] = useState<"personal" | "company">("personal");
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", company: "", groupName: "Personal" });
  const contacts = data?.contacts ?? [];
  const filtered = useMemo(() => {
    const n = q.toLowerCase();
    return contacts.filter((c) => !n || c.name.toLowerCase().includes(n) || c.email.toLowerCase().includes(n) || c.company.toLowerCase().includes(n));
  }, [contacts, q]);
  const companies = useMemo(() => {
    const map = new Map<string, number>();
    for (const c of filtered) {
      const k = c.company || "—";
      map.set(k, (map.get(k) ?? 0) + 1);
    }
    return [...map.entries()];
  }, [filtered]);

  function parseCsv(text: string) {
    const lines = text.split(/\r?\n/).filter(Boolean);
    return lines.slice(1).map((line) => {
      const [name, email, phone, company] = line.split(",").map((s) => s.trim().replace(/^"|"$/g, ""));
      return { name: name || "", email: email || "", phone: phone || "", company: company || "" };
    });
  }

  return (
    <div>
      <PageHeader
        title={t.contacts}
        actions={
          <>
            <label>
              <Button size="sm" variant="outline" asChild>
                <span>{t.import}</span>
              </Button>
              <input
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={async (e) => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  const text = await f.text();
                  const rows = parseCsv(text);
                  for (const r of rows) {
                    if (r.email) await saveContact({ data: { ...r, groupName: "Imported" } });
                  }
                  toast.success("Contacts imported");
                  void qc.invalidateQueries({ queryKey: ["contacts"] });
                }}
              />
            </label>
            <Button size="sm" onClick={() => setOpen(true)}>
              {t.inviteContact}
            </Button>
          </>
        }
      />
      <div className="flex flex-wrap items-center gap-2 px-4 md:px-6">
        <div className="flex rounded-md border border-border bg-surface p-0.5 text-xs">
          {(["personal", "company"] as const).map((k) => (
            <button
              key={k}
              type="button"
              className={cn("rounded-sm px-3 py-1.5", tab === k ? "bg-navy text-white" : "text-muted")}
              onClick={() => setTab(k)}
            >
              {k === "personal" ? t.contacts : t.groups}
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <Search className="pointer-events-none absolute top-1/2 left-2 size-3.5 -translate-y-1/2 text-subtle" />
          <input
            className="h-8 w-52 rounded-md border border-border bg-surface pr-3 pl-7 text-xs"
            placeholder={t.searchContacts}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
      </div>
      <div className="p-4 md:p-6">
        <div className="overflow-hidden rounded-lg border border-border bg-surface">
          {tab === "personal" ? (
            filtered.length === 0 ? (
              <EmptyState art={<ContactEmpty />} title={t.noContacts} />
            ) : (
              <table className="w-full text-sm">
                <thead className="text-left text-[12px] font-medium text-muted">
                  <tr className="border-b border-border">
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">{t.lastActivity}</th>
                    <th className="px-4 py-3">{t.companyTab}</th>
                    <th className="px-4 py-3">{t.action}</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((c) => (
                    <tr key={c.id} className="border-t border-border">
                      <td className="px-4 py-3 font-medium">{c.name}</td>
                      <td className="px-4 py-3 text-muted">{c.email}</td>
                      <td className="px-4 py-3 text-muted">—</td>
                      <td className="px-4 py-3">{c.company || "—"}</td>
                      <td className="px-4 py-3">
                        <Menu>
                          <MenuTrigger asChild>
                            <Button size="icon" variant="ghost" aria-label="Actions">
                              <MoreHorizontal className="size-4" />
                            </Button>
                          </MenuTrigger>
                          <MenuContent>
                            <MenuItem
                              onSelect={() => {
                                window.location.href = `/send?toEmail=${encodeURIComponent(c.email)}&toName=${encodeURIComponent(c.name)}`;
                              }}
                            >
                              Send document
                            </MenuItem>
                            <MenuItem
                              danger
                              onSelect={async () => {
                                await saveContact({ data: { id: c.id, name: c.name, email: c.email, remove: true } });
                                toast.success("Deleted");
                                void qc.invalidateQueries({ queryKey: ["contacts"] });
                              }}
                            >
                              Delete
                            </MenuItem>
                          </MenuContent>
                        </Menu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : companies.length === 0 ? (
            <EmptyState art={<ContactEmpty />} title={t.noContacts} />
          ) : (
            <table className="w-full text-sm">
              <thead className="text-left text-[12px] font-medium text-muted">
                <tr className="border-b border-border">
                  <th className="px-4 py-3">{t.companyTab}</th>
                  <th className="px-4 py-3">Contacts</th>
                </tr>
              </thead>
              <tbody>
                {companies.map(([name, n]) => (
                  <tr key={name} className="border-t border-border">
                    <td className="px-4 py-3 font-medium">{name}</td>
                    <td className="px-4 py-3 text-muted">{n}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title={t.addContact}>
          <div className="space-y-2">
            <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <Input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
            <Button
              className="w-full"
              onClick={async () => {
                if (!form.name || !form.email) return;
                await saveContact({ data: form });
                toast.success("Contact saved");
                setOpen(false);
                setForm({ name: "", email: "", phone: "", company: "", groupName: "Personal" });
                void qc.invalidateQueries({ queryKey: ["contacts"] });
              }}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
