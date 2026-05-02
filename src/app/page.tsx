import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { HeroSection } from "@/components/home/HeroSection";

export const metadata: Metadata = {
  title:
    "経営課題の言語化から動くシステムまで。コンサル・開発の一気通貫 | AXEON",
  description:
    "中小企業向けに、コンサルタントによる課題構造化と AI 駆動開発による高速実装をワンチームで。DX で何から始めるべきか迷う経営者の無料相談から、PoC・本実装まで伴走します。",
};

export default function Home() {
  return (
    <PageShell>
      <HeroSection />
    </PageShell>
  );
}
