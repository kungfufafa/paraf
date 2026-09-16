alter table recipients add column if not exists invite_token text;
create index if not exists recipients_invite_token_idx on recipients (invite_token);
