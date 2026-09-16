export type AiProvider = "xai" | "openai" | "anthropic" | "google" | "groq" | "custom";

export type AiConnector = {
  provider: AiProvider;
  apiKey: string;
  baseUrl: string;
  model: string;
  source: "env" | "workspace" | "none";
};

const DEFAULTS: Record<AiProvider, { url: string; model: string; envKey: string }> = {
  xai: { url: "https://api.x.ai/v1/chat/completions", model: "grok-4.5", envKey: "XAI_API_KEY" },
  openai: { url: "https://api.openai.com/v1/chat/completions", model: "gpt-4o-mini", envKey: "OPENAI_API_KEY" },
  anthropic: { url: "https://api.anthropic.com/v1/messages", model: "claude-sonnet-4-5", envKey: "ANTHROPIC_API_KEY" },
  google: { url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", model: "gemini-2.0-flash", envKey: "GOOGLE_AI_API_KEY" },
  groq: { url: "https://api.groq.com/openai/v1/chat/completions", model: "llama-3.3-70b-versatile", envKey: "GROQ_API_KEY" },
  custom: { url: "", model: "gpt-4o-mini", envKey: "AI_API_TOKEN" },
};

export const AI_PROVIDERS: { id: AiProvider; label: string }[] = [
  { id: "xai", label: "xAI Grok" },
  { id: "openai", label: "OpenAI" },
  { id: "anthropic", label: "Anthropic Claude" },
  { id: "google", label: "Google Gemini" },
  { id: "groq", label: "Groq" },
  { id: "custom", label: "Custom OpenAI-compatible" },
];

export function aiFrom(prefs: Record<string, string>): AiConnector {
  const envProvider = (process.env.AI_PROVIDER as AiProvider) || "xai";
  if (process.env.XAI_API_KEY && (!prefs.aiProvider || prefs.aiProvider === "xai")) {
    return { provider: "xai", apiKey: process.env.XAI_API_KEY, baseUrl: DEFAULTS.xai.url, model: prefs.aiModel || DEFAULTS.xai.model, source: "env" };
  }
  const provider = (prefs.aiProvider as AiProvider) || envProvider;
  const def = DEFAULTS[provider] ?? DEFAULTS.xai;
  const envKey = process.env[def.envKey] || process.env.AI_API_TOKEN || "";
  const apiKey = (prefs.aiApiKey || envKey).trim();
  const baseUrl = (prefs.aiBaseUrl || process.env.AI_API_URL || def.url).trim();
  const model = (prefs.aiModel || def.model).trim();
  if (!apiKey) return { provider, apiKey: "", baseUrl, model, source: "none" };
  return { provider, apiKey, baseUrl, model, source: prefs.aiApiKey ? "workspace" : "env" };
}

export function aiPublic(c: AiConnector) {
  return {
    connected: Boolean(c.apiKey),
    provider: c.provider,
    model: c.model,
    source: c.source,
    keyHint: c.apiKey ? `••••${c.apiKey.slice(-4)}` : "",
  };
}

export const SYSTEM =
  'You are an Indonesian contract reviewer. Reply ONLY with JSON: {"summary":"3 sentences","risks":[{"level":"high|medium|low","title":"","detail":""}],"missing":["clause"],"recommendations":["step"]}. Do not invent statutes. Match the user language.';

export type AiAnalysis = {
  summary: string;
  findings: { level: string; title: string; detail: string }[];
};

export function parseAiReview(text: string): AiAnalysis {
  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return { summary: text.trim(), findings: [] };
  try {
    const j = JSON.parse(match[0]) as {
      summary?: string;
      risks?: { level?: string; title?: string; detail?: string }[];
      missing?: string[];
      recommendations?: string[];
    };
    const findings: AiAnalysis["findings"] = [];
    for (const r of j.risks ?? []) {
      findings.push({
        level: r.level || "sedang",
        title: r.title || "Risiko",
        detail: r.detail || "",
      });
    }
    for (const m of j.missing ?? []) {
      findings.push({ level: "sedang", title: "Klausul absen", detail: m });
    }
    for (const rec of j.recommendations ?? []) {
      findings.push({ level: "rendah", title: "Rekomendasi", detail: rec });
    }
    return { summary: (j.summary || text).trim(), findings };
  } catch {
    return { summary: text.trim(), findings: [] };
  }
}

export async function chatComplete(c: AiConnector, user: string): Promise<{ ok: boolean; text: string; error?: string }> {
  if (!c.apiKey) return { ok: false, text: "", error: "No AI API key. Add one in Settings → AI review." };
  try {
    if (c.provider === "anthropic") {
      const res = await fetch(c.baseUrl || "https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": c.apiKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: c.model,
          max_tokens: 900,
          system: SYSTEM,
          messages: [{ role: "user", content: user }],
        }),
      });
      const body = (await res.json()) as { content?: { text?: string }[]; error?: { message?: string } };
      if (!res.ok) return { ok: false, text: "", error: body.error?.message || `HTTP ${res.status}` };
      return { ok: true, text: body.content?.[0]?.text ?? "" };
    }
    const res = await fetch(c.baseUrl || DEFAULTS.xai.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${c.apiKey}` },
      body: JSON.stringify({
        model: c.model,
        max_tokens: 900,
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: user },
        ],
      }),
    });
    const body = (await res.json()) as { choices?: { message?: { content?: string } }[]; error?: { message?: string } };
    if (!res.ok) return { ok: false, text: "", error: body.error?.message || `HTTP ${res.status}` };
    return { ok: true, text: body.choices?.[0]?.message?.content ?? "" };
  } catch (e) {
    return { ok: false, text: "", error: e instanceof Error ? e.message : "AI request failed" };
  }
}
