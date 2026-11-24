/**
 * Menyiapkan database tes terpisah (ruang_sela_foto_test).
 * - Jika TEST_DATABASE_URL diatur, pakai itu.
 * - Jika tidak, pakai Postgres lokal tertanam; dinyalakan otomatis bila belum berjalan.
 */
import postgres from 'postgres';
import type EmbeddedPostgres from 'embedded-postgres';
import { LOCAL_PG, canConnect, localUrl, startLocalPostgres } from '../scripts/lib/local-pg';
import { migrate } from '../scripts/lib/migrate-core';

let started: EmbeddedPostgres | undefined;

export async function setup() {
	let url = process.env.TEST_DATABASE_URL;
	if (!url) {
		url = localUrl(LOCAL_PG.testDb);
		if (!(await canConnect(localUrl('postgres')))) started = await startLocalPostgres();
	}
	process.env.TEST_DATABASE_URL = url;
	const sql = postgres(url, { max: 1, onnotice: () => {} });
	try {
		await migrate(sql, () => {});
	} finally {
		await sql.end();
	}
}

export async function teardown() {
	if (started) await started.stop();
}
