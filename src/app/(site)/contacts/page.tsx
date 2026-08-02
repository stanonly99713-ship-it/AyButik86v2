import type { Metadata } from "next";
import { PhoneIcon, WhatsAppIcon } from "@/components/icons";
import { T } from "@/locales/T";
import { getSettings } from "@/db/queries";
import { buildWhatsAppLink } from "@/lib/whatsapp";

export const metadata: Metadata = { title: "Контакты" };

// См. комментарий в src/app/(site)/page.tsx — та же логика.
export const revalidate = 60;

export default async function ContactsPage() {
  const settings = await getSettings();
  const telHref = `tel:${settings.phone.replace(/[^\d+]/g, "")}`;

  return (
    <div className="px-4 py-8">
      <h1 className="font-heading text-2xl text-cream">
        <T k="contacts.title" />
      </h1>

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
          <p className="text-cream">
            <T k="common.whatsapp" />
          </p>
        </a>

        {settings.address && (
          <div className="rounded-lg border border-line px-4 py-3">
            <p className="text-xs uppercase tracking-wider text-muted">
              <T k="contacts.address" />
            </p>
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
