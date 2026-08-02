"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { CloseIcon } from "@/components/icons";
import { useT } from "@/locales/useTranslation";
import type { ProductImage } from "@/lib/types";

export function ProductGallery({ images, alt }: { images: ProductImage[]; alt: string }) {
  const { t } = useT();
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  if (images.length === 0) {
    return <div className="aspect-square w-full bg-surface-2" />;
  }

  function onScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget;
    setActive(Math.round(el.scrollLeft / el.clientWidth));
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={onScroll}
        onClick={() => setLightbox(true)}
        className="no-scrollbar flex aspect-square snap-x snap-mandatory overflow-x-auto scroll-smooth"
      >
        {images.map((image, i) => (
          <div key={image.id} className="relative w-full shrink-0 snap-start">
            <Image
              src={image.url}
              alt={alt}
              fill
              priority={i === 0}
              className="object-cover"
              sizes="100vw"
              placeholder={image.blurData ? "blur" : undefined}
              blurDataURL={image.blurData ?? undefined}
            />
          </div>
        ))}
      </div>

      {images.length > 1 && (
        <span className="absolute right-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-xs text-cream">
          {active + 1}/{images.length}
        </span>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink">
          <button
            type="button"
            aria-label={t("product.closeGallery")}
            onClick={() => setLightbox(false)}
            className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center text-cream"
          >
            <CloseIcon className="h-6 w-6" />
          </button>
          <div
            className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto"
            style={{ touchAction: "pinch-zoom" }}
            ref={(el) => {
              // Открываем на том же слайде, где остановился инлайн-скролл
              if (el) el.scrollLeft = active * el.clientWidth;
            }}
          >
            {images.map((image, i) => (
              <div key={image.id} className="relative flex h-full w-full shrink-0 snap-start items-center justify-center">
                <Image src={image.url} alt={alt} fill priority={i === active} className="object-contain" sizes="100vw" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
