import Image from "next/image";
import { cn } from "@/lib/utils";

export type FlowStepMediaConfig = {
  src: string;
  alt: string;
  /** services01.jpg など wide 画像の切り抜き位置（%） */
  objectPosition?: string;
};

/** 開発フロー各ステップ用ビジュアル（既存アセットのみ） */
export const FLOW_STEP_MEDIA_BY_STEP: Record<string, FlowStepMediaConfig> = {
  "01": {
    src: "/images/services01.jpg",
    alt: "戦略から運用まで一気通貫の開発支援プロセス図",
    objectPosition: "8% center",
  },
  "02": {
    src: "/images/demo_images/m&a_demo01.png",
    alt: "要件整理・入出力関係の画面イメージ",
  },
  "03": {
    src: "/images/demo_images/farm_demo02.png",
    alt: "試作・現場検証のデモ画面イメージ",
  },
  "04": {
    src: "/images/genbakanri_admin.webp",
    alt: "本実装システムの管理画面イメージ",
  },
  "05": {
    src: "/images/hyouka_pc.png",
    alt: "運用・保守フェーズのダッシュボードイメージ",
  },
};

type FlowStepMediaProps = {
  step: string;
  className?: string;
};

export function FlowStepMedia({ step, className }: FlowStepMediaProps) {
  const media = FLOW_STEP_MEDIA_BY_STEP[step];
  if (!media) return null;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-neutral)]",
        className
      )}
    >
      <div className="relative aspect-[16/10] w-full">
        <Image
          src={media.src}
          alt={media.alt}
          fill
          className="object-cover"
          style={
            media.objectPosition
              ? { objectPosition: media.objectPosition }
              : undefined
          }
          sizes="(max-width: 768px) 100vw, 420px"
        />
      </div>
    </div>
  );
}
