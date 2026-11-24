/** npm run db:seed — mengisi daftar paket. Aman dijalankan ulang. */
import postgres from 'postgres';
import { databaseUrl } from './lib/env';
import { seed } from './lib/seed-core';

const sql = postgres(databaseUrl(), { max: 1, prepare: false, onnotice: () => {} });
try {
	const n = await seed(sql);
	const [{ packages }] = await sql<{ packages: number }[]>`select count(*)::int as packages from foto.packages`;
	const [{ inquiries }] = await sql<{ inquiries: number }[]>`select count(*)::int as inquiries from foto.inquiries`;
	console.log(`Seed selesai: ${n} paket diperbarui. Total paket ${packages}, pertanyaan tersimpan ${inquiries}.`);
} finally {
	await sql.end();
}
