"use client";

import Link from "next/link";
import { useT } from "@/locales/useTranslation";
import type { Category } from "@/lib/types";

/** Строка поиска + чипы категорий — вынесены в клиентский компонент ради
 * переводимого placeholder (атрибут, не JSX-дети — <T> сюда не подставить). */
export function AdminProductsToolbar({
  categories,
  q,
  cat,
}: {
  categories: Category[];
  q?: string;
  cat?: string;
}) {
  const { t } = useT();

  return (
    <>
      <form className="mb-3 flex gap-2" action="/admin/products">
        <input
          type="search"
          name="q"
          defaultValue={q}
          placeholder={t("admin.products.searchPlaceholder")}
          className="h-11 flex-1 rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
        />
        {cat && <input type="hidden" name="cat" value={cat} />}
      </form>

      <div className="no-scrollbar -mx-4 mb-4 flex gap-2 overflow-x-auto px-4">
        <Link
          href="/admin/products"
          className={`shrink-0 rounded-full border px-3 py-1.5 text-sm ${
            !cat ? "border-gold bg-gold/10 text-gold-light" : "border-line text-muted"
          }`}
        >
          {t("admin.products.all")}
        </Link>
        {categories.map((c) => (
          <Link
            key={c.id}
            href={`/admin/products?cat=${c.id}`}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-sm ${
              cat === c.id ? "border-gold bg-gold/10 text-gold-light" : "border-line text-muted"
            }`}
          >
            {c.name}
          </Link>
        ))}
      </div>
    </>
  );
}
