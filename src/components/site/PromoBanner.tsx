"use client";

import Image from "next/image";
import Link from "next/link";
import { useT } from "@/locales/useTranslation";
import type { Settings } from "@/lib/types";

export function PromoBanner({ settings }: { settings: Settings }) {
  const { t } = useT();
  if (!settings.promoImageUrl) return null;

  return (
    <Link href="/catalog?sort=discount" className="relative block h-56 overflow-hidden rounded-lg">
      <Image src={settings.promoImageUrl} alt={settings.promoTitle} fill className="object-cover" sizes="100vw" />
      <div className="absolute inset-0 bg-ink/50" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <h3 className="font-script text-2xl text-gold-light">{settings.promoTitle}</h3>
        {settings.promoText && <p className="mt-2 text-sm text-cream">{settings.promoText}</p>}
        <span className="mt-4 inline-flex h-10 items-center rounded-full bg-cream px-5 text-sm font-medium text-ink">
          {t("promo.defaultCta")}
        </span>
      </div>
    </Link>
  );
}
