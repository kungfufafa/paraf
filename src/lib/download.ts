export function downloadBlob(filename: string, content: string, mime = "text/html;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

function esc(s: string) {
  const amp = "\u0026amp;";
  const lt = "\u0026lt;";
  const gt = "\u0026gt;";
  const quot = "\u0026quot;";
  return s.replaceAll("&", amp).replaceAll("<", lt).replaceAll(">", gt).replaceAll('"', quot);
}

export function documentsHtml(
  docs: { title: string; status: string; groupName?: string; recipients: { name: string; email: string; status: string }[] }[],
) {
  const rows = docs
    .map(
      (d) =>
        `<tr><td>${esc(d.title)}</td><td>${esc(d.status)}</td><td>${esc(d.groupName ?? "")}</td><td>${d.recipients.map((r) => esc(r.name)).join(", ")}</td></tr>`,
    )
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"><title>Paraf documents</title>
  <style>body{font-family:system-ui,sans-serif;padding:24px;color:#1b2430}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f6f7f8}</style></head>
  <body><h1>Paraf — Documents</h1><p>${docs.length} documents</p><table><thead><tr><th>Title</th><th>Status</th><th>Group</th><th>Recipients</th></tr></thead><tbody>${rows}</tbody></table></body></html>`;
}

export function auditHtml(rows: { document_id: string; actor: string; action: string; created_at: string }[], titles: Record<string, string>) {
  const body = rows
    .map(
      (a) =>
        `<tr><td>${esc(a.created_at)}</td><td>${esc(titles[a.document_id] ?? a.document_id)}</td><td>${esc(a.actor)}</td><td>${esc(a.action)}</td></tr>`,
    )
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"><title>Paraf audit trail</title>
  <style>body{font-family:system-ui,sans-serif;padding:24px}table{border-collapse:collapse;width:100%}th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f6f7f8}</style></head>
  <body><h1>Audit trail</h1><table><thead><tr><th>Time</th><th>Document</th><th>Actor</th><th>Action</th></tr></thead><tbody>${body}</tbody></table></body></html>`;
}

export function certificateHtml(doc: {
  title: string;
  compliance: string;
  completedAt?: string | null;
  token: string;
  recipients: { name: string; email: string; status: string; signedAt?: string | null }[];
  tsa?: { serial: string; genTime?: string }[];
}) {
  const signers = doc.recipients
    .filter((r) => r.status === "signed")
    .map((r) => `<li>${esc(r.name)} (${esc(r.email)}) — ${esc(r.signedAt ?? "signed")}</li>`)
    .join("");
  const stamps = (doc.tsa ?? [])
    .map((t) => `<li><code>${esc(t.serial)}</code> ${esc(t.genTime ?? "")}</li>`)
    .join("");
  return `<!doctype html><html><head><meta charset="utf-8"><title>Completion certificate</title>
  <style>body{font-family:Georgia,serif;max-width:720px;margin:40px auto;padding:32px;border:2px solid #e85d04;color:#1b2430}
  h1{color:#e85d04;letter-spacing:.08em;font-size:18px;text-transform:uppercase} .seal{margin-top:24px;font-size:12px;color:#555}</style></head>
  <body>
    <h1>Certificate of completion</h1>
    <p>This certifies that <strong>${esc(doc.title)}</strong> was signed electronically via Paraf (${esc(doc.compliance.toUpperCase())}).</p>
    <p>Completed: ${esc(doc.completedAt ?? "in progress")}</p>
    <p>Verification token: <code>${esc(doc.token)}</code></p>
    <h2>Signers</h2>
    <ul>${signers || "<li>No signatures yet</li>"}</ul>
    <h2>Paraf Timestamp Authority</h2>
    <ul>${stamps || "<li>No TSA serial yet — send or sign to seal the chain.</li>"}</ul>
    <p class="seal">Paraf TSA policy paraf-tsa-v1 (HMAC-SHA256 hash chain). Verify a serial at /verify. This is an internal Paraf timestamp, not a government-accredited RFC 3161 TSA unless a licensed TSA URL is later connected.</p>
  </body></html>`;
}

export function attachmentsHtml(docs: { title: string; content: { clauses: { title: string; body: string }[] } }[]) {
  const body = docs
    .map(
      (d) =>
        `<article><h2>${esc(d.title)}</h2>${d.content.clauses.map((c) => `<h3>${esc(c.title)}</h3><p>${esc(c.body)}</p>`).join("")}</article>`,
    )
    .join("<hr/>");
  return `<!doctype html><html><head><meta charset="utf-8"><title>Paraf attachments</title>
  <style>body{font-family:system-ui,sans-serif;padding:24px;max-width:800px;margin:auto}</style></head>
  <body><h1>Document attachments</h1>${body}</body></html>`;
}
