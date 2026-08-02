"use client";

import { useActionState } from "react";
import { updateContacts, type SettingsFormState } from "@/actions/settings";
import { useT } from "@/locales/useTranslation";
import type { Settings } from "@/lib/types";

const initialState: SettingsFormState = {};

export function ContactsForm({ settings }: { settings: Settings }) {
  const [state, formAction, pending] = useActionState(updateContacts, initialState);
  const { t } = useT();

  return (
    <form action={formAction} className="flex flex-col gap-3">
      <label className="block text-sm text-muted">
        {t("admin.contactsForm.phoneLabel")}
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
        {t("admin.contactsForm.whatsappLabel")}
        <input
          name="whatsapp"
          type="tel"
          defaultValue={settings.whatsapp}
          placeholder="79269259686"
          required
          className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
        />
      </label>
      <p className="-mt-2 text-xs text-muted">{t("admin.contactsForm.whatsappHelp")}</p>

      <label className="block text-sm text-muted">
        {t("admin.contactsForm.addressLabel")}
        <input
          name="address"
          defaultValue={settings.address}
          placeholder={t("admin.contactsForm.addressPlaceholder")}
          className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
        />
      </label>

      <label className="block text-sm text-muted">
        {t("admin.contactsForm.hoursLabel")}
        <input
          name="workingHours"
          defaultValue={settings.workingHours}
          placeholder={t("admin.contactsForm.hoursPlaceholder")}
          className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
        />
      </label>

      <label className="block text-sm text-muted">
        {t("admin.contactsForm.instagramLabel")}
        <input
          name="instagram"
          defaultValue={settings.instagram}
          placeholder="https://instagram.com/…"
          className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
        />
      </label>

      <label className="block text-sm text-muted">
        {t("admin.contactsForm.telegramLabel")}
        <input
          name="telegram"
          defaultValue={settings.telegram}
          placeholder="https://t.me/…"
          className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
        />
      </label>

      <label className="block text-sm text-muted">
        {t("admin.contactsForm.mapLabel")}
        <textarea
          name="mapEmbedUrl"
          defaultValue={settings.mapEmbedUrl}
          rows={2}
          placeholder="https://yandex.ru/map-widget/…"
          className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-cream outline-none focus:border-gold"
        />
      </label>

      {state.errorKey && <p className="text-sm text-red-400">{t(state.errorKey)}</p>}
      {state.success && <p className="text-sm text-gold-light">{t("common.saved")}</p>}

      <button
        type="submit"
        disabled={pending}
        className="mt-2 h-12 rounded-full bg-gradient-to-r from-gold to-gold-light font-medium text-ink disabled:opacity-60"
      >
        {pending ? t("common.saving") : t("common.save")}
      </button>
    </form>
  );
}
