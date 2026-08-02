import Link from "next/link";
import { logout } from "@/actions/auth";
import { BottomTabs } from "@/components/admin/BottomTabs";

export default function AdminShellLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-line bg-ink/95 px-4 backdrop-blur">
        <span className="font-heading text-lg text-cream">AyButik86 · Админ</span>
        <div className="flex items-center gap-4">
          <Link href="/admin/password" className="text-sm text-muted">
            Пароль
          </Link>
          <form action={logout}>
            <button type="submit" className="text-sm text-muted">
              Выйти
            </button>
          </form>
        </div>
      </header>

      {children}

      <BottomTabs />
    </div>
  );
}
