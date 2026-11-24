/** Memuat .env (jika ada) untuk skrip terminal dan mengambil DATABASE_URL. */
try {
	process.loadEnvFile('.env');
} catch {
	// .env opsional: di CI atau Vercel, variabel sudah tersedia di environment.
}

export function databaseUrl(): string {
	const url = process.env.DATABASE_URL;
	if (!url) {
		console.error('DATABASE_URL belum diatur. Salin .env.example ke .env lalu isi nilainya.');
		process.exit(1);
	}
	return url;
}

/** Nilai opsi CLI sederhana: --nama nilai atau --nama=nilai */
export function argValue(name: string): string | undefined {
	const args = process.argv.slice(2);
	for (let i = 0; i < args.length; i++) {
		const a = args[i];
		if (a === `--${name}`) return args[i + 1];
		if (a.startsWith(`--${name}=`)) return a.slice(name.length + 3);
	}
	return undefined;
}
