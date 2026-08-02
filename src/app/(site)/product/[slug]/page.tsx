import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/site/ProductCard";
import { ProductGallery } from "@/components/site/ProductGallery";
import { SectionHeading } from "@/components/site/SectionHeading";
import { StickyWhatsAppButton } from "@/components/site/StickyWhatsAppButton";
import { formatPrice, discountPercent } from "@/lib/format";
import { getAllProducts, getCategories, getProductBySlug, getRelatedProducts, getSettings } from "@/db/queries";

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  const allProducts = await getAllProducts();
  return allProducts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: product.name,
    description: product.description || undefined,
    openGraph: product.images[0] ? { images: [product.images[0].url] } : undefined,
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [categories, related, settings] = await Promise.all([
    getCategories(),
    getRelatedProducts(product),
    getSettings(),
  ]);
  const category = categories.find((c) => c.id === product.categoryId);
  const discount = product.oldPrice ? discountPercent(product.oldPrice, product.price) : 0;

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ay-butik86v2.vercel.app";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    image: product.images.map((img) => img.url),
    category: category?.name,
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/product/${product.slug}`,
      priceCurrency: "RUB",
      price: product.price,
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
    },
  };

  return (
    <div className="flex flex-col">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <ProductGallery images={product.images} alt={product.name} />

      <div className="px-4 pb-8 pt-4">
        {category && <p className="text-xs uppercase tracking-wider text-muted">{category.name}</p>}
        <h1 className="mt-1 font-heading text-xl text-cream">{product.name}</h1>

        <div className="mt-3 flex items-center gap-3">
          <span className="font-heading text-2xl text-gold-light">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <>
              <span className="text-sm text-muted line-through">{formatPrice(product.oldPrice)}</span>
              <span className="rounded bg-gold/10 px-1.5 py-0.5 text-xs text-gold-light">-{discount}%</span>
            </>
          )}
          <span
            className={`ml-auto rounded-full px-2.5 py-1 text-xs ${
              product.inStock ? "bg-gold/10 text-gold-light" : "bg-surface-2 text-muted"
            }`}
          >
            {product.inStock ? "В наличии" : "Под заказ"}
          </span>
        </div>

        {product.description && (
          <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-cream/90">{product.description}</p>
        )}

        {product.specs.length > 0 && (
          <div className="mt-6">
            <p className="mb-2 text-xs uppercase tracking-wider text-muted">Характеристики</p>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {product.specs.map((spec, i) => (
                <div key={i} className="contents">
                  <dt className="text-muted">{spec.key}</dt>
                  <dd className="text-cream">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {related.length > 0 && (
          <div className="mt-10">
            <SectionHeading>Похожие товары</SectionHeading>
            <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4">
              {related.map((p) => (
                <div key={p.id} className="w-[46vw] shrink-0 sm:w-56">
                  <ProductCard product={p} categoryName={category?.name} whatsapp={settings.whatsapp} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <StickyWhatsAppButton whatsapp={settings.whatsapp} product={product} />
    </div>
  );
}
