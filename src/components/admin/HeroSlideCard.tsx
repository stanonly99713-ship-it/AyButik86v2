"use client";

import { useActionState, useState, useTransition } from "react";
import { attachHeroImage, deleteHeroSlide, moveHeroSlide, updateHeroSlide, type HeroFormState } from "@/actions/hero";
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "@/components/icons";
import { SingleImageUploader } from "@/components/admin/SingleImageUploader";
import { useT } from "@/locales/useTranslation";

type Slide = {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonHref: string;
  isActive: boolean;
};

const initialState: HeroFormState = {};

export function HeroSlideCard({ slide, isFirst, isLast }: { slide: Slide; isFirst: boolean; isLast: boolean }) {
  const boundUpdate = updateHeroSlide.bind(null, slide.id);
  const [state, formAction, pending] = useActionState(boundUpdate, initialState);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [moving, startTransition] = useTransition();
  const { t } = useT();

  return (
    <div className="rounded-lg border border-line bg-surface p-3">
      <SingleImageUploader
        currentUrl={slide.imageUrl || null}
        pathnamePrefix={`hero/${slide.id}`}
        onUploaded={(r) => attachHeroImage({ heroSlideId: slide.id, ...r })}
        label={t("admin.heroSlideCard.uploadLabel")}
        aspectClassName="aspect-[16/9]"
      />

      <form action={formAction} className="mt-3 flex flex-col gap-2">
        <input
          name="title"
          defaultValue={slide.title}
          placeholder={t("admin.heroSlideCard.titlePlaceholder")}
          className="h-11 rounded-lg border border-line bg-surface-2 px-3 text-cream outline-none focus:border-gold"
        />
        <input
          name="subtitle"
          defaultValue={slide.subtitle}
          placeholder={t("admin.heroSlideCard.subtitlePlaceholder")}
          className="h-11 rounded-lg border border-line bg-surface-2 px-3 text-cream outline-none focus:border-gold"
        />
        <div className="flex gap-2">
          <input
            name="buttonText"
            defaultValue={slide.buttonText}
            placeholder={t("admin.heroSlideCard.buttonTextPlaceholder")}
            className="h-11 w-1/2 rounded-lg border border-line bg-surface-2 px-3 text-cream outline-none focus:border-gold"
          />
          <input
            name="buttonHref"
            defaultValue={slide.buttonHref}
            placeholder="/catalog"
            className="h-11 w-1/2 rounded-lg border border-line bg-surface-2 px-3 text-cream outline-none focus:border-gold"
          />
        </div>
        <label className="flex h-10 items-center gap-2 text-sm text-cream">
          <input type="checkbox" name="isActive" defaultChecked={slide.isActive} className="h-5 w-5 accent-gold" />
          {t("admin.heroSlideCard.activeLabel")}
        </label>

        {state.error && <p className="text-xs text-red-400">{state.error}</p>}
        {state.success && <p className="text-xs text-gold-light">{t("common.saved")}</p>}

        <button
          type="submit"
          disabled={pending}
          className="h-10 rounded-full bg-gradient-to-r from-gold to-gold-light text-sm font-medium text-ink disabled:opacity-60"
        >
          {t("common.save")}
        </button>
      </form>

      <div className="mt-3 flex items-center justify-between border-t border-line pt-2">
        <div className="flex gap-0.5">
          <button
            type="button"
            aria-label={t("admin.photoUploader.moveLeftAria")}
            disabled={moving || isFirst}
            onClick={() => startTransition(() => moveHeroSlide(slide.id, "left"))}
            className="flex h-9 w-9 items-center justify-center text-cream disabled:opacity-30"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={t("admin.photoUploader.moveRightAria")}
            disabled={moving || isLast}
            onClick={() => startTransition(() => moveHeroSlide(slide.id, "right"))}
            className="flex h-9 w-9 items-center justify-center text-cream disabled:opacity-30"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>

        {!confirmDelete ? (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="flex h-9 items-center gap-1 px-2 text-sm text-red-400"
          >
            <TrashIcon className="h-4 w-4" /> {t("admin.heroSlideCard.deleteSlide")}
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted">{t("admin.heroSlideCard.confirmQuestion")}</span>
            <button
              type="button"
              onClick={() => startTransition(() => deleteHeroSlide(slide.id))}
              className="rounded-full bg-red-500/90 px-3 py-1.5 text-xs font-medium text-white"
            >
              {t("common.confirmDelete")}
            </button>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="rounded-full border border-line px-3 py-1.5 text-xs text-muted"
            >
              {t("common.cancel")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
