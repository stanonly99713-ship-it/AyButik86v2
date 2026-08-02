import { upload } from "@vercel/blob/client";

export type UploadedPair = {
  url: string;
  pathname: string;
  thumbUrl: string;
  thumbPathname: string;
};

/** Грузит полный размер и миниатюру параллельно, отдаёт общий процент прогресса */
export async function uploadPreparedPair(
  productId: string,
  seed: string,
  files: { full: Blob; thumb: Blob },
  onProgress?: (percent: number) => void,
): Promise<UploadedPair> {
  let fullPct = 0;
  let thumbPct = 0;
  const report = () => onProgress?.(Math.round((fullPct + thumbPct) / 2));

  const [full, thumb] = await Promise.all([
    upload(`products/${productId}/${seed}.webp`, files.full, {
      access: "public",
      handleUploadUrl: "/api/admin/blob-upload",
      onUploadProgress: (e) => {
        fullPct = e.percentage;
        report();
      },
    }),
    upload(`products/${productId}/${seed}-thumb.webp`, files.thumb, {
      access: "public",
      handleUploadUrl: "/api/admin/blob-upload",
      onUploadProgress: (e) => {
        thumbPct = e.percentage;
        report();
      },
    }),
  ]);

  return {
    url: full.url,
    pathname: full.pathname,
    thumbUrl: thumb.url,
    thumbPathname: thumb.pathname,
  };
}

export type UploadedSingle = { url: string; pathname: string };

/** Для баннеров/слайдов, где нужен только один размер, без отдельной миниатюры */
export async function uploadSingle(
  pathnamePrefix: string,
  file: Blob,
  onProgress?: (percent: number) => void,
): Promise<UploadedSingle> {
  const result = await upload(`${pathnamePrefix}.webp`, file, {
    access: "public",
    handleUploadUrl: "/api/admin/blob-upload",
    onUploadProgress: (e) => onProgress?.(e.percentage),
  });
  return { url: result.url, pathname: result.pathname };
}
