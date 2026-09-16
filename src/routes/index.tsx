import { Link, Navigate, createFileRoute } from "@tanstack/react-router";
import { FileCheck2, QrCode, ShieldCheck, Stamp, WandSparkles, Workflow } from "lucide-react";
import { ParafLogo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/")({ component: Home });

const FEATURES = [
  { icon: FileCheck2, title: "Tanda tangan PSrE", body: "Sah di Indonesia, dilengkapi sertifikat, stempel waktu, dan jejak audit." },
  { icon: Stamp, title: "e-Meterai resmi", body: "Bubuhkan meterai elektronik, kelola kuota, dan lacak nomor seri." },
  { icon: Workflow, title: "Alur berurutan", body: "Signer, approver, saksi, dan CC — paralel atau bergiliran." },
  { icon: ShieldCheck, title: "Persetujuan bertingkat", body: "Template Legal → Finance → Direksi sebelum dokumen dikirim." },
  { icon: QrCode, title: "QR & verifikasi publik", body: "Siapa pun bisa cek keaslian dokumen lewat tautan atau kode QR." },
  { icon: WandSparkles, title: "Asisten AI kontrak", body: "Ringkas risiko pasal, klausul hilang, dan rekomendasi revisi." },
];

function Home() {
  const { user, isPending } = useCurrentUserState();
  if (!isPending && user) return <Navigate to="/esignature/$folder" params={{ folder: "all-inbox" }} />;

  return (
    <div className="min-h-screen bg-bg">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
        <ParafLogo />
        <div className="flex gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/login">Masuk</Link>
          </Button>
          <Button asChild size="sm">
            <Link to="/login">Mulai</Link>
          </Button>
        </div>
      </header>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-12 lg:grid-cols-2 lg:py-20">
        <div>
          <p className="text-xs font-semibold tracking-[0.2em] text-brand uppercase">PSrE · e-Meterai · Jejak audit</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
            Ruang kerja tanda tangan digital untuk perusahaan Indonesia.
          </h1>
          <p className="mt-4 max-w-lg text-muted leading-relaxed">
            Unggah kontrak, taruh kolom paraf, kirim lewat email atau WhatsApp, dan kunci dokumen begitu semua pihak
            menandatangani. Tanpa print-scan-sign.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/login">Masuk ke kotak masuk</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/coba">Tanda tangani sebagai mitra</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/verify">Verifikasi dokumen</Link>
            </Button>
          </div>
          <dl className="mt-10 grid grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-2xl font-semibold tabular-nums">PSrE</dt>
              <dd className="text-muted">Tersertifikasi</dd>
            </div>
            <div>
              <dt className="text-2xl font-semibold tabular-nums">7×</dt>
              <dd className="text-muted">Lebih cepat</dd>
            </div>
            <div>
              <dt className="text-2xl font-semibold tabular-nums">ISO</dt>
              <dd className="text-muted">27001 ready</dd>
            </div>
          </dl>
        </div>
        <div className="rounded-xl border border-border bg-surface p-4 shadow-soft">
          <div className="mb-3 flex items-center justify-between text-xs text-muted">
            <span>Inbox · Perlu ditandatangani</span>
            <span className="rounded-full bg-brand-soft px-2 py-0.5 font-medium text-brand">2 menunggu</span>
          </div>
          {["PKS Distribusi Q3", "NDA Vendor Cloud", "PKWT Account Executive"].map((n, i) => (
            <div key={n} className="flex items-center justify-between border-t border-border py-3">
              <div>
                <div className="text-sm font-medium">{n}</div>
                <div className="text-[11px] text-muted">{i === 2 ? "Menunggu orang lain" : "Perlu tanda tangan Anda"}</div>
              </div>
              <span className="text-xs font-medium text-brand">Tinjau</span>
            </div>
          ))}
        </div>
      </section>
      <section className="border-t border-border bg-surface py-14">
        <div className="mx-auto grid max-w-6xl gap-4 px-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <article key={f.title} className="rounded-xl border border-border p-5">
              <f.icon className="size-5 text-brand" />
              <h2 className="mt-3 font-semibold">{f.title}</h2>
              <p className="mt-1 text-sm text-muted">{f.body}</p>
            </article>
          ))}
        </div>
      </section>
      <footer className="px-5 py-8 text-center text-xs text-subtle">
        Paraf — tanda tangan digital & e-Meterai.
      </footer>
    </div>
  );
}
