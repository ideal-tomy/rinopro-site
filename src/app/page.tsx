import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { HeroSection } from "@/components/home/HeroSection";
import { fetchDemosForDisplay } from "@/lib/sanity/fetch";

export const metadata: Metadata = {
  title: "Axeon | 現場の悩みを、会話で次の一手に。実装から定着まで伴走する",
  description:
    "面倒な定型作業の整理を、AIコンシェルジュが短時間で手伝います。体験デモで感触を、サービスで全体像を確認できます。建設・士業など幅広い現場向け。",
};

export default async function Home() {
  const demos = await fetchDemosForDisplay();

  return (
    <PageShell>
      <HeroSection demos={demos} />
    </PageShell>
  );
}
