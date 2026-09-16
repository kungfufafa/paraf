import { getSql } from "@/lib/db";
import { uid } from "@/lib/utils";
import { assertSafeUrl, hmacSha256Hex, sha256Hex } from "@/lib/crypto-lite";
import { eventHash, sealTsa, type TsaToken } from "@/lib/tsa";
import { ConnectorType, GoogleDriveTools } from "@/lib/app-data";
import { isLoginRequired, redirectToLoginIfRequired } from "@/lib/app-data";
import { contentFromImportedFile } from "@/lib/doc-helpers";
import type { DocContent } from "@/lib/types";
import { envWebhook } from "@/lib/byok";

export { isLoginRequired, redirectToLoginIfRequired };

export const WEBHOOK_EVENTS = [
  "document.sent",
  "document.signed",
  "document.completed",
  "document.declined",
  "document.voided",
  "document.reminded",
  "approval.requested",
  "approval.decided",
] as const;

export type WebhookEvent = (typeof WEBHOOK_EVENTS)[number];

export async function ensureIntegrationTables() {
  const sql = await getSql();
  await sql.query(
    `create table if not exists webhooks (
      id text primary key, user_id text not null, url text not null, secret text not null,
      events_json text not null default '[]', active integer not null default 1,
      last_status integer, last_error text, created_at timestamptz not null default now())`,
  ).catch(() => undefined);
  await sql.query(
    `create table if not exists api_keys (
      id text primary key, user_id text not null, name text not null, key_hash text not null,
      key_prefix text not null, created_at timestamptz not null default now())`,
  ).catch(() => undefined);
  await sql.query(
    `create table if not exists tsa_tokens (
      id text primary key, user_id text not null, document_id text, serial text not null,
      hash text not null, prev_hash text not null, token_json text not null,
      created_at timestamptz not null default now())`,
  ).catch(() => undefined);
  await sql.query(
    `create table if not exists tsa_heads (
      user_id text primary key, head_hash text not null, serial text not null, updated_at timestamptz not null default now())`,
  ).catch(() => undefined);
  await sql.query(
    `create table if not exists webhook_deliveries (
      id text primary key, user_id text not null, webhook_id text not null, event text not null,
      status integer, error text, created_at timestamptz not null default now())`,
  ).catch(() => undefined);
  await sql.query(
    `create table if not exists workspace_events (
      id text primary key, user_id text not null, event text not null, payload_json text not null,
      created_at timestamptz not null default now())`,
  ).catch(() => undefined);
}

export async function issueWorkspaceTsa(userId: string, documentId: string | null, action: string, extra?: Record<string, unknown>) {
  await ensureIntegrationTables();
  const sql = await getSql();
  const head = (
    await sql<{ head_hash: string }>`select head_hash from tsa_heads where user_id = ${userId}`.catch(() => [])
  )[0];
  const payloadHash = await eventHash({ documentId, action, extra, t: Date.now() });
  const token = await sealTsa({ userId, payloadHash, prev: head?.head_hash || "genesis" });
  const nextHead = await sha256Hex(token.mac);
  await sql`
    insert into tsa_tokens (id, user_id, document_id, serial, hash, prev_hash, token_json)
    values (${uid("tsa")}, ${userId}, ${documentId}, ${token.serial}, ${token.hash}, ${token.prev}, ${JSON.stringify(token)})
  `.catch(() => undefined);
  await sql`
    insert into tsa_heads (user_id, head_hash, serial) values (${userId}, ${nextHead}, ${token.serial})
    on conflict (user_id) do update set head_hash = ${nextHead}, serial = ${token.serial}, updated_at = now()
  `.catch(async () => {
    await sql`update tsa_heads set head_hash = ${nextHead}, serial = ${token.serial}, updated_at = now() where user_id = ${userId}`;
  });
  return token;
}

export async function listTsa(userId: string, documentId?: string) {
  await ensureIntegrationTables();
  const sql = await getSql();
  if (documentId) {
    return sql<{ serial: string; token_json: string; created_at: string; document_id: string | null }>`
      select serial, token_json, created_at, document_id from tsa_tokens where user_id = ${userId} and document_id = ${documentId} order by created_at asc
    `;
  }
  return sql<{ serial: string; token_json: string; created_at: string; document_id: string | null }>`
    select serial, token_json, created_at, document_id from tsa_tokens where user_id = ${userId} order by created_at desc limit 80
  `;
}

export async function listWebhookDeliveries(userId: string) {
  await ensureIntegrationTables();
  const sql = await getSql();
  return sql<{ id: string; event: string; status: number | null; error: string | null; created_at: string; webhook_id: string }>`
    select id, event, status, error, created_at, webhook_id from webhook_deliveries
    where user_id = ${userId} order by created_at desc limit 40
  `.catch(() => []);
}

export async function listWorkspaceEvents(userId: string) {
  await ensureIntegrationTables();
  const sql = await getSql();
  return sql<{ id: string; event: string; payload_json: string; created_at: string }>`
    select id, event, payload_json, created_at from workspace_events
    where user_id = ${userId} order by created_at desc limit 50
  `.catch(() => []);
}

type HookRow = { id: string; url: string; secret: string; events_json: string; active: number };

async function postHook(hook: HookRow, event: string, ts: string, payload: string): Promise<{ status: number; error: string }> {
  const sig = await hmacSha256Hex(hook.secret, `${ts}.${payload}`);
  const attempt = async () => {
    const res = await fetch(hook.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Paraf-Event": event,
        "X-Paraf-Timestamp": ts,
        "X-Paraf-Signature": `sha256=${sig}`,
        "X-Paraf-Delivery": uid("del"),
      },
      body: payload,
      signal: AbortSignal.timeout(5000),
    });
    const err = res.ok ? "" : (await res.text()).slice(0, 180);
    return { status: res.status, error: err };
  };
  try {
    const first = await attempt();
    if (first.status >= 500) {
      await new Promise((r) => setTimeout(r, 400));
      try {
        return await attempt();
      } catch {
        return first;
      }
    }
    return first;
  } catch (e) {
    const msg = e instanceof Error ? e.message : "failed";
    return { status: 0, error: msg };
  }
}

export async function dispatchWebhook(
  userId: string,
  event: WebhookEvent,
  body: Record<string, unknown>,
  opts?: { webhookId?: string; force?: boolean },
) {
  await ensureIntegrationTables();
  const sql = await getSql();
  const ts = Math.floor(Date.now() / 1000).toString();
  const evtId = uid("evt");
  const payload = JSON.stringify({ id: evtId, event, ts, data: body });
  await sql`
    insert into workspace_events (id, user_id, event, payload_json)
    values (${evtId}, ${userId}, ${event}, ${payload})
  `.catch(() => undefined);

  const rows = await sql<HookRow>`
    select id, url, secret, events_json, active from webhooks where user_id = ${userId} and active = 1
  `.catch(() => []);
  const env = envWebhook();
  const all: HookRow[] = [...rows];
  if (env) {
    all.push({ id: "env", url: env.url, secret: env.secret, events_json: '["*"]', active: 1 });
  }
  const targets = opts?.webhookId ? all.filter((h) => h.id === opts.webhookId) : all;

  await Promise.all(
    targets.map(async (hook) => {
      const events = JSON.parse(hook.events_json || "[]") as string[];
      if (!opts?.force && events.length && !events.includes(event) && !events.includes("*")) return;
      const result = await postHook(hook, event, ts, payload);
      if (hook.id !== "env") {
        await sql`update webhooks set last_status = ${result.status}, last_error = ${result.error} where id = ${hook.id}`.catch(
          () => undefined,
        );
      }
      await sql`
        insert into webhook_deliveries (id, user_id, webhook_id, event, status, error)
        values (${uid("wd")}, ${userId}, ${hook.id}, ${event}, ${result.status}, ${result.error})
      `.catch(() => undefined);
    }),
  );
}

export async function userIdFromApiKey(raw: string | null): Promise<string | null> {
  if (!raw) return null;
  const token = raw.replace(/^Bearer\s+/i, "").trim();
  if (!token.startsWith("paraf_")) return null;
  await ensureIntegrationTables();
  const sql = await getSql();
  const hash = await sha256Hex(token);
  const row = (await sql<{ user_id: string }>`select user_id from api_keys where key_hash = ${hash} limit 1`)[0];
  return row?.user_id ?? null;
}

export type CloudFile = { id: string; name: string; mime?: string; source: "gdrive" | "onedrive" };

function asFileList(raw: unknown): { id?: string; name?: string; mimeType?: string; title?: string }[] {
  if (Array.isArray(raw)) return raw as { id?: string; name?: string; mimeType?: string; title?: string }[];
  if (raw && typeof raw === "object") {
    const o = raw as { files?: unknown[]; items?: unknown[]; value?: unknown[] };
    const list = o.files ?? o.items ?? o.value ?? [];
    if (Array.isArray(list)) return list as { id?: string; name?: string; mimeType?: string; title?: string }[];
  }
  return [];
}

export function textFromToolData(data: unknown): string {
  if (!data) return "";
  if (typeof data === "string") return data;
  if (typeof data === "object") {
    const o = data as Record<string, unknown>;
    for (const k of ["text", "content", "body", "data", "markdown", "html", "extractedText"]) {
      if (typeof o[k] === "string") return o[k] as string;
    }
    if (Array.isArray(o.parts)) {
      return (o.parts as unknown[])
        .map((p) => (typeof p === "string" ? p : textFromToolData(p)))
        .join("\n");
    }
    try {
      return JSON.stringify(data).slice(0, 12000);
    } catch {
      return "";
    }
  }
  return String(data);
}

export async function searchGoogleDrive(q: string): Promise<{ files: CloudFile[]; loginRequired?: boolean; loginUrl?: string; error?: string }> {
  const { callTool } = await import("@/lib/app-data/client.server");
  const res = await callTool(GoogleDriveTools.search, { q: q || "pdf" }, { connectorType: ConnectorType.GoogleDrive });
  if (!res.ok) {
    return { files: [], loginRequired: res.loginRequired, loginUrl: res.loginUrl, error: res.errorMessage };
  }
  let files: CloudFile[] = asFileList(res.data)
    .filter((f) => f && (f.id || f.name))
    .map((f) => ({
      id: String(f.id ?? f.name),
      name: String(f.name ?? f.title ?? "Untitled"),
      mime: f.mimeType,
      source: "gdrive" as const,
    }));
  if (!files.length) {
    const listed = await callTool(GoogleDriveTools.listFolder, { folderId: "root", id: "root" }, { connectorType: ConnectorType.GoogleDrive });
    if (listed.ok) {
      files = asFileList(listed.data)
        .filter((f) => f && (f.id || f.name))
        .map((f) => ({
          id: String(f.id ?? f.name),
          name: String(f.name ?? f.title ?? "Untitled"),
          mime: f.mimeType,
          source: "gdrive" as const,
        }));
    }
  }
  return { files };
}

export async function readGoogleDriveFile(fileId: string) {
  const { callTool } = await import("@/lib/app-data/client.server");
  const res = await callTool(GoogleDriveTools.readFile, { fileId, id: fileId }, { connectorType: ConnectorType.GoogleDrive });
  return res;
}

export async function searchOneDrive(token: string, q: string): Promise<{ files: CloudFile[]; error?: string }> {
  if (!token) return { files: [], error: "Connect OneDrive in Settings (paste a Microsoft Graph token)." };
  try {
    const url = `https://graph.microsoft.com/v1.0/me/drive/root/search(q='${encodeURIComponent(q || "pdf")}')?$top=20&$select=id,name,file`;
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    const body = (await res.json()) as { value?: { id: string; name: string }[]; error?: { message?: string } };
    if (!res.ok) return { files: [], error: body.error?.message || `Graph ${res.status}` };
    let files = (body.value ?? []).map((f) => ({ id: f.id, name: f.name, source: "onedrive" as const }));
    if (!files.length) {
      const kids = await fetch("https://graph.microsoft.com/v1.0/me/drive/root/children?$top=20&$select=id,name,file", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const kidBody = (await kids.json()) as { value?: { id: string; name: string }[] };
      files = (kidBody.value ?? []).map((f) => ({ id: f.id, name: f.name, source: "onedrive" as const }));
    }
    return { files };
  } catch (e) {
    return { files: [], error: e instanceof Error ? e.message : "OneDrive failed" };
  }
}

export async function readOneDriveFile(token: string, id: string): Promise<{ ok: boolean; name: string; text: string; error?: string }> {
  if (!token) return { ok: false, name: "", text: "", error: "No OneDrive token" };
  try {
    const metaRes = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${encodeURIComponent(id)}?$select=id,name,file,size`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const meta = (await metaRes.json()) as { name?: string; error?: { message?: string } };
    if (!metaRes.ok) return { ok: false, name: "", text: "", error: meta.error?.message || `Graph ${metaRes.status}` };
    const contentRes = await fetch(`https://graph.microsoft.com/v1.0/me/drive/items/${encodeURIComponent(id)}/content`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!contentRes.ok) return { ok: true, name: meta.name || "OneDrive file", text: "" };
    const buf = await contentRes.arrayBuffer();
    const raw = new TextDecoder("utf-8", { fatal: false }).decode(buf);
    const printable = raw.replace(/[^\t\n\r\x20-\x7e\u00a0-\uffff]/g, " ").replace(/\s+/g, " ").trim();
    return { ok: true, name: meta.name || "OneDrive file", text: printable.length > 40 ? printable.slice(0, 20000) : "" };
  } catch (e) {
    return { ok: false, name: "", text: "", error: e instanceof Error ? e.message : "OneDrive read failed" };
  }
}

export function importedDoc(name: string, text: string, company = "Paraf"): { name: string; content: DocContent } {
  return { name, content: contentFromImportedFile(name, text, company) };
}

export { assertSafeUrl };
export type { TsaToken };
