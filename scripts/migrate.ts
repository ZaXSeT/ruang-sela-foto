/** npm run db:migrate — menerapkan migrasi ke database di DATABASE_URL. */
import postgres from 'postgres';
import { databaseUrl } from './lib/env';
import { migrate } from './lib/migrate-core';

const sql = postgres(databaseUrl(), { max: 1, prepare: false, onnotice: () => {} });
try {
	const applied = await migrate(sql);
	console.log(applied.length ? `${applied.length} migrasi diterapkan.` : 'Skema sudah terbaru.');
} finally {
	await sql.end();
}
