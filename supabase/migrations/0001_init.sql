-- Outpost schema, reconstructed from application code after the original
-- Supabase project (ejusgyjfiyvcgzdmonew) was lost.

-- roles ---------------------------------------------------------------
create table public.roles (
	id uuid primary key default gen_random_uuid(),
	role_name text not null unique
);

-- IDs for Standard / Business Pro are hard-coded in src/routes/payment/webhook/+server.ts
insert into public.roles (id, role_name) values
	('5b0a2c5e-3f1d-4a6e-9c7b-1d2e3f4a5b6c', 'Free'),
	('e9fee1d7-17ff-4b62-81ec-1fa8ac7332ec', 'Standard'),
	('a0317245-b139-4589-9fb8-777b7dc4aaaf', 'Business Pro');

alter table public.roles enable row level security;

create policy "Authenticated users can read roles"
	on public.roles for select to authenticated using (true);

-- users ---------------------------------------------------------------
-- id is NOT a foreign key to auth.users: the checkout flow in
-- src/routes/+page.server.ts creates a row (by email) before the auth user
-- exists. handle_new_auth_user() links the row to auth.users on registration.
create table public.users (
	id uuid primary key default gen_random_uuid(),
	email text not null unique,
	stripe_customer_id text,
	role_id uuid not null default '5b0a2c5e-3f1d-4a6e-9c7b-1d2e3f4a5b6c' references public.roles (id),
	max_searches_per_month integer not null default 5,
	max_saved_searches integer not null default 2,
	current_searches_this_month integer not null default 0,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create index users_role_id_idx on public.users (role_id);

alter table public.users enable row level security;

-- Users may only read their own row. All writes go through the service role
-- (webhook, checkout) or the SECURITY DEFINER functions below, so users cannot
-- raise their own limits.
create policy "Users can read own row"
	on public.users for select to authenticated using ((select auth.uid()) = id);

-- saved_searches --------------------------------------------------------
create table public.saved_searches (
	id uuid primary key default gen_random_uuid(),
	user_id uuid not null references public.users (id) on delete cascade on update cascade,
	search_data jsonb not null,
	created_at timestamptz not null default now()
);

create index saved_searches_user_id_idx on public.saved_searches (user_id);

alter table public.saved_searches enable row level security;

create policy "Users can read own saved searches"
	on public.saved_searches for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can insert own saved searches"
	on public.saved_searches for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users can delete own saved searches"
	on public.saved_searches for delete to authenticated using ((select auth.uid()) = user_id);

-- auth.users -> public.users -------------------------------------------
create function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
	insert into public.users (id, email)
	values (new.id, new.email)
	on conflict (email) do update
		set id = excluded.id, updated_at = now();
	return new;
end;
$$;

revoke execute on function public.handle_new_auth_user() from public, anon, authenticated;

create trigger on_auth_user_created
	after insert on auth.users
	for each row execute function public.handle_new_auth_user();

-- RPC used by src/routes/dashboard/search/+page.svelte ---------------------
create function public.increment_search_count(user_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
	if (select auth.uid()) is distinct from user_id then
		raise exception 'not authorized';
	end if;

	update public.users
	set current_searches_this_month = current_searches_this_month + 1,
		updated_at = now()
	where id = user_id;
end;
$$;

revoke execute on function public.increment_search_count(uuid) from public, anon;
grant execute on function public.increment_search_count(uuid) to authenticated;
