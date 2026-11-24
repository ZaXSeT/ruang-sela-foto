import postgres from 'postgres';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { createInquiry, listPackages, ownerInquiries } from '../src/lib/server/inquiries';
import { hitRateLimit } from '../src/lib/server/rate-limit';
import { seed } from '../scripts/lib/seed-core';
import { migrate } from '../scripts/lib/migrate-core';
import { STORIES } from '../src/lib/stories';

const sql = postgres(process.env.TEST_DATABASE_URL!, { max: 3, onnotice: () => {} });

// "Sekarang": Selasa 24 November 2026, 23.30 WIB (sudah tanggal 24 di Jakarta, masih 16.30 UTC).
const NOW = new Date('2026-11-24T16:30:00Z');
const contoh = { name: 'Laras', email: 'laras@contoh.id', note: 'Sesi pagi, kalau bisa sebelum jam 9.' };

async function count() {
	const [{ n }] = await sql<{ n: number }[]>`select count(*)::int as n from foto.inquiries`;
	return n;
}

beforeEach(async () => {
	await sql`truncate foto.inquiries, foto.rate_limits`;
	await seed(sql);
});

afterAll(async () => {
	await sql.end();
});

describe('F1 · dari cerita pasangan ke pertanyaan', () => {
	it('cerita pasangan mengarah ke paket Pasangan yang aktif', async () => {
		const story = STORIES.find((s) => s.slug === 'dua-cangkir')!;
		const pkgs = await listPackages(sql);
		expect(pkgs.map((p) => p.id)).toEqual(['pasangan', 'keluarga']);
		expect(pkgs.find((p) => p.id === story.packageId)).toMatchObject({ price_idr: 850_000, duration_min: 60, photos: 25 });
	});

	it('menyimpan satu pertanyaan dengan status Menunggu balasan', async () => {
		const res = await createInquiry(sql, { packageId: 'pasangan', date: '2026-12-12', ...contoh }, NOW);
		expect(res).toEqual({ ok: true, inquiry: { packageName: 'Pasangan', date: '2026-12-12', status: 'menunggu_balasan' } });
		const rows = await ownerInquiries(sql);
		expect(rows).toHaveLength(1);
		expect(rows[0]).toMatchObject({ package_name: 'Pasangan', session_date: '2026-12-12', email: 'laras@contoh.id', status: 'menunggu_balasan' });
	});

	it('tanggal sesi tetap tanggal lokal saat dibaca ulang, apa pun zona waktu koneksi', async () => {
		await createInquiry(sql, { packageId: 'keluarga', date: '2026-11-25', ...contoh }, NOW);
		await sql`set time zone 'America/Los_Angeles'`;
		const [row] = await ownerInquiries(sql);
		await sql`set time zone 'UTC'`;
		expect(row.session_date).toBe('2026-11-25');
	});

	it('email dinormalkan ke huruf kecil dan catatan kosong disimpan sebagai null', async () => {
		await createInquiry(sql, { packageId: 'pasangan', date: '2026-12-12', name: 'Laras', email: ' Laras@Contoh.ID ', note: '   ' }, NOW);
		const [row] = await ownerInquiries(sql);
		expect(row).toMatchObject({ email: 'laras@contoh.id', note: null });
	});
});

describe('F2 · dua calon klien menanyakan tanggal yang sama', () => {
	it('keduanya tersimpan terpisah dan tanggal tetap bisa ditanyakan', async () => {
		const a = await createInquiry(sql, { packageId: 'pasangan', date: '2026-12-12', ...contoh }, NOW);
		const b = await createInquiry(sql, { packageId: 'keluarga', date: '2026-12-12', name: 'Bima', email: 'bima@contoh.id' }, NOW);
		const c = await createInquiry(sql, { packageId: 'pasangan', date: '2026-12-12', name: 'Sekar', email: 'sekar@contoh.id' }, NOW);
		for (const r of [a, b, c]) expect(r.ok && r.inquiry.status).toBe('menunggu_balasan');
		const rows = await ownerInquiries(sql, { date: '2026-12-12' });
		expect(rows.map((r) => r.name)).toEqual(['Laras', 'Bima', 'Sekar']);
		expect(new Set(rows.map((r) => r.id)).size).toBe(3);
	});
});

describe('F3 · input tidak sah', () => {
	const cases: [string, Record<string, unknown>, string][] = [
		['tanggal lampau', { packageId: 'pasangan', date: '2026-11-20', ...contoh }, 'date'],
		['tanggal hari ini (WIB)', { packageId: 'pasangan', date: '2026-11-24', ...contoh }, 'date'],
		['tanggal tidak ada', { packageId: 'pasangan', date: '2026-02-30', ...contoh }, 'date'],
		['tanggal lebih dari setahun', { packageId: 'pasangan', date: '2027-12-01', ...contoh }, 'date'],
		['paket nonaktif', { packageId: 'prewedding-luar-kota', date: '2026-12-12', ...contoh }, 'packageId'],
		['paket tak dikenal', { packageId: 'gratis', date: '2026-12-12', ...contoh }, 'packageId'],
		['email salah format', { packageId: 'pasangan', date: '2026-12-12', ...contoh, email: 'laras@' }, 'email'],
		['nama kosong', { packageId: 'pasangan', date: '2026-12-12', ...contoh, name: ' ' }, 'name'],
		['catatan terlalu panjang', { packageId: 'pasangan', date: '2026-12-12', ...contoh, note: 'x'.repeat(501) }, 'note']
	];
	for (const [label, input, field] of cases) {
		it(`menolak ${label} pada field ${field}`, async () => {
			const res = await createInquiry(sql, input, NOW);
			expect(res.ok).toBe(false);
			if (!res.ok) expect(Object.keys(res.errors)).toEqual([field]);
			expect(await count()).toBe(0);
		});
	}

	it('beberapa kesalahan dilaporkan sekaligus', async () => {
		const res = await createInquiry(sql, { packageId: 'gratis', date: '2026-01-01', name: 'Laras', email: 'x' }, NOW);
		expect(res.ok === false && Object.keys(res.errors).sort()).toEqual(['date', 'email', 'packageId']);
		expect(await count()).toBe(0);
	});

	it('besok (WIB) sudah boleh walau di UTC masih tanggal yang sama', async () => {
		const res = await createInquiry(sql, { packageId: 'pasangan', date: '2026-11-25', ...contoh }, NOW);
		expect(res.ok).toBe(true);
	});
});

describe('F4 · data publik tidak memuat data pengirim lain', () => {
	it('daftar paket publik tidak membawa pertanyaan, kontak, atau catatan', async () => {
		await createInquiry(sql, { packageId: 'pasangan', date: '2026-12-12', ...contoh }, NOW);
		const pub = JSON.stringify(await listPackages(sql));
		expect(pub).not.toMatch(/laras|contoh\.id|Sesi pagi/i);
	});

	it('balasan simpan hanya berisi paket, tanggal, dan status', async () => {
		const res = await createInquiry(sql, { packageId: 'pasangan', date: '2026-12-12', ...contoh }, NOW);
		expect(res.ok && Object.keys(res.inquiry).sort()).toEqual(['date', 'packageName', 'status']);
	});
});

describe('Inisialisasi dan pembatasan laju', () => {
	it('seed dan migrasi aman diulang tanpa menghapus pertanyaan', async () => {
		await createInquiry(sql, { packageId: 'pasangan', date: '2026-12-12', ...contoh }, NOW);
		await seed(sql);
		await seed(sql);
		expect(await migrate(sql, () => {})).toEqual([]);
		const [{ n }] = await sql<{ n: number }[]>`select count(*)::int as n from foto.packages`;
		expect(n).toBe(3);
		expect(await count()).toBe(1);
	});

	it('membatasi pengiriman per klien', async () => {
		const opts = { action: 'tanya', client: '192.0.2.44', limit: 2, windowSec: 600 };
		const hits = [];
		for (let i = 0; i < 3; i++) hits.push((await hitRateLimit(sql, opts)).allowed);
		expect(hits).toEqual([true, true, false]);
	});
});
