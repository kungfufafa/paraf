import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { uid } from "@/lib/utils";
import { sha256Hex } from "@/lib/crypto-lite";
import { aiFrom, aiPublic, chatComplete, parseAiReview } from "@/lib/ai-providers";
import { verifyTsa, type TsaToken } from "@/lib/tsa";
import { byokFrom, byokPublic, envWebhook, fingerprintOf, loadByok } from "@/lib/byok";
import {
  WEBHOOK_EVENTS,
  assertSafeUrl,
  dispatchWebhook,
  ensureIntegrationTables,
  importedDoc,
  issueWorkspaceTsa,
  listTsa,
  listWebhookDeliveries,
  listWorkspaceEvents,
  readGoogleDriveFile,
  readOneDriveFile,
  searchGoogleDrive,
  searchOneDrive,
  textFromToolData,
} from "@/lib/integrations";

async function prefsOf(userId: string) {
  const sql = await getSql();
  const row = (await sql<{ prefs_json: string }>`select prefs_json from workspace_prefs where user_id = ${userId} limit 1`.catch(() => []))[0];
  try {
    return JSON.parse(row?.prefs_json || "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

async function writePrefs(userId: string, patch: Record<string, string>) {
  const sql = await getSql();
  const cur = await prefsOf(userId);
  const next = { ...cur, ...patch };
  const blob = JSON.stringify(next);
  await sql`
    insert into workspace_prefs (user_id, prefs_json) values (${userId}, ${blob})
    on conflict (user_id) do update set prefs_json = ${blob}
  `.catch(async () => {
    await sql`update workspace_prefs set prefs_json = ${blob} where user_id = ${userId}`;
  });
  return next;
}

export const getIntegrations = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await ensureIntegrationTables();
    const sql = await getSql();
    const prefs = await prefsOf(context.userId);
    const hooks = await sql<{
      id: string; url: string; events_json: string; active: number; last_status: number | null; last_error: string | null; created_at: string;
    }>`select id, url, events_json, active, last_status, last_error, created_at from webhooks where user_id = ${context.userId} order by created_at desc`;
    const keys = await sql<{ id: string; name: string; key_prefix: string; created_at: string }>`
      select id, name, key_prefix, created_at from api_keys where user_id = ${context.userId} order by created_at desc
    `;
    const head = (await sql<{ serial: string; head_hash: string }>`select serial, head_hash from tsa_heads where user_id = ${context.userId}`)[0];
    const tsaCount = (await sql<{ c: number }>`select count(*)::int as c from tsa_tokens where user_id = ${context.userId}`)[0]?.c ?? 0;
    const deliveries = await listWebhookDeliveries(context.userId);
    const stream = await listWorkspaceEvents(context.userId);
    const byok = byokFrom(prefs);
    const fp = await fingerprintOf(byok.pem);
    const env = envWebhook();
    return {
      ai: aiPublic(aiFrom(prefs)),
      byok: byokPublic(byok, fp),
      oneDrive: Boolean(prefs.onedriveToken),
      oneDriveHint: prefs.onedriveToken ? `••••${prefs.onedriveToken.slice(-4)}` : "",
      envWebhook: env
        ? { connected: true as const, urlHint: env.url.replace(/^(https?:\/\/[^/]+).*/, "$1/…") }
        : { connected: false as const, urlHint: "" },
      webhooks: hooks.map((h) => ({
        id: h.id,
        url: h.url,
        events: JSON.parse(h.events_json || "[]") as string[],
        active: Boolean(h.active),
        lastStatus: h.last_status,
        lastError: h.last_error,
        createdAt: h.created_at,
      })),
      apiKeys: keys,
      tsa: { serial: head?.serial ?? null, head: head?.head_hash ?? "genesis", count: tsaCount },
      events: [...WEBHOOK_EVENTS] as string[],
      deliveries: deliveries.map((d) => ({
        id: d.id,
        event: d.event,
        status: d.status,
        error: d.error,
        createdAt: d.created_at,
        webhookId: d.webhook_id,
      })),
      stream: stream.map((e) => ({
        id: e.id,
        event: e.event,
        payload: e.payload_json,
        createdAt: e.created_at,
      })),
    };
  });

export const saveAiConnector = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { provider: string; apiKey: string; baseUrl?: string; model?: string }) => d)
  .handler(async ({ context, data }) => {
    const prefs = await writePrefs(context.userId, {
      aiProvider: data.provider,
      aiApiKey: data.apiKey.trim() || (await prefsOf(context.userId)).aiApiKey || "",
      aiBaseUrl: data.baseUrl ?? "",
      aiModel: data.model ?? "",
    });
    return aiPublic(aiFrom(prefs));
  });

export const testAiConnector = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const conn = aiFrom(await prefsOf(context.userId));
    const res = await chatComplete(conn, "Reply with JSON {\"summary\":\"PARAFOK\",\"risks\":[],\"missing\":[],\"recommendations\":[]}");
    if (!res.ok) return { ok: false as const, error: res.error || "AI failed", provider: conn.provider };
    const parsed = parseAiReview(res.text);
    return { ok: true as const, text: parsed.summary || res.text.slice(0, 200), provider: conn.provider, model: conn.model };
  });

export const saveByok = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { secret?: string; pem?: string; generate?: boolean; clear?: boolean }) => d)
  .handler(async ({ context, data }) => {
    if (data.clear) {
      const prefs = await writePrefs(context.userId, { byokSecret: "", byokPem: "" });
      return { ...byokPublic(byokFrom(prefs)), secret: undefined as string | undefined };
    }
    let secret = (data.secret ?? "").trim();
    if (data.generate && !secret) {
      secret = `paraf_byok_${uid("k")}${uid("k")}`.replace(/-/g, "");
    }
    const cur = await prefsOf(context.userId);
    const prefs = await writePrefs(context.userId, {
      byokSecret: secret || cur.byokSecret || "",
      byokPem: data.pem !== undefined ? data.pem.trim() : cur.byokPem || "",
    });
    const conn = byokFrom(prefs);
    const fp = await fingerprintOf(conn.pem);
    return { ...byokPublic(conn, fp), secret: data.generate ? secret : undefined as string | undefined };
  });

export const testByok = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const conn = await loadByok(context.userId);
    if (!conn.secret) {
      return { ok: false as const, message: "No signing key yet. Generate or paste one — stamps still seal with the platform key (DEMO)." };
    }
    const token = await issueWorkspaceTsa(context.userId, null, "byok.test", { ping: true });
    const valid = await verifyTsa(context.userId, token);
    return {
      ok: valid,
      message: valid
        ? `BYOK live. Serial ${token.serial} sealed with your key (${conn.source}).`
        : "Key saved but verify failed.",
      serial: token.serial,
      policy: token.policy,
    };
  });

export const saveOneDriveToken = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { token: string }) => d)
  .handler(async ({ context, data }) => {
    await writePrefs(context.userId, { onedriveToken: data.token.trim() });
    return { ok: true };
  });

export const saveWebhook = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id?: string; url: string; secret?: string; events?: string[]; active?: boolean; remove?: boolean }) => d)
  .handler(async ({ context, data }) => {
    await ensureIntegrationTables();
    const sql = await getSql();
    if (data.remove && data.id) {
      await sql`delete from webhooks where id = ${data.id} and user_id = ${context.userId}`;
      return { ok: true };
    }
    if (!data.remove) assertSafeUrl(data.url);
    const events = JSON.stringify(data.events?.length ? data.events : [...WEBHOOK_EVENTS]);
    if (data.id) {
      await sql`update webhooks set url = ${data.url}, events_json = ${events}, active = ${data.active === false ? 0 : 1} where id = ${data.id} and user_id = ${context.userId}`;
      return { ok: true };
    }
    const secret = data.secret?.trim() || uid("whsec");
    await sql`
      insert into webhooks (id, user_id, url, secret, events_json, active)
      values (${uid("wh")}, ${context.userId}, ${data.url}, ${secret}, ${events}, ${1})
    `;
    return { ok: true, secret };
  });

export const pingWebhook = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    await dispatchWebhook(
      context.userId,
      "document.sent",
      { ping: true, webhookId: id, at: new Date().toISOString() },
      { webhookId: id === "*" ? undefined : id, force: true },
    );
    const sql = await getSql();
    if (id === "*" || id === "env") return { ok: true, status: 200, error: "" };
    const row = (await sql<{ last_status: number | null; last_error: string | null }>`
      select last_status, last_error from webhooks where id = ${id} and user_id = ${context.userId}
    `)[0];
    return { ok: true, status: row?.last_status ?? null, error: row?.last_error ?? "" };
  });

export const emitTestEvent = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    await dispatchWebhook(context.userId, "document.sent", {
      ping: true,
      source: "webhooks-module",
      at: new Date().toISOString(),
    });
    return { ok: true };
  });

export const createApiKey = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { name: string }) => d)
  .handler(async ({ context, data }) => {
    await ensureIntegrationTables();
    const sql = await getSql();
    const raw = `paraf_live_${uid("k")}${uid("k")}`.replace(/-/g, "");
    const hash = await sha256Hex(raw);
    await sql`
      insert into api_keys (id, user_id, name, key_hash, key_prefix)
      values (${uid("ak")}, ${context.userId}, ${data.name || "HRIS/ERP"}, ${hash}, ${raw.slice(0, 14) + "…"})
    `;
    return { key: raw };
  });

export const revokeApiKey = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id)
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await sql`delete from api_keys where id = ${id} and user_id = ${context.userId}`;
    return { ok: true };
  });

export const listCloudFiles = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { source: "gdrive" | "onedrive"; q?: string }) => d)
  .handler(async ({ context, data }) => {
    if (data.source === "gdrive") return searchGoogleDrive(data.q || "pdf");
    const prefs = await prefsOf(context.userId);
    return searchOneDrive(prefs.onedriveToken || "", data.q || "pdf");
  });

export const importCloudFile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { source: "gdrive" | "onedrive"; id: string; name: string }) => d)
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const co = (await sql<{ name: string }>`select name from companies where user_id = ${context.userId} limit 1`)[0];
    const company = co?.name || "Paraf";
    if (data.source === "gdrive") {
      const file = await readGoogleDriveFile(data.id);
      if (!file.ok) {
        return {
          ok: false as const,
          name: data.name,
          preview: file.errorMessage,
          loginRequired: file.loginRequired,
          loginUrl: file.loginUrl,
        };
      }
      const pack = importedDoc(data.name, textFromToolData(file.data), company);
      return { ok: true as const, name: pack.name, content: pack.content, preview: "Imported from Google Drive" };
    }
    const prefs = await prefsOf(context.userId);
    const od = await readOneDriveFile(prefs.onedriveToken || "", data.id);
    if (!od.ok) return { ok: false as const, name: data.name, preview: od.error };
    const pack = importedDoc(od.name || data.name, od.text, company);
    return { ok: true as const, name: pack.name, content: pack.content, preview: "Imported from OneDrive" };
  });

export const getTsaChain = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((d?: { documentId?: string }) => d ?? {})
  .handler(async ({ context, data }) => {
    const rows = await listTsa(context.userId, data.documentId);
    return rows.map((r) => ({
      serial: r.serial,
      token: JSON.parse(r.token_json) as Record<string, string>,
      createdAt: r.created_at,
      documentId: r.document_id,
    }));
  });

export const lookupTsa = createServerFn({ method: "GET" })
  .validator((serial: string) => serial)
  .handler(async ({ data: serial }) => {
    await ensureIntegrationTables();
    const sql = await getSql();
    const row = (
      await sql<{ serial: string; token_json: string; document_id: string | null; created_at: string; user_id: string }>`
        select serial, token_json, document_id, created_at, user_id from tsa_tokens where serial = ${serial} limit 1
      `
    )[0];
    if (!row) return null;
    const token = JSON.parse(row.token_json) as TsaToken;
    const valid = await verifyTsa(row.user_id, token);
    let title = "";
    if (row.document_id) {
      const d = await sql<{ title: string }>`select title from documents where id = ${row.document_id}`;
      title = d[0]?.title ?? "";
    }
    return { serial: row.serial, token, title, createdAt: row.created_at, valid };
  });
