"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ContactsIcon,
  ImageStackIcon,
  ProductsIcon,
  TagIcon,
} from "@/components/icons";

const TABS = [
  { href: "/admin/products", label: "Товары", Icon: ProductsIcon },
  { href: "/admin/categories", label: "Категории", Icon: TagIcon },
  { href: "/admin/hero", label: "Оформление", Icon: ImageStackIcon },
  { href: "/admin/settings", label: "Контакты", Icon: ContactsIcon },
];

// Показываем табы только на самих разделах — на подстраницах (редактирование
// товара, смена пароля) снизу уже есть своя панель действий, дублировать некуда.
export function BottomTabs() {
  const pathname = usePathname();
  if (!TABS.some((t) => t.href === pathname)) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-ink/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {TABS.map(({ href, label, Icon }) => {
        const active = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[11px] ${
              active ? "text-gold-light" : "text-muted"
            }`}
          >
            <Icon className="h-5 w-5" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
