import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ParafLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { getDemoInvites } from "@/lib/api";

export const Route = createFileRoute("/coba")({ component: CobaPage });

function CobaPage() {
  const { data, isPending } = useQuery({ queryKey: ["demo-invites"], queryFn: () => getDemoInvites() });

  return (
    <div className="min-h-screen bg-bg">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-5 py-4">
        <Link to="/">
          <ParafLogo />
        </Link>
        <Button asChild variant="ghost" size="sm">
          <Link to="/login">Masuk pengirim</Link>
        </Button>
      </header>
      <main className="mx-auto max-w-3xl px-5 py-10">
        <p className="text-xs font-semibold tracking-[0.2em] text-brand uppercase">Plug and play</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">Tanda tangani sebagai pihak lain</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          Setiap penerima dapat tautan unik. Tidak perlu akun Paraf — buka tautan, setuju, bubuhkan paraf. Pengirim
          melihat statusnya langsung di kotak masuk.
        </p>
        {isPending ? (
          <div className="mt-8 h-40 animate-pulse rounded-xl bg-surface" />
        ) : (
          <ul className="mt-8 grid gap-3">
            <li className="rounded-xl border border-border bg-surface px-4 py-3 text-sm">
              <span className="font-medium">{data?.title}</span>
              <span className="mt-0.5 block text-muted">Undangan demo siap pakai</span>
            </li>
            {(data?.invites ?? []).map((inv) => (
              <li key={inv.token} className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{inv.name}</p>
                  <p className="text-xs text-muted">{inv.email}</p>
                </div>
                {inv.signed ? (
                  <span className="text-sm text-success">Sudah menandatangani</span>
                ) : (
                  <Button asChild>
                    <Link to="/s/$token" params={{ token: inv.token }}>
                      Buka tautan saya
                    </Link>
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
