import { createFileRoute } from "@tanstack/react-router";
import { listTsa } from "@/lib/integrations";
import { requireApiUser } from "@/lib/v1";

export const Route = createFileRoute("/api/v1/tsa")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { userId, error } = await requireApiUser(request);
        if (error || !userId) return error!;
        const url = new URL(request.url);
        const documentId = url.searchParams.get("documentId") || undefined;
        const rows = await listTsa(userId, documentId);
        return Response.json({
          tokens: rows.map((r) => ({
            serial: r.serial,
            createdAt: r.created_at,
            documentId: r.document_id,
            token: JSON.parse(r.token_json) as Record<string, string>,
          })),
        });
      },
    },
  },
});
