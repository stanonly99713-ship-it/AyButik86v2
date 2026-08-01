"use client";

import { useActionState } from "react";
import { updateProduct, type ProductFormState } from "@/actions/products";
import { PhotoUploader } from "@/components/admin/PhotoUploader";
import { SpecsEditor } from "@/components/admin/SpecsEditor";
import { isDraftSlug } from "@/lib/slug";
import type { Category, Product } from "@/lib/types";

const initialState: ProductFormState = {};

export function ProductForm({ product, categories }: { product: Product; categories: Category[] }) {
  const [state, formAction] = useActionState(updateProduct, initialState);

  return (
    <form action={formAction} className="pb-28">
      <input type="hidden" name="id" value={product.id} />

      <PhotoUploader productId={product.id} images={product.images} />

      <label className="mt-4 block text-sm text-muted">
        Название
        <input
          name="name"
          defaultValue={product.name === "Без названия" ? "" : product.name}
          placeholder="Например, Сервиз «Ромашка», 12 предметов"
          required
          className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
        />
      </label>

      <label className="mt-4 block text-sm text-muted">
        Категория
        <select
          name="categoryId"
          defaultValue={product.categoryId}
          className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <div className="mt-4 flex gap-3">
        <label className="block flex-1 text-sm text-muted">
          Цена, ₽
          <input
            name="price"
            inputMode="numeric"
            pattern="[0-9]*"
            defaultValue={product.price || ""}
            required
            className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
          />
        </label>
        <label className="block flex-1 text-sm text-muted">
          Старая цена, ₽
          <input
            name="oldPrice"
            inputMode="numeric"
            pattern="[0-9]*"
            defaultValue={product.oldPrice ?? ""}
            className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
          />
        </label>
      </div>
      <p className="mt-1.5 text-xs text-muted">
        Оставьте «Старая цена» пустой, если скидки нет. Если заполнить — на товаре появится значок «Скидка».
      </p>

      <label className="mt-4 flex h-12 items-center gap-3">
        <input
          type="checkbox"
          name="inStock"
          defaultChecked={product.inStock}
          className="h-5 w-5 accent-gold"
        />
        <span className="text-cream">В наличии</span>
      </label>

      <label className="mt-2 block text-sm text-muted">
        Описание
        <textarea
          name="description"
          defaultValue={product.description}
          rows={5}
          placeholder="Расскажите о товаре: материал, для чего подходит, особенности…"
          className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-cream outline-none focus:border-gold"
        />
      </label>

      <div className="mt-5">
        <p className="mb-2 text-sm text-muted">Характеристики</p>
        <SpecsEditor initial={product.specs} />
      </div>

      {!isDraftSlug(product.slug) && (
        <details className="mt-5">
          <summary className="cursor-pointer text-sm text-muted">Дополнительно</summary>
          <label className="mt-3 block text-sm text-muted">
            Адрес страницы
            <input
              name="slug"
              defaultValue={product.slug}
              className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
            />
          </label>
          <p className="mt-1.5 text-xs text-muted">
            Меняйте осторожно — если товар уже разослан покупателям, старая ссылка перестанет работать.
          </p>
        </details>
      )}

      {state.error && <p className="mt-4 text-sm text-red-400">{state.error}</p>}

      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-3 border-t border-line bg-ink/95 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 backdrop-blur">
        <button
          type="submit"
          name="intent"
          value="draft"
          className="h-12 flex-1 rounded-full border border-line text-cream"
        >
          Сохранить черновик
        </button>
        <button
          type="submit"
          name="intent"
          value="publish"
          className="h-12 flex-1 rounded-full bg-gradient-to-r from-gold to-gold-light font-medium text-ink"
        >
          Опубликовать
        </button>
      </div>
    </form>
  );
}
