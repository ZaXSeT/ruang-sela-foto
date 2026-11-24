-- Ruang Sela Foto · skema awal
-- Schema privat "foto": tidak diekspos Data API Supabase, hanya diakses fungsi server.

-- Di Supabase, schema sudah dibuat dan dimiliki role aplikasi; buat hanya bila belum ada.
do $$
begin
	if not exists (select 1 from pg_namespace where nspname = 'foto') then
		create schema foto;
	end if;
end
$$;

-- Daftar paket tepercaya. Harga dan detail dibaca dari sini, bukan dari browser.
create table foto.packages (
	id text primary key check (id ~ '^[a-z0-9-]{1,40}$'),
	name text not null,
	price_idr integer not null check (price_idr > 0),
	duration_min integer not null check (duration_min > 0),
	photos integer not null check (photos > 0),
	delivery_days integer not null check (delivery_days > 0),
	summary text not null,
	active boolean not null default true,
	sort_order integer not null default 0
);

create table foto.inquiries (
	id uuid primary key default gen_random_uuid(),
	package_id text not null references foto.packages (id),
	-- Tanggal kalender lokal (Asia/Jakarta) tanpa jam: tidak bergeser karena zona waktu.
	session_date date not null,
	name text not null check (char_length(name) between 2 and 60),
	email text not null check (char_length(email) between 6 and 254),
	note text check (note is null or char_length(note) <= 500),
	status text not null default 'menunggu_balasan'
		check (status in ('menunggu_balasan', 'dibalas', 'batal')),
	created_at timestamptz not null default now()
);

-- Tidak ada constraint unik pada tanggal: beberapa calon klien boleh menanyakan tanggal yang sama.
create index inquiries_created_idx on foto.inquiries (created_at desc);
create index inquiries_session_date_idx on foto.inquiries (session_date);

create table foto.rate_limits (
	key text primary key,
	window_start timestamptz not null,
	hits integer not null
);

do $$
begin
	if exists (select 1 from pg_roles where rolname = 'anon') then
		execute 'revoke all on schema foto from anon';
		execute 'revoke all on all tables in schema foto from anon';
	end if;
	if exists (select 1 from pg_roles where rolname = 'authenticated') then
		execute 'revoke all on schema foto from authenticated';
		execute 'revoke all on all tables in schema foto from authenticated';
	end if;
end
$$;
