/**
 * Konten cerita foto (lokal, terstruktur). Nama orang dan lokasi fiktif; foto dari Pexels (lihat README).
 * Setiap foto punya titik fokus [x, y] (0–1) yang dipakai CSS object-position agar wajah tetap utuh
 * ketika foto dipotong ke rasio lain di HP.
 */

export type Photo = {
	id: string;
	/** Lebar dan tinggi versi terbesar (rasio asli). */
	w: number;
	h: number;
	alt: string;
	focus: [number, number];
};

export type Block =
	| { type: 'wide'; photo: Photo; caption?: string }
	| { type: 'tall'; photo: Photo; caption?: string }
	| { type: 'pair'; photos: [Photo, Photo]; caption?: string }
	| { type: 'note'; text: string };

export type Story = {
	slug: string;
	title: string;
	packageId: 'pasangan' | 'keluarga';
	meta: string;
	intro: string;
	cover: Photo;
	blocks: Block[];
	closing: string;
};

const L = (id: string, alt: string, focus: [number, number]): Photo => ({ id, w: 1600, h: 1066, alt, focus });
const P = (id: string, alt: string, focus: [number, number]): Photo => ({ id, w: 1200, h: 1800, alt, focus });

export function srcset(p: Photo): string {
	return p.w > p.h ? `/foto/${p.id}-800.webp 800w, /foto/${p.id}-1600.webp 1600w` : `/foto/${p.id}-640.webp 640w, /foto/${p.id}-1200.webp 1200w`;
}
export function src(p: Photo): string {
	return p.w > p.h ? `/foto/${p.id}-1600.webp` : `/foto/${p.id}-1200.webp`;
}
export function position(p: Photo): string {
	return `${Math.round(p.focus[0] * 100)}% ${Math.round(p.focus[1] * 100)}%`;
}

const kafe = L('8972572', 'Pasangan lansia duduk berdua di meja luar kafe berdinding bata merah', [0.55, 0.62]);
const payung = P('10429483', 'Pasangan berjalan di bawah satu payung di jalan setapak penuh daun basah', [0.52, 0.4]);
const ayunan = P('10429485', 'Pasangan duduk di ayunan kayu sambil saling memandang dan tertawa', [0.5, 0.3]);
const kasur = L('7220443', 'Ayah dan ibu mencium pipi anak perempuan mereka di atas kasur putih', [0.35, 0.45]);

export const STORIES: Story[] = [
	{
		slug: 'dua-cangkir',
		title: 'Dua cangkir sebelum kota bangun',
		packageId: 'pasangan',
		meta: 'Sesi pasangan · 60 menit · kafe langganan mereka',
		intro:
			'Ratna dan Hendra sudah 32 tahun menikah. Setiap Sabtu, sebelum jalanan ramai, mereka duduk di meja yang sama dan memesan minuman yang sama. Sesi ini mengikuti satu pagi itu, tanpa diatur.',
		cover: kafe,
		blocks: [
			{ type: 'wide', photo: kafe, caption: 'Pukul 06.40. Meja luar masih basah sisa siraman.' },
			{
				type: 'pair',
				photos: [
					P('8972566', 'Ratna tersenyum memegang cangkir kopi, Hendra duduk di sampingnya', [0.42, 0.25]),
					P('8972560', 'Dua tangan memegang cangkir cokelat berisi cappuccino', [0.45, 0.5])
				],
				caption: 'Ratna selalu cappuccino. Hendra selalu mencicipi punya Ratna dulu.'
			},
			{ type: 'note', text: 'Saya hanya meminta mereka mengobrol seperti biasa. Sisanya menunggu cahaya pindah ke meja.' },
			{ type: 'wide', photo: L('8972554', 'Ratna menyesap kopi sementara Hendra tertawa di depannya', [0.55, 0.4]) },
			{
				type: 'pair',
				photos: [
					L('8972571', 'Tangan menahan cangkir dengan latte art di atas meja besi hitam', [0.5, 0.5]),
					L('8972556', 'Tangan Ratna dan Hendra saling menggenggam di samping dua cangkir', [0.6, 0.45])
				]
			},
			{
				type: 'tall',
				photo: P('8972581', 'Hendra berdiri tertawa di depan pintu kafe, Ratna di sampingnya', [0.68, 0.22]),
				caption: 'Sebelum pulang, Hendra selalu menceritakan hal yang sama ke pemilik kafe.'
			}
		],
		closing: 'Dua puluh lima foto jadi, sebagian besar tanpa mereka melihat ke kamera.'
	},
	{
		slug: 'minggu-pagi-nara',
		title: 'Minggu pagi di rumah Nara',
		packageId: 'keluarga',
		meta: 'Sesi keluarga · 90 menit · di rumah',
		intro:
			'Nara berumur tiga tahun dan tidak suka difoto. Jadi kami tidak memotret Nara. Kami memotret sarapan hari Minggu, dan Nara datang sendiri ke dalam bingkai.',
		cover: kasur,
		blocks: [
			{ type: 'wide', photo: kasur, caption: 'Pukul 07.15. Belum ada yang mau turun dari kasur.' },
			{
				type: 'pair',
				photos: [
					P('7220436', 'Croissant, blueberry, dan apel merah di atas talenan kayu', [0.4, 0.4]),
					P('7220442', 'Nara menatap kamera sambil memegang potongan croissant', [0.5, 0.25])
				],
				caption: 'Croissant dari toko roti ujung gang. Nara hanya makan bagian yang renyah.'
			},
			{
				type: 'pair',
				photos: [
					P('7220458', 'Ayah dan ibu tertawa di sofa dengan sarapan di meja rendah', [0.52, 0.42]),
					P('7220448', 'Ayah dan ibu memeluk Nara erat di atas kasur', [0.5, 0.3])
				]
			},
			{ type: 'note', text: 'Sesi di rumah berarti tidak ada yang perlu dirapikan. Cahaya jendela kamar sudah cukup.' },
			{
				type: 'wide',
				photo: L('7220468', 'Ayah mengangkat Nara tinggi-tinggi sementara ibu tertawa', [0.5, 0.35]),
				caption: 'Bagian favorit Nara: diangkat setinggi lampu.'
			}
		],
		closing: 'Empat puluh foto jadi, termasuk beberapa yang membuat Nara tertawa saat melihatnya lagi.'
	},
	{
		slug: 'jalan-pulang',
		title: 'Jalan pulang setelah hujan',
		packageId: 'pasangan',
		meta: 'Sesi pasangan · 60 menit · taman kota',
		intro:
			'Rencananya sesi di taman jam empat sore. Hujan turun jam tiga dan tidak benar-benar berhenti. Jadi kami tetap berjalan pelan di jalur yang basah, dengan satu payung untuk berdua.',
		cover: ayunan,
		blocks: [
			{ type: 'tall', photo: payung, caption: 'Daun basah membuat jalur ini berwarna lebih tua dari biasanya.' },
			{ type: 'wide', photo: L('10429484', 'Pasangan berdiri dekat dengan mata terpejam', [0.5, 0.35]) },
			{
				type: 'pair',
				photos: [
					ayunan,
					P('10429486', 'Pelukan erat, wajah perempuan bersandar di bahu laki-laki', [0.62, 0.3])
				],
				caption: 'Ayunan di ujung taman masih menetes. Mereka tetap duduk.'
			}
		],
		closing: 'Gerimis membuat sesi ini lebih pelan dari rencana. Hasilnya juga lebih tenang.'
	}
];

export function storyBySlug(slug: string): Story | undefined {
	return STORIES.find((s) => s.slug === slug);
}

export const HERO: Photo = payung;
