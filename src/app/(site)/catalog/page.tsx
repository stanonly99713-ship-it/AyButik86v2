import type { Metadata } from "next";
import { CatalogFilterBar } from "@/components/site/CatalogFilterBar";
import { ProductCard } from "@/components/site/ProductCard";
import { getCategories, getSettings, searchProducts, type CatalogSort } from "@/db/queries";

export const metadata: Metadata = { title: "Каталог" };

type SearchParams = { cat?: string; q?: string; sort?: string; stock?: string };

export default async function CatalogPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const [categories, settings] = await Promise.all([getCategories(), getSettings()]);
  const activeCategory = categories.find((c) => c.slug === params.cat);

  const products = await searchProducts({
    q: params.q,
    category: params.cat,
    sort: (params.sort as CatalogSort) ?? "new",
    inStockOnly: params.stock === "1",
  });

  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name;

  return (
    <div>
      <div className="px-4 pt-6">
        <h1 className="font-heading text-2xl text-cream">
          {activeCategory ? activeCategory.name : params.q ? `Поиск: «${params.q}»` : "Каталог"}
        </h1>
      </div>

      <div className="mt-4">
        <CatalogFilterBar categories={categories} params={params} />
      </div>

      <div className="px-4 py-4">
        {products.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted">
            Ничего не нашлось. Попробуйте другой запрос или сбросьте фильтры.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                categoryName={categoryName(product.categoryId)}
                whatsapp={settings.whatsapp}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
