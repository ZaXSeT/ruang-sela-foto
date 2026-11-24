import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import type { Sql } from 'postgres';

const MIGRATIONS_DIR = resolve('db/migrations');

/** Menerapkan migrasi SQL berurutan. Aman dijalankan ulang; setiap file hanya diterapkan sekali. */
export async function migrate(sql: Sql, log: (m: string) => void = console.log): Promise<string[]> {
	const applied: string[] = [];
	await sql.begin(async (tx) => {
		// Kunci advisory mencegah dua proses migrasi berjalan bersamaan.
		await tx`select pg_advisory_xact_lock(4021003)`;
		// Catatan migrasi ikut di schema privat agar tidak terekspos Data API Supabase.
		// Cek dulu: `create schema if not exists` tetap butuh izin CREATE pada database,
		// sedangkan role aplikasi di Supabase hanya memiliki schema-nya sendiri.
		const [{ ada }] = await tx<{ ada: boolean }[]>`select exists (select 1 from pg_namespace where nspname = ${'foto'}) as ada`;
		if (!ada) await tx`create schema foto`;
		await tx`create table if not exists foto.schema_migrations (
			name text primary key,
			applied_at timestamptz not null default now()
		)`;
		const done = new Set(
			(await tx<{ name: string }[]>`select name from foto.schema_migrations`).map((r) => r.name)
		);
		const files = readdirSync(MIGRATIONS_DIR)
			.filter((f) => f.endsWith('.sql'))
			.sort();
		for (const file of files) {
			if (done.has(file)) continue;
			await tx.unsafe(readFileSync(resolve(MIGRATIONS_DIR, file), 'utf8'));
			await tx`insert into foto.schema_migrations (name) values (${file})`;
			applied.push(file);
			log(`  diterapkan: ${file}`);
		}
	});
	return applied;
}
