"use client";

import { useId } from "react";

type CeoSilhouetteProps = {
  /** アクセシブル名（プレースホルダー時は「代表写真の仮シルエット」等） */
  ariaLabel: string;
};

export function CeoSilhouette({ ariaLabel }: CeoSilhouetteProps) {
  const uid = useId().replace(/:/g, "");
  const gradId = `ceo-silhouette-bg-${uid}`;

  return (
    <svg
      viewBox="0 0 360 480"
      xmlns="http://www.w3.org/2000/svg"
      className="h-auto w-full"
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        <radialGradient id={gradId} cx="50%" cy="38%" r="65%">
          <stop offset="0%" stopColor="var(--color-accent-primary-light)" stopOpacity="0.55" />
          <stop offset="100%" stopColor="var(--color-bg-neutral)" stopOpacity="0.95" />
        </radialGradient>
      </defs>
      <rect width="360" height="480" fill={`url(#${gradId})`} />
      {[0, 1, 2].map((i) => (
        <line
          key={i}
          x1={76 + i * 28}
          y1={56 + i * 22}
          x2={118 + i * 36}
          y2={96 + i * 22}
          stroke="var(--color-warm)"
          strokeWidth="1"
          strokeOpacity="0.35"
        />
      ))}
      <path
        d="M90 480 L90 382 Q90 342 110 322 Q130 302 150 297 Q162 292 168 282 Q168 272 168 262 Q168 252 178 247 Q184 242 184 232 A52 52 0 1 1 276 232 Q276 242 282 247 Q292 252 292 262 Q292 272 292 282 Q298 292 310 297 Q330 302 350 322 Q370 342 370 382 L370 480 Z"
        fill="var(--color-text-secondary)"
        opacity="0.55"
      />
    </svg>
  );
}
