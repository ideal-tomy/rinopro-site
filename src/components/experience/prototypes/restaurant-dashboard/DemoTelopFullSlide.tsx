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
        "flex h-full min-h-[12rem] flex-col items-center justify-center rounded-lg border border-slate-200 bg-gradient-to-b from-slate-50 to-white p-4",
        className
      )}
    >
      <p className="max-w-md text-center text-sm font-medium leading-relaxed text-slate-800 sm:text-base">
        {text}
      </p>
      <p className="mt-6 text-[10px] text-slate-400">次の画面に進みます…</p>
    </div>
  );
}
