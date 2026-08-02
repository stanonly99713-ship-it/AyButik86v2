import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { createDraftProduct } from "@/actions/products";
import { AdminProductsToolbar } from "@/components/admin/AdminProductsToolbar";
import { ProductActionsMenu } from "@/components/admin/ProductActionsMenu";
import { formatPrice } from "@/lib/format";
import { T } from "@/locales/T";
import { getAdminProducts, getCategories } from "@/db/queries";

export const metadata: Metadata = { title: "Товары" };

type SearchParams = { q?: string; cat?: string };

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const params = await searchParams;
  const [allProducts, categories] = await Promise.all([getAdminProducts(), getCategories()]);

  const categoryName = (id: string) => categories.find((c) => c.id === id)?.name ?? "";

  let items = allProducts;
  if (params.cat) {
    items = items.filter((p) => p.categoryId === params.cat);
  }
  if (params.q) {
    const q = params.q.trim().toLowerCase();
    items = items.filter((p) => p.name.toLowerCase().includes(q));
  }

  return (
    <div>
      <div className="px-4 py-4 pb-24">
        <h1 className="mb-3 text-xl text-cream">
          <T k="admin.products.title" />
        </h1>

        <AdminProductsToolbar categories={categories} q={params.q} cat={params.cat} />

        {items.length === 0 ? (
          <p className="mt-10 text-center text-sm text-muted">
            <T k="admin.products.empty" />
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {items.map((p) => {
              const cover = p.images[0];
              const isDraft = p.name === "Без названия" && p.price === 0;
              return (
                <li key={p.id} className="flex items-center gap-3 rounded-lg border border-line bg-surface p-2">
                  <Link href={`/admin/products/${p.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-surface-2">
                      {cover && <Image src={cover.thumbUrl} alt="" fill className="object-cover" sizes="64px" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-cream">{p.name}</span>
                      <span className="block text-xs text-muted">{categoryName(p.categoryId)}</span>
                      <span className="mt-0.5 flex items-center gap-2">
                        <span className="text-sm font-medium text-gold-light">{formatPrice(p.price)}</span>
                        {p.oldPrice && (
                          <span className="text-xs text-muted line-through">{formatPrice(p.oldPrice)}</span>
                        )}
                      </span>
                      <span className="mt-0.5 flex items-center gap-1 text-xs">
                        <span className={`h-1.5 w-1.5 rounded-full ${p.isPublished ? "bg-gold" : "bg-muted"}`} />
                        <span className={p.isPublished ? "text-gold-light" : "text-muted"}>
                          <T
                            k={
                              isDraft
                                ? "admin.products.statusDraft"
                                : p.isPublished
                                  ? "admin.products.statusPublished"
                                  : "admin.products.statusHidden"
                            }
                          />
                        </span>
                      </span>
                    </span>
                  </Link>
                  <ProductActionsMenu id={p.id} name={p.name} isPublished={p.isPublished} />
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <form action={createDraftProduct}>
        <button
          type="submit"
          aria-label="Добавить товар"
          className="fixed right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-gold to-gold-light text-2xl text-ink shadow-lg"
          style={{ bottom: "calc(4.5rem + env(safe-area-inset-bottom))" }}
        >
          +
        </button>
      </form>
    </div>
  );
}
