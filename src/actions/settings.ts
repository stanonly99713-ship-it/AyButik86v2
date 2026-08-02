"use server";

import { del } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { settings } from "@/db/schema";

function revalidateStorefront() {
  revalidatePath("/");
  revalidatePath("/catalog");
  revalidatePath("/contacts");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/hero");
}

export type SettingsFormState = { errorKey?: string; success?: boolean };

export async function updateContacts(_prev: SettingsFormState, formData: FormData): Promise<SettingsFormState> {
  const phone = String(formData.get("phone") ?? "").trim();
  const whatsappRaw = String(formData.get("whatsapp") ?? "").trim();
  const whatsapp = whatsappRaw.replace(/\D/g, "");
  const address = String(formData.get("address") ?? "").trim();
  const workingHours = String(formData.get("workingHours") ?? "").trim();
  const instagram = String(formData.get("instagram") ?? "").trim();
  const telegram = String(formData.get("telegram") ?? "").trim();
  const mapEmbedUrl = String(formData.get("mapEmbedUrl") ?? "").trim();

  if (!phone) return { errorKey: "admin.contactsForm.errorMissingPhone" };
  if (!whatsapp) return { errorKey: "admin.contactsForm.errorMissingWhatsapp" };

  await db
    .update(settings)
    .set({ phone, whatsapp, address, workingHours, instagram, telegram, mapEmbedUrl, updatedAt: new Date() })
    .where(eq(settings.id, "main"));

  revalidateStorefront();
  return { success: true };
}

export async function updatePromo(_prev: SettingsFormState, formData: FormData): Promise<SettingsFormState> {
  const promoTitle = String(formData.get("promoTitle") ?? "").trim();
  const promoText = String(formData.get("promoText") ?? "").trim();

  await db.update(settings).set({ promoTitle, promoText, updatedAt: new Date() }).where(eq(settings.id, "main"));

  revalidateStorefront();
  return { success: true };
}

export async function attachPromoImage(input: { url: string; pathname: string }) {
  const row = await db.query.settings.findFirst({ where: eq(settings.id, "main") });
  if (row?.promoPathname) {
    await del(row.promoPathname).catch(() => {});
  }
  await db
    .update(settings)
    .set({ promoImageUrl: input.url, promoPathname: input.pathname, updatedAt: new Date() })
    .where(eq(settings.id, "main"));
  revalidateStorefront();
}
