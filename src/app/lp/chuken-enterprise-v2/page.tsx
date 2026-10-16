import type { Metadata } from "next";
import { ChukenEnterpriseV2Page } from "@/components/lp/ChukenEnterpriseV2Page";

export const metadata: Metadata = {
  title: "AXEON｜PoCで終わらないAI導入を、戦略から実装まで一気に。",
  description:
    "中堅企業のDX推進担当者・経営層向け。PoCで終わらないAI導入を、戦略から実装まで一気通貫で伴走するAXEONのご案内です。",
  robots: { index: false, follow: true },
  openGraph: {
    type: "website",
    locale: "ja_JP",
    title: "AXEON｜PoCで終わらないAI導入を、戦略から実装まで一気に。",
    description:
      "経営の意図を、現場で動くシステムに変える。中堅企業向けの戦略×実装伴走チーム。",
    url: "https://www.axeon.jp/lp/chuken-enterprise-v2",
  },
};

export default function ChukenEnterpriseV2Route() {
  return <ChukenEnterpriseV2Page />;
}
