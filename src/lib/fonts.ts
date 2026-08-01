import { Playfair_Display, Marck_Script, Onest } from "next/font/google";

// Все три шрифта явно поддерживают кириллицу — без этого заголовки вроде
// «Новинки» превратились бы в квадраты или подменились системным шрифтом.

/** Заголовки и цены — засечный, как в логотипе */
export const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["cyrillic", "latin"],
  display: "swap",
});

/** Рукописный акцент для крупных заголовков секций («Новинки», «Акции месяца») */
export const marckScript = Marck_Script({
  variable: "--font-marck",
  subsets: ["cyrillic", "latin"],
  weight: "400",
  display: "swap",
});

/** Основной текст — нейтральный, хорошо читается на экране */
export const onest = Onest({
  variable: "--font-onest",
  subsets: ["cyrillic", "latin"],
  display: "swap",
});

export const fontVariables = `${playfair.variable} ${marckScript.variable} ${onest.variable}`;
