"use client";

import Link from "next/link";
import { logout } from "@/actions/auth";
import { BottomTabs } from "@/components/admin/BottomTabs";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useT } from "@/locales/useTranslation";

export default function AdminShellLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { t } = useT();
  return (
    <div>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-ink/95 px-4 backdrop-blur">
        <span className="font-heading text-lg text-cream">{t("admin.common.brand")}</span>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Link href="/admin/password" className="text-sm text-muted">
            {t("admin.common.passwordLink")}
          </Link>
          <form action={logout}>
            <button type="submit" className="text-sm text-muted">
              {t("admin.common.logout")}
            </button>
          </form>
        </div>
      </header>

      {children}

      <BottomTabs />
    </div>
  );
}
