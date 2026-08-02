"use client";

import { useActionState } from "react";
import { attachPromoImage, updatePromo, type SettingsFormState } from "@/actions/settings";
import { SingleImageUploader } from "@/components/admin/SingleImageUploader";
import { useT } from "@/locales/useTranslation";

const initialState: SettingsFormState = {};

export function PromoBannerForm({ promoTitle, promoText, promoImageUrl }: { promoTitle: string; promoText: string; promoImageUrl: string | null }) {
  const [state, formAction, pending] = useActionState(updatePromo, initialState);
  const { t } = useT();

  return (
    <div className="rounded-lg border border-line bg-surface p-3">
      <SingleImageUploader
        currentUrl={promoImageUrl}
        pathnamePrefix="promo"
        onUploaded={(r) => attachPromoImage(r)}
        label={t("admin.promoBannerForm.uploadLabel")}
        aspectClassName="aspect-[3/2]"
      />

      <form action={formAction} className="mt-3 flex flex-col gap-2">
        <input
          name="promoTitle"
          defaultValue={promoTitle}
          placeholder={t("admin.promoBannerForm.titlePlaceholder")}
          className="h-11 rounded-lg border border-line bg-surface-2 px-3 text-cream outline-none focus:border-gold"
        />
        <textarea
          name="promoText"
          defaultValue={promoText}
          rows={2}
          placeholder={t("admin.promoBannerForm.textPlaceholder")}
          className="rounded-lg border border-line bg-surface-2 px-3 py-2 text-cream outline-none focus:border-gold"
        />

        {state.errorKey && <p className="text-xs text-red-400">{t(state.errorKey)}</p>}
        {state.success && <p className="text-xs text-gold-light">{t("common.saved")}</p>}

        <button
          type="submit"
          disabled={pending}
          className="h-10 rounded-full bg-gradient-to-r from-gold to-gold-light text-sm font-medium text-ink disabled:opacity-60"
        >
          {t("common.save")}
        </button>
      </form>
    </div>
  );
}
