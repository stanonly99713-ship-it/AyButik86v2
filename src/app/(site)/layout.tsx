import type { Metadata, Viewport } from "next";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import { YandexMetrika } from "@/components/site/YandexMetrika";
import { fontVariables } from "@/lib/fonts";
import { LocaleProvider } from "@/locales/LocaleProvider";
import { getCategories, getSettings } from "@/db/queries";
import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://ay-butik86v2.vercel.app"),
  title: {
    default: "AyButik86 — эстетика вашего дома",
    template: "%s · AyButik86",
  },
  description: "Магазин посуды AyButik86: сервизы, чайные пары, кухонная посуда и аксессуары для дома.",
  openGraph: {
    type: "website",
    locale: "ru_RU",
    siteName: "AyButik86",
  },
};

export const viewport: Viewport = {
  themeColor: "#0f0d0d",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const categories = await getCategories();
  const settings = await getSettings();

  return (
    <html lang="ru" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-ink text-cream">
        <LocaleProvider storageKey="ayb-locale-site" defaultLocale="ru">
          <Header categories={categories} whatsapp={settings.whatsapp} />
          <main className="flex-1">{children}</main>
          <Footer settings={settings} />
        </LocaleProvider>
        <YandexMetrika />
      </body>
    </html>
  );
}
