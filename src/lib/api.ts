import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { uid } from "@/lib/utils";
import { DEFAULT_SETTINGS, FOLDER_ROUTES, type DocContent, type DocField, type DocStatus, type DocumentRow, type Recipient } from "@/lib/types";
import { buildSeed, SEED_CONTACTS, SEED_TEMPLATES, daysAgo } from "@/lib/seed";
import { canSign, myRecipient, blankContent } from "@/lib/doc-helpers";
import { connectorFrom, documentHash, issueStamp, pingConnector, publicStatus } from "@/lib/emeterai";
import { dispatchWebhook, ensureIntegrationTables, issueWorkspaceTsa } from "@/lib/integrations";
import { aiFrom, chatComplete, parseAiReview } from "@/lib/ai-providers";

type Ctx = { userId: string };

function parse<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

async function userEmail(userId: string): Promise<{ email: string; name: string }> {
  const sql = await getSql();
  const rows = await sql<{ email: string; name: string }>`
    select email, name from "user" where id = ${userId} limit 1
  `;
  if (rows[0]) return rows[0];
  return { email: "user@paraf.id", name: "Pengguna Paraf" };
}

async function ensureExtras(userId: string) {
  const sql = await getSql();
  await sql
    .query(
      `create table if not exists team_members (
        id text primary key, user_id text not null, name text not null, email text not null,
        role text not null default 'Member', status text not null default 'invited',
        emeterai_assigned integer not null default 0, created_at timestamptz not null default now())`,
    )
    .catch(() => undefined);
  await sql
    .query(
      `create table if not exists emeterai_stamps (
        id text primary key, user_id text not null, document_id text, serial text not null unique,
        hash text not null, legal integer not null default 0, provider text not null,
        verify_url text, image_url text, created_at timestamptz not null default now())`,
    )
    .catch(() => undefined);
  await sql
    .query(
      `create table if not exists workspace_prefs (
        user_id text primary key, profile_json text not null default '{}',
        prefs_json text not null default '{}', notif_json text not null default '{}',
        email_json text not null default '{}')`,
    )
    .catch(() => undefined);
  try {
    const n = await sql<{ c: number }>`select count(*)::int as c from team_members where user_id = ${userId}`;
    if ((n[0]?.c ?? 0) === 0) {
      const ident = await userEmail(userId);
      await sql`
        insert into team_members (id, user_id, name, email, role, status, emeterai_assigned)
        values (${uid("tm")}, ${userId}, ${ident.name}, ${ident.email}, ${"Owner"}, ${"active"}, ${50})
      `;
    }
    const p = await sql<{ c: number }>`select count(*)::int as c from workspace_prefs where user_id = ${userId}`;
    if ((p[0]?.c ?? 0) === 0) {
      await sql`insert into workspace_prefs (user_id) values (${userId})`;
    }
  } catch {
    /* first boot */
  }
}

async function listTeamRows(userId: string) {
  try {
    const sql = await getSql();
    return await sql<{
      id: string;
      name: string;
      email: string;
      role: string;
      status: string;
      emeterai_assigned: number;
    }>`select id, name, email, role, status, emeterai_assigned from team_members where user_id = ${userId} order by created_at`;
  } catch {
    return [];
  }
}

async function loadPrefs(userId: string) {
  try {
    const sql = await getSql();
    const row = (
      await sql<{
        profile_json: string;
        prefs_json: string;
        notif_json: string;
        email_json: string;
      }>`select * from workspace_prefs where user_id = ${userId} limit 1`
    )[0];
    return {
      profile: parse<Record<string, string>>(row?.profile_json, {}),
      prefs: parse<Record<string, string>>(row?.prefs_json, {}),
      notif: parse<Record<string, boolean>>(row?.notif_json, {}),
      email: parse<Record<string, string>>(row?.email_json, {}),
    };
  } catch {
    return { profile: {}, prefs: {}, notif: {}, email: {} };
  }
}

async function ensure(userId: string) {
  const sql = await getSql();
  const existing = await sql<{ c: number }>`select count(*)::int as c from companies where user_id = ${userId}`;
  if ((existing[0]?.c ?? 0) > 0) {
    await ensureExtras(userId);
    await ensureIntegrationTables();
    return;
  }

  const ident = await userEmail(userId);
  const companyId = uid("co");
  await sql`
    insert into companies (id, user_id, name, legal_name, npwp, address, city, phone, plan)
    values (
      ${companyId}, ${userId}, ${"PT Jaya Wijaya Kusuma"}, ${"PT Jaya Wijaya Kusuma"},
      ${"10.221.884.7-437.000"}, ${"Jl. Tuparev No. 88, Kedawung, Cirebon 45153"},
      ${"Cirebon"}, ${"0231-888221"}, ${"Pro"}
    )
  `;
  await sql`
    insert into quotas (user_id, emeterai_used, emeterai_total, ekyc_used, ekyc_total, wa_used, wa_total)
    values (${userId}, 12, 50, 3, 20, 8, 100)
  `;

  const folderIds: Record<string, string> = {};
  for (const name of ["Umum", "HR", "Legal", "Finance"]) {
    const id = uid("fld");
    folderIds[name] = id;
    await sql`insert into folders (id, user_id, name) values (${id}, ${userId}, ${name})`;
  }

  for (const c of SEED_CONTACTS) {
    await sql`
      insert into contacts (id, user_id, name, email, phone, company, group_name, role)
      values (${uid("ct")}, ${userId}, ${c.name}, ${c.email}, ${c.phone}, ${c.company}, ${c.group}, ${c.role})
    `;
  }
  await sql`insert into contact_groups (id, user_id, name, description) values
    (${uid("cg")}, ${userId}, ${"Vendor"}, ${"Pemasok dan mitra operasional"}),
    (${uid("cg")}, ${userId}, ${"Klien"}, ${"Pelanggan aktif"}),
    (${uid("cg")}, ${userId}, ${"Internal"}, ${"Karyawan PT Jaya Wijaya Kusuma"}),
    (${uid("cg")}, ${userId}, ${"Investor"}, ${"Calon dan existing investor"})
  `;

  for (const t of SEED_TEMPLATES) {
    await sql`
      insert into templates (id, user_id, name, doc_type, description, content_json, fields_json, uses)
      values (${uid("tpl")}, ${userId}, ${t.name}, ${t.docType}, ${t.description}, ${JSON.stringify(t.content)}, ${"[]"}, ${Math.floor(Math.random() * 40 + 4)})
    `;
  }

  await sql`
    insert into stamps (id, user_id, name, company_name, data_url, is_default)
    values (${uid("st")}, ${userId}, ${"Stempel Direksi"}, ${"PT Jaya Wijaya Kusuma"}, ${COMPANY_STAMP}, ${true})
  `;
  await sql`
    insert into signatures (id, user_id, kind, name, data_url, is_default)
    values (${uid("sg")}, ${userId}, ${"font"}, ${ident.name}, ${""}, ${true})
  `;

  const seed = buildSeed(ident.email, ident.name);
  for (const d of seed) {
    const docId = uid("doc");
    const token = uid("tok");
    const recIds: string[] = [];
    const recRows = d.recipients.map((r) => {
      const id = uid("rc");
      recIds.push(id);
      return { id, ...r };
    });
    const fields: DocField[] = d.fields.map((f, i) => ({
      ...f,
      id: uid("f"),
      recipientId: recRows[Math.min(i, recRows.length - 1)]!.id,
    }));
    // remap first/second party fields more accurately
    fields.forEach((f, i) => {
      if (i === 0 && recRows[0]) f.recipientId = recRows[0].id;
    });

    await sql`
      insert into documents (
        id, user_id, folder_id, title, doc_type, status, compliance, group_name,
        content_json, fields_json, settings_json, token, effective_date, expires_at, deadline,
        created_at, updated_at, sent_at, completed_at, decline_reason
      ) values (
        ${docId}, ${userId}, ${folderIds[d.folder] ?? folderIds.Umum}, ${d.title}, ${d.docType}, ${d.status},
        ${d.compliance}, ${d.group}, ${JSON.stringify(d.content)}, ${JSON.stringify(fields)},
        ${JSON.stringify({ ...DEFAULT_SETTINGS, ...d.settings })}, ${token},
        ${d.effective ?? null}, ${d.expires ?? null}, ${d.deadline ?? null},
        ${d.createdAt}, ${d.createdAt}, ${d.sentAt ?? null}, ${d.completedAt ?? null}, ${d.declineReason ?? null}
      )
    `;
    for (const r of recRows) {
      await sql`
        insert into recipients (
          id, user_id, document_id, name, email, phone, role, action, status, order_index, company_name, signed_at, invite_token
        ) values (
          ${r.id}, ${userId}, ${docId}, ${r.name}, ${r.email}, ${r.phone ?? ""}, ${r.role ?? "signer"},
          ${r.action ?? "needs_to_sign"}, ${r.status ?? "waiting"}, ${r.order ?? 1}, ${r.company ?? ""}, ${r.signedAt ?? null},
          ${uid("inv")}
        )
      `;
    }
    const actors = [
      { actor: ident.name, action: "Dokumen dibuat", at: d.createdAt },
      d.sentAt ? { actor: ident.name, action: "Dokumen dikirim ke penerima", at: d.sentAt } : null,
      { actor: "Sistem Paraf PSrE", action: "Hash SHA-256 dicatat & sertifikat disiapkan", at: d.createdAt },
    ].filter(Boolean) as { actor: string; action: string; at: string }[];
    for (const r of recRows) {
      if (r.status === "signed") actors.push({ actor: r.name, action: "Menandatangani dokumen (PSrE)", at: r.signedAt ?? d.createdAt });
      if (r.status === "viewed") actors.push({ actor: r.name, action: "Membuka tautan dokumen", at: daysAgo(0.5) });
      if (r.status === "declined") actors.push({ actor: r.name, action: "Menolak menandatangani", at: d.createdAt });
    }
    if (d.status === "voided") actors.push({ actor: ident.name, action: "Membatalkan (void) dokumen", at: d.createdAt });
    if (d.status === "expired") actors.push({ actor: "Sistem", action: "Tenggat tanda tangan terlewati", at: d.deadline ?? d.createdAt });
    if (d.status === "completed") actors.push({ actor: "Sistem Paraf", action: "Dokumen tersertifikasi & dikunci", at: d.completedAt ?? d.createdAt });
    for (const a of actors) {
      await sql`
        insert into audit_events (id, user_id, document_id, actor, action, ip, created_at)
        values (${uid("au")}, ${userId}, ${docId}, ${a.actor}, ${a.action}, ${"103.124.18.44"}, ${a.at})
      `;
    }
  }

  await sql`
    insert into approvals (id, user_id, document_id, name, layer, mode, approver_name, approver_email, status)
    select ${uid("ap")}, ${userId}, id, ${"Persetujuan Direksi"}, 1, ${"all"}, ${ident.name}, ${ident.email}, ${"pending"}
    from documents where user_id = ${userId} and status = 'pending_approval' limit 1
  `;
  await sql`
    insert into approval_templates (id, user_id, name, layers_json)
    values (
      ${uid("apt")}, ${userId}, ${"Legal → Finance → Direksi"},
      ${JSON.stringify([
        { layer: 1, mode: "any", name: "Legal" },
        { layer: 2, mode: "all", name: "Finance" },
        { layer: 3, mode: "any", name: "Direksi" },
      ])}
    )
  `;
  await sql`
    insert into notifications (id, user_id, title, body, href, read) values
    (${uid("n")}, ${userId}, ${"Dokumen menunggu tanda tangan"}, ${"PKS-2026/HR-014 Perjanjian Kerja Sama Distribusi memerlukan tanda tangan Anda."}, ${"/esignature/need-to-sign"}, ${false}),
    (${uid("n")}, ${userId}, ${"Dewi Lestari melihat PKWT"}, ${"Kandidat telah membuka kontrak PKWT-2026/HR-112."}, ${"/esignature/waiting-for-others"}, ${false}),
    (${uid("n")}, ${userId}, ${"e-Meterai tersisa 38"}, ${"Kuota e-Meterai 12/50 terpakai. Isi ulang sebelum habis."}, ${"/settings/quota-usage"}, ${true}),
    (${uid("n")}, ${userId}, ${"Addendum ditolak"}, ${"Andi Pratama menolak ADD-2026/LGL-002."}, ${"/esignature/declined"}, ${true})
  `;
  await sql`
    insert into emeterai_orders (id, user_id, qty, amount, status, created_at) values
    (${uid("em")}, ${userId}, 50, 500000, ${"paid"}, ${daysAgo(40)}),
    (${uid("em")}, ${userId}, 20, 200000, ${"paid"}, ${daysAgo(12)})
  `;
  await sql`
    insert into signing_proofs (id, user_id, title, media_url, notary, witness, notes)
    values (${uid("sp")}, ${userId}, ${"RUPS 12 Juli 2026"}, ${""}, ${"Notaris Hj. Ratna Sari, S.H., M.Kn."}, ${"Agus Salim"}, ${"Penandatanganan akta perubahan anggaran dasar secara hybrid."})
  `;
  await ensureExtras(userId);
  await ensureIntegrationTables();
}

const COMPANY_STAMP =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="92" fill="none" stroke="#c2413b" stroke-width="6"/>
      <circle cx="100" cy="100" r="78" fill="none" stroke="#c2413b" stroke-width="2"/>
      <text x="100" y="78" text-anchor="middle" font-family="serif" font-size="13" fill="#c2413b" font-weight="700">PT JAYA WIJAYA</text>
      <text x="100" y="98" text-anchor="middle" font-family="serif" font-size="13" fill="#c2413b" font-weight="700">KUSUMA</text>
      <text x="100" y="122" text-anchor="middle" font-family="serif" font-size="10" fill="#c2413b">CIREBON · INDONESIA</text>
      <text x="100" y="148" text-anchor="middle" font-family="serif" font-size="9" fill="#c2413b">STEMPEL PERUSAHAAN</text>
    </svg>`,
  );

type DocDB = {
  id: string;
  title: string;
  doc_type: string;
  status: DocStatus;
  compliance: "psre" | "globalsign";
  group_name: string;
  folder_id: string | null;
  folder_name: string | null;
  passcode: string | null;
  content_json: string;
  fields_json: string;
  settings_json: string;
  token: string;
  effective_date: string | null;
  expires_at: string | null;
  deadline: string | null;
  created_at: string;
  updated_at: string;
  sent_at: string | null;
  completed_at: string | null;
  voided_at: string | null;
  decline_reason: string | null;
  scheduled_at?: string | null;
  deleted_at?: string | null;
  tags?: string | null;
};

function toDoc(row: DocDB, recipients: Recipient[]): DocumentRow {
  return {
    id: row.id,
    title: row.title,
    docType: row.doc_type,
    status: row.status,
    compliance: row.compliance,
    groupName: row.group_name,
    folderId: row.folder_id,
    folderName: row.folder_name,
    passcode: row.passcode,
    content: parse<DocContent>(row.content_json, {
      kind: "other",
      number: "",
      location: "",
      date: "",
      parties: [],
      clauses: [],
    }),
    fields: parse<DocField[]>(row.fields_json, []),
    settings: { ...DEFAULT_SETTINGS, ...parse(row.settings_json, {}) },
    token: row.token,
    effectiveDate: row.effective_date,
    expiresAt: row.expires_at,
    deadline: row.deadline,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    sentAt: row.sent_at,
    completedAt: row.completed_at,
    voidedAt: row.voided_at,
    declineReason: row.decline_reason,
    tags: row.tags ?? "",
    scheduledAt: row.scheduled_at ?? null,
    deletedAt: row.deleted_at ?? null,
    recipients,
  };
}

async function recsFor(docId: string): Promise<Recipient[]> {
  const sql = await getSql();
  await sql.query(`alter table recipients add column if not exists invite_token text`).catch(() => undefined);
  const missing = await sql<{ id: string }>`
    select id from recipients where document_id = ${docId} and (invite_token is null or invite_token = '')
  `.catch(() => [] as { id: string }[]);
  for (const m of missing) {
    await sql`update recipients set invite_token = ${uid("inv")} where id = ${m.id}`;
  }
  const rows = await sql<{
    id: string;
    document_id: string;
    name: string;
    email: string;
    phone: string;
    role: Recipient["role"];
    action: string;
    status: Recipient["status"];
    order_index: number;
    company_name: string;
    signed_at: string | null;
    signature_data: string | null;
    invite_token: string | null;
  }>`select * from recipients where document_id = ${docId} order by order_index, name`;
  return rows.map((r) => ({
    id: r.id,
    documentId: r.document_id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    role: r.role,
    action: r.action,
    status: r.status,
    orderIndex: r.order_index,
    companyName: r.company_name,
    signedAt: r.signed_at,
    signatureData: r.signature_data,
    inviteToken: r.invite_token ?? undefined,
  }));
}

export const bootstrap = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensure(context.userId);
    const sql = await getSql();
    const ident = await userEmail(context.userId);
    const company = (await sql<{
      id: string;
      name: string;
      legal_name: string;
      npwp: string;
      address: string;
      city: string;
      phone: string;
      plan: string;
    }>`select * from companies where user_id = ${context.userId} limit 1`)[0]!;
    const quota = (await sql<{
      emeterai_used: number;
      emeterai_total: number;
      ekyc_used: number;
      ekyc_total: number;
      wa_used: number;
      wa_total: number;
      signature_quota: number;
    }>`select * from quotas where user_id = ${context.userId}` )[0]!;
    const folders = await sql<{ id: string; name: string }>`select id, name from folders where user_id = ${context.userId} order by name`;
    const counts: Record<string, number> = { all: 0, trash: 0 };
    const allDocs = await sql<{ status: string; deleted_at?: string | null }>`
      select status, deleted_at from documents where user_id = ${context.userId}
    `.catch(async () =>
      sql<{ status: string; deleted_at?: string | null }>`
        select status from documents where user_id = ${context.userId}
      `,
    );
    for (const r of allDocs) {
      if (r.deleted_at) {
        counts.trash += 1;
        continue;
      }
      counts[r.status] = (counts[r.status] ?? 0) + 1;
      counts.all += 1;
    }
    const notifs = await sql<{
      id: string;
      title: string;
      body: string;
      href: string;
      read: boolean;
      created_at: string;
    }>`select * from notifications where user_id = ${context.userId} order by created_at desc limit 12`;
    return {
      user: ident,
      company: {
        id: company.id,
        name: company.name,
        legalName: company.legal_name,
        npwp: company.npwp,
        address: company.address,
        city: company.city,
        phone: company.phone,
        plan: company.plan,
      },
      quota: {
        emeteraiUsed: quota.emeterai_used,
        emeteraiTotal: quota.emeterai_total,
        ekycUsed: quota.ekyc_used,
        ekycTotal: quota.ekyc_total,
        waUsed: quota.wa_used,
        waTotal: quota.wa_total,
        signatureQuota: quota.signature_quota,
      },
      folders,
      counts,
      notifications: notifs.map((n) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        href: n.href,
        read: n.read,
        createdAt: n.created_at,
      })),
      team: await listTeamRows(context.userId),
      prefs: await (async () => {
        const p = await loadPrefs(context.userId);
        const { emeteraiToken: _t, byokSecret: _b, aiApiKey: _a, onedriveToken: _o, ...rest } = p.prefs;
        return { ...p, prefs: rest };
      })(),
      emeterai: publicStatus(connectorFrom((await loadPrefs(context.userId)).prefs)),
    };
  });

export const listDocuments = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((d: { status?: string; q?: string; folderId?: string; folder?: string }) => d)
  .handler(async ({ context, data }) => {
    await ensure(context.userId);
    const ident = await userEmail(context.userId);
    const sql = await getSql();
    const key = data.folder ?? data.status ?? "all";
    const mapped = FOLDER_ROUTES[key] ?? key;
    const rows = await sql<DocDB>`
      select d.*, f.name as folder_name
      from documents d
      left join folders f on f.id = d.folder_id
      where d.user_id = ${context.userId}
      order by d.updated_at desc
    `;
    const result: DocumentRow[] = [];
    for (const row of rows) {
      const rec = await recsFor(row.id);
      const doc = toDoc(row, rec);
      const deleted = Boolean(doc.deletedAt);
      if (mapped === "trash") {
        if (!deleted) continue;
      } else if (deleted) {
        continue;
      } else if (mapped === "sent") {
        if (!doc.sentAt || doc.status === "draft") continue;
      } else if (mapped === "scheduled") {
        if (doc.status !== "scheduled" && doc.status !== "pending_approval") continue;
      } else if (mapped === "need_to_sign") {
        if (!canSign(doc, ident.email)) continue;
      } else if (mapped === "waiting_for_others") {
        const mine = myRecipient(doc, ident.email);
        const othersPending = doc.recipients.some(
          (r) =>
            r.role !== "cc" &&
            r.status !== "signed" &&
            r.status !== "declined" &&
            r.email.toLowerCase() !== ident.email.toLowerCase(),
        );
        const iAmDone = !mine || mine.role === "cc" || mine.status === "signed";
        if (!doc.sentAt || doc.status === "draft" || !othersPending || !iAmDone) continue;
      } else if (mapped === "shared") {
        if (doc.status !== "need_to_sign") continue;
      } else if (mapped === "expiring_soon") {
        const due = doc.deadline ? new Date(doc.deadline).getTime() : 0;
        if (!due || due - Date.now() > 5 * 86400000 || doc.status === "completed" || doc.status === "voided") continue;
      } else if (mapped === "all") {
        /* keep */
      } else if (mapped !== doc.status) {
        continue;
      }
      if (data.folderId && doc.folderId !== data.folderId) continue;
      if (data.q) {
        const q = data.q.toLowerCase();
        const hit =
          doc.title.toLowerCase().includes(q) ||
          doc.groupName.toLowerCase().includes(q) ||
          (doc.tags ?? "").toLowerCase().includes(q) ||
          rec.some((r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q));
        if (!hit) continue;
      }
      result.push(doc);
    }
    return result;
  });

export const getDocument = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    await ensure(context.userId);
    const sql = await getSql();
    const rows = await sql<DocDB>`
      select d.*, f.name as folder_name from documents d
      left join folders f on f.id = d.folder_id
      where d.id = ${id} and d.user_id = ${context.userId} limit 1
    `;
    const row = rows[0];
    if (!row) return null;
    const rec = await recsFor(row.id);
    const audit = await sql<{
      id: string;
      actor: string;
      action: string;
      ip: string;
      meta: string;
      created_at: string;
    }>`select * from audit_events where document_id = ${id} order by created_at asc`;
    const tsa = await sql<{ serial: string; token_json: string; created_at: string }>`
      select serial, token_json, created_at from tsa_tokens where document_id = ${id} order by created_at asc
    `.catch(() => []);
    return {
      document: toDoc(row, rec),
      audit: audit.map((a) => ({
        id: a.id,
        actor: a.actor,
        action: a.action,
        ip: a.ip,
        meta: a.meta,
        createdAt: a.created_at,
      })),
      tsa: tsa.map((t) => ({ serial: t.serial, token: parse<Record<string, string>>(t.token_json, {}), createdAt: t.created_at })),
    };
  });

export const getPublicDocument = createServerFn({ method: "GET" })
  .validator((token: string) => token)
  .handler(async ({ data: token }) => {
    const sql = await getSql();
    await sql.query(`alter table recipients add column if not exists invite_token text`).catch(() => undefined);
    const byInvite = await sql<{ document_id: string; id: string }>`
      select document_id, id from recipients where invite_token = ${token} limit 1
    `.catch(() => [] as { document_id: string; id: string }[]);
    let docToken = token;
    const lockRecipientId = byInvite[0]?.id;
    if (byInvite[0]) {
      const t = await sql<{ token: string }>`select token from documents where id = ${byInvite[0].document_id} limit 1`;
      if (!t[0]) return null;
      docToken = t[0].token;
    }
    const rows = await sql<DocDB>`
      select d.*, f.name as folder_name from documents d
      left join folders f on f.id = d.folder_id
      where d.token = ${docToken} limit 1
    `;
    const row = rows[0];
    if (!row) return null;
    const rec = await recsFor(row.id);
    return { ...toDoc(row, rec), lockRecipientId };
  });

const createSchema = z.object({
  title: z.string().min(1),
  docType: z.string(),
  compliance: z.enum(["psre", "globalsign"]),
  groupName: z.string().optional(),
  folderId: z.string().nullable().optional(),
  content: z.any(),
  fields: z.any(),
  settings: z.any(),
  recipients: z.array(
    z.object({
      name: z.string(),
      email: z.string(),
      phone: z.string().optional(),
      role: z.string().optional(),
      action: z.string().optional(),
      orderIndex: z.number().optional(),
      companyName: z.string().optional(),
      id: z.string().optional(),
    }),
  ),
  deadline: z.string().nullable().optional(),
  effectiveDate: z.string().nullable().optional(),
  expiresAt: z.string().nullable().optional(),
  send: z.boolean().optional(),
});

export const saveDocument = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: z.infer<typeof createSchema> & { id?: string }) => d)
  .handler(async ({ context, data }) => {
    await ensure(context.userId);
    const sql = await getSql();
    const ident = await userEmail(context.userId);
    const id = data.id ?? uid("doc");
    const token = uid("tok");
    const now = new Date().toISOString();
    const existing = data.id
      ? await sql<{ token: string }>`select token from documents where id = ${data.id} and user_id = ${context.userId}`
      : [];
    const useToken = existing[0]?.token ?? token;
    const makerSigns = data.recipients.some(
      (r) => r.email.toLowerCase() === ident.email.toLowerCase() && (r.role ?? "signer") !== "cc",
    );
    let status: DocStatus = "draft";
    if (data.send) status = makerSigns ? "need_to_sign" : "waiting_for_others";
    else if (data.settings?.scheduleAt) status = "scheduled";

    if (data.id) {
      await sql`
        update documents set
          title = ${data.title}, doc_type = ${data.docType}, compliance = ${data.compliance},
          group_name = ${data.groupName ?? ""}, folder_id = ${data.folderId ?? null},
          content_json = ${JSON.stringify(data.content)}, fields_json = ${JSON.stringify(data.fields)},
          settings_json = ${JSON.stringify(data.settings ?? DEFAULT_SETTINGS)},
          deadline = ${data.deadline ?? null}, effective_date = ${data.effectiveDate ?? null},
          expires_at = ${data.expiresAt ?? null},
          status = ${status},
          sent_at = ${data.send ? now : null},
          updated_at = ${now}
        where id = ${data.id} and user_id = ${context.userId}
      `;
      await sql`delete from recipients where document_id = ${data.id} and user_id = ${context.userId}`;
    } else {
      await sql`
        insert into documents (
          id, user_id, folder_id, title, doc_type, status, compliance, group_name,
          content_json, fields_json, settings_json, token, deadline, effective_date, expires_at, sent_at
        ) values (
          ${id}, ${context.userId}, ${data.folderId ?? null}, ${data.title}, ${data.docType}, ${status},
          ${data.compliance}, ${data.groupName ?? ""}, ${JSON.stringify(data.content)},
          ${JSON.stringify(data.fields)}, ${JSON.stringify(data.settings ?? DEFAULT_SETTINGS)},
          ${useToken}, ${data.deadline ?? null}, ${data.effectiveDate ?? null}, ${data.expiresAt ?? null},
          ${data.send ? now : null}
        )
      `;
    }
    const recMap: Record<string, string> = {};
    for (const [i, r] of data.recipients.entries()) {
      const rid = r.id && r.id.length > 4 ? r.id : uid("rc");
      recMap[r.id ?? `new_${i}`] = rid;
      await sql`
        insert into recipients (id, user_id, document_id, name, email, phone, role, action, status, order_index, company_name, invite_token)
        values (
          ${rid}, ${context.userId}, ${id}, ${r.name}, ${r.email}, ${r.phone ?? ""},
          ${r.role ?? "signer"}, ${r.action ?? "needs_to_sign"}, ${"waiting"}, ${r.orderIndex ?? i + 1},
          ${r.companyName ?? ""}, ${uid("inv")}
        )
      `;
    }
    const remappedFields = Array.isArray(data.fields)
      ? (data.fields as DocField[]).map((f) => ({
          ...f,
          recipientId: recMap[f.recipientId] ?? f.recipientId,
        }))
      : data.fields;
    await sql`update documents set fields_json = ${JSON.stringify(remappedFields)} where id = ${id} and user_id = ${context.userId}`;
    await sql`
      insert into audit_events (id, user_id, document_id, actor, action)
      values (${uid("au")}, ${context.userId}, ${id}, ${ident.name}, ${data.send ? "Dokumen dikirim" : "Draf disimpan"})
    `;
    if (data.send && data.settings?.emeteraiBy === "maker") {
      await sql`update quotas set emeterai_used = emeterai_used + 1 where user_id = ${context.userId} and emeterai_used < emeterai_total`;
    }
    if (data.send) {
      await issueWorkspaceTsa(context.userId, id, "document.sent", { title: data.title });
      void dispatchWebhook(context.userId, "document.sent", { documentId: id, title: data.title, token: useToken });
    }
    const recs = await recsFor(id);
    return {
      id,
      token: useToken,
      recMap,
      invites: recs.map((r) => ({
        id: r.id,
        name: r.name,
        email: r.email,
        token: r.inviteToken || useToken,
      })),
    };
  });

export const mutateDocument = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string; action: "void" | "delete" | "remind" | "duplicate" | "move" | "restore" | "resend"; folderId?: string }) => d)
  .handler(async ({ context, data }) => {
    await ensure(context.userId);
    const sql = await getSql();
    const ident = await userEmail(context.userId);
    if (data.action === "delete") {
      const row = await sql<{ deleted_at?: string | null }>`
        select * from documents where id = ${data.id} and user_id = ${context.userId} limit 1
      `;
      if (row[0] && "deleted_at" in row[0] && row[0].deleted_at) {
        await sql`delete from recipients where document_id = ${data.id} and user_id = ${context.userId}`;
        await sql`delete from audit_events where document_id = ${data.id} and user_id = ${context.userId}`;
        await sql`delete from documents where id = ${data.id} and user_id = ${context.userId}`;
      } else if (row[0] && "deleted_at" in row[0]) {
        await sql`update documents set deleted_at = now(), updated_at = now() where id = ${data.id} and user_id = ${context.userId}`;
        await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${context.userId}, ${data.id}, ${ident.name}, ${"Dipindahkan ke sampah (7 hari)"})`;
      } else {
        await sql`update documents set status = 'voided', voided_at = now(), updated_at = now() where id = ${data.id} and user_id = ${context.userId}`;
        await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${context.userId}, ${data.id}, ${ident.name}, ${"Dipindahkan ke sampah"})`;
      }
      return { ok: true };
    }
    if (data.action === "restore") {
      await sql`update documents set deleted_at = null, updated_at = now() where id = ${data.id} and user_id = ${context.userId}`;
      await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${context.userId}, ${data.id}, ${ident.name}, ${"Dipulihkan dari sampah"})`;
      return { ok: true };
    }
    if (data.action === "resend") {
      await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${context.userId}, ${data.id}, ${ident.name}, ${"Dokumen dikirim ulang ke penerima"})`;
      await issueWorkspaceTsa(context.userId, data.id, "document.sent", { resend: true });
      void dispatchWebhook(context.userId, "document.sent", { documentId: data.id, resend: true });
      return { ok: true };
    }
    if (data.action === "void") {
      await sql`update documents set status = 'voided', voided_at = now(), updated_at = now() where id = ${data.id} and user_id = ${context.userId}`;
      await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${context.userId}, ${data.id}, ${ident.name}, ${"Dokumen dibatalkan (void) — e-Meterai ikut dibatalkan"})`;
      await issueWorkspaceTsa(context.userId, data.id, "document.voided");
      void dispatchWebhook(context.userId, "document.voided", { documentId: data.id });
      return { ok: true };
    }
    if (data.action === "remind") {
      await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${context.userId}, ${data.id}, ${ident.name}, ${"Pengingat dikirim ke penerima yang belum tanda tangan"})`;
      await issueWorkspaceTsa(context.userId, data.id, "document.reminded");
      void dispatchWebhook(context.userId, "document.reminded", { documentId: data.id });
      return { ok: true };
    }
    if (data.action === "move") {
      await sql`update documents set folder_id = ${data.folderId ?? null}, updated_at = now() where id = ${data.id} and user_id = ${context.userId}`;
      return { ok: true };
    }
    if (data.action === "duplicate") {
      const src = await sql<DocDB>`select * from documents where id = ${data.id} and user_id = ${context.userId}`;
      const row = src[0];
      if (!row) return { ok: false };
      const nid = uid("doc");
      await sql`
        insert into documents (
          id, user_id, folder_id, title, doc_type, status, compliance, group_name,
          content_json, fields_json, settings_json, token
        ) values (
          ${nid}, ${context.userId}, ${row.folder_id}, ${row.title + " (salinan)"}, ${row.doc_type}, ${"draft"},
          ${row.compliance}, ${row.group_name}, ${row.content_json}, ${row.fields_json}, ${row.settings_json}, ${uid("tok")}
        )
      `;
      const recs = await recsFor(data.id);
      const recMap: Record<string, string> = {};
      for (const [i, r] of recs.entries()) {
        const rid = uid("rc");
        recMap[r.id] = rid;
        await sql`
          insert into recipients (id, user_id, document_id, name, email, phone, role, action, status, order_index, company_name, invite_token)
          values (${rid}, ${context.userId}, ${nid}, ${r.name}, ${r.email}, ${r.phone ?? ""}, ${r.role}, ${r.action}, ${"waiting"}, ${r.orderIndex ?? i + 1}, ${r.companyName ?? ""}, ${uid("inv")})
        `;
      }
      const fields = parse<DocField[]>(row.fields_json, []).map((f) => ({
        ...f,
        id: uid("f"),
        value: undefined,
        recipientId: recMap[f.recipientId] ?? f.recipientId,
      }));
      await sql`update documents set fields_json = ${JSON.stringify(fields)} where id = ${nid}`;
      return { ok: true, id: nid };
    }
    return { ok: true };
  });

export const applySignature = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string; recipientId: string; fields: DocField[]; signatureData: string; stampData?: string; emeterai?: boolean; decline?: boolean; reason?: string }) => d)
  .handler(async ({ context, data }) => {
    await ensure(context.userId);
    const sql = await getSql();
    const ident = await userEmail(context.userId);
    const now = new Date().toISOString();
    if (data.decline) {
      await sql`update recipients set status = 'declined', declined_reason = ${data.reason ?? ""} where id = ${data.recipientId} and user_id = ${context.userId}`;
      await sql`update documents set status = 'declined', decline_reason = ${data.reason ?? ""}, updated_at = ${now} where id = ${data.id} and user_id = ${context.userId}`;
      await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${context.userId}, ${data.id}, ${ident.name}, ${"Menolak menandatangani: " + (data.reason ?? "")})`;
      await issueWorkspaceTsa(context.userId, data.id, "document.declined");
      void dispatchWebhook(context.userId, "document.declined", { documentId: data.id, recipientId: data.recipientId });
      return { ok: true };
    }
    await sql`
      update documents set fields_json = ${JSON.stringify(data.fields)}, updated_at = ${now}
      where id = ${data.id} and user_id = ${context.userId}
    `;
    await sql`
      update recipients set status = 'signed', signed_at = ${now}, signature_data = ${data.signatureData}
      where id = ${data.recipientId} and document_id = ${data.id}
    `;
    if (data.emeterai) {
      await sql`update quotas set emeterai_used = emeterai_used + 1 where user_id = ${context.userId} and emeterai_used < emeterai_total`;
    }
    await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${context.userId}, ${data.id}, ${ident.name}, ${"Menandatangani dokumen (PSrE + sertifikat)"})`;

    const remaining = await sql<{ c: number }>`
      select count(*)::int as c from recipients
      where document_id = ${data.id} and action = 'needs_to_sign' and status != 'signed' and status != 'declined'
    `;
    if ((remaining[0]?.c ?? 0) === 0) {
      await sql`update documents set status = 'completed', completed_at = ${now}, updated_at = ${now} where id = ${data.id}`;
      await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${context.userId}, ${data.id}, ${"Sistem Paraf"}, ${"Semua pihak telah menandatangani. Dokumen dikunci."})`;
      await issueWorkspaceTsa(context.userId, data.id, "document.completed");
      void dispatchWebhook(context.userId, "document.completed", { documentId: data.id });
    } else {
      await sql`update documents set status = 'waiting_for_others', updated_at = ${now} where id = ${data.id} and user_id = ${context.userId}`;
      await issueWorkspaceTsa(context.userId, data.id, "document.signed", { recipientId: data.recipientId });
      void dispatchWebhook(context.userId, "document.signed", { documentId: data.id, recipientId: data.recipientId });
    }
    return { ok: true };
  });

export const publicSign = createServerFn({ method: "POST" })
  .validator((d: { token: string; recipientId: string; fields: DocField[]; signatureData: string; emeterai?: boolean; decline?: boolean; reason?: string }) => d)
  .handler(async ({ data }) => {
    const sql = await getSql();
    await sql.query(`alter table recipients add column if not exists invite_token text`).catch(() => undefined);
    const byInvite = await sql<{ document_id: string; id: string }>`
      select document_id, id from recipients where invite_token = ${data.token} limit 1
    `.catch(() => [] as { document_id: string; id: string }[]);
    const docs = byInvite[0]
      ? await sql<{ id: string; user_id: string }>`select id, user_id from documents where id = ${byInvite[0].document_id} limit 1`
      : await sql<{ id: string; user_id: string }>`select id, user_id from documents where token = ${data.token} limit 1`;
    const doc = docs[0];
    if (!doc) return { ok: false };
    const recipientId = byInvite[0]?.id ?? data.recipientId;
    if (byInvite[0] && byInvite[0].id !== data.recipientId) return { ok: false, error: "Tautan ini hanya untuk satu pihak." };
    const now = new Date().toISOString();
    const rec = await sql<{ name: string; status: string; order_index: number; role: string }>`
      select name, status, order_index, role from recipients where id = ${recipientId} and document_id = ${doc.id}
    `;
    const actor = rec[0]?.name ?? "Penerima";
    if (!rec[0]) return { ok: false };
    if (rec[0].status === "signed") return { ok: true, already: true };
    if (data.decline) {
      await sql`update recipients set status = 'declined', declined_reason = ${data.reason ?? ""} where id = ${recipientId}`;
      await sql`update documents set status = 'declined', decline_reason = ${data.reason ?? ""}, updated_at = ${now} where id = ${doc.id}`;
      await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${doc.user_id}, ${doc.id}, ${actor}, ${"Menolak menandatangani"})`;
      await issueWorkspaceTsa(doc.user_id, doc.id, "document.declined");
      void dispatchWebhook(doc.user_id, "document.declined", { documentId: doc.id, recipientId });
      return { ok: true };
    }
    await sql`update documents set fields_json = ${JSON.stringify(data.fields)}, updated_at = ${now} where id = ${doc.id}`;
    await sql`update recipients set status = 'signed', signed_at = ${now}, signature_data = ${data.signatureData} where id = ${recipientId}`;
    await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${doc.user_id}, ${doc.id}, ${actor}, ${"Menandatangani dokumen via tautan"})`;
    const remaining = await sql<{ c: number }>`
      select count(*)::int as c from recipients
      where document_id = ${doc.id} and action = 'needs_to_sign' and status != 'signed' and status != 'declined'
    `;
    if ((remaining[0]?.c ?? 0) === 0) {
      await sql`update documents set status = 'completed', completed_at = ${now} where id = ${doc.id}`;
      await issueWorkspaceTsa(doc.user_id, doc.id, "document.completed");
      void dispatchWebhook(doc.user_id, "document.completed", { documentId: doc.id });
    } else {
      await sql`update documents set status = 'waiting_for_others', updated_at = ${now} where id = ${doc.id} and status != 'completed'`;
      await issueWorkspaceTsa(doc.user_id, doc.id, "document.signed", { recipientId });
      void dispatchWebhook(doc.user_id, "document.signed", { documentId: doc.id, recipientId });
    }
    return { ok: true };
  });

export const listContacts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensure(context.userId);
    const sql = await getSql();
    const rows = await sql<{
      id: string; name: string; email: string; phone: string; company: string; group_name: string; role: string;
    }>`select * from contacts where user_id = ${context.userId} order by name`;
    const groups = await sql<{ id: string; name: string; description: string }>`select * from contact_groups where user_id = ${context.userId}`;
    return {
      contacts: rows.map((c) => ({
        id: c.id, name: c.name, email: c.email, phone: c.phone, company: c.company, groupName: c.group_name, role: c.role,
      })),
      groups,
    };
  });

export const saveContact = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id?: string; name: string; email: string; phone?: string; company?: string; groupName?: string; role?: string; remove?: boolean }) => d)
  .handler(async ({ context, data }) => {
    await ensure(context.userId);
    const sql = await getSql();
    if (data.remove && data.id) {
      await sql`delete from contacts where id = ${data.id} and user_id = ${context.userId}`;
      return { ok: true };
    }
    if (data.id) {
      await sql`
        update contacts set name = ${data.name}, email = ${data.email}, phone = ${data.phone ?? ""},
          company = ${data.company ?? ""}, group_name = ${data.groupName ?? ""}, role = ${data.role ?? "signer"}
        where id = ${data.id} and user_id = ${context.userId}
      `;
    } else {
      await sql`
        insert into contacts (id, user_id, name, email, phone, company, group_name, role)
        values (${uid("ct")}, ${context.userId}, ${data.name}, ${data.email}, ${data.phone ?? ""}, ${data.company ?? ""}, ${data.groupName ?? ""}, ${data.role ?? "signer"})
      `;
    }
    return { ok: true };
  });

export const listTemplates = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensure(context.userId);
    const sql = await getSql();
    const rows = await sql<{
      id: string; name: string; doc_type: string; description: string; content_json: string; fields_json: string; compliance: string; uses: number; created_at: string;
    }>`select * from templates where user_id = ${context.userId} order by uses desc`;
    return rows.map((t) => ({
      id: t.id,
      name: t.name,
      docType: t.doc_type,
      description: t.description,
      content: parse<DocContent>(t.content_json, { kind: "other", number: "", location: "", date: "", parties: [], clauses: [] }),
      fields: parse<DocField[]>(t.fields_json, []),
      compliance: t.compliance,
      uses: t.uses,
      createdAt: t.created_at,
    }));
  });

export const listStamps = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensure(context.userId);
    const sql = await getSql();
    return sql<{ id: string; name: string; company_name: string; data_url: string; is_default: boolean }>`
      select * from stamps where user_id = ${context.userId}
    `;
  });

export const listSignatures = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensure(context.userId);
    const sql = await getSql();
    return sql<{ id: string; kind: string; name: string; data_url: string; is_default: boolean }>`
      select * from signatures where user_id = ${context.userId}
    `;
  });

export const saveSignature = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { kind: string; name: string; dataUrl: string }) => d)
  .handler(async ({ context, data }) => {
    await ensure(context.userId);
    const sql = await getSql();
    await sql`update signatures set is_default = false where user_id = ${context.userId}`;
    await sql`
      insert into signatures (id, user_id, kind, name, data_url, is_default)
      values (${uid("sg")}, ${context.userId}, ${data.kind}, ${data.name}, ${data.dataUrl}, ${true})
    `;
    return { ok: true };
  });

export const listApprovals = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensure(context.userId);
    const sql = await getSql();
    const rows = await sql<{
      id: string; document_id: string | null; name: string; layer: number; mode: string;
      approver_name: string; approver_email: string; status: string; decided_at: string | null; note: string;
    }>`select * from approvals where user_id = ${context.userId} order by status, layer`;
    const tpls = await sql<{ id: string; name: string; layers_json: string }>`select * from approval_templates where user_id = ${context.userId}`;
    const withTitle = [];
    for (const r of rows) {
      let documentTitle = "";
      if (r.document_id) {
        const d = await sql<{ title: string }>`select title from documents where id = ${r.document_id}`;
        documentTitle = d[0]?.title ?? "";
      }
      withTitle.push({
        id: r.id,
        documentId: r.document_id,
        documentTitle,
        name: r.name,
        layer: r.layer,
        mode: r.mode,
        approverName: r.approver_name,
        approverEmail: r.approver_email,
        status: r.status,
        decidedAt: r.decided_at,
        note: r.note,
      });
    }
    return { approvals: withTitle, templates: tpls.map((t) => ({ ...t, layers: parse(t.layers_json, []) })) };
  });

export const decideApproval = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string; status: "approved" | "rejected"; note?: string }) => d)
  .handler(async ({ context, data }) => {
    await ensure(context.userId);
    const sql = await getSql();
    await sql`
      update approvals set status = ${data.status}, note = ${data.note ?? ""}, decided_at = now()
      where id = ${data.id} and user_id = ${context.userId}
    `;
    const row = await sql<{ document_id: string | null }>`select document_id from approvals where id = ${data.id}`;
    if (row[0]?.document_id && data.status === "approved") {
      await sql`update documents set status = 'draft', updated_at = now() where id = ${row[0].document_id} and user_id = ${context.userId}`;
    }
    if (row[0]?.document_id && data.status === "rejected") {
      await sql`update documents set status = 'declined', decline_reason = ${data.note ?? "Ditolak pada alur persetujuan"}, updated_at = now() where id = ${row[0].document_id}`;
    }
    await issueWorkspaceTsa(context.userId, row[0]?.document_id ?? data.id, "approval.decided", { status: data.status });
    void dispatchWebhook(context.userId, "approval.decided", { approvalId: data.id, status: data.status, documentId: row[0]?.document_id });
    return { ok: true };
  });

export const listContracts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensure(context.userId);
    const sql = await getSql();
    const rows = await sql<DocDB>`
      select d.*, f.name as folder_name from documents d
      left join folders f on f.id = d.folder_id
      where d.user_id = ${context.userId} and (d.status = 'completed' or d.effective_date is not null)
      order by d.expires_at nulls last
    `;
    const out = [];
    for (const row of rows) out.push(toDoc(row, await recsFor(row.id)));
    return out;
  });

export const workspaceExtras = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensure(context.userId);
    const sql = await getSql();
    const orders = await sql<{ id: string; qty: number; amount: number; status: string; created_at: string }>`
      select * from emeterai_orders where user_id = ${context.userId} order by created_at desc
    `;
    const proofs = await sql<{ id: string; title: string; media_url: string; notary: string; witness: string; notes: string; created_at: string }>`
      select * from signing_proofs where user_id = ${context.userId} order by created_at desc
    `;
    return { orders, proofs };
  });

export const buyEmeterai = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((qty: number) => qty)
  .handler(async ({ context, data: qty }) => {
    await ensure(context.userId);
    const sql = await getSql();
    const n = Math.max(1, Math.min(200, qty));
    await sql`update quotas set emeterai_total = emeterai_total + ${n} where user_id = ${context.userId}`;
    await sql`insert into emeterai_orders (id, user_id, qty, amount, status) values (${uid("em")}, ${context.userId}, ${n}, ${n * 10000}, ${"paid"})`;
    return { ok: true };
  });

export const saveEmeteraiConnector = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { provider: "demo" | "generic" | "mekari"; baseUrl: string; token: string }) => d)
  .handler(async ({ context, data }) => {
    await ensure(context.userId);
    const sql = await getSql();
    const cur = await loadPrefs(context.userId);
    const prefs = {
      ...cur.prefs,
      emeteraiProvider: data.provider,
      emeteraiBaseUrl: data.baseUrl.trim(),
      emeteraiToken: data.token.trim() || cur.prefs.emeteraiToken || "",
    };
    const blob = JSON.stringify(prefs);
    await sql`
      insert into workspace_prefs (user_id, prefs_json)
      values (${context.userId}, ${blob})
      on conflict (user_id) do update set prefs_json = ${blob}
    `.catch(async () => {
      await sql`update workspace_prefs set prefs_json = ${blob} where user_id = ${context.userId}`;
    });
    return publicStatus(connectorFrom(prefs));
  });

export const testEmeteraiConnector = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensure(context.userId);
    const prefs = await loadPrefs(context.userId);
    return pingConnector(connectorFrom(prefs.prefs));
  });

export const issueEmeterai = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { documentId: string }) => d)
  .handler(async ({ context, data }) => {
    await ensure(context.userId);
    const sql = await getSql();
    const prefs = await loadPrefs(context.userId);
    const conn = connectorFrom(prefs.prefs);
    const rows = await sql<{ id: string; title: string; content_json: string }>`
      select id, title, content_json from documents where id = ${data.documentId} and user_id = ${context.userId} limit 1
    `;
    const doc = rows[0];
    if (!doc) return { serial: "DEMO-MISSING", legal: false, verifyUrl: "/verify", provider: "demo" as const, hash: "", error: "Document not found" };
    const hash = documentHash({ id: doc.id, title: doc.title, content: parse(doc.content_json, {}) });
    const existing = await sql<{ serial: string; legal: number; verify_url: string | null; provider: string; hash: string }>`
      select serial, legal, verify_url, provider, hash from emeterai_stamps where document_id = ${doc.id} limit 1
    `.catch(() => []);
    if (existing[0]) {
      return {
        serial: existing[0].serial,
        legal: Boolean(existing[0].legal),
        verifyUrl: existing[0].verify_url || `/verify?serial=${existing[0].serial}`,
        provider: existing[0].provider,
        hash: existing[0].hash,
      };
    }
    const origin = process.env.BETTER_AUTH_URL || "";
    const stamped = await issueStamp({
      connector: conn,
      hash,
      title: doc.title,
      documentId: doc.id,
      verifyOrigin: origin || "https://paraf.app",
    });
    await sql`
      insert into emeterai_stamps (id, user_id, document_id, serial, hash, legal, provider, verify_url, image_url)
      values (
        ${uid("ems")}, ${context.userId}, ${doc.id}, ${stamped.serial}, ${stamped.hash},
        ${stamped.legal ? 1 : 0}, ${stamped.provider}, ${stamped.verifyUrl}, ${stamped.image ?? null}
      )
    `.catch(() => undefined);
    if (stamped.legal) {
      await sql`update quotas set emeterai_used = emeterai_used + 1 where user_id = ${context.userId} and emeterai_used < emeterai_total`;
    }
    await sql`insert into audit_events (id, user_id, document_id, actor, action) values (
      ${uid("au")}, ${context.userId}, ${doc.id}, ${"Paraf"},
      ${stamped.legal ? "e-Meterai Peruri dibubuhkan: " + stamped.serial : "e-Meterai DEMO (tidak sah): " + stamped.serial}
    )`.catch(() => undefined);
    return stamped;
  });

export const lookupEmeterai = createServerFn({ method: "GET" })
  .validator((serial: string) => serial)
  .handler(async ({ data: serial }) => {
    const sql = await getSql();
    const rows = await sql<{
      serial: string;
      legal: number;
      provider: string;
      verify_url: string | null;
      hash: string;
      document_id: string | null;
      created_at: string;
    }>`select serial, legal, provider, verify_url, hash, document_id, created_at from emeterai_stamps where serial = ${serial} limit 1`.catch(
      () => [],
    );
    const row = rows[0];
    if (!row) return null;
    let title = "";
    if (row.document_id) {
      const d = await sql<{ title: string }>`select title from documents where id = ${row.document_id}`;
      title = d[0]?.title ?? "";
    }
    return {
      serial: row.serial,
      legal: Boolean(row.legal),
      provider: row.provider,
      verifyUrl: row.verify_url,
      hash: row.hash,
      title,
      createdAt: row.created_at,
    };
  });

export const markNotifications = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await sql`update notifications set read = true where user_id = ${context.userId}`;
    return { ok: true };
  });

export const updateCompany = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { name: string; legalName: string; npwp: string; address: string; city: string; phone: string }) => d)
  .handler(async ({ context, data }) => {
    await ensure(context.userId);
    const sql = await getSql();
    await sql`
      update companies set name = ${data.name}, legal_name = ${data.legalName}, npwp = ${data.npwp},
        address = ${data.address}, city = ${data.city}, phone = ${data.phone}
      where user_id = ${context.userId}
    `;
    return { ok: true };
  });

export const bulkSignDocs = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { ids: string[]; signatureData: string }) => d)
  .handler(async ({ context, data }) => {
    await ensure(context.userId);
    const ident = await userEmail(context.userId);
    for (const id of data.ids) {
      const packed = await getDocument({ data: id });
      if (!packed?.document) continue;
      const mine = packed.document.recipients.find(
        (r) => r.email === ident.email && r.status !== "signed" && r.action === "needs_to_sign",
      );
      if (!mine) continue;
      const fields = packed.document.fields.map((f) =>
        f.recipientId === mine.id && (f.type === "signature" || f.type === "initials")
          ? { ...f, value: data.signatureData }
          : f,
      );
      await applySignature({
        data: {
          id,
          recipientId: mine.id,
          fields,
          signatureData: data.signatureData,
        },
      });
    }
    return { ok: true };
  });

export const createFolder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((name: string) => name)
  .handler(async ({ context, data: name }) => {
    await ensure(context.userId);
    const sql = await getSql();
    const id = uid("fld");
    await sql`insert into folders (id, user_id, name) values (${id}, ${context.userId}, ${name.trim() || "Folder baru"})`;
    return { id };
  });

export const saveStamp = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { name: string; companyName?: string; dataUrl: string; remove?: boolean; id?: string }) => d)
  .handler(async ({ context, data }) => {
    await ensure(context.userId);
    const sql = await getSql();
    if (data.remove && data.id) {
      await sql`delete from stamps where id = ${data.id} and user_id = ${context.userId}`;
      return { ok: true };
    }
    await sql`update stamps set is_default = false where user_id = ${context.userId}`;
    await sql`
      insert into stamps (id, user_id, name, company_name, data_url, is_default)
      values (${uid("st")}, ${context.userId}, ${data.name}, ${data.companyName ?? ""}, ${data.dataUrl}, ${true})
    `;
    return { ok: true };
  });

export const saveTemplate = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { name: string; docType: string; description?: string; content: DocContent; fields?: DocField[]; remove?: boolean; id?: string }) => d)
  .handler(async ({ context, data }) => {
    await ensure(context.userId);
    const sql = await getSql();
    if (data.remove && data.id) {
      await sql`delete from templates where id = ${data.id} and user_id = ${context.userId}`;
      return { ok: true };
    }
    const fieldsJson = JSON.stringify(data.fields ?? []);
    const contentJson = JSON.stringify(data.content);
    if (data.id) {
      await sql`
        update templates set
          name = ${data.name},
          doc_type = ${data.docType},
          description = ${data.description ?? ""},
          content_json = ${contentJson},
          fields_json = ${fieldsJson}
        where id = ${data.id} and user_id = ${context.userId}
      `;
      return { ok: true, id: data.id };
    }
    const nid = uid("tpl");
    await sql`
      insert into templates (id, user_id, name, doc_type, description, content_json, fields_json)
      values (${nid}, ${context.userId}, ${data.name}, ${data.docType}, ${data.description ?? ""}, ${contentJson}, ${fieldsJson})
    `;
    return { ok: true, id: nid };
  });

export const saveApprovalTemplate = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id?: string; name: string; layers?: { layer: number; name: string; mode: string }[]; remove?: boolean }) => d)
  .handler(async ({ context, data }) => {
    await ensure(context.userId);
    const sql = await getSql();
    if (data.remove && data.id) {
      await sql`delete from approval_templates where id = ${data.id} and user_id = ${context.userId}`;
      return { ok: true };
    }
    const layers = JSON.stringify(data.layers?.length ? data.layers : [{ layer: 1, name: "Approver", mode: "all" }]);
    if (data.id) {
      await sql`update approval_templates set name = ${data.name}, layers_json = ${layers} where id = ${data.id} and user_id = ${context.userId}`;
      return { ok: true, id: data.id };
    }
    const nid = uid("apt");
    await sql`
      insert into approval_templates (id, user_id, name, layers_json)
      values (${nid}, ${context.userId}, ${data.name}, ${layers})
    `;
    return { ok: true, id: nid };
  });

export const addProof = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { title: string; notary?: string; witness?: string; notes?: string; remove?: boolean; id?: string }) => d)
  .handler(async ({ context, data }) => {
    await ensure(context.userId);
    const sql = await getSql();
    if (data.remove && data.id) {
      await sql`delete from signing_proofs where id = ${data.id} and user_id = ${context.userId}`;
      return { ok: true };
    }
    await sql`
      insert into signing_proofs (id, user_id, title, notary, witness, notes)
      values (${uid("sp")}, ${context.userId}, ${data.title}, ${data.notary ?? ""}, ${data.witness ?? ""}, ${data.notes ?? ""})
    `;
    return { ok: true };
  });

export const addRecipient = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { documentId: string; name: string; email: string; role?: string; companyName?: string }) => d)
  .handler(async ({ context, data }) => {
    await ensure(context.userId);
    const sql = await getSql();
    const ident = await userEmail(context.userId);
    const max = await sql<{ m: number }>`select coalesce(max(order_index), 0)::int as m from recipients where document_id = ${data.documentId}`;
    await sql`
      insert into recipients (id, user_id, document_id, name, email, role, action, status, order_index, company_name, invite_token)
      values (${uid("rc")}, ${context.userId}, ${data.documentId}, ${data.name}, ${data.email}, ${data.role ?? "signer"}, ${"needs_to_sign"}, ${"waiting"}, ${(max[0]?.m ?? 0) + 1}, ${data.companyName ?? ""}, ${uid("inv")})
    `;
    await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${context.userId}, ${data.documentId}, ${ident.name}, ${"Meneruskan / menambah penerima: " + data.email})`;
    await sql`update documents set status = 'waiting_for_others', updated_at = now() where id = ${data.documentId} and user_id = ${context.userId} and status = 'completed'`;
    return { ok: true };
  });

export const setPasscode = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: string; passcode: string | null }) => d)
  .handler(async ({ context, data }) => {
    await ensure(context.userId);
    const sql = await getSql();
    await sql`update documents set passcode = ${data.passcode}, updated_at = now() where id = ${data.id} and user_id = ${context.userId}`;
    return { ok: true };
  });

export const requestApproval = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { documentId?: string; name: string; approverName: string; approverEmail: string; mode?: string; message?: string }) => d)
  .handler(async ({ context, data }) => {
    await ensure(context.userId);
    const sql = await getSql();
    await sql`
      insert into approvals (id, user_id, document_id, name, layer, mode, approver_name, approver_email, status, note)
      values (
        ${uid("ap")}, ${context.userId}, ${data.documentId ?? null}, ${data.name}, 1,
        ${data.mode ?? "all"}, ${data.approverName}, ${data.approverEmail}, ${"pending"}, ${data.message ?? ""}
      )
    `;
    if (data.documentId) {
      await sql`update documents set status = 'pending_approval', updated_at = now() where id = ${data.documentId} and user_id = ${context.userId}`;
    }
    await issueWorkspaceTsa(context.userId, data.documentId ?? null, "approval.requested");
    void dispatchWebhook(context.userId, "approval.requested", { documentId: data.documentId, name: data.name });
    return { ok: true };
  });

export const getInsights = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensure(context.userId);
    const sql = await getSql();
    const docs = await sql<{
      status: string;
      doc_type: string;
      compliance: string;
      created_at: string;
      completed_at: string | null;
      sent_at: string | null;
    }>`
      select status, doc_type, compliance, created_at, completed_at, sent_at
      from documents where user_id = ${context.userId}
    `;
    const statusCounts: Record<string, number> = {};
    const typeCounts: Record<string, number> = {};
    const monthMap: Record<string, { sent: number; completed: number; voided: number; declined: number }> = {};
    let signHours = 0;
    let signN = 0;
    for (const d of docs) {
      statusCounts[d.status] = (statusCounts[d.status] ?? 0) + 1;
      typeCounts[d.doc_type] = (typeCounts[d.doc_type] ?? 0) + 1;
      const dt = new Date(d.sent_at ?? d.created_at);
      const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
      if (!monthMap[key]) monthMap[key] = { sent: 0, completed: 0, voided: 0, declined: 0 };
      if (d.sent_at) monthMap[key].sent += 1;
      if (d.status === "completed") monthMap[key].completed += 1;
      if (d.status === "voided") monthMap[key].voided += 1;
      if (d.status === "declined") monthMap[key].declined += 1;
      if (d.completed_at && d.sent_at) {
        signHours += (new Date(d.completed_at).getTime() - new Date(d.sent_at).getTime()) / 3600000;
        signN += 1;
      }
    }
    const months = Object.keys(monthMap)
      .sort()
      .slice(-6)
      .map((m) => ({ month: m, ...monthMap[m]! }));
    const quota = (await sql<{
      emeterai_used: number;
      emeterai_total: number;
    }>`select emeterai_used, emeterai_total from quotas where user_id = ${context.userId}`)[0];
    const psre = docs.filter((d) => d.compliance === "psre").length;
    const global = docs.filter((d) => d.compliance === "globalsign").length;
    return {
      total: docs.length,
      statusCounts,
      typeCounts,
      months,
      avgHours: signN ? signHours / signN : 0,
      signedCount: signN,
      emeteraiUsed: quota?.emeterai_used ?? 0,
      emeteraiTotal: quota?.emeterai_total ?? 0,
      emeteraiSpend: (quota?.emeterai_used ?? 0) * 10000,
      psre,
      global,
    };
  });

export const analyzeDocument = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { title: string; content: DocContent }) => d)
  .handler(async ({ context, data }) => {
    await ensure(context.userId);
    const payload = {
      title: data.title,
      number: data.content.number,
      parties: data.content.parties,
      clauses: data.content.clauses,
      amount: data.content.amount,
    };
    const prefs = await loadPrefs(context.userId);
    const conn = aiFrom(prefs.prefs);
    if (conn.apiKey) {
      const res = await chatComplete(conn, JSON.stringify(payload));
      if (res.ok) {
        const analysis = parseAiReview(res.text);
        return { ok: true as const, text: analysis.summary, local: analysis, provider: conn.provider };
      }
      return { ok: false as const, error: res.error ?? "AI error", local: localAnalyze(data.content, data.title), provider: conn.provider };
    }
    return { ok: false as const, error: "unavailable", local: localAnalyze(data.content, data.title), provider: conn.provider };
  });

function localAnalyze(content: DocContent, title: string) {
  const text = [title, ...content.clauses.map((c) => c.title + " " + c.body)].join(" ").toLowerCase();
  const findings: { level: string; title: string; detail: string }[] = [];
  if (!/sengketa|pengadilan|arbitrase/.test(text))
    findings.push({ level: "tinggi", title: "Klausul sengketa absen", detail: "Tidak ada forum penyelesaian sengketa. Disarankan musyawarah lalu PN yang disepakati." });
  if (!/rahasia|kerahasiaan|confidential/.test(text))
    findings.push({ level: "sedang", title: "Kerahasiaan lemah", detail: "Tidak ada kewajiban kerahasiaan tersurat." });
  if (!/force majeure|keadaan kahar/.test(text))
    findings.push({ level: "sedang", title: "Force majeure absen", detail: "Risiko keterlambatan di luar kendali tidak diatur." });
  if (/eksklusif/.test(text))
    findings.push({ level: "tinggi", title: "Eksklusivitas", detail: "Klausul eksklusif dapat membatasi wilayah usaha. Pastikan jangka waktu dan wilayah sempit." });
  if (!content.amount)
    findings.push({ level: "rendah", title: "Nilai tidak tercantum", detail: "Nominal transaksi tidak ada di naskah." });
  if (content.clauses.length < 4)
    findings.push({ level: "sedang", title: "Pasal tipis", detail: "Hanya " + content.clauses.length + " pasal. Pertimbangkan pengakhiran, denda, dan law of governing." });
  return {
    summary: `Analisis lokal atas “${title}”. ${content.parties.length} pihak, ${content.clauses.length} pasal.${content.amount ? " Nilai " + content.amount + "." : ""}`,
    findings,
  };
}

void (0 as unknown as Ctx);

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { name: string; phone?: string; address?: string; dob?: string }) => d)
  .handler(async ({ context, data }) => {
    await ensure(context.userId);
    const sql = await getSql();
    await sql`update "user" set name = ${data.name} where id = ${context.userId}`;
    const prefs = await loadPrefs(context.userId);
    const profile = { ...prefs.profile, phone: data.phone ?? "", address: data.address ?? "", dob: data.dob ?? "" };
    await sql`
      insert into workspace_prefs (user_id, profile_json) values (${context.userId}, ${JSON.stringify(profile)})
      on conflict (user_id) do update set profile_json = ${JSON.stringify(profile)}
    `.catch(async () => {
      await sql`update workspace_prefs set profile_json = ${JSON.stringify(profile)} where user_id = ${context.userId}`;
    });
    if (data.phone || data.address) {
      await sql`update companies set phone = ${data.phone ?? ""}, address = ${data.address ?? profile.address ?? ""} where user_id = ${context.userId}`;
    }
    return { ok: true };
  });

export const savePrefs = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { prefs?: Record<string, string>; notif?: Record<string, boolean>; email?: Record<string, string> }) => d)
  .handler(async ({ context, data }) => {
    await ensure(context.userId);
    const sql = await getSql();
    const cur = await loadPrefs(context.userId);
    const prefs = JSON.stringify(data.prefs ?? cur.prefs);
    const notif = JSON.stringify(data.notif ?? cur.notif);
    const email = JSON.stringify(data.email ?? cur.email);
    await sql`
      insert into workspace_prefs (user_id, prefs_json, notif_json, email_json)
      values (${context.userId}, ${prefs}, ${notif}, ${email})
      on conflict (user_id) do update set prefs_json = ${prefs}, notif_json = ${notif}, email_json = ${email}
    `.catch(async () => {
      await sql`update workspace_prefs set prefs_json = ${prefs}, notif_json = ${notif}, email_json = ${email} where user_id = ${context.userId}`;
    });
    return { ok: true };
  });

export const inviteMember = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { name: string; email: string; role?: string }) => d)
  .handler(async ({ context, data }) => {
    await ensure(context.userId);
    const sql = await getSql();
    await sql`
      insert into team_members (id, user_id, name, email, role, status, emeterai_assigned)
      values (${uid("tm")}, ${context.userId}, ${data.name}, ${data.email}, ${data.role ?? "Member"}, ${"invited"}, ${0})
    `;
    return { ok: true };
  });

export const assignEmeterai = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { memberId: string; qty: number }) => d)
  .handler(async ({ context, data }) => {
    await ensure(context.userId);
    const sql = await getSql();
    const n = Math.max(0, Math.min(500, data.qty));
    await sql`update team_members set emeterai_assigned = ${n} where id = ${data.memberId} and user_id = ${context.userId}`;
    return { ok: true };
  });

export const exportWorkspace = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensure(context.userId);
    const sql = await getSql();
    const docs = await sql<DocDB>`
      select d.*, f.name as folder_name from documents d
      left join folders f on f.id = d.folder_id
      where d.user_id = ${context.userId}
      order by d.updated_at desc
    `;
    const out = [];
    for (const row of docs) out.push(toDoc(row, await recsFor(row.id)));
    const audit = await sql<{
      document_id: string;
      actor: string;
      action: string;
      created_at: string;
    }>`select document_id, actor, action, created_at from audit_events where user_id = ${context.userId} order by created_at desc limit 400`;
    return { documents: out, audit };
  });

const DEMO_OWNER = "paraf-demo";

export const getDemoInvites = createServerFn({ method: "GET" }).handler(async () => {
  await ensure(DEMO_OWNER);
  const sql = await getSql();
  const docs = await sql<{ id: string; title: string; token: string }>`
    select id, title, token from documents
    where user_id = ${DEMO_OWNER} and status in ('need_to_sign', 'waiting_for_others')
    order by created_at desc limit 8
  `;
  const picked = docs[0];
  if (!picked) {
    const id = uid("doc");
    const token = uid("tok");
    const title = "PKS Distribusi — undangan mitra";
    const content = blankContent("kerjasama", title, "PT Nusantara Digital Pratama");
    await sql`
      insert into documents (
        id, user_id, title, doc_type, status, compliance, group_name, content_json, fields_json, settings_json, token, sent_at
      ) values (
        ${id}, ${DEMO_OWNER}, ${title}, ${"kerjasama"}, ${"waiting_for_others"}, ${"psre"}, ${"Demo"},
        ${JSON.stringify(content)}, ${"[]"}, ${JSON.stringify(DEFAULT_SETTINGS)}, ${token}, ${new Date().toISOString()}
      )
    `;
    const parties = [
      { name: "PT Nusantara Digital Pratama", email: "legal@nusantara.example" },
      { name: "CV Harmoni Niaga", email: "owner@harmoni.example" },
    ];
    for (const [i, p] of parties.entries()) {
      await sql`
        insert into recipients (id, user_id, document_id, name, email, role, action, status, order_index, invite_token)
        values (${uid("rc")}, ${DEMO_OWNER}, ${id}, ${p.name}, ${p.email}, ${"signer"}, ${"needs_to_sign"}, ${"waiting"}, ${i + 1}, ${uid("inv")})
      `;
    }
    const recs = await recsFor(id);
    return {
      title,
      invites: recs.map((r) => ({
        name: r.name,
        role: r.role,
        email: r.email,
        token: r.inviteToken || token,
        signed: r.status === "signed",
      })),
    };
  }
  const recs = await recsFor(picked.id);
  return {
    title: picked.title,
    invites: recs
      .filter((r) => r.role !== "cc")
      .map((r) => ({
        name: r.name,
        role: r.role,
        email: r.email,
        token: r.inviteToken || picked.token,
        signed: r.status === "signed",
      })),
  };
});


