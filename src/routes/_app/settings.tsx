import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useBoot } from "@/components/app-shell";
import { SignPad } from "@/components/sign-pad";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { listSignatures, listStamps, saveSignature, saveStamp, updateCompany, updateProfile, savePrefs, inviteMember, saveEmeteraiConnector, testEmeteraiConnector } from "@/lib/api";
import {
  createApiKey,
  getIntegrations,
  getTsaChain,
  pingWebhook,
  revokeApiKey,
  saveAiConnector,
  saveOneDriveToken,
  saveWebhook,
  testAiConnector,
} from "@/lib/integrations-api";
import { authClient } from "@/lib/auth/client";
import { useLang } from "@/lib/lang";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/_app/settings")({ component: SettingsPage });

type Section =
  | "my-account"
  | "manage-user"
  | "preferences"
  | "esignature"
  | "corporate-stamp"
  | "notification"
  | "personalization"
  | "manage-quota"
  | "subscription"
  | "digital-certificate"
  | "email-setting"
  | "active-sessions"
  | "downloads"
  | "access-role"
  | "team"
  | "activity-log"
  | "custom-fields"
  | "tags"
  | "email-template"
  | "document-policy"
  | "document-quality"
  | "smart-automations"
  | "integration"
  | "emeterai-api"
  | "ai-review"
  | "timestamp"
  | "webhooks"
  | "byok";

const NAV: { id: Section; label: string }[] = [
  { id: "my-account", label: "Account" },
  { id: "manage-user", label: "User management" },
  { id: "preferences", label: "Preferences" },
  { id: "esignature", label: "eSignature" },
  { id: "corporate-stamp", label: "Stamp" },
  { id: "notification", label: "Notification" },
  { id: "personalization", label: "Personalization" },
  { id: "manage-quota", label: "Quota usage" },
  { id: "emeterai-api", label: "eMeterai API" },
  { id: "webhooks", label: "Webhooks" },
  { id: "byok", label: "BYOK" },
  { id: "ai-review", label: "AI review" },
  { id: "integration", label: "Integrations" },
  { id: "timestamp", label: "Timestamp (TSA)" },
  { id: "subscription", label: "Subscription" },
];

function SettingsPage() {
  const [section, setSection] = useState<Section>("my-account");
  const title = NAV.find((i) => i.id === section)?.label ?? "Settings";

  return (
    <div className="flex min-h-[calc(100vh-48px)]">
      <aside className="no-print hidden w-56 shrink-0 overflow-y-auto border-r border-border bg-surface md:flex md:flex-col">
        <div className="px-4 py-3 text-[13px] font-semibold">Settings</div>
        <nav className="flex-1 px-2">
          {NAV.filter((i) => i.id !== "subscription").map((it) => (
            <button
              key={it.id}
              type="button"
              onClick={() => setSection(it.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left text-[13px]",
                section === it.id ? "bg-brand-soft font-medium text-brand" : "text-ink hover:bg-surface-2",
              )}
            >
              {it.label}
              {it.id === "my-account" || it.id === "manage-user" || it.id === "preferences" ? (
                <ChevronDown className="size-3.5 text-muted" />
              ) : null}
            </button>
          ))}
        </nav>
        <div className="border-t border-border px-2 py-2">
          <button
            type="button"
            onClick={() => setSection("subscription")}
            className={cn(
              "w-full rounded-md px-2 py-1.5 text-left text-[13px]",
              section === "subscription" ? "bg-brand-soft font-medium text-brand" : "text-ink hover:bg-surface-2",
            )}
          >
            Subscription
          </button>
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <div className="flex gap-1 overflow-x-auto border-b border-border px-3 py-2 md:hidden">
          {NAV.map((it) => (
            <button
              key={it.id}
              type="button"
              className={cn("shrink-0 rounded-md px-2 py-1 text-xs", section === it.id ? "bg-brand-soft text-brand" : "text-muted")}
              onClick={() => setSection(it.id)}
            >
              {it.label}
            </button>
          ))}
        </div>
        <div className="px-4 py-5 md:px-8">
          <h1 className="mb-5 text-xl font-semibold">{title}</h1>
          <SectionBody section={section} />
        </div>
      </div>
    </div>
  );
}

function SectionBody({ section }: { section: Section }) {
  switch (section) {
    case "my-account":
      return <MyAccount />;
    case "preferences":
      return (
        <div>
          <DocPolicy />
          <EmailTpl />
          <SmartAuto />
        </div>
      );
    case "personalization":
      return <Personalization />;
    case "digital-certificate":
      return <CertPanel />;
    case "esignature":
      return <EsignPanel />;
    case "corporate-stamp":
      return <StampPanel />;
    case "email-setting":
      return <EmailSetting />;
    case "active-sessions":
      return <Sessions />;
    case "downloads":
      return <p className="text-sm text-muted">You don't have any downloads yet.</p>;
    case "manage-user":
      return <ManageUser />;
    case "access-role":
      return <AccessRole />;
    case "manage-quota":
      return <ManageQuota />;
    case "team":
      return <TeamPanel />;
    case "activity-log":
      return <ActivityLog />;
    case "custom-fields":
      return <CustomFields />;
    case "tags":
      return <TagsPanel />;
    case "notification":
      return <NotifPrefs />;
    case "email-template":
      return <EmailTpl />;
    case "document-policy":
      return <DocPolicy />;
    case "document-quality":
      return <DocQuality />;
    case "smart-automations":
      return <SmartAuto />;
    case "integration":
      return <Integrations />;
    case "webhooks":
      return <JumpPanel title="Webhooks" href="/webhooks" body="Plug-and-play outbound events. Paste a URL, pick events, ping. Same pattern as eMeterai." />;
    case "byok":
      return <JumpPanel title="BYOK" href="/byok" body="Bring your own signing secret, inbound API key, and AI provider key." />;
    case "ai-review":
      return <AiReviewPanel />;
    case "emeterai-api":
      return <EmeteraiApiPanel />;
    case "timestamp":
      return <TsaPanel />;
    case "subscription":
      return <Subscription />;
    default:
      return null;
  }
}

function AccordionCard({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="mb-3 overflow-hidden rounded-lg border border-border bg-surface">
      <button type="button" className="flex w-full items-center justify-between px-5 py-4 text-left font-semibold" onClick={() => setOpen((v) => !v)}>
        {title}
        <ChevronDown className={cn("size-4 text-muted transition-transform", open ? "rotate-180" : "")} />
      </button>
      {open ? <div className="border-t border-border px-5 py-4">{children}</div> : null}
    </section>
  );
}

function JumpPanel({ title, href, body }: { title: string; href: string; body: string }) {
  return (
    <Card title={title}>
      <p className="mb-4 text-sm text-muted">{body}</p>
      <Button onClick={() => (window.location.href = href)}>Open {title} module</Button>
    </Card>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-4 rounded-lg border border-border bg-surface p-5">
      <h2 className="mb-4 font-semibold">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[180px_1fr] sm:items-center">
      <Label className="text-muted">{label}</Label>
      {children}
    </div>
  );
}

function MyAccount() {
  const boot = useBoot();
  const qc = useQueryClient();
  const [profile, setProfile] = useState({
    name: boot.user.name,
    email: boot.user.email,
    phone: boot.prefs?.profile?.phone || boot.company.phone,
    role: "Owner",
    dob: boot.prefs?.profile?.dob || "",
    address: boot.prefs?.profile?.address || boot.company.address,
  });
  const [co, setCo] = useState({
    name: boot.company.name,
    legalName: boot.company.legalName,
    npwp: boot.company.npwp,
    address: boot.company.address,
    city: boot.company.city,
    phone: boot.company.phone,
    industry: "Professional Services",
    size: "1-10",
    email: boot.user.email,
  });

  return (
    <div>
      <AccordionCard title="Account">
        <div className="mb-4 text-sm font-medium">Profile</div>
        <div className="space-y-3">
          <Field label="Photo">
            <div className="grid size-12 place-items-center rounded-full bg-brand text-sm font-bold text-white">
              {boot.user.name.slice(0, 2).toUpperCase()}
            </div>
          </Field>
          <Field label="Name">
            <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} />
          </Field>
          <Field label="Email">
            <Input value={profile.email} disabled />
          </Field>
          <Field label="Phone number">
            <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
          </Field>
          <Field label="Role">
            <Input value="User" disabled />
          </Field>
          <Field label="Date of birth">
            <Input type="date" value={profile.dob} onChange={(e) => setProfile({ ...profile, dob: e.target.value })} />
          </Field>
          <Field label="Address">
            <Input value={profile.address} onChange={(e) => setProfile({ ...profile, address: e.target.value })} />
          </Field>
          <div className="flex justify-end">
            <Button
              onClick={async () => {
                await updateProfile({ data: { name: profile.name, phone: profile.phone, address: profile.address, dob: profile.dob } });
                await updateCompany({ data: { name: co.name, legalName: co.legalName || co.name, npwp: co.npwp, address: profile.address, city: co.city, phone: profile.phone } });
                toast.success("Account saved");
                void qc.invalidateQueries({ queryKey: ["boot"] });
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </AccordionCard>
      <AccordionCard title="Change password" defaultOpen={false}>
        <PasswordForm />
      </AccordionCard>
      <AccordionCard title="Email notifications" defaultOpen={false}>
        <div className="space-y-3">
          {["Document", "Document expiration", "eMeterai", "WhatsApp"].map((label) => (
            <EmailNotifRow key={label} label={label} />
          ))}
        </div>
      </AccordionCard>
    </div>
  );
}

function PasswordForm() {
  const [cur, setCur] = useState("");
  const [next, setNext] = useState("");
  const [again, setAgain] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div className="space-y-3">
      <Field label="Current password">
        <Input type="password" value={cur} onChange={(e) => setCur(e.target.value)} />
      </Field>
      <Field label="New password">
        <Input type="password" value={next} onChange={(e) => setNext(e.target.value)} />
      </Field>
      <Field label="Confirm new password">
        <Input type="password" value={again} onChange={(e) => setAgain(e.target.value)} />
      </Field>
      <div className="flex justify-end">
        <Button
          disabled={busy}
          onClick={async () => {
            if (next.length < 8) {
              toast.error("Password must be at least 8 characters");
              return;
            }
            if (next !== again) {
              toast.error("Passwords do not match");
              return;
            }
            setBusy(true);
            try {
              const res = await authClient.changePassword({ currentPassword: cur, newPassword: next, revokeOtherSessions: false });
              if (res.error) {
                toast.error(res.error.message || "Could not update password");
              } else {
                toast.success("Password updated");
                setCur("");
                setNext("");
                setAgain("");
              }
            } catch (e) {
              toast.error(e instanceof Error ? e.message : "Could not update password");
            } finally {
              setBusy(false);
            }
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

function EmailNotifRow({ label }: { label: string }) {
  const [on, setOn] = useState(true);
  return (
    <div className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
      <span>{label}</span>
      <Switch checked={on} onChange={setOn} />
    </div>
  );
}

function CertPanel() {
  return (
    <Card title="Certificates">
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between rounded-md border border-border p-3">
          <div>
            <div className="font-medium">PSrE Indonesia</div>
            <p className="text-xs text-muted">Personal certificate for qualified electronic signatures.</p>
          </div>
          <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs font-medium text-success">Active</span>
        </div>
        <div className="flex items-center justify-between rounded-md border border-border p-3">
          <div>
            <div className="font-medium">GlobalSign</div>
            <p className="text-xs text-muted">International certificate for cross-border signing.</p>
          </div>
          <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs font-medium text-success">Active</span>
        </div>
      </div>
    </Card>
  );
}

function EsignPanel() {
  const boot = useBoot();
  const qc = useQueryClient();
  const { data: sigs = [] } = useQuery({ queryKey: ["sigs"], queryFn: () => listSignatures() });
  const [tab, setTab] = useState<"signature" | "initials" | "stamps">("signature");
  return (
    <div>
      <div className="mb-4 flex gap-4 border-b border-border text-sm">
        {(["signature", "initials", "stamps"] as const).map((k) => (
          <button
            key={k}
            type="button"
            className={cn("border-b-2 pb-2 capitalize", tab === k ? "border-brand font-medium text-brand" : "border-transparent text-muted")}
            onClick={() => setTab(k)}
          >
            {k}
          </button>
        ))}
      </div>
      {tab === "stamps" ? (
        <StampPanel />
      ) : (
        <>
          <Card title={tab === "initials" ? "Create initials" : "Create eSignature"}>
            <SignPad
              name={boot.user.name}
              onDone={async (dataUrl, kind) => {
                await saveSignature({ data: { kind: tab === "initials" ? "initials" : kind, name: boot.user.name, dataUrl } });
                toast.success("Saved");
                void qc.invalidateQueries({ queryKey: ["sigs"] });
              }}
            />
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input type="checkbox" defaultChecked /> Set as default
            </label>
          </Card>
          {sigs.length ? (
            <Card title="Saved">
              <ul className="space-y-2 text-sm">
                {sigs.map((s) => (
                  <li key={s.id} className="flex items-center justify-between rounded-md border border-border px-3 py-2">
                    <span>
                      {s.name} · {s.kind}
                    </span>
                    {s.is_default ? <span className="text-xs text-brand">Default</span> : null}
                  </li>
                ))}
              </ul>
            </Card>
          ) : null}
        </>
      )}
    </div>
  );
}

function StampPanel() {
  const boot = useBoot();
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["stamps"], queryFn: () => listStamps() });
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm text-muted">Corporate stamps used on completed documents.</p>
        <label>
          <Button size="sm" asChild>
            <span>Add stamp</span>
          </Button>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              const r = new FileReader();
              r.onload = async () => {
                await saveStamp({ data: { name: f.name, companyName: boot.company.name, dataUrl: String(r.result) } });
                toast.success("Stamp saved");
                void qc.invalidateQueries({ queryKey: ["stamps"] });
              };
              r.readAsDataURL(f);
            }}
          />
        </label>
      </div>
      {data.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted">You don't have any stamps yet.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {data.map((s) => (
            <article key={s.id} className="rounded-lg border border-border bg-surface p-4">
              <img src={s.data_url} alt={s.name} className="mx-auto h-28 object-contain" />
              <div className="mt-2 text-sm font-medium">{s.name}</div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

function EmailSetting() {
  const boot = useBoot();
  const qc = useQueryClient();
  const [from, setFrom] = useState(boot.prefs?.email?.from || "noreply@paraf.id");
  const [fromName, setFromName] = useState(boot.prefs?.email?.fromName || "Paraf");
  const [reply, setReply] = useState(boot.prefs?.email?.reply || "");
  return (
    <Card title="Sender">
      <div className="space-y-3">
        <Field label="From name">
          <Input value={fromName} onChange={(e) => setFromName(e.target.value)} />
        </Field>
        <Field label="From email">
          <Input value={from} onChange={(e) => setFrom(e.target.value)} />
        </Field>
        <Field label="Reply-to">
          <Input value={reply} onChange={(e) => setReply(e.target.value)} />
        </Field>
        <Button
          size="sm"
          onClick={async () => {
            await savePrefs({ data: { email: { from, fromName, reply } } });
            toast.success("Email setting saved");
            void qc.invalidateQueries({ queryKey: ["boot"] });
          }}
        >
          Save
        </Button>
      </div>
    </Card>
  );
}

function Sessions() {
  const boot = useBoot();
  return (
    <Card title="This device">
      <div className="flex items-center justify-between text-sm">
        <div>
          <div className="font-medium">{boot.user.email}</div>
          <p className="text-xs text-muted">Current session · Cirebon, ID</p>
        </div>
        <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs text-success">Active</span>
      </div>
    </Card>
  );
}

function ManageUser() {
  const boot = useBoot();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "Member" });
  const members = boot.team?.length ? boot.team : [{ id: "me", name: boot.user.name, email: boot.user.email, role: "Owner", status: "active", emeterai_assigned: 0 }];
  return (
    <Card title="Users">
      <table className="w-full text-sm">
        <thead className="text-left text-xs text-muted">
          <tr>
            <th className="py-2">Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m) => (
            <tr key={m.id} className="border-t border-border">
              <td className="py-2 font-medium">{m.name}</td>
              <td>{m.email}</td>
              <td>{m.role}</td>
              <td className="capitalize">{m.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Button className="mt-4" size="sm" variant="outline" onClick={() => setOpen(true)}>
        Invite user
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent title="Invite user">
          <div className="space-y-2">
            <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <select className="h-10 w-full rounded-md border border-border px-3 text-sm" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option>Admin</option>
              <option>Member</option>
              <option>Viewer</option>
            </select>
            <Button
              className="w-full"
              onClick={async () => {
                if (!form.name.trim() || !form.email.trim()) return;
                await inviteMember({ data: form });
                toast.success("Invite sent");
                setOpen(false);
                setForm({ name: "", email: "", role: "Member" });
                void qc.invalidateQueries({ queryKey: ["boot"] });
              }}
            >
              Send invite
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function AccessRole() {
  return (
    <div className="space-y-3">
      {[
        ["Owner", "Full access to workspace, billing, and users"],
        ["Admin", "Manage documents, templates, and quotas"],
        ["Member", "Send and sign documents"],
        ["Viewer", "Read-only access"],
      ].map(([n, d]) => (
        <section key={n} className="rounded-lg border border-border bg-surface p-4">
          <div className="font-medium">{n}</div>
          <p className="text-sm text-muted">{d}</p>
        </section>
      ))}
    </div>
  );
}

function QuotaRow({ label, used, total, hint }: { label: string; used: number; total: number; hint: string }) {
  const unlimited = total < 0;
  const pct = unlimited ? 0 : Math.min(100, (used / Math.max(1, total)) * 100);
  return (
    <section className="rounded-lg border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="font-semibold">{label}</div>
          <p className="mt-1 text-xs text-muted">{hint}</p>
        </div>
        <div className="text-right text-sm font-medium tabular-nums">
          {used}/{unlimited ? "∞" : total}
        </div>
      </div>
      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-surface-2">
        <div className="h-full bg-brand" style={{ width: `${pct}%` }} />
      </div>
    </section>
  );
}

function ManageQuota() {
  const q = useBoot().quota;
  return (
    <div className="space-y-3">
      <QuotaRow
        label="Documents"
        used={0}
        total={0}
        hint="The remaining quota of documents that can be used this month."
      />
      <QuotaRow
        label="eMeterai"
        used={q.emeteraiUsed}
        total={q.emeteraiTotal}
        hint="The remaining quota of eMeterai that can be used in documents."
      />
    </div>
  );
}

function Personalization() {
  const qc = useQueryClient();
  const setLang = useLang((s) => s.setLang);
  const lang = useLang((s) => s.lang);
  const boot = useBoot();
  const [tz, setTz] = useState(boot.prefs?.prefs?.tz || "Asia/Jakarta");
  const [fmt, setFmt] = useState(boot.prefs?.prefs?.dateFormat || "DD/MM/YYYY");
  return (
    <Card title="Personalization">
      <div className="space-y-3">
        <Field label="Language">
          <select
            className="h-10 rounded-md border border-border px-3 text-sm"
            value={lang}
            onChange={(e) => setLang(e.target.value as "id" | "en")}
          >
            <option value="en">English</option>
            <option value="id">Bahasa Indonesia</option>
          </select>
        </Field>
        <Field label="Time zone">
          <Input value={tz} onChange={(e) => setTz(e.target.value)} />
        </Field>
        <Field label="Date format">
          <select className="h-10 rounded-md border border-border px-3 text-sm" value={fmt} onChange={(e) => setFmt(e.target.value)}>
            <option>DD/MM/YYYY</option>
            <option>MM/DD/YYYY</option>
          </select>
        </Field>
        <Button
          size="sm"
          onClick={async () => {
            await savePrefs({ data: { prefs: { tz, dateFormat: fmt, lang } } });
            toast.success("Preferences saved");
            void qc.invalidateQueries({ queryKey: ["boot"] });
          }}
        >
          Save
        </Button>
      </div>
    </Card>
  );
}

function TeamPanel() {
  const boot = useBoot();
  return (
    <Card title="Team">
      <div className="flex items-center gap-3">
        <div className="grid size-10 place-items-center rounded-full bg-rail text-xs font-bold text-white">
          {boot.company.name.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <div className="font-medium">{boot.company.name}</div>
          <p className="text-xs text-muted">{boot.company.legalName}</p>
        </div>
      </div>
    </Card>
  );
}

function ActivityLog() {
  const boot = useBoot();
  const rows = [
    { a: "Signed in", t: "Just now", who: boot.user.email },
    { a: "Workspace created", t: "Earlier", who: boot.user.email },
  ];
  return (
    <Card title="Recent activity">
      <ul className="space-y-2 text-sm">
        {rows.map((r) => (
          <li key={r.a} className="flex justify-between border-b border-border py-2 last:border-0">
            <span>
              <span className="font-medium">{r.a}</span>
              <span className="text-muted"> · {r.who}</span>
            </span>
            <span className="text-xs text-muted">{r.t}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function CustomFields() {
  const fields = ["Full name", "Email", "Company", "Title", "Date", "Checkbox", "Stamp", "eMeterai"];
  return (
    <Card title="Available fields">
      <ul className="grid gap-2 sm:grid-cols-2">
        {fields.map((f) => (
          <li key={f} className="rounded-md border border-border px-3 py-2 text-sm">
            {f}
          </li>
        ))}
      </ul>
    </Card>
  );
}

function TagsPanel() {
  const [tags, setTags] = useState(["Legal", "HR", "Finance"]);
  const [v, setV] = useState("");
  return (
    <Card title="Tags">
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span key={t} className="rounded-full bg-surface-2 px-3 py-1 text-xs">
            {t}
          </span>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <Input value={v} onChange={(e) => setV(e.target.value)} placeholder="New tag" />
        <Button
          size="sm"
          onClick={() => {
            if (!v.trim()) return;
            setTags((s) => [...s, v.trim()]);
            setV("");
          }}
        >
          Add
        </Button>
      </div>
    </Card>
  );
}

function NotifPrefs() {
  const boot = useBoot();
  const qc = useQueryClient();
  const [n, setN] = useState({
    sign: boot.prefs?.notif?.sign !== false,
    view: boot.prefs?.notif?.view !== false,
    complete: boot.prefs?.notif?.complete !== false,
    expire: boot.prefs?.notif?.expire !== false,
    wa: boot.prefs?.notif?.wa !== false,
  });
  return (
    <Card title="Email & in-app">
      {(
        [
          ["sign", "When someone signs"],
          ["view", "When someone views a document"],
          ["complete", "When a document is completed"],
          ["expire", "When a document is expiring"],
          ["wa", "WhatsApp signing updates"],
        ] as const
      ).map(([k, label]) => (
        <div key={k} className="flex items-center justify-between border-b border-border py-3 last:border-0">
          <span className="text-sm">{label}</span>
          <Switch
            checked={n[k]}
            onChange={async (v) => {
              const next = { ...n, [k]: v };
              setN(next);
              await savePrefs({ data: { notif: next } });
              void qc.invalidateQueries({ queryKey: ["boot"] });
            }}
          />
        </div>
      ))}
    </Card>
  );
}

function EmailTpl() {
  const boot = useBoot();
  const qc = useQueryClient();
  const [subject, setSubject] = useState(boot.prefs?.email?.subject || "Please sign: {{document_name}}");
  const [body, setBody] = useState(boot.prefs?.email?.body || "Hi {{signer_name}}, please review and sign {{document_name}}.");
  return (
    <Card title="Signing invitation">
      <p className="text-sm text-muted">Subject</p>
      <Input className="mt-1" value={subject} onChange={(e) => setSubject(e.target.value)} />
      <p className="mt-3 text-sm text-muted">Body</p>
      <textarea className="mt-1 h-32 w-full rounded-md border border-border p-3 text-sm" value={body} onChange={(e) => setBody(e.target.value)} />
      <Button
        className="mt-3"
        size="sm"
        onClick={async () => {
          await savePrefs({ data: { email: { ...(boot.prefs?.email ?? {}), subject, body } } });
          toast.success("Template saved");
          void qc.invalidateQueries({ queryKey: ["boot"] });
        }}
      >
        Save
      </Button>
    </Card>
  );
}

function DocPolicy() {
  const [seq, setSeq] = useState(false);
  const [login, setLogin] = useState(false);
  return (
    <Card title="Default policy">
      <div className="flex items-center justify-between border-b border-border py-3">
        <span className="text-sm">Require sequential signing</span>
        <Switch checked={seq} onChange={setSeq} />
      </div>
      <div className="flex items-center justify-between py-3">
        <span className="text-sm">Require sign-in to sign</span>
        <Switch checked={login} onChange={setLogin} />
      </div>
    </Card>
  );
}

function DocQuality() {
  const [quality, setQuality] = useState(() => (typeof window !== "undefined" ? localStorage.getItem("paraf-quality") ?? "high" : "high"));
  return (
    <Card title="Document quality">
      <p className="mb-3 text-sm text-muted">Choose document resolution when opening files.</p>
      <select
        className="h-10 w-full max-w-sm rounded-md border border-border px-3 text-sm"
        value={quality}
        onChange={(e) => {
          setQuality(e.target.value);
          localStorage.setItem("paraf-quality", e.target.value);
        }}
      >
        <option value="standard">Standard</option>
        <option value="high">Better document resolution</option>
      </select>
    </Card>
  );
}

function SmartAuto() {
  const [on, setOn] = useState(true);
  return (
    <Card title="Smart automations">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-medium">Auto-remind signers</div>
          <p className="text-xs text-muted">Send a reminder after 2 days of inactivity.</p>
        </div>
        <Switch checked={on} onChange={setOn} />
      </div>
    </Card>
  );
}

function EmeteraiApiPanel() {
  const boot = useBoot();
  const qc = useQueryClient();
  const status = boot.emeterai;
  const [provider, setProvider] = useState<"demo" | "generic" | "mekari">(status?.provider === "mekari" ? "mekari" : status?.connected ? "generic" : "demo");
  const [baseUrl, setBaseUrl] = useState(status?.baseUrl || "https://sandbox-api.mekari.com/v2/esign/v1/documents/stamp");
  const [token, setToken] = useState("");
  const [busy, setBusy] = useState(false);
  const ready = status?.legalReady;

  return (
    <div>
      <div className={`mb-4 rounded-lg border px-4 py-3 text-sm ${ready ? "border-success/40 bg-success-soft" : "border-warning/40 bg-warning-soft"}`}>
        {ready ? (
          <>Connected ({status.source}). Stamps issued through this API are treated as <strong>legally valid e-Meterai</strong> with the provider serial.</>
        ) : (
          <>
            Not connected. Apply eMeterai still works, but the stamp is <strong>DEMO — not legally valid</strong>. Paste a Peruri / distributor / Mekari Bearer token to go live.
          </>
        )}
      </div>
      <Card title="Plug-and-play connector">
        <div className="space-y-3">
          <Field label="Provider">
            <select
              className="h-10 w-full rounded-md border border-border px-3 text-sm"
              value={provider}
              onChange={(e) => setProvider(e.target.value as typeof provider)}
            >
              <option value="demo">Demo (not legally valid)</option>
              <option value="generic">Generic REST (Peruri / ezMeterai / reseller)</option>
              <option value="mekari">Mekari eMeterai sandbox</option>
            </select>
          </Field>
          <Field label="API URL">
            <Input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://…" />
          </Field>
          <Field label="Bearer token">
            <Input type="password" value={token} onChange={(e) => setToken(e.target.value)} placeholder={status?.tokenHint || "Paste token"} />
          </Field>
          <p className="text-xs text-muted">
            POST JSON: documentHash, title, amount. Expect serial / serialNumber and optional image, verifyUrl.
            Env plug-and-play: <code>EMETERAI_API_URL</code> + <code>EMETERAI_API_TOKEN</code>.
          </p>
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await saveEmeteraiConnector({ data: { provider, baseUrl, token } });
                  const ping = await testEmeteraiConnector();
                  if (ping.ok) toast.success(ping.message);
                  else toast.error(ping.message);
                  void qc.invalidateQueries({ queryKey: ["boot"] });
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
                  await saveEmeteraiConnector({ data: { provider, baseUrl, token } });
                  toast.success(provider === "demo" ? "Saved as demo" : "Connector saved");
                  void qc.invalidateQueries({ queryKey: ["boot"] });
                } finally {
                  setBusy(false);
                }
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Card>
      <Card title="What makes a stamp legally valid">
        <ol className="list-decimal space-y-2 pl-4 text-sm text-muted">
          <li>Quota bought from Peruri or an official distributor (Rp 10.000 / stamp).</li>
          <li>This app calls their API with the document hash.</li>
          <li>They return a unique serial. That serial is what courts and scanners check — not our green icon.</li>
          <li>Anyone can verify at the serial page or the provider URL printed on the stamp.</li>
        </ol>
      </Card>
    </div>
  );
}

function AiReviewPanel() {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["integrations"], queryFn: () => getIntegrations() });
  const ai = data?.ai;
  const [provider, setProvider] = useState(ai?.provider || "xai");
  const [apiKey, setApiKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("");
  const [model, setModel] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!ai) return;
    setProvider(ai.provider);
    setModel(ai.model);
  }, [ai]);
  return (
    <div>
      <div className={`mb-4 rounded-lg border px-4 py-3 text-sm ${ai?.connected ? "border-success/40 bg-success-soft" : "border-warning/40 bg-warning-soft"}`}>
        {ai?.connected ? (
          <>Connected: {ai.provider} / {ai.model} ({ai.source}). Review uses this key. Paste another provider key to switch.</>
        ) : (
          <>No key yet. xAI is used automatically if the platform injects it. Otherwise paste OpenAI, Anthropic, Google, Groq, or a custom OpenAI-compatible URL.</>
        )}
      </div>
      <Card title="AI provider">
        <div className="space-y-3">
          <Field label="Provider">
            <select className="h-10 w-full rounded-md border border-border px-3 text-sm" value={provider} onChange={(e) => setProvider(e.target.value as typeof provider)}>
              <option value="xai">xAI Grok</option>
              <option value="openai">OpenAI</option>
              <option value="anthropic">Anthropic Claude</option>
              <option value="google">Google Gemini</option>
              <option value="groq">Groq</option>
              <option value="custom">Custom OpenAI-compatible</option>
            </select>
          </Field>
          <Field label="API key">
            <Input type="password" value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder={ai?.keyHint || "sk-…"} />
          </Field>
          <Field label="Model">
            <Input value={model} onChange={(e) => setModel(e.target.value)} placeholder="grok-4.5 / gpt-4o-mini / claude-sonnet-4-5" />
          </Field>
          {provider === "custom" ? (
            <Field label="Base URL">
              <Input value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} placeholder="https://api.example.com/v1/chat/completions" />
            </Field>
          ) : null}
          <div className="flex justify-end gap-2">
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
                  void qc.invalidateQueries({ queryKey: ["integrations"] });
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
                  toast.success("AI connector saved");
                  void qc.invalidateQueries({ queryKey: ["integrations"] });
                } finally {
                  setBusy(false);
                }
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </Card>
      <Card title="Where it runs">
        <p className="text-sm text-muted">
          Open any document → Asisten AI, or Help → Analyze. The call is user-initiated and capped. Keys stay on the server.
        </p>
      </Card>
    </div>
  );
}

function Integrations() {
  const { data, refetch } = useQuery({ queryKey: ["integrations"], queryFn: () => getIntegrations() });
  const [hookUrl, setHookUrl] = useState("");
  const [keyName, setKeyName] = useState("HRIS");
  const [freshKey, setFreshKey] = useState("");
  const [odToken, setOdToken] = useState("");
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div>
      <div className="mb-4 rounded-lg border border-border bg-surface px-4 py-3 text-sm">
        Webhooks and BYOK are plug-and-play modules, same as eMeterai.{" "}
        <a className="font-medium text-brand underline" href="/webhooks">
          Webhooks
        </a>
        {" · "}
        <a className="font-medium text-brand underline" href="/byok">
          BYOK
        </a>
        {" · "}
        <a className="font-medium text-brand underline" href="/emeterai">
          eMeterai
        </a>
        .
      </div>
      <Card title="Google Drive & OneDrive">
        <p className="mb-3 text-sm text-muted">
          Upload step in Send document lists files from the signed-in Grok Google Drive connector, or from a Microsoft Graph token for OneDrive. Picking a file pulls the text into the naskah.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              const { listCloudFiles } = await import("@/lib/integrations-api");
              const res = await listCloudFiles({ data: { source: "gdrive", q: "pdf" } });
              if ("loginRequired" in res && res.loginRequired) {
                const url = "loginUrl" in res ? (res.loginUrl as string | undefined) : undefined;
                if (url) window.open(url, "_blank");
                toast.message(("error" in res && res.error) || "Connect Google Drive");
                return;
              }
              if ("error" in res && res.error) {
                toast.error(res.error);
                return;
              }
              toast.success(`${"files" in res ? res.files.length : 0} Drive files reachable`);
            }}
          >
            Test Google Drive
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              const { listCloudFiles } = await import("@/lib/integrations-api");
              const res = await listCloudFiles({ data: { source: "onedrive", q: "pdf" } });
              if ("error" in res && res.error) toast.error(res.error);
              else toast.success(`${"files" in res ? res.files.length : 0} OneDrive files reachable`);
            }}
          >
            Test OneDrive
          </Button>
        </div>
        <Field label="OneDrive token">
          <Input type="password" value={odToken} onChange={(e) => setOdToken(e.target.value)} placeholder={data?.oneDriveHint || "Microsoft Graph bearer"} />
        </Field>
        <div className="mt-2 flex justify-end">
          <Button
            size="sm"
            onClick={async () => {
              await saveOneDriveToken({ data: { token: odToken } });
              toast.success("OneDrive connected");
              void refetch();
            }}
          >
            Save OneDrive
          </Button>
        </div>
      </Card>

      <Card title="HRIS / ERP webhooks (Paraf → your system)">
        <p className="mb-2 text-sm text-muted">
          Dedicated module is plug-and-play like eMeterai.{" "}
          <a className="font-medium text-brand underline" href="/webhooks">
            Open Webhooks
          </a>
          {" · "}
          <a className="font-medium text-brand underline" href="/byok">
            Open BYOK
          </a>
          . We POST JSON on document events with headers X-Paraf-Event, X-Paraf-Timestamp, X-Paraf-Signature (sha256=HMAC of timestamp.payload).
        </p>
        <p className="mb-3 text-[12px] text-muted">Events: {(data?.events ?? []).join(", ")}</p>
        <div className="mb-3 flex gap-2">
          <Input placeholder="https://erp.company.com/hooks/paraf" value={hookUrl} onChange={(e) => setHookUrl(e.target.value)} />
          <Button
            onClick={async () => {
              if (!hookUrl.trim()) return;
              try {
                const res = await saveWebhook({ data: { url: hookUrl.trim(), events: ["*"] } });
                toast.success(res.secret ? `Webhook saved. Secret: ${res.secret}` : "Webhook saved");
                setHookUrl("");
                void refetch();
              } catch (e) {
                toast.error(e instanceof Error ? e.message : "Invalid URL");
              }
            }}
          >
            Add
          </Button>
        </div>
        <ul className="space-y-2 text-sm">
          {(data?.webhooks ?? []).map((h) => (
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
                <Button size="sm" variant="ghost" onClick={() => void saveWebhook({ data: { id: h.id, url: h.url, remove: true } }).then(() => refetch())}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
        {(data?.deliveries ?? []).length ? (
          <div className="mt-4">
            <div className="text-xs font-semibold tracking-wide text-muted uppercase">Recent deliveries</div>
            <ul className="mt-2 space-y-1 text-[11px] text-muted">
              {data!.deliveries.slice(0, 8).map((d) => (
                <li key={d.id}>
                  {d.event} · {d.status ?? "—"} {d.error ? `· ${d.error}` : ""} · {d.createdAt}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Card>

      <Card title="Inbound REST (HRIS → Paraf)">
        <p className="mb-2 text-sm text-muted">Create an API key, then call these endpoints with Authorization Bearer paraf_live_…</p>
        <ul className="mb-3 list-disc space-y-1 pl-5 font-mono text-[12px]">
          <li>GET {origin}/api/v1/me</li>
          <li>GET {origin}/api/v1/documents</li>
          <li>POST {origin}/api/v1/documents — JSON title, recipients, send</li>
          <li>GET {origin}/api/v1/documents/:id</li>
          <li>POST {origin}/api/v1/documents/:id — JSON action=void|remind</li>
          <li>GET {origin}/api/v1/events</li>
          <li>GET {origin}/api/v1/tsa</li>
          <li>GET {origin}/api/v1/tsa/:serial (public)</li>
          <li>GET {origin}/api/v1/openapi</li>
        </ul>
        <div className="mb-3 flex gap-2">
          <Input value={keyName} onChange={(e) => setKeyName(e.target.value)} />
          <Button
            onClick={async () => {
              const res = await createApiKey({ data: { name: keyName } });
              setFreshKey(res.key);
              toast.success("Copy this key now — it is shown once");
              void refetch();
            }}
          >
            Create API key
          </Button>
        </div>
        {freshKey ? (
          <p className="mb-3 rounded-md bg-warning-soft px-3 py-2 font-mono text-xs break-all">{freshKey}</p>
        ) : null}
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
      </Card>
    </div>
  );
}

function TsaPanel() {
  const { data } = useQuery({ queryKey: ["integrations"], queryFn: () => getIntegrations() });
  const { data: chain = [] } = useQuery({ queryKey: ["tsa-chain"], queryFn: () => getTsaChain() });
  return (
    <div>
      <div className="mb-4 rounded-lg border border-success/40 bg-success-soft px-4 py-3 text-sm">
        Paraf TSA is an internal HMAC-SHA256 hash chain (policy paraf-tsa-v1). Head {(data?.tsa.head ?? "genesis").slice(0, 16)}… · {data?.tsa.count ?? 0} tokens.
        Serial {data?.tsa.serial ?? "—"}.
      </div>
      <Card title="How it works">
        <ol className="list-decimal space-y-2 pl-4 text-sm text-muted">
          <li>Send, sign, void, remind, or decide an approval.</li>
          <li>Paraf hashes the event, links it to the previous head, and HMAC-signs the token with a workspace secret.</li>
          <li>The serial is printed on the document, the completion certificate, and the public verify page.</li>
          <li>Anyone with the serial can check integrity without logging in.</li>
        </ol>
        <Button className="mt-4" size="sm" variant="outline" onClick={() => (window.location.href = "/proofs")}>
          Open full ledger
        </Button>
      </Card>
      <Card title="Recent seals">
        <ul className="space-y-2 text-sm">
          {chain.slice(0, 12).map((row) => (
            <li key={row.serial} className="rounded-md border border-border px-3 py-2 font-mono text-[12px]">
              <a className="text-brand hover:underline" href={`/verify?serial=${encodeURIComponent(row.serial)}`}>
                {row.serial}
              </a>
              <div className="text-[11px] text-muted">{row.token.genTime || row.createdAt}</div>
            </li>
          ))}
          {!chain.length ? <li className="text-muted">No seals yet.</li> : null}
        </ul>
      </Card>
    </div>
  );
}

function Subscription() {
  return (
    <div>
      <Card title="Current plan">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold">Free</span>
              <span className="rounded-full bg-success-soft px-2 py-0.5 text-xs font-medium text-success">Active</span>
            </div>
            <p className="mt-1 text-sm text-muted">Start sending documents and collecting signatures.</p>
          </div>
          <Button size="sm">Upgrade</Button>
        </div>
      </Card>
    </div>
  );
}


