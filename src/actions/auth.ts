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

export type LoginState = { errorKey?: string; errorParams?: Record<string, string | number> };

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
    return { errorKey: "admin.login.errorLockout", errorParams: { minutes: minutesLeft } };
  }

  const genericError = { errorKey: "admin.login.errorInvalidCredentials" };

  if (!row || row.adminLogin !== login) {
    return genericError;
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
    return genericError;
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

export type ChangePasswordState = { errorKey?: string; success?: boolean };

export async function changePassword(_prev: ChangePasswordState, formData: FormData): Promise<ChangePasswordState> {
  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const newPasswordRepeat = String(formData.get("newPasswordRepeat") ?? "");

  if (newPassword.length < 6) {
    return { errorKey: "admin.password.errorTooShort" };
  }
  if (newPassword !== newPasswordRepeat) {
    return { errorKey: "admin.password.errorMismatch" };
  }

  const row = await db.query.settings.findFirst({ where: eq(settings.id, "main") });
  if (!row) return { errorKey: "admin.password.errorSettingsNotFound" };

  const ok = await bcrypt.compare(currentPassword, row.adminPasswordHash);
  if (!ok) return { errorKey: "admin.password.errorWrongCurrent" };

  const newHash = await bcrypt.hash(newPassword, 12);
  await db.update(settings).set({ adminPasswordHash: newHash }).where(eq(settings.id, "main"));

  return { success: true };
}
