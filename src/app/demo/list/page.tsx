import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { fetchDemosForDisplay } from "@/lib/sanity/fetch";
import { DemoListContent } from "@/components/demo/DemoListContent";

export const metadata: Metadata = {
  title: "モックdemo一覧（カタログ） | rinopro",
  description:
    "問い合わせ文→返信案や入力試し込みなど、ツールdemoをカタログ形式で一覧できます。",
};

export default async function DemoListPage() {
  const demos = await fetchDemosForDisplay();

  return (
    <PageShell>
      <div className="container mx-auto max-w-5xl px-4 py-12 md:px-6">
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-accent md:text-3xl">
              モックdemo一覧（カタログ）
            </h1>
            <p className="mt-2 max-w-2xl text-text-sub">
              チャット型・入力試し込みのモックdemoを一覧から選べます。気になるものから触って、業務への当てはめをイメージしてください。
            </p>
          </div>
          <Link
            href="/demo"
            className="shrink-0 text-sm text-text-sub transition-colors hover:text-accent"
          >
            ← 体験・demoハブに戻る
          </Link>
        </div>
        <DemoListContent demos={demos} />
      </div>
    </PageShell>
  );
}
