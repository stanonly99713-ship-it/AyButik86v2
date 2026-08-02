// Источник истины по форме словаря — az.ts проверяется на совпадение ключей
// через `satisfies Dictionary` (см. types.ts). Значения — обычные строки,
// {токены} подставляются функцией t() из useTranslation.ts.
export const ru = {
  common: {
    whatsapp: "Написать в WhatsApp",
    whatsappShort: "Написать",
    close: "Закрыть",
    cancel: "Отмена",
    save: "Сохранить",
    saving: "Сохраняем…",
    saved: "Сохранено",
    delete: "Удалить",
    confirmDelete: "Да, удалить",
    processing: "Обработка…",
    retry: "Повторить",
    catalog: "Каталог",
    contacts: "Контакты",
  },

  header: {
    openMenu: "Открыть меню",
    search: "Поиск",
    searchPlaceholder: "Искать товары…",
    closeSearch: "Закрыть поиск",
    categoriesLabel: "Категории",
    closeMenu: "Закрыть меню",
  },

  footer: {
    tagline: "Эстетика вашего дома",
    contactsLabel: "Контакты",
    shopLabel: "Магазин",
    mapTitle: "Адрес магазина на карте",
  },

  home: {
    newArrivals: "Новинки",
    goToCatalog: "Перейти в каталог →",
    saleOfWeek: "Скидки недели",
  },

  promo: {
    defaultCta: "К покупкам →",
  },

  catalog: {
    title: "Каталог",
    searchTitle: "Поиск: «{q}»",
    empty: "Ничего не нашлось. Попробуйте другой запрос или сбросьте фильтры.",
    filters: "Фильтры",
    filtersWithCount: "Фильтры ({count})",
    sort: "Сортировка",
    sortNew: "Новинки",
    sortPriceAsc: "Сначала дешевле",
    sortPriceDesc: "Сначала дороже",
    sortDiscount: "Скидки",
    category: "Категория",
    allCategories: "Все категории",
    inStockOnly: "Только в наличии",
    show: "Показать",
    heroSlideAria: "Слайд {n}",
  },

  product: {
    inStock: "В наличии",
    outOfStock: "Под заказ",
    specs: "Характеристики",
    related: "Похожие товары",
    discountBadge: "Скидка -{n}%",
    closeGallery: "Закрыть просмотр",
    whatsappAria: "Написать в WhatsApp про товар «{name}»",
    whatsappMessage: "Здравствуйте! Интересует товар: «{name}» — {price}",
  },

  contacts: {
    title: "Контакты",
    address: "Адрес",
    mapTitle: "Адрес на карте",
  },

  notFound: {
    title: "Страница не найдена",
    body: "Возможно, товар сняли с публикации или ссылка устарела.",
    cta: "Перейти в каталог",
  },

  errorPage: {
    oops: "Ой",
    title: "Что-то пошло не так",
    body: "Попробуйте обновить страницу.",
    retry: "Обновить",
  },

  admin: {
    common: {
      passwordLink: "Пароль",
      logout: "Выйти",
      brand: "AyButik86 · Админ",
      back: "Назад",
    },

    login: {
      loginLabel: "Логин",
      passwordLabel: "Пароль",
      signingIn: "Входим…",
      signIn: "Войти",
      title: "Вход в админку",
      errorLockout: "Слишком много попыток. Попробуйте снова через {minutes} мин.",
      errorInvalidCredentials: "Неверный логин или пароль",
    },

    password: {
      title: "Смена пароля",
      currentPassword: "Текущий пароль",
      newPassword: "Новый пароль",
      repeatPassword: "Повторите новый пароль",
      success: "Пароль изменён.",
      errorTooShort: "Новый пароль должен быть не короче 6 символов",
      errorMismatch: "Пароли не совпадают",
      errorSettingsNotFound: "Настройки не найдены",
      errorWrongCurrent: "Текущий пароль неверный",
    },

    tabs: {
      products: "Товары",
      categories: "Категории",
      hero: "Оформление",
      settings: "Контакты",
    },

    products: {
      title: "Товары",
      searchPlaceholder: "Поиск по названию…",
      all: "Все",
      empty: "Ничего не найдено.",
      statusDraft: "Черновик",
      statusPublished: "Опубликован",
      statusHidden: "Скрыт",
      addAria: "Добавить товар",
      backAria: "Назад к товарам",
      newProductTitle: "Новый товар",
    },

    productActions: {
      menuAria: "Действия с товаром",
      unpublish: "Снять с публикации",
      publish: "Опубликовать",
      confirmText: "Удалить «{name}»? Это действие нельзя отменить.",
    },

    productForm: {
      nameLabel: "Название",
      namePlaceholder: "Например, Сервиз «Ромашка», 12 предметов",
      categoryLabel: "Категория",
      priceLabel: "Цена, ₽",
      oldPriceLabel: "Старая цена, ₽",
      priceHelp: "Оставьте «Старая цена» пустой, если скидки нет. Если заполнить — на товаре появится значок «Скидка».",
      inStockLabel: "В наличии",
      descriptionLabel: "Описание",
      descriptionPlaceholder: "Расскажите о товаре: материал, для чего подходит, особенности…",
      specsLabel: "Характеристики",
      advanced: "Дополнительно",
      slugLabel: "Адрес страницы",
      slugHelp: "Меняйте осторожно — если товар уже разослан покупателям, старая ссылка перестанет работать.",
      saveDraft: "Сохранить черновик",
      publish: "Опубликовать",
      errorNotFound: "Товар не найден",
      errorEmptyName: "Введите название товара",
      errorOldPriceInvalid: "Старая цена должна быть больше текущей — иначе это не скидка",
    },

    specsEditor: {
      keyPlaceholder: "Материал",
      valuePlaceholder: "Фарфор",
      removeAria: "Удалить характеристику",
      addRow: "+ Добавить характеристику",
      suggestions: ["Материал", "Размер", "Объём", "Количество предметов", "Цвет", "Бренд", "Страна"],
    },

    photoUploader: {
      addPhoto: "+ Добавить фото",
      coverBadge: "Главное фото",
      moveLeftAria: "Переместить влево",
      setCoverAria: "Сделать главным",
      moveRightAria: "Переместить вправо",
      removeAria: "Удалить фото",
      uploadError: "Не получилось загрузить фото. Проверьте интернет и попробуйте ещё раз.",
    },

    singleImageUploader: {
      defaultLabel: "Загрузить фото",
      replacePhoto: "Заменить фото",
    },

    categories: {
      title: "Категории",
    },

    categoryForm: {
      placeholder: "Новая категория",
      add: "Добавить",
      errorEmptyName: "Введите название категории",
    },

    categoryRow: {
      rename: "Переименовать",
      deleteAria: "Удалить категорию",
      confirmDeleteText: "Удалить категорию «{name}»?",
      errorEmptyName: "Название не может быть пустым",
      errorNotEmpty: "Нельзя удалить — в категории {count} {word}. Сначала перенесите их в другую категорию.",
      productCount: "{count} {word}",
    },

    hero: {
      title: "Оформление",
      promoSectionLabel: "Акции месяца — баннер на главной",
      slidesLabel: "Слайды на главной",
      addSlide: "+ Добавить слайд",
      noSlides: "Слайдов пока нет.",
    },

    heroSlideCard: {
      uploadLabel: "Загрузить фото слайда",
      titlePlaceholder: "Заголовок",
      subtitlePlaceholder: "Подзаголовок",
      buttonTextPlaceholder: "Текст кнопки",
      activeLabel: "Показывать на сайте",
      deleteSlide: "Удалить слайд",
      confirmQuestion: "Точно?",
    },

    promoBannerForm: {
      uploadLabel: "Загрузить фото баннера",
      titlePlaceholder: "Заголовок акции",
      textPlaceholder: "Скидки до 30% на аксессуары для кухни до конца месяца",
    },

    settings: {
      title: "Контакты",
    },

    contactsForm: {
      phoneLabel: "Телефон",
      whatsappLabel: "WhatsApp",
      whatsappHelp: "Можно вводить как угодно — лишние символы уберутся сами.",
      addressLabel: "Адрес",
      addressPlaceholder: "г. Москва, ул. Пражская, д. 4, корп. Б",
      hoursLabel: "Часы работы",
      hoursPlaceholder: "9:00 - 21:00 (ежедневно)",
      instagramLabel: "Instagram",
      telegramLabel: "Telegram",
      mapLabel: "Ссылка на карту (Яндекс.Карты, код для вставки)",
      errorMissingPhone: "Укажите телефон",
      errorMissingWhatsapp: "Укажите номер для WhatsApp",
    },
  },
};
