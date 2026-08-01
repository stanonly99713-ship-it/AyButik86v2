import type { Metadata } from "next";
import Link from "next/link";
import { ProductCard } from "@/components/site/ProductCard";
import { getCategories, getSettings, searchProducts, type CatalogSort } from "@/lib/queries";

export const metadata: Metadata = { title: "Каталог" };

type SearchParams = { cat?: string; q?: string; sort?: string; stock?: string };

const SORT_OPTIONS: { value: CatalogSort; label: string }[] = [
  { value: "new", label: "Новинки" },
  { value: "price_asc", label: "Сначала дешевле" },
  { value: "price_desc", label: "Сначала дороже" },
  { value: "discount", label: "Скидки" },
];

// P0: фильтры — обычные ссылки, работают без JS и сохраняются в URL.
// В P4 та же логика searchParams одевается в bottom sheet (см. план).
function buildHref(current: SearchParams, patch: Partial<SearchParams>) {
  const next = { ...current, ...patch };
  const qs = new URLSearchParams();
  if (next.cat) qs.set("cat", next.cat);
  if (next.q) qs.set("q", next.q);
  if (next.sort) qs.set("sort", next.sort);
  if (next.stock) qs.set("stock", next.stock);
  const s = qs.toString();
  return s ? `/catalog?${s}` : "/catalog";
}

export default async function CatalogPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const categories = getCategories();
  const settings = getSettings();
  const activeCategory = categories.find((c) => c.slug === params.cat);

  const products = searchProducts({
    q: params.q,
    category: params.cat,
    sort: (params.sort as CatalogSort) ?? "new",
    inStockOnly: params.stock === "1",
  });

  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name;

  return (
    <div className="px-4 py-6">
      <h1 className="font-heading text-2xl text-cream">
        {activeCategory ? activeCategory.name : params.q ? `Поиск: «${params.q}»` : "Каталог"}
      </h1>

      {/* Категории */}
      <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4">
        <Link
          href={buildHref(params, { cat: undefined })}
          className={`shrink-0 rounded-full border px-4 py-1.5 text-sm ${
            !activeCategory ? "border-gold bg-gold/10 text-gold-light" : "border-line text-muted"
          }`}
        >
          Все
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={buildHref(params, { cat: c.slug })}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm ${
              activeCategory?.id === c.id ? "border-gold bg-gold/10 text-gold-light" : "border-line text-muted"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>

      {/* Сортировка и наличие */}
      <div className="no-scrollbar -mx-4 mt-3 flex items-center gap-2 overflow-x-auto px-4 text-sm">
        {SORT_OPTIONS.map((opt) => (
          <Link
            key={opt.value}
            href={buildHref(params, { sort: opt.value })}
            className={`shrink-0 py-1 ${
              (params.sort ?? "new") === opt.value ? "text-gold-light underline underline-offset-4" : "text-muted"
            }`}
          >
            {opt.label}
          </Link>
        ))}
        <span className="mx-1 h-4 w-px shrink-0 bg-line" />
        <Link
          href={buildHref(params, { stock: params.stock === "1" ? undefined : "1" })}
          className={`shrink-0 py-1 ${params.stock === "1" ? "text-gold-light underline underline-offset-4" : "text-muted"}`}
        >
          В наличии
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="mt-10 text-center text-sm text-muted">
          Ничего не нашлось. Попробуйте другой запрос или сбросьте фильтры.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
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
  );
}
