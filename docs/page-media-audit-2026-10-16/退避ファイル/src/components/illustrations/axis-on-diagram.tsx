"use client";

import { useId } from "react";

export function AxisOnDiagram() {
  const uid = useId().replace(/:/g, "");

  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto h-[140px] w-[140px] shrink-0 md:h-[160px] md:w-[160px]"
      fill="none"
      aria-hidden
    >
      <title>軸と前進を示す図</title>
      <defs>
        <linearGradient id={`axisOnGlow-${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="var(--color-accent-primary-light)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--color-bg-pure)" stopOpacity="0" />
        </linearGradient>
      </defs>
      <line
        x1="72"
        y1="168"
        x2="72"
        y2="36"
        stroke="var(--color-accent-primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <line
        x1="72"
        y1="88"
        x2="156"
        y2="44"
        stroke="var(--color-accent-primary)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <polygon
        points="156,44 146,48 150,36"
        fill="var(--color-accent-primary)"
      />
      <circle cx="164" cy="38" r="10" fill={`url(#axisOnGlow-${uid})`} opacity="0.85" />
      <circle cx="168" cy="34" r="5" fill="var(--color-warm)" opacity="0.85" />
    </svg>
  );
}
