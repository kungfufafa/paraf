import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PageHeader } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { getInsights } from "@/lib/api";
import { DOC_TYPE_LABEL } from "@/lib/types";
import { formatRp } from "@/lib/utils";

export const Route = createFileRoute("/_app/insight")({ component: InsightPage });

const COLORS = ["#E85D04", "#152033", "#1d4e89", "#0f7b4b", "#b45309", "#c2413b", "#8b95a3"];

function InsightPage() {
  const { data, refetch } = useQuery({ queryKey: ["insights"], queryFn: () => getInsights() });
  const statusData = Object.entries(data?.statusCounts ?? {}).map(([name, value]) => ({ name, value }));
  const typeData = Object.entries(data?.typeCounts ?? {}).map(([k, value]) => ({
    name: DOC_TYPE_LABEL[k] ?? k,
    value,
  }));

  return (
    <div>
      <PageHeader
        title="Insight penandatanganan"
        subtitle="Status dokumen, waktu penyelesaian, e-Meterai, dan jenis sertifikat."
        actions={
          <Button size="sm" variant="outline" onClick={() => void refetch()}>
            Sinkronkan data
          </Button>
        }
      />
      <div className="grid gap-4 p-4 md:grid-cols-4 md:p-6">
        <Stat label="Total dokumen" value={data?.total ?? 0} />
        <Stat label="Selesai" value={data?.statusCounts.completed ?? 0} />
        <Stat label="Rata-rata jam" value={(data?.avgHours ?? 0).toFixed(1)} />
        <Stat label="e-Meterai terpakai" value={`${data?.emeteraiUsed ?? 0}/${data?.emeteraiTotal ?? 0}`} />
      </div>
      <div className="grid gap-4 px-4 pb-10 md:grid-cols-2 md:px-6">
        <Card title="Dokumen per bulan">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.months ?? []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e6ec" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="sent" fill="#152033" name="Terkirim" radius={4} />
                <Bar dataKey="completed" fill="#E85D04" name="Selesai" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Status dokumen">
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={48} outerRadius={80}>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>
        <Card title="Jenis dokumen">
          <ul className="space-y-2 text-sm">
            {typeData.map((t) => (
              <li key={t.name} className="flex justify-between">
                <span>{t.name}</span>
                <span className="tabular-nums font-medium">{t.value}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title="e-Meterai & sertifikat">
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <dt className="text-muted">Pengeluaran e-Meterai</dt>
              <dd className="font-semibold">{formatRp(data?.emeteraiSpend ?? 0)}</dd>
            </div>
            <div>
              <dt className="text-muted">Dokumen ditandatangani</dt>
              <dd className="font-semibold tabular-nums">{data?.signedCount ?? 0}</dd>
            </div>
            <div>
              <dt className="text-muted">PSrE</dt>
              <dd className="font-semibold tabular-nums">{data?.psre ?? 0}</dd>
            </div>
            <div>
              <dt className="text-muted">GlobalSign</dt>
              <dd className="font-semibold tabular-nums">{data?.global ?? 0}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="text-[11px] text-muted">{label}</div>
      <div className="mt-1 text-2xl font-semibold tabular-nums">{value}</div>
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-border bg-surface p-4">
      <h2 className="mb-3 text-sm font-semibold">{title}</h2>
      {children}
    </section>
  );
}
