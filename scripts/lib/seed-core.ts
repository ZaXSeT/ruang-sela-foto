import type { Sql } from 'postgres';
import { SEED_PACKAGES } from '../../src/lib/studio';

/** Seed paket dengan ID stabil. Aman diulang; tidak menyentuh pertanyaan klien. */
export async function seed(sql: Sql): Promise<number> {
	await sql.begin(async (tx) => {
		for (const p of SEED_PACKAGES) {
			await tx`
				insert into foto.packages (id, name, price_idr, duration_min, photos, delivery_days, summary, active, sort_order)
				values (${p.id}, ${p.name}, ${p.price_idr}, ${p.duration_min}, ${p.photos}, ${p.delivery_days}, ${p.summary}, ${p.active}, ${p.sort_order})
				on conflict (id) do update set
					name = excluded.name,
					price_idr = excluded.price_idr,
					duration_min = excluded.duration_min,
					photos = excluded.photos,
					delivery_days = excluded.delivery_days,
					summary = excluded.summary,
					active = excluded.active,
					sort_order = excluded.sort_order`;
		}
	});
	return SEED_PACKAGES.length;
}
