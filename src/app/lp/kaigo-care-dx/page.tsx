import type { Metadata } from "next";
import { KaigoCareDxPage } from "@/components/lp/KaigoCareDxPage";

export const metadata: Metadata = {
  title: "ケア記録DX 提案",
  description:
    "現場は入力するだけ。報告書まで自動で作成。グループホーム・訪問看護向けのケア記録 DX 提案。",
};

export default function KaigoCareDxRoute() {
  return <KaigoCareDxPage />;
}
