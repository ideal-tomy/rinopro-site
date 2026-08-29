import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ConsultingDetailPageContent } from "@/components/services/ConsultingDetailPageContent";

export const metadata: Metadata = {
  title: "コンサル | ご支援内容",
  description:
    "課題の言語化、優先順位、実装可能な戦略まで。資料で終わらせず、次の一手が実行できる粒度に落とします。",
};

export default function ServicesConsultingPage() {
  return (
    <PageShell>
      <ConsultingDetailPageContent />
    </PageShell>
  );
}
