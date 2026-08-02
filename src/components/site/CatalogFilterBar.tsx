"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BottomSheet } from "@/components/site/BottomSheet";
import { CheckIcon } from "@/components/icons";
import type { Category } from "@/lib/types";
import type { CatalogSort } from "@/db/queries";

const SORT_OPTIONS: { value: CatalogSort; label: string }[] = [
  { value: "new", label: "Новинки" },
  { value: "price_asc", label: "Сначала дешевле" },
  { value: "price_desc", label: "Сначала дороже" },
  { value: "discount", label: "Скидки" },
];

type Params = { cat?: string; q?: string; sort?: string; stock?: string };

function buildHref(current: Params, patch: Partial<Params>) {
  const next = { ...current, ...patch };
  const qs = new URLSearchParams();
  if (next.cat) qs.set("cat", next.cat);
  if (next.q) qs.set("q", next.q);
  if (next.sort) qs.set("sort", next.sort);
  if (next.stock) qs.set("stock", next.stock);
  const s = qs.toString();
  return s ? `/catalog?${s}` : "/catalog";
}

export function CatalogFilterBar({ categories, params }: { categories: Category[]; params: Params }) {
  const router = useRouter();
  const [openSheet, setOpenSheet] = useState<"filters" | "sort" | null>(null);
  const [draftCat, setDraftCat] = useState(params.cat);
  const [draftStock, setDraftStock] = useState(params.stock === "1");

  const activeFilterCount = (params.cat ? 1 : 0) + (params.stock === "1" ? 1 : 0);
  const activeSortLabel = SORT_OPTIONS.find((o) => o.value === (params.sort ?? "new"))?.label ?? "Сортировка";

  function openFilters() {
    setDraftCat(params.cat);
    setDraftStock(params.stock === "1");
    setOpenSheet("filters");
  }

  function applyFilters() {
    setOpenSheet(null);
    router.push(buildHref(params, { cat: draftCat, stock: draftStock ? "1" : undefined }));
  }

  function selectSort(value: CatalogSort) {
    setOpenSheet(null);
    router.push(buildHref(params, { sort: value }));
  }

  return (
    <>
      <div className="sticky top-14 z-20 flex gap-2 border-b border-line bg-ink/95 px-4 py-2.5 backdrop-blur">
        <button
          type="button"
          onClick={openFilters}
          className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-line text-sm text-cream"
        >
          Фильтры{activeFilterCount > 0 && ` (${activeFilterCount})`}
        </button>
        <button
          type="button"
          onClick={() => setOpenSheet("sort")}
          className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full border border-line text-sm text-cream"
        >
          {activeSortLabel}
        </button>
      </div>

      {openSheet === "filters" && (
        <BottomSheet title="Фильтры" onClose={() => setOpenSheet(null)}>
          <p className="mb-2 text-xs uppercase tracking-wider text-muted">Категория</p>
          <div className="flex flex-col">
            <button
              type="button"
              onClick={() => setDraftCat(undefined)}
              className="flex items-center justify-between border-b border-line py-2.5 text-left text-cream"
            >
              Все категории
              {!draftCat && <CheckIcon className="h-4 w-4 text-gold-light" />}
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setDraftCat(c.slug)}
                className="flex items-center justify-between border-b border-line py-2.5 text-left text-cream"
              >
                {c.name}
                {draftCat === c.slug && <CheckIcon className="h-4 w-4 text-gold-light" />}
              </button>
            ))}
          </div>

          <label className="mt-3 flex h-11 items-center justify-between">
            <span className="text-cream">Только в наличии</span>
            <input
              type="checkbox"
              checked={draftStock}
              onChange={(e) => setDraftStock(e.target.checked)}
              className="h-5 w-5 accent-gold"
            />
          </label>

          <button
            type="button"
            onClick={applyFilters}
            className="mt-3 h-12 w-full rounded-full bg-gradient-to-r from-gold to-gold-light font-medium text-ink"
          >
            Показать
          </button>
        </BottomSheet>
      )}

      {openSheet === "sort" && (
        <BottomSheet title="Сортировка" onClose={() => setOpenSheet(null)}>
          <div className="flex flex-col">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => selectSort(opt.value)}
                className="flex items-center justify-between border-b border-line py-3 text-left text-cream"
              >
                {opt.label}
                {(params.sort ?? "new") === opt.value && <CheckIcon className="h-4 w-4 text-gold-light" />}
              </button>
            ))}
          </div>
        </BottomSheet>
      )}
    </>
  );
}
