import type { Metadata, Viewport } from "next";
import { fontVariables } from "@/lib/fonts";
import "../globals.css";

// Отдельный root layout для /admin — без хедера/футера витрины (Header/Footer
// из "@/components/site" живут только в app/(site)/layout.tsx). Next.js
// позволяет несколько root-layout'ов через route groups: у (site) и admin
// нет общего layout.tsx с <html>, поэтому они не конфликтуют.

export const metadata: Metadata = {
  title: { default: "Админка · AyButik86", template: "%s · Админка AyButik86" },
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0f0d0d",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function AdminRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${fontVariables} h-full antialiased`}>
      <body className="min-h-full bg-ink text-cream">{children}</body>
    </html>
  );
}
