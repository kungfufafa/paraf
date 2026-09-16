import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { ensureIntegrationTables } from "@/lib/integrations";
import { verifyTsa, type TsaToken } from "@/lib/tsa";

export const Route = createFileRoute("/api/v1/tsa/$serial")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        await ensureIntegrationTables();
        const sql = await getSql();
        const row = (
          await sql<{ serial: string; token_json: string; document_id: string | null; created_at: string; user_id: string }>`
            select serial, token_json, document_id, created_at, user_id from tsa_tokens where serial = ${params.serial} limit 1
          `
        )[0];
        if (!row) return Response.json({ error: "Not found" }, { status: 404 });
        const token = JSON.parse(row.token_json) as TsaToken;
        const valid = await verifyTsa(row.user_id, token);
        let title = "";
        if (row.document_id) {
          const d = await sql<{ title: string }>`select title from documents where id = ${row.document_id}`;
          title = d[0]?.title ?? "";
        }
        return Response.json({ serial: row.serial, valid, title, createdAt: row.created_at, token });
      },
    },
  },
});
