import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/layout/PageShell";
import { ParticleBackground } from "@/components/three/ParticleBackground";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "rinopro | 現場業務を、AIで再設計して実装まで伴走する",
  description: "現場業務を、AIで再設計して実装まで伴走する。",
};

export default function Home() {
  return (
    <PageShell>
      <ParticleBackground />
      <section className="flex flex-1 flex-col items-center justify-center gap-8 px-8 py-16">
        <h1 className="max-w-2xl text-center text-2xl font-bold text-accent md:text-3xl">
          現場業務を、AIで再設計して実装まで伴走する。
        </h1>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild>
            <Link href="/demo">ツールdemoを見る</Link>
          </Button>
          <Button
            variant="outline"
            className="border-silver/40 text-text hover:border-accent/50 hover:bg-accent/10"
            asChild
          >
            <Link href="/cases">事例を見る</Link>
          </Button>
        </div>
      </section>
    </PageShell>
  );
}
