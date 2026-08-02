"use client";

import { useT } from "./useTranslation";

/**
 * Точечная вставка перевода внутри Server Component-страниц — сама страница
 * остаётся серверной, переводится только этот листовой узел.
 */
export function T({ k, params }: { k: string; params?: Record<string, string | number> }) {
  const { t } = useT();
  return <>{t(k, params)}</>;
}
