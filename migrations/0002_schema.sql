-- Paraf e-signature workspace (per-user)

create table if not exists companies (
  id text primary key,
  user_id text not null,
  name text not null,
  legal_name text not null default '',
  npwp text not null default '',
  address text not null default '',
  city text not null default '',
  phone text not null default '',
  plan text not null default 'Pro',
  created_at timestamptz not null default now()
);
create index if not exists companies_user_id_idx on companies (user_id);

create table if not exists quotas (
  user_id text primary key,
  emeterai_used integer not null default 0,
  emeterai_total integer not null default 50,
  ekyc_used integer not null default 0,
  ekyc_total integer not null default 20,
  wa_used integer not null default 0,
  wa_total integer not null default 100,
  signature_quota integer not null default -1
);

create table if not exists folders (
  id text primary key,
  user_id text not null,
  name text not null,
  created_at timestamptz not null default now()
);
create index if not exists folders_user_id_idx on folders (user_id);

create table if not exists documents (
  id text primary key,
  user_id text not null,
  folder_id text,
  title text not null,
  doc_type text not null,
  status text not null,
  compliance text not null default 'psre',
  group_name text not null default '',
  passcode text,
  content_json text not null default '{}',
  fields_json text not null default '[]',
  settings_json text not null default '{}',
  token text not null,
  effective_date text,
  expires_at text,
  deadline text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  sent_at timestamptz,
  completed_at timestamptz,
  voided_at timestamptz,
  decline_reason text
);
create index if not exists documents_user_id_idx on documents (user_id);
create index if not exists documents_token_idx on documents (token);
create index if not exists documents_status_idx on documents (user_id, status);

create table if not exists recipients (
  id text primary key,
  user_id text not null,
  document_id text not null,
  name text not null,
  email text not null,
  phone text not null default '',
  role text not null default 'signer',
  action text not null default 'needs_to_sign',
  status text not null default 'waiting',
  order_index integer not null default 1,
  company_name text not null default '',
  signed_at timestamptz,
  signature_data text,
  declined_reason text
);
create index if not exists recipients_doc_idx on recipients (document_id);
create index if not exists recipients_user_idx on recipients (user_id);

create table if not exists signatures (
  id text primary key,
  user_id text not null,
  kind text not null,
  name text not null,
  data_url text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists signatures_user_idx on signatures (user_id);

create table if not exists stamps (
  id text primary key,
  user_id text not null,
  name text not null,
  company_name text not null default '',
  data_url text not null,
  is_default boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists stamps_user_idx on stamps (user_id);

create table if not exists templates (
  id text primary key,
  user_id text not null,
  name text not null,
  doc_type text not null,
  description text not null default '',
  content_json text not null default '{}',
  fields_json text not null default '[]',
  compliance text not null default 'psre',
  uses integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists templates_user_idx on templates (user_id);

create table if not exists contacts (
  id text primary key,
  user_id text not null,
  name text not null,
  email text not null,
  phone text not null default '',
  company text not null default '',
  group_name text not null default '',
  role text not null default 'signer',
  created_at timestamptz not null default now()
);
create index if not exists contacts_user_idx on contacts (user_id);

create table if not exists contact_groups (
  id text primary key,
  user_id text not null,
  name text not null,
  description text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists approvals (
  id text primary key,
  user_id text not null,
  document_id text,
  name text not null,
  layer integer not null default 1,
  mode text not null default 'all',
  approver_name text not null,
  approver_email text not null,
  status text not null default 'pending',
  decided_at timestamptz,
  note text not null default ''
);
create index if not exists approvals_user_idx on approvals (user_id);

create table if not exists approval_templates (
  id text primary key,
  user_id text not null,
  name text not null,
  layers_json text not null default '[]',
  created_at timestamptz not null default now()
);

create table if not exists audit_events (
  id text primary key,
  user_id text not null,
  document_id text not null,
  actor text not null,
  action text not null,
  ip text not null default '103.124.18.44',
  meta text not null default '{}',
  created_at timestamptz not null default now()
);
create index if not exists audit_doc_idx on audit_events (document_id);

create table if not exists notifications (
  id text primary key,
  user_id text not null,
  title text not null,
  body text not null,
  href text not null default '/esignature/all-inbox',
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists notifications_user_idx on notifications (user_id);

create table if not exists emeterai_orders (
  id text primary key,
  user_id text not null,
  qty integer not null,
  amount integer not null,
  status text not null default 'paid',
  created_at timestamptz not null default now()
);

create table if not exists signing_proofs (
  id text primary key,
  user_id text not null,
  title text not null,
  media_url text not null default '',
  notary text not null default '',
  witness text not null default '',
  notes text not null default '',
  created_at timestamptz not null default now()
);
