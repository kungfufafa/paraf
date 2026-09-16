import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CGdnV_aG.mjs";
import { A as readOneDriveFile, B as verifyTsa, C as listTsa, E as loadByok, F as sha256Hex, L as textFromToolData, N as searchGoogleDrive, P as searchOneDrive, R as uid, S as issueWorkspaceTsa, T as listWorkspaceEvents, a as byokFrom, b as importedDoc, f as ensureIntegrationTables, h as fingerprintOf, k as readGoogleDriveFile, n as WEBHOOK_EVENTS, o as byokPublic, p as envWebhook, r as assertSafeUrl, u as dispatchWebhook, w as listWebhookDeliveries, y as getSql } from "./integrations-BY7zkbKR.mjs";
import { a as parseAiReview, i as createServerRpc, n as aiPublic, r as chatComplete, t as aiFrom } from "./ai-providers-CQVzkqqu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/integrations-api-nZ7uhti0.js
async function prefsOf(userId) {
	const row = (await (await getSql())`select prefs_json from workspace_prefs where user_id = ${userId} limit 1`.catch(() => []))[0];
	try {
		return JSON.parse(row?.prefs_json || "{}");
	} catch {
		return {};
	}
}
async function writePrefs(userId, patch) {
	const sql = await getSql();
	const next = {
		...await prefsOf(userId),
		...patch
	};
	const blob = JSON.stringify(next);
	await sql`
    insert into workspace_prefs (user_id, prefs_json) values (${userId}, ${blob})
    on conflict (user_id) do update set prefs_json = ${blob}
  `.catch(async () => {
		await sql`update workspace_prefs set prefs_json = ${blob} where user_id = ${userId}`;
	});
	return next;
}
var getIntegrations_createServerFn_handler = createServerRpc({
	id: "44e996d159d36e38165f7790ef312bca2c1fe92a762bf77e3b46f98f11a7b221",
	name: "getIntegrations",
	filename: "src/lib/integrations-api.ts"
}, (opts) => getIntegrations.__executeServer(opts));
var getIntegrations = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getIntegrations_createServerFn_handler, async ({ context }) => {
	await ensureIntegrationTables();
	const sql = await getSql();
	const prefs = await prefsOf(context.userId);
	const hooks = await sql`select id, url, events_json, active, last_status, last_error, created_at from webhooks where user_id = ${context.userId} order by created_at desc`;
	const keys = await sql`
      select id, name, key_prefix, created_at from api_keys where user_id = ${context.userId} order by created_at desc
    `;
	const head = (await sql`select serial, head_hash from tsa_heads where user_id = ${context.userId}`)[0];
	const tsaCount = (await sql`select count(*)::int as c from tsa_tokens where user_id = ${context.userId}`)[0]?.c ?? 0;
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
		envWebhook: env ? {
			connected: true,
			urlHint: env.url.replace(/^(https?:\/\/[^/]+).*/, "$1/…")
		} : {
			connected: false,
			urlHint: ""
		},
		webhooks: hooks.map((h) => ({
			id: h.id,
			url: h.url,
			events: JSON.parse(h.events_json || "[]"),
			active: Boolean(h.active),
			lastStatus: h.last_status,
			lastError: h.last_error,
			createdAt: h.created_at
		})),
		apiKeys: keys,
		tsa: {
			serial: head?.serial ?? null,
			head: head?.head_hash ?? "genesis",
			count: tsaCount
		},
		events: [...WEBHOOK_EVENTS],
		deliveries: deliveries.map((d) => ({
			id: d.id,
			event: d.event,
			status: d.status,
			error: d.error,
			createdAt: d.created_at,
			webhookId: d.webhook_id
		})),
		stream: stream.map((e) => ({
			id: e.id,
			event: e.event,
			payload: e.payload_json,
			createdAt: e.created_at
		}))
	};
});
var saveAiConnector_createServerFn_handler = createServerRpc({
	id: "bfa8295f92a22390ee0118f52de3f24fb41eb3f114f84fe13a4a70a3d8c80144",
	name: "saveAiConnector",
	filename: "src/lib/integrations-api.ts"
}, (opts) => saveAiConnector.__executeServer(opts));
var saveAiConnector = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveAiConnector_createServerFn_handler, async ({ context, data }) => {
	const prefs = await writePrefs(context.userId, {
		aiProvider: data.provider,
		aiApiKey: data.apiKey.trim() || (await prefsOf(context.userId)).aiApiKey || "",
		aiBaseUrl: data.baseUrl ?? "",
		aiModel: data.model ?? ""
	});
	return aiPublic(aiFrom(prefs));
});
var testAiConnector_createServerFn_handler = createServerRpc({
	id: "7e16d315549dc0003a90cf3a2c585489fd7cf2cc237db50674323fa9f2d2639c",
	name: "testAiConnector",
	filename: "src/lib/integrations-api.ts"
}, (opts) => testAiConnector.__executeServer(opts));
var testAiConnector = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(testAiConnector_createServerFn_handler, async ({ context }) => {
	const conn = aiFrom(await prefsOf(context.userId));
	const res = await chatComplete(conn, "Reply with JSON {\"summary\":\"PARAFOK\",\"risks\":[],\"missing\":[],\"recommendations\":[]}");
	if (!res.ok) return {
		ok: false,
		error: res.error || "AI failed",
		provider: conn.provider
	};
	return {
		ok: true,
		text: parseAiReview(res.text).summary || res.text.slice(0, 200),
		provider: conn.provider,
		model: conn.model
	};
});
var saveByok_createServerFn_handler = createServerRpc({
	id: "7f1606787e69b65c21733befcf01ddc551f21f55c5b0a992ae8d96ba42974b65",
	name: "saveByok",
	filename: "src/lib/integrations-api.ts"
}, (opts) => saveByok.__executeServer(opts));
var saveByok = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveByok_createServerFn_handler, async ({ context, data }) => {
	if (data.clear) {
		const prefs = await writePrefs(context.userId, {
			byokSecret: "",
			byokPem: ""
		});
		return {
			...byokPublic(byokFrom(prefs)),
			secret: void 0
		};
	}
	let secret = (data.secret ?? "").trim();
	if (data.generate && !secret) secret = `paraf_byok_${uid("k")}${uid("k")}`.replace(/-/g, "");
	const cur = await prefsOf(context.userId);
	const prefs = await writePrefs(context.userId, {
		byokSecret: secret || cur.byokSecret || "",
		byokPem: data.pem !== void 0 ? data.pem.trim() : cur.byokPem || ""
	});
	const conn = byokFrom(prefs);
	const fp = await fingerprintOf(conn.pem);
	return {
		...byokPublic(conn, fp),
		secret: data.generate ? secret : void 0
	};
});
var testByok_createServerFn_handler = createServerRpc({
	id: "3d9acf1f8044b1ade7ec7f6dbb658a7aa472b9a068fc6a350a16c2586b220c72",
	name: "testByok",
	filename: "src/lib/integrations-api.ts"
}, (opts) => testByok.__executeServer(opts));
var testByok = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(testByok_createServerFn_handler, async ({ context }) => {
	const conn = await loadByok(context.userId);
	if (!conn.secret) return {
		ok: false,
		message: "No signing key yet. Generate or paste one — stamps still seal with the platform key (DEMO)."
	};
	const token = await issueWorkspaceTsa(context.userId, null, "byok.test", { ping: true });
	const valid = await verifyTsa(context.userId, token);
	return {
		ok: valid,
		message: valid ? `BYOK live. Serial ${token.serial} sealed with your key (${conn.source}).` : "Key saved but verify failed.",
		serial: token.serial,
		policy: token.policy
	};
});
var saveOneDriveToken_createServerFn_handler = createServerRpc({
	id: "191764417ef1e105e093d5180882cbf032bbfc7b6ac16663833eb9b06b7d1e97",
	name: "saveOneDriveToken",
	filename: "src/lib/integrations-api.ts"
}, (opts) => saveOneDriveToken.__executeServer(opts));
var saveOneDriveToken = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveOneDriveToken_createServerFn_handler, async ({ context, data }) => {
	await writePrefs(context.userId, { onedriveToken: data.token.trim() });
	return { ok: true };
});
var saveWebhook_createServerFn_handler = createServerRpc({
	id: "9e9bf8cb30d8e1fa3151e3bddd0de28e281ccb27fba438779926fe897346b9a0",
	name: "saveWebhook",
	filename: "src/lib/integrations-api.ts"
}, (opts) => saveWebhook.__executeServer(opts));
var saveWebhook = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveWebhook_createServerFn_handler, async ({ context, data }) => {
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
	return {
		ok: true,
		secret
	};
});
var pingWebhook_createServerFn_handler = createServerRpc({
	id: "945cbc161475ef62df529ff54c2cad375f872eda865890bbd3e67c79de8d4e6f",
	name: "pingWebhook",
	filename: "src/lib/integrations-api.ts"
}, (opts) => pingWebhook.__executeServer(opts));
var pingWebhook = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(pingWebhook_createServerFn_handler, async ({ context, data: id }) => {
	await dispatchWebhook(context.userId, "document.sent", {
		ping: true,
		webhookId: id,
		at: (/* @__PURE__ */ new Date()).toISOString()
	}, {
		webhookId: id === "*" ? void 0 : id,
		force: true
	});
	const sql = await getSql();
	if (id === "*" || id === "env") return {
		ok: true,
		status: 200,
		error: ""
	};
	const row = (await sql`
      select last_status, last_error from webhooks where id = ${id} and user_id = ${context.userId}
    `)[0];
	return {
		ok: true,
		status: row?.last_status ?? null,
		error: row?.last_error ?? ""
	};
});
var emitTestEvent_createServerFn_handler = createServerRpc({
	id: "03a984e9ee752757a8bb1d0617fb84d89c59392392e19c24387ddff4bccd0008",
	name: "emitTestEvent",
	filename: "src/lib/integrations-api.ts"
}, (opts) => emitTestEvent.__executeServer(opts));
var emitTestEvent = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(emitTestEvent_createServerFn_handler, async ({ context }) => {
	await dispatchWebhook(context.userId, "document.sent", {
		ping: true,
		source: "webhooks-module",
		at: (/* @__PURE__ */ new Date()).toISOString()
	});
	return { ok: true };
});
var createApiKey_createServerFn_handler = createServerRpc({
	id: "aba9b6034f0a693c10c8ed2b8e2acd0461555c811bc5526227b88cd95fdb80ee",
	name: "createApiKey",
	filename: "src/lib/integrations-api.ts"
}, (opts) => createApiKey.__executeServer(opts));
var createApiKey = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createApiKey_createServerFn_handler, async ({ context, data }) => {
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
var revokeApiKey_createServerFn_handler = createServerRpc({
	id: "915150cc1bcbe3ad90bbfd75fa7b8acb8b224c8a65bdbb25d8faa78f7a7c1675",
	name: "revokeApiKey",
	filename: "src/lib/integrations-api.ts"
}, (opts) => revokeApiKey.__executeServer(opts));
var revokeApiKey = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id).handler(revokeApiKey_createServerFn_handler, async ({ context, data: id }) => {
	await (await getSql())`delete from api_keys where id = ${id} and user_id = ${context.userId}`;
	return { ok: true };
});
var listCloudFiles_createServerFn_handler = createServerRpc({
	id: "4e9302eafe4c4734915c459c5f43f8b8430c361878bce2a36005ddb06a9f9839",
	name: "listCloudFiles",
	filename: "src/lib/integrations-api.ts"
}, (opts) => listCloudFiles.__executeServer(opts));
var listCloudFiles = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(listCloudFiles_createServerFn_handler, async ({ context, data }) => {
	if (data.source === "gdrive") return searchGoogleDrive(data.q || "pdf");
	const prefs = await prefsOf(context.userId);
	return searchOneDrive(prefs.onedriveToken || "", data.q || "pdf");
});
var importCloudFile_createServerFn_handler = createServerRpc({
	id: "51f98eb140177329d17f7006302002c3d75eb8f02c36e0ed4987bea8db4732bf",
	name: "importCloudFile",
	filename: "src/lib/integrations-api.ts"
}, (opts) => importCloudFile.__executeServer(opts));
var importCloudFile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(importCloudFile_createServerFn_handler, async ({ context, data }) => {
	const company = (await (await getSql())`select name from companies where user_id = ${context.userId} limit 1`)[0]?.name || "Paraf";
	if (data.source === "gdrive") {
		const file = await readGoogleDriveFile(data.id);
		if (!file.ok) return {
			ok: false,
			name: data.name,
			preview: file.errorMessage,
			loginRequired: file.loginRequired,
			loginUrl: file.loginUrl
		};
		const pack = importedDoc(data.name, textFromToolData(file.data), company);
		return {
			ok: true,
			name: pack.name,
			content: pack.content,
			preview: "Imported from Google Drive"
		};
	}
	const prefs = await prefsOf(context.userId);
	const od = await readOneDriveFile(prefs.onedriveToken || "", data.id);
	if (!od.ok) return {
		ok: false,
		name: data.name,
		preview: od.error
	};
	const pack = importedDoc(od.name || data.name, od.text, company);
	return {
		ok: true,
		name: pack.name,
		content: pack.content,
		preview: "Imported from OneDrive"
	};
});
var getTsaChain_createServerFn_handler = createServerRpc({
	id: "dcaa17b4ed10bfaa798d1ee0c369916a5be826b7a3199248c6db18842bb5e04b",
	name: "getTsaChain",
	filename: "src/lib/integrations-api.ts"
}, (opts) => getTsaChain.__executeServer(opts));
var getTsaChain = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d ?? {}).handler(getTsaChain_createServerFn_handler, async ({ context, data }) => {
	return (await listTsa(context.userId, data.documentId)).map((r) => ({
		serial: r.serial,
		token: JSON.parse(r.token_json),
		createdAt: r.created_at,
		documentId: r.document_id
	}));
});
var lookupTsa_createServerFn_handler = createServerRpc({
	id: "3891e4780d51cbd9cecf64bad910a1eef0ae061192b85791a5b0d50478d765bc",
	name: "lookupTsa",
	filename: "src/lib/integrations-api.ts"
}, (opts) => lookupTsa.__executeServer(opts));
var lookupTsa = createServerFn({ method: "GET" }).validator((serial) => serial).handler(lookupTsa_createServerFn_handler, async ({ data: serial }) => {
	await ensureIntegrationTables();
	const sql = await getSql();
	const row = (await sql`
        select serial, token_json, document_id, created_at, user_id from tsa_tokens where serial = ${serial} limit 1
      `)[0];
	if (!row) return null;
	const token = JSON.parse(row.token_json);
	const valid = await verifyTsa(row.user_id, token);
	let title = "";
	if (row.document_id) title = (await sql`select title from documents where id = ${row.document_id}`)[0]?.title ?? "";
	return {
		serial: row.serial,
		token,
		title,
		createdAt: row.created_at,
		valid
	};
});
//#endregion
export { createApiKey_createServerFn_handler, emitTestEvent_createServerFn_handler, getIntegrations_createServerFn_handler, getTsaChain_createServerFn_handler, importCloudFile_createServerFn_handler, listCloudFiles_createServerFn_handler, lookupTsa_createServerFn_handler, pingWebhook_createServerFn_handler, revokeApiKey_createServerFn_handler, saveAiConnector_createServerFn_handler, saveByok_createServerFn_handler, saveOneDriveToken_createServerFn_handler, saveWebhook_createServerFn_handler, testAiConnector_createServerFn_handler, testByok_createServerFn_handler };
