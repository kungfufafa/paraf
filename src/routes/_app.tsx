import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AppShell } from "@/components/app-shell";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { bootstrap } from "@/lib/api";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const { user, isPending } = useCurrentUserState();
  const boot = useQuery({
    queryKey: ["boot"],
    queryFn: () => bootstrap(),
    enabled: Boolean(user),
  });

  if (isPending) return <ShellSkeleton />;
  if (!user) return <RedirectToSignIn to="/login" />;
  if (boot.isPending) return <ShellSkeleton />;
  if (boot.error) {
    return (
      <div className="grid min-h-screen place-items-center p-6 text-center">
        <div>
          <h1 className="font-semibold">Gagal memuat ruang kerja</h1>
          <p className="mt-2 text-sm text-muted">{(boot.error as Error).message}</p>
        </div>
      </div>
    );
  }
  if (!boot.data) return <ShellSkeleton />;

  return (
    <AppShell boot={boot.data}>
      <Outlet />
    </AppShell>
  );
}

function ShellSkeleton() {
  return (
    <div className="flex min-h-screen bg-bg">
      <div className="hidden w-[248px] shrink-0 border-r border-border bg-surface md:block" />
      <div className="flex-1 px-4 pt-8 md:px-6">
        <div className="skeleton-shimmer h-8 w-56 rounded-lg" />
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton-shimmer h-28 rounded-2xl" />
          ))}
        </div>
        <div className="mt-3 skeleton-shimmer h-72 rounded-2xl" />
      </div>
    </div>
  );
}
