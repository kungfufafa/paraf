import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { requireApiUser } from "@/lib/v1";

export const Route = createFileRoute("/api/v1/me")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { userId, error } = await requireApiUser(request);
        if (error || !userId) return error!;
        const sql = await getSql();
        const user = (await sql<{ email: string; name: string }>`select email, name from "user" where id = ${userId} limit 1`)[0];
        const company = (await sql<{ name: string; plan: string }>`select name, plan from companies where user_id = ${userId} limit 1`)[0];
        return Response.json({
          ok: true,
          email: user?.email,
          name: user?.name,
          company: company?.name,
          plan: company?.plan,
        });
      },
    },
  },
});
