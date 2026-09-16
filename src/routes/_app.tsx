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
    <div className="min-h-screen bg-bg">
      <div className="h-12 bg-header" />
      <div className="flex min-h-[calc(100vh-48px)]">
        <div className="hidden w-[92px] bg-rail md:block" />
        <div className="hidden w-56 border-r border-border bg-surface md:block" />
        <div className="flex-1 p-6">
          <div className="skeleton-shimmer h-8 w-48 rounded-md" />
          <div className="mt-6 grid grid-cols-2 gap-2 md:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton-shimmer h-20 rounded-lg" />
            ))}
          </div>
          <div className="mt-6 skeleton-shimmer h-64 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
