/** Data studio dan katalog paket contoh. Saat runtime, paket dibaca dari tabel foto.packages. */

export const STUDIO = {
	name: 'Ruang Sela Foto',
	city: 'Bandung',
	contact: 'Pertanyaan dibalas lewat email dalam 1–2 hari kerja.'
} as const;

export const SEED_PACKAGES = [
	{
		id: 'pasangan',
		name: 'Pasangan',
		price_idr: 850_000,
		duration_min: 60,
		photos: 25,
		delivery_days: 7,
		summary: 'Untuk dua orang: kencan pagi, ulang tahun pernikahan, atau hari biasa yang ingin diingat.',
		active: true,
		sort_order: 1
	},
	{
		id: 'keluarga',
		name: 'Keluarga',
		price_idr: 1_200_000,
		duration_min: 90,
		photos: 40,
		delivery_days: 7,
		summary: 'Untuk keluarga di rumah sendiri atau tempat favorit, termasuk anak kecil dan hewan peliharaan.',
		active: true,
		sort_order: 2
	},
	{
		// Contoh paket nonaktif: tidak tampil di situs dan ditolak server.
		id: 'prewedding-luar-kota',
		name: 'Prewedding luar kota',
		price_idr: 3_500_000,
		duration_min: 240,
		photos: 80,
		delivery_days: 14,
		summary: 'Sedang tidak dibuka.',
		active: false,
		sort_order: 9
	}
] as const;

export function rupiah(n: number): string {
	return 'Rp' + n.toLocaleString('id-ID').replace(/,/g, '.');
}
