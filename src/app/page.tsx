import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { HeroSection } from "@/components/home/HeroSection";
import { fetchDemosForDisplay } from "@/lib/sanity/fetch";

export const metadata: Metadata = {
  title:
    "Axeon | 業務改善のヒントから相談まで。開発・コンサルで現場の効率化を支援",
  description:
    "よくある業務パターンから改善のイメージをつかみ、AIコンシェルジュで課題を整理。体験デモ・概算・お問い合わせまで一気通貫で。建設・士業など幅広い現場向け。",
};

export default async function Home() {
  const demos = await fetchDemosForDisplay();

  return (
    <PageShell>
      <HeroSection demos={demos} />
    </PageShell>
  );
}
