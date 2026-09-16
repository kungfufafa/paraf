import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { uid } from "@/lib/utils";
import { dispatchWebhook, issueWorkspaceTsa, ensureIntegrationTables } from "@/lib/integrations";
import { DEFAULT_SETTINGS } from "@/lib/types";
import { blankContent } from "@/lib/doc-helpers";
import { readJson, requireApiUser } from "@/lib/v1";

export const Route = createFileRoute("/api/v1/hooks")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { userId, error } = await requireApiUser(request);
        if (error || !userId) return error!;
        return Response.json({
          ok: true,
          inbound: "POST JSON { event, data } with Authorization: Bearer paraf_live_…",
          events: ["document.create", "document.sent", "document.void", "document.remind"],
        });
      },
      POST: async ({ request }) => {
        const { userId, error } = await requireApiUser(request);
        if (error || !userId) return error!;
        const body = await readJson(request);
        const event = String(body.event || body.type || "document.create");
        const data = (body.data && typeof body.data === "object" ? body.data : body) as Record<string, unknown>;
        await ensureIntegrationTables();
        const sql = await getSql();

        if (event === "document.void" || event === "document.voided") {
          const id = String(data.documentId || data.id || "");
          if (!id) return Response.json({ error: "documentId required" }, { status: 400 });
          await sql`update documents set status = ${"voided"} where id = ${id} and user_id = ${userId}`;
          await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${userId}, ${id}, ${"HRIS/ERP"}, ${"Dokumen dibatalkan via webhook"})`;
          await issueWorkspaceTsa(userId, id, "document.voided", { source: "hook" });
          void dispatchWebhook(userId, "document.voided", { documentId: id, source: "hook" });
          return Response.json({ ok: true, documentId: id, event: "document.voided" });
        }

        if (event === "document.remind" || event === "document.reminded") {
          const id = String(data.documentId || data.id || "");
          if (!id) return Response.json({ error: "documentId required" }, { status: 400 });
          await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${userId}, ${id}, ${"HRIS/ERP"}, ${"Pengingat via webhook"})`;
          await issueWorkspaceTsa(userId, id, "document.reminded", { source: "hook" });
          void dispatchWebhook(userId, "document.reminded", { documentId: id, source: "hook" });
          return Response.json({ ok: true, documentId: id, event: "document.reminded" });
        }

        const title = String(data.title || "Untitled");
        const send = Boolean(data.send) || event === "document.sent";
        const docType = String(data.docType || "other");
        const recipients = Array.isArray(data.recipients) ? (data.recipients as { name?: string; email: string }[]) : [];
        if (!recipients.length) return Response.json({ error: "recipients required" }, { status: 400 });
        const id = uid("doc");
        const token = uid("tok");
        const content =
          data.content && typeof data.content === "object"
            ? data.content
            : blankContent(docType, title, String(data.company || "HRIS"));
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
        await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${userId}, ${id}, ${"HRIS/ERP"}, ${send ? "Dokumen dikirim via webhook" : "Draf dibuat via webhook"})`;
        if (send) {
          await issueWorkspaceTsa(userId, id, "document.sent", { source: "hook" });
          void dispatchWebhook(userId, "document.sent", { documentId: id, title, source: "hook", token });
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
          event: send ? "document.sent" : "document.create",
        }, { status: 201 });
      },
    },
  },
});
