"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { HeroSlide } from "@/lib/types";

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  if (slides.length === 0) return null;

  function onScroll() {
    const el = trackRef.current;
    if (!el) return;
    const index = Math.round(el.scrollLeft / el.clientWidth);
    setActive(index);
  }

  function goTo(index: number) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div className="relative">
      {/* Нативный CSS scroll-snap вместо карусельной библиотеки — даёт
          правильную тач-физику "из коробки" и ничего не весит. */}
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="no-scrollbar flex h-[62svh] min-h-[380px] snap-x snap-mandatory overflow-x-auto scroll-smooth"
      >
        {slides.map((slide) => (
          <div key={slide.id} className="relative h-full w-full shrink-0 snap-start">
            <Image
              src={slide.imageUrl}
              alt={slide.title || "AyButik86"}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-8 px-5">
              {slide.title && (
                <h1 className="font-heading text-2xl leading-tight text-cream sm:text-3xl">{slide.title}</h1>
              )}
              {slide.subtitle && <p className="mt-2 max-w-sm text-sm text-muted">{slide.subtitle}</p>}
              {slide.buttonText && (
                <Link
                  href={slide.buttonHref}
                  className="mt-4 inline-flex h-11 items-center gap-2 rounded-full border border-gold px-5 text-sm font-medium text-gold-light"
                >
                  {slide.buttonText}
                  <span aria-hidden>→</span>
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Слайд ${i + 1}`}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === active ? "w-5 bg-gold" : "w-1.5 bg-cream/40"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
