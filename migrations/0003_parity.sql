-- Mekari-parity columns (folders, schedule, trash, tags)

alter table documents add column if not exists scheduled_at timestamptz;
alter table documents add column if not exists deleted_at timestamptz;
alter table documents add column if not exists tags text not null default '';
alter table folders add column if not exists parent_id text;
