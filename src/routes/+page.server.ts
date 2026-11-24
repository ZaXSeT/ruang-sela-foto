import { db } from '#lib/server/db.ts';
import { listPackages } from '#lib/server/inquiries.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	// Hanya data paket publik; tidak ada data pertanyaan di halaman ini.
	return { packages: await listPackages(db()) };
};
