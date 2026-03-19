import type { Metadata } from "next";
import { PageShell } from "@/components/layout/PageShell";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = {
  title: "問い合わせ | rinopro",
  description: "あなたの現場の10分を、3秒に変える相談を。",
};

export default function ContactPage() {
  return (
    <PageShell>
      <section className="container mx-auto max-w-2xl px-4 py-16 md:px-6">
        <h1 className="mb-4 text-2xl font-bold text-accent md:text-3xl">
          あなたの現場の10分を、3秒に変える相談を。
        </h1>
        <p className="mb-12 text-text-sub">
          お気軽にご相談ください。
        </p>
        <ContactForm />
      </section>
    </PageShell>
  );
}
