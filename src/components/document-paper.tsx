import type { DocContent, DocField, Recipient } from "@/lib/types";
import { FIELD_LABEL } from "@/lib/types";
import { cn } from "@/lib/utils";

export function pageCount(content: DocContent, fields: { page: number }[] = []): number {
  const extra = content.clauses.length > 3 ? 1 : 0;
  const base = 1 + extra + 1;
  const maxField = fields.reduce((m, f) => Math.max(m, f.page + 1), 0);
  return Math.max(base, maxField);
}

export function DocumentPaper({
  content,
  page,
  fields,
  recipients,
  lang,
  interactive,
  selectedId,
  onSelectField,
  onMoveField,
}: {
  content: DocContent;
  page: number;
  fields: DocField[];
  recipients: Recipient[];
  lang: "id" | "en";
  interactive?: boolean;
  selectedId?: string;
  onSelectField?: (id: string) => void;
  onMoveField?: (id: string, x: number, y: number) => void;
}) {
  const pages = pageCount(content, fields);
  const isCover = page === 0;
  const isSign = page === pages - 1;
  const clauseStart = 1;
  const clausePage = !isCover && !isSign;

  return (
    <div
      className="paper-shadow relative mx-auto aspect-[210/297] w-full max-w-[720px] bg-paper text-ink"
      data-page={page}
    >
      <div className="pointer-events-none absolute inset-x-8 top-5 flex items-start justify-between text-[9px] tracking-widest text-subtle uppercase">
        <span>Paraf PSrE · {content.number}</span>
        <span>
          {page + 1}/{pages}
        </span>
      </div>
      <div className="h-full overflow-hidden px-10 pt-12 pb-10">
        {isCover ? <Cover content={content} /> : null}
        {clausePage ? <Clauses content={content} /> : null}
        {isSign ? <SignBlock content={content} /> : null}
      </div>
      {fields
        .filter((f) => Math.min(f.page, Math.max(0, pages - 1)) === page)
        .map((f) => {
          const rec = recipients.find((r) => r.id === f.recipientId);
          return (
            <FieldChip
              key={f.id}
              field={f}
              recipient={rec}
              lang={lang}
              selected={selectedId === f.id}
              interactive={interactive}
              onSelect={() => onSelectField?.(f.id)}
              onMove={onMoveField}
            />
          );
        })}
    </div>
  );
}

function Cover({ content }: { content: DocContent }) {
  const kindTitle: Record<string, string> = {
    pkwt: "PERJANJIAN KERJA WAKTU TERTENTU",
    nda: "PERJANJIAN KERAHASIAAN",
    spk: "SURAT PERINTAH KERJA",
    invoice: "FAKTUR PENJUALAN",
    mou: "NOTA KESEPAHAMAN",
    kuasa: "SURAT KUASA",
    sewa: "PERJANJIAN SEWA MENYEWA",
    addendum: "ADDENDUM PERJANJIAN",
    kerjasama: "PERJANJIAN KERJA SAMA",
  };
  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="text-[11px] font-semibold tracking-[0.18em] text-brand uppercase">
            PT Jaya Wijaya Kusuma
          </div>
          <div className="mt-1 text-[10px] text-muted">Cirebon · Indonesia</div>
        </div>
        <div className="rounded-sm border border-brand/40 px-2 py-1 text-[9px] font-semibold tracking-wider text-brand uppercase">
          Tersertifikasi PSrE
        </div>
      </div>
      <h1 className="text-center text-[17px] font-semibold tracking-wide">
        {kindTitle[content.kind] ?? "DOKUMEN ELEKTRONIK"}
      </h1>
      <p className="mt-2 text-center text-xs text-muted">Nomor: {content.number}</p>
      {content.subject ? (
        <p className="mt-1 text-center text-xs text-ink">{content.subject}</p>
      ) : null}
      <div className="my-5 h-px bg-border" />
      <p className="text-[11px] leading-relaxed text-ink">
        Pada hari ini, {content.date}, bertempat di {content.location}, yang bertanda tangan
        di bawah ini:
      </p>
      <div className="mt-4 space-y-3">
        {content.parties.map((p, i) => (
          <div key={i} className="rounded-md border border-border bg-surface px-3 py-2">
            <div className="text-[10px] font-semibold tracking-wider text-brand uppercase">
              Pihak {i === 0 ? "Pertama" : "Kedua"}
            </div>
            <div className="mt-1 text-[12px] font-semibold">{p.name}</div>
            <div className="text-[11px] text-muted">
              {p.title} · {p.company}
            </div>
            <div className="text-[10px] text-subtle">{p.address}</div>
            {p.npwp ? <div className="text-[10px] text-subtle">NPWP {p.npwp}</div> : null}
          </div>
        ))}
      </div>
      {content.amount ? (
        <div className="mt-4 rounded-md bg-brand-soft px-3 py-2">
          <div className="text-[10px] font-medium tracking-wide text-brand uppercase">Nilai</div>
          <div className="text-sm font-semibold">{content.amount}</div>
          {content.amountWords ? (
            <div className="text-[10px] text-muted italic">{content.amountWords}</div>
          ) : null}
        </div>
      ) : null}
      <p className="mt-4 text-[11px] leading-relaxed text-ink">
        Para Pihak terlebih dahulu menerangkan bahwa mereka sepakat mengikatkan diri dalam
        perjanjian ini dengan syarat dan ketentuan sebagai berikut.
      </p>
      <div className="mt-auto text-[9px] text-subtle">
        Dokumen elektronik ini memiliki kekuatan hukum yang sama dengan dokumen basah sesuai UU ITE
        dan Peraturan Penyelenggara Sertifikasi Elektronik.
      </div>
    </div>
  );
}

function Clauses({ content }: { content: DocContent }) {
  return (
    <div>
      <h2 className="mb-4 text-sm font-semibold tracking-wide">KETENTUAN PERJANJIAN</h2>
      <div className="space-y-4">
        {content.clauses.map((c, i) => (
          <section key={i}>
            <h3 className="text-[12px] font-semibold">{c.title}</h3>
            <p className="mt-1 text-[11px] leading-relaxed text-ink">{c.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
}

function SignBlock({ content }: { content: DocContent }) {
  return (
    <div className="flex h-full flex-col">
      <p className="text-[11px] leading-relaxed">
        Demikian perjanjian ini dibuat dalam rangkap elektronik yang ditandatangani secara digital
        oleh Para Pihak, masing-masing mempunyai kekuatan hukum yang sama.
      </p>
      <p className="mt-3 text-[11px]">
        Dibuat di {content.location}, pada tanggal {content.date}.
      </p>
      <div className="mt-10 grid grid-cols-2 gap-8">
        {content.parties.map((p, i) => (
          <div key={i} className="text-center">
            <div className="text-[10px] font-semibold tracking-wider text-muted uppercase">
              Pihak {i === 0 ? "Pertama" : "Kedua"}
            </div>
            <div className="mt-1 text-[11px]">{p.company}</div>
            <div className="h-24" />
            <div className="text-[12px] font-semibold underline decoration-ink/30 underline-offset-4">
              {p.name}
            </div>
            <div className="text-[10px] text-muted">{p.title}</div>
          </div>
        ))}
      </div>
      <div className="mt-auto border-t border-border pt-3 text-[9px] leading-relaxed text-subtle">
        Setiap tanda tangan digital pada dokumen ini diterbitkan atas nama pemegang sertifikat PSrE
        Paraf, dilengkapi jejak audit, stempel waktu, dan kode QR verifikasi. Pemalsuan dikenai
        sanksi pidana.
      </div>
    </div>
  );
}

function FieldChip({
  field,
  recipient,
  lang,
  selected,
  interactive,
  onSelect,
  onMove,
}: {
  field: DocField;
  recipient?: Recipient;
  lang: "id" | "en";
  selected?: boolean;
  interactive?: boolean;
  onSelect?: () => void;
  onMove?: (id: string, x: number, y: number) => void;
}) {
  const filled = Boolean(field.value);
  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={(e) => {
        e.stopPropagation();
        onSelect?.();
      }}
      onPointerDown={(e) => {
        if (!interactive || !onMove) return;
        const parent = (e.currentTarget as HTMLElement).offsetParent as HTMLElement | null;
        if (!parent) return;
        const startX = e.clientX;
        const startY = e.clientY;
        const origX = field.x;
        const origY = field.y;
        const w = parent.clientWidth;
        const h = parent.clientHeight;
        const move = (ev: PointerEvent) => {
          const nx = Math.min(92, Math.max(2, origX + ((ev.clientX - startX) / w) * 100));
          const ny = Math.min(92, Math.max(2, origY + ((ev.clientY - startY) / h) * 100));
          onMove(field.id, nx, ny);
        };
        const up = () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
        };
        window.addEventListener("pointermove", move);
        window.addEventListener("pointerup", up);
      }}
      className={cn(
        "absolute z-10 flex items-center justify-center overflow-hidden rounded-xs border border-dashed text-[10px] leading-tight",
        filled
          ? "border-success/50 bg-success-soft/80"
          : "border-brand/70 bg-brand-soft/80",
        selected && "ring-2 ring-brand",
        interactive && onMove && "cursor-grab active:cursor-grabbing",
        interactive && !onMove && "cursor-pointer",
      )}
      style={{
        left: `${field.x}%`,
        top: `${field.y}%`,
        width: `${field.w}%`,
        height: `${field.h}%`,
      }}
    >
      {filled && (field.type === "signature" || field.type === "initials") && field.value?.startsWith("data:") ? (
        <img src={field.value} alt="" className="h-full w-full object-contain" />
      ) : filled && field.type === "signature" ? (
        <span className="sign-font text-lg text-ink">{field.value}</span>
      ) : filled && field.type === "emeterai" ? (
        <EmeteraiMark serial={field.value ?? "EM-DEMO"} />
      ) : filled && field.type === "stamp" && field.value?.startsWith("data:") ? (
        <img src={field.value} alt="" className="h-full w-full object-contain" />
      ) : filled && field.type === "qr" ? (
        <QrMark seed={field.value ?? field.id} />
      ) : filled ? (
        <span className="px-1 text-[10px] font-medium">{field.value}</span>
      ) : (
        <span className="px-1 text-center text-[9px] font-medium text-brand">
          {FIELD_LABEL[field.type][lang]}
          {recipient ? ` · ${recipient.name.split(" ")[0]}` : ""}
        </span>
      )}
    </div>
  );
}

export function EmeteraiMark({ serial }: { serial: string }) {
  const legal = Boolean(serial) && !serial.startsWith("DEMO");
  return (
    <div className={`flex h-full w-full items-center gap-1 px-1 ${legal ? "bg-success-soft" : "bg-warning-soft"}`}>
      <svg viewBox="0 0 32 32" className="size-6 shrink-0">
        <rect x="2" y="2" width="28" height="28" rx="3" fill={legal ? "#0F7B4B" : "#C2410C"} />
        {legal ? (
          <path d="M8 16.5 13 21 24 10" stroke="#fff" strokeWidth="2.4" fill="none" />
        ) : (
          <text x="16" y="20" textAnchor="middle" fontSize="8" fill="#fff" fontWeight="700">
            DEMO
          </text>
        )}
      </svg>
      <div className="min-w-0">
        <div className={`truncate text-[8px] font-bold tracking-wide ${legal ? "text-success" : "text-warning"}`}>
          {legal ? "e-METERAI SAH" : "e-METERAI DEMO"}
        </div>
        <div className={`truncate text-[7px] ${legal ? "text-success" : "text-warning"}`}>{serial.slice(0, 16)}</div>
      </div>
    </div>
  );
}

export function QrMark({ seed }: { seed: string }) {
  const bits = Array.from({ length: 49 }, (_, i) => {
    const n = seed.charCodeAt(i % seed.length) + i * 13;
    return n % 3 !== 0;
  });
  return (
    <svg viewBox="0 0 7 7" className="h-[90%] w-[90%]">
      {bits.map((on, i) =>
        on ? (
          <rect
            key={i}
            x={i % 7}
            y={Math.floor(i / 7)}
            width="1"
            height="1"
            fill="#1B2430"
          />
        ) : null,
      )}
    </svg>
  );
}
