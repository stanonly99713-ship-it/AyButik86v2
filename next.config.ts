import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Мы сами отдаём готовые WebP двух размеров (см. src/lib/image),
    // поэтому оптимизация Next Image не нужна и не тратит квоту Vercel.
    unoptimized: true,
    remotePatterns: [
      // Vercel Blob — хранилище фото товаров (см. P3)
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
    ],
  },
};

export default nextConfig;
