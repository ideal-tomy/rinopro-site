import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type HomeSectionShellProps = {
  /** "alt" は明度を 5〜10% 下げて章立て感を作るバンド */
  tone?: "default" | "alt";
  className?: string;
  children: ReactNode;
};

/**
 * トップページのセクション背景濃淡を担う薄いラッパ。
 * - `default`: 偶数バンド相当。粒子背景の上にごく薄いハイライト（明度をわずかに上げる）
 * - `alt`: 奇数バンド相当。`bg-base-dark/35` で一段暗くして章立て
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
        tone === "default" && "bg-[color-mix(in_srgb,var(--color-base)_93%,white_7%)]/[0.18]",
        tone === "alt" && "bg-base-dark/35",
        className
      )}
    >
      {children}
    </div>
  );
}
