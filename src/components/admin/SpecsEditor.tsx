"use client";

import { useState } from "react";
import { TrashIcon } from "@/components/icons";
import { az } from "@/locales/az";
import { ru } from "@/locales/ru";
import { useT } from "@/locales/useTranslation";
import type { Spec } from "@/lib/types";

export function SpecsEditor({ initial }: { initial: Spec[] }) {
  const { t, locale } = useT();
  const suggestedKeys = (locale === "az" ? az : ru).admin.specsEditor.suggestions;
  const [rows, setRows] = useState<Spec[]>(initial.length ? initial : [{ key: "", value: "" }]);

  function update(i: number, patch: Partial<Spec>) {
    setRows((prev) => prev.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));
  }

  function removeRow(i: number) {
    setRows((prev) => (prev.length === 1 ? [{ key: "", value: "" }] : prev.filter((_, idx) => idx !== i)));
  }

  return (
    <div>
      <datalist id="spec-key-options">
        {suggestedKeys.map((k) => (
          <option key={k} value={k} />
        ))}
      </datalist>

      {rows.map((row, i) => (
        <div key={i} className="mb-2 flex gap-2">
          <input
            name="specKey"
            list="spec-key-options"
            value={row.key}
            onChange={(e) => update(i, { key: e.target.value })}
            placeholder={t("admin.specsEditor.keyPlaceholder")}
            className="h-11 w-2/5 rounded-lg border border-line bg-surface px-2.5 text-sm text-cream outline-none focus:border-gold"
          />
          <input
            name="specValue"
            value={row.value}
            onChange={(e) => update(i, { value: e.target.value })}
            placeholder={t("admin.specsEditor.valuePlaceholder")}
            className="h-11 flex-1 rounded-lg border border-line bg-surface px-2.5 text-sm text-cream outline-none focus:border-gold"
          />
          <button
            type="button"
            aria-label={t("admin.specsEditor.removeAria")}
            onClick={() => removeRow(i)}
            className="flex h-11 w-11 shrink-0 items-center justify-center text-muted"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={() => setRows((prev) => [...prev, { key: "", value: "" }])}
        className="mt-1 text-sm text-gold-light"
      >
        {t("admin.specsEditor.addRow")}
      </button>
    </div>
  );
}
