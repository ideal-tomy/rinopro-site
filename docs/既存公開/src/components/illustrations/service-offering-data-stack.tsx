"use client";

import { useId } from "react";

/**
 * データ活用基盤の積層イメージ（抽象）。ハードコード色は使わず CSS 変数のみ。
 */
export function ServiceOfferingDataStackDiagram() {
  const uid = useId().replace(/:/g, "");
  const fillGrad = `svc-data-stack-fill-${uid}`;

  const layers = [
    { y: 56, h: 44, label: "利用レイヤ（ダッシュボード・AI）" },
    { y: 116, h: 44, label: "整備レイヤ（マート・品質）" },
    { y: 176, h: 44, label: "収集レイヤ（パイプライン）" },
    { y: 236, h: 44, label: "ソース層（業務システム・ファイル）" },
  ] as const;

  return (
    <svg
      viewBox="0 0 400 320"
      className="h-auto w-full max-w-[440px]"
      role="img"
      aria-label="データ基盤の積層イメージ：ソース、収集、整備、利用の四層"
    >
      <defs>
        <linearGradient id={fillGrad} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--color-accent-primary)" stopOpacity="0.08" />
          <stop offset="100%" stopColor="var(--color-accent-primary)" stopOpacity="0.22" />
        </linearGradient>
      </defs>
      {layers.map((layer) => (
        <g key={layer.label}>
          <rect
            x="48"
            y={layer.y}
            width="304"
            height={layer.h}
            rx="12"
            fill={`url(#${fillGrad})`}
            stroke="var(--color-accent-primary)"
            strokeOpacity="0.35"
            strokeWidth="1.5"
          />
          <text
            x="200"
            y={layer.y + layer.h / 2}
            dy="0.35em"
            textAnchor="middle"
            fill="var(--color-text-primary)"
            fontSize="13"
            fontWeight="600"
          >
            {layer.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
