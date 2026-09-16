import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { uid } from "@/lib/utils";
import { dispatchWebhook, issueWorkspaceTsa, listTsa } from "@/lib/integrations";
import { readJson, requireApiUser } from "@/lib/v1";

export const Route = createFileRoute("/api/v1/documents/$id")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const { userId, error } = await requireApiUser(request);
        if (error || !userId) return error!;
        const sql = await getSql();
        const row = (
          await sql<{ id: string; title: string; status: string; token: string; updated_at: string }>`
            select id, title, status, token, updated_at from documents where id = ${params.id} and user_id = ${userId} limit 1
          `
        )[0];
        if (!row) return Response.json({ error: "Not found" }, { status: 404 });
        const recs = await sql<{ name: string; email: string; status: string; role: string }>`
          select name, email, status, role from recipients where document_id = ${params.id}
        `;
        const tsa = await listTsa(userId, params.id);
        return Response.json({
          ...row,
          recipients: recs,
          signingUrl: `/s/${row.token}`,
          tsa: tsa.map((t) => ({ serial: t.serial, createdAt: t.created_at })),
        });
      },
      POST: async ({ request, params }) => {
        const { userId, error } = await requireApiUser(request);
        if (error || !userId) return error!;
        const body = await readJson(request);
        const action = String(body.action || "");
        const sql = await getSql();
        const row = (await sql<{ id: string }>`select id from documents where id = ${params.id} and user_id = ${userId} limit 1`)[0];
        if (!row) return Response.json({ error: "Not found" }, { status: 404 });
        if (action === "void") {
          await sql`update documents set status = 'voided', voided_at = now(), updated_at = now() where id = ${params.id} and user_id = ${userId}`;
          await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${userId}, ${params.id}, ${"HRIS/ERP"}, ${"Dokumen dibatalkan via API"})`;
          await issueWorkspaceTsa(userId, params.id, "document.voided", { source: "api" });
          void dispatchWebhook(userId, "document.voided", { documentId: params.id, source: "hris" });
          return Response.json({ ok: true, status: "voided" });
        }
        if (action === "remind") {
          await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${userId}, ${params.id}, ${"HRIS/ERP"}, ${"Pengingat via API"})`;
          await issueWorkspaceTsa(userId, params.id, "document.reminded", { source: "api" });
          void dispatchWebhook(userId, "document.reminded", { documentId: params.id, source: "hris" });
          return Response.json({ ok: true });
        }
        return Response.json({ error: "action must be void or remind" }, { status: 400 });
      },
    },
  },
});
