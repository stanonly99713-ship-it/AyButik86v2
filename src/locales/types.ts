import type { ru } from "./ru";

export type Locale = "ru" | "az";

/** Форма словаря — az.ts обязан совпадать (проверяется через satisfies при сборке) */
export type Dictionary = typeof ru;
