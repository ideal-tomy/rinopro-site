import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "サービス | rinopro",
  description: "開発とコンサルティング。プロセス透明性による安心感。",
};

export default function ServicesPage() {
  return (
    <PageShell>
      <section className="container mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h1 className="mb-12 text-2xl font-bold text-accent md:text-3xl">
          サービス
        </h1>
        <div className="mb-12 grid gap-6 sm:grid-cols-2">
          <Link href="/services/development">
            <Card className="p-6 transition-colors hover:border-accent/50">
              <h2 className="mb-2 font-semibold text-text">開発</h2>
              <p className="text-sm text-text-sub">
                開発の流れの説明込み
              </p>
            </Card>
          </Link>
          <Link href="/services/consulting">
            <Card className="p-6 transition-colors hover:border-accent/50">
              <h2 className="mb-2 font-semibold text-text">コンサルティング</h2>
              <p className="text-sm text-text-sub">
                内容の説明と契約までの流れ説明込み
              </p>
            </Card>
          </Link>
        </div>
        <Button asChild>
          <Link href="/contact">相談する</Link>
        </Button>
      </section>
    </PageShell>
  );
}
