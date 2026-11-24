import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	DATABASE_URL: {
		description:
			'Koneksi Postgres. Di Vercel: Supabase transaction pooler (port 6543). Lokal: lihat .env.example.',
		// Opsional saat build; db() memberi pesan jelas bila kosong ketika dipakai.
		schema: (value) => value || undefined
	}
});
