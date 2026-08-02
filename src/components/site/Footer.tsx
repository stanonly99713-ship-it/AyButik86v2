"use client";

import Image from "next/image";
import Link from "next/link";
import { PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { useT } from "@/locales/useTranslation";
import type { Settings } from "@/lib/types";

export function Footer({ settings }: { settings: Settings }) {
  const { t } = useT();
  const telHref = `tel:${settings.phone.replace(/[^\d+]/g, "")}`;

  return (
    <footer className="mt-auto border-t border-line bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:justify-between">
          <div>
            <Image src="/logo-128.webp" alt="AyButik86" width={44} height={44} className="rounded-full" />
            <p className="mt-3 font-heading italic text-lg gold-gradient-text">AyButik86</p>
            <p className="text-xs uppercase tracking-wider text-muted">{t("footer.tagline")}</p>
          </div>

          <div className="text-sm text-cream">
            <p className="mb-1 text-xs uppercase tracking-wider text-muted">{t("footer.contactsLabel")}</p>
            <a href={telHref} className="block py-1">
              {settings.phone}
            </a>
            <p className="py-1 text-muted">{settings.workingHours}</p>
            {settings.address && <p className="py-1 text-muted">{settings.address}</p>}
          </div>

          <div className="text-sm">
            <p className="mb-1 text-xs uppercase tracking-wider text-muted">{t("footer.shopLabel")}</p>
            <nav className="flex flex-col gap-1">
              <Link href="/catalog" className="py-1 text-cream">
                {t("common.catalog")}
              </Link>
              <Link href="/contacts" className="py-1 text-cream">
                {t("common.contacts")}
              </Link>
            </nav>
          </div>

          <a
            href={buildWhatsAppLink(settings.whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-light px-5 font-medium text-ink"
          >
            <WhatsAppIcon className="h-5 w-5" />
            {t("common.whatsappShort")}
          </a>
        </div>

        {settings.mapEmbedUrl && (
          <div className="mt-8 overflow-hidden rounded-lg border border-line">
            <iframe
              src={settings.mapEmbedUrl}
              title={t("footer.mapTitle")}
              className="h-64 w-full"
              loading="lazy"
            />
          </div>
        )}

        <p className="mt-8 flex items-center gap-2 text-xs text-muted">
          <PhoneIcon className="h-3.5 w-3.5" />
          {settings.phone} · © {new Date().getFullYear()} AyButik86
        </p>
      </div>
    </footer>
  );
}
