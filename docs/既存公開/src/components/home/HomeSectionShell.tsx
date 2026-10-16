import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type HomeSectionShellProps = {
  /** v2背景リズム: warm/pure/neutral を使い分ける */
  tone?: "default" | "warm" | "pure" | "neutral";
  className?: string;
  children: ReactNode;
};

/**
 * トップページのセクション背景濃淡を担う薄いラッパ。
 * - `default`: ベース背景
 * - `warm`: About向けの暖色背景
 * - `pure`: 白背景
 * - `neutral`: 中間背景
 * - セクション自体のレイアウト（max-w・py 等）には触らない
 */
export function HomeSectionShell({
  tone = "default",
  className,
  children,
}: HomeSectionShellProps) {
  return (
    <div
      className={cn(
        "relative",
        tone === "default" && "bg-[var(--color-bg-base)]",
        tone === "warm" && "bg-[var(--color-bg-warm)]",
        tone === "pure" && "bg-[var(--color-bg-pure)]",
        tone === "neutral" && "bg-[var(--color-bg-neutral)]",
        className
      )}
    >
      {children}
    </div>
  );
}
