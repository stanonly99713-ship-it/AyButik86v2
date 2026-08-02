"use client";

import { useActionState } from "react";
import { updateContacts, type SettingsFormState } from "@/actions/settings";
import type { Settings } from "@/lib/types";

const initialState: SettingsFormState = {};

export function ContactsForm({ settings }: { settings: Settings }) {
  const [state, formAction, pending] = useActionState(updateContacts, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label className="block text-sm text-muted">
        Телефон
        <input
          name="phone"
          type="tel"
          defaultValue={settings.phone}
          placeholder="+7 926 925 96 86"
          required
          className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
        />
      </label>

      <label className="block text-sm text-muted">
        WhatsApp
        <input
          name="whatsapp"
          type="tel"
          defaultValue={settings.whatsapp}
          placeholder="79269259686"
          required
          className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
        />
      </label>
      <p className="-mt-2 text-xs text-muted">Можно вводить как угодно — лишние символы уберутся сами.</p>

      <label className="block text-sm text-muted">
        Адрес
        <input
          name="address"
          defaultValue={settings.address}
          placeholder="г. Москва, ул. Пражская, д. 4, корп. Б"
          className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
        />
      </label>

      <label className="block text-sm text-muted">
        Часы работы
        <input
          name="workingHours"
          defaultValue={settings.workingHours}
          placeholder="9:00 - 21:00 (ежедневно)"
          className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
        />
      </label>

      <label className="block text-sm text-muted">
        Instagram
        <input
          name="instagram"
          defaultValue={settings.instagram}
          placeholder="https://instagram.com/…"
          className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
        />
      </label>

      <label className="block text-sm text-muted">
        Telegram
        <input
          name="telegram"
          defaultValue={settings.telegram}
          placeholder="https://t.me/…"
          className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
        />
      </label>

      <label className="block text-sm text-muted">
        Ссылка на карту (Яндекс.Карты, код для вставки)
        <textarea
          name="mapEmbedUrl"
          defaultValue={settings.mapEmbedUrl}
          rows={2}
          placeholder="https://yandex.ru/map-widget/…"
          className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-cream outline-none focus:border-gold"
        />
      </label>

      {state.error && <p className="text-sm text-red-400">{state.error}</p>}
      {state.success && <p className="text-sm text-gold-light">Сохранено</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 h-12 rounded-full bg-gradient-to-r from-gold to-gold-light font-medium text-ink disabled:opacity-60"
      >
        {pending ? "Сохраняем…" : "Сохранить"}
      </button>
    </form>
  );
}
