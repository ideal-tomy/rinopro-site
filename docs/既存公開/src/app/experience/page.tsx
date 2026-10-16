import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ExperienceGalleryPageContent } from "@/components/experience/ExperienceGalleryPageContent";

export const metadata: Metadata = {
  title: "体験・プロダクトdemo | AXEON",
  description:
    "業界別の実装プロダクトと、サイト内で動く対話型デモを一覧できます。操作感を実際にご確認ください。",
};

export default function ExperienceIndexPage() {
  return (
    <PageShell>
      <ExperienceGalleryPageContent />
    </PageShell>
  );
}
