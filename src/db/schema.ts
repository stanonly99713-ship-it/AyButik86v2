import { createId } from "@paralleldrive/cuid2";
import { relations, sql } from "drizzle-orm";
import {
  boolean,
  customType,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

const tsvector = customType<{ data: string }>({ dataType: () => "tsvector" });

export const categories = pgTable("categories", {
  id: text("id").primaryKey().$defaultFn(createId),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  imageUrl: text("image_url"),
  pathname: text("pathname"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

export const products = pgTable(
  "products",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    categoryId: text("category_id")
      .references(() => categories.id, { onDelete: "restrict" })
      .notNull(),
    price: integer("price").notNull(), // целые рубли
    oldPrice: integer("old_price"), // null = нет скидки
    description: text("description").notNull().default(""),
    specs: jsonb("specs").$type<{ key: string; value: string }[]>().notNull().default([]),
    inStock: boolean("in_stock").notNull().default(true),
    isPublished: boolean("is_published").notNull().default(false),
    sortOrder: integer("sort_order").notNull().default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),

    // ё нормализуется в е и здесь, и в тексте запроса (см. src/db/queries.ts),
    // иначе «ёмкость»/«Гжель» не находятся при поиске.
    search: tsvector("search").generatedAlwaysAs(
      sql`
        setweight(to_tsvector('russian', translate(coalesce(name, ''), 'ё', 'е')), 'A') ||
        setweight(to_tsvector('russian', translate(coalesce(specs::text, ''), 'ё', 'е')), 'B') ||
        setweight(to_tsvector('russian', translate(coalesce(description, ''), 'ё', 'е')), 'C')
      `,
    ),
  },
  (t) => [
    index("products_search_idx").using("gin", t.search),
    index("products_cat_idx").on(t.categoryId),
    index("products_new_idx").on(t.isPublished, t.createdAt),
    index("products_name_trgm_idx").using("gin", sql`${t.name} gin_trgm_ops`),
  ],
);

export const productImages = pgTable(
  "product_images",
  {
    id: text("id").primaryKey().$defaultFn(createId),
    productId: text("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    url: text("url").notNull(), // 1600px webp
    thumbUrl: text("thumb_url").notNull(), // 600px webp
    pathname: text("pathname").notNull(), // для del() из Blob
    thumbPathname: text("thumb_pathname").notNull(),
    width: integer("width").notNull(),
    height: integer("height").notNull(),
    blurData: text("blur_data"),
    sortOrder: integer("sort_order").notNull().default(0), // 0 = обложка
  },
  (t) => [index("product_images_pid_idx").on(t.productId, t.sortOrder)],
);

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
  images: many(productImages),
}));

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, { fields: [productImages.productId], references: [products.id] }),
}));

export const heroSlides = pgTable("hero_slides", {
  id: text("id").primaryKey().$defaultFn(createId),
  imageUrl: text("image_url").notNull(),
  pathname: text("pathname").notNull().default(""),
  title: text("title").notNull().default(""),
  subtitle: text("subtitle").notNull().default(""),
  buttonText: text("button_text").notNull().default("Узнать больше"),
  buttonHref: text("button_href").notNull().default("/catalog"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
});

/** Singleton: единственная строка с id='main' */
export const settings = pgTable("settings", {
  id: text("id").primaryKey().default("main"),
  phone: text("phone").notNull().default("+7 926 925 96 86"),
  whatsapp: text("whatsapp").notNull().default("79269259686"),
  address: text("address").notNull().default(""),
  workingHours: text("working_hours").notNull().default(""),
  instagram: text("instagram").notNull().default(""),
  telegram: text("telegram").notNull().default(""),
  mapEmbedUrl: text("map_embed_url").notNull().default(""),
  promoTitle: text("promo_title").notNull().default("Акции месяца"),
  promoText: text("promo_text").notNull().default(""),
  promoImageUrl: text("promo_image_url"),
  promoPathname: text("promo_pathname"),
  adminLogin: text("admin_login").notNull().default("admin"),
  adminPasswordHash: text("admin_password_hash").notNull().default(""),
  failedLoginCount: integer("failed_login_count").notNull().default(0),
  lockedUntil: timestamp("locked_until", { withTimezone: true }),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});
