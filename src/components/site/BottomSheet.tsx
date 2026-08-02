"use client";

import { useT } from "@/locales/useTranslation";

export function BottomSheet({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const { t } = useT();

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <button type="button" aria-label={t("common.close")} className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative flex max-h-[80svh] w-full flex-col rounded-t-2xl bg-surface pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <p className="text-cream">{title}</p>
          <button type="button" onClick={onClose} className="text-sm text-muted">
            {t("common.close")}
          </button>
        </div>
        <div className="overflow-y-auto px-4 py-3">{children}</div>
      </div>
    </div>
  );
}
