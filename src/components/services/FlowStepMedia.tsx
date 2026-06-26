import Image from "next/image";
import type { FlowTrackKey } from "@/lib/content/site-copy";
import { getFlowStepMedia } from "@/lib/content/flow-step-media";
import { cn } from "@/lib/utils";

type FlowStepMediaProps = {
  track: FlowTrackKey;
  step: string;
  className?: string;
};

export function FlowStepMedia({ track, step, className }: FlowStepMediaProps) {
  const media = getFlowStepMedia(track, step);
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
