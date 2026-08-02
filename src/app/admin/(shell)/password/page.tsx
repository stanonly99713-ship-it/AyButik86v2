"use client";

import Link from "next/link";
import { useActionState } from "react";
import { changePassword, type ChangePasswordState } from "@/actions/auth";
import { ChevronLeftIcon } from "@/components/icons";
import { useT } from "@/locales/useTranslation";

const initialState: ChangePasswordState = {};

export default function ChangePasswordPage() {
  const [state, formAction, pending] = useActionState(changePassword, initialState);
  const { t } = useT();

  return (
    <div className="px-4 py-4 pb-24">
      <div className="mb-4 flex items-center gap-2">
        <Link href="/admin/products" aria-label={t("admin.common.back")} className="-ml-2 flex h-11 w-11 items-center justify-center">
          <ChevronLeftIcon className="h-5 w-5 text-cream" />
        </Link>
        <h1 className="text-lg text-cream">{t("admin.password.title")}</h1>
      </div>

      <form action={formAction} className="max-w-sm">
        <label className="block text-sm text-muted">
          {t("admin.password.currentPassword")}
          <input
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
            className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
          />
        </label>
        <label className="mt-4 block text-sm text-muted">
          {t("admin.password.newPassword")}
          <input
            name="newPassword"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
          />
        </label>
        <label className="mt-4 block text-sm text-muted">
          {t("admin.password.repeatPassword")}
          <input
            name="newPasswordRepeat"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
          />
        </label>

        {state.errorKey && <p className="mt-4 text-sm text-red-400">{t(state.errorKey)}</p>}
        {state.success && <p className="mt-4 text-sm text-gold-light">{t("admin.password.success")}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 h-12 w-full rounded-full bg-gradient-to-r from-gold to-gold-light font-medium text-ink disabled:opacity-60"
        >
          {pending ? t("common.saving") : t("common.save")}
        </button>
      </form>
    </div>
  );
}
