"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  buildOpsReportMock,
  type OpsReportMockResult,
} from "@/lib/experience/ops-report-mock";
import type { ExperiencePrototypeMeta } from "@/lib/experience/prototype-registry";
import { cn } from "@/lib/utils";

interface OpsReportMetricsExperienceProps {
  meta: ExperiencePrototypeMeta;
  className?: string;
}

export function OpsReportMetricsExperience({
  meta,
  className,
}: OpsReportMetricsExperienceProps) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<OpsReportMockResult | null>(null);

  const run = () => {
    setResult(buildOpsReportMock(text));
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="rounded-xl border border-silver/25 bg-base-dark/80 p-4 md:p-6">
        <h2 className="mb-3 text-sm font-semibold text-accent md:text-base">
          数値・メモ（1行1項目でも可）
        </h2>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={meta.inputHint}
          rows={5}
          className="mb-3 resize-y text-sm md:text-base"
        />
        <Button type="button" onClick={run} disabled={!text.trim()}>
          レポート草案を生成（モック）
        </Button>
      </div>

      {result && (
        <div className="space-y-4 rounded-xl border border-accent/25 bg-accent/5 p-4 md:p-6">
          <h3 className="text-lg font-semibold text-accent">{result.headline}</h3>
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
          <p className="text-sm leading-relaxed text-text">{result.narrative}</p>
          <div>
            <p className="mb-2 text-xs font-medium text-text-sub">次アクション案</p>
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
