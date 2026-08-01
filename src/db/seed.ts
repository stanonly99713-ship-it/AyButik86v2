// Разово наполняет пустую БД: 8 категорий, настройки магазина, админ-логин
// и несколько тестовых товаров (переиспользуем src/lib/placeholder-data.ts
// как фикстуру, чтобы не дублировать данные).
//
// Переменные окружения грузятся флагом `tsx --env-file=.env.local`
// (см. npm-скрипт db:seed), а не dotenv/config — ESM хоистит импорты выше
// любого кода в файле, так что вызов dotenv здесь запустился бы позже,
// чем модуль ./index уже успел бы упасть на отсутствующем DATABASE_URL.
import bcrypt from "bcryptjs";
import { db } from "./index";
import { categories, heroSlides, productImages, products, settings } from "./schema";
import {
  placeholderCategories,
  placeholderHeroSlides,
  placeholderProducts,
  placeholderSettings,
} from "@/lib/placeholder-data";

async function main() {
  // "||", а не "??" — пустая строка из ADMIN_PASSWORD= в .env.local тоже
  // должна считаться "не задано", а не валидным паролем.
  const login = process.env.ADMIN_LOGIN || "mama";
  const password = process.env.ADMIN_PASSWORD || Math.random().toString(36).slice(-10);
  const passwordHash = await bcrypt.hash(password, 12);

  console.log("Категории…");
  for (const c of placeholderCategories) {
    await db
      .insert(categories)
      .values({ id: c.id, slug: c.slug, name: c.name, imageUrl: c.imageUrl, sortOrder: c.sortOrder })
      .onConflictDoNothing({ target: categories.slug });
  }

  console.log("Настройки и админ…");
  await db
    .insert(settings)
    .values({
      id: "main",
      phone: placeholderSettings.phone,
      whatsapp: placeholderSettings.whatsapp,
      address: placeholderSettings.address,
      workingHours: placeholderSettings.workingHours,
      promoTitle: placeholderSettings.promoTitle,
      promoText: placeholderSettings.promoText,
      adminLogin: login,
      adminPasswordHash: passwordHash,
    })
    .onConflictDoUpdate({
      target: settings.id,
      set: { adminLogin: login, adminPasswordHash: passwordHash },
    });

  console.log("Слайды на главной…");
  for (const s of placeholderHeroSlides) {
    await db
      .insert(heroSlides)
      .values({
        id: s.id,
        imageUrl: s.imageUrl,
        title: s.title,
        subtitle: s.subtitle,
        buttonText: s.buttonText,
        buttonHref: s.buttonHref,
        isActive: s.isActive,
        sortOrder: s.sortOrder,
      })
      .onConflictDoNothing({ target: heroSlides.id });
  }

  console.log("Тестовые товары…");
  for (const p of placeholderProducts) {
    await db
      .insert(products)
      .values({
        id: p.id,
        slug: p.slug,
        name: p.name,
        categoryId: p.categoryId,
        price: p.price,
        oldPrice: p.oldPrice,
        description: p.description,
        specs: p.specs,
        inStock: p.inStock,
        isPublished: p.isPublished,
        sortOrder: p.sortOrder,
        createdAt: new Date(p.createdAt),
      })
      .onConflictDoNothing({ target: products.slug });

    for (const img of p.images) {
      await db
        .insert(productImages)
        .values({
          id: img.id,
          productId: p.id,
          url: img.url,
          thumbUrl: img.thumbUrl,
          pathname: `seed/${img.id}.webp`,
          thumbPathname: `seed/${img.id}-thumb.webp`,
          width: img.width,
          height: img.height,
          sortOrder: img.sortOrder,
        })
        .onConflictDoNothing({ target: productImages.id });
    }
  }

  console.log("\nГотово.");
  if (!process.env.ADMIN_PASSWORD) {
    console.log(`Логин админа: ${login}`);
    console.log(`Пароль (сгенерирован, сохраните!): ${password}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
