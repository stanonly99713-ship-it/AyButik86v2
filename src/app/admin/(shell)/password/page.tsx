"use client";

import Link from "next/link";
import { useActionState } from "react";
import { changePassword, type ChangePasswordState } from "@/actions/auth";
import { ChevronLeftIcon } from "@/components/icons";

const initialState: ChangePasswordState = {};

export default function ChangePasswordPage() {
  const [state, formAction, pending] = useActionState(changePassword, initialState);

  return (
    <div className="px-4 py-4 pb-24">
      <div className="mb-4 flex items-center gap-2">
        <Link href="/admin/products" aria-label="Назад" className="-ml-2 flex h-11 w-11 items-center justify-center">
          <ChevronLeftIcon className="h-5 w-5 text-cream" />
        </Link>
        <h1 className="text-lg text-cream">Смена пароля</h1>
      </div>

      <form action={formAction} className="max-w-sm">
        <label className="block text-sm text-muted">
          Текущий пароль
          <input
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
            className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
          />
        </label>
        <label className="mt-4 block text-sm text-muted">
          Новый пароль
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
          Повторите новый пароль
          <input
            name="newPasswordRepeat"
            type="password"
            autoComplete="new-password"
            required
            minLength={6}
            className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
          />
        </label>

        {state.error && <p className="mt-4 text-sm text-red-400">{state.error}</p>}
        {state.success && <p className="mt-4 text-sm text-gold-light">Пароль изменён.</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-6 h-12 w-full rounded-full bg-gradient-to-r from-gold to-gold-light font-medium text-ink disabled:opacity-60"
        >
          {pending ? "Сохраняем…" : "Сохранить"}
        </button>
      </form>
    </div>
  );
}
