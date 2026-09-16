-- Team, prefs, and profile extras so settings/actions persist.

create table if not exists team_members (
  id text primary key,
  user_id text not null,
  name text not null,
  email text not null,
  role text not null default 'Member',
  status text not null default 'invited',
  emeterai_assigned integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists team_members_user_idx on team_members (user_id);

create table if not exists workspace_prefs (
  user_id text primary key,
  profile_json text not null default '{}',
  prefs_json text not null default '{}',
  notif_json text not null default '{}',
  email_json text not null default '{}'
);
