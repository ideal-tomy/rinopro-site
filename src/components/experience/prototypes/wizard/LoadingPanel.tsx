"use client";

import { cn } from "@/lib/utils";

interface LoadingPanelProps {
  /** ストリーミング中に表示する累積テキスト（任意） */
  streamingText?: string;
  className?: string;
}

export function LoadingPanel({ streamingText, className }: LoadingPanelProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-silver/25 bg-base-dark/95 p-8 text-center shadow-xl md:p-10",
        className
      )}
    >
      <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center">
        <span
          className="inline-block h-9 w-9 animate-spin rounded-full border-2 border-accent border-t-transparent"
          aria-hidden
        />
      </div>
      <p className="text-sm font-medium text-accent">ナレッジを参照して回答を生成しています</p>
      {streamingText && streamingText.length > 0 ? (
        <div className="mt-4 max-h-40 overflow-y-auto rounded-lg border border-silver/15 bg-silver/5 p-3 text-left text-xs leading-relaxed text-text-sub">
          {streamingText}
        </div>
      ) : (
        <p className="mt-2 text-xs text-text-sub">数十秒かかる場合があります</p>
      )}
    </div>
  );
}
