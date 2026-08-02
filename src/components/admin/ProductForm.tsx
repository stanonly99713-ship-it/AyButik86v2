"use client";

import { useActionState } from "react";
import { updateProduct, type ProductFormState } from "@/actions/products";
import { PhotoUploader } from "@/components/admin/PhotoUploader";
import { SpecsEditor } from "@/components/admin/SpecsEditor";
import { isDraftSlug } from "@/lib/slug";
import { useT } from "@/locales/useTranslation";
import type { Category, Product } from "@/lib/types";

const initialState: ProductFormState = {};

export function ProductForm({ product, categories }: { product: Product; categories: Category[] }) {
  const [state, formAction] = useActionState(updateProduct, initialState);
  const { t } = useT();

  return (
    <form action={formAction} className="pb-28">
      <input type="hidden" name="id" value={product.id} />

      <PhotoUploader productId={product.id} images={product.images} />

      <label className="mt-4 block text-sm text-muted">
        {t("admin.productForm.nameLabel")}
        <input
          name="name"
          defaultValue={product.name === "Без названия" ? "" : product.name}
          placeholder={t("admin.productForm.namePlaceholder")}
          required
          className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
        />
      </label>

      <label className="mt-4 block text-sm text-muted">
        {t("admin.productForm.categoryLabel")}
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
          {t("admin.productForm.priceLabel")}
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
          {t("admin.productForm.oldPriceLabel")}
          <input
            name="oldPrice"
            inputMode="numeric"
            pattern="[0-9]*"
            defaultValue={product.oldPrice ?? ""}
            className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
          />
        </label>
      </div>
      <p className="mt-1.5 text-xs text-muted">{t("admin.productForm.priceHelp")}</p>

      <label className="mt-4 flex h-12 items-center gap-3">
        <input
          type="checkbox"
          name="inStock"
          defaultChecked={product.inStock}
          className="h-5 w-5 accent-gold"
        />
        <span className="text-cream">{t("admin.productForm.inStockLabel")}</span>
      </label>

      <label className="mt-2 block text-sm text-muted">
        {t("admin.productForm.descriptionLabel")}
        <textarea
          name="description"
          defaultValue={product.description}
          rows={5}
          placeholder={t("admin.productForm.descriptionPlaceholder")}
          className="mt-1 w-full rounded-lg border border-line bg-surface px-3 py-2 text-cream outline-none focus:border-gold"
        />
      </label>

      <div className="mt-5">
        <p className="mb-2 text-sm text-muted">{t("admin.productForm.specsLabel")}</p>
        <SpecsEditor initial={product.specs} />
      </div>

      {!isDraftSlug(product.slug) && (
        <details className="mt-5">
          <summary className="cursor-pointer text-sm text-muted">{t("admin.productForm.advanced")}</summary>
          <label className="mt-3 block text-sm text-muted">
            {t("admin.productForm.slugLabel")}
            <input
              name="slug"
              defaultValue={product.slug}
              className="mt-1 h-12 w-full rounded-lg border border-line bg-surface px-3 text-cream outline-none focus:border-gold"
            />
          </label>
          <p className="mt-1.5 text-xs text-muted">{t("admin.productForm.slugHelp")}</p>
        </details>
      )}

      {state.errorKey && <p className="mt-4 text-sm text-red-400">{t(state.errorKey)}</p>}

      <div className="fixed inset-x-0 bottom-0 z-30 flex gap-3 border-t border-line bg-ink/95 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 backdrop-blur">
        <button
          type="submit"
          name="intent"
          value="draft"
          className="h-12 flex-1 rounded-full border border-line text-cream"
        >
          {t("admin.productForm.saveDraft")}
        </button>
        <button
          type="submit"
          name="intent"
          value="publish"
          className="h-12 flex-1 rounded-full bg-gradient-to-r from-gold to-gold-light font-medium text-ink"
        >
          {t("admin.productForm.publish")}
        </button>
      </div>
    </form>
  );
}
