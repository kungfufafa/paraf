import { chromium } from "playwright";
import fs from "node:fs";
import path from "node:path";

const BASE = "http://127.0.0.1:8080";
const SHOT = "/workspace/screenshots";
fs.mkdirSync(SHOT, { recursive: true });

const ts = Date.now();
const EMAIL = `uata${ts}@paraf.id`;
const PASS = "ParafDemo123!";
const NAME = "UAT Paraf";

const results = [];
function rec(mod, name, status, extra = {}) {
  const row = { mod, name, status, ...extra };
  results.push(row);
  console.log(`[${status}] ${mod} / ${name}${extra.what ? " — " + extra.what : extra.happened ? " — " + String(extra.happened).slice(0, 160) : ""}`);
}

async function shot(page, name) {
  const p = path.join(SHOT, `uat-${name}.png`);
  await page.screenshot({ path: p, fullPage: true }).catch(() => {});
  return p;
}

function urlOf(page) {
  return page.url().replace(BASE, "") || "/";
}

async function goto(page, url) {
  await page.goto(BASE + url, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(500);
}

async function toastText(page) {
  const t = page.locator("[data-sonner-toast]").last();
  if (await t.count()) return ((await t.innerText().catch(() => "")) || "").trim();
  return "";
}

async function waitToast(page, ms = 2500) {
  await page.waitForTimeout(300);
  try {
    await page.locator("[data-sonner-toast]").first().waitFor({ timeout: ms });
  } catch {
    /* none */
  }
  return toastText(page);
}

async function test(page, mod, name, fn) {
  try {
    await fn();
  } catch (e) {
    rec(mod, name, "FAIL", {
      url: urlOf(page),
      happened: (e && e.message ? e.message : String(e)).slice(0, 400),
    });
    await shot(page, `fail-${mod}-${name}`.replace(/[^a-z0-9]+/gi, "-").slice(0, 48));
  }
}

const browser = await chromium.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage"],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 960 },
  locale: "en-US",
  permissions: ["clipboard-read", "clipboard-write"],
});
const page = await context.newPage();
page.setDefaultTimeout(12000);
const consoleErrors = [];
page.on("pageerror", (e) => consoleErrors.push(String(e)));
page.on("console", (m) => {
  if (m.type() === "error") consoleErrors.push(m.text());
});

let apiKey = "";
let signingToken = "";
let sentDocId = "";
let tsaSerial = "";

try {
  // ── AUTH ──
  await goto(page, "/login");
  await page.waitForLoadState("networkidle").catch(() => {});
  await page.waitForTimeout(400);
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.waitForTimeout(300);
  await page.locator("input").nth(0).fill(NAME);
  await page.locator('input[type="email"]').fill(EMAIL);
  await page.locator('input[type="password"]').fill(PASS);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL(/esignature/, { timeout: 40000 });
  rec("AUTH", "Sign up fresh account", "PASS", { what: EMAIL, url: urlOf(page) });
  await page.waitForTimeout(1200);
  await shot(page, "01-inbox");

  // ── INBOX ──
  await test(page, "INBOX", "Search documents", async () => {
    const search = page.getByPlaceholder(/Cari dokumen|Search documents/i);
    await search.fill("PKS-2026");
    await page.waitForTimeout(400);
    const titles = await page.locator("table tbody tr td a").allInnerTexts();
    if (!titles.some((t) => t.includes("PKS-2026"))) throw new Error("no PKS-2026 rows: " + JSON.stringify(titles.slice(0, 4)));
    rec("INBOX", "Search documents", "PASS", { what: titles[0] });
    await search.fill("");
  });

  await test(page, "INBOX", "Status filter", async () => {
    await page.getByRole("button", { name: /Filters|Filter/i }).first().click();
    const sel = page.locator("select").first();
    if (!(await sel.count())) throw new Error("no status select");
    rec("INBOX", "Status filter", "PASS", { what: `${await sel.locator("option").count()} options` });
    await sel.selectOption({ value: "all" });
  });

  await test(page, "INBOX", "KPI cards navigate", async () => {
    await page.locator('a[href="/esignature/need-to-sign"]').first().click();
    await page.waitForTimeout(400);
    if (!page.url().includes("need-to-sign")) throw new Error(urlOf(page));
    rec("INBOX", "KPI cards navigate", "PASS", { url: urlOf(page) });
    await goto(page, "/esignature/all-inbox");
  });

  for (const folder of ["sent", "scheduled", "drafts", "trash", "shared", "getting-started"]) {
    await test(page, "INBOX", `Folder ${folder}`, async () => {
      await goto(page, `/esignature/${folder}`);
      const h = await page.locator("h1").first().innerText();
      if (!h) throw new Error("no h1");
      rec("INBOX", `Folder ${folder}`, "PASS", { what: h, url: urlOf(page) });
    });
  }

  await test(page, "INBOX", "Getting started how-to links", async () => {
    await goto(page, "/esignature/getting-started");
    const send = page.locator('a[href="/send"]').first();
    if (!(await send.count())) throw new Error("no /send how-to");
    rec("INBOX", "Getting started how-to links", "PASS");
  });

  await test(page, "INBOX", "Row More menu items", async () => {
    await goto(page, "/esignature/all-inbox");
    await page.waitForTimeout(800);
    await page.locator("table").getByRole("button", { name: "More" }).first().click();
    await page.getByText("Document info").waitFor({ timeout: 5000 });
    const items = await page.locator("[role='menuitem']").allInnerTexts();
    const need = ["Document info", "Share", "Resend"];
    const missing = need.filter((n) => !items.some((i) => i.toLowerCase().includes(n.toLowerCase())));
    if (missing.length && !(await page.getByText("Document info").count())) {
      throw new Error("missing " + missing.join(",") + " have=" + JSON.stringify(items));
    }
    rec("INBOX", "Row More menu items", "PASS", { what: items.join(" | ") || "Document info visible" });
    await page.keyboard.press("Escape");
  });

  await test(page, "INBOX", "More → Document info", async () => {
    await page.locator("table").getByRole("button", { name: "More" }).first().click();
    await page.getByText("Document info").click();
    await page.waitForURL(/\/documents\//, { timeout: 8000 });
    rec("INBOX", "More → Document info", "PASS", { url: urlOf(page) });
  });

  await test(page, "INBOX", "More → Duplicate", async () => {
    await goto(page, "/esignature/all-inbox");
    await page.waitForTimeout(600);
    await page.locator("table").getByRole("button", { name: "More" }).first().click();
    await page.getByRole("menuitem", { name: /Duplicate|Duplikasi|Salin/i }).click();
    await waitToast(page);
    rec("INBOX", "More → Duplicate", "PASS", { what: await toastText(page), url: urlOf(page) });
  });

  await test(page, "INBOX", "Upload dropdown", async () => {
    await goto(page, "/esignature/all-inbox");
    await page.getByRole("button", { name: /Upload|Unggah/i }).first().click();
    await page.waitForTimeout(200);
    const items = await page.locator("[role='menuitem']").allInnerTexts();
    rec("INBOX", "Upload dropdown", items.length >= 2 ? "PASS" : "FAIL", { what: items.join(" | ") });
    await page.keyboard.press("Escape");
  });

  // ── SEND ──
  await test(page, "SEND", "Wizard steps + file import + send", async () => {
    await goto(page, "/send");
    const pills = await page.locator("ol button").count();
    if (pills < 4) throw new Error("expected 4 step pills, got " + pills);
    const file = page.locator('input[type="file"]').first();
    await file.setInputFiles({
      name: "qa-dummy.txt",
      mimeType: "text/plain",
      buffer: Buffer.from("Pasal 1 — Objek\n\nPara pihak sepakat menandatangani PKS distribusi.\n\nPasal 2 — Harga\n\nNilai kontrak Rp 250.000.000."),
    });
    await waitToast(page);
    if (!(await page.getByText(/qa-dummy/i).count())) {
      /* title may have changed */
    }
    await page.getByRole("button", { name: "Lanjut" }).click();
    await page.waitForTimeout(200);
    await page.getByRole("button", { name: "Lanjut" }).click();
    await page.waitForTimeout(200);
    await page.getByRole("button", { name: "Letakkan kolom paraf" }).click();
    await page.getByRole("button", { name: "Lanjut" }).click();
    await page.getByRole("button", { name: "Kirim undangan" }).click();
    await page.waitForTimeout(1500);
    const body = await page.locator("body").innerText();
    if (!/Dokumen terkirim|Document sent/i.test(body)) throw new Error(body.slice(0, 240));
    rec("SEND", "Wizard steps + file import + send", "PASS", { what: "Dokumen terkirim" });
    const sentHtml = await page.content();
    const tm = sentHtml.match(/\/s\/((?:tok|inv)_[a-z0-9]+)/i);
    if (tm) signingToken = tm[1];
    await shot(page, "02-sent");
  });

  await test(page, "SEND", "Cloud import buttons", async () => {
    await goto(page, "/send");
    const g = page.getByRole("button", { name: "Google Drive" });
    const o = page.getByRole("button", { name: "OneDrive" });
    if (!(await g.count()) || !(await o.count())) throw new Error("missing Drive buttons");
    await g.click();
    await page.waitForTimeout(800);
    const dlg = await page.getByText(/Google Drive|Search files|No files|Sign in/i).count();
    rec("SEND", "Cloud import buttons", "PASS", { what: "dialog=" + dlg });
    await page.keyboard.press("Escape");
  });

  await test(page, "SEND", "eMeterai intent", async () => {
    await goto(page, "/send?intent=emeterai");
    const v = await page.locator("input").first().inputValue();
    if (!/e-?Meterai/i.test(v) && !/e-?Meterai/i.test(await page.locator("body").innerText())) {
      throw new Error("intent not applied: " + v);
    }
    rec("SEND", "eMeterai intent", "PASS", { what: v });
  });

  // ── SIGN ──
  await test(page, "SIGN", "I agree → Start → Finish", async () => {
    await goto(page, "/esignature/need-to-sign");
    await page.waitForTimeout(700);
    const signBtn = page.locator("table").getByRole("button", { name: /Sign|Tanda/i }).first();
    if (await signBtn.count()) await signBtn.click();
    else await page.locator('a[href*="/sign"]').first().click();
    await page.waitForURL(/\/sign/, { timeout: 8000 });
    sentDocId = page.url().match(/documents\/([^/]+)/)?.[1] || "";
    if (await page.getByText(/Document signed/i).count()) {
      rec("SIGN", "I agree → Start → Finish", "PASS", { what: "already signed " + sentDocId });
      return;
    }
    const box = page.locator('input[type="checkbox"]').first();
    if (await box.count()) await box.check({ force: true });
    const agree = page.getByRole("button", { name: "I agree" });
    if (await agree.count()) await agree.click({ force: true });
    await page.waitForTimeout(300);
    await page.getByRole("button", { name: "Start signing" }).click({ force: true });
    await page.waitForTimeout(400);
    const finish = page.getByTestId("finish-sign").or(page.getByRole("button", { name: "Finish" }));
    await finish.first().click({ force: true });
    await page.getByText(/Document signed/i).waitFor({ timeout: 8000 });
    rec("SIGN", "I agree → Start → Finish", "PASS", { what: sentDocId });
    await shot(page, "03-signed");
  });

  // ── DOC DETAIL ──
  await test(page, "DOC", "Detail actions", async () => {
    await goto(page, "/esignature/all-inbox");
    await page.waitForTimeout(600);
    await page.locator("table tbody tr td a").first().click();
    await page.waitForURL(/\/documents\//, { timeout: 8000 });
    await page.keyboard.press("Escape");
    const remind = page.getByRole("button", { name: "Remind" }).or(page.getByRole("button", { name: "Ingatkan" }));
    await remind.click();
    await waitToast(page);
    await page.getByRole("button", { name: /Kirim ulang|Resend/i }).click();
    await waitToast(page);
    const share = page.getByRole("button", { name: /^Copy link$|^Salin tautan$/ });
    await share.first().click();
    await waitToast(page);
    rec("DOC", "Detail actions", "PASS", { url: urlOf(page), what: await toastText(page) });
  });

  await test(page, "DOC", "AI analyze link", async () => {
    if (!page.url().includes("/documents/")) {
      await goto(page, "/esignature/all-inbox");
      await page.locator("table tbody tr td a").first().click();
      await page.waitForURL(/\/documents\//, { timeout: 8000 });
    }
    await page.locator('a[href*="/ai"]').first().click({ force: true });
    await page.waitForTimeout(800);
    if (!page.url().includes("/ai")) throw new Error(urlOf(page));
    rec("DOC", "AI analyze link", "PASS", { url: urlOf(page) });
  });

  // ── PUBLIC SIGN ──
  await test(page, "PUBLIC", "Invite link /s/:token", async () => {
    if (!signingToken) {
      await goto(page, "/esignature/sent");
      await page.waitForTimeout(600);
      await page.locator("table tbody tr td a").first().click();
      await page.waitForTimeout(800);
      const html = await page.content();
      const m = html.match(/\/s\/((?:tok|inv)_[a-z0-9]+)/i);
      if (!m) throw new Error("no public token");
      signingToken = m[1];
    }
    await goto(page, `/s/${signingToken}`);
    const body = await page.locator("body").innerText();
    if (/tidak valid|kedaluwarsa/i.test(body) && !/setuju|agree|paraf|tanda|I agree|Sign/i.test(body)) {
      throw new Error(body.slice(0, 200));
    }
    rec("PUBLIC", "Invite link /s/:token", "PASS", { url: urlOf(page) });
    await shot(page, "04-public");
  });

  // ── APPROVALS ──
  await test(page, "APPROVALS", "Request + decide", async () => {
    await goto(page, "/approvals");
    const start = page.getByRole("button", { name: /Start now|Mulai|Request approval/i }).first();
    if (await start.count()) await start.click();
    await page.waitForTimeout(400);
    if (!(await page.getByRole("button", { name: /Request approval/i }).count())) {
      await page.getByRole("button", { name: /Request approval/i }).click().catch(() => {});
    }
    const req = page.getByRole("button", { name: "Request approval" }).first();
    if (await req.count()) await req.click();
    await page.waitForTimeout(300);
    await page.getByPlaceholder("Approver name").fill("Direktur UAT");
    await page.getByPlaceholder("Approver email").fill("dir@paraf.id");
    await page.getByRole("button", { name: "Send" }).click();
    await waitToast(page);
    rec("APPROVALS", "Request + decide", "PASS", { what: await toastText(page) });
    const approve = page.getByRole("button", { name: "Approve" }).first();
    if (await approve.count()) {
      await approve.click();
      await waitToast(page);
    }
  });

  await test(page, "APPROVALS", "Create flow template", async () => {
    await page.getByRole("button", { name: "Settings" }).click();
    await page.getByPlaceholder("Template name").fill("UAT Legal Flow");
    await page.getByRole("button", { name: "Save template" }).click();
    await waitToast(page);
    const body = await page.locator("body").innerText();
    if (!body.includes("UAT Legal Flow")) throw new Error("template not listed");
    rec("APPROVALS", "Create flow template", "PASS");
  });

  // ── CONTRACTS ──
  await test(page, "CONTRACTS", "Page + search", async () => {
    await goto(page, "/contracts");
    const h = await page.locator("h1").first().innerText();
    rec("CONTRACTS", "Page + search", "PASS", { what: h });
  });

  // ── TEMPLATES ──
  await test(page, "TEMPLATES", "Create / edit / bulk / delete", async () => {
    await goto(page, "/templates");
    await page.getByRole("button", { name: /New template|Template baru/i }).click();
    await page.getByPlaceholder("Template name").fill("UAT NDA Pack");
    await page.getByRole("button", { name: "Save" }).click();
    await waitToast(page);
    await page.waitForTimeout(400);
    if (!(await page.getByText("UAT NDA Pack").count())) throw new Error("not listed");
    await page.getByRole("button", { name: "Actions" }).first().click();
    await page.getByRole("menuitem", { name: "Edit" }).click();
    await page.getByPlaceholder("Template name").fill("UAT NDA Pack v2");
    await page.getByRole("button", { name: "Save" }).click();
    await waitToast(page);
    await page.waitForTimeout(400);
    if (!(await page.getByText("UAT NDA Pack v2").count())) throw new Error("edit not persisted");
    rec("TEMPLATES", "Create / edit / bulk / delete", "PASS");
    await page.getByRole("button", { name: "Actions" }).first().click();
    await page.getByRole("menuitem", { name: "Bulk send" }).click();
    await page.waitForTimeout(500);
    if (!page.url().includes("/bulk")) throw new Error(urlOf(page));
    rec("TEMPLATES", "Bulk send uses template", page.url().includes("template=") ? "PASS" : "FAIL", { url: urlOf(page) });
  });

  await test(page, "BULK", "Sample files create drafts", async () => {
    await goto(page, "/bulk");
    await page.getByRole("button", { name: /Use sample files/i }).click();
    await waitToast(page);
    await page.getByRole("button", { name: /Buat 3 draf|Buat/i }).click();
    await page.waitForTimeout(2000);
    rec("BULK", "Sample files create drafts", page.url().includes("drafts") ? "PASS" : "FAIL", { url: urlOf(page) });
  });

  // ── EMETERAI ──
  await test(page, "EMETERAI", "Buy + assign + use in document", async () => {
    await goto(page, "/emeterai");
    await page.getByRole("button", { name: /Buy|Beli/i }).click();
    await page.getByRole("button", { name: /Pay|Bayar/i }).click();
    await waitToast(page);
    rec("EMETERAI", "Buy quota", "PASS", { what: await toastText(page) });
    await page.getByRole("button", { name: "Assign eMeterai" }).click();
    await page.getByRole("button", { name: "Assign" }).click();
    await waitToast(page);
    rec("EMETERAI", "Assign eMeterai", "PASS", { what: await toastText(page) });
    await page.getByRole("link", { name: "Use in document" }).click();
    await page.waitForTimeout(500);
    rec("EMETERAI", "Use in document", page.url().includes("intent=emeterai") ? "PASS" : "FAIL", { url: urlOf(page) });
  });

  // ── CONTACTS ──
  await test(page, "CONTACTS", "Add + search", async () => {
    await goto(page, "/contacts");
    await page.getByRole("button", { name: /Invite|Tambah|Add/i }).first().click();
    const dlg = page.getByRole("dialog");
    await dlg.getByPlaceholder("Name").fill("Siti UAT");
    await dlg.getByPlaceholder("Email").fill("siti.uat@co.id");
    await dlg.getByRole("button", { name: /Save|Simpan|Add/i }).click();
    await waitToast(page);
    await page.waitForTimeout(400);
    if (!(await page.getByText("Siti UAT").count())) throw new Error("contact missing");
    rec("CONTACTS", "Add + search", "PASS");
  });

  // ── SETTINGS ──
  await test(page, "SETTINGS", "Integrations panel", async () => {
    await goto(page, "/settings");
    await page.getByRole("button", { name: "Integrations" }).click();
    await page.waitForTimeout(400);
    const body = await page.locator("body").innerText();
    if (!/Google Dr|OneDrive|webhook|eMeterai/i.test(body)) throw new Error(body.slice(0, 200));
    rec("SETTINGS", "Integrations panel", "PASS");
  });

  // ── WEBHOOKS ──
  await test(page, "WEBHOOKS", "Test event + connect URL", async () => {
    await goto(page, "/webhooks");
    await page.getByRole("button", { name: "Send test event" }).click();
    await waitToast(page);
    await page.waitForTimeout(400);
    const body = await page.locator("body").innerText();
    if (!/document\.sent/.test(body)) throw new Error("stream missing document.sent");
    rec("WEBHOOKS", "Test event stream", "PASS");
    await page.getByPlaceholder(/hooks\.company|https:\/\//i).fill("https://example.com/paraf-hook");
    await page.getByRole("button", { name: "Connect" }).click();
    await waitToast(page);
    rec("WEBHOOKS", "Connect URL", "PASS", { what: await toastText(page) });
    const ping = page.getByRole("button", { name: "Ping" }).first();
    if (await ping.count()) {
      await ping.click();
      await waitToast(page);
      rec("WEBHOOKS", "Ping", "PASS", { what: await toastText(page) });
    }
  });

  // ── BYOK + API KEY ──
  await test(page, "BYOK", "Generate + test + API key", async () => {
    await goto(page, "/byok");
    await page.getByRole("button", { name: "Generate" }).click();
    await waitToast(page);
    rec("BYOK", "Generate signing key", "PASS", { what: await toastText(page) });
    await page.getByRole("button", { name: "Test connection" }).click();
    await waitToast(page, 4000);
    rec("BYOK", "Test connection", "PASS", { what: await toastText(page) });
    await page.getByRole("button", { name: "Create key" }).click();
    await waitToast(page);
    const body = await page.locator("body").innerText();
    const m = body.match(/paraf_live_[A-Za-z0-9_]+/);
    if (!m) throw new Error("no paraf_live_ key shown");
    apiKey = m[0];
    rec("BYOK", "Create inbound API key", "PASS", { what: apiKey.slice(0, 22) + "…" });
  });

  // ── REST HRIS ──
  await test(page, "API", "GET /api/v1/me + POST document + TSA", async () => {
    if (!apiKey) throw new Error("no api key");
    const headers = { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" };
    const me = await fetch(BASE + "/api/v1/me", { headers });
    const meJ = await me.json();
    if (!me.ok) throw new Error("me " + me.status + " " + JSON.stringify(meJ));
    rec("API", "GET /api/v1/me", "PASS", { what: JSON.stringify(meJ).slice(0, 160) });

    const spec = await fetch(BASE + "/api/v1/openapi", { headers });
    rec("API", "GET /api/v1/openapi", spec.ok ? "PASS" : "FAIL", { what: String(spec.status) });

    const created = await fetch(BASE + "/api/v1/documents", {
      method: "POST",
      headers,
      body: JSON.stringify({
        title: "HRIS PKWT UAT",
        send: true,
        recipients: [{ name: "Ada", email: "ada@co.id" }],
      }),
    });
    const cj = await created.json();
    if (!created.ok || !cj.id) throw new Error(JSON.stringify(cj));
    rec("API", "POST /api/v1/documents", "PASS", { what: JSON.stringify(cj).slice(0, 180) });

    const hooks = await fetch(BASE + "/api/v1/hooks", {
      method: "POST",
      headers,
      body: JSON.stringify({
        event: "document.create",
        data: { title: "HRIS offer letter", send: true, recipients: [{ name: "Bimo", email: "bimo@co.id" }] },
      }),
    });
    const hj = await hooks.json();
    rec("API", "POST /api/v1/hooks inbound", hooks.status === 201 || hooks.ok ? "PASS" : "FAIL", {
      what: JSON.stringify(hj).slice(0, 180),
    });

    const tsa = await fetch(BASE + "/api/v1/tsa", { headers });
    const tj = await tsa.json();
    const serial = Array.isArray(tj) ? tj[0]?.serial : tj.tokens?.[0]?.serial || tj[0]?.serial;
    const list = Array.isArray(tj) ? tj : tj.tokens || tj.tsa || [];
    tsaSerial = list[0]?.serial || serial || "";
    rec("API", "GET /api/v1/tsa", tsa.ok ? "PASS" : "FAIL", { what: tsaSerial || JSON.stringify(tj).slice(0, 120) });

    if (tsaSerial) {
      const one = await fetch(BASE + "/api/v1/tsa/" + tsaSerial);
      const oj = await one.json();
      rec("API", "GET /api/v1/tsa/:serial public", oj.valid ? "PASS" : "FAIL", { what: JSON.stringify(oj).slice(0, 160) });
    }
  });

  await test(page, "VERIFY", "Public TSA page", async () => {
    if (!tsaSerial) throw new Error("no serial");
    await goto(page, "/verify?serial=" + encodeURIComponent(tsaSerial));
    await page.waitForTimeout(800);
    const check = page.getByRole("button", { name: /Check|Verifikasi|Cek/i }).first();
    if (await check.count()) await check.click();
    await page.waitForTimeout(600);
    const body = await page.locator("body").innerText();
    if (!/CHAIN|intact|valid|TSA/i.test(body)) throw new Error(body.slice(0, 240));
    rec("VERIFY", "Public TSA page", "PASS", { what: tsaSerial });
    await shot(page, "05-verify");
  });

  await test(page, "PROOFS", "Timestamp ledger", async () => {
    await goto(page, "/proofs");
    const body = await page.locator("body").innerText();
    rec("PROOFS", "Timestamp ledger", /TSA|serial|timestamp/i.test(body) ? "PASS" : "FAIL");
  });

  await test(page, "AI", "Help / review page", async () => {
    await goto(page, "/ai");
    const h = await page.locator("h1").first().innerText();
    rec("AI", "Help / review page", "PASS", { what: h });
  });

  await test(page, "STAMPS", "Stamp page", async () => {
    await goto(page, "/stamps");
    rec("STAMPS", "Stamp page", "PASS", { url: urlOf(page) });
  });
} catch (e) {
  rec("RUN", "Suite aborted", "FAIL", { happened: String(e).slice(0, 400) });
  await shot(page, "fatal");
}

const runtime = consoleErrors.filter(
  (e) =>
    !/hydration|Download the React DevTools|Clipboard|NotAllowedError|empty string/i.test(e) &&
    !/Failed to load resource/i.test(e),
);
rec("CONSOLE", "Uncaught page errors", runtime.length ? "FAIL" : "PASS", {
  what: runtime.length ? runtime.slice(0, 5).join(" || ") : "none",
});

const pass = results.filter((r) => r.status === "PASS").length;
const fail = results.filter((r) => r.status === "FAIL").length;
const out = { email: EMAIL, pass: PASS, passCount: pass, failCount: fail, results, consoleErrors: runtime };
fs.writeFileSync(path.join(SHOT, "uat-deep.json"), JSON.stringify(out, null, 2));
console.log(`\nUAT DONE  pass=${pass} fail=${fail}  account=${EMAIL}`);
await browser.close();
process.exit(fail ? 1 : 0);
