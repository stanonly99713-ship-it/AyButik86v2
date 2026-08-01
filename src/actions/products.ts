"use server";

import { del } from "@vercel/blob";
import { and, asc, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { categories, productImages, products } from "@/db/schema";
import { draftSlug, isDraftSlug, slugify } from "@/lib/slug";

async function ensureUniqueSlug(base: string, excludeId?: string): Promise<string> {
  const safeBase = base || "tovar";
  let candidate = safeBase;
  let attempt = 1;

  while (true) {
    const conflict = await db.query.products.findFirst({
      where: excludeId
        ? and(eq(products.slug, candidate), ne(products.id, excludeId))
        : eq(products.slug, candidate),
    });
    if (!conflict) return candidate;
    attempt += 1;
    candidate = `${safeBase}-${attempt}`;
  }
}

function revalidateStorefront(slug?: string) {
  revalidatePath("/");
  revalidatePath("/catalog");
  if (slug) revalidatePath(`/product/${slug}`);
}

/** «Новый товар» создаёт черновик мгновенно — форма никогда не бывает пустой */
export async function createDraftProduct() {
  const firstCategory = await db.query.categories.findFirst({ orderBy: asc(categories.sortOrder) });
  if (!firstCategory) throw new Error("Нет ни одной категории — запустите db:seed");

  const [row] = await db
    .insert(products)
    .values({
      slug: draftSlug(),
      name: "Без названия",
      categoryId: firstCategory.id,
      price: 0,
      isPublished: false,
    })
    .returning({ id: products.id });

  revalidatePath("/admin/products");
  redirect(`/admin/products/${row.id}`);
}

export type ProductFormState = { error?: string };

export async function updateProduct(_prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const id = String(formData.get("id") ?? "");
  const current = await db.query.products.findFirst({ where: eq(products.id, id) });
  if (!current) return { error: "Товар не найден" };

  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { error: "Введите название товара" };

  const categoryId = String(formData.get("categoryId") ?? "");
  const priceRaw = String(formData.get("price") ?? "").replace(/\D/g, "");
  const oldPriceRaw = String(formData.get("oldPrice") ?? "").replace(/\D/g, "");
  const price = priceRaw ? parseInt(priceRaw, 10) : 0;
  const oldPrice = oldPriceRaw ? parseInt(oldPriceRaw, 10) : null;

  if (oldPrice != null && oldPrice <= price) {
    return { error: "Старая цена должна быть больше текущей — иначе это не скидка" };
  }

  const description = String(formData.get("description") ?? "").trim();
  const inStock = formData.get("inStock") === "on";
  const intent = String(formData.get("intent") ?? "draft"); // "draft" | "publish"

  const specKeys = formData.getAll("specKey").map(String);
  const specValues = formData.getAll("specValue").map(String);
  const specs = specKeys
    .map((key, i) => ({ key: key.trim(), value: (specValues[i] ?? "").trim() }))
    .filter((s) => s.key && s.value);

  // Слаг фиксируется после первого настоящего сохранения — ссылки в WhatsApp
  // не должны ломаться при переименовании товара.
  const requestedSlug = String(formData.get("slug") ?? "").trim();
  let slug = current.slug;
  if (isDraftSlug(current.slug)) {
    slug = await ensureUniqueSlug(slugify(name), id);
  } else if (requestedSlug && slugify(requestedSlug) !== current.slug) {
    slug = await ensureUniqueSlug(slugify(requestedSlug), id);
  }

  await db
    .update(products)
    .set({
      name,
      slug,
      categoryId,
      price,
      oldPrice,
      description,
      inStock,
      specs,
      isPublished: intent === "publish",
      updatedAt: new Date(),
    })
    .where(eq(products.id, id));

  revalidateStorefront(slug);
  if (current.slug !== slug) revalidateStorefront(current.slug);
  redirect("/admin/products");
}

export async function setPublished(id: string, isPublished: boolean) {
  const row = await db.query.products.findFirst({ where: eq(products.id, id) });
  if (!row) return;
  await db.update(products).set({ isPublished }).where(eq(products.id, id));
  revalidateStorefront(row.slug);
  revalidatePath("/admin/products");
}

export async function deleteProduct(id: string) {
  const row = await db.query.products.findFirst({ where: eq(products.id, id) });
  const images = await db.query.productImages.findMany({ where: eq(productImages.productId, id) });

  // Блобы удаляем до строки товара — иначе 1 ГБ бесплатного места на Blob
  // со временем забьётся сиротами, до которых уже никак не добраться.
  const pathnames = images.flatMap((img) => [img.pathname, img.thumbPathname]);
  if (pathnames.length > 0) {
    await del(pathnames).catch(() => {});
  }

  await db.delete(products).where(eq(products.id, id));
  revalidateStorefront(row?.slug);
  revalidatePath("/admin/products");
  redirect("/admin/products");
}
