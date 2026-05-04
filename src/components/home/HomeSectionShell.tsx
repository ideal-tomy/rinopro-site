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
 * - 既存 ParticleBackground (`-z-10`) を完全に塗り潰さない範囲で `bg-base-dark/35` をオーバーレイ
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
        tone === "alt" && "bg-base-dark/35",
        className
      )}
    >
      {children}
    </div>
  );
}
