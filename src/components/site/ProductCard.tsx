import Image from "next/image";
import Link from "next/link";
import { WhatsAppIcon } from "@/components/icons";
import { discountPercent, formatPrice } from "@/lib/format";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Product } from "@/lib/types";

export function ProductCard({
  product,
  categoryName,
  whatsapp,
}: {
  product: Product;
  categoryName?: string;
  whatsapp: string;
}) {
  const cover = product.images[0];
  const discount = product.oldPrice ? discountPercent(product.oldPrice, product.price) : 0;

  return (
    <div className="relative">
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-surface-2">
          {cover && (
            <Image
              src={cover.thumbUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 50vw, 25vw"
              placeholder={cover.blurData ? "blur" : undefined}
              blurDataURL={cover.blurData ?? undefined}
            />
          )}
          {discount > 0 && (
            <span className="absolute left-2 top-2 rounded bg-ink/80 px-1.5 py-0.5 text-[10px] font-medium text-gold-light">
              Скидка -{discount}%
            </span>
          )}
          {!product.inStock && (
            <span className="absolute inset-x-0 bottom-0 bg-ink/80 px-2 py-1 text-center text-[10px] text-muted">
              Под заказ
            </span>
          )}
        </div>

        <div className="mt-2">
          {categoryName && (
            <p className="text-[10px] uppercase tracking-wider text-muted">{categoryName}</p>
          )}
          <p className="mt-0.5 line-clamp-2 text-sm text-cream">{product.name}</p>
          <p className="mt-1 flex items-baseline gap-1.5">
            <span className="font-heading text-gold-light">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="text-xs text-muted line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </p>
        </div>
      </Link>

      <a
        href={buildWhatsAppLink(whatsapp, product)}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Написать в WhatsApp про товар «${product.name}»`}
        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-ink/70 text-gold-light"
      >
        <WhatsAppIcon className="h-4 w-4" />
      </a>
    </div>
  );
}
