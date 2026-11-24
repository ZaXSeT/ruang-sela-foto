/**
 * Log server tanpa data kontak. Nomor telepon dan email disamarkan sebelum ditulis,
 * dan error database hanya dicatat kode serta pesannya (bukan parameter query).
 */
const PHONE = /(\+?\d[\d\s-]{6,}\d)/g;
const EMAIL = /[\w.+-]+@[\w-]+\.[\w.-]+/g;

export function redact(text: string): string {
	return text.replace(EMAIL, '[email]').replace(PHONE, '[nomor]');
}

export function logError(context: string, error: unknown) {
	const e = error as { code?: string; message?: string };
	const message = redact(String(e?.message ?? error));
	console.error(`[${context}]`, e?.code ? `${e.code} ${message}` : message);
}
