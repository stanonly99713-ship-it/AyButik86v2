"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense, useActionState } from "react";
import { login, type LoginState } from "@/actions/auth";
import { useT } from "@/locales/useTranslation";

const initialState: LoginState = {};

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";
  const [state, formAction, pending] = useActionState(login, initialState);
  const { t } = useT();

  return (
    <form action={formAction} className="w-full max-w-xs">
      <input type="hidden" name="next" value={next} />

      <label className="block text-sm text-muted">
        {t("admin.login.loginLabel")}
        <input
          name="login"
          autoComplete="username"
          required
          className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
        />
      </label>

      <label className="mt-4 block text-sm text-muted">
        {t("admin.login.passwordLabel")}
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
        />
      </label>

      {state.errorKey && (
        <p className="mt-3 text-sm text-red-400">{t(state.errorKey, state.errorParams)}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-6 h-12 w-full rounded-full bg-gradient-to-r from-gold to-gold-light font-medium text-ink disabled:opacity-60"
      >
        {pending ? t("admin.login.signingIn") : t("admin.login.signIn")}
      </button>
    </form>
  );
}

export default function AdminLoginPage() {
  const { t } = useT();
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-6">
      <Image src="/logo-128.webp" alt="AyButik86" width={64} height={64} className="mb-4 rounded-full" />
      <h1 className="mb-6 font-heading text-xl text-cream">{t("admin.login.title")}</h1>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
