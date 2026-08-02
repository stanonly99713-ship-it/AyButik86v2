import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ChevronLeftIcon } from "@/components/icons";
import { ProductForm } from "@/components/admin/ProductForm";
import { T } from "@/locales/T";
import { getAdminProductById, getCategories } from "@/db/queries";

export const metadata: Metadata = { title: "Товар" };

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([getAdminProductById(id), getCategories()]);
  if (!product) notFound();

  return (
    <div className="px-4 py-4">
      <div className="mb-4 flex items-center gap-2">
        <Link href="/admin/products" aria-label="Назад" className="flex h-11 w-11 items-center justify-center -ml-2">
          <ChevronLeftIcon className="h-5 w-5 text-cream" />
        </Link>
        <h1 className="text-lg text-cream">
          {product.name === "Без названия" ? <T k="admin.products.newProductTitle" /> : product.name}
        </h1>
      </div>

      <ProductForm product={product} categories={categories} />
    </div>
  );
}
