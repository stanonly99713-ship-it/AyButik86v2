import type { Locale } from "@/locales/types";
import { az } from "@/locales/az";
import { ru } from "@/locales/ru";
import type { Product } from "./types";
import { formatPrice } from "./format";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ay-butik86v2.vercel.app";

/**
 * Ссылка wa.me с уже готовым текстом сообщения. Номер в `whatsapp` должен
 * быть только цифрами, без "+" и пробелов — таков формат wa.me.
 */
export function buildWhatsAppLink(whatsappNumber: string, product?: Product, locale: Locale = "ru"): string {
  const digits = whatsappNumber.replace(/\D/g, "");

  if (!product) {
    return `https://wa.me/${digits}`;
  }

  const dict = locale === "az" ? az : ru;
  const greeting = dict.product.whatsappMessage
    .replace("{name}", product.name)
    .replace("{price}", formatPrice(product.price));
  const text = `${greeting}\n${SITE_URL}/product/${product.slug}`;

  return `https://wa.me/${digits}?text=${encodeURIComponent(text)}`;
}
