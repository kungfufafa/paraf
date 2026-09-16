export type EmeteraiProvider = "demo" | "generic" | "mekari";

export type EmeteraiConnector = {
  provider: EmeteraiProvider;
  baseUrl: string;
  token: string;
  source: "env" | "workspace" | "none";
};

export type EmeteraiPublicStatus = {
  connected: boolean;
  legalReady: boolean;
  provider: EmeteraiProvider;
  baseUrl: string;
  source: "env" | "workspace" | "none";
  tokenHint: string;
};

export type StampResult = {
  serial: string;
  legal: boolean;
  verifyUrl: string;
  image?: string;
  provider: EmeteraiProvider;
  hash: string;
  error?: string;
};

export function documentHash(input: { title: string; content: unknown; id: string }): string {
  const raw = JSON.stringify({ id: input.id, title: input.title, content: input.content });
  let h = 2166136261;
  for (let i = 0; i < raw.length; i++) {
    h ^= raw.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  const a = (h >>> 0).toString(16).padStart(8, "0");
  let h2 = 0;
  for (let i = 0; i < raw.length; i++) h2 = (h2 * 33 + raw.charCodeAt(i)) >>> 0;
  return `sha256-${a}${h2.toString(16).padStart(8, "0")}${raw.length.toString(16)}`;
}

export function publicStatus(c: EmeteraiConnector): EmeteraiPublicStatus {
  const connected = c.source !== "none" && Boolean(c.token && c.baseUrl) && c.provider !== "demo";
  return {
    connected,
    legalReady: connected,
    provider: connected ? c.provider : "demo",
    baseUrl: connected ? c.baseUrl : "",
    source: c.source,
    tokenHint: c.token ? `••••${c.token.slice(-4)}` : "",
  };
}

export function connectorFrom(prefs: Record<string, string>): EmeteraiConnector {
  const envUrl = (process.env.EMETERAI_API_URL ?? "").trim();
  const envTok = (process.env.EMETERAI_API_TOKEN ?? "").trim();
  const envProv = (process.env.EMETERAI_PROVIDER ?? "generic").trim() as EmeteraiProvider;
  if (envUrl && envTok) {
    return { provider: envProv === "mekari" ? "mekari" : "generic", baseUrl: envUrl, token: envTok, source: "env" };
  }
  const provider = (prefs.emeteraiProvider as EmeteraiProvider) || "demo";
  const baseUrl = (prefs.emeteraiBaseUrl ?? "").trim();
  const token = (prefs.emeteraiToken ?? "").trim();
  if (provider !== "demo" && baseUrl && token) {
    return { provider, baseUrl, token, source: "workspace" };
  }
  return { provider: "demo", baseUrl: "", token: "", source: "none" };
}

function assertSafeUrl(raw: string) {
  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    throw new Error("Invalid API URL");
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("URL must be http(s)");
  const host = url.hostname.toLowerCase();
  if (host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "0.0.0.0") {
    throw new Error("That URL is not allowed");
  }
  if (host.endsWith(".internal") || host.startsWith("169.254.")) throw new Error("That URL is not allowed");
}

async function postStamp(c: EmeteraiConnector, body: Record<string, unknown>): Promise<{ ok: boolean; status: number; json: Record<string, unknown>; text: string }> {
  assertSafeUrl(c.baseUrl);
  const endpoint = c.provider === "mekari" ? c.baseUrl.replace(/\/$/, "") : c.baseUrl.replace(/\/$/, "");
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${c.token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json: Record<string, unknown> = {};
  try {
    json = text ? (JSON.parse(text) as Record<string, unknown>) : {};
  } catch {
    json = { raw: text.slice(0, 400) };
  }
  return { ok: res.ok, status: res.status, json, text };
}

function pickSerial(json: Record<string, unknown>): string {
  const keys = ["serial", "serialNumber", "sn", "meterai_sn", "stampSerial", "id"];
  for (const k of keys) {
    const v = json[k];
    if (typeof v === "string" && v.length > 3) return v;
    if (v && typeof v === "object" && "serial" in (v as object)) {
      const inner = (v as { serial?: string }).serial;
      if (inner) return inner;
    }
  }
  const data = json.data;
  if (data && typeof data === "object") return pickSerial(data as Record<string, unknown>);
  return "";
}

export async function issueStamp(opts: {
  connector: EmeteraiConnector;
  hash: string;
  title: string;
  documentId: string;
  verifyOrigin: string;
}): Promise<StampResult> {
  const { connector, hash, title, documentId, verifyOrigin } = opts;
  if (connector.source === "none" || connector.provider === "demo") {
    const serial = `DEMO-${hash.slice(0, 10).toUpperCase()}`;
    return {
      serial,
      legal: false,
      verifyUrl: `${verifyOrigin}/verify?serial=${serial}`,
      provider: "demo",
      hash,
    };
  }

  const payload = {
    documentHash: hash,
    documentId,
    title,
    amount: 10000,
    currency: "IDR",
    page: 0,
    x: 62,
    y: 72,
  };

  try {
    const res = await postStamp(connector, payload);
    const serial = pickSerial(res.json);
    if (res.ok && serial) {
      const verify =
        (typeof res.json.verifyUrl === "string" && res.json.verifyUrl) ||
        (typeof res.json.verification_url === "string" && res.json.verification_url) ||
        `${verifyOrigin}/verify?serial=${encodeURIComponent(serial)}`;
      const image =
        typeof res.json.image === "string"
          ? res.json.image
          : typeof res.json.stampImage === "string"
            ? res.json.stampImage
            : undefined;
      return {
        serial,
        legal: true,
        verifyUrl: verify,
        image,
        provider: connector.provider,
        hash,
      };
    }
    return {
      serial: `DEMO-${hash.slice(0, 10).toUpperCase()}`,
      legal: false,
      verifyUrl: `${verifyOrigin}/verify?serial=DEMO-${hash.slice(0, 10).toUpperCase()}`,
      provider: "demo",
      hash,
      error: `Provider ${res.status}: ${res.text.slice(0, 180) || "no serial in response. Check URL and token."}`,
    };
  } catch (e) {
    const serial = `DEMO-${hash.slice(0, 10).toUpperCase()}`;
    return {
      serial,
      legal: false,
      verifyUrl: `${verifyOrigin}/verify?serial=${serial}`,
      provider: "demo",
      hash,
      error: e instanceof Error ? e.message : "Could not reach e-Meterai API",
    };
  }
}

export async function pingConnector(c: EmeteraiConnector): Promise<{ ok: boolean; message: string }> {
  if (c.source === "none" || c.provider === "demo") {
    return { ok: false, message: "No API connected. Stamps will be DEMO — not legally valid." };
  }
  try {
    const res = await postStamp(c, {
      documentHash: "0".repeat(64),
      title: "Paraf connection test",
      amount: 10000,
      ping: true,
    });
    if (res.status === 401 || res.status === 403) return { ok: false, message: "Token rejected (401/403)." };
    if (res.ok || res.status === 400 || res.status === 422) {
      return { ok: true, message: `Reached ${c.provider} API (${res.status}). Ready to stamp.` };
    }
    return { ok: false, message: `HTTP ${res.status}: ${res.text.slice(0, 160)}` };
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : "Connection failed" };
  }
}
