// Формы данных повторяют будущую схему БД (см. план, раздел «Модель данных»),
// чтобы на этапе P1 замена заглушек на запросы к Neon не потребовала
// переписывать компоненты — только источник данных.

export type Category = {
  id: string;
  slug: string;
  name: string;
  imageUrl: string | null;
  sortOrder: number;
};

export type ProductImage = {
  id: string;
  url: string; // 1600px webp
  thumbUrl: string; // 600px webp
  width: number;
  height: number;
  blurData?: string | null;
  sortOrder: number; // 0 = обложка
};

export type Spec = { key: string; value: string };

export type Product = {
  id: string;
  slug: string;
  name: string;
  categoryId: string;
  price: number; // целые рубли
  oldPrice: number | null;
  description: string;
  specs: Spec[];
  inStock: boolean;
  isPublished: boolean;
  sortOrder: number;
  createdAt: string; // ISO
  images: ProductImage[];
};

export type HeroSlide = {
  id: string;
  imageUrl: string;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonHref: string;
  isActive: boolean;
  sortOrder: number;
};

export type Settings = {
  phone: string;
  whatsapp: string; // только цифры, для wa.me
  address: string;
  workingHours: string;
  instagram: string;
  telegram: string;
  mapEmbedUrl: string;
  promoTitle: string;
  promoText: string;
  promoImageUrl: string | null;
};
