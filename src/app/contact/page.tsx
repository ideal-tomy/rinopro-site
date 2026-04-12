import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { ContactPageContent } from "@/components/contact/ContactPageContent";

export const metadata: Metadata = {
  title: "問い合わせ | rinopro",
  description:
    "整理した課題と要件のたたき台を送る相談窓口。初回返信で具体的に返せるよう、必要な情報をそろえて送るためのページです。",
};

export default function ContactPage() {
  return (
    <PageShell>
      <Suspense fallback={null}>
        <ContactPageContent />
      </Suspense>
    </PageShell>
  );
}
