import type { DocContent, DocField, DocSettings, DocStatus } from "./types";
import { DEFAULT_SETTINGS } from "./types";
import { uid } from "./utils";

export function daysAgo(n: number): string {
  return new Date(Date.now() - n * 86400000).toISOString();
}
export function daysFromNow(n: number): string {
  return new Date(Date.now() + n * 86400000).toISOString();
}

type Rec = {
  name: string;
  email: string;
  phone?: string;
  role?: "signer" | "cc" | "approver" | "witness";
  action?: string;
  status?: "waiting" | "signed" | "declined" | "viewed";
  order?: number;
  company?: string;
  signedAt?: string | null;
};

export type SeedDoc = {
  title: string;
  docType: string;
  status: DocStatus;
  compliance: "psre" | "globalsign";
  group: string;
  folder: string;
  createdAt: string;
  sentAt?: string;
  completedAt?: string;
  deadline?: string;
  effective?: string;
  expires?: string;
  declineReason?: string;
  content: DocContent;
  fields: Omit<DocField, "id">[];
  recipients: Rec[];
  settings?: Partial<DocSettings>;
};

const PT = {
  name: "PT Jaya Wijaya Kusuma",
  title: "Direktur Utama",
  company: "PT Jaya Wijaya Kusuma",
  address: "Jl. Tuparev No. 88, Kedawung, Cirebon 45153",
  npwp: "10.221.884.7-437.000",
};

function fieldsFor(
  recIds: string[],
  extras: Array<Partial<DocField> & { type: DocField["type"]; page: number; x: number; y: number }>,
): Omit<DocField, "id">[] {
  return extras.map((e) => ({
    w: e.w ?? (e.type === "emeterai" ? 22 : e.type === "stamp" ? 20 : e.type === "signature" ? 28 : 16),
    h: e.h ?? (e.type === "emeterai" ? 12 : e.type === "stamp" ? 16 : e.type === "signature" ? 10 : 5),
    recipientId: e.recipientId ?? recIds[0]!,
    required: e.required ?? true,
    ...e,
  }));
}

export function buildSeed(ownerEmail: string, ownerName: string): SeedDoc[] {
  const me = ownerEmail;
  const meName = ownerName || "Jaya Wijaya";
  const r1 = uid("r");
  const r2 = uid("r");
  const r3 = uid("r");
  const r4 = uid("r");
  const r5 = uid("r");
  const r6 = uid("r");
  const r7 = uid("r");
  const r8 = uid("r");
  const r9 = uid("r");
  const r10 = uid("r");
  const r11 = uid("r");
  const r12 = uid("r");
  const r13 = uid("r");
  const r14 = uid("r");

  return [
    {
      title: "PKS-2026/HR-014 · Perjanjian Kerja Sama Distribusi",
      docType: "kerjasama",
      status: "need_to_sign",
      compliance: "psre",
      group: "Penjualan Q3",
      folder: "Legal",
      createdAt: daysAgo(2),
      sentAt: daysAgo(2),
      deadline: daysFromNow(5),
      effective: daysFromNow(0).slice(0, 10),
      expires: daysFromNow(365).slice(0, 10),
      recipients: [
        { name: meName, email: me, status: "waiting", order: 1, company: PT.company },
        {
          name: "Andi Pratama",
          email: "andi.pratama@nusantaralogistik.co.id",
          status: "signed",
          order: 1,
          company: "PT Nusantara Logistik Prima",
          signedAt: daysAgo(1),
        },
      ],
      content: {
        kind: "kerjasama",
        number: "PKS-2026/HR-014",
        location: "Cirebon",
        date: "28 Agustus 2026",
        parties: [
          PT,
          {
            name: "Andi Pratama",
            title: "Direktur Operasional",
            company: "PT Nusantara Logistik Prima",
            address: "Kawasan Industri Jababeka, Cikarang, Bekasi 17530",
            npwp: "02.918.441.3-407.000",
          },
        ],
        clauses: [
          {
            title: "Pasal 1 — Ruang Lingkup",
            body: "Pihak Kedua ditunjuk sebagai mitra distribusi resmi untuk wilayah Jawa Barat atas produk perangkat lunak Paraf Enterprise milik Pihak Pertama, termasuk layanan implementasi dan pelatihan pengguna.",
          },
          {
            title: "Pasal 2 — Jangka Waktu",
            body: "Perjanjian ini berlaku selama 12 (dua belas) bulan terhitung sejak tanggal efektif dan dapat diperpanjang secara otomatis kecuali diakhiri secara tertulis 30 hari sebelumnya.",
          },
          {
            title: "Pasal 3 — Imbalan",
            body: "Pihak Kedua berhak atas komisi sebesar 12% (dua belas persen) dari nilai kontrak bersih yang tertagih. Pembayaran dilakukan paling lambat 14 hari kerja setelah invoice diterima.",
          },
          {
            title: "Pasal 4 — Kerahasiaan",
            body: "Para Pihak wajib menjaga kerahasiaan data pelanggan, harga, dan materi teknis selama masa perjanjian dan 24 bulan setelahnya.",
          },
          {
            title: "Pasal 5 — Penyelesaian Sengketa",
            body: "Sengketa diselesaikan terlebih dahulu secara musyawarah. Apabila gagal, para pihak menundukkan diri pada Pengadilan Negeri Cirebon.",
          },
        ],
        amount: "Rp 1.250.000.000",
        amountWords: "Satu miliar dua ratus lima puluh juta rupiah",
      },
      fields: fieldsFor([r1, r2], [
        { type: "signature", page: 2, x: 12, y: 68, recipientId: r1 },
        { type: "stamp", page: 2, x: 14, y: 78, recipientId: r1 },
        { type: "date", page: 2, x: 12, y: 62, recipientId: r1, w: 18 },
        { type: "signature", page: 2, x: 58, y: 68, recipientId: r2 },
        { type: "emeterai", page: 0, x: 72, y: 6, recipientId: r1 },
        { type: "qr", page: 0, x: 86, y: 88, w: 10, h: 8, recipientId: r1 },
      ]),
    },
    {
      title: "NDA-2026/LGL-008 · Perjanjian Kerahasiaan Vendor Cloud",
      docType: "nda",
      status: "need_to_sign",
      compliance: "psre",
      group: "Vendor IT",
      folder: "Legal",
      createdAt: daysAgo(1),
      sentAt: daysAgo(1),
      deadline: daysFromNow(3),
      recipients: [
        { name: meName, email: me, status: "waiting", order: 2, company: PT.company },
        {
          name: "Sari Wulandari",
          email: "sari.wulandari@awanbyte.id",
          status: "signed",
          order: 1,
          company: "PT Awan Byte Indonesia",
          signedAt: daysAgo(0.4),
        },
      ],
      content: {
        kind: "nda",
        number: "NDA-2026/LGL-008",
        location: "Jakarta",
        date: "29 Agustus 2026",
        parties: [
          {
            name: "Sari Wulandari",
            title: "Chief Legal Officer",
            company: "PT Awan Byte Indonesia",
            address: "Gedung Cyber 2, Lt. 18, Jakarta Selatan",
          },
          PT,
        ],
        clauses: [
          {
            title: "Pasal 1 — Informasi Rahasia",
            body: "Informasi Rahasia mencakup arsitektur sistem, kredensial, daftar pelanggan, kode sumber, dan seluruh dokumen yang ditandai Confidential.",
          },
          {
            title: "Pasal 2 — Kewajiban",
            body: "Penerima Informasi hanya boleh mengungkapkannya kepada karyawan yang memiliki kepentingan sah (need-to-know) dan telah menandatangani kewajiban kerahasiaan setara.",
          },
          {
            title: "Pasal 3 — Jangka Waktu",
            body: "Kewajiban kerahasiaan berlaku 3 (tiga) tahun setelah berakhirnya kerja sama.",
          },
        ],
      },
      fields: fieldsFor([r3, r4], [
        { type: "signature", page: 1, x: 14, y: 72, recipientId: r3 },
        { type: "signature", page: 1, x: 56, y: 72, recipientId: r4 },
        { type: "initials", page: 0, x: 82, y: 90, w: 10, h: 5, recipientId: r4 },
      ]),
    },
    {
      title: "INV-88421 · Faktur Penjualan Lisensi Paraf Pro",
      docType: "invoice",
      status: "waiting_for_others",
      compliance: "psre",
      group: "Finance",
      folder: "Finance",
      createdAt: daysAgo(4),
      sentAt: daysAgo(4),
      deadline: daysFromNow(10),
      recipients: [
        { name: meName, email: me, status: "signed", order: 1, company: PT.company, signedAt: daysAgo(4) },
        {
          name: "Budi Santoso",
          email: "budi.santoso@mitrakarya.co.id",
          status: "waiting",
          order: 2,
          company: "PT Mitra Karya Sejahtera",
        },
      ],
      content: {
        kind: "invoice",
        number: "INV-88421",
        location: "Cirebon",
        date: "26 Agustus 2026",
        subject: "Lisensi Paraf Pro 25 pengguna · 12 bulan",
        amount: "Rp 48.750.000",
        amountWords: "Empat puluh delapan juta tujuh ratus lima puluh ribu rupiah",
        parties: [
          PT,
          {
            name: "Budi Santoso",
            title: "Kepala Keuangan",
            company: "PT Mitra Karya Sejahtera",
            address: "Jl. Asia Afrika No. 12, Bandung 40111",
            npwp: "03.112.009.5-423.000",
          },
        ],
        clauses: [
          { title: "Item 1", body: "Lisensi Paraf Pro 25 kursi @ Rp 1.750.000 / tahun — Rp 43.750.000" },
          { title: "Item 2", body: "Onboarding & e-KYC paket — Rp 5.000.000" },
          { title: "Pembayaran", body: "Transfer ke BCA 128-029-8876 a.n. PT Jaya Wijaya Kusuma, jatuh tempo 14 hari." },
        ],
      },
      fields: fieldsFor([r5, r6], [
        { type: "emeterai", page: 0, x: 70, y: 8, recipientId: r5 },
        { type: "signature", page: 0, x: 14, y: 78, recipientId: r5 },
        { type: "stamp", page: 0, x: 16, y: 86, recipientId: r5 },
        { type: "signature", page: 0, x: 58, y: 78, recipientId: r6 },
      ]),
    },
    {
      title: "PKWT-2026/HR-112 · Kontrak Kerja Waktu Tertentu",
      docType: "pkwt",
      status: "waiting_for_others",
      compliance: "psre",
      group: "Onboarding HR",
      folder: "HR",
      createdAt: daysAgo(6),
      sentAt: daysAgo(6),
      deadline: daysFromNow(2),
      effective: "2026-09-01",
      expires: "2027-08-31",
      recipients: [
        { name: meName, email: me, status: "signed", order: 1, company: PT.company, signedAt: daysAgo(6) },
        {
          name: "Dewi Lestari",
          email: "dewi.lestari@gmail.com",
          phone: "0812-4455-7788",
          status: "viewed",
          order: 2,
          company: "",
        },
        { name: "HR Legal Desk", email: "legal@jayawijaya.co.id", role: "cc", action: "receives_copy", status: "waiting", order: 3 },
      ],
      content: {
        kind: "pkwt",
        number: "PKWT-2026/HR-112",
        location: "Cirebon",
        date: "24 Agustus 2026",
        parties: [
          { ...PT, title: "Kuasa Direksi" },
          {
            name: "Dewi Lestari",
            title: "Account Executive",
            company: "Karyawan",
            address: "Perum Harapan Jaya Blok C-12, Cirebon",
          },
        ],
        clauses: [
          { title: "Pasal 1 — Jabatan", body: "Pekerja diangkat sebagai Account Executive, menolak tawaran kerja lain yang bentrok selama masa kontrak." },
          { title: "Pasal 2 — Upah", body: "Upah pokok Rp 8.500.000 / bulan + tunjangan transport Rp 750.000, dibayarkan setiap tanggal 25." },
          { title: "Pasal 3 — Waktu Kerja", body: "Senin–Jumat 08.30–17.30 WIB, 5 hari kerja, mengikuti UU Ketenagakerjaan dan PP 35/2021." },
          { title: "Pasal 4 — Jangka Waktu", body: "PKWT berlaku 12 bulan (1 Sep 2026 – 31 Agu 2027) dan tidak dapat diubah menjadi PKWTT secara otomatis." },
        ],
        amount: "Rp 8.500.000 / bulan",
      },
      fields: fieldsFor([r7, r8], [
        { type: "signature", page: 1, x: 14, y: 70, recipientId: r7 },
        { type: "stamp", page: 1, x: 16, y: 80, recipientId: r7 },
        { type: "signature", page: 1, x: 56, y: 70, recipientId: r8 },
        { type: "emeterai", page: 0, x: 72, y: 6, recipientId: r7 },
      ]),
    },
    {
      title: "SPK-2026/PROC-077 · Pengadaan Perangkat Kantor",
      docType: "spk",
      status: "completed",
      compliance: "psre",
      group: "Procurement",
      folder: "Finance",
      createdAt: daysAgo(18),
      sentAt: daysAgo(18),
      completedAt: daysAgo(12),
      effective: "2026-08-18",
      expires: "2026-12-31",
      recipients: [
        { name: meName, email: me, status: "signed", order: 1, signedAt: daysAgo(17), company: PT.company },
        {
          name: "Rudi Hartono",
          email: "rudi@sumberjayaoffice.com",
          status: "signed",
          order: 2,
          signedAt: daysAgo(12),
          company: "CV Sumber Jaya Office",
        },
      ],
      content: {
        kind: "spk",
        number: "SPK-2026/PROC-077",
        location: "Cirebon",
        date: "12 Agustus 2026",
        amount: "Rp 186.400.000",
        amountWords: "Seratus delapan puluh enam juta empat ratus ribu rupiah",
        parties: [
          PT,
          {
            name: "Rudi Hartono",
            title: "Pemilik",
            company: "CV Sumber Jaya Office",
            address: "Jl. Pekiringan No. 45, Cirebon",
          },
        ],
        clauses: [
          { title: "Lingkup", body: "Pengadaan 12 unit workstation, 2 unit printer A3, dan rak arsip besi sesuai RAB terlampir." },
          { title: "Waktu penyerahan", body: "Maksimal 21 hari kalender setelah SPK ditandatangani." },
          { title: "Garansi", body: "Garansi pabrik 12 bulan + layanan onsite 6 bulan." },
        ],
      },
      fields: fieldsFor([r9, r10], [
        { type: "signature", page: 1, x: 14, y: 72, recipientId: r9 },
        { type: "signature", page: 1, x: 56, y: 72, recipientId: r10 },
        { type: "emeterai", page: 0, x: 72, y: 6, recipientId: r9 },
        { type: "stamp", page: 1, x: 16, y: 82, recipientId: r9 },
      ]),
    },
    {
      title: "MOU-2026/BD-003 · Nota Kesepahaman Kampus & Industri",
      docType: "mou",
      status: "completed",
      compliance: "globalsign",
      group: "Partnership",
      folder: "Legal",
      createdAt: daysAgo(40),
      sentAt: daysAgo(40),
      completedAt: daysAgo(30),
      effective: "2026-07-01",
      expires: "2028-06-30",
      recipients: [
        { name: meName, email: me, status: "signed", order: 1, signedAt: daysAgo(39), company: PT.company },
        {
          name: "Prof. Ir. Hendra Gunawan",
          email: "hendra@unswagati.ac.id",
          status: "signed",
          order: 2,
          signedAt: daysAgo(30),
          company: "Universitas Swadaya Gunung Jati",
        },
      ],
      content: {
        kind: "mou",
        number: "MOU-2026/BD-003",
        location: "Cirebon",
        date: "21 Juli 2026",
        parties: [
          PT,
          {
            name: "Prof. Ir. Hendra Gunawan",
            title: "Rektor",
            company: "Universitas Swadaya Gunung Jati",
            address: "Jl. Pemuda No. 32, Cirebon",
          },
        ],
        clauses: [
          { title: "Tujuan", body: "Kerja sama magang, guest lecture, dan riset terapan tanda tangan digital bagi UMKM Jawa Barat." },
          { title: "Kontribusi", body: "Paraf menyediakan 50 lisensi edukasi. Kampus menyediakan laboratorium dan mahasiswa magang 2 angkatan/tahun." },
        ],
      },
      fields: fieldsFor([r11, r12], [
        { type: "signature", page: 1, x: 14, y: 70, recipientId: r11 },
        { type: "signature", page: 1, x: 56, y: 70, recipientId: r12 },
        { type: "qr", page: 0, x: 86, y: 88, w: 10, h: 8, recipientId: r11 },
      ]),
    },
    {
      title: "SK-2026/DIR-021 · Surat Kuasa Pengurusan NPWP Cabang",
      docType: "kuasa",
      status: "draft",
      compliance: "psre",
      group: "Pajak",
      folder: "Finance",
      createdAt: daysAgo(0.2),
      recipients: [
        { name: meName, email: me, status: "waiting", order: 1, company: PT.company },
        { name: "Nina Maharani", email: "nina.maharani@jayawijaya.co.id", status: "waiting", order: 2, company: PT.company },
      ],
      content: {
        kind: "kuasa",
        number: "SK-2026/DIR-021",
        location: "Cirebon",
        date: "30 Agustus 2026",
        parties: [
          { ...PT, title: "Pemberi Kuasa" },
          {
            name: "Nina Maharani",
            title: "Staff Pajak",
            company: PT.company,
            address: PT.address,
          },
        ],
        clauses: [
          { title: "Kuasa", body: "Penerima kuasa berwenang mengurus pendaftaran NPWP cabang, e-filling, dan korespondensi dengan KPP Pratama Cirebon." },
          { title: "Berlaku", body: "Surat kuasa berlaku hingga 31 Desember 2026 atau dicabut secara tertulis." },
        ],
      },
      fields: fieldsFor([r13, r14], [
        { type: "signature", page: 0, x: 14, y: 72, recipientId: r13 },
        { type: "stamp", page: 0, x: 16, y: 82, recipientId: r13 },
        { type: "name", page: 0, x: 56, y: 72, recipientId: r14 },
        { type: "signature", page: 0, x: 56, y: 78, recipientId: r14 },
      ]),
    },
    {
      title: "SEWA-2026/OPS-009 · Perjanjian Sewa Kantor Kedawung",
      docType: "sewa",
      status: "pending_approval",
      compliance: "psre",
      group: "Operasional",
      folder: "Legal",
      createdAt: daysAgo(3),
      sentAt: daysAgo(3),
      effective: "2026-10-01",
      expires: "2028-09-30",
      recipients: [
        { name: meName, email: me, role: "approver", action: "approve", status: "waiting", order: 1, company: PT.company },
        {
          name: "H. Sutrisno",
          email: "sutrisno.properti@gmail.com",
          status: "waiting",
          order: 2,
          company: "Pemilik Properti",
        },
      ],
      content: {
        kind: "sewa",
        number: "SEWA-2026/OPS-009",
        location: "Cirebon",
        date: "27 Agustus 2026",
        amount: "Rp 14.000.000 / bulan",
        parties: [
          {
            name: "H. Sutrisno",
            title: "Pemilik",
            company: "Perorangan",
            address: "Jl. Sunan Gunung Jati No. 17, Cirebon",
          },
          PT,
        ],
        clauses: [
          { title: "Objek sewa", body: "Ruko 3 lantai, luas 210 m², Jl. Tuparev No. 88, termasuk 4 slot parkir." },
          { title: "Harga sewa", body: "Rp 14.000.000/bulan, dibayar di muka setiap tanggal 1. Deposit 2 bulan." },
          { title: "Jangka waktu", body: "2 tahun, opsi perpanjangan dengan penyesuaian harga maksimal 7%/tahun." },
        ],
      },
      fields: fieldsFor([uid("r"), uid("r")], [
        { type: "signature", page: 1, x: 14, y: 70 },
        { type: "emeterai", page: 0, x: 72, y: 6 },
      ]),
    },
    {
      title: "ADD-2026/LGL-002 · Addendum Perpanjangan PKS Distribusi",
      docType: "addendum",
      status: "declined",
      compliance: "psre",
      group: "Penjualan Q3",
      folder: "Legal",
      createdAt: daysAgo(20),
      sentAt: daysAgo(20),
      declineReason: "Klausul eksklusivitas wilayah terlalu luas — mohon batasi ke Jawa Barat saja.",
      recipients: [
        { name: meName, email: me, status: "signed", order: 1, signedAt: daysAgo(19), company: PT.company },
        {
          name: "Andi Pratama",
          email: "andi.pratama@nusantaralogistik.co.id",
          status: "declined",
          order: 2,
          company: "PT Nusantara Logistik Prima",
        },
      ],
      content: {
        kind: "addendum",
        number: "ADD-2026/LGL-002",
        location: "Cirebon",
        date: "10 Agustus 2026",
        parties: [PT, { name: "Andi Pratama", title: "Direktur", company: "PT Nusantara Logistik Prima", address: "Cikarang" }],
        clauses: [
          { title: "Perubahan Pasal 1", body: "Wilayah distribusi diperluas menjadi seluruh Jawa dan Bali, bersifat eksklusif." },
        ],
      },
      fields: fieldsFor([uid("r"), uid("r")], [
        { type: "signature", page: 0, x: 14, y: 70 },
        { type: "signature", page: 0, x: 56, y: 70 },
      ]),
    },
    {
      title: "POLIS-2026/FIN-044 · Perjanjian Kredit Modal Kerja",
      docType: "kerjasama",
      status: "expired",
      compliance: "psre",
      group: "Finance",
      folder: "Finance",
      createdAt: daysAgo(50),
      sentAt: daysAgo(50),
      deadline: daysAgo(5),
      recipients: [
        { name: meName, email: me, status: "signed", order: 1, signedAt: daysAgo(49), company: PT.company },
        {
          name: "Komite Kredit",
          email: "kredit@bankjateng.co.id",
          status: "waiting",
          order: 2,
          company: "Bank Jateng",
        },
      ],
      content: {
        kind: "kerjasama",
        number: "POLIS-2026/FIN-044",
        location: "Cirebon",
        date: "11 Juli 2026",
        amount: "Rp 2.000.000.000",
        parties: [
          PT,
          { name: "Komite Kredit", title: "Pemimpin Cabang", company: "Bank Jateng Cabang Cirebon", address: "Jl. Siliwangi No. 99" },
        ],
        clauses: [
          { title: "Fasilitas", body: "Kredit modal kerja plafon Rp 2 miliar, bunga 9,5% p.a. floating, tenor 24 bulan." },
        ],
      },
      fields: fieldsFor([uid("r"), uid("r")], [{ type: "signature", page: 1, x: 14, y: 70 }]),
    },
    {
      title: "VOID-2026/HR-019 · Pakta Integritas Vendor Lama",
      docType: "nda",
      status: "voided",
      compliance: "psre",
      group: "Vendor IT",
      folder: "Legal",
      createdAt: daysAgo(25),
      sentAt: daysAgo(25),
      recipients: [
        { name: meName, email: me, status: "waiting", order: 1, company: PT.company },
      ],
      content: {
        kind: "nda",
        number: "VOID-2026/HR-019",
        location: "Cirebon",
        date: "5 Agustus 2026",
        parties: [PT, { name: "Vendor Lama", title: "Direktur", company: "PT Lama Abadi", address: "Jakarta" }],
        clauses: [{ title: "Pakta", body: "Dokumen dibatalkan karena vendor tidak lolos due diligence." }],
      },
      fields: fieldsFor([uid("r")], [{ type: "signature", page: 0, x: 14, y: 72 }]),
    },
    {
      title: "NDA-2026/LGL-011 · NDA Calon Investor Series A",
      docType: "nda",
      status: "completed",
      compliance: "globalsign",
      group: "Fundraising",
      folder: "Legal",
      createdAt: daysAgo(15),
      sentAt: daysAgo(15),
      completedAt: daysAgo(8),
      recipients: [
        { name: meName, email: me, status: "signed", order: 1, signedAt: daysAgo(14), company: PT.company },
        {
          name: "Maya Chen",
          email: "maya.chen@eastventures.com",
          status: "signed",
          order: 2,
          signedAt: daysAgo(8),
          company: "East Ventures",
        },
      ],
      content: {
        kind: "nda",
        number: "NDA-2026/LGL-011",
        location: "Singapore / Cirebon",
        date: "15 Agustus 2026",
        parties: [
          PT,
          { name: "Maya Chen", title: "Principal", company: "East Ventures", address: "One Raffles Quay, Singapore" },
        ],
        clauses: [
          { title: "Purpose", body: "Due diligence for a potential Series A investment in PT Jaya Wijaya Kusuma." },
          { title: "Governing law", body: "This NDA is governed by the laws of Singapore, with courtesy translation in Bahasa Indonesia." },
        ],
      },
      fields: fieldsFor([uid("r"), uid("r")], [
        { type: "signature", page: 1, x: 14, y: 72 },
        { type: "signature", page: 1, x: 56, y: 72 },
        { type: "qr", page: 0, x: 86, y: 88, w: 10, h: 8 },
      ]),
    },
  ].map((d, i) => {
    const recs = d.recipients.map((r, idx) => ({
      ...r,
      _id: `seedr_${i}_${idx}`,
    }));
    const fields = d.fields.map((f, fi) => {
      const rec = recs[Math.min(fi, recs.length - 1)]!;
      return { ...f, recipientId: f.recipientId && recs.some((x) => x._id === f.recipientId) ? f.recipientId : rec._id };
    });
    return { ...d, recipients: recs, fields, settings: { ...DEFAULT_SETTINGS } };
  }) as unknown as SeedDoc[];
}

export const SEED_CONTACTS = [
  { name: "Andi Pratama", email: "andi.pratama@nusantaralogistik.co.id", phone: "0812-1000-2211", company: "PT Nusantara Logistik Prima", group: "Vendor", role: "signer" },
  { name: "Sari Wulandari", email: "sari.wulandari@awanbyte.id", phone: "0813-5550-9090", company: "PT Awan Byte Indonesia", group: "Vendor", role: "signer" },
  { name: "Budi Santoso", email: "budi.santoso@mitrakarya.co.id", phone: "022-4201100", company: "PT Mitra Karya Sejahtera", group: "Klien", role: "signer" },
  { name: "Dewi Lestari", email: "dewi.lestari@gmail.com", phone: "0812-4455-7788", company: "", group: "Karyawan", role: "signer" },
  { name: "Rudi Hartono", email: "rudi@sumberjayaoffice.com", phone: "0231-240088", company: "CV Sumber Jaya Office", group: "Vendor", role: "signer" },
  { name: "Prof. Ir. Hendra Gunawan", email: "hendra@unswagati.ac.id", phone: "0231-481264", company: "Universitas Swadaya Gunung Jati", group: "Partner", role: "signer" },
  { name: "Nina Maharani", email: "nina.maharani@jayawijaya.co.id", phone: "0811-2233-4455", company: "PT Jaya Wijaya Kusuma", group: "Internal", role: "signer" },
  { name: "H. Sutrisno", email: "sutrisno.properti@gmail.com", phone: "0813-2177-8899", company: "Pemilik Properti", group: "Vendor", role: "signer" },
  { name: "Maya Chen", email: "maya.chen@eastventures.com", phone: "+65 8123 4455", company: "East Ventures", group: "Investor", role: "signer" },
  { name: "Legal Desk", email: "legal@jayawijaya.co.id", phone: "0231-888221", company: "PT Jaya Wijaya Kusuma", group: "Internal", role: "cc" },
];

export const SEED_TEMPLATES: Array<{ name: string; docType: string; description: string; content: DocContent }> = [
  {
    name: "PKWT Standar Perusahaan",
    docType: "pkwt",
    description: "Kontrak kerja waktu tertentu sesuai PP 35/2021, field dinamis: nama, jabatan, gaji, tenor.",
    content: {
      kind: "pkwt",
      number: "PKWT-{{nomor}}",
      location: "Cirebon",
      date: "{{tanggal}}",
      parties: [PT, { name: "{{nama_karyawan}}", title: "{{jabatan}}", company: "Karyawan", address: "{{alamat}}" }],
      clauses: [
        { title: "Pasal 1 — Jabatan", body: "Pekerja diangkat sebagai {{jabatan}}." },
        { title: "Pasal 2 — Upah", body: "Upah pokok {{gaji}} per bulan." },
      ],
    },
  },
  {
    name: "NDA Timbal Balik",
    docType: "nda",
    description: "Perjanjian kerahasiaan dua arah, 3 tahun, untuk vendor dan mitra.",
    content: {
      kind: "nda",
      number: "NDA-{{nomor}}",
      location: "Cirebon",
      date: "{{tanggal}}",
      parties: [PT, { name: "{{pihak2}}", title: "{{jabatan2}}", company: "{{perusahaan2}}", address: "{{alamat2}}" }],
      clauses: [{ title: "Informasi Rahasia", body: "Mencakup data pelanggan, harga, dan materi teknis." }],
    },
  },
  {
    name: "Faktur + e-Meterai",
    docType: "invoice",
    description: "Invoice penjualan dengan field e-Meterai otomatis dan stempel perusahaan.",
    content: {
      kind: "invoice",
      number: "INV-{{nomor}}",
      location: "Cirebon",
      date: "{{tanggal}}",
      amount: "{{total}}",
      parties: [PT, { name: "{{klien}}", title: "Finance", company: "{{perusahaan}}", address: "{{alamat}}" }],
      clauses: [{ title: "Item", body: "{{uraian}}" }],
    },
  },
  {
    name: "SPK Pengadaan",
    docType: "spk",
    description: "Surat perintah kerja pengadaan barang/jasa, termasuk SLA dan denda keterlambatan.",
    content: {
      kind: "spk",
      number: "SPK-{{nomor}}",
      location: "Cirebon",
      date: "{{tanggal}}",
      amount: "{{nilai}}",
      parties: [PT, { name: "{{vendor}}", title: "Direktur", company: "{{perusahaan}}", address: "{{alamat}}" }],
      clauses: [{ title: "Lingkup", body: "{{lingkup}}" }],
    },
  },
];
