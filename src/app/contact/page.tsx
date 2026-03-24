import type { Metadata } from "next";
import { Suspense } from "react";
import { PageShell } from "@/components/layout/PageShell";
import { ContactPageContent } from "@/components/contact/ContactPageContent";

export const metadata: Metadata = {
  title: "問い合わせ | rinopro",
  description:
    "課題整理の相談窓口。売り込みではなく、現場の課題を一緒に棚卸しする場。初回は要件整理が中心です。",
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
