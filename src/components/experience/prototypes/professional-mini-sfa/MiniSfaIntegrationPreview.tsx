"use client";

import type { MiniSfaIntegrationPreviewItem } from "@/lib/experience/professional-mini-sfa/demo-copy";

interface MiniSfaIntegrationPreviewProps {
  items: MiniSfaIntegrationPreviewItem[];
}

export function MiniSfaIntegrationPreview({
  items,
}: MiniSfaIntegrationPreviewProps) {
  return (
    <section
      className="space-y-3 rounded-xl border border-silver/30 bg-silver/5 p-3 md:space-y-4 md:p-5"
      aria-labelledby="mini-sfa-integration-preview-heading"
    >
      <div>
        <h2
          id="mini-sfa-integration-preview-heading"
          className="text-sm font-semibold text-white md:text-lg"
        >
          将来連携のイメージ
        </h2>
        <p className="mt-1 text-xs text-text-sub md:text-sm">
          以下は今回の実装範囲ではなく、将来拡張の見せ方として表示しています。
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.id}
            className="rounded-lg border border-silver/20 bg-base-dark/55 p-3"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-sm font-medium text-white md:text-[16px]">
                {item.label}
              </h3>
              <span className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-[10px] font-medium text-accent md:text-[11px]">
                {item.statusLabel}
              </span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-text-sub md:text-sm">
              {item.description}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
