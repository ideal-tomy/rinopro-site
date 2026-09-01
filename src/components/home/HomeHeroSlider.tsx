"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const SLIDE_INTERVAL_MS = 5500;

type HeroSlide = {
  src: string;
  alt: string;
};

type HomeHeroSliderProps = {
  slides: readonly HeroSlide[];
};

export function HomeHeroSlider({ slides }: HomeHeroSliderProps) {
  const reduceMotion = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (reduceMotion || slides.length <= 1 || paused) return;
    const id = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % slides.length);
    }, SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [paused, reduceMotion, slides.length]);

  if (slides.length === 0) return null;

  const displayIndex = reduceMotion ? 0 : activeIndex;

  return (
    <div
      className="absolute inset-0"
      aria-roledescription="carousel"
      aria-label="トップビジュアル"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((slide, index) => (
        <Image
          key={slide.src}
          src={slide.src}
          alt={index === displayIndex ? slide.alt : ""}
          fill
          priority={index === 0}
          sizes="100vw"
          aria-hidden={index !== displayIndex}
          className={cn(
            "object-cover object-center select-none",
            "motion-safe:transition-opacity motion-safe:duration-700",
            index === displayIndex ? "opacity-100" : "opacity-0"
          )}
        />
      ))}

      <div aria-hidden className="absolute inset-0 bg-black/20" />

      {slides.length > 1 && !reduceMotion ? (
        <div className="absolute bottom-5 left-0 right-0 z-20 flex justify-center gap-2">
          {slides.map((slide, index) => (
            <button
              key={`dot-${slide.src}`}
              type="button"
              aria-label={`${index + 1}枚目のビジュアルを表示`}
              aria-current={index === displayIndex ? true : undefined}
              onClick={() => setActiveIndex(index)}
              className={cn(
                "relative z-20 size-2.5 rounded-full motion-safe:transition-colors motion-safe:duration-300",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/40",
                index === displayIndex
                  ? "bg-white"
                  : "bg-white/45 hover:bg-white/70"
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
