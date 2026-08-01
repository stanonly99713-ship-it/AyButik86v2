import type { Metadata } from "next";
import { PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { getSettings } from "@/lib/queries";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Контакты" };

export default function ContactsPage() {
  const settings = getSettings();
  const telHref = `tel:${settings.phone.replace(/[^\d+]/g, "")}`;

  return (
    <div className="px-4 py-8">
      <h1 className="font-heading text-2xl text-cream">Контакты</h1>

      <div className="mt-6 flex flex-col gap-4">
        <a href={telHref} className="flex items-center gap-3 rounded-lg border border-line px-4 py-3">
          <PhoneIcon className="h-5 w-5 text-gold-light" />
          <div>
            <p className="text-cream">{settings.phone}</p>
            <p className="text-xs text-muted">{settings.workingHours}</p>
          </div>
        </a>

        <a
          href={buildWhatsAppLink(settings.whatsapp)}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 rounded-lg border border-line px-4 py-3"
        >
          <WhatsAppIcon className="h-5 w-5 text-gold-light" />
          <p className="text-cream">Написать в WhatsApp</p>
        </a>

        {settings.address && (
          <div className="rounded-lg border border-line px-4 py-3">
            <p className="text-xs uppercase tracking-wider text-muted">Адрес</p>
            <p className="mt-1 text-cream">{settings.address}</p>
          </div>
        )}
      </div>

      {settings.mapEmbedUrl && (
        <div className="mt-6 overflow-hidden rounded-lg border border-line">
          <iframe src={settings.mapEmbedUrl} title="Адрес на карте" className="h-72 w-full" loading="lazy" />
        </div>
      )}
    </div>
  );
}
