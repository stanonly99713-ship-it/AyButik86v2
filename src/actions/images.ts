"use server";

import { del } from "@vercel/blob";
import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { productImages, products } from "@/db/schema";

async function revalidateProduct(productId: string) {
  const product = await db.query.products.findFirst({ where: eq(products.id, productId) });
  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath(`/admin/products/${productId}`);
  if (product) revalidatePath(`/product/${product.slug}`);
}

/** Схлопывает sortOrder оставшихся фото в 0..N-1 — гарантирует, что обложка (0) всегда есть */
async function resequence(productId: string) {
  const rows = await db.query.productImages.findMany({
    where: eq(productImages.productId, productId),
    orderBy: asc(productImages.sortOrder),
  });
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].sortOrder !== i) {
      await db.update(productImages).set({ sortOrder: i }).where(eq(productImages.id, rows[i].id));
    }
  }
}

export type AttachImageInput = {
  productId: string;
  url: string;
  thumbUrl: string;
  pathname: string;
  thumbPathname: string;
  width: number;
  height: number;
  blurData?: string;
};

export async function attachImage(input: AttachImageInput) {
  const existing = await db.query.productImages.findMany({ where: eq(productImages.productId, input.productId) });

  const [row] = await db
    .insert(productImages)
    .values({ ...input, sortOrder: existing.length })
    .returning();

  await revalidateProduct(input.productId);
  return row;
}

export async function removeImage(imageId: string) {
  const row = await db.query.productImages.findFirst({ where: eq(productImages.id, imageId) });
  if (!row) return;

  // Не блокируем удаление записи, если блоб уже пропал (например, удалён вручную)
  await del([row.pathname, row.thumbPathname]).catch(() => {});
  await db.delete(productImages).where(eq(productImages.id, imageId));
  await resequence(row.productId);
  await revalidateProduct(row.productId);
}

export async function moveImage(imageId: string, direction: "left" | "right") {
  const row = await db.query.productImages.findFirst({ where: eq(productImages.id, imageId) });
  if (!row) return;

  const siblings = await db.query.productImages.findMany({
    where: eq(productImages.productId, row.productId),
    orderBy: asc(productImages.sortOrder),
  });
  const index = siblings.findIndex((s) => s.id === imageId);
  const swapWith = direction === "left" ? index - 1 : index + 1;
  if (swapWith < 0 || swapWith >= siblings.length) return;

  const other = siblings[swapWith];
  await db.update(productImages).set({ sortOrder: other.sortOrder }).where(eq(productImages.id, row.id));
  await db.update(productImages).set({ sortOrder: row.sortOrder }).where(eq(productImages.id, other.id));
  await revalidateProduct(row.productId);
}

export async function setCoverImage(imageId: string) {
  const row = await db.query.productImages.findFirst({ where: eq(productImages.id, imageId) });
  if (!row || row.sortOrder === 0) return;

  const cover = await db.query.productImages.findFirst({
    where: eq(productImages.productId, row.productId),
    orderBy: asc(productImages.sortOrder),
  });
  if (cover) {
    await db.update(productImages).set({ sortOrder: row.sortOrder }).where(eq(productImages.id, cover.id));
  }
  await db.update(productImages).set({ sortOrder: 0 }).where(eq(productImages.id, row.id));
  await revalidateProduct(row.productId);
}
