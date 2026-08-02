"use client";

import { useT } from "@/locales/useTranslation";

/** Компактный пилл RU|AZ в стиле уже существующих чипов категорий/сортировки. */
export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useT();

  return (
    <div className={`flex shrink-0 items-center rounded-full border border-line p-0.5 text-xs ${className}`}>
      <button
        type="button"
        onClick={() => setLocale("ru")}
        aria-pressed={locale === "ru"}
        className={`rounded-full px-2 py-1 font-medium transition-colors ${
          locale === "ru" ? "bg-gold/10 text-gold-light" : "text-muted"
        }`}
      >
        RU
      </button>
      <button
        type="button"
        onClick={() => setLocale("az")}
        aria-pressed={locale === "az"}
        className={`rounded-full px-2 py-1 font-medium transition-colors ${
          locale === "az" ? "bg-gold/10 text-gold-light" : "text-muted"
        }`}
      >
        AZ
      </button>
    </div>
  );
}
