"use client";

import { enablementDevelopmentFlipCards } from "@/lib/content/enablement-development-flip-cards";
import { EnablementFlowStepFlipCard } from "./EnablementFlowStepFlipCard";
import styles from "./enablement-page.module.css";

const MEDIA_SIZES =
  "(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) calc(50vw - 56px), 480px";

export function EnablementDevelopmentFlipCards() {
  return (
    <div
      className={`${styles.developmentFlipGrid} ${styles.developmentFlipMobile}`}
    >
      {enablementDevelopmentFlipCards.map((card, index) => (
        <EnablementFlowStepFlipCard
          key={card.step}
          card={card}
          sizes={MEDIA_SIZES}
          priority={index === 0}
        />
      ))}
    </div>
  );
}
