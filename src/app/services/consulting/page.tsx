import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ConsultingPage } from "@/components/services/ConsultingPage";

export const metadata: Metadata = {
  title: "コンサルティング | ご支援内容",
  description:
    "業務やシステムの見直しを、計画づくりから支援します。経営の方針と現場の状況を確認し、取り組む範囲と進め方をまとめます。",
};

export default function ServicesConsultingPage() {
  return (
    <PageShell>
      <ConsultingPage />
    </PageShell>
  );
}
