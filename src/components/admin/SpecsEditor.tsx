"use client";

import { useState } from "react";
import { TrashIcon } from "@/components/icons";
import type { Spec } from "@/lib/types";

const SUGGESTED_KEYS = ["Материал", "Размер", "Объём", "Количество предметов", "Цвет", "Бренд", "Страна"];

export function SpecsEditor({ initial }: { initial: Spec[] }) {
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
        {SUGGESTED_KEYS.map((k) => (
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
            placeholder="Материал"
            className="h-11 w-2/5 rounded-lg border border-line bg-surface px-2.5 text-sm text-cream outline-none focus:border-gold"
          />
          <input
            name="specValue"
            value={row.value}
            onChange={(e) => update(i, { value: e.target.value })}
            placeholder="Фарфор"
            className="h-11 flex-1 rounded-lg border border-line bg-surface px-2.5 text-sm text-cream outline-none focus:border-gold"
          />
          <button
            type="button"
            aria-label="Удалить характеристику"
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
        + Добавить характеристику
      </button>
    </div>
  );
}
