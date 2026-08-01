import { config } from "dotenv";
import { defineConfig } from "drizzle-kit";

// drizzle-kit CLI не грузит .env.local сам по себе — в отличие от
// src/db/seed.ts, здесь нет соседнего модуля с собственным top-level
// throw на DATABASE_URL, поэтому обычный dotenv.config() отрабатывает
// вовремя (импорты выше просто регистрируют функции, а не читают env).
config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL не задан — добавьте его в .env.local");
}

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
});
