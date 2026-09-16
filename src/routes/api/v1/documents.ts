import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { uid } from "@/lib/utils";
import { dispatchWebhook, issueWorkspaceTsa, ensureIntegrationTables } from "@/lib/integrations";
import { DEFAULT_SETTINGS } from "@/lib/types";
import { blankContent } from "@/lib/doc-helpers";
import { readJson, requireApiUser } from "@/lib/v1";

export const Route = createFileRoute("/api/v1/documents")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { userId, error } = await requireApiUser(request);
        if (error || !userId) return error!;
        const sql = await getSql();
        const rows = await sql<{ id: string; title: string; status: string; token: string; updated_at: string }>`
          select id, title, status, token, updated_at from documents where user_id = ${userId} order by updated_at desc limit 50
        `;
        return Response.json({
          documents: rows.map((r) => ({ ...r, signingUrl: `/s/${r.token}` })),
        });
      },
      POST: async ({ request }) => {
        const { userId, error } = await requireApiUser(request);
        if (error || !userId) return error!;
        const body = await readJson(request);
        const title = String(body.title || "Untitled");
        const send = Boolean(body.send);
        const docType = String(body.docType || "other");
        const recipients = Array.isArray(body.recipients) ? (body.recipients as { name?: string; email: string }[]) : [];
        if (!recipients.length) return Response.json({ error: "recipients required" }, { status: 400 });
        await ensureIntegrationTables();
        const sql = await getSql();
        const id = uid("doc");
        const token = uid("tok");
        const content =
          body.content && typeof body.content === "object"
            ? body.content
            : blankContent(docType, title, String(body.company || "HRIS"));
        await sql`
          insert into documents (
            id, user_id, title, doc_type, status, compliance, group_name, content_json, fields_json, settings_json, token, sent_at
          ) values (
            ${id}, ${userId}, ${title}, ${docType}, ${send ? "waiting_for_others" : "draft"}, ${"psre"}, ${"API"},
            ${JSON.stringify(content)}, ${"[]"}, ${JSON.stringify(DEFAULT_SETTINGS)}, ${token}, ${send ? new Date().toISOString() : null}
          )
        `;
        for (const [i, r] of recipients.entries()) {
          await sql`
            insert into recipients (id, user_id, document_id, name, email, role, action, status, order_index, invite_token)
            values (${uid("rc")}, ${userId}, ${id}, ${r.name || r.email}, ${r.email}, ${"signer"}, ${"needs_to_sign"}, ${"waiting"}, ${i + 1}, ${uid("inv")})
          `;
        }
        await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${userId}, ${id}, ${"HRIS/ERP"}, ${send ? "Dokumen dikirim via API" : "Draf dibuat via API"})`;
        if (send) {
          await issueWorkspaceTsa(userId, id, "document.sent", { source: "api" });
          void dispatchWebhook(userId, "document.sent", { documentId: id, title, source: "hris", token });
        }
        const recs = await sql<{ email: string; name: string; invite_token: string | null }>`
          select email, name, invite_token from recipients where document_id = ${id} order by order_index
        `;
        return Response.json({
          id,
          token,
          signingUrl: `/s/${token}`,
          recipients: recs.map((r) => ({
            name: r.name,
            email: r.email,
            signingUrl: `/s/${r.invite_token || token}`,
          })),
        }, { status: 201 });
      },
    },
  },
});
