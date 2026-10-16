"use client";

import { useId } from "react";

export function AxisOnGiveDiagram() {
  const uid = useId().replace(/:/g, "");
  const markerId = `give-arrow-${uid}`;

  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className="mx-auto h-[140px] w-[140px] shrink-0 md:h-[160px] md:w-[160px]"
      fill="none"
      aria-hidden
    >
      <title>恩の循環を示す図</title>
      <defs>
        <marker
          id={markerId}
          markerWidth="10"
          markerHeight="10"
          refX="8"
          refY="5"
          orient="auto"
        >
          <polygon
            points="0,0 10,5 0,10"
            fill="var(--color-text-secondary)"
            opacity="0.45"
          />
        </marker>
      </defs>
      <circle
        cx="100"
        cy="100"
        r="78"
        stroke="var(--color-warm)"
        strokeWidth="1"
        strokeOpacity="0.22"
        strokeDasharray="3 6"
      />
      <circle
        cx="100"
        cy="100"
        r="58"
        stroke="var(--color-warm)"
        strokeWidth="1"
        strokeOpacity="0.38"
        strokeDasharray="3 6"
      />
      {[
        { x1: 28, y1: 28, x2: 78, y2: 78 },
        { x1: 172, y1: 28, x2: 122, y2: 78 },
        { x1: 28, y1: 172, x2: 78, y2: 122 },
        { x1: 172, y1: 172, x2: 122, y2: 122 },
      ].map((arrow, i) => (
        <line
          key={i}
          x1={arrow.x1}
          y1={arrow.y1}
          x2={arrow.x2}
          y2={arrow.y2}
          stroke="var(--color-text-secondary)"
          strokeWidth="1.5"
          strokeOpacity="0.45"
          strokeLinecap="round"
          markerEnd={`url(#${markerId})`}
        />
      ))}
      <circle cx="100" cy="100" r="28" fill="var(--color-warm)" opacity="0.28" />
      <circle cx="100" cy="100" r="18" fill="var(--color-warm)" opacity="0.88" />
    </svg>
  );
}
