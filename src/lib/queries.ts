// P0: читает заглушки из ./placeholder-data. В P1 логика переезжает в
// src/db/queries.ts и работает через Drizzle против Neon — сигнатуры
// функций намеренно останутся такими же, чтобы страницы поменяли только
// импорт.

import {
  placeholderCategories,
  placeholderHeroSlides,
  placeholderProducts,
  placeholderSettings,
} from "./placeholder-data";
import type { Category, HeroSlide, Product, Settings } from "./types";

export function getCategories(): Category[] {
  return [...placeholderCategories].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return placeholderCategories.find((c) => c.slug === slug);
}

function publishedProducts(): Product[] {
  return placeholderProducts.filter((p) => p.isPublished);
}

/** Главная: «Новинки» — последние опубликованные, закреплённые сначала */
export function getNewArrivals(limit = 8): Product[] {
  return publishedProducts()
    .sort((a, b) => b.sortOrder - a.sortOrder || +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, limit);
}

/** Главная: «Акции месяца» — товары со скидкой, по убыванию размера скидки */
export function getSaleProducts(limit = 8): Product[] {
  return publishedProducts()
    .filter((p) => p.oldPrice != null && p.oldPrice > p.price)
    .sort((a, b) => {
      const da = (a.oldPrice! - a.price) / a.oldPrice!;
      const db = (b.oldPrice! - b.price) / b.oldPrice!;
      return db - da;
    })
    .slice(0, limit);
}

export function getProductBySlug(slug: string): Product | undefined {
  return publishedProducts().find((p) => p.slug === slug);
}

export function getProductsByCategorySlug(slug: string): Product[] {
  const category = getCategoryBySlug(slug);
  if (!category) return [];
  return publishedProducts().filter((p) => p.categoryId === category.id);
}

export function getRelatedProducts(product: Product, limit = 6): Product[] {
  return publishedProducts()
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, limit);
}

export type CatalogSort = "new" | "price_asc" | "price_desc" | "discount";

export type CatalogFilters = {
  q?: string;
  category?: string; // slug
  sort?: CatalogSort;
  inStockOnly?: boolean;
};

/**
 * Упрощённый поиск/фильтр для P0-версии каталога (substring по названию).
 * В P4 заменяется на tsvector-поиск в Postgres с деградацией
 * websearch -> prefix -> trigram, см. план.
 */
export function searchProducts(filters: CatalogFilters): Product[] {
  let items = publishedProducts();

  if (filters.category) {
    const category = getCategoryBySlug(filters.category);
    items = category ? items.filter((p) => p.categoryId === category.id) : [];
  }

  if (filters.q) {
    const q = filters.q.trim().toLowerCase().replace(/ё/g, "е");
    if (q) {
      items = items.filter((p) => {
        const haystack = [p.name, p.description, ...p.specs.map((s) => `${s.key} ${s.value}`)]
          .join(" ")
          .toLowerCase()
          .replace(/ё/g, "е");
        return haystack.includes(q);
      });
    }
  }

  if (filters.inStockOnly) {
    items = items.filter((p) => p.inStock);
  }

  switch (filters.sort) {
    case "price_asc":
      items = [...items].sort((a, b) => a.price - b.price);
      break;
    case "price_desc":
      items = [...items].sort((a, b) => b.price - a.price);
      break;
    case "discount":
      items = [...items].sort((a, b) => {
        const da = a.oldPrice ? (a.oldPrice - a.price) / a.oldPrice : 0;
        const db = b.oldPrice ? (b.oldPrice - b.price) / b.oldPrice : 0;
        return db - da;
      });
      break;
    default:
      items = [...items].sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  }

  return items;
}

export function getAllProducts(): Product[] {
  return publishedProducts();
}

export function getHeroSlides(): HeroSlide[] {
  return placeholderHeroSlides.filter((s) => s.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getSettings(): Settings {
  return placeholderSettings;
}
