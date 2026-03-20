import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { fetchDemosForDisplay } from "@/lib/sanity/fetch";
import { DemoListContent } from "@/components/demo/DemoListContent";

export const metadata: Metadata = {
  title: "デモ一覧 | rinopro",
  description: "すべてのツールデモを一覧で確認できます。",
};

export default async function DemoListPage() {
  const demos = await fetchDemosForDisplay();

  return (
    <PageShell>
      <div className="container mx-auto max-w-5xl px-4 py-12 md:px-6">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-accent md:text-3xl">
              デモ一覧
            </h1>
            <p className="mt-2 text-text-sub">
              すべてのツールデモを確認できます。気になるものを体験してみてください。
            </p>
          </div>
          <Link
            href="/demo"
            className="text-sm text-text-sub transition-colors hover:text-accent"
          >
            ← 代表デモに戻る
          </Link>
        </div>
        <DemoListContent demos={demos} />
      </div>
    </PageShell>
  );
}
