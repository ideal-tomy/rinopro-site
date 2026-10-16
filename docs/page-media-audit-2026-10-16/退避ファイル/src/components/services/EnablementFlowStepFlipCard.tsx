"use client";

import type { CSSProperties } from "react";
import Image from "next/image";
import { RotateCw } from "lucide-react";
import type { EnablementDevelopmentFlipCard } from "@/lib/content/enablement-development-flip-cards";
import { getFlowStepMedia } from "@/lib/content/flow-step-media";
import { useAboutTeamCardFlip } from "@/components/about/useAboutTeamCardFlip";
import flip from "./services-page.module.css";
import styles from "./enablement-page.module.css";

type EnablementFlowStepFlipCardProps = {
  card: EnablementDevelopmentFlipCard;
  sizes?: string;
  priority?: boolean;
};

export function EnablementFlowStepFlipCard({
  card,
  sizes = "(max-width: 767px) calc(100vw - 40px), 480px",
  priority = false,
}: EnablementFlowStepFlipCardProps) {
  const media = getFlowStepMedia(card.mediaTrack, card.step);
  const { labelJa } = card;
  const { display, toggleFlip, stage } = useAboutTeamCardFlip(labelJa, {
    detailPhrase: "説明",
    interactiveOnAllViewports: true,
    flipTriggerButtonOnly: true,
    disableScrollFlip: false,
    scrollFlipVisibleRatio: 0.98,
  });

  if (!media) return null;

  const isFront = display.current === 0;

  return (
    <article className={styles.flowStepFlip} aria-labelledby={`flow-step-${card.step}-title`}>
      <div
        className={`${flip.flipStage} ${styles.flowStepFlipStage} ${styles.flowStepFlipStageButtonOnly}`}
        ref={stage}
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
              aria-hidden={display.current !== side}
              inert={display.current !== side}
            >
              {side === 0 ? (
                <div className={styles.flowStepFront}>
                  <div className={styles.flowStepFrontBlock}>
                    <div className={styles.flowStepFrontHeader}>
                      <p
                        id={`flow-step-${card.step}-title`}
                        className={styles.flowStepFrontHeading}
                      >
                        {labelJa}
                      </p>
                      <p className={styles.flowStepFrontSubtitle}>
                        {card.frontSubtitle}
                      </p>
                    </div>
                    <div className={styles.flowStepIllustration}>
                      <Image
                        src={media.src}
                        alt=""
                        fill
                        className={styles.flowStepIllustrationImage}
                        style={
                          media.objectPosition
                            ? { objectPosition: media.objectPosition }
                            : undefined
                        }
                        sizes={sizes}
                        priority={priority}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className={styles.flowStepBackMain}>
                    <h3 className={styles.flowStepBackTitle}>{card.backTitle}</h3>
                    <p className={styles.flowStepBackLead}>{card.backLead}</p>
                    <ul className={styles.flowStepBackList}>
                      {card.bullets.map((item) => (
                        <li key={item.term}>
                          <span className={styles.flowStepBackTerm}>
                            {item.term}
                          </span>
                          <span className={styles.flowStepBackDetail}>
                            {item.detail}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.flowStepBackSummary}>
                    <p className={styles.flowStepBackSummaryLabel}>
                      {card.summaryLabel}
                    </p>
                    <p className={styles.flowStepBackSummaryText}>
                      {card.summaryText}
                    </p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          className={`${styles.flowStepFlipButton} ${!isFront ? styles.flowStepFlipButtonOnBand : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFlip();
          }}
          aria-label={
            isFront ? `${labelJa}の説明を表示` : `${labelJa}の表面に戻る`
          }
        >
          <RotateCw className={styles.flowStepFlipButtonIcon} aria-hidden="true" />
        </button>
      </div>
      <span className={flip.srOnly} role="status">{display.status}</span>
    </article>
  );
}
