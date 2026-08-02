import type { Metadata } from "next";
import { createHeroSlide } from "@/actions/hero";
import { HeroSlideCard } from "@/components/admin/HeroSlideCard";
import { PromoBannerForm } from "@/components/admin/PromoBannerForm";
import { T } from "@/locales/T";
import { getAdminHeroSlides, getSettings } from "@/db/queries";

export const metadata: Metadata = { title: "Оформление" };

export default async function AdminHeroPage() {
  const [slides, settings] = await Promise.all([getAdminHeroSlides(), getSettings()]);

  return (
    <div className="px-4 py-4 pb-24">
      <h1 className="mb-3 text-xl text-cream">
        <T k="admin.hero.title" />
      </h1>

      <section>
        <p className="mb-2 text-sm text-muted">
          <T k="admin.hero.promoSectionLabel" />
        </p>
        <PromoBannerForm promoTitle={settings.promoTitle} promoText={settings.promoText} promoImageUrl={settings.promoImageUrl} />
      </section>

      <section className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-sm text-muted">
            <T k="admin.hero.slidesLabel" />
          </p>
          <form action={createHeroSlide}>
            <button type="submit" className="text-sm text-gold-light">
              <T k="admin.hero.addSlide" />
            </button>
          </form>
        </div>

        <div className="flex flex-col gap-3">
          {slides.length === 0 && (
            <p className="text-sm text-muted">
              <T k="admin.hero.noSlides" />
            </p>
          )}
          {slides.map((s, i) => (
            <HeroSlideCard key={s.id} slide={s} isFirst={i === 0} isLast={i === slides.length - 1} />
          ))}
        </div>
      </section>
    </div>
  );
}
