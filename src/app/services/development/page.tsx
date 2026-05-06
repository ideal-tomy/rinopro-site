import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { FlowTimelinePageContent } from "@/components/services/FlowTimelinePageContent";
import { LegacyOfferingNotice } from "@/components/services/LegacyOfferingNotice";
import { flowDetailPageCopy } from "@/lib/content/site-copy";

export const metadata: Metadata = {
  title: "開発の進め方 | AXEON",
  description: `${flowDetailPageCopy.purpose} Webサイト制作・アプリ開発・業務ダッシュボードの進め方はタブで切り替えて確認できます。`,
};

export default function ServicesDevelopmentPage() {
  return (
    <PageShell>
      <LegacyOfferingNotice href="/services/ai-apps">
        AI業務アプリ開発の全体像・論点整理は、新しいサービス概要ページにまとめています。
      </LegacyOfferingNotice>
      <FlowTimelinePageContent />
    </PageShell>
  );
}
