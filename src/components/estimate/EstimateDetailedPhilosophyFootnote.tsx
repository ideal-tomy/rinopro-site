"use client";

import {
  ESTIMATE_PHILOSOPHY_MARKDOWN_HEADING,
  ESTIMATE_PHILOSOPHY_UI_PARAGRAPH,
} from "@/lib/estimate/estimate-output-philosophy";

export function EstimateDetailedPhilosophyFootnote() {
  return (
    <aside className="mt-6 rounded-lg border border-silver/20 bg-base-dark/35 p-4 md:p-5">
      <p className="text-xs font-medium text-text-sub">{ESTIMATE_PHILOSOPHY_MARKDOWN_HEADING}</p>
      <p className="mt-2 text-sm leading-relaxed text-text-sub">{ESTIMATE_PHILOSOPHY_UI_PARAGRAPH}</p>
    </aside>
  );
}
