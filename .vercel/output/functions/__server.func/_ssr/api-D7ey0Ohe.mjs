import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CGdnV_aG.mjs";
import { cn as _enum, dn as boolean, gn as object, hn as number, ln as any, un as array, yn as string } from "../_libs/@better-auth/core+[...].mjs";
import { D as myRecipient, R as uid, S as issueWorkspaceTsa, f as ensureIntegrationTables, i as blankContent, s as canSign, u as dispatchWebhook, y as getSql } from "./integrations-BY7zkbKR.mjs";
import { i as FOLDER_ROUTES, t as DEFAULT_SETTINGS } from "./types-DfCXKDmj.mjs";
import { a as parseAiReview, i as createServerRpc, r as chatComplete, t as aiFrom } from "./ai-providers-CQVzkqqu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-D7ey0Ohe.js
function daysAgo(n) {
	return (/* @__PURE__ */ new Date(Date.now() - n * 864e5)).toISOString();
}
function daysFromNow(n) {
	return new Date(Date.now() + n * 864e5).toISOString();
}
var PT = {
	name: "PT Jaya Wijaya Kusuma",
	title: "Direktur Utama",
	company: "PT Jaya Wijaya Kusuma",
	address: "Jl. Tuparev No. 88, Kedawung, Cirebon 45153",
	npwp: "10.221.884.7-437.000"
};
function fieldsFor(recIds, extras) {
	return extras.map((e) => ({
		w: e.w ?? (e.type === "emeterai" ? 22 : e.type === "stamp" ? 20 : e.type === "signature" ? 28 : 16),
		h: e.h ?? (e.type === "emeterai" ? 12 : e.type === "stamp" ? 16 : e.type === "signature" ? 10 : 5),
		recipientId: e.recipientId ?? recIds[0],
		required: e.required ?? true,
		...e
	}));
}
function buildSeed(ownerEmail, ownerName) {
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
			recipients: [{
				name: meName,
				email: me,
				status: "waiting",
				order: 1,
				company: PT.company
			}, {
				name: "Andi Pratama",
				email: "andi.pratama@nusantaralogistik.co.id",
				status: "signed",
				order: 1,
				company: "PT Nusantara Logistik Prima",
				signedAt: daysAgo(1)
			}],
			content: {
				kind: "kerjasama",
				number: "PKS-2026/HR-014",
				location: "Cirebon",
				date: "28 Agustus 2026",
				parties: [PT, {
					name: "Andi Pratama",
					title: "Direktur Operasional",
					company: "PT Nusantara Logistik Prima",
					address: "Kawasan Industri Jababeka, Cikarang, Bekasi 17530",
					npwp: "02.918.441.3-407.000"
				}],
				clauses: [
					{
						title: "Pasal 1 — Ruang Lingkup",
						body: "Pihak Kedua ditunjuk sebagai mitra distribusi resmi untuk wilayah Jawa Barat atas produk perangkat lunak Paraf Enterprise milik Pihak Pertama, termasuk layanan implementasi dan pelatihan pengguna."
					},
					{
						title: "Pasal 2 — Jangka Waktu",
						body: "Perjanjian ini berlaku selama 12 (dua belas) bulan terhitung sejak tanggal efektif dan dapat diperpanjang secara otomatis kecuali diakhiri secara tertulis 30 hari sebelumnya."
					},
					{
						title: "Pasal 3 — Imbalan",
						body: "Pihak Kedua berhak atas komisi sebesar 12% (dua belas persen) dari nilai kontrak bersih yang tertagih. Pembayaran dilakukan paling lambat 14 hari kerja setelah invoice diterima."
					},
					{
						title: "Pasal 4 — Kerahasiaan",
						body: "Para Pihak wajib menjaga kerahasiaan data pelanggan, harga, dan materi teknis selama masa perjanjian dan 24 bulan setelahnya."
					},
					{
						title: "Pasal 5 — Penyelesaian Sengketa",
						body: "Sengketa diselesaikan terlebih dahulu secara musyawarah. Apabila gagal, para pihak menundukkan diri pada Pengadilan Negeri Cirebon."
					}
				],
				amount: "Rp 1.250.000.000",
				amountWords: "Satu miliar dua ratus lima puluh juta rupiah"
			},
			fields: fieldsFor([r1, r2], [
				{
					type: "signature",
					page: 2,
					x: 12,
					y: 68,
					recipientId: r1
				},
				{
					type: "stamp",
					page: 2,
					x: 14,
					y: 78,
					recipientId: r1
				},
				{
					type: "date",
					page: 2,
					x: 12,
					y: 62,
					recipientId: r1,
					w: 18
				},
				{
					type: "signature",
					page: 2,
					x: 58,
					y: 68,
					recipientId: r2
				},
				{
					type: "emeterai",
					page: 0,
					x: 72,
					y: 6,
					recipientId: r1
				},
				{
					type: "qr",
					page: 0,
					x: 86,
					y: 88,
					w: 10,
					h: 8,
					recipientId: r1
				}
			])
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
			recipients: [{
				name: meName,
				email: me,
				status: "waiting",
				order: 2,
				company: PT.company
			}, {
				name: "Sari Wulandari",
				email: "sari.wulandari@awanbyte.id",
				status: "signed",
				order: 1,
				company: "PT Awan Byte Indonesia",
				signedAt: daysAgo(.4)
			}],
			content: {
				kind: "nda",
				number: "NDA-2026/LGL-008",
				location: "Jakarta",
				date: "29 Agustus 2026",
				parties: [{
					name: "Sari Wulandari",
					title: "Chief Legal Officer",
					company: "PT Awan Byte Indonesia",
					address: "Gedung Cyber 2, Lt. 18, Jakarta Selatan"
				}, PT],
				clauses: [
					{
						title: "Pasal 1 — Informasi Rahasia",
						body: "Informasi Rahasia mencakup arsitektur sistem, kredensial, daftar pelanggan, kode sumber, dan seluruh dokumen yang ditandai Confidential."
					},
					{
						title: "Pasal 2 — Kewajiban",
						body: "Penerima Informasi hanya boleh mengungkapkannya kepada karyawan yang memiliki kepentingan sah (need-to-know) dan telah menandatangani kewajiban kerahasiaan setara."
					},
					{
						title: "Pasal 3 — Jangka Waktu",
						body: "Kewajiban kerahasiaan berlaku 3 (tiga) tahun setelah berakhirnya kerja sama."
					}
				]
			},
			fields: fieldsFor([r3, r4], [
				{
					type: "signature",
					page: 1,
					x: 14,
					y: 72,
					recipientId: r3
				},
				{
					type: "signature",
					page: 1,
					x: 56,
					y: 72,
					recipientId: r4
				},
				{
					type: "initials",
					page: 0,
					x: 82,
					y: 90,
					w: 10,
					h: 5,
					recipientId: r4
				}
			])
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
			recipients: [{
				name: meName,
				email: me,
				status: "signed",
				order: 1,
				company: PT.company,
				signedAt: daysAgo(4)
			}, {
				name: "Budi Santoso",
				email: "budi.santoso@mitrakarya.co.id",
				status: "waiting",
				order: 2,
				company: "PT Mitra Karya Sejahtera"
			}],
			content: {
				kind: "invoice",
				number: "INV-88421",
				location: "Cirebon",
				date: "26 Agustus 2026",
				subject: "Lisensi Paraf Pro 25 pengguna · 12 bulan",
				amount: "Rp 48.750.000",
				amountWords: "Empat puluh delapan juta tujuh ratus lima puluh ribu rupiah",
				parties: [PT, {
					name: "Budi Santoso",
					title: "Kepala Keuangan",
					company: "PT Mitra Karya Sejahtera",
					address: "Jl. Asia Afrika No. 12, Bandung 40111",
					npwp: "03.112.009.5-423.000"
				}],
				clauses: [
					{
						title: "Item 1",
						body: "Lisensi Paraf Pro 25 kursi @ Rp 1.750.000 / tahun — Rp 43.750.000"
					},
					{
						title: "Item 2",
						body: "Onboarding & e-KYC paket — Rp 5.000.000"
					},
					{
						title: "Pembayaran",
						body: "Transfer ke BCA 128-029-8876 a.n. PT Jaya Wijaya Kusuma, jatuh tempo 14 hari."
					}
				]
			},
			fields: fieldsFor([r5, r6], [
				{
					type: "emeterai",
					page: 0,
					x: 70,
					y: 8,
					recipientId: r5
				},
				{
					type: "signature",
					page: 0,
					x: 14,
					y: 78,
					recipientId: r5
				},
				{
					type: "stamp",
					page: 0,
					x: 16,
					y: 86,
					recipientId: r5
				},
				{
					type: "signature",
					page: 0,
					x: 58,
					y: 78,
					recipientId: r6
				}
			])
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
				{
					name: meName,
					email: me,
					status: "signed",
					order: 1,
					company: PT.company,
					signedAt: daysAgo(6)
				},
				{
					name: "Dewi Lestari",
					email: "dewi.lestari@gmail.com",
					phone: "0812-4455-7788",
					status: "viewed",
					order: 2,
					company: ""
				},
				{
					name: "HR Legal Desk",
					email: "legal@jayawijaya.co.id",
					role: "cc",
					action: "receives_copy",
					status: "waiting",
					order: 3
				}
			],
			content: {
				kind: "pkwt",
				number: "PKWT-2026/HR-112",
				location: "Cirebon",
				date: "24 Agustus 2026",
				parties: [{
					...PT,
					title: "Kuasa Direksi"
				}, {
					name: "Dewi Lestari",
					title: "Account Executive",
					company: "Karyawan",
					address: "Perum Harapan Jaya Blok C-12, Cirebon"
				}],
				clauses: [
					{
						title: "Pasal 1 — Jabatan",
						body: "Pekerja diangkat sebagai Account Executive, menolak tawaran kerja lain yang bentrok selama masa kontrak."
					},
					{
						title: "Pasal 2 — Upah",
						body: "Upah pokok Rp 8.500.000 / bulan + tunjangan transport Rp 750.000, dibayarkan setiap tanggal 25."
					},
					{
						title: "Pasal 3 — Waktu Kerja",
						body: "Senin–Jumat 08.30–17.30 WIB, 5 hari kerja, mengikuti UU Ketenagakerjaan dan PP 35/2021."
					},
					{
						title: "Pasal 4 — Jangka Waktu",
						body: "PKWT berlaku 12 bulan (1 Sep 2026 – 31 Agu 2027) dan tidak dapat diubah menjadi PKWTT secara otomatis."
					}
				],
				amount: "Rp 8.500.000 / bulan"
			},
			fields: fieldsFor([r7, r8], [
				{
					type: "signature",
					page: 1,
					x: 14,
					y: 70,
					recipientId: r7
				},
				{
					type: "stamp",
					page: 1,
					x: 16,
					y: 80,
					recipientId: r7
				},
				{
					type: "signature",
					page: 1,
					x: 56,
					y: 70,
					recipientId: r8
				},
				{
					type: "emeterai",
					page: 0,
					x: 72,
					y: 6,
					recipientId: r7
				}
			])
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
			recipients: [{
				name: meName,
				email: me,
				status: "signed",
				order: 1,
				signedAt: daysAgo(17),
				company: PT.company
			}, {
				name: "Rudi Hartono",
				email: "rudi@sumberjayaoffice.com",
				status: "signed",
				order: 2,
				signedAt: daysAgo(12),
				company: "CV Sumber Jaya Office"
			}],
			content: {
				kind: "spk",
				number: "SPK-2026/PROC-077",
				location: "Cirebon",
				date: "12 Agustus 2026",
				amount: "Rp 186.400.000",
				amountWords: "Seratus delapan puluh enam juta empat ratus ribu rupiah",
				parties: [PT, {
					name: "Rudi Hartono",
					title: "Pemilik",
					company: "CV Sumber Jaya Office",
					address: "Jl. Pekiringan No. 45, Cirebon"
				}],
				clauses: [
					{
						title: "Lingkup",
						body: "Pengadaan 12 unit workstation, 2 unit printer A3, dan rak arsip besi sesuai RAB terlampir."
					},
					{
						title: "Waktu penyerahan",
						body: "Maksimal 21 hari kalender setelah SPK ditandatangani."
					},
					{
						title: "Garansi",
						body: "Garansi pabrik 12 bulan + layanan onsite 6 bulan."
					}
				]
			},
			fields: fieldsFor([r9, r10], [
				{
					type: "signature",
					page: 1,
					x: 14,
					y: 72,
					recipientId: r9
				},
				{
					type: "signature",
					page: 1,
					x: 56,
					y: 72,
					recipientId: r10
				},
				{
					type: "emeterai",
					page: 0,
					x: 72,
					y: 6,
					recipientId: r9
				},
				{
					type: "stamp",
					page: 1,
					x: 16,
					y: 82,
					recipientId: r9
				}
			])
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
			recipients: [{
				name: meName,
				email: me,
				status: "signed",
				order: 1,
				signedAt: daysAgo(39),
				company: PT.company
			}, {
				name: "Prof. Ir. Hendra Gunawan",
				email: "hendra@unswagati.ac.id",
				status: "signed",
				order: 2,
				signedAt: daysAgo(30),
				company: "Universitas Swadaya Gunung Jati"
			}],
			content: {
				kind: "mou",
				number: "MOU-2026/BD-003",
				location: "Cirebon",
				date: "21 Juli 2026",
				parties: [PT, {
					name: "Prof. Ir. Hendra Gunawan",
					title: "Rektor",
					company: "Universitas Swadaya Gunung Jati",
					address: "Jl. Pemuda No. 32, Cirebon"
				}],
				clauses: [{
					title: "Tujuan",
					body: "Kerja sama magang, guest lecture, dan riset terapan tanda tangan digital bagi UMKM Jawa Barat."
				}, {
					title: "Kontribusi",
					body: "Paraf menyediakan 50 lisensi edukasi. Kampus menyediakan laboratorium dan mahasiswa magang 2 angkatan/tahun."
				}]
			},
			fields: fieldsFor([r11, r12], [
				{
					type: "signature",
					page: 1,
					x: 14,
					y: 70,
					recipientId: r11
				},
				{
					type: "signature",
					page: 1,
					x: 56,
					y: 70,
					recipientId: r12
				},
				{
					type: "qr",
					page: 0,
					x: 86,
					y: 88,
					w: 10,
					h: 8,
					recipientId: r11
				}
			])
		},
		{
			title: "SK-2026/DIR-021 · Surat Kuasa Pengurusan NPWP Cabang",
			docType: "kuasa",
			status: "draft",
			compliance: "psre",
			group: "Pajak",
			folder: "Finance",
			createdAt: daysAgo(.2),
			recipients: [{
				name: meName,
				email: me,
				status: "waiting",
				order: 1,
				company: PT.company
			}, {
				name: "Nina Maharani",
				email: "nina.maharani@jayawijaya.co.id",
				status: "waiting",
				order: 2,
				company: PT.company
			}],
			content: {
				kind: "kuasa",
				number: "SK-2026/DIR-021",
				location: "Cirebon",
				date: "30 Agustus 2026",
				parties: [{
					...PT,
					title: "Pemberi Kuasa"
				}, {
					name: "Nina Maharani",
					title: "Staff Pajak",
					company: PT.company,
					address: PT.address
				}],
				clauses: [{
					title: "Kuasa",
					body: "Penerima kuasa berwenang mengurus pendaftaran NPWP cabang, e-filling, dan korespondensi dengan KPP Pratama Cirebon."
				}, {
					title: "Berlaku",
					body: "Surat kuasa berlaku hingga 31 Desember 2026 atau dicabut secara tertulis."
				}]
			},
			fields: fieldsFor([r13, r14], [
				{
					type: "signature",
					page: 0,
					x: 14,
					y: 72,
					recipientId: r13
				},
				{
					type: "stamp",
					page: 0,
					x: 16,
					y: 82,
					recipientId: r13
				},
				{
					type: "name",
					page: 0,
					x: 56,
					y: 72,
					recipientId: r14
				},
				{
					type: "signature",
					page: 0,
					x: 56,
					y: 78,
					recipientId: r14
				}
			])
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
			recipients: [{
				name: meName,
				email: me,
				role: "approver",
				action: "approve",
				status: "waiting",
				order: 1,
				company: PT.company
			}, {
				name: "H. Sutrisno",
				email: "sutrisno.properti@gmail.com",
				status: "waiting",
				order: 2,
				company: "Pemilik Properti"
			}],
			content: {
				kind: "sewa",
				number: "SEWA-2026/OPS-009",
				location: "Cirebon",
				date: "27 Agustus 2026",
				amount: "Rp 14.000.000 / bulan",
				parties: [{
					name: "H. Sutrisno",
					title: "Pemilik",
					company: "Perorangan",
					address: "Jl. Sunan Gunung Jati No. 17, Cirebon"
				}, PT],
				clauses: [
					{
						title: "Objek sewa",
						body: "Ruko 3 lantai, luas 210 m², Jl. Tuparev No. 88, termasuk 4 slot parkir."
					},
					{
						title: "Harga sewa",
						body: "Rp 14.000.000/bulan, dibayar di muka setiap tanggal 1. Deposit 2 bulan."
					},
					{
						title: "Jangka waktu",
						body: "2 tahun, opsi perpanjangan dengan penyesuaian harga maksimal 7%/tahun."
					}
				]
			},
			fields: fieldsFor([uid("r"), uid("r")], [{
				type: "signature",
				page: 1,
				x: 14,
				y: 70
			}, {
				type: "emeterai",
				page: 0,
				x: 72,
				y: 6
			}])
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
			recipients: [{
				name: meName,
				email: me,
				status: "signed",
				order: 1,
				signedAt: daysAgo(19),
				company: PT.company
			}, {
				name: "Andi Pratama",
				email: "andi.pratama@nusantaralogistik.co.id",
				status: "declined",
				order: 2,
				company: "PT Nusantara Logistik Prima"
			}],
			content: {
				kind: "addendum",
				number: "ADD-2026/LGL-002",
				location: "Cirebon",
				date: "10 Agustus 2026",
				parties: [PT, {
					name: "Andi Pratama",
					title: "Direktur",
					company: "PT Nusantara Logistik Prima",
					address: "Cikarang"
				}],
				clauses: [{
					title: "Perubahan Pasal 1",
					body: "Wilayah distribusi diperluas menjadi seluruh Jawa dan Bali, bersifat eksklusif."
				}]
			},
			fields: fieldsFor([uid("r"), uid("r")], [{
				type: "signature",
				page: 0,
				x: 14,
				y: 70
			}, {
				type: "signature",
				page: 0,
				x: 56,
				y: 70
			}])
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
			recipients: [{
				name: meName,
				email: me,
				status: "signed",
				order: 1,
				signedAt: daysAgo(49),
				company: PT.company
			}, {
				name: "Komite Kredit",
				email: "kredit@bankjateng.co.id",
				status: "waiting",
				order: 2,
				company: "Bank Jateng"
			}],
			content: {
				kind: "kerjasama",
				number: "POLIS-2026/FIN-044",
				location: "Cirebon",
				date: "11 Juli 2026",
				amount: "Rp 2.000.000.000",
				parties: [PT, {
					name: "Komite Kredit",
					title: "Pemimpin Cabang",
					company: "Bank Jateng Cabang Cirebon",
					address: "Jl. Siliwangi No. 99"
				}],
				clauses: [{
					title: "Fasilitas",
					body: "Kredit modal kerja plafon Rp 2 miliar, bunga 9,5% p.a. floating, tenor 24 bulan."
				}]
			},
			fields: fieldsFor([uid("r"), uid("r")], [{
				type: "signature",
				page: 1,
				x: 14,
				y: 70
			}])
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
			recipients: [{
				name: meName,
				email: me,
				status: "waiting",
				order: 1,
				company: PT.company
			}],
			content: {
				kind: "nda",
				number: "VOID-2026/HR-019",
				location: "Cirebon",
				date: "5 Agustus 2026",
				parties: [PT, {
					name: "Vendor Lama",
					title: "Direktur",
					company: "PT Lama Abadi",
					address: "Jakarta"
				}],
				clauses: [{
					title: "Pakta",
					body: "Dokumen dibatalkan karena vendor tidak lolos due diligence."
				}]
			},
			fields: fieldsFor([uid("r")], [{
				type: "signature",
				page: 0,
				x: 14,
				y: 72
			}])
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
			recipients: [{
				name: meName,
				email: me,
				status: "signed",
				order: 1,
				signedAt: daysAgo(14),
				company: PT.company
			}, {
				name: "Maya Chen",
				email: "maya.chen@eastventures.com",
				status: "signed",
				order: 2,
				signedAt: daysAgo(8),
				company: "East Ventures"
			}],
			content: {
				kind: "nda",
				number: "NDA-2026/LGL-011",
				location: "Singapore / Cirebon",
				date: "15 Agustus 2026",
				parties: [PT, {
					name: "Maya Chen",
					title: "Principal",
					company: "East Ventures",
					address: "One Raffles Quay, Singapore"
				}],
				clauses: [{
					title: "Purpose",
					body: "Due diligence for a potential Series A investment in PT Jaya Wijaya Kusuma."
				}, {
					title: "Governing law",
					body: "This NDA is governed by the laws of Singapore, with courtesy translation in Bahasa Indonesia."
				}]
			},
			fields: fieldsFor([uid("r"), uid("r")], [
				{
					type: "signature",
					page: 1,
					x: 14,
					y: 72
				},
				{
					type: "signature",
					page: 1,
					x: 56,
					y: 72
				},
				{
					type: "qr",
					page: 0,
					x: 86,
					y: 88,
					w: 10,
					h: 8
				}
			])
		}
	].map((d, i) => {
		const recs = d.recipients.map((r, idx) => ({
			...r,
			_id: `seedr_${i}_${idx}`
		}));
		const fields = d.fields.map((f, fi) => {
			const rec = recs[Math.min(fi, recs.length - 1)];
			return {
				...f,
				recipientId: f.recipientId && recs.some((x) => x._id === f.recipientId) ? f.recipientId : rec._id
			};
		});
		return {
			...d,
			recipients: recs,
			fields,
			settings: { ...DEFAULT_SETTINGS }
		};
	});
}
var SEED_CONTACTS = [
	{
		name: "Andi Pratama",
		email: "andi.pratama@nusantaralogistik.co.id",
		phone: "0812-1000-2211",
		company: "PT Nusantara Logistik Prima",
		group: "Vendor",
		role: "signer"
	},
	{
		name: "Sari Wulandari",
		email: "sari.wulandari@awanbyte.id",
		phone: "0813-5550-9090",
		company: "PT Awan Byte Indonesia",
		group: "Vendor",
		role: "signer"
	},
	{
		name: "Budi Santoso",
		email: "budi.santoso@mitrakarya.co.id",
		phone: "022-4201100",
		company: "PT Mitra Karya Sejahtera",
		group: "Klien",
		role: "signer"
	},
	{
		name: "Dewi Lestari",
		email: "dewi.lestari@gmail.com",
		phone: "0812-4455-7788",
		company: "",
		group: "Karyawan",
		role: "signer"
	},
	{
		name: "Rudi Hartono",
		email: "rudi@sumberjayaoffice.com",
		phone: "0231-240088",
		company: "CV Sumber Jaya Office",
		group: "Vendor",
		role: "signer"
	},
	{
		name: "Prof. Ir. Hendra Gunawan",
		email: "hendra@unswagati.ac.id",
		phone: "0231-481264",
		company: "Universitas Swadaya Gunung Jati",
		group: "Partner",
		role: "signer"
	},
	{
		name: "Nina Maharani",
		email: "nina.maharani@jayawijaya.co.id",
		phone: "0811-2233-4455",
		company: "PT Jaya Wijaya Kusuma",
		group: "Internal",
		role: "signer"
	},
	{
		name: "H. Sutrisno",
		email: "sutrisno.properti@gmail.com",
		phone: "0813-2177-8899",
		company: "Pemilik Properti",
		group: "Vendor",
		role: "signer"
	},
	{
		name: "Maya Chen",
		email: "maya.chen@eastventures.com",
		phone: "+65 8123 4455",
		company: "East Ventures",
		group: "Investor",
		role: "signer"
	},
	{
		name: "Legal Desk",
		email: "legal@jayawijaya.co.id",
		phone: "0231-888221",
		company: "PT Jaya Wijaya Kusuma",
		group: "Internal",
		role: "cc"
	}
];
var SEED_TEMPLATES = [
	{
		name: "PKWT Standar Perusahaan",
		docType: "pkwt",
		description: "Kontrak kerja waktu tertentu sesuai PP 35/2021, field dinamis: nama, jabatan, gaji, tenor.",
		content: {
			kind: "pkwt",
			number: "PKWT-{{nomor}}",
			location: "Cirebon",
			date: "{{tanggal}}",
			parties: [PT, {
				name: "{{nama_karyawan}}",
				title: "{{jabatan}}",
				company: "Karyawan",
				address: "{{alamat}}"
			}],
			clauses: [{
				title: "Pasal 1 — Jabatan",
				body: "Pekerja diangkat sebagai {{jabatan}}."
			}, {
				title: "Pasal 2 — Upah",
				body: "Upah pokok {{gaji}} per bulan."
			}]
		}
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
			parties: [PT, {
				name: "{{pihak2}}",
				title: "{{jabatan2}}",
				company: "{{perusahaan2}}",
				address: "{{alamat2}}"
			}],
			clauses: [{
				title: "Informasi Rahasia",
				body: "Mencakup data pelanggan, harga, dan materi teknis."
			}]
		}
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
			parties: [PT, {
				name: "{{klien}}",
				title: "Finance",
				company: "{{perusahaan}}",
				address: "{{alamat}}"
			}],
			clauses: [{
				title: "Item",
				body: "{{uraian}}"
			}]
		}
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
			parties: [PT, {
				name: "{{vendor}}",
				title: "Direktur",
				company: "{{perusahaan}}",
				address: "{{alamat}}"
			}],
			clauses: [{
				title: "Lingkup",
				body: "{{lingkup}}"
			}]
		}
	}
];
function documentHash(input) {
	const raw = JSON.stringify({
		id: input.id,
		title: input.title,
		content: input.content
	});
	let h = 2166136261;
	for (let i = 0; i < raw.length; i++) {
		h ^= raw.charCodeAt(i);
		h = Math.imul(h, 16777619);
	}
	const a = (h >>> 0).toString(16).padStart(8, "0");
	let h2 = 0;
	for (let i = 0; i < raw.length; i++) h2 = h2 * 33 + raw.charCodeAt(i) >>> 0;
	return `sha256-${a}${h2.toString(16).padStart(8, "0")}${raw.length.toString(16)}`;
}
function publicStatus(c) {
	const connected = c.source !== "none" && Boolean(c.token && c.baseUrl) && c.provider !== "demo";
	return {
		connected,
		legalReady: connected,
		provider: connected ? c.provider : "demo",
		baseUrl: connected ? c.baseUrl : "",
		source: c.source,
		tokenHint: c.token ? `••••${c.token.slice(-4)}` : ""
	};
}
function connectorFrom(prefs) {
	const envUrl = (process.env.EMETERAI_API_URL ?? "").trim();
	const envTok = (process.env.EMETERAI_API_TOKEN ?? "").trim();
	const envProv = (process.env.EMETERAI_PROVIDER ?? "generic").trim();
	if (envUrl && envTok) return {
		provider: envProv === "mekari" ? "mekari" : "generic",
		baseUrl: envUrl,
		token: envTok,
		source: "env"
	};
	const provider = prefs.emeteraiProvider || "demo";
	const baseUrl = (prefs.emeteraiBaseUrl ?? "").trim();
	const token = (prefs.emeteraiToken ?? "").trim();
	if (provider !== "demo" && baseUrl && token) return {
		provider,
		baseUrl,
		token,
		source: "workspace"
	};
	return {
		provider: "demo",
		baseUrl: "",
		token: "",
		source: "none"
	};
}
function assertSafeUrl(raw) {
	let url;
	try {
		url = new URL(raw);
	} catch {
		throw new Error("Invalid API URL");
	}
	if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("URL must be http(s)");
	const host = url.hostname.toLowerCase();
	if (host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "0.0.0.0") throw new Error("That URL is not allowed");
	if (host.endsWith(".internal") || host.startsWith("169.254.")) throw new Error("That URL is not allowed");
}
async function postStamp(c, body) {
	assertSafeUrl(c.baseUrl);
	const endpoint = c.provider === "mekari" ? c.baseUrl.replace(/\/$/, "") : c.baseUrl.replace(/\/$/, "");
	const res = await fetch(endpoint, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${c.token}`,
			"Content-Type": "application/json",
			Accept: "application/json"
		},
		body: JSON.stringify(body)
	});
	const text = await res.text();
	let json = {};
	try {
		json = text ? JSON.parse(text) : {};
	} catch {
		json = { raw: text.slice(0, 400) };
	}
	return {
		ok: res.ok,
		status: res.status,
		json,
		text
	};
}
function pickSerial(json) {
	for (const k of [
		"serial",
		"serialNumber",
		"sn",
		"meterai_sn",
		"stampSerial",
		"id"
	]) {
		const v = json[k];
		if (typeof v === "string" && v.length > 3) return v;
		if (v && typeof v === "object" && "serial" in v) {
			const inner = v.serial;
			if (inner) return inner;
		}
	}
	const data = json.data;
	if (data && typeof data === "object") return pickSerial(data);
	return "";
}
async function issueStamp(opts) {
	const { connector, hash, title, documentId, verifyOrigin } = opts;
	if (connector.source === "none" || connector.provider === "demo") {
		const serial = `DEMO-${hash.slice(0, 10).toUpperCase()}`;
		return {
			serial,
			legal: false,
			verifyUrl: `${verifyOrigin}/verify?serial=${serial}`,
			provider: "demo",
			hash
		};
	}
	const payload = {
		documentHash: hash,
		documentId,
		title,
		amount: 1e4,
		currency: "IDR",
		page: 0,
		x: 62,
		y: 72
	};
	try {
		const res = await postStamp(connector, payload);
		const serial = pickSerial(res.json);
		if (res.ok && serial) return {
			serial,
			legal: true,
			verifyUrl: typeof res.json.verifyUrl === "string" && res.json.verifyUrl || typeof res.json.verification_url === "string" && res.json.verification_url || `${verifyOrigin}/verify?serial=${encodeURIComponent(serial)}`,
			image: typeof res.json.image === "string" ? res.json.image : typeof res.json.stampImage === "string" ? res.json.stampImage : void 0,
			provider: connector.provider,
			hash
		};
		return {
			serial: `DEMO-${hash.slice(0, 10).toUpperCase()}`,
			legal: false,
			verifyUrl: `${verifyOrigin}/verify?serial=DEMO-${hash.slice(0, 10).toUpperCase()}`,
			provider: "demo",
			hash,
			error: `Provider ${res.status}: ${res.text.slice(0, 180) || "no serial in response. Check URL and token."}`
		};
	} catch (e) {
		const serial = `DEMO-${hash.slice(0, 10).toUpperCase()}`;
		return {
			serial,
			legal: false,
			verifyUrl: `${verifyOrigin}/verify?serial=${serial}`,
			provider: "demo",
			hash,
			error: e instanceof Error ? e.message : "Could not reach e-Meterai API"
		};
	}
}
async function pingConnector(c) {
	if (c.source === "none" || c.provider === "demo") return {
		ok: false,
		message: "No API connected. Stamps will be DEMO — not legally valid."
	};
	try {
		const res = await postStamp(c, {
			documentHash: "0".repeat(64),
			title: "Paraf connection test",
			amount: 1e4,
			ping: true
		});
		if (res.status === 401 || res.status === 403) return {
			ok: false,
			message: "Token rejected (401/403)."
		};
		if (res.ok || res.status === 400 || res.status === 422) return {
			ok: true,
			message: `Reached ${c.provider} API (${res.status}). Ready to stamp.`
		};
		return {
			ok: false,
			message: `HTTP ${res.status}: ${res.text.slice(0, 160)}`
		};
	} catch (e) {
		return {
			ok: false,
			message: e instanceof Error ? e.message : "Connection failed"
		};
	}
}
function parse(raw, fallback) {
	if (!raw) return fallback;
	try {
		return JSON.parse(raw);
	} catch {
		return fallback;
	}
}
async function userEmail(userId) {
	const rows = await (await getSql())`
    select email, name from "user" where id = ${userId} limit 1
  `;
	if (rows[0]) return rows[0];
	return {
		email: "user@paraf.id",
		name: "Pengguna Paraf"
	};
}
async function ensureExtras(userId) {
	const sql = await getSql();
	await sql.query(`create table if not exists team_members (
        id text primary key, user_id text not null, name text not null, email text not null,
        role text not null default 'Member', status text not null default 'invited',
        emeterai_assigned integer not null default 0, created_at timestamptz not null default now())`).catch(() => void 0);
	await sql.query(`create table if not exists emeterai_stamps (
        id text primary key, user_id text not null, document_id text, serial text not null unique,
        hash text not null, legal integer not null default 0, provider text not null,
        verify_url text, image_url text, created_at timestamptz not null default now())`).catch(() => void 0);
	await sql.query(`create table if not exists workspace_prefs (
        user_id text primary key, profile_json text not null default '{}',
        prefs_json text not null default '{}', notif_json text not null default '{}',
        email_json text not null default '{}')`).catch(() => void 0);
	try {
		if (((await sql`select count(*)::int as c from team_members where user_id = ${userId}`)[0]?.c ?? 0) === 0) {
			const ident = await userEmail(userId);
			await sql`
        insert into team_members (id, user_id, name, email, role, status, emeterai_assigned)
        values (${uid("tm")}, ${userId}, ${ident.name}, ${ident.email}, ${"Owner"}, ${"active"}, ${50})
      `;
		}
		if (((await sql`select count(*)::int as c from workspace_prefs where user_id = ${userId}`)[0]?.c ?? 0) === 0) await sql`insert into workspace_prefs (user_id) values (${userId})`;
	} catch {}
}
async function listTeamRows(userId) {
	try {
		return await (await getSql())`select id, name, email, role, status, emeterai_assigned from team_members where user_id = ${userId} order by created_at`;
	} catch {
		return [];
	}
}
async function loadPrefs(userId) {
	try {
		const row = (await (await getSql())`select * from workspace_prefs where user_id = ${userId} limit 1`)[0];
		return {
			profile: parse(row?.profile_json, {}),
			prefs: parse(row?.prefs_json, {}),
			notif: parse(row?.notif_json, {}),
			email: parse(row?.email_json, {})
		};
	} catch {
		return {
			profile: {},
			prefs: {},
			notif: {},
			email: {}
		};
	}
}
async function ensure(userId) {
	const sql = await getSql();
	if (((await sql`select count(*)::int as c from companies where user_id = ${userId}`)[0]?.c ?? 0) > 0) {
		await ensureExtras(userId);
		await ensureIntegrationTables();
		return;
	}
	const ident = await userEmail(userId);
	await sql`
    insert into companies (id, user_id, name, legal_name, npwp, address, city, phone, plan)
    values (
      ${uid("co")}, ${userId}, ${"PT Jaya Wijaya Kusuma"}, ${"PT Jaya Wijaya Kusuma"},
      ${"10.221.884.7-437.000"}, ${"Jl. Tuparev No. 88, Kedawung, Cirebon 45153"},
      ${"Cirebon"}, ${"0231-888221"}, ${"Pro"}
    )
  `;
	await sql`
    insert into quotas (user_id, emeterai_used, emeterai_total, ekyc_used, ekyc_total, wa_used, wa_total)
    values (${userId}, 12, 50, 3, 20, 8, 100)
  `;
	const folderIds = {};
	for (const name of [
		"Umum",
		"HR",
		"Legal",
		"Finance"
	]) {
		const id = uid("fld");
		folderIds[name] = id;
		await sql`insert into folders (id, user_id, name) values (${id}, ${userId}, ${name})`;
	}
	for (const c of SEED_CONTACTS) await sql`
      insert into contacts (id, user_id, name, email, phone, company, group_name, role)
      values (${uid("ct")}, ${userId}, ${c.name}, ${c.email}, ${c.phone}, ${c.company}, ${c.group}, ${c.role})
    `;
	await sql`insert into contact_groups (id, user_id, name, description) values
    (${uid("cg")}, ${userId}, ${"Vendor"}, ${"Pemasok dan mitra operasional"}),
    (${uid("cg")}, ${userId}, ${"Klien"}, ${"Pelanggan aktif"}),
    (${uid("cg")}, ${userId}, ${"Internal"}, ${"Karyawan PT Jaya Wijaya Kusuma"}),
    (${uid("cg")}, ${userId}, ${"Investor"}, ${"Calon dan existing investor"})
  `;
	for (const t of SEED_TEMPLATES) await sql`
      insert into templates (id, user_id, name, doc_type, description, content_json, fields_json, uses)
      values (${uid("tpl")}, ${userId}, ${t.name}, ${t.docType}, ${t.description}, ${JSON.stringify(t.content)}, ${"[]"}, ${Math.floor(Math.random() * 40 + 4)})
    `;
	await sql`
    insert into stamps (id, user_id, name, company_name, data_url, is_default)
    values (${uid("st")}, ${userId}, ${"Stempel Direksi"}, ${"PT Jaya Wijaya Kusuma"}, ${COMPANY_STAMP}, ${true})
  `;
	await sql`
    insert into signatures (id, user_id, kind, name, data_url, is_default)
    values (${uid("sg")}, ${userId}, ${"font"}, ${ident.name}, ${""}, ${true})
  `;
	const seed = buildSeed(ident.email, ident.name);
	for (const d of seed) {
		const docId = uid("doc");
		const token = uid("tok");
		const recIds = [];
		const recRows = d.recipients.map((r) => {
			const id = uid("rc");
			recIds.push(id);
			return {
				id,
				...r
			};
		});
		const fields = d.fields.map((f, i) => ({
			...f,
			id: uid("f"),
			recipientId: recRows[Math.min(i, recRows.length - 1)].id
		}));
		fields.forEach((f, i) => {
			if (i === 0 && recRows[0]) f.recipientId = recRows[0].id;
		});
		await sql`
      insert into documents (
        id, user_id, folder_id, title, doc_type, status, compliance, group_name,
        content_json, fields_json, settings_json, token, effective_date, expires_at, deadline,
        created_at, updated_at, sent_at, completed_at, decline_reason
      ) values (
        ${docId}, ${userId}, ${folderIds[d.folder] ?? folderIds.Umum}, ${d.title}, ${d.docType}, ${d.status},
        ${d.compliance}, ${d.group}, ${JSON.stringify(d.content)}, ${JSON.stringify(fields)},
        ${JSON.stringify({
			...DEFAULT_SETTINGS,
			...d.settings
		})}, ${token},
        ${d.effective ?? null}, ${d.expires ?? null}, ${d.deadline ?? null},
        ${d.createdAt}, ${d.createdAt}, ${d.sentAt ?? null}, ${d.completedAt ?? null}, ${d.declineReason ?? null}
      )
    `;
		for (const r of recRows) await sql`
        insert into recipients (
          id, user_id, document_id, name, email, phone, role, action, status, order_index, company_name, signed_at, invite_token
        ) values (
          ${r.id}, ${userId}, ${docId}, ${r.name}, ${r.email}, ${r.phone ?? ""}, ${r.role ?? "signer"},
          ${r.action ?? "needs_to_sign"}, ${r.status ?? "waiting"}, ${r.order ?? 1}, ${r.company ?? ""}, ${r.signedAt ?? null},
          ${uid("inv")}
        )
      `;
		const actors = [
			{
				actor: ident.name,
				action: "Dokumen dibuat",
				at: d.createdAt
			},
			d.sentAt ? {
				actor: ident.name,
				action: "Dokumen dikirim ke penerima",
				at: d.sentAt
			} : null,
			{
				actor: "Sistem Paraf PSrE",
				action: "Hash SHA-256 dicatat & sertifikat disiapkan",
				at: d.createdAt
			}
		].filter(Boolean);
		for (const r of recRows) {
			if (r.status === "signed") actors.push({
				actor: r.name,
				action: "Menandatangani dokumen (PSrE)",
				at: r.signedAt ?? d.createdAt
			});
			if (r.status === "viewed") actors.push({
				actor: r.name,
				action: "Membuka tautan dokumen",
				at: daysAgo(.5)
			});
			if (r.status === "declined") actors.push({
				actor: r.name,
				action: "Menolak menandatangani",
				at: d.createdAt
			});
		}
		if (d.status === "voided") actors.push({
			actor: ident.name,
			action: "Membatalkan (void) dokumen",
			at: d.createdAt
		});
		if (d.status === "expired") actors.push({
			actor: "Sistem",
			action: "Tenggat tanda tangan terlewati",
			at: d.deadline ?? d.createdAt
		});
		if (d.status === "completed") actors.push({
			actor: "Sistem Paraf",
			action: "Dokumen tersertifikasi & dikunci",
			at: d.completedAt ?? d.createdAt
		});
		for (const a of actors) await sql`
        insert into audit_events (id, user_id, document_id, actor, action, ip, created_at)
        values (${uid("au")}, ${userId}, ${docId}, ${a.actor}, ${a.action}, ${"103.124.18.44"}, ${a.at})
      `;
	}
	await sql`
    insert into approvals (id, user_id, document_id, name, layer, mode, approver_name, approver_email, status)
    select ${uid("ap")}, ${userId}, id, ${"Persetujuan Direksi"}, 1, ${"all"}, ${ident.name}, ${ident.email}, ${"pending"}
    from documents where user_id = ${userId} and status = 'pending_approval' limit 1
  `;
	await sql`
    insert into approval_templates (id, user_id, name, layers_json)
    values (
      ${uid("apt")}, ${userId}, ${"Legal → Finance → Direksi"},
      ${JSON.stringify([
		{
			layer: 1,
			mode: "any",
			name: "Legal"
		},
		{
			layer: 2,
			mode: "all",
			name: "Finance"
		},
		{
			layer: 3,
			mode: "any",
			name: "Direksi"
		}
	])}
    )
  `;
	await sql`
    insert into notifications (id, user_id, title, body, href, read) values
    (${uid("n")}, ${userId}, ${"Dokumen menunggu tanda tangan"}, ${"PKS-2026/HR-014 Perjanjian Kerja Sama Distribusi memerlukan tanda tangan Anda."}, ${"/esignature/need-to-sign"}, ${false}),
    (${uid("n")}, ${userId}, ${"Dewi Lestari melihat PKWT"}, ${"Kandidat telah membuka kontrak PKWT-2026/HR-112."}, ${"/esignature/waiting-for-others"}, ${false}),
    (${uid("n")}, ${userId}, ${"e-Meterai tersisa 38"}, ${"Kuota e-Meterai 12/50 terpakai. Isi ulang sebelum habis."}, ${"/settings/quota-usage"}, ${true}),
    (${uid("n")}, ${userId}, ${"Addendum ditolak"}, ${"Andi Pratama menolak ADD-2026/LGL-002."}, ${"/esignature/declined"}, ${true})
  `;
	await sql`
    insert into emeterai_orders (id, user_id, qty, amount, status, created_at) values
    (${uid("em")}, ${userId}, 50, 500000, ${"paid"}, ${daysAgo(40)}),
    (${uid("em")}, ${userId}, 20, 200000, ${"paid"}, ${daysAgo(12)})
  `;
	await sql`
    insert into signing_proofs (id, user_id, title, media_url, notary, witness, notes)
    values (${uid("sp")}, ${userId}, ${"RUPS 12 Juli 2026"}, ${""}, ${"Notaris Hj. Ratna Sari, S.H., M.Kn."}, ${"Agus Salim"}, ${"Penandatanganan akta perubahan anggaran dasar secara hybrid."})
  `;
	await ensureExtras(userId);
	await ensureIntegrationTables();
}
var COMPANY_STAMP = "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200">
      <circle cx="100" cy="100" r="92" fill="none" stroke="#c2413b" stroke-width="6"/>
      <circle cx="100" cy="100" r="78" fill="none" stroke="#c2413b" stroke-width="2"/>
      <text x="100" y="78" text-anchor="middle" font-family="serif" font-size="13" fill="#c2413b" font-weight="700">PT JAYA WIJAYA</text>
      <text x="100" y="98" text-anchor="middle" font-family="serif" font-size="13" fill="#c2413b" font-weight="700">KUSUMA</text>
      <text x="100" y="122" text-anchor="middle" font-family="serif" font-size="10" fill="#c2413b">CIREBON · INDONESIA</text>
      <text x="100" y="148" text-anchor="middle" font-family="serif" font-size="9" fill="#c2413b">STEMPEL PERUSAHAAN</text>
    </svg>`);
function toDoc(row, recipients) {
	return {
		id: row.id,
		title: row.title,
		docType: row.doc_type,
		status: row.status,
		compliance: row.compliance,
		groupName: row.group_name,
		folderId: row.folder_id,
		folderName: row.folder_name,
		passcode: row.passcode,
		content: parse(row.content_json, {
			kind: "other",
			number: "",
			location: "",
			date: "",
			parties: [],
			clauses: []
		}),
		fields: parse(row.fields_json, []),
		settings: {
			...DEFAULT_SETTINGS,
			...parse(row.settings_json, {})
		},
		token: row.token,
		effectiveDate: row.effective_date,
		expiresAt: row.expires_at,
		deadline: row.deadline,
		createdAt: row.created_at,
		updatedAt: row.updated_at,
		sentAt: row.sent_at,
		completedAt: row.completed_at,
		voidedAt: row.voided_at,
		declineReason: row.decline_reason,
		tags: row.tags ?? "",
		scheduledAt: row.scheduled_at ?? null,
		deletedAt: row.deleted_at ?? null,
		recipients
	};
}
async function recsFor(docId) {
	const sql = await getSql();
	await sql.query(`alter table recipients add column if not exists invite_token text`).catch(() => void 0);
	const missing = await sql`
    select id from recipients where document_id = ${docId} and (invite_token is null or invite_token = '')
  `.catch(() => []);
	for (const m of missing) await sql`update recipients set invite_token = ${uid("inv")} where id = ${m.id}`;
	return (await sql`select * from recipients where document_id = ${docId} order by order_index, name`).map((r) => ({
		id: r.id,
		documentId: r.document_id,
		name: r.name,
		email: r.email,
		phone: r.phone,
		role: r.role,
		action: r.action,
		status: r.status,
		orderIndex: r.order_index,
		companyName: r.company_name,
		signedAt: r.signed_at,
		signatureData: r.signature_data,
		inviteToken: r.invite_token ?? void 0
	}));
}
var bootstrap_createServerFn_handler = createServerRpc({
	id: "23c857d0b3a5d111d150eb6d596a0e6cf56c91fc3c51de16a6c3a859705833de",
	name: "bootstrap",
	filename: "src/lib/api.ts"
}, (opts) => bootstrap.__executeServer(opts));
var bootstrap = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(bootstrap_createServerFn_handler, async ({ context }) => {
	await ensure(context.userId);
	const sql = await getSql();
	const ident = await userEmail(context.userId);
	const company = (await sql`select * from companies where user_id = ${context.userId} limit 1`)[0];
	const quota = (await sql`select * from quotas where user_id = ${context.userId}`)[0];
	const folders = await sql`select id, name from folders where user_id = ${context.userId} order by name`;
	const counts = {
		all: 0,
		trash: 0
	};
	const allDocs = await sql`
      select status, deleted_at from documents where user_id = ${context.userId}
    `.catch(async () => sql`
        select status from documents where user_id = ${context.userId}
      `);
	for (const r of allDocs) {
		if (r.deleted_at) {
			counts.trash += 1;
			continue;
		}
		counts[r.status] = (counts[r.status] ?? 0) + 1;
		counts.all += 1;
	}
	const notifs = await sql`select * from notifications where user_id = ${context.userId} order by created_at desc limit 12`;
	return {
		user: ident,
		company: {
			id: company.id,
			name: company.name,
			legalName: company.legal_name,
			npwp: company.npwp,
			address: company.address,
			city: company.city,
			phone: company.phone,
			plan: company.plan
		},
		quota: {
			emeteraiUsed: quota.emeterai_used,
			emeteraiTotal: quota.emeterai_total,
			ekycUsed: quota.ekyc_used,
			ekycTotal: quota.ekyc_total,
			waUsed: quota.wa_used,
			waTotal: quota.wa_total,
			signatureQuota: quota.signature_quota
		},
		folders,
		counts,
		notifications: notifs.map((n) => ({
			id: n.id,
			title: n.title,
			body: n.body,
			href: n.href,
			read: n.read,
			createdAt: n.created_at
		})),
		team: await listTeamRows(context.userId),
		prefs: await (async () => {
			const p = await loadPrefs(context.userId);
			const { emeteraiToken: _t, byokSecret: _b, aiApiKey: _a, onedriveToken: _o, ...rest } = p.prefs;
			return {
				...p,
				prefs: rest
			};
		})(),
		emeterai: publicStatus(connectorFrom((await loadPrefs(context.userId)).prefs))
	};
});
var listDocuments_createServerFn_handler = createServerRpc({
	id: "f2ea807b0d6fa9543f12c22aab3d29506407fe00b9f46d26a7c9c3d18b7ede66",
	name: "listDocuments",
	filename: "src/lib/api.ts"
}, (opts) => listDocuments.__executeServer(opts));
var listDocuments = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((d) => d).handler(listDocuments_createServerFn_handler, async ({ context, data }) => {
	await ensure(context.userId);
	const ident = await userEmail(context.userId);
	const sql = await getSql();
	const key = data.folder ?? data.status ?? "all";
	const mapped = FOLDER_ROUTES[key] ?? key;
	const rows = await sql`
      select d.*, f.name as folder_name
      from documents d
      left join folders f on f.id = d.folder_id
      where d.user_id = ${context.userId}
      order by d.updated_at desc
    `;
	const result = [];
	for (const row of rows) {
		const rec = await recsFor(row.id);
		const doc = toDoc(row, rec);
		const deleted = Boolean(doc.deletedAt);
		if (mapped === "trash") {
			if (!deleted) continue;
		} else if (deleted) continue;
		else if (mapped === "sent") {
			if (!doc.sentAt || doc.status === "draft") continue;
		} else if (mapped === "scheduled") {
			if (doc.status !== "scheduled" && doc.status !== "pending_approval") continue;
		} else if (mapped === "need_to_sign") {
			if (!canSign(doc, ident.email)) continue;
		} else if (mapped === "waiting_for_others") {
			const mine = myRecipient(doc, ident.email);
			const othersPending = doc.recipients.some((r) => r.role !== "cc" && r.status !== "signed" && r.status !== "declined" && r.email.toLowerCase() !== ident.email.toLowerCase());
			const iAmDone = !mine || mine.role === "cc" || mine.status === "signed";
			if (!doc.sentAt || doc.status === "draft" || !othersPending || !iAmDone) continue;
		} else if (mapped === "shared") {
			if (doc.status !== "need_to_sign") continue;
		} else if (mapped === "expiring_soon") {
			const due = doc.deadline ? new Date(doc.deadline).getTime() : 0;
			if (!due || due - Date.now() > 432e6 || doc.status === "completed" || doc.status === "voided") continue;
		} else if (mapped === "all") {} else if (mapped !== doc.status) continue;
		if (data.folderId && doc.folderId !== data.folderId) continue;
		if (data.q) {
			const q = data.q.toLowerCase();
			if (!(doc.title.toLowerCase().includes(q) || doc.groupName.toLowerCase().includes(q) || (doc.tags ?? "").toLowerCase().includes(q) || rec.some((r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q)))) continue;
		}
		result.push(doc);
	}
	return result;
});
var getDocument_createServerFn_handler = createServerRpc({
	id: "250022f1737a31309e29c74fe65eaf9a1c57bce6b8323f17a6e1a7fd94a19f3e",
	name: "getDocument",
	filename: "src/lib/api.ts"
}, (opts) => getDocument.__executeServer(opts));
var getDocument = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id).handler(getDocument_createServerFn_handler, async ({ context, data: id }) => {
	await ensure(context.userId);
	const sql = await getSql();
	const row = (await sql`
      select d.*, f.name as folder_name from documents d
      left join folders f on f.id = d.folder_id
      where d.id = ${id} and d.user_id = ${context.userId} limit 1
    `)[0];
	if (!row) return null;
	const rec = await recsFor(row.id);
	const audit = await sql`select * from audit_events where document_id = ${id} order by created_at asc`;
	const tsa = await sql`
      select serial, token_json, created_at from tsa_tokens where document_id = ${id} order by created_at asc
    `.catch(() => []);
	return {
		document: toDoc(row, rec),
		audit: audit.map((a) => ({
			id: a.id,
			actor: a.actor,
			action: a.action,
			ip: a.ip,
			meta: a.meta,
			createdAt: a.created_at
		})),
		tsa: tsa.map((t) => ({
			serial: t.serial,
			token: parse(t.token_json, {}),
			createdAt: t.created_at
		}))
	};
});
var getPublicDocument_createServerFn_handler = createServerRpc({
	id: "d2e822568f4373ddd67819852b7a8214e849a218aa9a493f052c0567d6492661",
	name: "getPublicDocument",
	filename: "src/lib/api.ts"
}, (opts) => getPublicDocument.__executeServer(opts));
var getPublicDocument = createServerFn({ method: "GET" }).validator((token) => token).handler(getPublicDocument_createServerFn_handler, async ({ data: token }) => {
	const sql = await getSql();
	await sql.query(`alter table recipients add column if not exists invite_token text`).catch(() => void 0);
	const byInvite = await sql`
      select document_id, id from recipients where invite_token = ${token} limit 1
    `.catch(() => []);
	let docToken = token;
	const lockRecipientId = byInvite[0]?.id;
	if (byInvite[0]) {
		const t = await sql`select token from documents where id = ${byInvite[0].document_id} limit 1`;
		if (!t[0]) return null;
		docToken = t[0].token;
	}
	const row = (await sql`
      select d.*, f.name as folder_name from documents d
      left join folders f on f.id = d.folder_id
      where d.token = ${docToken} limit 1
    `)[0];
	if (!row) return null;
	return {
		...toDoc(row, await recsFor(row.id)),
		lockRecipientId
	};
});
object({
	title: string().min(1),
	docType: string(),
	compliance: _enum(["psre", "globalsign"]),
	groupName: string().optional(),
	folderId: string().nullable().optional(),
	content: any(),
	fields: any(),
	settings: any(),
	recipients: array(object({
		name: string(),
		email: string(),
		phone: string().optional(),
		role: string().optional(),
		action: string().optional(),
		orderIndex: number().optional(),
		companyName: string().optional(),
		id: string().optional()
	})),
	deadline: string().nullable().optional(),
	effectiveDate: string().nullable().optional(),
	expiresAt: string().nullable().optional(),
	send: boolean().optional()
});
var saveDocument_createServerFn_handler = createServerRpc({
	id: "08df971a4fcde61cf9d2aaf0ef20adee2dae3037b4c63828501d3167b5ea6786",
	name: "saveDocument",
	filename: "src/lib/api.ts"
}, (opts) => saveDocument.__executeServer(opts));
var saveDocument = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveDocument_createServerFn_handler, async ({ context, data }) => {
	await ensure(context.userId);
	const sql = await getSql();
	const ident = await userEmail(context.userId);
	const id = data.id ?? uid("doc");
	const token = uid("tok");
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const useToken = (data.id ? await sql`select token from documents where id = ${data.id} and user_id = ${context.userId}` : [])[0]?.token ?? token;
	const makerSigns = data.recipients.some((r) => r.email.toLowerCase() === ident.email.toLowerCase() && (r.role ?? "signer") !== "cc");
	let status = "draft";
	if (data.send) status = makerSigns ? "need_to_sign" : "waiting_for_others";
	else if (data.settings?.scheduleAt) status = "scheduled";
	if (data.id) {
		await sql`
        update documents set
          title = ${data.title}, doc_type = ${data.docType}, compliance = ${data.compliance},
          group_name = ${data.groupName ?? ""}, folder_id = ${data.folderId ?? null},
          content_json = ${JSON.stringify(data.content)}, fields_json = ${JSON.stringify(data.fields)},
          settings_json = ${JSON.stringify(data.settings ?? DEFAULT_SETTINGS)},
          deadline = ${data.deadline ?? null}, effective_date = ${data.effectiveDate ?? null},
          expires_at = ${data.expiresAt ?? null},
          status = ${status},
          sent_at = ${data.send ? now : null},
          updated_at = ${now}
        where id = ${data.id} and user_id = ${context.userId}
      `;
		await sql`delete from recipients where document_id = ${data.id} and user_id = ${context.userId}`;
	} else await sql`
        insert into documents (
          id, user_id, folder_id, title, doc_type, status, compliance, group_name,
          content_json, fields_json, settings_json, token, deadline, effective_date, expires_at, sent_at
        ) values (
          ${id}, ${context.userId}, ${data.folderId ?? null}, ${data.title}, ${data.docType}, ${status},
          ${data.compliance}, ${data.groupName ?? ""}, ${JSON.stringify(data.content)},
          ${JSON.stringify(data.fields)}, ${JSON.stringify(data.settings ?? DEFAULT_SETTINGS)},
          ${useToken}, ${data.deadline ?? null}, ${data.effectiveDate ?? null}, ${data.expiresAt ?? null},
          ${data.send ? now : null}
        )
      `;
	const recMap = {};
	for (const [i, r] of data.recipients.entries()) {
		const rid = r.id && r.id.length > 4 ? r.id : uid("rc");
		recMap[r.id ?? `new_${i}`] = rid;
		await sql`
        insert into recipients (id, user_id, document_id, name, email, phone, role, action, status, order_index, company_name, invite_token)
        values (
          ${rid}, ${context.userId}, ${id}, ${r.name}, ${r.email}, ${r.phone ?? ""},
          ${r.role ?? "signer"}, ${r.action ?? "needs_to_sign"}, ${"waiting"}, ${r.orderIndex ?? i + 1},
          ${r.companyName ?? ""}, ${uid("inv")}
        )
      `;
	}
	const remappedFields = Array.isArray(data.fields) ? data.fields.map((f) => ({
		...f,
		recipientId: recMap[f.recipientId] ?? f.recipientId
	})) : data.fields;
	await sql`update documents set fields_json = ${JSON.stringify(remappedFields)} where id = ${id} and user_id = ${context.userId}`;
	await sql`
      insert into audit_events (id, user_id, document_id, actor, action)
      values (${uid("au")}, ${context.userId}, ${id}, ${ident.name}, ${data.send ? "Dokumen dikirim" : "Draf disimpan"})
    `;
	if (data.send && data.settings?.emeteraiBy === "maker") await sql`update quotas set emeterai_used = emeterai_used + 1 where user_id = ${context.userId} and emeterai_used < emeterai_total`;
	if (data.send) {
		await issueWorkspaceTsa(context.userId, id, "document.sent", { title: data.title });
		dispatchWebhook(context.userId, "document.sent", {
			documentId: id,
			title: data.title,
			token: useToken
		});
	}
	return {
		id,
		token: useToken,
		recMap,
		invites: (await recsFor(id)).map((r) => ({
			id: r.id,
			name: r.name,
			email: r.email,
			token: r.inviteToken || useToken
		}))
	};
});
var mutateDocument_createServerFn_handler = createServerRpc({
	id: "e2787a10ab6c1381fd719581bd0121346b5a4fcdb2f86a840e7d96f855c86e3b",
	name: "mutateDocument",
	filename: "src/lib/api.ts"
}, (opts) => mutateDocument.__executeServer(opts));
var mutateDocument = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(mutateDocument_createServerFn_handler, async ({ context, data }) => {
	await ensure(context.userId);
	const sql = await getSql();
	const ident = await userEmail(context.userId);
	if (data.action === "delete") {
		const row = await sql`
        select * from documents where id = ${data.id} and user_id = ${context.userId} limit 1
      `;
		if (row[0] && "deleted_at" in row[0] && row[0].deleted_at) {
			await sql`delete from recipients where document_id = ${data.id} and user_id = ${context.userId}`;
			await sql`delete from audit_events where document_id = ${data.id} and user_id = ${context.userId}`;
			await sql`delete from documents where id = ${data.id} and user_id = ${context.userId}`;
		} else if (row[0] && "deleted_at" in row[0]) {
			await sql`update documents set deleted_at = now(), updated_at = now() where id = ${data.id} and user_id = ${context.userId}`;
			await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${context.userId}, ${data.id}, ${ident.name}, ${"Dipindahkan ke sampah (7 hari)"})`;
		} else {
			await sql`update documents set status = 'voided', voided_at = now(), updated_at = now() where id = ${data.id} and user_id = ${context.userId}`;
			await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${context.userId}, ${data.id}, ${ident.name}, ${"Dipindahkan ke sampah"})`;
		}
		return { ok: true };
	}
	if (data.action === "restore") {
		await sql`update documents set deleted_at = null, updated_at = now() where id = ${data.id} and user_id = ${context.userId}`;
		await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${context.userId}, ${data.id}, ${ident.name}, ${"Dipulihkan dari sampah"})`;
		return { ok: true };
	}
	if (data.action === "resend") {
		await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${context.userId}, ${data.id}, ${ident.name}, ${"Dokumen dikirim ulang ke penerima"})`;
		await issueWorkspaceTsa(context.userId, data.id, "document.sent", { resend: true });
		dispatchWebhook(context.userId, "document.sent", {
			documentId: data.id,
			resend: true
		});
		return { ok: true };
	}
	if (data.action === "void") {
		await sql`update documents set status = 'voided', voided_at = now(), updated_at = now() where id = ${data.id} and user_id = ${context.userId}`;
		await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${context.userId}, ${data.id}, ${ident.name}, ${"Dokumen dibatalkan (void) — e-Meterai ikut dibatalkan"})`;
		await issueWorkspaceTsa(context.userId, data.id, "document.voided");
		dispatchWebhook(context.userId, "document.voided", { documentId: data.id });
		return { ok: true };
	}
	if (data.action === "remind") {
		await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${context.userId}, ${data.id}, ${ident.name}, ${"Pengingat dikirim ke penerima yang belum tanda tangan"})`;
		await issueWorkspaceTsa(context.userId, data.id, "document.reminded");
		dispatchWebhook(context.userId, "document.reminded", { documentId: data.id });
		return { ok: true };
	}
	if (data.action === "move") {
		await sql`update documents set folder_id = ${data.folderId ?? null}, updated_at = now() where id = ${data.id} and user_id = ${context.userId}`;
		return { ok: true };
	}
	if (data.action === "duplicate") {
		const row = (await sql`select * from documents where id = ${data.id} and user_id = ${context.userId}`)[0];
		if (!row) return { ok: false };
		const nid = uid("doc");
		await sql`
        insert into documents (
          id, user_id, folder_id, title, doc_type, status, compliance, group_name,
          content_json, fields_json, settings_json, token
        ) values (
          ${nid}, ${context.userId}, ${row.folder_id}, ${row.title + " (salinan)"}, ${row.doc_type}, ${"draft"},
          ${row.compliance}, ${row.group_name}, ${row.content_json}, ${row.fields_json}, ${row.settings_json}, ${uid("tok")}
        )
      `;
		const recs = await recsFor(data.id);
		const recMap = {};
		for (const [i, r] of recs.entries()) {
			const rid = uid("rc");
			recMap[r.id] = rid;
			await sql`
          insert into recipients (id, user_id, document_id, name, email, phone, role, action, status, order_index, company_name, invite_token)
          values (${rid}, ${context.userId}, ${nid}, ${r.name}, ${r.email}, ${r.phone ?? ""}, ${r.role}, ${r.action}, ${"waiting"}, ${r.orderIndex ?? i + 1}, ${r.companyName ?? ""}, ${uid("inv")})
        `;
		}
		const fields = parse(row.fields_json, []).map((f) => ({
			...f,
			id: uid("f"),
			value: void 0,
			recipientId: recMap[f.recipientId] ?? f.recipientId
		}));
		await sql`update documents set fields_json = ${JSON.stringify(fields)} where id = ${nid}`;
		return {
			ok: true,
			id: nid
		};
	}
	return { ok: true };
});
var applySignature_createServerFn_handler = createServerRpc({
	id: "dea35a69275acfe5dc91aa2189f5ed3c3a56592f4c1ca770fc44b1245d6604cf",
	name: "applySignature",
	filename: "src/lib/api.ts"
}, (opts) => applySignature.__executeServer(opts));
var applySignature = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(applySignature_createServerFn_handler, async ({ context, data }) => {
	await ensure(context.userId);
	const sql = await getSql();
	const ident = await userEmail(context.userId);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	if (data.decline) {
		await sql`update recipients set status = 'declined', declined_reason = ${data.reason ?? ""} where id = ${data.recipientId} and user_id = ${context.userId}`;
		await sql`update documents set status = 'declined', decline_reason = ${data.reason ?? ""}, updated_at = ${now} where id = ${data.id} and user_id = ${context.userId}`;
		await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${context.userId}, ${data.id}, ${ident.name}, ${"Menolak menandatangani: " + (data.reason ?? "")})`;
		await issueWorkspaceTsa(context.userId, data.id, "document.declined");
		dispatchWebhook(context.userId, "document.declined", {
			documentId: data.id,
			recipientId: data.recipientId
		});
		return { ok: true };
	}
	await sql`
      update documents set fields_json = ${JSON.stringify(data.fields)}, updated_at = ${now}
      where id = ${data.id} and user_id = ${context.userId}
    `;
	await sql`
      update recipients set status = 'signed', signed_at = ${now}, signature_data = ${data.signatureData}
      where id = ${data.recipientId} and document_id = ${data.id}
    `;
	if (data.emeterai) await sql`update quotas set emeterai_used = emeterai_used + 1 where user_id = ${context.userId} and emeterai_used < emeterai_total`;
	await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${context.userId}, ${data.id}, ${ident.name}, ${"Menandatangani dokumen (PSrE + sertifikat)"})`;
	if (((await sql`
      select count(*)::int as c from recipients
      where document_id = ${data.id} and action = 'needs_to_sign' and status != 'signed' and status != 'declined'
    `)[0]?.c ?? 0) === 0) {
		await sql`update documents set status = 'completed', completed_at = ${now}, updated_at = ${now} where id = ${data.id}`;
		await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${context.userId}, ${data.id}, ${"Sistem Paraf"}, ${"Semua pihak telah menandatangani. Dokumen dikunci."})`;
		await issueWorkspaceTsa(context.userId, data.id, "document.completed");
		dispatchWebhook(context.userId, "document.completed", { documentId: data.id });
	} else {
		await sql`update documents set status = 'waiting_for_others', updated_at = ${now} where id = ${data.id} and user_id = ${context.userId}`;
		await issueWorkspaceTsa(context.userId, data.id, "document.signed", { recipientId: data.recipientId });
		dispatchWebhook(context.userId, "document.signed", {
			documentId: data.id,
			recipientId: data.recipientId
		});
	}
	return { ok: true };
});
var publicSign_createServerFn_handler = createServerRpc({
	id: "1e998e3f90a4b823589f6086a31cb16b69d5337f5d106207265c77c4845fa93f",
	name: "publicSign",
	filename: "src/lib/api.ts"
}, (opts) => publicSign.__executeServer(opts));
var publicSign = createServerFn({ method: "POST" }).validator((d) => d).handler(publicSign_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	await sql.query(`alter table recipients add column if not exists invite_token text`).catch(() => void 0);
	const byInvite = await sql`
      select document_id, id from recipients where invite_token = ${data.token} limit 1
    `.catch(() => []);
	const doc = (byInvite[0] ? await sql`select id, user_id from documents where id = ${byInvite[0].document_id} limit 1` : await sql`select id, user_id from documents where token = ${data.token} limit 1`)[0];
	if (!doc) return { ok: false };
	const recipientId = byInvite[0]?.id ?? data.recipientId;
	if (byInvite[0] && byInvite[0].id !== data.recipientId) return {
		ok: false,
		error: "Tautan ini hanya untuk satu pihak."
	};
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const rec = await sql`
      select name, status, order_index, role from recipients where id = ${recipientId} and document_id = ${doc.id}
    `;
	const actor = rec[0]?.name ?? "Penerima";
	if (!rec[0]) return { ok: false };
	if (rec[0].status === "signed") return {
		ok: true,
		already: true
	};
	if (data.decline) {
		await sql`update recipients set status = 'declined', declined_reason = ${data.reason ?? ""} where id = ${recipientId}`;
		await sql`update documents set status = 'declined', decline_reason = ${data.reason ?? ""}, updated_at = ${now} where id = ${doc.id}`;
		await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${doc.user_id}, ${doc.id}, ${actor}, ${"Menolak menandatangani"})`;
		await issueWorkspaceTsa(doc.user_id, doc.id, "document.declined");
		dispatchWebhook(doc.user_id, "document.declined", {
			documentId: doc.id,
			recipientId
		});
		return { ok: true };
	}
	await sql`update documents set fields_json = ${JSON.stringify(data.fields)}, updated_at = ${now} where id = ${doc.id}`;
	await sql`update recipients set status = 'signed', signed_at = ${now}, signature_data = ${data.signatureData} where id = ${recipientId}`;
	await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${doc.user_id}, ${doc.id}, ${actor}, ${"Menandatangani dokumen via tautan"})`;
	if (((await sql`
      select count(*)::int as c from recipients
      where document_id = ${doc.id} and action = 'needs_to_sign' and status != 'signed' and status != 'declined'
    `)[0]?.c ?? 0) === 0) {
		await sql`update documents set status = 'completed', completed_at = ${now} where id = ${doc.id}`;
		await issueWorkspaceTsa(doc.user_id, doc.id, "document.completed");
		dispatchWebhook(doc.user_id, "document.completed", { documentId: doc.id });
	} else {
		await sql`update documents set status = 'waiting_for_others', updated_at = ${now} where id = ${doc.id} and status != 'completed'`;
		await issueWorkspaceTsa(doc.user_id, doc.id, "document.signed", { recipientId });
		dispatchWebhook(doc.user_id, "document.signed", {
			documentId: doc.id,
			recipientId
		});
	}
	return { ok: true };
});
var listContacts_createServerFn_handler = createServerRpc({
	id: "71249bd984c8066c0b4c0d533d13c4f77707b4cb493d0aaabaa4865a0033cf0d",
	name: "listContacts",
	filename: "src/lib/api.ts"
}, (opts) => listContacts.__executeServer(opts));
var listContacts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listContacts_createServerFn_handler, async ({ context }) => {
	await ensure(context.userId);
	const sql = await getSql();
	const rows = await sql`select * from contacts where user_id = ${context.userId} order by name`;
	const groups = await sql`select * from contact_groups where user_id = ${context.userId}`;
	return {
		contacts: rows.map((c) => ({
			id: c.id,
			name: c.name,
			email: c.email,
			phone: c.phone,
			company: c.company,
			groupName: c.group_name,
			role: c.role
		})),
		groups
	};
});
var saveContact_createServerFn_handler = createServerRpc({
	id: "974c98e3ef1cb357ced0b5bae6134556cce39ae27e283b134d5a287dcc60279b",
	name: "saveContact",
	filename: "src/lib/api.ts"
}, (opts) => saveContact.__executeServer(opts));
var saveContact = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveContact_createServerFn_handler, async ({ context, data }) => {
	await ensure(context.userId);
	const sql = await getSql();
	if (data.remove && data.id) {
		await sql`delete from contacts where id = ${data.id} and user_id = ${context.userId}`;
		return { ok: true };
	}
	if (data.id) await sql`
        update contacts set name = ${data.name}, email = ${data.email}, phone = ${data.phone ?? ""},
          company = ${data.company ?? ""}, group_name = ${data.groupName ?? ""}, role = ${data.role ?? "signer"}
        where id = ${data.id} and user_id = ${context.userId}
      `;
	else await sql`
        insert into contacts (id, user_id, name, email, phone, company, group_name, role)
        values (${uid("ct")}, ${context.userId}, ${data.name}, ${data.email}, ${data.phone ?? ""}, ${data.company ?? ""}, ${data.groupName ?? ""}, ${data.role ?? "signer"})
      `;
	return { ok: true };
});
var listTemplates_createServerFn_handler = createServerRpc({
	id: "a97ff5a16033c3c207074c846db648b6389e996819fdbcab77b00caebca0345a",
	name: "listTemplates",
	filename: "src/lib/api.ts"
}, (opts) => listTemplates.__executeServer(opts));
var listTemplates = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listTemplates_createServerFn_handler, async ({ context }) => {
	await ensure(context.userId);
	return (await (await getSql())`select * from templates where user_id = ${context.userId} order by uses desc`).map((t) => ({
		id: t.id,
		name: t.name,
		docType: t.doc_type,
		description: t.description,
		content: parse(t.content_json, {
			kind: "other",
			number: "",
			location: "",
			date: "",
			parties: [],
			clauses: []
		}),
		fields: parse(t.fields_json, []),
		compliance: t.compliance,
		uses: t.uses,
		createdAt: t.created_at
	}));
});
var listStamps_createServerFn_handler = createServerRpc({
	id: "9c77ed3897b63ef01f58336ffb56e23c6f55955c0b4224636f0872844d0e4d92",
	name: "listStamps",
	filename: "src/lib/api.ts"
}, (opts) => listStamps.__executeServer(opts));
var listStamps = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listStamps_createServerFn_handler, async ({ context }) => {
	await ensure(context.userId);
	return (await getSql())`
      select * from stamps where user_id = ${context.userId}
    `;
});
var listSignatures_createServerFn_handler = createServerRpc({
	id: "c3f55571004f2f5fbcb3d63a6ddb1cb0adbd050287ec0fafe215f677f8e34e56",
	name: "listSignatures",
	filename: "src/lib/api.ts"
}, (opts) => listSignatures.__executeServer(opts));
var listSignatures = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listSignatures_createServerFn_handler, async ({ context }) => {
	await ensure(context.userId);
	return (await getSql())`
      select * from signatures where user_id = ${context.userId}
    `;
});
var saveSignature_createServerFn_handler = createServerRpc({
	id: "4ae53b914f4e766f3a3d094b441d7847ab19024d36997590326a8c4fe9f0a17a",
	name: "saveSignature",
	filename: "src/lib/api.ts"
}, (opts) => saveSignature.__executeServer(opts));
var saveSignature = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveSignature_createServerFn_handler, async ({ context, data }) => {
	await ensure(context.userId);
	const sql = await getSql();
	await sql`update signatures set is_default = false where user_id = ${context.userId}`;
	await sql`
      insert into signatures (id, user_id, kind, name, data_url, is_default)
      values (${uid("sg")}, ${context.userId}, ${data.kind}, ${data.name}, ${data.dataUrl}, ${true})
    `;
	return { ok: true };
});
var listApprovals_createServerFn_handler = createServerRpc({
	id: "930f9d6d8b02e1fadbbc1aadbe15545071b1a2098a34c7805d877a6c8e2e8884",
	name: "listApprovals",
	filename: "src/lib/api.ts"
}, (opts) => listApprovals.__executeServer(opts));
var listApprovals = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listApprovals_createServerFn_handler, async ({ context }) => {
	await ensure(context.userId);
	const sql = await getSql();
	const rows = await sql`select * from approvals where user_id = ${context.userId} order by status, layer`;
	const tpls = await sql`select * from approval_templates where user_id = ${context.userId}`;
	const withTitle = [];
	for (const r of rows) {
		let documentTitle = "";
		if (r.document_id) documentTitle = (await sql`select title from documents where id = ${r.document_id}`)[0]?.title ?? "";
		withTitle.push({
			id: r.id,
			documentId: r.document_id,
			documentTitle,
			name: r.name,
			layer: r.layer,
			mode: r.mode,
			approverName: r.approver_name,
			approverEmail: r.approver_email,
			status: r.status,
			decidedAt: r.decided_at,
			note: r.note
		});
	}
	return {
		approvals: withTitle,
		templates: tpls.map((t) => ({
			...t,
			layers: parse(t.layers_json, [])
		}))
	};
});
var decideApproval_createServerFn_handler = createServerRpc({
	id: "a74439b4ff07d72e9ccb618deac55ce0e21f0a575c958193c288157232c7fb6f",
	name: "decideApproval",
	filename: "src/lib/api.ts"
}, (opts) => decideApproval.__executeServer(opts));
var decideApproval = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(decideApproval_createServerFn_handler, async ({ context, data }) => {
	await ensure(context.userId);
	const sql = await getSql();
	await sql`
      update approvals set status = ${data.status}, note = ${data.note ?? ""}, decided_at = now()
      where id = ${data.id} and user_id = ${context.userId}
    `;
	const row = await sql`select document_id from approvals where id = ${data.id}`;
	if (row[0]?.document_id && data.status === "approved") await sql`update documents set status = 'draft', updated_at = now() where id = ${row[0].document_id} and user_id = ${context.userId}`;
	if (row[0]?.document_id && data.status === "rejected") await sql`update documents set status = 'declined', decline_reason = ${data.note ?? "Ditolak pada alur persetujuan"}, updated_at = now() where id = ${row[0].document_id}`;
	await issueWorkspaceTsa(context.userId, row[0]?.document_id ?? data.id, "approval.decided", { status: data.status });
	dispatchWebhook(context.userId, "approval.decided", {
		approvalId: data.id,
		status: data.status,
		documentId: row[0]?.document_id
	});
	return { ok: true };
});
var listContracts_createServerFn_handler = createServerRpc({
	id: "964c2fdfa405b614c96210144dcc59109072888262ac62822eca28c1b229f03f",
	name: "listContracts",
	filename: "src/lib/api.ts"
}, (opts) => listContracts.__executeServer(opts));
var listContracts = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listContracts_createServerFn_handler, async ({ context }) => {
	await ensure(context.userId);
	const rows = await (await getSql())`
      select d.*, f.name as folder_name from documents d
      left join folders f on f.id = d.folder_id
      where d.user_id = ${context.userId} and (d.status = 'completed' or d.effective_date is not null)
      order by d.expires_at nulls last
    `;
	const out = [];
	for (const row of rows) out.push(toDoc(row, await recsFor(row.id)));
	return out;
});
var workspaceExtras_createServerFn_handler = createServerRpc({
	id: "4f64367c956fb942cc8e1b8827d092f903c7c70adecdebfef5b605d031c86f48",
	name: "workspaceExtras",
	filename: "src/lib/api.ts"
}, (opts) => workspaceExtras.__executeServer(opts));
var workspaceExtras = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(workspaceExtras_createServerFn_handler, async ({ context }) => {
	await ensure(context.userId);
	const sql = await getSql();
	return {
		orders: await sql`
      select * from emeterai_orders where user_id = ${context.userId} order by created_at desc
    `,
		proofs: await sql`
      select * from signing_proofs where user_id = ${context.userId} order by created_at desc
    `
	};
});
var buyEmeterai_createServerFn_handler = createServerRpc({
	id: "a046db6570141b8c7bcea2734c4cebb1a1fe9738bf649246d29b213d1b4bc3d6",
	name: "buyEmeterai",
	filename: "src/lib/api.ts"
}, (opts) => buyEmeterai.__executeServer(opts));
var buyEmeterai = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((qty) => qty).handler(buyEmeterai_createServerFn_handler, async ({ context, data: qty }) => {
	await ensure(context.userId);
	const sql = await getSql();
	const n = Math.max(1, Math.min(200, qty));
	await sql`update quotas set emeterai_total = emeterai_total + ${n} where user_id = ${context.userId}`;
	await sql`insert into emeterai_orders (id, user_id, qty, amount, status) values (${uid("em")}, ${context.userId}, ${n}, ${n * 1e4}, ${"paid"})`;
	return { ok: true };
});
var saveEmeteraiConnector_createServerFn_handler = createServerRpc({
	id: "5a3b01ba49a0cb046973ce7cdedd5d748a6d27547f36e455e885672668c203d6",
	name: "saveEmeteraiConnector",
	filename: "src/lib/api.ts"
}, (opts) => saveEmeteraiConnector.__executeServer(opts));
var saveEmeteraiConnector = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveEmeteraiConnector_createServerFn_handler, async ({ context, data }) => {
	await ensure(context.userId);
	const sql = await getSql();
	const cur = await loadPrefs(context.userId);
	const prefs = {
		...cur.prefs,
		emeteraiProvider: data.provider,
		emeteraiBaseUrl: data.baseUrl.trim(),
		emeteraiToken: data.token.trim() || cur.prefs.emeteraiToken || ""
	};
	const blob = JSON.stringify(prefs);
	await sql`
      insert into workspace_prefs (user_id, prefs_json)
      values (${context.userId}, ${blob})
      on conflict (user_id) do update set prefs_json = ${blob}
    `.catch(async () => {
		await sql`update workspace_prefs set prefs_json = ${blob} where user_id = ${context.userId}`;
	});
	return publicStatus(connectorFrom(prefs));
});
var testEmeteraiConnector_createServerFn_handler = createServerRpc({
	id: "8367feb5bf82db26d2058d24ec6e3e1caeecc0d3648c3474e5692f034323a35d",
	name: "testEmeteraiConnector",
	filename: "src/lib/api.ts"
}, (opts) => testEmeteraiConnector.__executeServer(opts));
var testEmeteraiConnector = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(testEmeteraiConnector_createServerFn_handler, async ({ context }) => {
	await ensure(context.userId);
	return pingConnector(connectorFrom((await loadPrefs(context.userId)).prefs));
});
var issueEmeterai_createServerFn_handler = createServerRpc({
	id: "cd47de9dafabdd17fae2f1e3954aa633026248d9405cc070058048e35e6f36b5",
	name: "issueEmeterai",
	filename: "src/lib/api.ts"
}, (opts) => issueEmeterai.__executeServer(opts));
var issueEmeterai = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(issueEmeterai_createServerFn_handler, async ({ context, data }) => {
	await ensure(context.userId);
	const sql = await getSql();
	const conn = connectorFrom((await loadPrefs(context.userId)).prefs);
	const doc = (await sql`
      select id, title, content_json from documents where id = ${data.documentId} and user_id = ${context.userId} limit 1
    `)[0];
	if (!doc) return {
		serial: "DEMO-MISSING",
		legal: false,
		verifyUrl: "/verify",
		provider: "demo",
		hash: "",
		error: "Document not found"
	};
	const hash = documentHash({
		id: doc.id,
		title: doc.title,
		content: parse(doc.content_json, {})
	});
	const existing = await sql`
      select serial, legal, verify_url, provider, hash from emeterai_stamps where document_id = ${doc.id} limit 1
    `.catch(() => []);
	if (existing[0]) return {
		serial: existing[0].serial,
		legal: Boolean(existing[0].legal),
		verifyUrl: existing[0].verify_url || `/verify?serial=${existing[0].serial}`,
		provider: existing[0].provider,
		hash: existing[0].hash
	};
	const origin = process.env.BETTER_AUTH_URL || "";
	const stamped = await issueStamp({
		connector: conn,
		hash,
		title: doc.title,
		documentId: doc.id,
		verifyOrigin: origin || "https://paraf.app"
	});
	await sql`
      insert into emeterai_stamps (id, user_id, document_id, serial, hash, legal, provider, verify_url, image_url)
      values (
        ${uid("ems")}, ${context.userId}, ${doc.id}, ${stamped.serial}, ${stamped.hash},
        ${stamped.legal ? 1 : 0}, ${stamped.provider}, ${stamped.verifyUrl}, ${stamped.image ?? null}
      )
    `.catch(() => void 0);
	if (stamped.legal) await sql`update quotas set emeterai_used = emeterai_used + 1 where user_id = ${context.userId} and emeterai_used < emeterai_total`;
	await sql`insert into audit_events (id, user_id, document_id, actor, action) values (
      ${uid("au")}, ${context.userId}, ${doc.id}, ${"Paraf"},
      ${stamped.legal ? "e-Meterai Peruri dibubuhkan: " + stamped.serial : "e-Meterai DEMO (tidak sah): " + stamped.serial}
    )`.catch(() => void 0);
	return stamped;
});
var lookupEmeterai_createServerFn_handler = createServerRpc({
	id: "558d597563b2b4e2429d9eae6568cfc0375ae2d2529240b4b0b02540f70b3fcf",
	name: "lookupEmeterai",
	filename: "src/lib/api.ts"
}, (opts) => lookupEmeterai.__executeServer(opts));
var lookupEmeterai = createServerFn({ method: "GET" }).validator((serial) => serial).handler(lookupEmeterai_createServerFn_handler, async ({ data: serial }) => {
	const sql = await getSql();
	const row = (await sql`select serial, legal, provider, verify_url, hash, document_id, created_at from emeterai_stamps where serial = ${serial} limit 1`.catch(() => []))[0];
	if (!row) return null;
	let title = "";
	if (row.document_id) title = (await sql`select title from documents where id = ${row.document_id}`)[0]?.title ?? "";
	return {
		serial: row.serial,
		legal: Boolean(row.legal),
		provider: row.provider,
		verifyUrl: row.verify_url,
		hash: row.hash,
		title,
		createdAt: row.created_at
	};
});
var markNotifications_createServerFn_handler = createServerRpc({
	id: "7b4b96dcf07083e0a3cf4aaf7a4c5b905296d591b658726cb94c7a7e54fd431c",
	name: "markNotifications",
	filename: "src/lib/api.ts"
}, (opts) => markNotifications.__executeServer(opts));
var markNotifications = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(markNotifications_createServerFn_handler, async ({ context }) => {
	await (await getSql())`update notifications set read = true where user_id = ${context.userId}`;
	return { ok: true };
});
var updateCompany_createServerFn_handler = createServerRpc({
	id: "5effda6832b5b440a3b7e3b2442f8a4caac490985627d83a37ec3eb210429e1d",
	name: "updateCompany",
	filename: "src/lib/api.ts"
}, (opts) => updateCompany.__executeServer(opts));
var updateCompany = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(updateCompany_createServerFn_handler, async ({ context, data }) => {
	await ensure(context.userId);
	await (await getSql())`
      update companies set name = ${data.name}, legal_name = ${data.legalName}, npwp = ${data.npwp},
        address = ${data.address}, city = ${data.city}, phone = ${data.phone}
      where user_id = ${context.userId}
    `;
	return { ok: true };
});
var bulkSignDocs_createServerFn_handler = createServerRpc({
	id: "e3c2c609aa5632a685c22c64c33c734c8a928ce8f89680be2733c70061c07ecb",
	name: "bulkSignDocs",
	filename: "src/lib/api.ts"
}, (opts) => bulkSignDocs.__executeServer(opts));
var bulkSignDocs = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(bulkSignDocs_createServerFn_handler, async ({ context, data }) => {
	await ensure(context.userId);
	const ident = await userEmail(context.userId);
	for (const id of data.ids) {
		const packed = await getDocument({ data: id });
		if (!packed?.document) continue;
		const mine = packed.document.recipients.find((r) => r.email === ident.email && r.status !== "signed" && r.action === "needs_to_sign");
		if (!mine) continue;
		const fields = packed.document.fields.map((f) => f.recipientId === mine.id && (f.type === "signature" || f.type === "initials") ? {
			...f,
			value: data.signatureData
		} : f);
		await applySignature({ data: {
			id,
			recipientId: mine.id,
			fields,
			signatureData: data.signatureData
		} });
	}
	return { ok: true };
});
var createFolder_createServerFn_handler = createServerRpc({
	id: "cf6a4ad66b6f94d885329ba643b42b4fd4169a2659dcbf7fbca55e283736c637",
	name: "createFolder",
	filename: "src/lib/api.ts"
}, (opts) => createFolder.__executeServer(opts));
var createFolder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((name) => name).handler(createFolder_createServerFn_handler, async ({ context, data: name }) => {
	await ensure(context.userId);
	const sql = await getSql();
	const id = uid("fld");
	await sql`insert into folders (id, user_id, name) values (${id}, ${context.userId}, ${name.trim() || "Folder baru"})`;
	return { id };
});
var saveStamp_createServerFn_handler = createServerRpc({
	id: "4272da774111dccf67a8f317ff6ebbf3f2f551325ced537748ba4170810190e5",
	name: "saveStamp",
	filename: "src/lib/api.ts"
}, (opts) => saveStamp.__executeServer(opts));
var saveStamp = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveStamp_createServerFn_handler, async ({ context, data }) => {
	await ensure(context.userId);
	const sql = await getSql();
	if (data.remove && data.id) {
		await sql`delete from stamps where id = ${data.id} and user_id = ${context.userId}`;
		return { ok: true };
	}
	await sql`update stamps set is_default = false where user_id = ${context.userId}`;
	await sql`
      insert into stamps (id, user_id, name, company_name, data_url, is_default)
      values (${uid("st")}, ${context.userId}, ${data.name}, ${data.companyName ?? ""}, ${data.dataUrl}, ${true})
    `;
	return { ok: true };
});
var saveTemplate_createServerFn_handler = createServerRpc({
	id: "14117c49f6b7374c697e3ea796257ba72bc0a6ab0ddd3bed42e0d4bb77ccf76c",
	name: "saveTemplate",
	filename: "src/lib/api.ts"
}, (opts) => saveTemplate.__executeServer(opts));
var saveTemplate = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveTemplate_createServerFn_handler, async ({ context, data }) => {
	await ensure(context.userId);
	const sql = await getSql();
	if (data.remove && data.id) {
		await sql`delete from templates where id = ${data.id} and user_id = ${context.userId}`;
		return { ok: true };
	}
	const fieldsJson = JSON.stringify(data.fields ?? []);
	const contentJson = JSON.stringify(data.content);
	if (data.id) {
		await sql`
        update templates set
          name = ${data.name},
          doc_type = ${data.docType},
          description = ${data.description ?? ""},
          content_json = ${contentJson},
          fields_json = ${fieldsJson}
        where id = ${data.id} and user_id = ${context.userId}
      `;
		return {
			ok: true,
			id: data.id
		};
	}
	const nid = uid("tpl");
	await sql`
      insert into templates (id, user_id, name, doc_type, description, content_json, fields_json)
      values (${nid}, ${context.userId}, ${data.name}, ${data.docType}, ${data.description ?? ""}, ${contentJson}, ${fieldsJson})
    `;
	return {
		ok: true,
		id: nid
	};
});
var saveApprovalTemplate_createServerFn_handler = createServerRpc({
	id: "acd9a9293b4dbada0527978a255e39e3a518be88d4c536dea595a3acfa357bcc",
	name: "saveApprovalTemplate",
	filename: "src/lib/api.ts"
}, (opts) => saveApprovalTemplate.__executeServer(opts));
var saveApprovalTemplate = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveApprovalTemplate_createServerFn_handler, async ({ context, data }) => {
	await ensure(context.userId);
	const sql = await getSql();
	if (data.remove && data.id) {
		await sql`delete from approval_templates where id = ${data.id} and user_id = ${context.userId}`;
		return { ok: true };
	}
	const layers = JSON.stringify(data.layers?.length ? data.layers : [{
		layer: 1,
		name: "Approver",
		mode: "all"
	}]);
	if (data.id) {
		await sql`update approval_templates set name = ${data.name}, layers_json = ${layers} where id = ${data.id} and user_id = ${context.userId}`;
		return {
			ok: true,
			id: data.id
		};
	}
	const nid = uid("apt");
	await sql`
      insert into approval_templates (id, user_id, name, layers_json)
      values (${nid}, ${context.userId}, ${data.name}, ${layers})
    `;
	return {
		ok: true,
		id: nid
	};
});
var addProof_createServerFn_handler = createServerRpc({
	id: "2a1e666ab8a0f42a82418e9639611b316df271df7322a99840b4abc278c2d9cf",
	name: "addProof",
	filename: "src/lib/api.ts"
}, (opts) => addProof.__executeServer(opts));
var addProof = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(addProof_createServerFn_handler, async ({ context, data }) => {
	await ensure(context.userId);
	const sql = await getSql();
	if (data.remove && data.id) {
		await sql`delete from signing_proofs where id = ${data.id} and user_id = ${context.userId}`;
		return { ok: true };
	}
	await sql`
      insert into signing_proofs (id, user_id, title, notary, witness, notes)
      values (${uid("sp")}, ${context.userId}, ${data.title}, ${data.notary ?? ""}, ${data.witness ?? ""}, ${data.notes ?? ""})
    `;
	return { ok: true };
});
var addRecipient_createServerFn_handler = createServerRpc({
	id: "9149f1c113f82b020461355f65721c5482f75fc3cea38355871b2838b6d17984",
	name: "addRecipient",
	filename: "src/lib/api.ts"
}, (opts) => addRecipient.__executeServer(opts));
var addRecipient = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(addRecipient_createServerFn_handler, async ({ context, data }) => {
	await ensure(context.userId);
	const sql = await getSql();
	const ident = await userEmail(context.userId);
	const max = await sql`select coalesce(max(order_index), 0)::int as m from recipients where document_id = ${data.documentId}`;
	await sql`
      insert into recipients (id, user_id, document_id, name, email, role, action, status, order_index, company_name, invite_token)
      values (${uid("rc")}, ${context.userId}, ${data.documentId}, ${data.name}, ${data.email}, ${data.role ?? "signer"}, ${"needs_to_sign"}, ${"waiting"}, ${(max[0]?.m ?? 0) + 1}, ${data.companyName ?? ""}, ${uid("inv")})
    `;
	await sql`insert into audit_events (id, user_id, document_id, actor, action) values (${uid("au")}, ${context.userId}, ${data.documentId}, ${ident.name}, ${"Meneruskan / menambah penerima: " + data.email})`;
	await sql`update documents set status = 'waiting_for_others', updated_at = now() where id = ${data.documentId} and user_id = ${context.userId} and status = 'completed'`;
	return { ok: true };
});
var setPasscode_createServerFn_handler = createServerRpc({
	id: "554e2b28c8d981bcac5b2469d1db7cd93fae21de92cfb0db753f15c986596fa6",
	name: "setPasscode",
	filename: "src/lib/api.ts"
}, (opts) => setPasscode.__executeServer(opts));
var setPasscode = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(setPasscode_createServerFn_handler, async ({ context, data }) => {
	await ensure(context.userId);
	await (await getSql())`update documents set passcode = ${data.passcode}, updated_at = now() where id = ${data.id} and user_id = ${context.userId}`;
	return { ok: true };
});
var requestApproval_createServerFn_handler = createServerRpc({
	id: "af1cdfb4ee5f644aa07736577d3c381686cfa65c50fb6de38c34b97618bf509c",
	name: "requestApproval",
	filename: "src/lib/api.ts"
}, (opts) => requestApproval.__executeServer(opts));
var requestApproval = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(requestApproval_createServerFn_handler, async ({ context, data }) => {
	await ensure(context.userId);
	const sql = await getSql();
	await sql`
      insert into approvals (id, user_id, document_id, name, layer, mode, approver_name, approver_email, status, note)
      values (
        ${uid("ap")}, ${context.userId}, ${data.documentId ?? null}, ${data.name}, 1,
        ${data.mode ?? "all"}, ${data.approverName}, ${data.approverEmail}, ${"pending"}, ${data.message ?? ""}
      )
    `;
	if (data.documentId) await sql`update documents set status = 'pending_approval', updated_at = now() where id = ${data.documentId} and user_id = ${context.userId}`;
	await issueWorkspaceTsa(context.userId, data.documentId ?? null, "approval.requested");
	dispatchWebhook(context.userId, "approval.requested", {
		documentId: data.documentId,
		name: data.name
	});
	return { ok: true };
});
var getInsights_createServerFn_handler = createServerRpc({
	id: "dd2493e4da72e69a1700e1ad61ecaf1d883090c1cf63f84fd165b99e95879197",
	name: "getInsights",
	filename: "src/lib/api.ts"
}, (opts) => getInsights.__executeServer(opts));
var getInsights = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getInsights_createServerFn_handler, async ({ context }) => {
	await ensure(context.userId);
	const sql = await getSql();
	const docs = await sql`
      select status, doc_type, compliance, created_at, completed_at, sent_at
      from documents where user_id = ${context.userId}
    `;
	const statusCounts = {};
	const typeCounts = {};
	const monthMap = {};
	let signHours = 0;
	let signN = 0;
	for (const d of docs) {
		statusCounts[d.status] = (statusCounts[d.status] ?? 0) + 1;
		typeCounts[d.doc_type] = (typeCounts[d.doc_type] ?? 0) + 1;
		const dt = new Date(d.sent_at ?? d.created_at);
		const key = `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}`;
		if (!monthMap[key]) monthMap[key] = {
			sent: 0,
			completed: 0,
			voided: 0,
			declined: 0
		};
		if (d.sent_at) monthMap[key].sent += 1;
		if (d.status === "completed") monthMap[key].completed += 1;
		if (d.status === "voided") monthMap[key].voided += 1;
		if (d.status === "declined") monthMap[key].declined += 1;
		if (d.completed_at && d.sent_at) {
			signHours += (new Date(d.completed_at).getTime() - new Date(d.sent_at).getTime()) / 36e5;
			signN += 1;
		}
	}
	const months = Object.keys(monthMap).sort().slice(-6).map((m) => ({
		month: m,
		...monthMap[m]
	}));
	const quota = (await sql`select emeterai_used, emeterai_total from quotas where user_id = ${context.userId}`)[0];
	const psre = docs.filter((d) => d.compliance === "psre").length;
	const global = docs.filter((d) => d.compliance === "globalsign").length;
	return {
		total: docs.length,
		statusCounts,
		typeCounts,
		months,
		avgHours: signN ? signHours / signN : 0,
		signedCount: signN,
		emeteraiUsed: quota?.emeterai_used ?? 0,
		emeteraiTotal: quota?.emeterai_total ?? 0,
		emeteraiSpend: (quota?.emeterai_used ?? 0) * 1e4,
		psre,
		global
	};
});
var analyzeDocument_createServerFn_handler = createServerRpc({
	id: "1b1b581d874393882e6aca8b05735bc5e432b05a871feccf8685aa6d68ed9886",
	name: "analyzeDocument",
	filename: "src/lib/api.ts"
}, (opts) => analyzeDocument.__executeServer(opts));
var analyzeDocument = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(analyzeDocument_createServerFn_handler, async ({ context, data }) => {
	await ensure(context.userId);
	const payload = {
		title: data.title,
		number: data.content.number,
		parties: data.content.parties,
		clauses: data.content.clauses,
		amount: data.content.amount
	};
	const prefs = await loadPrefs(context.userId);
	const conn = aiFrom(prefs.prefs);
	if (conn.apiKey) {
		const res = await chatComplete(conn, JSON.stringify(payload));
		if (res.ok) {
			const analysis = parseAiReview(res.text);
			return {
				ok: true,
				text: analysis.summary,
				local: analysis,
				provider: conn.provider
			};
		}
		return {
			ok: false,
			error: res.error ?? "AI error",
			local: localAnalyze(data.content, data.title),
			provider: conn.provider
		};
	}
	return {
		ok: false,
		error: "unavailable",
		local: localAnalyze(data.content, data.title),
		provider: conn.provider
	};
});
function localAnalyze(content, title) {
	const text = [title, ...content.clauses.map((c) => c.title + " " + c.body)].join(" ").toLowerCase();
	const findings = [];
	if (!/sengketa|pengadilan|arbitrase/.test(text)) findings.push({
		level: "tinggi",
		title: "Klausul sengketa absen",
		detail: "Tidak ada forum penyelesaian sengketa. Disarankan musyawarah lalu PN yang disepakati."
	});
	if (!/rahasia|kerahasiaan|confidential/.test(text)) findings.push({
		level: "sedang",
		title: "Kerahasiaan lemah",
		detail: "Tidak ada kewajiban kerahasiaan tersurat."
	});
	if (!/force majeure|keadaan kahar/.test(text)) findings.push({
		level: "sedang",
		title: "Force majeure absen",
		detail: "Risiko keterlambatan di luar kendali tidak diatur."
	});
	if (/eksklusif/.test(text)) findings.push({
		level: "tinggi",
		title: "Eksklusivitas",
		detail: "Klausul eksklusif dapat membatasi wilayah usaha. Pastikan jangka waktu dan wilayah sempit."
	});
	if (!content.amount) findings.push({
		level: "rendah",
		title: "Nilai tidak tercantum",
		detail: "Nominal transaksi tidak ada di naskah."
	});
	if (content.clauses.length < 4) findings.push({
		level: "sedang",
		title: "Pasal tipis",
		detail: "Hanya " + content.clauses.length + " pasal. Pertimbangkan pengakhiran, denda, dan law of governing."
	});
	return {
		summary: `Analisis lokal atas “${title}”. ${content.parties.length} pihak, ${content.clauses.length} pasal.${content.amount ? " Nilai " + content.amount + "." : ""}`,
		findings
	};
}
var updateProfile_createServerFn_handler = createServerRpc({
	id: "37e24e424b50c61a8099763c01ddce36cc987a75efca225ed025f71140e1bfdf",
	name: "updateProfile",
	filename: "src/lib/api.ts"
}, (opts) => updateProfile.__executeServer(opts));
var updateProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(updateProfile_createServerFn_handler, async ({ context, data }) => {
	await ensure(context.userId);
	const sql = await getSql();
	await sql`update "user" set name = ${data.name} where id = ${context.userId}`;
	const profile = {
		...(await loadPrefs(context.userId)).profile,
		phone: data.phone ?? "",
		address: data.address ?? "",
		dob: data.dob ?? ""
	};
	await sql`
      insert into workspace_prefs (user_id, profile_json) values (${context.userId}, ${JSON.stringify(profile)})
      on conflict (user_id) do update set profile_json = ${JSON.stringify(profile)}
    `.catch(async () => {
		await sql`update workspace_prefs set profile_json = ${JSON.stringify(profile)} where user_id = ${context.userId}`;
	});
	if (data.phone || data.address) await sql`update companies set phone = ${data.phone ?? ""}, address = ${data.address ?? profile.address ?? ""} where user_id = ${context.userId}`;
	return { ok: true };
});
var savePrefs_createServerFn_handler = createServerRpc({
	id: "c76ed95cfff67ba63281d75ed5f9ea629c19bebbf94dd9d629c8a415da3aa9d1",
	name: "savePrefs",
	filename: "src/lib/api.ts"
}, (opts) => savePrefs.__executeServer(opts));
var savePrefs = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(savePrefs_createServerFn_handler, async ({ context, data }) => {
	await ensure(context.userId);
	const sql = await getSql();
	const cur = await loadPrefs(context.userId);
	const prefs = JSON.stringify(data.prefs ?? cur.prefs);
	const notif = JSON.stringify(data.notif ?? cur.notif);
	const email = JSON.stringify(data.email ?? cur.email);
	await sql`
      insert into workspace_prefs (user_id, prefs_json, notif_json, email_json)
      values (${context.userId}, ${prefs}, ${notif}, ${email})
      on conflict (user_id) do update set prefs_json = ${prefs}, notif_json = ${notif}, email_json = ${email}
    `.catch(async () => {
		await sql`update workspace_prefs set prefs_json = ${prefs}, notif_json = ${notif}, email_json = ${email} where user_id = ${context.userId}`;
	});
	return { ok: true };
});
var inviteMember_createServerFn_handler = createServerRpc({
	id: "fba24b5e3e64e1df34f42e9773030d4bdb753f66a46252043cb945f8b0bedb31",
	name: "inviteMember",
	filename: "src/lib/api.ts"
}, (opts) => inviteMember.__executeServer(opts));
var inviteMember = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(inviteMember_createServerFn_handler, async ({ context, data }) => {
	await ensure(context.userId);
	await (await getSql())`
      insert into team_members (id, user_id, name, email, role, status, emeterai_assigned)
      values (${uid("tm")}, ${context.userId}, ${data.name}, ${data.email}, ${data.role ?? "Member"}, ${"invited"}, ${0})
    `;
	return { ok: true };
});
var assignEmeterai_createServerFn_handler = createServerRpc({
	id: "6bc40a8036f097773f56a5c2a64ef0d2e42a4ef49b5ec823e4c74991135945cf",
	name: "assignEmeterai",
	filename: "src/lib/api.ts"
}, (opts) => assignEmeterai.__executeServer(opts));
var assignEmeterai = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(assignEmeterai_createServerFn_handler, async ({ context, data }) => {
	await ensure(context.userId);
	await (await getSql())`update team_members set emeterai_assigned = ${Math.max(0, Math.min(500, data.qty))} where id = ${data.memberId} and user_id = ${context.userId}`;
	return { ok: true };
});
var exportWorkspace_createServerFn_handler = createServerRpc({
	id: "4c474f77a4bdbbb602db1bf9645aa69c88f5dd253a8e6407812a27728b98ca8d",
	name: "exportWorkspace",
	filename: "src/lib/api.ts"
}, (opts) => exportWorkspace.__executeServer(opts));
var exportWorkspace = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(exportWorkspace_createServerFn_handler, async ({ context }) => {
	await ensure(context.userId);
	const sql = await getSql();
	const docs = await sql`
      select d.*, f.name as folder_name from documents d
      left join folders f on f.id = d.folder_id
      where d.user_id = ${context.userId}
      order by d.updated_at desc
    `;
	const out = [];
	for (const row of docs) out.push(toDoc(row, await recsFor(row.id)));
	return {
		documents: out,
		audit: await sql`select document_id, actor, action, created_at from audit_events where user_id = ${context.userId} order by created_at desc limit 400`
	};
});
var DEMO_OWNER = "paraf-demo";
var getDemoInvites_createServerFn_handler = createServerRpc({
	id: "7c01ce39465e17182ea2384b9e0994eb544fc7869dbd141d3a4b52ee80c8d9bd",
	name: "getDemoInvites",
	filename: "src/lib/api.ts"
}, (opts) => getDemoInvites.__executeServer(opts));
var getDemoInvites = createServerFn({ method: "GET" }).handler(getDemoInvites_createServerFn_handler, async () => {
	await ensure(DEMO_OWNER);
	const sql = await getSql();
	const picked = (await sql`
    select id, title, token from documents
    where user_id = ${DEMO_OWNER} and status in ('need_to_sign', 'waiting_for_others')
    order by created_at desc limit 8
  `)[0];
	if (!picked) {
		const id = uid("doc");
		const token = uid("tok");
		const title = "PKS Distribusi — undangan mitra";
		const content = blankContent("kerjasama", title, "PT Nusantara Digital Pratama");
		await sql`
      insert into documents (
        id, user_id, title, doc_type, status, compliance, group_name, content_json, fields_json, settings_json, token, sent_at
      ) values (
        ${id}, ${DEMO_OWNER}, ${title}, ${"kerjasama"}, ${"waiting_for_others"}, ${"psre"}, ${"Demo"},
        ${JSON.stringify(content)}, ${"[]"}, ${JSON.stringify(DEFAULT_SETTINGS)}, ${token}, ${(/* @__PURE__ */ new Date()).toISOString()}
      )
    `;
		for (const [i, p] of [{
			name: "PT Nusantara Digital Pratama",
			email: "legal@nusantara.example"
		}, {
			name: "CV Harmoni Niaga",
			email: "owner@harmoni.example"
		}].entries()) await sql`
        insert into recipients (id, user_id, document_id, name, email, role, action, status, order_index, invite_token)
        values (${uid("rc")}, ${DEMO_OWNER}, ${id}, ${p.name}, ${p.email}, ${"signer"}, ${"needs_to_sign"}, ${"waiting"}, ${i + 1}, ${uid("inv")})
      `;
		return {
			title,
			invites: (await recsFor(id)).map((r) => ({
				name: r.name,
				role: r.role,
				email: r.email,
				token: r.inviteToken || token,
				signed: r.status === "signed"
			}))
		};
	}
	const recs = await recsFor(picked.id);
	return {
		title: picked.title,
		invites: recs.filter((r) => r.role !== "cc").map((r) => ({
			name: r.name,
			role: r.role,
			email: r.email,
			token: r.inviteToken || picked.token,
			signed: r.status === "signed"
		}))
	};
});
//#endregion
export { addProof_createServerFn_handler, addRecipient_createServerFn_handler, analyzeDocument_createServerFn_handler, applySignature_createServerFn_handler, assignEmeterai_createServerFn_handler, bootstrap_createServerFn_handler, bulkSignDocs_createServerFn_handler, buyEmeterai_createServerFn_handler, createFolder_createServerFn_handler, decideApproval_createServerFn_handler, exportWorkspace_createServerFn_handler, getDemoInvites_createServerFn_handler, getDocument_createServerFn_handler, getInsights_createServerFn_handler, getPublicDocument_createServerFn_handler, inviteMember_createServerFn_handler, issueEmeterai_createServerFn_handler, listApprovals_createServerFn_handler, listContacts_createServerFn_handler, listContracts_createServerFn_handler, listDocuments_createServerFn_handler, listSignatures_createServerFn_handler, listStamps_createServerFn_handler, listTemplates_createServerFn_handler, lookupEmeterai_createServerFn_handler, markNotifications_createServerFn_handler, mutateDocument_createServerFn_handler, publicSign_createServerFn_handler, requestApproval_createServerFn_handler, saveApprovalTemplate_createServerFn_handler, saveContact_createServerFn_handler, saveDocument_createServerFn_handler, saveEmeteraiConnector_createServerFn_handler, savePrefs_createServerFn_handler, saveSignature_createServerFn_handler, saveStamp_createServerFn_handler, saveTemplate_createServerFn_handler, setPasscode_createServerFn_handler, testEmeteraiConnector_createServerFn_handler, updateCompany_createServerFn_handler, updateProfile_createServerFn_handler, workspaceExtras_createServerFn_handler };
