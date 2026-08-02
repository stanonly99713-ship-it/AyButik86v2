"use client";

import { useState, useTransition } from "react";
import { deleteCategory, moveCategory, renameCategory } from "@/actions/categories";
import { ChevronLeftIcon, ChevronRightIcon, TrashIcon } from "@/components/icons";

type Props = {
  id: string;
  name: string;
  productCount: number;
  isFirst: boolean;
  isLast: boolean;
};

export function CategoryRow({ id, name, productCount, isFirst, isLast }: Props) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [pending, startTransition] = useTransition();

  function save() {
    startTransition(async () => {
      const res = await renameCategory(id, value);
      if (res.error) {
        setError(res.error);
      } else {
        setError(undefined);
        setEditing(false);
      }
    });
  }

  function remove() {
    startTransition(async () => {
      const res = await deleteCategory(id);
      // confirmDelete нарочно остаётся true при ошибке — иначе панель с
      // текстом ошибки схлопнется в том же рендере, и мама её не увидит.
      if (res.error) setError(res.error);
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
        {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
        <div className="mt-2 flex gap-2">
          <button
            type="button"
            disabled={pending}
            onClick={save}
            className="h-10 flex-1 rounded-full bg-gradient-to-r from-gold to-gold-light text-sm font-medium text-ink disabled:opacity-60"
          >
            Сохранить
          </button>
          <button
            type="button"
            onClick={() => {
              setValue(name);
              setEditing(false);
              setError(undefined);
            }}
            className="h-10 flex-1 rounded-full border border-line text-sm text-muted"
          >
            Отмена
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
            {productCount} {pluralize(productCount)}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            aria-label="Переместить влево"
            disabled={pending || isFirst}
            onClick={() => startTransition(() => moveCategory(id, "left"))}
            className="flex h-9 w-9 items-center justify-center text-cream disabled:opacity-30"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Переместить вправо"
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
            Переименовать
          </button>
          {!confirmDelete ? (
            <button
              type="button"
              aria-label="Удалить категорию"
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
          <p className="text-sm text-cream">Удалить категорию «{name}»?</p>
          {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              disabled={pending}
              onClick={remove}
              className="h-9 flex-1 rounded-full bg-red-500/90 text-sm font-medium text-white disabled:opacity-60"
            >
              Да, удалить
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirmDelete(false);
                setError(undefined);
              }}
              className="h-9 flex-1 rounded-full border border-line text-sm text-muted"
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function pluralize(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "товар";
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "товара";
  return "товаров";
}
