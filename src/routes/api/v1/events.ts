import { createFileRoute } from "@tanstack/react-router";
import { listWebhookDeliveries } from "@/lib/integrations";
import { requireApiUser } from "@/lib/v1";

export const Route = createFileRoute("/api/v1/events")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { userId, error } = await requireApiUser(request);
        if (error || !userId) return error!;
        const rows = await listWebhookDeliveries(userId);
        return Response.json({
          events: rows.map((r) => ({
            id: r.id,
            event: r.event,
            status: r.status,
            error: r.error,
            createdAt: r.created_at,
          })),
        });
      },
    },
  },
});
