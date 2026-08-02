import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AyButik86 · Админ",
    short_name: "AyButik86 Админ",
    description: "Управление товарами магазина AyButik86",
    start_url: "/admin/products",
    display: "standalone",
    background_color: "#0f0d0d",
    theme_color: "#0f0d0d",
    icons: [
      { src: "/logo-192.png", sizes: "192x192", type: "image/png" },
      { src: "/logo-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
