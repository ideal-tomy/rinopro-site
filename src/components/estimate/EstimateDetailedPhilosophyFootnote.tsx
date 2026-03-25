"use client";

import {
  ESTIMATE_PHILOSOPHY_MARKDOWN_HEADING,
  ESTIMATE_PHILOSOPHY_UI_PARAGRAPH,
} from "@/lib/estimate/estimate-output-philosophy";

export function EstimateDetailedPhilosophyFootnote() {
  return (
    <aside className="mt-6 rounded-xl border border-accent/25 bg-accent/[0.06] p-5 md:p-6">
      <p className="text-[16px] font-semibold leading-snug text-white md:text-lg">
        {ESTIMATE_PHILOSOPHY_MARKDOWN_HEADING}
      </p>
      <p className="mt-3 text-[15px] leading-relaxed text-white/90 md:text-[16px] md:leading-relaxed">
        {ESTIMATE_PHILOSOPHY_UI_PARAGRAPH}
      </p>
    </aside>
  );
}
