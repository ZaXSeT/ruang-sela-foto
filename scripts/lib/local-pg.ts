/**
 * Postgres lokal tertanam (embedded-postgres) untuk pengembangan dan tes.
 * Tidak dipakai di Vercel. Produksi memakai Supabase Postgres lewat DATABASE_URL.
 */
import EmbeddedPostgres from 'embedded-postgres';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import postgres from 'postgres';

export const LOCAL_PG = {
	port: 55403,
	user: 'postgres',
	password: 'postgres-lokal',
	dataDir: resolve('.data/pg'),
	devDb: 'ruang_sela_foto',
	testDb: 'ruang_sela_foto_test'
} as const;

export function localUrl(db: string): string {
	return `postgres://${LOCAL_PG.user}:${LOCAL_PG.password}@127.0.0.1:${LOCAL_PG.port}/${db}`;
}

export async function canConnect(url: string): Promise<boolean> {
	const sql = postgres(url, { max: 1, connect_timeout: 2, onnotice: () => {} });
	try {
		await sql`select 1`;
		return true;
	} catch {
		return false;
	} finally {
		await sql.end({ timeout: 1 });
	}
}

export async function startLocalPostgres(log = false): Promise<EmbeddedPostgres> {
	const pg = new EmbeddedPostgres({
		databaseDir: LOCAL_PG.dataDir,
		port: LOCAL_PG.port,
		user: LOCAL_PG.user,
		password: LOCAL_PG.password,
		persistent: true,
		initdbFlags: ['--encoding=UTF8', '--locale=C'],
		onLog: log ? (m) => console.log(m) : () => {},
		onError: (e) => console.error(e)
	});
	if (!existsSync(resolve(LOCAL_PG.dataDir, 'PG_VERSION'))) {
		await pg.initialise();
	}
	await pg.start();
	await ensureDatabase(LOCAL_PG.devDb);
	await ensureDatabase(LOCAL_PG.testDb);
	return pg;
}

async function ensureDatabase(name: string) {
	const admin = postgres(localUrl('postgres'), { max: 1, onnotice: () => {} });
	try {
		const rows = await admin`select 1 from pg_database where datname = ${name}`;
		if (rows.length === 0) await admin.unsafe(`create database "${name}"`);
	} finally {
		await admin.end({ timeout: 1 });
	}
}
