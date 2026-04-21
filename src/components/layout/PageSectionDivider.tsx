import { cn } from "@/lib/utils";

type PageSectionDividerProps = {
  className?: string;
  /**
   * `padded`: 単体で使うとき（max-w-6xl + 横パディング）。
   * `inset`: 既に `container` 等でパディングがある内側で全幅の線だけ入れるとき。
   */
  variant?: "padded" | "inset";
  /** `padded` 時の最大幅。既定 6xl、`5xl` は /demo/list など */
  maxWidth?: "5xl" | "6xl";
};

/**
 * セクション間の仕切り（1px）。
 * 中心が --color-glow（細い光）で最も明るく、左右端は transparent に溶けるリニアグラデーション。
 * 中央のみごく弱い光彩で金属的なキレを補助。
 */
export function PageSectionDivider({
  className,
  variant = "padded",
  maxWidth = "6xl",
}: PageSectionDividerProps) {
  const maxW = maxWidth === "5xl" ? "max-w-5xl" : "max-w-6xl";
  return (
    <div
      className={cn(
        "mx-auto w-full",
        variant === "padded" && maxW,
        variant === "padded" && "px-4 md:px-6",
        className
      )}
      aria-hidden
    >
      <div
        className="relative h-px w-full shrink-0 [background:linear-gradient(90deg,transparent_0%,var(--color-glow)_50%,transparent_100%)]"
        style={{
          boxShadow:
            "0 0 10px 0 color-mix(in srgb, var(--color-glow) 28%, transparent), 0 0 22px -4px color-mix(in srgb, var(--color-glow) 14%, transparent)",
        }}
      />
    </div>
  );
}
