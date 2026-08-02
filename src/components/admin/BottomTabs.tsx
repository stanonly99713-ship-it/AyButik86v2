"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ContactsIcon,
  ImageStackIcon,
  ProductsIcon,
  TagIcon,
} from "@/components/icons";
import { useT } from "@/locales/useTranslation";

const TABS = [
  { href: "/admin/products", labelKey: "admin.tabs.products", Icon: ProductsIcon },
  { href: "/admin/categories", labelKey: "admin.tabs.categories", Icon: TagIcon },
  { href: "/admin/hero", labelKey: "admin.tabs.hero", Icon: ImageStackIcon },
  { href: "/admin/settings", labelKey: "admin.tabs.settings", Icon: ContactsIcon },
];

// Показываем табы только на самих разделах — на подстраницах (редактирование
// товара, смена пароля) снизу уже есть своя панель действий, дублировать некуда.
export function BottomTabs() {
  const pathname = usePathname();
  const { t } = useT();
  if (!TABS.some((tab) => tab.href === pathname)) return null;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-30 flex border-t border-line bg-ink/95 backdrop-blur"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      {TABS.map(({ href, labelKey, Icon }) => {
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
            {t(labelKey)}
          </Link>
        );
      })}
    </nav>
  );
}
