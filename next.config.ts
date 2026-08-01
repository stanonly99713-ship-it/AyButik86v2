import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Мы сами отдаём готовые WebP двух размеров (см. src/lib/image),
    // поэтому оптимизация Next Image не нужна и не тратит квоту Vercel.
    unoptimized: true,
    remotePatterns: [
      // Vercel Blob — хранилище фото товаров (см. P3)
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      // Временные фото-заглушки для этапа P0, до того как появятся реальные
      // товары. Удалить домен из списка, когда все заглушки будут заменены.
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "fastly.picsum.photos" },
    ],
  },
};

export default nextConfig;
