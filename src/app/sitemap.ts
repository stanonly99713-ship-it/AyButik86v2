import type { MetadataRoute } from "next";
import { getAllProducts, getCategories } from "@/db/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ay-butik86v2.vercel.app";
  const [products, categories] = await Promise.all([getAllProducts(), getCategories()]);

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/catalog`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/contacts`, changeFrequency: "monthly", priority: 0.5 },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteUrl}/catalog?cat=${c.slug}`,
    changeFrequency: "daily",
    priority: 0.7,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteUrl}/product/${p.slug}`,
    lastModified: new Date(p.createdAt),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
