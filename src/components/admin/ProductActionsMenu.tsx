"use client";

import { useState, useTransition } from "react";
import { deleteProduct, setPublished } from "@/actions/products";
import { useT } from "@/locales/useTranslation";

type Props = { id: string; name: string; isPublished: boolean };

export function ProductActionsMenu({ id, name, isPublished }: Props) {
  const { t } = useT();
  const [open, setOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pending, startTransition] = useTransition();

  function close() {
    setOpen(false);
    setConfirmDelete(false);
  }

  return (
    <>
      <button
        type="button"
        aria-label={t("admin.productActions.menuAria")}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className="flex h-11 w-11 shrink-0 items-center justify-center text-2xl text-muted"
      >
        ⋯
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end">
          <button type="button" aria-label={t("common.close")} className="absolute inset-0 bg-black/60" onClick={close} />
          <div className="relative w-full rounded-t-2xl bg-surface p-4 pb-[calc(env(safe-area-inset-bottom)+16px)]">
            {!confirmDelete ? (
              <>
                <p className="mb-3 line-clamp-1 px-2 text-sm text-muted">{name}</p>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      await setPublished(id, !isPublished);
                      close();
                    })
                  }
                  className="flex h-12 w-full items-center rounded-lg px-3 text-left text-cream"
                >
                  {isPublished ? t("admin.productActions.unpublish") : t("admin.productActions.publish")}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="flex h-12 w-full items-center rounded-lg px-3 text-left text-red-400"
                >
                  {t("common.delete")}
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-lg border border-line text-muted"
                >
                  {t("common.cancel")}
                </button>
              </>
            ) : (
              <>
                <p className="mb-4 px-2 text-sm text-cream">
                  {t("admin.productActions.confirmText", { name })}
                </p>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => startTransition(() => deleteProduct(id))}
                  className="flex h-12 w-full items-center justify-center rounded-lg bg-red-500/90 font-medium text-white disabled:opacity-60"
                >
                  {t("common.confirmDelete")}
                </button>
                <button
                  type="button"
                  onClick={close}
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-lg border border-line text-muted"
                >
                  {t("common.cancel")}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
