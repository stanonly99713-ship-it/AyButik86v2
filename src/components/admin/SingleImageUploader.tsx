"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { prepareImage } from "@/lib/image/prepare";
import { uploadSingle, type UploadedSingle } from "@/lib/image/upload";
import { useT } from "@/locales/useTranslation";

type Props = {
  currentUrl?: string | null;
  pathnamePrefix: string;
  onUploaded: (result: UploadedSingle) => Promise<void>;
  label?: string;
  aspectClassName?: string;
  /** Верхняя граница стороны загружаемого фото — см. prepareImage() */
  maxDimension?: number;
};

export function SingleImageUploader({
  currentUrl,
  pathnamePrefix,
  onUploaded,
  label,
  aspectClassName = "aspect-video",
  maxDimension,
}: Props) {
  const { t } = useT();
  const resolvedLabel = label ?? t("admin.singleImageUploader.defaultLabel");
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setProgress(0);
    try {
      const prepared = await prepareImage(file, maxDimension);
      setProgress(1);
      const seed = typeof crypto.randomUUID === "function" ? crypto.randomUUID() : Math.random().toString(36).slice(2);
      const uploaded = await uploadSingle(`${pathnamePrefix}/${seed}`, prepared.full, (pct) =>
        setProgress(Math.max(1, pct)),
      );
      await onUploaded(uploaded);
      setProgress(null);
    } catch (err) {
      console.error("SingleImageUploader upload failed:", err);
      setError(t("admin.photoUploader.uploadError"));
      setProgress(null);
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,.heic,.heif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          if (inputRef.current) inputRef.current.value = "";
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className={`relative w-full overflow-hidden rounded-lg border border-dashed border-gold/60 bg-surface-2 ${aspectClassName}`}
      >
        {currentUrl ? (
          <Image src={currentUrl} alt="" fill className="object-cover" sizes="600px" />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-sm text-gold-light">{resolvedLabel}</span>
        )}

        {progress !== null && (
          <span className="absolute inset-0 flex items-center justify-center bg-ink/70 text-sm text-cream">
            {progress <= 0 ? t("common.processing") : `${progress}%`}
          </span>
        )}
      </button>

      {currentUrl && progress === null && (
        <button type="button" onClick={() => inputRef.current?.click()} className="mt-1.5 text-xs text-gold-light">
          {t("admin.singleImageUploader.replacePhoto")}
        </button>
      )}

      {error && (
        <p className="mt-1.5 text-xs text-red-400">
          {error} <button type="button" onClick={() => inputRef.current?.click()} className="underline">{t("common.retry")}</button>
        </p>
      )}
    </div>
  );
}
