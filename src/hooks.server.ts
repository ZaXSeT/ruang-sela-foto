import type { Handle, HandleServerError } from '@sveltejs/kit/hooks';
import { logError } from '#lib/server/log.ts';

export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	response.headers.set('x-content-type-options', 'nosniff');
	response.headers.set('referrer-policy', 'strict-origin-when-cross-origin');
	response.headers.set('x-frame-options', 'DENY');
	response.headers.set('permissions-policy', 'camera=(), microphone=(), geolocation=()');
	return response;
};

export const handleError: HandleServerError = ({ error, event }) => {
	logError(`${event.request.method} ${event.url.pathname}`, error);
	return { message: 'Halaman belum bisa dimuat. Coba muat ulang sebentar lagi.' };
};
