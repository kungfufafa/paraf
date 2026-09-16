import { hmacSha256Hex, sha256Hex } from "@/lib/crypto-lite";
import { uid } from "@/lib/utils";
import { loadByok } from "@/lib/byok";

export type TsaToken = {
  v: 1;
  policy: "paraf-tsa-v1" | "paraf-byok-v1";
  serial: string;
  genTime: string;
  hash: string;
  prev: string;
  nonce: string;
  alg: "HMAC-SHA256";
  mac: string;
};

function secretFor(userId: string, byokSecret?: string) {
  if (byokSecret) return `paraf-byok-v1:${userId}:${byokSecret}`;
  return `paraf-tsa-v1:${userId}:${process.env.BETTER_AUTH_SECRET || "paraf-preview-tsa"}`;
}

export async function sealTsa(input: {
  userId: string;
  payloadHash: string;
  prev: string;
}): Promise<TsaToken> {
  const byok = await loadByok(input.userId);
  const policy = byok.secret ? ("paraf-byok-v1" as const) : ("paraf-tsa-v1" as const);
  const token: Omit<TsaToken, "mac"> = {
    v: 1,
    policy,
    serial: uid("TSA").toUpperCase(),
    genTime: new Date().toISOString(),
    hash: input.payloadHash,
    prev: input.prev || "genesis",
    nonce: uid("n"),
    alg: "HMAC-SHA256",
  };
  const canonical = JSON.stringify(token);
  const mac = await hmacSha256Hex(secretFor(input.userId, byok.secret), canonical);
  return { ...token, mac };
}

export async function verifyTsa(userId: string, token: TsaToken): Promise<boolean> {
  const byok = await loadByok(userId);
  const { mac, ...rest } = token;
  const expect = await hmacSha256Hex(secretFor(userId, byok.secret), JSON.stringify(rest));
  if (expect === mac) return true;
  if (byok.secret) {
    const fallback = await hmacSha256Hex(secretFor(userId), JSON.stringify(rest));
    return fallback === mac;
  }
  return false;
}

export async function eventHash(parts: Record<string, unknown>): Promise<string> {
  return sha256Hex(JSON.stringify(parts));
}
