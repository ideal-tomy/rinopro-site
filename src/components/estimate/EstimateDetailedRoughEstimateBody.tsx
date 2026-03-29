"use client";

import { summarizeConciergeEstimateContextForDisplay } from "@/lib/chat/estimate-handoff";
import type { ConciergeEstimateContextPayload } from "@/lib/chat/estimate-handoff";
import { estimateDetailedCopy } from "@/lib/content/site-copy";

const copy = estimateDetailedCopy;

type Props = {
  ctx: ConciergeEstimateContextPayload;
  className?: string;
};

/** アコーディオン・FAB パネル共通の概算引き継ぎ本文 */
export function EstimateDetailedRoughEstimateBody({ ctx, className }: Props) {
  const s = summarizeConciergeEstimateContextForDisplay(ctx);

  return (
    <div className={className}>
      <p className="text-sm leading-relaxed text-text-sub">{copy.roughEstimateSubtitle}</p>
      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="font-medium text-text">{copy.roughTrackLabel}</dt>
          <dd className="mt-1 text-text-sub">{s.trackLabel}</dd>
        </div>
        <div>
          <dt className="font-medium text-text">{copy.roughStepsHeading}</dt>
          <dd className="mt-2 space-y-2">
            {s.steps.map((row) => (
              <div
                key={`${row.title}-${row.answerLine}`}
                className="rounded-lg border border-silver/20 bg-base-dark/40 px-3 py-2"
              >
                <p className="text-xs text-text-sub">{row.title}</p>
                <p className="mt-0.5 text-text">{row.answerLine}</p>
              </div>
            ))}
          </dd>
        </div>
        {s.freeNotes ? (
          <div>
            <dt className="font-medium text-text">{copy.roughNotesHeading}</dt>
            <dd className="mt-1 whitespace-pre-wrap text-text-sub">{s.freeNotes}</dd>
          </div>
        ) : null}
      </dl>
    </div>
  );
}
