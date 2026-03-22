"use client";

import { cn } from "@/lib/utils";

interface DemoTelopFullSlideProps {
  text: string;
  className?: string;
}

/** モバイルモーダル内：親の motion でフェード。中身のみ。 */
export function DemoTelopFullSlide({ text, className }: DemoTelopFullSlideProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "flex h-full min-h-[12rem] flex-col items-center justify-center rounded-lg border border-emerald-500/25 bg-slate-950 p-4 shadow-inner",
        className
      )}
    >
      <p className="max-w-md text-center text-sm font-medium leading-relaxed !text-white sm:text-base">
        {text}
      </p>
      <p className="mt-6 text-[10px] !text-emerald-300/90">次の画面に進みます…</p>
    </div>
  );
}
