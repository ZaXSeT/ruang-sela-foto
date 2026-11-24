/**
 * npm run images — mengubah foto sumber (assets-src/raw) menjadi WebP dua ukuran di static/foto.
 * Rasio asli dipertahankan; pemotongan dilakukan di CSS memakai titik fokus per foto (src/lib/stories.ts).
 */
import sharp from 'sharp';
import { mkdirSync, readdirSync } from 'node:fs';

mkdirSync('static/foto', { recursive: true });

for (const file of readdirSync('assets-src/raw').filter((f) => f.endsWith('.jpg'))) {
	const id = file.replace('pexels-', '').replace('.jpg', '');
	const img = sharp(`assets-src/raw/${file}`);
	const { width = 0, height = 0 } = await img.metadata();
	const landscape = width > height;
	const sizes = landscape ? [800, 1600] : [640, 1200];
	for (const w of sizes) {
		const info = await sharp(`assets-src/raw/${file}`)
			.resize({ width: w })
			.webp({ quality: w > 1000 ? 72 : 70, effort: 6 })
			.toFile(`static/foto/${id}-${w}.webp`);
		console.log(`${id}-${w}.webp ${info.width}×${info.height} ${(info.size / 1024).toFixed(0)} KB`);
	}
}
