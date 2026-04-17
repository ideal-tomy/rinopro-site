import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { ContactPageContent } from "@/components/contact/ContactPageContent";

export const metadata: Metadata = {
  title: "問い合わせ | Axeon",
  description:
    "整理した課題と要件のたたき台を送るお問い合わせ窓口です。初回返信で具体的にお返しできるよう、送信前に要点をそろえます。",
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
