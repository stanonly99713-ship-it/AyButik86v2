import Link from "next/link";
import { CategoryStrip } from "@/components/site/CategoryStrip";
import { HeroSlider } from "@/components/site/HeroSlider";
import { ProductCard } from "@/components/site/ProductCard";
import { PromoBanner } from "@/components/site/PromoBanner";
import { SectionHeading } from "@/components/site/SectionHeading";
import {
  getCategories,
  getHeroSlides,
  getNewArrivals,
  getSaleProducts,
  getSettings,
} from "@/db/queries";

export default async function HomePage() {
  const [categories, heroSlides, newArrivals, saleProducts, settings] = await Promise.all([
    getCategories(),
    getHeroSlides(),
    getNewArrivals(8),
    getSaleProducts(8),
    getSettings(),
  ]);

  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name;

  return (
    <>
      <HeroSlider slides={heroSlides} />

      <section className="px-4 py-6">
        <CategoryStrip categories={categories} />
      </section>

      <section className="px-4 py-8">
        <SectionHeading>Новинки</SectionHeading>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryName={categoryName(product.categoryId)}
              whatsapp={settings.whatsapp}
            />
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link href="/catalog" className="text-sm text-gold-light underline underline-offset-4">
            Перейти в каталог →
          </Link>
        </div>
      </section>

      {settings.promoImageUrl && (
        <section className="px-4 py-4">
          <PromoBanner settings={settings} />
        </section>
      )}

      {saleProducts.length > 0 && (
        <section className="px-4 py-8">
          <SectionHeading>Скидки недели</SectionHeading>
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4">
            {saleProducts.map((product) => (
              <div key={product.id} className="w-[46vw] shrink-0 sm:w-56">
                <ProductCard
                  product={product}
                  categoryName={categoryName(product.categoryId)}
                  whatsapp={settings.whatsapp}
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
