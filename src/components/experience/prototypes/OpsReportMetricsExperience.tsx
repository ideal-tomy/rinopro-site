"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  buildOpsReportMock,
  type OpsReportMockResult,
} from "@/lib/experience/ops-report-mock";
import type { ExperiencePrototypeMeta } from "@/lib/experience/prototype-registry";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface OpsReportMetricsExperienceProps {
  meta: ExperiencePrototypeMeta;
  className?: string;
}

function extractNumbers(raw: string): number[] {
  const out: number[] = [];
  for (const m of raw.matchAll(/-?\d+(?:\.\d+)?/g)) {
    const v = Number(m[0]);
    if (!Number.isNaN(v)) out.push(v);
  }
  return out;
}

function MagicGraph({
  points,
  label,
  reduceMotion,
}: {
  points: number[];
  label: string;
  reduceMotion: boolean;
}) {
  const width = 240;
  const height = 80;
  const padding = 8;
  const xs = points.map((_, i) => padding + (i * (width - padding * 2)) / Math.max(1, points.length - 1));
  const ys = points.map((v) => {
    const t = Math.max(0, Math.min(1, v));
    return padding + (1 - t) * (height - padding * 2);
  });
  const polyline = xs
    .map((x, i) => `${x.toFixed(1)},${ys[i].toFixed(1)}`)
    .join(" ");

  return (
    <div className="rounded-xl border border-silver/20 bg-base-dark p-4">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-sm font-semibold text-text md:text-[1rem]">{label}</p>
        <span className="rounded-full border border-silver/30 bg-silver/10 px-2.5 py-1 text-xs font-medium text-text-sub">
          {reduceMotion ? "静的表示" : "ループ解析"}
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height="80"
        role="img"
        aria-label={label}
      >
        <defs>
          <linearGradient id="ops-magic" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="rgba(0,242,255,0.55)" />
            <stop offset="50%" stopColor="rgba(0,242,255,0.85)" />
            <stop offset="100%" stopColor="rgba(0,242,255,0.45)" />
          </linearGradient>
        </defs>
        {/* grid */}
        {[0.2, 0.4, 0.6, 0.8].map((t) => {
          const y = padding + (1 - t) * (height - padding * 2);
          return (
            <line
              key={t}
              x1={padding}
              x2={width - padding}
              y1={y}
              y2={y}
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
          );
        })}
        <polyline
          points={polyline}
          fill="none"
          stroke="url(#ops-magic)"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {ys.map((y, i) => (
          <circle
            key={i}
            cx={xs[i]}
            cy={y}
            r="3.2"
            fill="rgba(0,242,255,0.75)"
          />
        ))}
      </svg>
    </div>
  );
}

export function OpsReportMetricsExperience({
  meta,
  className,
}: OpsReportMetricsExperienceProps) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<OpsReportMockResult | null>(null);
  const [runText, setRunText] = useState("");
  const [magic, setMagic] = useState(55);
  const reduceMotion = useReducedMotion();

  const run = () => {
    setRunText(text);
    setResult(buildOpsReportMock(text));
  };

  const derived = useMemo(() => {
    if (!result) return null;
    const nums = extractNumbers(runText);
    const base = nums.length > 0 ? nums : [120, 80, 150, 95, 110];

    const t = magic / 100; // 0..1
    const boosted = base.slice(0, 6).map((n, i) => {
      const w = 0.75 + t * 0.8;
      const jitter = ((i + 1) * 17 + base.length * 13) % 19;
      return n * w + jitter;
    });

    const min = Math.min(...boosted);
    const max = Math.max(...boosted);
    const points = boosted.map((v) => (max - min === 0 ? 0.5 : (v - min) / (max - min)));

    const deltaTone =
      magic >= 72
        ? "伸びが加速"
        : magic <= 28
          ? "停滞から立て直し"
          : "微調整で改善";

    const topic =
      magic >= 72
        ? "今週のトピックス: 売上の立ち上がりに連動して、稼働の詰まりを解消すると効果が出やすい。"
        : magic <= 28
          ? "今週のトピックス: コストのブレ幅が拡大。一次原因（人件費・外注・在庫）から潰す週に。"
          : "今週のトピックス: KPIは横ばい。ただし改善余地は「段取り」と「品質アラート」に偏っている。";

    const wow =
      magic >= 72
        ? "+3.4%（先週比・モック）"
        : magic <= 28
          ? "-1.1%（先週比・モック）"
          : "+0.2%（先週比・モック）";

    return { points, topic, deltaTone, wow };
  }, [magic, result, runText]);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="rounded-xl border border-silver/25 bg-base-dark/80 p-4 md:p-6">
        <h2 className="mb-3 text-sm font-semibold text-accent md:text-[1rem]">
          数値・メモ（1行1項目でも可）
        </h2>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={meta.inputHint}
          rows={5}
          className="mb-3 resize-y text-sm md:text-[1rem]"
        />
        <Button type="button" onClick={run} disabled={!text.trim()}>
          レポート草案を生成
        </Button>
      </div>

      {result && (
        <div className="space-y-4 rounded-xl border border-accent/25 bg-accent/5 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-accent">
            {result.headline}
          </h3>
          <div className="grid gap-3 sm:grid-cols-2">
            {result.kpis.map((k) => (
              <div
                key={k.label + k.value}
                className="rounded-lg border border-silver/20 bg-base-dark/50 p-3"
              >
                <p className="text-xs text-text-sub">{k.label}</p>
                <p className="text-lg font-semibold text-text">{k.value}</p>
                <p className="text-xs text-accent">{k.delta}</p>
              </div>
            ))}
          </div>

          {/* magic slider */}
          <div className="rounded-xl border border-silver/20 bg-base-dark/60 p-4">
            <div className="mb-3 flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-text md:text-[1rem]">
                  マジック・スライダー（分析の濃さ）
                </p>
                <p className="mt-1 text-xs text-text-sub">
                  {derived ? derived.deltaTone : "準備中"} / {derived?.wow ?? "—"}
                </p>
              </div>
              <span className="rounded-full border border-silver/30 bg-silver/10 px-2.5 py-1 text-xs font-medium text-text-sub">
                {magic}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={magic}
              onChange={(e) => setMagic(Number(e.target.value))}
              aria-label="マジックスライダー"
              className="w-full"
            />
          </div>

          <p className="text-sm leading-relaxed text-text">{result.narrative}</p>

          {derived && (
            <>
              <div className="rounded-xl border border-silver/20 bg-base-dark/60 p-4">
                <p className="mb-2 text-xs font-medium text-text-sub">
                  今週のトピックス（モック分析）
                </p>
                <p className="text-sm leading-relaxed text-text-sub md:text-[1rem]">
                  {derived.topic}
                </p>
              </div>

              <MagicGraph
                points={derived.points}
                label="簡易トレンド（SVGモック）"
                reduceMotion={reduceMotion}
              />
            </>
          )}

          <div>
            <p className="mb-2 text-xs font-medium text-text-sub">
              次アクション案
            </p>
            <ul className="list-inside list-disc space-y-1 text-sm text-text">
              {result.nextActions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
