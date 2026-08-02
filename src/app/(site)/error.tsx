"use client";

import { useT } from "@/locales/useTranslation";

export default function SiteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useT();
  return (
    <div className="flex min-h-[60svh] flex-col items-center justify-center px-6 text-center">
      <p className="font-heading text-5xl text-gold-light">{t("errorPage.oops")}</p>
      <h1 className="mt-3 text-lg text-cream">{t("errorPage.title")}</h1>
      <p className="mt-2 text-sm text-muted">{t("errorPage.body")}</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex h-11 items-center rounded-full bg-gradient-to-r from-gold to-gold-light px-6 text-sm font-medium text-ink"
      >
        {t("errorPage.retry")}
      </button>
    </div>
  );
}
