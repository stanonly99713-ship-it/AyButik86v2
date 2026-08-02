import { Playfair_Display, Marck_Script, Onest } from "next/font/google";

// Все три шрифта явно поддерживают кириллицу — без этого заголовки вроде
// «Новинки» превратились бы в квадраты или подменились системным шрифтом.

/**
 * Заголовки и цены — засечный, как в логотипе.
 * weight сужен до реально используемого в разметке (проверено grep'ом по
 * `font-heading` — жирного начертания нигде не запрашивают), иначе next/font
 * тянет весь набор начертаний Playfair Display впустую.
 */
export const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["cyrillic", "latin"],
  weight: "400",
  display: "swap",
});

/** Рукописный акцент для крупных заголовков секций («Новинки», «Акции месяца») */
export const marckScript = Marck_Script({
  variable: "--font-marck",
  subsets: ["cyrillic", "latin"],
  weight: "400",
  display: "swap",
});

/**
 * Основной текст — нейтральный, хорошо читается на экране.
 * weight сужен до 400/500 — это все начертания, которые реально
 * встречаются в разметке (обычный текст + font-medium).
 */
export const onest = Onest({
  variable: "--font-onest",
  subsets: ["cyrillic", "latin"],
  weight: ["400", "500"],
  display: "swap",
});

export const fontVariables = `${playfair.variable} ${marckScript.variable} ${onest.variable}`;
