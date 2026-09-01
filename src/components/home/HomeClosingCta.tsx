import Link from "next/link";

export function HomeClosingCta() {
  return (
    <section
      id="cta"
      className="border-t border-[var(--color-border-light)] bg-[var(--color-bg-pure)] py-[clamp(56px,12vw,88px)] text-center text-[var(--color-text-primary)] md:py-[clamp(72px,12vw,112px)]"
      aria-labelledby="home-closing-cta-heading"
    >
      <div className="container mx-auto max-w-3xl px-4 md:px-6">
        <h2
          id="home-closing-cta-heading"
          className="mb-6 text-[clamp(28px,6.2vw,44px)] leading-[1.35] font-bold text-[var(--color-text-primary)]"
        >
          簡単なお悩みから課題を明確にします。
        </h2>
        <p className="mx-auto mb-10 max-w-[560px] text-[var(--color-text-secondary)]">
          「なんとなく非効率な気がする」——その段階からで構いません。お話を伺いながら、まずは触れるデモのかたちでご提案します。デモのカスタマイズ相談だけでも歓迎です。
        </p>

        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-[var(--color-accent-primary)] px-8 py-4 text-lg font-bold text-white transition-transform hover:-translate-y-0.5 hover:bg-[var(--color-accent-primary-hover)]"
          >
            お問い合わせ
          </Link>
        </div>

        <p className="mt-8">
          <Link
            href="/estimate-detailed"
            className="text-sm font-bold text-[var(--color-accent-primary)] underline-offset-4 hover:underline"
          >
            概算の感触を先に見る →
          </Link>
        </p>
      </div>
    </section>
  );
}
