import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "コンサルティング | rinopro",
  description: "コンサルティング内容と契約までの流れ。",
};

export default function ConsultingPage() {
  return (
    <PageShell>
      <section className="container mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h1 className="mb-4 text-2xl font-bold text-accent md:text-3xl">
          コンサルティング
        </h1>
        <div className="mb-12 space-y-6">
          <div>
            <h2 className="mb-2 font-semibold text-text">内容</h2>
            <p className="text-sm text-text-sub">
              内容の説明
            </p>
          </div>
          <div>
            <h2 className="mb-2 font-semibold text-text">契約までの流れ</h2>
            <p className="text-sm text-text-sub">
              フロー図枠
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/contact">相談する</Link>
        </Button>
      </section>
    </PageShell>
  );
}
