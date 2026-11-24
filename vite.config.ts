import vercel from '@sveltejs/adapter-vercel';
import node from '@sveltejs/adapter-node';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			// Default: Vercel (runtime Node.js, region Singapura).
			// `vite build --mode node` hanya untuk pratinjau produksi lokal (npm run build:local).
			adapter:
				mode === 'node'
					? node({ out: 'build' })
					: vercel({ runtime: 'nodejs22.x', regions: ['sin1'] })
		})
	]
}));
