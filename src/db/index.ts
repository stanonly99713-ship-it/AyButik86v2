import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL не задан — добавьте его в .env.local");
}

// neon-http — stateless fetch()-драйвер: без пулера и без настройки
// connection_limit, что и делает холодный старт на Neon free tier дешёвым.
const sqlClient = neon(process.env.DATABASE_URL);

export const db = drizzle({ client: sqlClient, schema });
