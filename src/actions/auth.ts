"use server";

import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { settings } from "@/db/schema";
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

const LOCK_MINUTES = 15;
const MAX_ATTEMPTS = 5;

export type LoginState = { error?: string };

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const login = String(formData.get("login") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  await sleep(400); // не даём понять по времени ответа, верный ли был логин

  const row = await db.query.settings.findFirst({ where: eq(settings.id, "main") });

  if (row?.lockedUntil && row.lockedUntil > new Date()) {
    const minutesLeft = Math.ceil((row.lockedUntil.getTime() - Date.now()) / 60000);
    return { error: `Слишком много попыток. Попробуйте снова через ${minutesLeft} мин.` };
  }

  const genericError = "Неверный логин или пароль";

  if (!row || row.adminLogin !== login) {
    return { error: genericError };
  }

  const passwordOk = await bcrypt.compare(password, row.adminPasswordHash);
  if (!passwordOk) {
    const failedCount = row.failedLoginCount + 1;
    await db
      .update(settings)
      .set({
        failedLoginCount: failedCount,
        lockedUntil: failedCount >= MAX_ATTEMPTS ? new Date(Date.now() + LOCK_MINUTES * 60_000) : null,
      })
      .where(eq(settings.id, "main"));
    return { error: genericError };
  }

  await db.update(settings).set({ failedLoginCount: 0, lockedUntil: null }).where(eq(settings.id, "main"));

  const token = await createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  redirect(next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
  redirect("/admin/login");
}

export type ChangePasswordState = { error?: string; success?: boolean };

export async function changePassword(_prev: ChangePasswordState, formData: FormData): Promise<ChangePasswordState> {
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const newPasswordRepeat = String(formData.get("newPasswordRepeat") ?? "");

  if (newPassword.length < 6) {
    return { error: "Новый пароль должен быть не короче 6 символов" };
  }
  if (newPassword !== newPasswordRepeat) {
    return { error: "Пароли не совпадают" };
  }

  const row = await db.query.settings.findFirst({ where: eq(settings.id, "main") });
  if (!row) return { error: "Настройки не найдены" };

  const ok = await bcrypt.compare(currentPassword, row.adminPasswordHash);
  if (!ok) return { error: "Текущий пароль неверный" };

  const newHash = await bcrypt.hash(newPassword, 12);
  await db.update(settings).set({ adminPasswordHash: newHash }).where(eq(settings.id, "main"));

  return { success: true };
}
