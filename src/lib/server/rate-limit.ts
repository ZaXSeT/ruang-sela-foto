import type { Sql } from 'postgres';
import { createHash } from 'node:crypto';

/**
 * Pembatasan laju berbasis database agar berlaku lintas instance serverless.
 * Satu upsert atomik: jendela lama direset, jendela aktif ditambah satu.
 * Alamat IP disimpan sebagai hash, bukan teks asli.
 */
export async function hitRateLimit(
	sql: Sql,
	opts: { action: string; client: string; limit: number; windowSec: number }
): Promise<{ allowed: boolean; retryAfterSec: number }> {
	const key = `${opts.action}:${createHash('sha256').update(opts.client).digest('hex').slice(0, 32)}`;
	const [row] = await sql<{ hits: number; window_start: Date }[]>`
		insert into foto.rate_limits as r (key, window_start, hits)
		values (${key}, now(), 1)
		on conflict (key) do update set
			hits = case when r.window_start < now() - make_interval(secs => ${opts.windowSec}) then 1 else r.hits + 1 end,
			window_start = case when r.window_start < now() - make_interval(secs => ${opts.windowSec}) then now() else r.window_start end
		returning hits, window_start`;

	// Bersihkan baris kedaluwarsa sesekali, tanpa memperlambat setiap permintaan.
	if (Math.random() < 0.02) {
		await sql`delete from foto.rate_limits where window_start < now() - interval '1 day'`;
	}

	const allowed = row.hits <= opts.limit;
	const elapsed = (Date.now() - row.window_start.getTime()) / 1000;
	return { allowed, retryAfterSec: Math.max(1, Math.ceil(opts.windowSec - elapsed)) };
}
