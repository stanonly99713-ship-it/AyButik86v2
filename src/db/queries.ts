import { and, asc, count, desc, eq, gt, ilike, or, sql } from "drizzle-orm";
import { db } from "./index";
import { categories, heroSlides, productImages, products, settings } from "./schema";
import type { Category, HeroSlide, Product, Settings } from "@/lib/types";

function toProduct(row: typeof products.$inferSelect & { images: (typeof productImages.$inferSelect)[] }): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    categoryId: row.categoryId,
    price: row.price,
    oldPrice: row.oldPrice,
    description: row.description,
    specs: row.specs,
    inStock: row.inStock,
    isPublished: row.isPublished,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt.toISOString(),
    images: [...row.images]
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((img) => ({
        id: img.id,
        url: img.url,
        thumbUrl: img.thumbUrl,
        width: img.width,
        height: img.height,
        blurData: img.blurData,
        sortOrder: img.sortOrder,
      })),
  };
}

export async function getCategories(): Promise<Category[]> {
  const rows = await db.select().from(categories).orderBy(asc(categories.sortOrder));
  return rows;
}

export async function getCategoriesWithProductCounts(): Promise<(Category & { productCount: number })[]> {
  const cats = await getCategories();
  const counts = await db
    .select({ categoryId: products.categoryId, value: count() })
    .from(products)
    .groupBy(products.categoryId);
  const countByCategory = new Map(counts.map((c) => [c.categoryId, c.value]));
  return cats.map((c) => ({ ...c, productCount: countByCategory.get(c.id) ?? 0 }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const row = await db.query.categories.findFirst({ where: eq(categories.slug, slug) });
  return row;
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  const rows = await db.query.products.findMany({
    where: eq(products.isPublished, true),
    with: { images: true },
    orderBy: [desc(products.sortOrder), desc(products.createdAt)],
    limit,
  });
  return rows.map(toProduct);
}

export async function getSaleProducts(limit = 8): Promise<Product[]> {
  const rows = await db.query.products.findMany({
    where: and(eq(products.isPublished, true), sql`${products.oldPrice} > ${products.price}`),
    with: { images: true },
    // сортировка по размеру скидки в процентах, самые выгодные — первыми
    orderBy: [
      desc(sql`(${products.oldPrice} - ${products.price})::float / ${products.oldPrice}`),
    ],
    limit,
  });
  return rows.map(toProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const row = await db.query.products.findFirst({
    where: and(eq(products.slug, slug), eq(products.isPublished, true)),
    with: { images: true },
  });
  return row ? toProduct(row) : undefined;
}

export async function getProductsByCategorySlug(slug: string): Promise<Product[]> {
  const category = await getCategoryBySlug(slug);
  if (!category) return [];
  const rows = await db.query.products.findMany({
    where: and(eq(products.categoryId, category.id), eq(products.isPublished, true)),
    with: { images: true },
    orderBy: [desc(products.createdAt)],
  });
  return rows.map(toProduct);
}

export async function getRelatedProducts(product: Product, limit = 6): Promise<Product[]> {
  const rows = await db.query.products.findMany({
    where: and(
      eq(products.categoryId, product.categoryId),
      eq(products.isPublished, true),
      sql`${products.id} != ${product.id}`,
    ),
    with: { images: true },
    limit,
  });
  return rows.map(toProduct);
}

export async function getAllProducts(): Promise<Product[]> {
  const rows = await db.query.products.findMany({
    where: eq(products.isPublished, true),
    with: { images: true },
  });
  return rows.map(toProduct);
}

/** Для админки — включая неопубликованные черновики, в отличие от витринных функций выше. */
export async function getAdminProducts(): Promise<Product[]> {
  const rows = await db.query.products.findMany({
    with: { images: true },
    orderBy: [desc(products.updatedAt)],
  });
  return rows.map(toProduct);
}

export async function getAdminProductById(id: string): Promise<Product | undefined> {
  const row = await db.query.products.findFirst({ where: eq(products.id, id), with: { images: true } });
  return row ? toProduct(row) : undefined;
}

export type CatalogSort = "new" | "price_asc" | "price_desc" | "discount";

export type CatalogFilters = {
  q?: string;
  category?: string; // slug
  sort?: CatalogSort;
  inStockOnly?: boolean;
};

/**
 * P1: базовый tsvector-поиск (websearch_to_tsquery) + ILIKE-запасной вариант.
 * Полная цепочка деградации websearch -> prefix -> trigram — в P4, см. план.
 */
export async function searchProducts(filters: CatalogFilters): Promise<Product[]> {
  const conditions = [eq(products.isPublished, true)];

  if (filters.category) {
    const category = await getCategoryBySlug(filters.category);
    if (!category) return [];
    conditions.push(eq(products.categoryId, category.id));
  }

  if (filters.inStockOnly) {
    conditions.push(eq(products.inStock, true));
  }

  const q = filters.q?.trim();
  let orderBy;

  if (q) {
    const normalized = q.replace(/ё/g, "е");
    conditions.push(
      or(
        sql`${products.search} @@ websearch_to_tsquery('russian', ${normalized})`,
        ilike(products.name, `%${normalized}%`),
      )!,
    );
    orderBy = [desc(sql`ts_rank(${products.search}, websearch_to_tsquery('russian', ${normalized}))`)];
  }

  switch (filters.sort) {
    case "price_asc":
      orderBy = [asc(products.price)];
      break;
    case "price_desc":
      orderBy = [desc(products.price)];
      break;
    case "discount":
      orderBy = [desc(sql`coalesce((${products.oldPrice} - ${products.price})::float / nullif(${products.oldPrice}, 0), 0)`)];
      break;
    default:
      if (!orderBy) orderBy = [desc(products.createdAt)];
  }

  const rows = await db.query.products.findMany({
    where: and(...conditions),
    with: { images: true },
    orderBy,
  });
  return rows.map(toProduct);
}

export async function getHeroSlides(): Promise<HeroSlide[]> {
  const rows = await db
    .select()
    .from(heroSlides)
    .where(eq(heroSlides.isActive, true))
    .orderBy(asc(heroSlides.sortOrder));
  return rows;
}

/** Для админки — включая неактивные слайды и служебный pathname (нужен для удаления из Blob) */
export async function getAdminHeroSlides() {
  return db.select().from(heroSlides).orderBy(asc(heroSlides.sortOrder));
}

const SETTINGS_FALLBACK: Settings = {
  phone: "+7 926 925 96 86",
  whatsapp: "79269259686",
  address: "",
  workingHours: "",
  instagram: "",
  telegram: "",
  mapEmbedUrl: "",
  promoTitle: "Акции месяца",
  promoText: "",
  promoImageUrl: null,
};

export async function getSettings(): Promise<Settings> {
  const row = await db.query.settings.findFirst({ where: eq(settings.id, "main") });
  if (!row) {
    // БД подключена, но db:seed ещё не запускали — не роняем сайт целиком.
    console.warn("Строка settings отсутствует — запустите `npm run db:seed`. Используются значения по умолчанию.");
    return SETTINGS_FALLBACK;
  }
  return {
    phone: row.phone,
    whatsapp: row.whatsapp,
    address: row.address,
    workingHours: row.workingHours,
    instagram: row.instagram,
    telegram: row.telegram,
    mapEmbedUrl: row.mapEmbedUrl,
    promoTitle: row.promoTitle,
    promoText: row.promoText,
    promoImageUrl: row.promoImageUrl,
  };
}
