import { createFileRoute } from "@tanstack/react-router";
import { InboxView } from "@/components/inbox-view";
import { GettingStarted } from "@/components/getting-started";
import { useBoot } from "@/components/app-shell";

export const Route = createFileRoute("/_app/esignature/$folder")({
  validateSearch: (s: Record<string, unknown>): { q?: string; folderId?: string } => ({
    q: typeof s.q === "string" ? s.q : undefined,
    folderId: typeof s.folderId === "string" ? s.folderId : undefined,
  }),
  component: FolderPage,
});

function FolderPage() {
  const { folder } = Route.useParams();
  const { q, folderId } = Route.useSearch();
  const boot = useBoot();
  if (folder === "getting-started") return <GettingStarted />;
  return <InboxView folder={folder} q={q ?? ""} folderId={folderId ?? ""} boot={boot} />;
}
