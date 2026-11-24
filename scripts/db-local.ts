/**
 * npm run db:start
 * Menjalankan Postgres lokal di port 55401 sampai Ctrl+C. Data tersimpan di .data/pg (tidak masuk git).
 */
import { LOCAL_PG, canConnect, localUrl, startLocalPostgres } from './lib/local-pg';

if (await canConnect(localUrl('postgres'))) {
	console.log(`Postgres lokal sudah berjalan di port ${LOCAL_PG.port}.`);
	process.exit(0);
}

const pg = await startLocalPostgres();
console.log('Postgres lokal berjalan.');
console.log(`  dev : ${localUrl(LOCAL_PG.devDb)}`);
console.log(`  tes : ${localUrl(LOCAL_PG.testDb)}`);
console.log('Tekan Ctrl+C untuk berhenti.');

const shutdown = async () => {
	await pg.stop();
	process.exit(0);
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
setInterval(() => {}, 1 << 30);
