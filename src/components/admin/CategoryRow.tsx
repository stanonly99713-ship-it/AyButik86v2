"use client";

import { useState, useTransition } from "react";
import { deleteCategory, moveCategory, renameCategory } from "@/actions/categories";
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "@/components/icons";
import { useT } from "@/locales/useTranslation";

type Props = {
  id: string;
  name: string;
  productCount: number;
  isFirst: boolean;
  isLast: boolean;
};

// Азербайджанский не склоняет существительное после числительного (like
// "3 məhsul", не "3 məhsullar") — в отличие от русского, поэтому слово
// считается по языку интерфейса, а не зашито в словарь как готовая строка.
function pluralizeRu(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "товар";
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "товара";
  return "товаров";
}

export function CategoryRow({ id, name, productCount, isFirst, isLast }: Props) {
  const { t, locale } = useT();
  const productWord = locale === "az" ? "məhsul" : pluralizeRu(productCount);
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errorKey, setErrorKey] = useState<string | undefined>();
  const [errorParams, setErrorParams] = useState<Record<string, string | number> | undefined>();
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const res = await renameCategory(id, value);
      if (res.errorKey) {
        setErrorKey(res.errorKey);
      } else {
        setErrorKey(undefined);
        setEditing(false);
      }
    });
  }

  function remove() {
    startTransition(async () => {
      const res = await deleteCategory(id);
      // confirmDelete нарочно остаётся true при ошибке — иначе панель с
      // текстом ошибки схлопнется в том же рендере, и мама её не увидит.
      if (res.errorKey) {
        setErrorKey(res.errorKey);
        setErrorParams({ ...res.errorParams, word: locale === "az" ? "məhsul" : pluralizeRu(Number(res.errorParams?.count ?? 0)) });
      }
    });
  }

  if (editing) {
    return (
      <div className="rounded-lg border border-line bg-surface p-3">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="h-11 w-full rounded-lg border border-line bg-surface-2 px-3 text-cream outline-none focus:border-gold"
          autoFocus
        />
        {errorKey && <p className="mt-2 text-xs text-red-400">{t(errorKey)}</p>}
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={save}
            className="h-10 flex-1 rounded-full bg-gradient-to-r from-gold to-gold-light text-sm font-medium text-ink disabled:opacity-60"
          >
            {t("common.save")}
          </button>
          <button
            type="button"
            onClick={() => {
              setValue(name);
              setEditing(false);
              setErrorKey(undefined);
            }}
            className="h-10 flex-1 rounded-full border border-line text-sm text-muted"
          >
            {t("common.cancel")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-line bg-surface p-3">
      <div className="flex items-center justify-between">
        <div className="min-w-0">
          <p className="truncate text-cream">{name}</p>
          <p className="text-xs text-muted">
            {t("admin.categoryRow.productCount", { count: productCount, word: productWord })}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            aria-label={t("admin.photoUploader.moveLeftAria")}
            disabled={pending || isFirst}
            onClick={() => startTransition(() => moveCategory(id, "left"))}
            className="flex h-9 w-9 items-center justify-center text-cream disabled:opacity-30"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label={t("admin.photoUploader.moveRightAria")}
            disabled={pending || isLast}
            onClick={() => startTransition(() => moveCategory(id, "right"))}
            className="flex h-9 w-9 items-center justify-center text-cream disabled:opacity-30"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="px-2 text-sm text-gold-light"
          >
            {t("admin.categoryRow.rename")}
          </button>
          {!confirmDelete ? (
            <button
              type="button"
              aria-label={t("admin.categoryRow.deleteAria")}
              onClick={() => setConfirmDelete(true)}
              className="flex h-9 w-9 items-center justify-center text-red-400"
            >
              <TrashIcon className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      {confirmDelete && (
        <div className="mt-3 rounded-lg bg-surface-2 p-3">
          <p className="text-sm text-cream">{t("admin.categoryRow.confirmDeleteText", { name })}</p>
          {errorKey && <p className="mt-1 text-xs text-red-400">{t(errorKey, errorParams)}</p>}
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={remove}
              className="h-9 flex-1 rounded-full bg-red-500/90 text-sm font-medium text-white disabled:opacity-60"
            >
              {t("common.confirmDelete")}
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmDelete(false);
                setErrorKey(undefined);
              }}
              className="h-9 flex-1 rounded-full border border-line text-sm text-muted"
            >
              {t("common.cancel")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
