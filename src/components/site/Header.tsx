"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { CloseIcon, MenuIcon, SearchIcon, WhatsAppIcon } from "@/components/icons";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import type { Category } from "@/lib/types";

export function Header({ categories, whatsapp }: { categories: Category[]; whatsapp: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  // Блокируем прокрутку страницы, пока открыта шторка или поиск —
  // иначе фон скроллится под оверлеем на мобильном.
  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    setSearchOpen(false);
    router.push(q ? `/catalog?q=${encodeURIComponent(q)}` : "/catalog");
  }

  return (
    <>
      <header className="sticky top-0 z-40 h-14 border-b border-line bg-ink/90 backdrop-blur">
        <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-4">
          <button
            type="button"
            aria-label="Открыть меню"
            className="flex h-11 w-11 items-center justify-center text-cream"
            onClick={() => setMenuOpen(true)}
          >
            <MenuIcon className="h-6 w-6" />
          </button>

          <Link href="/" className="font-heading italic text-lg tracking-wide gold-gradient-text">
            AyButik86
          </Link>

          <button
            type="button"
            aria-label="Поиск"
            className="flex h-11 w-11 items-center justify-center text-cream"
            onClick={() => setSearchOpen(true)}
          >
            <SearchIcon className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Полноэкранный поиск */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-ink/98 backdrop-blur">
          <form onSubmit={submitSearch} className="flex h-14 items-center gap-2 border-b border-line px-4">
            <SearchIcon className="h-5 w-5 shrink-0 text-muted" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Искать товары…"
              className="h-full flex-1 bg-transparent text-cream placeholder:text-muted outline-none"
            />
            <button
              type="button"
              aria-label="Закрыть поиск"
              className="flex h-11 w-11 items-center justify-center text-cream"
              onClick={() => setSearchOpen(false)}
            >
              <CloseIcon className="h-5 w-5" />
            </button>
          </form>
          <div className="px-4 pt-6">
            <p className="mb-3 text-xs uppercase tracking-wider text-muted">Категории</p>
            <ul className="flex flex-col gap-1">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/catalog?cat=${c.slug}`}
                    onClick={() => setSearchOpen(false)}
                    className="block py-2.5 text-cream"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Шторка меню */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex w-[85%] max-w-sm flex-col overflow-y-auto bg-surface pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center justify-between px-4 py-3">
              <Image src="/AyButik86_logo.png" alt="AyButik86" width={36} height={36} className="rounded-full" />
              <button
                type="button"
                aria-label="Закрыть меню"
                className="flex h-11 w-11 items-center justify-center text-cream"
                onClick={() => setMenuOpen(false)}
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col px-4">
              <Link href="/catalog" onClick={() => setMenuOpen(false)} className="border-b border-line py-3 text-cream">
                Каталог
              </Link>
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/catalog?cat=${c.slug}`}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-line py-3 text-sm text-muted"
                >
                  {c.name}
                </Link>
              ))}
              <Link href="/contacts" onClick={() => setMenuOpen(false)} className="border-b border-line py-3 text-cream">
                Контакты
              </Link>
            </nav>

            <div className="mt-auto p-4">
              <a
                href={buildWhatsAppLink(whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-light font-medium text-ink"
              >
                <WhatsAppIcon className="h-5 w-5" />
                Написать в WhatsApp
              </a>
            </div>
          </div>
          <button
            type="button"
            aria-label="Закрыть меню"
            className="flex-1 bg-black/60"
            onClick={() => setMenuOpen(false)}
          />
        </div>
      )}
    </>
  );
}
