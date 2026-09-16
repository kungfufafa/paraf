import { getSql } from "@/lib/db";
import { sha256Hex } from "@/lib/crypto-lite";

export type ByokConnector = {
  secret: string;
  pem: string;
  source: "env" | "workspace" | "none";
};

export type ByokPublicStatus = {
  connected: boolean;
  legalReady: boolean;
  source: "env" | "workspace" | "none";
  keyHint: string;
  pemHint: string;
  fingerprint: string;
};

export function byokFrom(prefs: Record<string, string>): ByokConnector {
  const env = (process.env.PARAF_BYOK_SECRET ?? "").trim();
  const pem = (prefs.byokPem ?? "").trim();
  if (env) return { secret: env, pem, source: "env" };
  const secret = (prefs.byokSecret ?? "").trim();
  if (secret || pem) return { secret, pem, source: "workspace" };
  return { secret: "", pem: "", source: "none" };
}

export function byokPublic(c: ByokConnector, fingerprint = ""): ByokPublicStatus {
  const connected = Boolean(c.secret || c.pem);
  return {
    connected,
    legalReady: Boolean(c.secret),
    source: connected ? c.source : "none",
    keyHint: c.secret ? `••••${c.secret.slice(-4)}` : "",
    pemHint: c.pem ? `PEM · ${c.pem.length} chars` : "",
    fingerprint,
  };
}

export async function loadByok(userId: string): Promise<ByokConnector> {
  const env = (process.env.PARAF_BYOK_SECRET ?? "").trim();
  const sql = await getSql();
  const row = (
    await sql<{ prefs_json: string }>`select prefs_json from workspace_prefs where user_id = ${userId} limit 1`.catch(
      () => [],
    )
  )[0];
  let prefs: Record<string, string> = {};
  try {
    prefs = JSON.parse(row?.prefs_json || "{}") as Record<string, string>;
  } catch {
    prefs = {};
  }
  if (env) return { secret: env, pem: (prefs.byokPem ?? "").trim(), source: "env" };
  return byokFrom(prefs);
}

export async function fingerprintOf(pem: string): Promise<string> {
  if (!pem.trim()) return "";
  const hex = await sha256Hex(pem.trim());
  return hex.slice(0, 16);
}

export function envWebhook(): { url: string; secret: string } | null {
  const url = (process.env.PARAF_WEBHOOK_URL ?? "").trim();
  if (!url) return null;
  return { url, secret: (process.env.PARAF_WEBHOOK_SECRET ?? "paraf-env-webhook").trim() };
}
