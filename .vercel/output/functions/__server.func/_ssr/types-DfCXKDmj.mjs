//#region node_modules/.nitro/vite/services/ssr/assets/types-DfCXKDmj.js
/** Sidebar + URL keys. Virtual folders (sent/trash/shared) are filtered in listDocuments. */
var FOLDER_ROUTES = {
	"all-inbox": "all",
	sent: "sent",
	scheduled: "scheduled",
	drafts: "draft",
	trash: "trash",
	shared: "shared",
	"need-to-sign": "need_to_sign",
	"waiting-for-others": "waiting_for_others",
	"expiring-soon": "expiring_soon",
	completed: "completed",
	draft: "draft",
	declined: "declined",
	expired: "expired",
	voided: "voided",
	"pending-approval": "pending_approval"
};
var STATUS_LABEL = {
	draft: {
		id: "Draf",
		en: "Draft"
	},
	need_to_sign: {
		id: "Perlu ditandatangani",
		en: "Need to sign"
	},
	waiting_for_others: {
		id: "Menunggu orang lain",
		en: "Waiting for others"
	},
	pending_approval: {
		id: "Menunggu persetujuan",
		en: "Pending approval"
	},
	scheduled: {
		id: "Terjadwal",
		en: "Scheduled"
	},
	completed: {
		id: "Selesai",
		en: "Completed"
	},
	declined: {
		id: "Ditolak",
		en: "Declined"
	},
	expired: {
		id: "Kedaluwarsa",
		en: "Expired"
	},
	voided: {
		id: "Dibatalkan",
		en: "Voided"
	}
};
var DOC_TYPE_LABEL = {
	pkwt: "PKWT / Kontrak Kerja",
	nda: "Perjanjian Kerahasiaan (NDA)",
	spk: "Surat Perintah Kerja",
	invoice: "Faktur / Invoice",
	mou: "Nota Kesepahaman (MoU)",
	kuasa: "Surat Kuasa",
	sewa: "Perjanjian Sewa",
	addendum: "Addendum Kontrak",
	kerjasama: "Perjanjian Kerja Sama",
	other: "Dokumen Lainnya"
};
var FIELD_LABEL = {
	signature: {
		id: "Tanda tangan",
		en: "Signature"
	},
	initials: {
		id: "Paraf",
		en: "Initials"
	},
	date: {
		id: "Tanggal",
		en: "Date"
	},
	name: {
		id: "Nama",
		en: "Name"
	},
	email: {
		id: "Email",
		en: "Email"
	},
	text: {
		id: "Teks",
		en: "Text"
	},
	checkbox: {
		id: "Centang",
		en: "Checkbox"
	},
	stamp: {
		id: "Stempel",
		en: "Stamp"
	},
	emeterai: {
		id: "e-Meterai",
		en: "e-Stamp"
	},
	qr: {
		id: "Kode QR",
		en: "QR code"
	},
	title: {
		id: "Jabatan",
		en: "Title"
	},
	company: {
		id: "Perusahaan",
		en: "Company"
	},
	phone: {
		id: "Telepon",
		en: "Phone"
	},
	currency: {
		id: "Mata uang",
		en: "Currency"
	},
	number: {
		id: "Angka",
		en: "Numbers"
	},
	radio: {
		id: "Pilihan",
		en: "Radio"
	}
};
var DEFAULT_SETTINGS = {
	sequential: true,
	whatsapp: false,
	showQr: true,
	reminder: true,
	reminderDays: 2,
	subject: "Dokumen menunggu tanda tangan Anda",
	message: "Halo, Anda diminta menandatangani dokumen melalui Paraf. Klik tautan untuk meninjau dan menandatangani.",
	emeteraiBy: "maker",
	quality: "high",
	trackAsContract: true,
	requireSignIn: false,
	signatureFrame: true
};
//#endregion
export { STATUS_LABEL as a, FOLDER_ROUTES as i, DOC_TYPE_LABEL as n, FIELD_LABEL as r, DEFAULT_SETTINGS as t };
