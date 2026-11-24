/** Tanggal kalender WIB (Asia/Jakarta, UTC+7). Modul murni untuk server, browser, dan tes. */
const OFFSET = 7 * 60 * 60_000;
const pad = (n: number) => String(n).padStart(2, '0');

export function wibToday(now: Date): string {
	const t = new Date(now.getTime() + OFFSET);
	return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}

export function isRealDate(date: string): boolean {
	const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
	if (!m) return false;
	const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3]));
	return d.getUTCFullYear() === +m[1] && d.getUTCMonth() === +m[2] - 1 && d.getUTCDate() === +m[3];
}

export function addDays(date: string, n: number): string {
	const [y, m, d] = date.split('-').map(Number);
	const t = new Date(Date.UTC(y, m - 1, d + n));
	return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}

/** Rentang tanggal sesi yang bisa ditanyakan: besok sampai 365 hari ke depan. */
export function sessionRange(now: Date): { min: string; max: string } {
	const today = wibToday(now);
	return { min: addDays(today, 1), max: addDays(today, 365) };
}

const HARI = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
const BULAN = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];

/** "Sabtu, 12 Desember 2026" */
export function longDate(date: string): string {
	const [y, m, d] = date.split('-').map(Number);
	const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
	return `${HARI[wd]}, ${d} ${BULAN[m - 1]} ${y}`;
}
