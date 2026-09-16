import type { DocContent, DocumentRow, Recipient } from "./types";

export function myRecipient(doc: DocumentRow, email: string): Recipient | undefined {
  return doc.recipients.find((r) => r.email.toLowerCase() === email.toLowerCase());
}

export function canSign(doc: DocumentRow, email: string): boolean {
  if (["completed", "declined", "expired", "voided", "draft", "pending_approval", "scheduled"].includes(doc.status))
    return false;
  const mine = myRecipient(doc, email);
  if (!mine || mine.status === "signed" || mine.status === "declined") return false;
  if (mine.role === "cc") return false;
  if (doc.settings.sequential) {
    const prior = doc.recipients.filter((r) => r.orderIndex < mine.orderIndex && r.role !== "cc");
    if (prior.some((r) => r.status !== "signed")) return false;
  }
  return mine.action === "needs_to_sign" || mine.role === "signer" || mine.role === "approver";
}

export function progress(doc: DocumentRow): { signed: number; total: number } {
  const signers = doc.recipients.filter((r) => r.role !== "cc");
  return { signed: signers.filter((r) => r.status === "signed").length, total: signers.length };
}

export function signingLink(token: string): string {
  if (typeof window === "undefined") return `/s/${token}`;
  return `${window.location.origin}/s/${token}`;
}

export function recipientSigningLink(inviteToken: string | undefined, fallbackDocToken: string): string {
  return signingLink(inviteToken || fallbackDocToken);
}

export function blankContent(docType: string, title: string, company: string): DocContent {
  const number = `${docType.toUpperCase()}-${new Date().getFullYear()}/${String(Date.now()).slice(-5)}`;
  const date = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(),
  );
  const us = {
    name: "Kuasa Direksi",
    title: "Direktur Utama",
    company,
    address: "Jl. Tuparev No. 88, Kedawung, Cirebon 45153",
    npwp: "10.221.884.7-437.000",
  };
  const them = { name: "Pihak Kedua", title: "Direktur", company: "—", address: "—" };
  const clausesFor: Record<string, { title: string; body: string }[]> = {
    pkwt: [
      { title: "Pasal 1 — Jabatan", body: "Pekerja diangkat sesuai uraian jabatan terlampir dan wajib menaati peraturan perusahaan." },
      { title: "Pasal 2 — Upah", body: "Upah dibayarkan setiap tanggal 25 dengan rincian yang disepakati para pihak." },
      { title: "Pasal 3 — Jangka waktu", body: "PKWT berlaku 12 bulan dan tidak beralih otomatis menjadi PKWTT." },
      { title: "Pasal 4 — Pengakhiran", body: "Pengakhiran mengikuti UU Ketenagakerjaan dan PP 35/2021." },
    ],
    nda: [
      { title: "Pasal 1 — Informasi rahasia", body: "Mencakup data pelanggan, harga, arsitektur, dan dokumen bertanda Confidential." },
      { title: "Pasal 2 — Kewajiban", body: "Penerima hanya boleh mengungkap pada pihak need-to-know yang terikat kerahasiaan setara." },
      { title: "Pasal 3 — Jangka waktu", body: "Kewajiban berlaku 3 tahun setelah berakhirnya kerja sama." },
    ],
    invoice: [
      { title: "Uraian", body: title },
      { title: "Pembayaran", body: "Transfer ke rekening perusahaan paling lambat 14 hari setelah invoice diterima." },
    ],
    spk: [
      { title: "Lingkup", body: "Pekerjaan dilaksanakan sesuai spesifikasi terlampir." },
      { title: "Waktu", body: "Penyelesaian paling lambat 21 hari kalender." },
      { title: "Sanksi", body: "Keterlambatan dikenai denda 1‰ per hari, maksimum 5% nilai SPK." },
    ],
    mou: [
      { title: "Tujuan", body: "Para pihak sepakat menjajaki kerja sama sebagaimana judul dokumen ini." },
      { title: "Tidak mengikat komersial", body: "MoU ini tidak menimbulkan kewajiban pembayaran kecuali disepakati dalam perjanjian lanjutan." },
    ],
    kuasa: [
      { title: "Kuasa", body: "Penerima kuasa berwenang melakukan tindakan yang disebutkan dalam dokumen ini atas nama pemberi kuasa." },
      { title: "Berlaku", body: "Kuasa berlaku hingga dicabut secara tertulis." },
    ],
    sewa: [
      { title: "Objek sewa", body: "Objek sewa beserta kelengkapan sebagaimana dilampirkan." },
      { title: "Harga", body: "Harga sewa dibayar di muka setiap tanggal 1." },
      { title: "Jangka waktu", body: "Sewa berlaku sesuai tanggal efektif dan kedaluwarsa pada halaman pengaturan." },
    ],
    kerjasama: [
      { title: "Pasal 1 — Ruang lingkup", body: "Para pihak bekerja sama sesuai judul perjanjian ini." },
      { title: "Pasal 2 — Imbalan", body: "Imbalan dan cara pembayaran diatur dalam lampiran komersial." },
      { title: "Pasal 3 — Kerahasiaan", body: "Para pihak menjaga kerahasiaan data selama masa perjanjian dan 24 bulan setelahnya." },
      { title: "Pasal 4 — Sengketa", body: "Sengketa diselesaikan musyawarah; jika gagal, para pihak menundukkan diri pada PN Cirebon." },
    ],
    addendum: [{ title: "Perubahan", body: "Para pihak mengubah ketentuan perjanjian induk sebagaimana diuraikan di sini." }],
  };
  return {
    kind: docType,
    number,
    location: "Cirebon",
    date,
    subject: title,
    parties: [us, them],
    clauses: clausesFor[docType] ?? [{ title: "Ketentuan", body: title }],
  };
}

export function contentFromImportedFile(name: string, text: string, company: string): DocContent {
  const base = blankContent("other", name.replace(/\.[^.]+$/, ""), company);
  const chunks = text
    .replace(/\r/g, "")
    .split(/\n{2,}/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 14);
  if (!chunks.length) {
    base.clauses = [
      {
        title: "Berkas impor",
        body: `${name} diimpor dari Google Drive / OneDrive. Isi biner (PDF/gambar) tidak diekstrak — letakkan kolom tanda tangan lalu kirim.`,
      },
    ];
    return base;
  }
  base.clauses = chunks.map((c, i) => {
    const lines = c.split("\n").map((l) => l.trim()).filter(Boolean);
    const title = (lines[0] || `Bagian ${i + 1}`).slice(0, 90);
    const body = (lines.length > 1 ? lines.slice(1).join(" ") : c).slice(0, 2400);
    return { title, body };
  });
  return base;
}

export function exportDocsCsv(docs: DocumentRow[]) {
  const header = ["Judul", "Status", "Tipe", "Grup", "Penerima", "Dibuat", "Tenggat"];
  const lines = docs.map((d) =>
    [
      d.title,
      d.status,
      d.docType,
      d.groupName,
      d.recipients.map((r) => r.email).join("; "),
      d.createdAt,
      d.deadline ?? "",
    ]
      .map((c) => `"${String(c).replaceAll('"', '""')}"`)
      .join(","),
  );
  const blob = new Blob([[header.join(","), ...lines].join("\n")], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `paraf-dokumen-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}
