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
  async headers() {
    return [
      {
        // SVG-заглушки категорий/товаров/hero/промо — не меняются "на месте",
        // при замене загружается новый файл, так что immutable безопасен.
        source: "/images/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/logo-128.webp",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/logo-192.png",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/logo-512.png",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
