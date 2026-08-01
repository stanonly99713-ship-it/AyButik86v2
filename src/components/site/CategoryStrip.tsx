import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryStrip({ categories }: { categories: Category[] }) {
  return (
    <div className="no-scrollbar -mx-4 flex gap-5 overflow-x-auto px-4 py-2">
      {categories.map((c) => (
        <Link key={c.id} href={`/catalog?cat=${c.slug}`} className="flex shrink-0 flex-col items-center gap-2">
          <span className="relative block h-[72px] w-[72px] overflow-hidden rounded-full border border-line bg-surface-2">
            {c.imageUrl && <Image src={c.imageUrl} alt="" fill className="object-cover" sizes="72px" />}
          </span>
          <span className="max-w-[76px] text-center text-[11px] leading-tight text-cream">{c.name}</span>
        </Link>
      ))}
    </div>
  );
}
