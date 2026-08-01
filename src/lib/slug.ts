const CHARMAP: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z",
  и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r",
  с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch",
  ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

/** «Сервиз «Ромашка», 12 предметов» -> "serviz-romashka-12-predmetov" */
export function slugify(input: string): string {
  const transliterated = input
    .toLowerCase()
    .split("")
    .map((ch) => CHARMAP[ch] ?? ch)
    .join("");

  return transliterated
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Короткий случайный слаг для черновика — не показывается покупателю, пока товар не опубликован */
export function draftSlug(): string {
  return `chernovik-${Math.random().toString(36).slice(2, 8)}`;
}

export function isDraftSlug(slug: string): boolean {
  return slug.startsWith("chernovik-");
}
