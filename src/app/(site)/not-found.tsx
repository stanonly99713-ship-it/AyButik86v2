import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60svh] flex-col items-center justify-center px-6 text-center">
      <p className="font-heading text-5xl text-gold-light">404</p>
      <h1 className="mt-3 text-lg text-cream">Страница не найдена</h1>
      <p className="mt-2 text-sm text-muted">
        Возможно, товар сняли с публикации или ссылка устарела.
      </p>
      <Link
        href="/catalog"
        className="mt-6 inline-flex h-11 items-center rounded-full bg-gradient-to-r from-gold to-gold-light px-6 text-sm font-medium text-ink"
      >
        Перейти в каталог
      </Link>
    </div>
  );
}
