-- Create tasks table
create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text,
  type text not null,
  category text not null,
  difficulty text not null,
  xp_value integer not null,
  completed boolean default false,
  due_date date,
  completed_date timestamptz,
  streak_count integer default 0,
  repeat_days jsonb,
  remind_time text,
  tags jsonb,
  sub_tasks jsonb,
  inserted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Create quests table
create table if not exists quests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text not null,
  description text,
  category text not null,
  difficulty text not null,
  status text not null,
  progress integer not null default 0,
  xp_reward integer not null,
  item_reward text,
  start_date date not null,
  end_date date,
  steps jsonb not null,
  completed boolean default false,
  inserted_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

