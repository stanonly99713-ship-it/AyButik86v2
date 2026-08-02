"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { az } from "./az";
import { ru } from "./ru";
import type { Dictionary, Locale } from "./types";

const dictionaries: Record<Locale, Dictionary> = { ru, az };

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function getByPath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== "object") return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

function interpolate(template: string, params?: Record<string, string | number>): string {
  if (!params) return template;
  return template.replace(/\{(\w+)\}/g, (match, key) => (key in params ? String(params[key]) : match));
}

/**
 * Параметризуемый провайдер — по одному экземпляру на витрину и на админку
 * (разные storageKey и defaultLocale, см. app/(site)/layout.tsx и app/admin/layout.tsx).
 * Между ними нет общего React-дерева (разные <html>), поэтому делить контекст
 * не нужно — localStorage с разными ключами и есть источник истины для каждого.
 */
export function LocaleProvider({
  children,
  storageKey,
  defaultLocale,
}: {
  children: React.ReactNode;
  storageKey: string;
  defaultLocale: Locale;
}) {
  // Стартуем с defaultLocale — совпадает с тем, что отрисовал сервер, без
  // рассинхрона гидратации. localStorage читаем только после монтирования.
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored === "ru" || stored === "az") setLocaleState(stored);
  }, [storageKey]);

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      window.localStorage.setItem(storageKey, next);
    },
    [storageKey],
  );

  const t = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const value = getByPath(dictionaries[locale], key);
      if (typeof value !== "string") return key;
      return interpolate(value, params);
    },
    [locale],
  );

  return <LocaleContext.Provider value={{ locale, setLocale, t }}>{children}</LocaleContext.Provider>;
}

export function useLocaleContext(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocaleContext должен вызываться внутри LocaleProvider");
  return ctx;
}
