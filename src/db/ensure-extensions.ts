// drizzle-kit push диффит только таблицы из schema.ts, а не выполняет
// произвольный SQL — поэтому расширение pg_trgm (нужно индексу
// products_name_trgm_idx) ставим отдельным маленьким скриптом перед push.
// Переменные окружения грузятся флагом `tsx --env-file=.env.local`
// (см. npm-скрипт db:setup) — так они гарантированно доступны ещё до того,
// как заработают импорты модулей ниже.
import { neon } from "@neondatabase/serverless";

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL не задан — добавьте его в .env.local");
  }
  const sql = neon(process.env.DATABASE_URL);
  await sql`CREATE EXTENSION IF NOT EXISTS pg_trgm`;
  console.log("Расширение pg_trgm готово.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
