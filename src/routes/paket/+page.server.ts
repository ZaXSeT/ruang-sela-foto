import { db } from '#lib/server/db.ts';
import { listPackages } from '#lib/server/inquiries.ts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	return { packages: await listPackages(db()) };
};
