import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { ContactPageContent } from "@/components/contact/ContactPageContent";

export const metadata: Metadata = {
  title: "問い合わせ | AXEON",
  description:
    "ご相談内容をフォームからお送りいただける窓口です。2営業日以内に担当者よりご返信します。",
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
