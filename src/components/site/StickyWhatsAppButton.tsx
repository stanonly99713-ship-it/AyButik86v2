import { WhatsAppIcon } from "@/components/icons";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Product } from "@/lib/types";

/** Единственное целевое действие на карточке товара — всегда на виду. */
export function StickyWhatsAppButton({ whatsapp, product }: { whatsapp: string; product: Product }) {
  return (
    <div className="sticky bottom-0 z-30 border-t border-line bg-ink/95 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 backdrop-blur">
      <a
        href={buildWhatsAppLink(whatsapp, product)}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-[52px] items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-light text-base font-medium text-ink"
      >
        <WhatsAppIcon className="h-5 w-5" />
        Написать в WhatsApp
      </a>
    </div>
  );
}
