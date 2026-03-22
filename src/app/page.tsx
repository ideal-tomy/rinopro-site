import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { HeroSection } from "@/components/home/HeroSection";

export const metadata: Metadata = {
  title: "rinopro | 現場業務を、AIで再設計して実装まで伴走する",
  description:
    "建設・士業など現場業務の効率化と、AIによる判定・要約・検索の実装。体験とデモで技術の感触を確認できます。",
};

export default function Home() {
  return (
    <PageShell>
      <HeroSection />
    </PageShell>
  );
}
