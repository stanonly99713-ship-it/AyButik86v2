"use client";

export default function SiteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="flex min-h-[60svh] flex-col items-center justify-center px-6 text-center">
      <p className="font-heading text-5xl text-gold-light">Ой</p>
      <h1 className="mt-3 text-lg text-cream">Что-то пошло не так</h1>
      <p className="mt-2 text-sm text-muted">Попробуйте обновить страницу.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 inline-flex h-11 items-center rounded-full bg-gradient-to-r from-gold to-gold-light px-6 text-sm font-medium text-ink"
      >
        Обновить
      </button>
    </div>
  );
}
