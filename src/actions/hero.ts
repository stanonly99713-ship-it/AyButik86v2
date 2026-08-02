"use server";

import { del } from "@vercel/blob";
import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { heroSlides } from "@/db/schema";

function revalidateHome() {
  revalidatePath("/");
  revalidatePath("/admin/hero");
}

export async function createHeroSlide() {
  const existing = await db.query.heroSlides.findMany({ orderBy: asc(heroSlides.sortOrder) });
  const nextSortOrder = existing.length > 0 ? existing[existing.length - 1].sortOrder + 1 : 0;

  await db.insert(heroSlides).values({
    imageUrl: "",
    pathname: "",
    title: "Новый слайд",
    isActive: false,
    sortOrder: nextSortOrder,
  });
  revalidateHome();
}

export type AttachHeroImageInput = { heroSlideId: string; url: string; pathname: string };

export async function attachHeroImage(input: AttachHeroImageInput) {
  const row = await db.query.heroSlides.findFirst({ where: eq(heroSlides.id, input.heroSlideId) });
  if (row?.pathname) {
    await del(row.pathname).catch(() => {});
  }
  await db
    .update(heroSlides)
    .set({ imageUrl: input.url, pathname: input.pathname })
    .where(eq(heroSlides.id, input.heroSlideId));
  revalidateHome();
}

export type HeroFormState = { error?: string; success?: boolean };

export async function updateHeroSlide(id: string, _prev: HeroFormState, formData: FormData): Promise<HeroFormState> {
  const title = String(formData.get("title") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim();
  const buttonText = String(formData.get("buttonText") ?? "").trim() || "Узнать больше";
  const buttonHref = String(formData.get("buttonHref") ?? "").trim() || "/catalog";
  const isActive = formData.get("isActive") === "on";

  await db
    .update(heroSlides)
    .set({ title, subtitle, buttonText, buttonHref, isActive })
    .where(eq(heroSlides.id, id));

  revalidateHome();
  return { success: true };
}

export async function moveHeroSlide(id: string, direction: "left" | "right") {
  const all = await db.query.heroSlides.findMany({ orderBy: asc(heroSlides.sortOrder) });
  const index = all.findIndex((s) => s.id === id);
  const swapWith = direction === "left" ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= all.length) return;

  const a = all[index];
  const b = all[swapWith];
  await db.update(heroSlides).set({ sortOrder: b.sortOrder }).where(eq(heroSlides.id, a.id));
  await db.update(heroSlides).set({ sortOrder: a.sortOrder }).where(eq(heroSlides.id, b.id));
  revalidateHome();
}

export async function deleteHeroSlide(id: string) {
  const row = await db.query.heroSlides.findFirst({ where: eq(heroSlides.id, id) });
  if (row?.pathname) {
    await del(row.pathname).catch(() => {});
  }
  await db.delete(heroSlides).where(eq(heroSlides.id, id));
  revalidateHome();
}
