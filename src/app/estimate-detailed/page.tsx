import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { EstimateDetailedFormContent } from "@/components/estimate/EstimateDetailedFormContent";

export const metadata: Metadata = {
  title: "詳細見積もり（初期検討） | rinopro",
  description:
    "追加ヒアリングに基づき、仮要件定義と概算レンジをAIが整理します。確定見積もりではありません。",
};

export default function EstimateDetailedPage() {
  return (
    <PageShell>
      <div className="container mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
        <Suspense
          fallback={
            <p className="text-sm text-text-sub">読み込み中…</p>
          }
        >
          <EstimateDetailedFormContent />
        </Suspense>
      </div>
    </PageShell>
  );
}
