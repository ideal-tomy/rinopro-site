"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import type { FlowTrackKey } from "@/lib/content/site-copy";
import { getFlowStepMedia } from "@/lib/content/flow-step-media";
import { useAboutTeamCardFlip } from "@/components/about/useAboutTeamCardFlip";
import flip from "./services-page.module.css";
import styles from "./enablement-page.module.css";

type EnablementFlowStepFlipCardProps = {
  labelJa: string;
  body: string;
  track: FlowTrackKey;
  step: string;
  sizes?: string;
  priority?: boolean;
};

export function EnablementFlowStepFlipCard({
  labelJa,
  body,
  track,
  step,
  sizes = "(max-width: 767px) calc(100vw - 40px), 616px",
  priority = false,
}: EnablementFlowStepFlipCardProps) {
  const media = getFlowStepMedia(track, step);
  const { display, stage } = useAboutTeamCardFlip(labelJa, {
    detailPhrase: "説明",
  });

  if (!media) return null;

  return (
    <div className={styles.flowStepFlip}>
      <div
        className={`${flip.flipStage} ${styles.flowStepFlipStage}`}
        ref={stage}
        role="button"
        tabIndex={display.mobile ? 0 : -1}
        aria-label={
          display.current === 0
            ? `${labelJa}の説明を表示`
            : `${labelJa}の表面に戻る`
        }
      >
        <div
          className={`${flip.flipInner} ${styles.flowStepFlipInner}`}
          style={
            {
              "--flow-step-rotation": `rotateY(${display.angle}deg)`,
              transition: display.reduced ? "none" : undefined,
            } as CSSProperties
          }
        >
          {[0, 1].map((side) => (
            <div
              key={side}
              className={`${flip.face} ${side === 1 ? flip.back : ""} ${styles.flowStepFace} ${
                side === 0 ? styles.flowStepFaceFront : styles.flowStepBack
              }`}
              aria-hidden={display.mobile && display.current !== side}
              inert={display.mobile && display.current !== side}
            >
              {side === 0 ? (
                <>
                  <div className={styles.flowStepCover}>
                    <Image
                      src={media.src}
                      alt=""
                      fill
                      className={styles.flowStepCoverImage}
                      style={
                        media.objectPosition
                          ? { objectPosition: media.objectPosition }
                          : undefined
                      }
                      sizes={sizes}
                      priority={priority}
                    />
                    <div className={styles.flowStepFrontScrim} aria-hidden="true" />
                    <p className={styles.flowStepFrontTitle}>{labelJa}</p>
                  </div>
                </>
              ) : (
                <p className={styles.flowStepBackBody}>{body}</p>
              )}
            </div>
          ))}
        </div>
      </div>
      <span className={flip.srOnly} role="status">{display.status}</span>
    </div>
  );
}
