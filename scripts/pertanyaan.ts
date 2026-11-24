/**
 * Akses pemilik: daftar pertanyaan tanggal beserta kontak untuk dibalas.
 *   npm run pertanyaan                          → semua pertanyaan, urut tanggal sesi
 *   npm run pertanyaan -- --status menunggu     → hanya yang belum dibalas
 *   npm run pertanyaan -- --tanggal 2026-12-12  → satu tanggal sesi
 */
import postgres from 'postgres';
import { argValue, databaseUrl } from './lib/env';
import { ownerInquiries } from '../src/lib/server/inquiries';
import { isRealDate, longDate } from '../src/lib/dates';

const STATUS: Record<string, string> = {
	menunggu: 'menunggu_balasan',
	dibalas: 'dibalas',
	batal: 'batal'
};
const LABEL: Record<string, string> = {
	menunggu_balasan: 'Menunggu balasan',
	dibalas: 'Dibalas',
	batal: 'Batal'
};

const statusArg = argValue('status');
const date = argValue('tanggal');
if (statusArg && !STATUS[statusArg]) {
	console.error('Status: menunggu, dibalas, atau batal');
	process.exit(1);
}
if (date && !isRealDate(date)) {
	console.error('Format tanggal: --tanggal YYYY-MM-DD');
	process.exit(1);
}

const sql = postgres(databaseUrl(), { max: 1, prepare: false, onnotice: () => {} });
try {
	const rows = await ownerInquiries(sql, { status: statusArg ? STATUS[statusArg] : undefined, date });
	console.log(`\nRuang Sela Foto · ${rows.length} pertanyaan`);
	console.log('─'.repeat(64));
	for (const r of rows) {
		console.log(`${longDate(r.session_date)}  ·  ${r.package_name}  ·  ${LABEL[r.status] ?? r.status}`);
		console.log(`   ${r.name} <${r.email}>`);
		if (r.note) console.log(`   "${r.note}"`);
		console.log(`   masuk ${r.created_at.toISOString().slice(0, 16).replace('T', ' ')} UTC`);
	}
	if (rows.length === 0) console.log('Belum ada pertanyaan.');
	console.log('─'.repeat(64) + '\n');
} finally {
	await sql.end();
}
