"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface PublishedPhoto {
  src: string;
  branchName: string;
  ownerName: string;
  ownerSlug: string;
  branchId: string;
}

export default function PublishedPhotoCarousel({ items }: { items: PublishedPhoto[] }) {
  const [idx, setIdx] = useState(0);
  const count = items.length;
  const current = count ? Math.min(idx, count - 1) : 0;

  useEffect(() => {
    if (count <= 1) return;
    const timer = setInterval(() => setIdx((i) => (i + 1) % count), 2000);
    return () => clearInterval(timer);
  }, [count, idx]);

  if (count === 0) return null;
  const item = items[current];

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface shadow-lg">
      <div className="relative aspect-[4/3] w-full sm:aspect-[16/7]">
        <Image
          key={item.src}
          src={item.src}
          alt={item.branchName}
          fill
          sizes="(max-width: 1536px) 100vw"
          className="object-cover animate-fade-up"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <Link
          href={item.branchId ? `/o/${item.ownerSlug}/${item.branchId}` : `/o/${item.ownerSlug}`}
          className="absolute bottom-0 left-0 right-0 z-10 flex flex-col gap-0.5 p-5 text-white"
        >
          <span className="text-lg font-bold sm:text-xl">{item.branchName}</span>
          <span className="text-sm text-white/85">{item.ownerName}</span>
        </Link>

        {count > 1 && (
          <>
            <button
              type="button"
              onClick={() => setIdx((i) => (i - 1 + count) % count)}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/60"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => setIdx((i) => (i + 1) % count)}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/40 p-2 text-white backdrop-blur transition hover:bg-black/60"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1.5">
              {items.map((img, i) => (
                <button
                  key={img.src}
                  type="button"
                  onClick={() => setIdx(i)}
                  aria-label={`Go to photo ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === current ? "w-5 bg-white" : "w-1.5 bg-white/50 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}