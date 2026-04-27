import { execSync } from 'node:child_process';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  console.log('[prepare-db] DATABASE_URL no configurada. Se omite prisma db push.');
  process.exit(0);
}

if (
  databaseUrl.includes('USER:PASSWORD@HOST') ||
  databaseUrl.includes('postgresql://USER:PASSWORD')
) {
  console.log('[prepare-db] DATABASE_URL de ejemplo detectada. Se omite prisma db push.');
  process.exit(0);
}

console.log('[prepare-db] Ejecutando prisma db push...');
execSync('npx prisma db push', { stdio: 'inherit' });

console.log('[prepare-db] Ejecutando prisma db seed...');
execSync('npx prisma db seed', { stdio: 'inherit' });
