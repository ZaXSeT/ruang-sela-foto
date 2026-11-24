import postgres from 'postgres';
import { DATABASE_URL } from '$app/env/private';

let client: postgres.Sql | undefined;

/**
 * Koneksi Postgres untuk fungsi server.
 * Di Vercel, DATABASE_URL mengarah ke Supabase transaction pooler (port 6543):
 * prepared statement dimatikan dan pool kecil per instance.
 */
export function db(): postgres.Sql {
	if (!client) {
		const url = DATABASE_URL;
		if (!url) throw new Error('DATABASE_URL belum diatur');
		client = postgres(url, {
			prepare: false,
			max: 3,
			idle_timeout: 20,
			connect_timeout: 10,
			onnotice: () => {}
		});
	}
	return client;
}
