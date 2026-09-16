import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { PageHeader, useBoot } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { listStamps, saveStamp } from "@/lib/api";

export const Route = createFileRoute("/_app/stamps")({ component: StampsPage });

function StampsPage() {
  const boot = useBoot();
  const qc = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["stamps"], queryFn: () => listStamps() });
  return (
    <div>
      <PageHeader
        title="Stempel elektronik"
        subtitle="Stempel perusahaan untuk halaman tanda tangan."
        actions={
          <label className="inline-flex">
            <Button size="sm" asChild>
              <span>Unggah stempel</span>
            </Button>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (!f) return;
                const r = new FileReader();
                r.onload = async () => {
                  await saveStamp({ data: { name: f.name, companyName: boot.company.name, dataUrl: String(r.result) } });
                  toast.success("Stempel disimpan");
                  void qc.invalidateQueries({ queryKey: ["stamps"] });
                };
                r.readAsDataURL(f);
              }}
            />
          </label>
        }
      />
      <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 md:p-6">
        {data.map((s) => (
          <article key={s.id} className="rounded-xl border border-border bg-surface p-4">
            <img src={s.data_url} alt={s.name} className="mx-auto h-32 object-contain" />
            <div className="mt-2 text-sm font-medium">{s.name}</div>
            <div className="text-xs text-muted">{s.company_name}</div>
            <Button
              className="mt-3"
              size="sm"
              variant="ghost"
              onClick={async () => {
                await saveStamp({ data: { id: s.id, name: s.name, dataUrl: "", remove: true } });
                toast.success("Dihapus");
                void qc.invalidateQueries({ queryKey: ["stamps"] });
              }}
            >
              Hapus
            </Button>
          </article>
        ))}
      </div>
    </div>
  );
}
