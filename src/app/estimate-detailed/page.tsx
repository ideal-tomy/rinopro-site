import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { EstimateDetailedFormContent } from "@/components/estimate/EstimateDetailedFormContent";

export const metadata: Metadata = {
  title: "詳細見積もり（初期検討）",
  description:
    "追加ヒアリングに基づき、仮要件定義と概算レンジをAIが整理します。確定見積もりではありません。",
};

export default function EstimateDetailedPage() {
  return (
    <PageShell>
      <div
        className="ax-page ax-container-reading ax-section-compact"
        data-ax-theme="corporate"
        data-ax-density="compact"
      >
        <Suspense
          fallback={
            <p className="ax-role-supporting">読み込み中…</p>
          }
        >
          <EstimateDetailedFormContent />
        </Suspense>
      </div>
    </PageShell>
  );
}
