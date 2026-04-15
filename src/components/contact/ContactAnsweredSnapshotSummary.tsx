"use client";

import { getOrderedAnswerPairs } from "@/lib/estimate/estimate-detailed-answer-order";
import type { EstimateSnapshot } from "@/lib/estimate/estimate-snapshot";

type Props = {
  snapshot: EstimateSnapshot;
  title: string;
  hint?: string;
};

export function ContactAnsweredSnapshotSummary({
  snapshot,
  title,
  hint,
}: Props) {
  const pairs = getOrderedAnswerPairs(snapshot.answers);
  if (pairs.length === 0) return null;

  return (
    <div className="space-y-3 rounded-xl border border-silver/20 bg-base-dark/30 p-4">
      <p className="text-sm font-medium text-text">{title}</p>
      {hint ? (
        <p className="text-sm leading-relaxed text-text-sub">{hint}</p>
      ) : null}
      <dl className="space-y-2 text-sm text-text">
        {pairs.map(({ question, answer }) => (
          <div key={question}>
            <dt className="text-xs uppercase tracking-wide text-text-sub">
              {question}
            </dt>
            <dd className="mt-0.5 whitespace-pre-wrap text-text">{answer}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
