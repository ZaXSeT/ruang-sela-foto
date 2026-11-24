import { error } from '@sveltejs/kit';
import { dev } from '$app/env';
import type { PageServerLoad } from './$types';

// Kanvas 1200×630 untuk membuat static/og.jpg (lihat README). Hanya tersedia saat dev.
export const load: PageServerLoad = async () => {
	if (!dev) error(404, 'Tidak ditemukan');
	return {};
};
