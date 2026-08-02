"use server";

import { asc, count, eq, ne } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { slugify } from "@/lib/slug";

async function ensureUniqueCategorySlug(base: string, excludeId?: string): Promise<string> {
  const safeBase = base || "kategoriya";
  let candidate = safeBase;
  let attempt = 1;

  while (true) {
    const rows = await db.query.categories.findMany({ where: eq(categories.slug, candidate) });
    const conflict = excludeId ? rows.filter((r) => r.id !== excludeId) : rows;
    if (conflict.length === 0) return candidate;
    attempt += 1;
    candidate = `${safeBase}-${attempt}`;
  }
}

function revalidateStorefront() {
  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/admin/categories");
}

export type CategoryFormState = { errorKey?: string; errorParams?: Record<string, string | number> };

export async function createCategory(_prev: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { errorKey: "admin.categoryForm.errorEmptyName" };

  const existing = await db.query.categories.findMany({ orderBy: asc(categories.sortOrder) });
  const nextSortOrder = existing.length > 0 ? existing[existing.length - 1].sortOrder + 1 : 0;

  const slug = await ensureUniqueCategorySlug(slugify(name));
  await db.insert(categories).values({ name, slug, sortOrder: nextSortOrder });

  revalidateStorefront();
  return {};
}

export async function renameCategory(id: string, name: string): Promise<CategoryFormState> {
  const trimmed = name.trim();
  if (!trimmed) return { errorKey: "admin.categoryRow.errorEmptyName" };

  await db.update(categories).set({ name: trimmed }).where(eq(categories.id, id));
  revalidateStorefront();
  return {};
}

export async function moveCategory(id: string, direction: "left" | "right") {
  const all = await db.query.categories.findMany({ orderBy: asc(categories.sortOrder) });
  const index = all.findIndex((c) => c.id === id);
  const swapWith = direction === "left" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= all.length) return;

  const a = all[index];
  const b = all[swapWith];
  await db.update(categories).set({ sortOrder: b.sortOrder }).where(eq(categories.id, a.id));
  await db.update(categories).set({ sortOrder: a.sortOrder }).where(eq(categories.id, b.id));
  revalidateStorefront();
}

export async function deleteCategory(id: string): Promise<CategoryFormState> {
  const [{ value }] = await db.select({ value: count() }).from(products).where(eq(products.categoryId, id));
  if (value > 0) {
    return { errorKey: "admin.categoryRow.errorNotEmpty", errorParams: { count: value } };
  }

  await db.delete(categories).where(eq(categories.id, id));
  revalidateStorefront();
  return {};
}
