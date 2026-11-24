/**
 * Pertanyaan tanggal untuk fotografer. Semua fungsi menerima koneksi `sql` agar bisa diuji ke database tes.
 * Tanggal sesi disimpan sebagai `date` (tanggal lokal) dan selalu dibaca sebagai teks YYYY-MM-DD,
 * sehingga tidak pernah bergeser karena zona waktu server.
 */
import type { Sql } from 'postgres';
import { z } from 'zod';
import { isRealDate, sessionRange } from '../dates';

export type Package = {
	id: string;
	name: string;
	price_idr: number;
	duration_min: number;
	photos: number;
	delivery_days: number;
	summary: string;
};

export async function listPackages(sql: Sql): Promise<Package[]> {
	return sql<Package[]>`
		select id, name, price_idr, duration_min, photos, delivery_days, summary
		from foto.packages where active order by sort_order, id`;
}

export type InquiryFieldErrors = Partial<Record<'packageId' | 'date' | 'name' | 'email' | 'note', string>>;

export type InquiryReceipt = { packageName: string; date: string; status: 'menunggu_balasan' };

export type CreateInquiryResult =
	| { ok: true; inquiry: InquiryReceipt }
	| { ok: false; errors: InquiryFieldErrors };

function schema(now: Date) {
	const { min, max } = sessionRange(now);
	return z.object({
		packageId: z.string({ error: 'Pilih paket.' }).regex(/^[a-z0-9-]{1,40}$/, { error: 'Pilih paket dari daftar.' }),
		date: z
			.string({ error: 'Pilih tanggal sesi.' })
			.refine(isRealDate, { error: 'Pilih tanggal yang ada di kalender.' })
			.refine((d) => d >= min, { error: 'Tanggal sudah lewat. Pilih mulai besok.' })
			.refine((d) => d <= max, { error: 'Tanggal paling jauh satu tahun dari hari ini.' }),
		name: z
			.string({ error: 'Isi nama.' })
			.trim()
			.min(2, { error: 'Nama minimal 2 huruf.' })
			.max(60, { error: 'Nama maksimal 60 karakter.' })
			.regex(/^[\p{L}\p{M} .'-]+$/u, { error: 'Gunakan huruf, spasi, titik, atau tanda hubung.' }),
		email: z
			.string({ error: 'Isi alamat email.' })
			.trim()
			.toLowerCase()
			.max(254, { error: 'Alamat email terlalu panjang.' })
			.pipe(z.email({ error: 'Tulis email seperti nama@contoh.com.' })),
		note: z
			.string()
			.trim()
			.max(500, { error: 'Catatan maksimal 500 karakter.' })
			.optional()
			.transform((v) => (v ? v : null))
	});
}

export async function createInquiry(sql: Sql, raw: Record<string, unknown>, now: Date = new Date()): Promise<CreateInquiryResult> {
	const parsed = schema(now).safeParse(raw);
	const errors: InquiryFieldErrors = {};
	if (!parsed.success) {
		for (const issue of parsed.error.issues) {
			const key = issue.path[0] as keyof InquiryFieldErrors;
			if (key && !errors[key]) errors[key] = issue.message;
		}
	}
	// Paket diperiksa ke daftar tepercaya di server, juga saat field lain salah, agar semua pesan tampil sekaligus.
	const packageId = typeof raw.packageId === 'string' ? raw.packageId : '';
	const [pkg] = /^[a-z0-9-]{1,40}$/.test(packageId)
		? await sql<{ id: string; name: string }[]>`select id, name from foto.packages where id = ${packageId} and active`
		: [];
	if (!pkg && !errors.packageId) errors.packageId = 'Paket itu sedang tidak tersedia. Pilih Pasangan atau Keluarga.';
	if (!parsed.success || !pkg) return { ok: false, errors };

	const v = parsed.data;
	const [row] = await sql<{ session_date: string; status: 'menunggu_balasan' }[]>`
		insert into foto.inquiries (package_id, session_date, name, email, note)
		values (${pkg.id}, ${v.date}::date, ${v.name}, ${v.email}, ${v.note})
		returning session_date::text as session_date, status`;
	return { ok: true, inquiry: { packageName: pkg.name, date: row.session_date, status: row.status } };
}

/** Untuk CLI pemilik: berisi kontak, tidak pernah dipakai di halaman publik. */
export async function ownerInquiries(sql: Sql, opts: { status?: string; date?: string } = {}) {
	return sql<
		{
			id: string;
			package_name: string;
			session_date: string;
			name: string;
			email: string;
			note: string | null;
			status: string;
			created_at: Date;
		}[]
	>`
		select i.id, p.name as package_name, i.session_date::text as session_date, i.name, i.email, i.note, i.status, i.created_at
		from foto.inquiries i join foto.packages p on p.id = i.package_id
		where (${opts.status ?? null}::text is null or i.status = ${opts.status ?? null})
		  and (${opts.date ?? null}::date is null or i.session_date = ${opts.date ?? null}::date)
		order by i.session_date, i.created_at`;
}
