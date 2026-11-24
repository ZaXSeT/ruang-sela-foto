import { fail } from '@sveltejs/kit';
import { db } from '#lib/server/db.ts';
import { createInquiry, listPackages } from '#lib/server/inquiries.ts';
import { hitRateLimit } from '#lib/server/rate-limit.ts';
import { logError } from '#lib/server/log.ts';
import { sessionRange } from '#lib/dates.ts';
import { STORIES } from '#lib/stories.ts';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const packages = await listPackages(db());
	const asked = url.searchParams.get('paket');
	const from = url.searchParams.get('dari');
	const story = STORIES.find((s) => s.slug === from);
	return {
		packages,
		selected: packages.some((p) => p.id === asked) ? asked : null,
		from: story ? { slug: story.slug, title: story.title } : null,
		range: sessionRange(new Date())
	};
};

function text(form: FormData, key: string, max: number): string {
	const v = form.get(key);
	return typeof v === 'string' ? v.slice(0, max) : '';
}

export const actions: Actions = {
	default: async ({ request, getClientAddress }) => {
		const form = await request.formData();
		const values = {
			packageId: text(form, 'packageId', 40),
			date: text(form, 'date', 10),
			name: text(form, 'name', 80),
			email: text(form, 'email', 300),
			note: text(form, 'note', 600)
		};
		const sql = db();
		try {
			const limit = await hitRateLimit(sql, { action: 'tanya', client: getClientAddress(), limit: 8, windowSec: 600 });
			if (!limit.allowed) {
				return fail(429, {
					values,
					message: `Terlalu banyak pertanyaan dari perangkat ini. Coba lagi dalam ${Math.ceil(limit.retryAfterSec / 60)} menit.`
				});
			}
			const result = await createInquiry(sql, values);
			if (!result.ok) return fail(400, { values, errors: result.errors });
			// Hanya paket, tanggal, dan status yang dikirim balik. Kontak tidak pernah dikembalikan.
			return { inquiry: result.inquiry };
		} catch (e) {
			logError('tanya', e);
			return fail(503, {
				values,
				message: 'Pertanyaan belum tersimpan karena server bermasalah. Isian masih ada; coba kirim lagi.'
			});
		}
	}
};
