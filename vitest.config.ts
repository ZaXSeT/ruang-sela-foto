import { defineConfig } from 'vitest/config';

// Tes aturan bisnis berjalan langsung terhadap Postgres tes (bukan mock).
// Modul di src/lib/server sengaja memakai import relatif agar bisa diuji tanpa plugin SvelteKit.
export default defineConfig({
	test: {
		include: ['tests/**/*.test.ts'],
		globalSetup: ['tests/global-setup.ts'],
		fileParallelism: false,
		testTimeout: 30_000,
		hookTimeout: 180_000
	}
});
