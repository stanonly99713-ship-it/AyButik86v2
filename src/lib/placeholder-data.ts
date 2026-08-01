// P1: страницы больше не читают этот файл напрямую (см. src/db/queries.ts) —
// он используется только как фикстура для src/db/seed.ts, чтобы не держать
// тестовые данные в двух местах.
//
// Фото — плейсхолдеры с picsum.photos (домен временно разрешён в
// next.config.ts). Удалить вместе с этим файлом, когда каталог наполнится
// настоящими товарами через админку.

import type { Category, HeroSlide, Product, Settings } from "./types";

function placeholderImage(seed: string, w: number, h: number) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

export const placeholderCategories: Category[] = [
  { id: "cat-servizy", slug: "servizy", name: "Сервизы", imageUrl: placeholderImage("servizy", 200, 200), sortOrder: 0 },
  { id: "cat-cutlery", slug: "stolovye-pribory", name: "Столовые приборы", imageUrl: placeholderImage("cutlery", 200, 200), sortOrder: 1 },
  { id: "cat-teacup", slug: "chaynaya-para", name: "Чайная пара", imageUrl: placeholderImage("teacup", 200, 200), sortOrder: 2 },
  { id: "cat-kitchen", slug: "kuhonnaya-posuda", name: "Кухонная посуда", imageUrl: placeholderImage("kitchen", 200, 200), sortOrder: 3 },
  { id: "cat-accessories", slug: "aksessuary-dlya-kuhni", name: "Аксессуары для кухни", imageUrl: placeholderImage("accessories", 200, 200), sortOrder: 4 },
  { id: "cat-textile", slug: "tekstil-i-dekor", name: "Текстиль и декор", imageUrl: placeholderImage("textile", 200, 200), sortOrder: 5 },
  { id: "cat-glass", slug: "steklo-i-bokaly", name: "Стекло и бокалы", imageUrl: placeholderImage("glass", 200, 200), sortOrder: 6 },
  { id: "cat-gifts", slug: "podarochnye-nabory", name: "Подарочные наборы", imageUrl: placeholderImage("gifts", 200, 200), sortOrder: 7 },
];

function img(seed: string, sortOrder = 0) {
  return {
    id: `img-${seed}`,
    url: placeholderImage(seed, 1200, 1500),
    thumbUrl: placeholderImage(seed, 600, 750),
    width: 1200,
    height: 1500,
    sortOrder,
  };
}

function daysAgo(n: number) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}

export const placeholderProducts: Product[] = [
  {
    id: "p1",
    slug: "serviz-romashka-12-predmetov",
    name: 'Сервиз «Ромашка», 12 предметов',
    categoryId: "cat-servizy",
    price: 4500,
    oldPrice: 5900,
    description: "Классический обеденный сервиз на 6 персон. Плотный фарфор, приятный вес в руке.",
    specs: [
      { key: "Материал", value: "Фарфор" },
      { key: "Количество предметов", value: "12" },
      { key: "Цвет", value: "Белый с золотой каймой" },
    ],
    inStock: true,
    isPublished: true,
    sortOrder: 0,
    createdAt: daysAgo(1),
    images: [img("serviz-romashka-1"), img("serviz-romashka-2", 1), img("serviz-romashka-3", 2)],
  },
  {
    id: "p2",
    slug: "nabor-stolovyh-priborov-gold",
    name: "Набор столовых приборов Gold Tableware",
    categoryId: "cat-cutlery",
    price: 1050,
    oldPrice: null,
    description: "Набор из 4 предметов: вилка, нож, столовая и чайная ложки. Нержавеющая сталь с золотым напылением.",
    specs: [
      { key: "Материал", value: "Нержавеющая сталь" },
      { key: "Количество предметов", value: "4" },
    ],
    inStock: true,
    isPublished: true,
    sortOrder: 0,
    createdAt: daysAgo(2),
    images: [img("gold-cutlery-1"), img("gold-cutlery-2", 1)],
  },
  {
    id: "p3",
    slug: "chaynaya-para-nude-rose",
    name: "Чайная пара Nude Rose",
    categoryId: "cat-teacup",
    price: 2300,
    oldPrice: null,
    description: "Чашка и блюдце из тонкого фарфора с розовым напылением по краю.",
    specs: [
      { key: "Материал", value: "Костяной фарфор" },
      { key: "Объём", value: "220 мл" },
    ],
    inStock: true,
    isPublished: true,
    sortOrder: 0,
    createdAt: daysAgo(3),
    images: [img("nude-rose-1"), img("nude-rose-2", 1)],
  },
  {
    id: "p4",
    slug: "nabor-tarelok-avangard",
    name: "Набор тарелок Avangard",
    categoryId: "cat-kitchen",
    price: 1499,
    oldPrice: null,
    description: "Керамические тарелки с ручной росписью, каждая чуть отличается — в этом их прелесть.",
    specs: [
      { key: "Материал", value: "Керамика" },
      { key: "Количество предметов", value: "4" },
    ],
    inStock: true,
    isPublished: true,
    sortOrder: 0,
    createdAt: daysAgo(4),
    images: [img("avangard-1"), img("avangard-2", 1)],
  },
  {
    id: "p5",
    slug: "razdelochnaya-doska-natural",
    name: "Разделочная доска Natural",
    categoryId: "cat-accessories",
    price: 980,
    oldPrice: 1400,
    description: "Доска из массива дерева со специальным пропитанным покрытием, безопасным для продуктов.",
    specs: [
      { key: "Материал", value: "Дерево (дуб)" },
      { key: "Размер", value: "40×25 см" },
    ],
    inStock: true,
    isPublished: true,
    sortOrder: 0,
    createdAt: daysAgo(10),
    images: [img("natural-1"), img("natural-2", 1)],
  },
  {
    id: "p6",
    slug: "salfetki-lnyanye-komplekt",
    name: "Льняные салфетки, комплект 4 шт.",
    categoryId: "cat-textile",
    price: 890,
    oldPrice: null,
    description: "Натуральный лён плотной выделки, приятный на ощупь. Стирка при 40°C.",
    specs: [
      { key: "Материал", value: "Лён 100%" },
      { key: "Количество предметов", value: "4" },
    ],
    inStock: true,
    isPublished: true,
    sortOrder: 0,
    createdAt: daysAgo(12),
    images: [img("napkins-1")],
  },
  {
    id: "p7",
    slug: "bokaly-dlya-vina-elegance-2sht",
    name: "Бокалы для вина Elegance, 2 шт.",
    categoryId: "cat-glass",
    price: 1700,
    oldPrice: null,
    description: "Тонкое хрустальное стекло, классическая форма для красных вин.",
    specs: [
      { key: "Материал", value: "Хрустальное стекло" },
      { key: "Объём", value: "350 мл" },
    ],
    inStock: false,
    isPublished: true,
    sortOrder: 0,
    createdAt: daysAgo(15),
    images: [img("wine-glass-1"), img("wine-glass-2", 1)],
  },
  {
    id: "p8",
    slug: "podarochnyy-nabor-dlya-chaepitiya",
    name: "Подарочный набор для чаепития",
    categoryId: "cat-gifts",
    price: 3200,
    oldPrice: null,
    description: "Чайник, две чашки с блюдцами и деревянный поднос в подарочной упаковке.",
    specs: [
      { key: "Количество предметов", value: "6" },
      { key: "Материал", value: "Фарфор, дерево" },
    ],
    inStock: true,
    isPublished: true,
    sortOrder: 0,
    createdAt: daysAgo(6),
    images: [img("gift-set-1"), img("gift-set-2", 1), img("gift-set-3", 2)],
  },
  {
    id: "p9",
    slug: "chashki-cupple-2sht",
    name: "Чашки Cupple, 2 шт.",
    categoryId: "cat-kitchen",
    price: 1050,
    oldPrice: null,
    description: "Керамические чашки простой формы, отлично держат тепло.",
    specs: [{ key: "Материал", value: "Керамика" }],
    inStock: true,
    isPublished: true,
    sortOrder: 0,
    createdAt: daysAgo(8),
    images: [img("cupple-1")],
  },
  {
    id: "p10",
    slug: "miski-little-bowls-3sht",
    name: "Миски Little Bowls, 3 шт.",
    categoryId: "cat-kitchen",
    price: 1700,
    oldPrice: null,
    description: "Набор мисок разного размера — для сервировки, каш и соусов.",
    specs: [
      { key: "Материал", value: "Керамика" },
      { key: "Количество предметов", value: "3" },
    ],
    inStock: true,
    isPublished: true,
    sortOrder: 0,
    createdAt: daysAgo(5),
    images: [img("little-bowls-1"), img("little-bowls-2", 1)],
  },
  {
    id: "p11",
    slug: "nabor-tarelok-milky",
    name: "Набор тарелок Milky",
    categoryId: "cat-servizy",
    price: 3200,
    oldPrice: null,
    description: "Молочно-белый фарфор с золотой каймой по краю, элегантная сервировка.",
    specs: [
      { key: "Материал", value: "Фарфор" },
      { key: "Количество предметов", value: "6" },
    ],
    inStock: true,
    isPublished: true,
    sortOrder: 0,
    createdAt: daysAgo(20),
    images: [img("milky-1"), img("milky-2", 1)],
  },
  {
    id: "p12",
    slug: "vaza-dekorativnaya-noir",
    name: "Ваза декоративная Noir",
    categoryId: "cat-textile",
    price: 2100,
    oldPrice: 2800,
    description: "Матовая керамическая ваза глубокого чёрного цвета — эффектный акцент для интерьера.",
    specs: [
      { key: "Материал", value: "Керамика" },
      { key: "Размер", value: "Высота 28 см" },
    ],
    inStock: true,
    isPublished: true,
    sortOrder: 0,
    createdAt: daysAgo(18),
    images: [img("vase-noir-1")],
  },
];

export const placeholderHeroSlides: HeroSlide[] = [
  {
    id: "hero-1",
    imageUrl: placeholderImage("hero-1", 1600, 1400),
    title: "Промокод на скидку -10%",
    subtitle: "На все категории товара до 20 сентября",
    buttonText: "Узнать больше",
    buttonHref: "/catalog",
    isActive: true,
    sortOrder: 0,
  },
  {
    id: "hero-2",
    imageUrl: placeholderImage("hero-2", 1600, 1400),
    title: "Новая коллекция сервизов",
    subtitle: "Эстетика вашего дома в каждой детали",
    buttonText: "Смотреть каталог",
    buttonHref: "/catalog",
    isActive: true,
    sortOrder: 1,
  },
];

export const placeholderSettings: Settings = {
  phone: "+7 926 925 96 86",
  whatsapp: "79269259686",
  address: "г. Москва, ул. Пражская, д. 4, корп. Б",
  workingHours: "9:00–21:00 (ежедневно)",
  instagram: "",
  telegram: "",
  mapEmbedUrl: "",
  promoTitle: "Акции месяца",
  promoText: "Скидки до 30% на аксессуары для кухни до конца месяца",
  promoImageUrl: placeholderImage("promo-banner", 1600, 900),
};
