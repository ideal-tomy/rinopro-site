import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { HeroSection } from "@/components/home/HeroSection";

export const metadata: Metadata = {
  title:
    "経営課題の言語化から動くシステムまで。コンサル・開発の一気通貫 | AXEON",
  description:
    "中堅企業のDX推進担当者・経営層へ。経営課題の整理とロードマップ設計に強いコンサルティング経験者 × AI開発のトップエンジニアが、構想・優先順位の設計から高速実装・内製化支援まで一気通貫で伴走します。初回コンサルティングのご相談はこちら。",
};

export default function Home() {
  return (
    <PageShell>
      <HeroSection />
    </PageShell>
  );
}
