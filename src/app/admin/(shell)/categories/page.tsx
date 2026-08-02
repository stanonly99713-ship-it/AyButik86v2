import type { Metadata } from "next";
import { AddCategoryForm } from "@/components/admin/AddCategoryForm";
import { CategoryRow } from "@/components/admin/CategoryRow";
import { T } from "@/locales/T";
import { getCategoriesWithProductCounts } from "@/db/queries";

export const metadata: Metadata = { title: "Категории" };

export default async function AdminCategoriesPage() {
  const categories = await getCategoriesWithProductCounts();

  return (
    <div className="px-4 py-4 pb-24">
      <h1 className="mb-3 text-xl text-cream">
        <T k="admin.categories.title" />
      </h1>

      <AddCategoryForm />

      <div className="mt-4 flex flex-col gap-2">
        {categories.map((c, i) => (
          <CategoryRow
            key={c.id}
            id={c.id}
            name={c.name}
            productCount={c.productCount}
            isFirst={i === 0}
            isLast={i === categories.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
