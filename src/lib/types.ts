export const DOC_STATUSES = [
  "draft",
  "need_to_sign",
  "waiting_for_others",
  "pending_approval",
  "scheduled",
  "completed",
  "declined",
  "expired",
  "voided",
] as const;

export type DocStatus = (typeof DOC_STATUSES)[number];

/** Sidebar + URL keys. Virtual folders (sent/trash/shared) are filtered in listDocuments. */
export const FOLDER_ROUTES: Record<string, string> = {
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
  "pending-approval": "pending_approval",
};

export type FieldType =
  | "signature"
  | "initials"
  | "date"
  | "name"
  | "email"
  | "text"
  | "checkbox"
  | "stamp"
  | "emeterai"
  | "qr"
  | "title"
  | "company"
  | "phone"
  | "currency"
  | "number"
  | "radio";

export type DocField = {
  id: string;
  type: FieldType;
  page: number;
  x: number;
  y: number;
  w: number;
  h: number;
  recipientId: string;
  required: boolean;
  value?: string;
  label?: string;
  placeholder?: string;
};

export type Party = {
  name: string;
  title: string;
  company: string;
  address: string;
  npwp?: string;
};

export type Clause = { title: string; body: string };

export type DocContent = {
  kind: string;
  number: string;
  location: string;
  date: string;
  parties: Party[];
  clauses: Clause[];
  amount?: string;
  amountWords?: string;
  subject?: string;
  footerNote?: string;
};

export type DocSettings = {
  sequential: boolean;
  whatsapp: boolean;
  showQr: boolean;
  reminder: boolean;
  reminderDays: number;
  subject: string;
  message: string;
  emeteraiBy: "maker" | "signer" | "none";
  quality: "standard" | "high";
  trackAsContract: boolean;
  requireSignIn: boolean;
  signatureFrame: boolean;
  scheduleAt?: string;
  passcode?: string;
};

export type Recipient = {
  id: string;
  documentId: string;
  name: string;
  email: string;
  phone: string;
  role: "signer" | "cc" | "approver" | "witness" | "notary";
  action: string;
  status: "waiting" | "signed" | "declined" | "viewed";
  orderIndex: number;
  companyName: string;
  signedAt?: string | null;
  signatureData?: string | null;
  inviteToken?: string;
};

export type DocumentRow = {
  id: string;
  title: string;
  docType: string;
  status: DocStatus;
  compliance: "psre" | "globalsign";
  groupName: string;
  folderId: string | null;
  folderName?: string | null;
  passcode: string | null;
  content: DocContent;
  fields: DocField[];
  settings: DocSettings;
  token: string;
  effectiveDate: string | null;
  expiresAt: string | null;
  deadline: string | null;
  createdAt: string;
  updatedAt: string;
  sentAt: string | null;
  completedAt: string | null;
  voidedAt: string | null;
  declineReason: string | null;
  tags?: string;
  scheduledAt?: string | null;
  deletedAt?: string | null;
  recipients: Recipient[];
  lockRecipientId?: string;
};

export type Company = {
  id: string;
  name: string;
  legalName: string;
  npwp: string;
  address: string;
  city: string;
  phone: string;
  plan: string;
};

export type Quota = {
  emeteraiUsed: number;
  emeteraiTotal: number;
  ekycUsed: number;
  ekycTotal: number;
  waUsed: number;
  waTotal: number;
  signatureQuota: number;
};

export type Contact = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  groupName: string;
  role: string;
};

export type Stamp = {
  id: string;
  name: string;
  companyName: string;
  dataUrl: string;
  isDefault: boolean;
};

export type SavedSignature = {
  id: string;
  kind: string;
  name: string;
  dataUrl: string;
  isDefault: boolean;
};

export type TemplateRow = {
  id: string;
  name: string;
  docType: string;
  description: string;
  content: DocContent;
  fields: DocField[];
  compliance: string;
  uses: number;
  createdAt: string;
};

export type ApprovalRow = {
  id: string;
  documentId: string | null;
  documentTitle?: string;
  name: string;
  layer: number;
  mode: string;
  approverName: string;
  approverEmail: string;
  status: string;
  decidedAt: string | null;
  note: string;
};

export type AuditEvent = {
  id: string;
  actor: string;
  action: string;
  ip: string;
  meta: string;
  createdAt: string;
};

export type NotificationRow = {
  id: string;
  title: string;
  body: string;
  href: string;
  read: boolean;
  createdAt: string;
};

export type FolderRow = { id: string; name: string };

export type InboxCounts = Record<string, number>;

export const STATUS_LABEL: Record<DocStatus, { id: string; en: string }> = {
  draft: { id: "Draf", en: "Draft" },
  need_to_sign: { id: "Perlu ditandatangani", en: "Need to sign" },
  waiting_for_others: { id: "Menunggu orang lain", en: "Waiting for others" },
  pending_approval: { id: "Menunggu persetujuan", en: "Pending approval" },
  scheduled: { id: "Terjadwal", en: "Scheduled" },
  completed: { id: "Selesai", en: "Completed" },
  declined: { id: "Ditolak", en: "Declined" },
  expired: { id: "Kedaluwarsa", en: "Expired" },
  voided: { id: "Dibatalkan", en: "Voided" },
};

export const DOC_TYPE_LABEL: Record<string, string> = {
  pkwt: "PKWT / Kontrak Kerja",
  nda: "Perjanjian Kerahasiaan (NDA)",
  spk: "Surat Perintah Kerja",
  invoice: "Faktur / Invoice",
  mou: "Nota Kesepahaman (MoU)",
  kuasa: "Surat Kuasa",
  sewa: "Perjanjian Sewa",
  addendum: "Addendum Kontrak",
  kerjasama: "Perjanjian Kerja Sama",
  other: "Dokumen Lainnya",
};

export const FIELD_LABEL: Record<FieldType, { id: string; en: string }> = {
  signature: { id: "Tanda tangan", en: "Signature" },
  initials: { id: "Paraf", en: "Initials" },
  date: { id: "Tanggal", en: "Date" },
  name: { id: "Nama", en: "Name" },
  email: { id: "Email", en: "Email" },
  text: { id: "Teks", en: "Text" },
  checkbox: { id: "Centang", en: "Checkbox" },
  stamp: { id: "Stempel", en: "Stamp" },
  emeterai: { id: "e-Meterai", en: "e-Stamp" },
  qr: { id: "Kode QR", en: "QR code" },
  title: { id: "Jabatan", en: "Title" },
  company: { id: "Perusahaan", en: "Company" },
  phone: { id: "Telepon", en: "Phone" },
  currency: { id: "Mata uang", en: "Currency" },
  number: { id: "Angka", en: "Numbers" },
  radio: { id: "Pilihan", en: "Radio" },
};

export const DEFAULT_SETTINGS: DocSettings = {
  sequential: true,
  whatsapp: false,
  showQr: true,
  reminder: true,
  reminderDays: 2,
  subject: "Dokumen menunggu tanda tangan Anda",
  message:
    "Halo, Anda diminta menandatangani dokumen melalui Paraf. Klik tautan untuk meninjau dan menandatangani.",
  emeteraiBy: "maker",
  quality: "high",
  trackAsContract: true,
  requireSignIn: false,
  signatureFrame: true,
};
