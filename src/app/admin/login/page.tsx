"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useActionState } from "react";
import { login, type LoginState } from "@/actions/auth";

const initialState: LoginState = {};

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <form action={formAction} className="w-full max-w-xs">
      <input type="hidden" name="next" value={next} />

      <label className="block text-sm text-muted">
        Логин
        <input
          name="login"
          autoComplete="username"
          required
          className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
        />
      </label>

      <label className="mt-4 block text-sm text-muted">
        Пароль
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
        />
      </label>

      {state.error && <p className="mt-3 text-sm text-red-400">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 h-12 w-full rounded-full bg-gradient-to-r from-gold to-gold-light font-medium text-ink disabled:opacity-60"
      >
        {pending ? "Входим…" : "Войти"}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <Image src="/AyButik86_logo.png" alt="AyButik86" width={64} height={64} className="mb-4 rounded-full" />
      <h1 className="mb-6 font-heading text-xl text-cream">Вход в админку</h1>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
