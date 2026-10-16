"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const SLIDE_INTERVAL_MS = 3500;

type ShowcaseThumbnailSlidesProps = {
  slides: readonly string[];
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

export function ShowcaseThumbnailSlides({
  slides,
  alt,
  sizes = "(max-width: 768px) 100vw, 33vw",
  priority = false,
  className,
}: ShowcaseThumbnailSlidesProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduceMotion || slides.length <= 1) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [reduceMotion, slides.length]);

  if (slides.length === 0) return null;

  const displayIndex = reduceMotion ? 0 : activeIndex;

  return (
    <div className={cn("relative h-full w-full", className)}>
      {slides.map((src, index) => (
        <Image
          key={src}
          src={src}
          alt={slides.length > 1 ? `${alt}（${index + 1}/${slides.length}）` : alt}
          fill
          className={cn(
            "object-cover motion-safe:transition-opacity motion-safe:duration-700",
            index === displayIndex ? "opacity-100" : "opacity-0"
          )}
          sizes={sizes}
          priority={priority && index === 0}
        />
      ))}
      {slides.length > 1 && !reduceMotion ? (
        <div
          className="pointer-events-none absolute bottom-2 left-0 right-0 flex justify-center gap-1.5"
          aria-hidden
        >
          {slides.map((src, index) => (
            <span
              key={`dot-${src}`}
              className={cn(
                "size-1.5 rounded-full motion-safe:transition-colors motion-safe:duration-300",
                index === displayIndex
                  ? "bg-[var(--color-bg-pure)]"
                  : "bg-[var(--color-bg-pure)]/45"
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
