"use client";

import { useId } from "react";

/**
 * 伴走型改善運用セクション用の簡易サイクル図（装飾控えめ）。
 */
export function ServiceOfferingImprovementCycleDiagram() {
  const uid = useId().replace(/:/g, "");
  const strokeGrad = `svc-imp-cycle-stroke-${uid}`;

  const nodes = [
    { x: 160, y: 52, label: "計測" },
    { x: 268, y: 160, label: "レビュー" },
    { x: 160, y: 268, label: "実装" },
    { x: 52, y: 160, label: "振り返り" },
  ] as const;

  return (
    <svg
      viewBox="0 0 320 320"
      className="h-auto w-full max-w-[300px]"
      role="img"
      aria-label="改善サイクル：計測、レビュー、実装、振り返りの循環イメージ"
    >
      <defs>
        <linearGradient id={strokeGrad} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.22" />
          <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity="0.45" />
        </linearGradient>
      </defs>
      <circle
        cx="160"
        cy="160"
        r="108"
        fill="none"
        stroke={`url(#${strokeGrad})`}
        strokeWidth="2"
      />
      {nodes.map((n) => (
        <g key={n.label}>
          <circle
            cx={n.x}
            cy={n.y}
            r="36"
            fill="var(--color-bg-pure)"
            stroke="var(--color-accent-primary)"
            strokeWidth="1.75"
          />
          <text
            x={n.x}
            y={n.y}
            dy="0.35em"
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="14"
            fontWeight="600"
          >
            {n.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
