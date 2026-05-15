
-- Profiles table
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  wallet_address text unique,
  role text check (role in ('supplier','buyer')),
  display_name text,
  company text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by authenticated users"
  on public.profiles for select to authenticated using (true);

create policy "Users can insert their own profile"
  on public.profiles for insert to authenticated with check (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.profiles for update to authenticated using (auth.uid() = user_id);

-- Deals table
create table public.deals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  commodity text,
  amount numeric not null default 0,
  currency text not null default 'USDC',
  origin text,
  destination text,
  counterparty text,
  status text not null default 'draft',
  milestones jsonb not null default '[]'::jsonb,
  documents jsonb not null default '[]'::jsonb,
  trustless_contract_id text,
  risk_score integer default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.deals enable row level security;

create policy "Users can view their own deals"
  on public.deals for select to authenticated using (auth.uid() = user_id);

create policy "Users can create their own deals"
  on public.deals for insert to authenticated with check (auth.uid() = user_id);

create policy "Users can update their own deals"
  on public.deals for update to authenticated using (auth.uid() = user_id);

create policy "Users can delete their own deals"
  on public.deals for delete to authenticated using (auth.uid() = user_id);

create index deals_user_id_idx on public.deals(user_id);

-- Updated_at trigger
create or replace function public.update_updated_at_column()
returns trigger language plpgsql set search_path = public as $$
begin new.updated_at = now(); return new; end; $$;

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.update_updated_at_column();
create trigger deals_updated_at before update on public.deals
  for each row execute function public.update_updated_at_column();

-- Auto-create profile on signup, lifting wallet metadata if present
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, wallet_address, role, display_name)
  values (
    new.id,
    new.raw_user_meta_data ->> 'wallet_address',
    new.raw_user_meta_data ->> 'role',
    new.raw_user_meta_data ->> 'display_name'
  )
  on conflict (user_id) do nothing;
  return new;
end; $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
