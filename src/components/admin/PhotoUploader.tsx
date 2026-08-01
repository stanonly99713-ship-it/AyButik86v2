"use client";

import Image from "next/image";
import { useRef, useState, useTransition } from "react";
import { attachImage, moveImage, removeImage, setCoverImage } from "@/actions/images";
import { ChevronLeftIcon, ChevronRightIcon, StarIcon, TrashIcon } from "@/components/icons";
import { prepareImage } from "@/lib/image/prepare";
import { uploadPreparedPair } from "@/lib/image/upload";
import type { ProductImage } from "@/lib/types";

type UploadingItem = {
  id: string;
  file: File;
  name: string;
  progress: number; // 0..100, -1 = ошибка
  error?: string;
};

const CONCURRENCY = 2;

function randomSeed() {
  return typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2);
}

export function PhotoUploader({ productId, images }: { productId: string; images: ProductImage[] }) {
  const [uploading, setUploading] = useState<UploadingItem[]>([]);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);
  const queueRef = useRef<Promise<void>>(Promise.resolve());
  const activeRef = useRef(0);

  function updateItem(id: string, patch: Partial<UploadingItem>) {
    setUploading((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  async function runOne(item: UploadingItem) {
    try {
      const prepared = await prepareImage(item.file);
      updateItem(item.id, { progress: 1 });

      const uploaded = await uploadPreparedPair(productId, randomSeed(), prepared, (pct) =>
        updateItem(item.id, { progress: Math.max(1, pct) }),
      );

      await attachImage({
        productId,
        url: uploaded.url,
        pathname: uploaded.pathname,
        thumbUrl: uploaded.thumbUrl,
        thumbPathname: uploaded.thumbPathname,
        width: prepared.width,
        height: prepared.height,
        blurData: prepared.blurDataUrl,
      });

      setUploading((prev) => prev.filter((i) => i.id !== item.id));
    } catch {
      updateItem(item.id, {
        progress: -1,
        error: "Не получилось загрузить фото. Проверьте интернет и попробуйте ещё раз.",
      });
    } finally {
      activeRef.current -= 1;
    }
  }

  function enqueue(item: UploadingItem) {
    queueRef.current = queueRef.current.then(async () => {
      while (activeRef.current >= CONCURRENCY) {
        await new Promise((r) => setTimeout(r, 150));
      }
      activeRef.current += 1;
      // не await — следующий файл из очереди должен стартовать, пока этот ещё грузится
      void runOne(item);
    });
  }

  function handleFiles(fileList: FileList | null) {
    if (!fileList) return;
    const items: UploadingItem[] = Array.from(fileList).map((file) => ({
      id: randomSeed(),
      file,
      name: file.name,
      progress: 0,
    }));
    setUploading((prev) => [...prev, ...items]);
    items.forEach(enqueue);
    if (inputRef.current) inputRef.current.value = "";
  }

  function retry(item: UploadingItem) {
    updateItem(item.id, { progress: 0, error: undefined });
    enqueue(item);
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.heic,.heif"
        multiple
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex h-12 w-full items-center justify-center rounded-lg border border-dashed border-gold/60 text-sm text-gold-light"
      >
        + Добавить фото
      </button>

      {(images.length > 0 || uploading.length > 0) && (
        <div className="mt-3 grid grid-cols-3 gap-2">
          {images.map((img, i) => (
            <div key={img.id} className="relative">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-surface-2">
                <Image src={img.thumbUrl} alt="" fill className="object-cover" sizes="120px" />
              </div>
              {i === 0 && (
                <span className="absolute left-1 top-1 rounded bg-ink/80 px-1.5 py-0.5 text-[9px] text-gold-light">
                  Главное фото
                </span>
              )}
              <div className="mt-1 flex items-center justify-center gap-0.5">
                <button
                  type="button"
                  aria-label="Переместить влево"
                  disabled={pending || i === 0}
                  onClick={() => startTransition(() => moveImage(img.id, "left"))}
                  className="flex h-8 w-8 items-center justify-center text-cream disabled:opacity-30"
                >
                  <ChevronLeftIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Сделать главным"
                  disabled={pending || i === 0}
                  onClick={() => startTransition(() => setCoverImage(img.id))}
                  className="flex h-8 w-8 items-center justify-center text-gold-light disabled:opacity-30"
                >
                  <StarIcon className="h-4 w-4" filled={i === 0} />
                </button>
                <button
                  type="button"
                  aria-label="Переместить вправо"
                  disabled={pending || i === images.length - 1}
                  onClick={() => startTransition(() => moveImage(img.id, "right"))}
                  className="flex h-8 w-8 items-center justify-center text-cream disabled:opacity-30"
                >
                  <ChevronRightIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Удалить фото"
                  disabled={pending}
                  onClick={() => startTransition(() => removeImage(img.id))}
                  className="flex h-8 w-8 items-center justify-center text-red-400 disabled:opacity-30"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}

          {uploading.map((item) => (
            <div key={item.id} className="relative">
              <div className="flex aspect-square flex-col items-center justify-center rounded-lg border border-line bg-surface-2 p-2 text-center">
                {item.error ? (
                  <>
                    <p className="text-[10px] leading-tight text-red-400">{item.error}</p>
                    <button
                      type="button"
                      onClick={() => retry(item)}
                      className="mt-2 rounded-full border border-gold px-2 py-1 text-[10px] text-gold-light"
                    >
                      Повторить
                    </button>
                  </>
                ) : (
                  <>
                    <span className="text-xs text-muted">{item.progress <= 0 ? "Обработка…" : `${item.progress}%`}</span>
                    <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-surface">
                      <div
                        className="h-full bg-gold transition-all"
                        style={{ width: `${Math.max(5, item.progress)}%` }}
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
