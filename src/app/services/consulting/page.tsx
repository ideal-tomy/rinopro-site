import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ConsultingPage } from "@/components/services/ConsultingPage";

export const metadata: Metadata = {
  title: "コンサルティング | ご支援内容",
  description:
    "何を変えるか。どこから始めるか。経営の方針と現場の状況を確認し、課題を整理します。改善案を比較したうえで、取り組む範囲と進め方を決めます。",
};

export default function ServicesConsultingPage() {
  return (
    <PageShell>
      <ConsultingPage />
    </PageShell>
  );
}
