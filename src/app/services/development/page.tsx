import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "開発の流れ | rinopro",
  description: "開発の流れとプロセス。",
};

export default function DevelopmentPage() {
  return (
    <PageShell>
      <section className="container mx-auto max-w-7xl px-4 py-16 md:px-6">
        <h1 className="mb-4 text-2xl font-bold text-accent md:text-3xl">
          開発の流れ
        </h1>
        <div className="mb-12 flex flex-col gap-8">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex gap-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/20 text-accent font-semibold">
                {step}
              </span>
              <div>
                <h2 className="font-semibold text-text">ステップ {step}</h2>
                <p className="text-sm text-text-sub">
                  ステップUI枠
                </p>
              </div>
            </div>
          ))}
        </div>
        <Button asChild>
          <Link href="/contact">相談する</Link>
        </Button>
      </section>
    </PageShell>
  );
}
