export type PreparedImage = {
  full: Blob;
  thumb: Blob;
  blurDataUrl: string;
  width: number;
  height: number;
};

const FULL_MAX = 1600;
const THUMB_MAX = 600;
const BLUR_MAX = 20;

function fitSize(width: number, height: number, max: number) {
  if (Math.max(width, height) <= max) return { width, height };
  const scale = max / Math.max(width, height);
  return { width: Math.round(width * scale), height: Math.round(height * scale) };
}

function drawToBlob(bitmap: ImageBitmap, width: number, height: number, type: string, quality: number): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D недоступен в этом браузере");
  ctx.drawImage(bitmap, 0, 0, width, height);
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Не удалось обработать фото"))),
      type,
      quality,
    );
  });
}

function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Не удалось создать превью"));
    reader.readAsDataURL(blob);
  });
}

/**
 * HEIC определяем по сигнатуре файла (isHeic из heic-to), а не по MIME —
 * iPhone часто отдаёт пустой file.type при выборе фото из галереи.
 * imageOrientation: 'from-image' чинит EXIF-поворот вертикальных снимков —
 * без этой опции часть браузеров тихо теряет ориентацию.
 *
 * heic-to импортируется динамически: она нужна только для HEIC-файлов
 * (меньшинство после первого автоконверта на части iPhone), а тянет за
 * собой WASM-декодер libheif — незачем грузить это для обычного JPEG.
 */
async function toBitmap(file: File): Promise<ImageBitmap> {
  const { isHeic, heicTo } = await import("heic-to");

  if (await isHeic(file)) {
    return heicTo({ blob: file, type: "bitmap", options: { imageOrientation: "from-image" } });
  }
  return createImageBitmap(file, { imageOrientation: "from-image" });
}

/** Из одного файла делает три производных: полный размер, миниатюру и блюр-превью */
export async function prepareImage(file: File): Promise<PreparedImage> {
  const bitmap = await toBitmap(file);
  const { width, height } = bitmap;

  const fullSize = fitSize(width, height, FULL_MAX);
  const thumbSize = fitSize(width, height, THUMB_MAX);
  const blurSize = fitSize(width, height, BLUR_MAX);

  try {
    const [full, thumb, blurBlob] = await Promise.all([
      drawToBlob(bitmap, fullSize.width, fullSize.height, "image/webp", 0.82),
      drawToBlob(bitmap, thumbSize.width, thumbSize.height, "image/webp", 0.8),
      drawToBlob(bitmap, blurSize.width, blurSize.height, "image/jpeg", 0.5),
    ]);

    const blurDataUrl = await blobToDataUrl(blurBlob);

    return { full, thumb, blurDataUrl, width, height };
  } finally {
    bitmap.close();
  }
}
