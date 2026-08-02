import type { Dictionary } from "./types";

// Литературный азербайджанский, не дословный перевод. Ключи должны точно
// совпадать со структурой ru.ts — `satisfies Dictionary` проверяет это на
// этапе сборки.
export const az = {
  common: {
    whatsapp: "WhatsApp-a yazın",
    whatsappShort: "Yazın",
    close: "Bağla",
    cancel: "Ləğv et",
    save: "Yadda saxla",
    saving: "Yadda saxlanılır…",
    saved: "Yadda saxlanıldı",
    delete: "Sil",
    confirmDelete: "Bəli, sil",
    processing: "İşlənir…",
    retry: "Yenidən cəhd et",
    catalog: "Kataloq",
    contacts: "Əlaqə",
  },

  header: {
    openMenu: "Menyunu aç",
    search: "Axtarış",
    searchPlaceholder: "Məhsul axtarın…",
    closeSearch: "Axtarışı bağla",
    categoriesLabel: "Kateqoriyalar",
    closeMenu: "Menyunu bağla",
  },

  footer: {
    tagline: "Evinizin estetikası",
    contactsLabel: "Əlaqə",
    shopLabel: "Mağaza",
    mapTitle: "Mağazanın xəritədəki ünvanı",
  },

  home: {
    newArrivals: "Yeniliklər",
    goToCatalog: "Kataloqa keçin →",
    saleOfWeek: "Həftənin endirimləri",
  },

  promo: {
    defaultCta: "Alış-verişə keçin →",
  },

  catalog: {
    title: "Kataloq",
    searchTitle: "Axtarış: «{q}»",
    empty: "Heç nə tapılmadı. Başqa sorğu sınayın və ya filtrləri sıfırlayın.",
    filters: "Filtrlər",
    filtersWithCount: "Filtrlər ({count})",
    sort: "Sıralama",
    sortNew: "Yeniliklər",
    sortPriceAsc: "Əvvəlcə ucuz",
    sortPriceDesc: "Əvvəlcə baha",
    sortDiscount: "Endirimlər",
    category: "Kateqoriya",
    allCategories: "Bütün kateqoriyalar",
    inStockOnly: "Yalnız mövcud olanlar",
    show: "Göstər",
    heroSlideAria: "Slayd {n}",
  },

  product: {
    inStock: "Mövcuddur",
    outOfStock: "Sifarişlə",
    specs: "Xüsusiyyətlər",
    related: "Oxşar məhsullar",
    discountBadge: "Endirim -{n}%",
    closeGallery: "Baxışı bağla",
    whatsappAria: "«{name}» məhsulu haqqında WhatsApp-a yazın",
    whatsappMessage: "Salam! «{name}» məhsulu ilə maraqlanıram — {price}",
  },

  contacts: {
    title: "Əlaqə",
    address: "Ünvan",
    mapTitle: "Xəritədə ünvan",
  },

  notFound: {
    title: "Səhifə tapılmadı",
    body: "Ola bilsin, məhsul dərcdən çıxarılıb və ya keçid köhnəlib.",
    cta: "Kataloqa keçin",
  },

  errorPage: {
    oops: "Bağışlayın",
    title: "Nəsə səhv getdi",
    body: "Səhifəni yeniləməyə cəhd edin.",
    retry: "Yenilə",
  },

  admin: {
    common: {
      passwordLink: "Şifrə",
      logout: "Çıxış",
      brand: "AyButik86 · Admin",
      back: "Geri",
    },

    login: {
      loginLabel: "İstifadəçi adı",
      passwordLabel: "Şifrə",
      signingIn: "Daxil olunur…",
      signIn: "Daxil ol",
      title: "Admin panelinə giriş",
      errorLockout: "Çox sayda cəhd edildi. {minutes} dəqiqədən sonra yenidən cəhd edin.",
      errorInvalidCredentials: "Yanlış istifadəçi adı və ya şifrə",
    },

    password: {
      title: "Şifrənin dəyişdirilməsi",
      currentPassword: "Cari şifrə",
      newPassword: "Yeni şifrə",
      repeatPassword: "Yeni şifrəni təkrar edin",
      success: "Şifrə dəyişdirildi.",
      errorTooShort: "Yeni şifrə ən azı 6 simvol olmalıdır",
      errorMismatch: "Şifrələr uyğun gəlmir",
      errorSettingsNotFound: "Tənzimləmələr tapılmadı",
      errorWrongCurrent: "Cari şifrə yanlışdır",
    },

    tabs: {
      products: "Məhsullar",
      categories: "Kateqoriyalar",
      hero: "Dizayn",
      settings: "Əlaqə",
    },

    products: {
      title: "Məhsullar",
      searchPlaceholder: "Ada görə axtarın…",
      all: "Hamısı",
      empty: "Heç nə tapılmadı.",
      statusDraft: "Qaralama",
      statusPublished: "Dərc olunub",
      statusHidden: "Gizlədilib",
      addAria: "Məhsul əlavə et",
      backAria: "Məhsullara qayıt",
      newProductTitle: "Yeni məhsul",
    },

    productActions: {
      menuAria: "Məhsulla əməliyyatlar",
      unpublish: "Dərcdən çıxar",
      publish: "Dərc et",
      confirmText: "«{name}» silinsin? Bu əməliyyatı geri qaytarmaq mümkün deyil.",
    },

    productForm: {
      nameLabel: "Ad",
      namePlaceholder: "Məsələn, «Çobanyastığı» servizi, 12 əşya",
      categoryLabel: "Kateqoriya",
      priceLabel: "Qiymət, ₽",
      oldPriceLabel: "Köhnə qiymət, ₽",
      priceHelp: "Əgər endirim yoxdursa, «Köhnə qiymət» sahəsini boş buraxın. Doldursanız, məhsulda «Endirim» nişanı görünəcək.",
      inStockLabel: "Mövcuddur",
      descriptionLabel: "Təsvir",
      descriptionPlaceholder: "Məhsul haqqında danışın: material, nə üçün uyğundur, xüsusiyyətləri…",
      specsLabel: "Xüsusiyyətlər",
      advanced: "Əlavə",
      slugLabel: "Səhifə ünvanı",
      slugHelp: "Ehtiyatla dəyişin — əgər məhsul artıq müştərilərə göndərilibsə, köhnə keçid işləməyəcək.",
      saveDraft: "Qaralama kimi saxla",
      publish: "Dərc et",
      errorNotFound: "Məhsul tapılmadı",
      errorEmptyName: "Məhsulun adını daxil edin",
      errorOldPriceInvalid: "Köhnə qiymət indiki qiymətdən böyük olmalıdır — əks halda bu endirim sayılmır",
    },

    specsEditor: {
      keyPlaceholder: "Material",
      valuePlaceholder: "Farfor",
      removeAria: "Xüsusiyyəti sil",
      addRow: "+ Xüsusiyyət əlavə et",
      suggestions: ["Material", "Ölçü", "Həcm", "Əşya sayı", "Rəng", "Brend", "Ölkə"],
    },

    photoUploader: {
      addPhoto: "+ Şəkil əlavə et",
      coverBadge: "Əsas şəkil",
      moveLeftAria: "Sola köçür",
      setCoverAria: "Əsas et",
      moveRightAria: "Sağa köçür",
      removeAria: "Şəkli sil",
      uploadError: "Şəkil yüklənmədi. İnterneti yoxlayıb yenidən cəhd edin.",
    },

    singleImageUploader: {
      defaultLabel: "Şəkil yüklə",
      replacePhoto: "Şəkli dəyiş",
    },

    categories: {
      title: "Kateqoriyalar",
    },

    categoryForm: {
      placeholder: "Yeni kateqoriya",
      add: "Əlavə et",
      errorEmptyName: "Kateqoriyanın adını daxil edin",
    },

    categoryRow: {
      rename: "Adını dəyiş",
      deleteAria: "Kateqoriyanı sil",
      confirmDeleteText: "«{name}» kateqoriyası silinsin?",
      errorEmptyName: "Ad boş ola bilməz",
      errorNotEmpty: "Silmək olmaz — kateqoriyada {count} {word} var. Əvvəlcə onları başqa kateqoriyaya köçürün.",
      productCount: "{count} {word}",
      uploadLabel: "Şəkil",
    },

    hero: {
      title: "Dizayn",
      promoSectionLabel: "Ayın aksiyası — əsas səhifədəki banner",
      slidesLabel: "Əsas səhifənin slaydları",
      addSlide: "+ Slayd əlavə et",
      noSlides: "Hələ slayd yoxdur.",
    },

    heroSlideCard: {
      uploadLabel: "Slaydın şəklini yüklə",
      titlePlaceholder: "Başlıq",
      subtitlePlaceholder: "Alt başlıq",
      buttonTextPlaceholder: "Düymənin mətni",
      activeLabel: "Saytda göstər",
      deleteSlide: "Slaydı sil",
      confirmQuestion: "Əminsiniz?",
    },

    promoBannerForm: {
      uploadLabel: "Banner şəklini yüklə",
      titlePlaceholder: "Aksiyanın başlığı",
      textPlaceholder: "Ay sonuna qədər mətbəx aksesuarlarına 30%-dək endirim",
    },

    settings: {
      title: "Əlaqə",
    },

    contactsForm: {
      phoneLabel: "Telefon",
      whatsappLabel: "WhatsApp",
      whatsappHelp: "İstədiyiniz kimi daxil edə bilərsiniz — artıq simvollar özü silinəcək.",
      addressLabel: "Ünvan",
      addressPlaceholder: "Moskva ş., Praqskaya küç., 4 bina, B tikili",
      hoursLabel: "İş saatları",
      hoursPlaceholder: "9:00 - 21:00 (hər gün)",
      instagramLabel: "Instagram",
      telegramLabel: "Telegram",
      mapLabel: "Xəritə keçidi (Yandex Xəritə, yerləşdirmə kodu)",
      errorMissingPhone: "Telefon nömrəsini qeyd edin",
      errorMissingWhatsapp: "WhatsApp üçün nömrə qeyd edin",
    },
  },
} satisfies Dictionary;
