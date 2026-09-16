import { userIdFromApiKey } from "@/lib/integrations";

export async function requireApiUser(request: Request) {
  const userId = await userIdFromApiKey(request.headers.get("authorization"));
  if (!userId) {
    return {
      userId: null as string | null,
      error: Response.json(
        { error: "Unauthorized. Use Authorization: Bearer paraf_live_…" },
        { status: 401 },
      ),
    };
  }
  return { userId, error: null as Response | null };
}

export async function readJson(req: Request): Promise<Record<string, unknown>> {
  try {
    return (await req.json()) as Record<string, unknown>;
  } catch {
    return {};
  }
}
