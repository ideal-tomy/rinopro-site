import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { CaseStudyBeforeAfter } from "@/components/case-studies/case-study-before-after";
import { CaseStudyFlowSteps } from "@/components/case-studies/case-study-flow-steps";
import { CaseStudyMetrics } from "@/components/case-studies/case-study-metrics";
import {
  CaseStudyStickyNav,
  type CaseStudyNavItem,
} from "@/components/case-studies/case-study-sticky-nav";
import {
  CaseStudyArrowRight,
  CaseStudyCheck,
  CaseStudyExternal,
  CaseStudyPlay,
} from "@/components/case-studies/case-study-icons";
import { IllustrationReveal } from "@/components/illustrations/illustration-reveal";
import { getImplementationShowcaseBySlug } from "@/lib/content/implementation-showcase";
import type { CaseStudyDetail } from "@/lib/content/case-study-detail";

type CaseStudyDetailViewProps = {
  detail: CaseStudyDetail;
  demoHref: string;
  demoOpenInNewTab: boolean;
};

const SECTION_NAV: readonly CaseStudyNavItem[] = [
  { id: "overview", label: "概要" },
  { id: "shift", label: "転換" },
  { id: "metrics", label: "変化の目安" },
  { id: "flow", label: "利用の流れ" },
  { id: "pains", label: "課題" },
  { id: "features", label: "機能" },
  { id: "screens", label: "画面" },
  { id: "spec", label: "技術" },
  { id: "try-demo", label: "デモ" },
];

function isHttpUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

function OverviewMedia({ media }: { media: CaseStudyDetail["overviewMedia"] }) {
  if (media.kind === "video") {
    return (
      <video
        src={media.src}
        aria-label={media.ariaLabel}
        className="h-auto w-full rounded-2xl border border-[var(--color-border-light)] bg-black object-cover shadow-[0_30px_60px_-30px_rgba(38,65,142,0.5)]"
        autoPlay
        muted
        loop
        playsInline
        controls
        preload="metadata"
      />
    );
  }
  return (
    <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-neutral)] shadow-[0_30px_60px_-30px_rgba(38,65,142,0.5)]">
      <Image
        src={media.src}
        alt={media.alt}
        fill
        className="object-cover object-top"
        sizes="(max-width: 768px) 100vw, min(900px, 55vw)"
        priority
      />
    </div>
  );
}

function DemoLaunchLink({
  href,
  className,
  children,
  openInNewTab = false,
}: {
  href: string;
  className?: string;
  children: ReactNode;
  openInNewTab?: boolean;
}) {
  if (isHttpUrl(href) || openInNewTab) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

function MetaChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-3.5 py-1.5 text-[13px] font-medium text-[var(--color-text-secondary)] md:text-[14px]">
      {children}
    </span>
  );
}

function SectionHeading({
  id,
  number,
  kicker,
  title,
  lead,
}: {
  id: string;
  number: string;
  kicker: string;
  title: string;
  lead?: string;
}) {
  return (
    <header className="mb-8 md:mb-10">
      <div className="flex items-center gap-3">
        <span
          className="flex size-9 shrink-0 items-center justify-center rounded-lg font-mono text-[14px] font-bold tabular-nums"
          style={{
            color: "var(--color-warm-strong)",
            backgroundColor: "color-mix(in srgb, var(--color-warm) 20%, transparent)",
          }}
          aria-hidden
        >
          {number}
        </span>
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] md:text-[12px]">
          {kicker}
        </p>
      </div>
      <h2
        id={id}
        className="mt-4 scroll-mt-28 text-balance text-[clamp(1.45rem,3vw,2rem)] font-bold leading-snug tracking-tight text-[var(--color-text-primary)]"
      >
        {title}
      </h2>
      {lead ? (
        <p className="mt-4 max-w-[52ch] text-[15px] leading-[1.85] text-[var(--color-text-secondary)] md:text-[16px]">
          {lead}
        </p>
      ) : null}
    </header>
  );
}

export function CaseStudyDetailView({
  detail,
  demoHref,
  demoOpenInNewTab,
}: CaseStudyDetailViewProps) {
  const showcase = getImplementationShowcaseBySlug(detail.slug);
  const isLive =
    detail.demoFormat === "live" || (detail.demoFormat == null && showcase?.liveDemo);
  const demoFormatLabel = isLive ? "LIVE（サイト内）" : "外部デモ";
  const solutionsHref = `/solutions/${detail.relatedSolutionsSlug}`;

  const hasMetrics = !!(detail.metrics && detail.metrics.length > 0);
  const sectionOrder = [
    "overview",
    "shift",
    ...(hasMetrics ? ["metrics"] : []),
    "flow",
    "pains",
    "features",
    "screens",
    "spec",
    "try-demo",
    "next",
  ];
  const numberOf = (key: string) =>
    String(sectionOrder.indexOf(key) + 1).padStart(2, "0");

  const navItems = SECTION_NAV.filter((item) => item.id !== "metrics" || hasMetrics);

  const sectionClass =
    "scroll-mt-28 border-b border-[var(--color-border-light)] py-14 md:py-20";

  return (
    <div className="bg-[var(--color-bg-base)] text-[var(--color-text-primary)]">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[var(--color-border-light)] bg-[var(--color-bg-pure)]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
        >
          <div
            className="absolute -right-24 -top-24 size-[32rem] rounded-full opacity-70"
            style={{
              background:
                "radial-gradient(circle, color-mix(in srgb, var(--color-accent-primary-light) 80%, transparent), transparent 70%)",
            }}
          />
        </div>

        <div className="container relative mx-auto max-w-7xl px-4 md:px-6">
          <nav className="pt-8 text-[13px] text-[var(--color-text-tertiary)] md:pt-10">
            <Link
              href="/experience"
              className="underline-offset-2 hover:text-[var(--color-accent-primary)] hover:underline"
            >
              体験ギャラリー
            </Link>
            <span className="mx-2 text-[var(--color-border-light)]">/</span>
            <span className="text-[var(--color-text-secondary)]">{detail.heroEyebrow}</span>
          </nav>

          <div className="grid gap-12 pb-14 pt-8 md:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] md:items-center md:gap-12 md:pb-20 md:pt-10 lg:gap-16">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-warm-strong)] md:text-[12px]">
                {detail.heroEyebrow}
              </p>
              <h1 className="mt-4 max-w-[16ch] text-balance text-[clamp(2.1rem,5vw,3.4rem)] font-bold leading-[1.1] tracking-tight">
                {detail.heroTitle}
              </h1>
              <p className="mt-6 max-w-[40ch] text-[17px] leading-[1.8] text-[var(--color-text-secondary)] md:text-[18px]">
                {detail.heroSubtitle}
              </p>

              <ul className="mt-8 flex flex-wrap gap-2">
                <li>
                  <MetaChip>
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-text-tertiary)]">
                      業種
                    </span>
                    {detail.industryTag}
                  </MetaChip>
                </li>
                <li>
                  <MetaChip>
                    {isLive ? (
                      <span
                        className="size-2 rounded-full bg-[var(--color-accent-primary)]"
                        aria-hidden
                      />
                    ) : null}
                    <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-[var(--color-text-tertiary)]">
                      デモ
                    </span>
                    {demoFormatLabel}
                  </MetaChip>
                </li>
              </ul>

              {detail.whoFor ? (
                <p className="mt-4 max-w-[44ch] text-[14px] leading-[1.7] text-[var(--color-text-tertiary)] md:text-[15px]">
                  <span className="font-semibold text-[var(--color-text-secondary)]">
                    想定ユーザー：
                  </span>
                  {detail.whoFor}
                </p>
              ) : null}

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <DemoLaunchLink
                  href={demoHref}
                  openInNewTab={demoOpenInNewTab}
                  className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-xl bg-[var(--color-accent-primary)] px-8 text-[15px] font-semibold text-[var(--color-bg-pure)] shadow-[0_14px_30px_-14px_rgba(38,65,142,0.7)] transition-colors hover:bg-[var(--color-accent-primary-hover)] md:text-[16px]"
                >
                  デモを体験する
                  <CaseStudyExternal className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
                </DemoLaunchLink>
                <Link
                  href="/contact"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-8 text-[15px] font-semibold text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] md:text-[16px]"
                >
                  同様の支援を相談
                </Link>
              </div>
              <p className="mt-4 flex items-center gap-1.5 text-[13px] text-[var(--color-text-tertiary)]">
                <CaseStudyPlay className="size-3.5 text-[var(--color-warm-strong)]" aria-hidden />
                操作は数分で確認できます。画面はサンプルです。
              </p>
            </div>

            <IllustrationReveal>
              <OverviewMedia media={detail.overviewMedia} />
            </IllustrationReveal>
          </div>
        </div>
      </section>

      {/* Metrics strip（あれば全幅で先出し） */}
      {hasMetrics ? (
        <section
          id="metrics"
          className="scroll-mt-28 border-b border-[var(--color-border-light)] bg-[var(--color-bg-neutral)]"
          aria-labelledby="case-study-metrics-heading"
        >
          <div className="container mx-auto max-w-7xl px-4 py-14 md:px-6 md:py-20">
            <div className="mb-8 flex items-center gap-3 md:mb-10">
              <span
                className="flex size-9 shrink-0 items-center justify-center rounded-lg font-mono text-[14px] font-bold tabular-nums"
                style={{
                  color: "var(--color-warm-strong)",
                  backgroundColor:
                    "color-mix(in srgb, var(--color-warm) 20%, transparent)",
                }}
                aria-hidden
              >
                {numberOf("metrics")}
              </span>
              <div>
                <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-[var(--color-text-tertiary)] md:text-[12px]">
                  metrics
                </p>
                <h2
                  id="case-study-metrics-heading"
                  className="mt-1 text-[clamp(1.45rem,3vw,2rem)] font-bold leading-snug tracking-tight text-[var(--color-text-primary)]"
                >
                  導入で見込める変化
                </h2>
              </div>
            </div>
            <CaseStudyMetrics metrics={detail.metrics!} />
          </div>
        </section>
      ) : null}

      {/* 2カラム: sticky index + content */}
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="grid gap-0 md:grid-cols-[12rem_minmax(0,1fr)] lg:grid-cols-[14rem_minmax(0,1fr)]">
          <aside className="hidden md:block">
            <CaseStudyStickyNav items={navItems} />
          </aside>

          <div className="min-w-0 md:border-l md:border-[var(--color-border-light)] md:pl-10 lg:pl-16">
            {/* Overview */}
            <section
              id="overview"
              className={sectionClass}
              aria-labelledby="case-study-overview-heading"
            >
              <SectionHeading
                id="case-study-overview-heading"
                number={numberOf("overview")}
                kicker="overview"
                title="プロダクト概要"
              />
              <div className="max-w-[54ch] space-y-5 text-[16px] leading-[1.95] text-[var(--color-text-secondary)] md:text-[17px]">
                {detail.overviewParagraphs.map((p, i) => (
                  <p key={`overview-${i}`}>{p}</p>
                ))}
              </div>
            </section>

            {/* Shift */}
            <section
              id="shift"
              className={sectionClass}
              aria-labelledby="case-study-shift-heading"
            >
              <SectionHeading
                id="case-study-shift-heading"
                number={numberOf("shift")}
                kicker="shift"
                title="課題から、どう変わるか"
              />
              <CaseStudyBeforeAfter
                beforeTitle={detail.beforeAfter.beforeTitle}
                beforeBody={detail.beforeAfter.beforeBody}
                afterTitle={detail.beforeAfter.afterTitle}
                afterBody={detail.beforeAfter.afterBody}
              />
            </section>

            {/* Flow */}
            <section
              id="flow"
              className={sectionClass}
              aria-labelledby="case-study-flow-heading"
            >
              <SectionHeading
                id="case-study-flow-heading"
                number={numberOf("flow")}
                kicker="flow"
                title="利用の流れ"
                lead="現場やバックオフィスでの典型的な一周です。ステップ数や名称は御社の業務に合わせて調整できます。"
              />
              <CaseStudyFlowSteps steps={detail.flowSteps} />
            </section>

            {/* Pains */}
            <section
              id="pains"
              className={sectionClass}
              aria-labelledby="case-study-pains-heading"
            >
              <SectionHeading
                id="case-study-pains-heading"
                number={numberOf("pains")}
                kicker="pains"
                title="解決する典型的な課題"
              />
              <ul className="grid gap-3 sm:grid-cols-2">
                {detail.painPoints.map((pain, index) => (
                  <li
                    key={pain.title}
                    className="rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-5 md:p-6"
                  >
                    <span className="font-mono text-[12px] font-bold tabular-nums text-[var(--color-warm-strong)]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-2 text-[16px] font-semibold text-[var(--color-text-primary)] md:text-[17px]">
                      {pain.title}
                    </h3>
                    <p className="mt-2 text-[14px] leading-[1.8] text-[var(--color-text-secondary)] md:text-[15px]">
                      {pain.body}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Features */}
            <section
              id="features"
              className={sectionClass}
              aria-labelledby="case-study-features-heading"
            >
              <SectionHeading
                id="case-study-features-heading"
                number={numberOf("features")}
                kicker="features"
                title="主な機能"
              />
              <ul className="grid gap-4 sm:grid-cols-2">
                {detail.features.map((f, index) => (
                  <li
                    key={f.title}
                    className="group rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] p-6 transition-shadow duration-300 hover:shadow-[0_18px_40px_-24px_rgba(38,65,142,0.45)] md:p-7"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex size-10 items-center justify-center rounded-xl bg-[var(--color-accent-primary-light)]/60 font-mono text-[15px] font-bold tabular-nums text-[var(--color-accent-primary)]">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-[17px] font-semibold leading-snug text-[var(--color-text-primary)] md:text-[18px]">
                        {f.title}
                      </h3>
                    </div>
                    <p className="mt-4 text-[14px] leading-[1.85] text-[var(--color-text-secondary)] md:text-[15px]">
                      {f.description}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Gallery */}
            <section
              id="screens"
              className={sectionClass}
              aria-labelledby="case-study-screens-heading"
            >
              <SectionHeading
                id="case-study-screens-heading"
                number={numberOf("screens")}
                kicker="screens"
                title="画面イメージ"
              />
              {detail.galleryNote ? (
                <p className="mb-8 max-w-[54ch] text-[14px] leading-[1.85] text-[var(--color-text-tertiary)] md:text-[15px]">
                  {detail.galleryNote}
                </p>
              ) : null}
              <div className="grid gap-5 md:gap-6">
                {detail.gallery[0] ? (
                  <figure className="group overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)]">
                    <div className="relative aspect-[16/9] w-full overflow-hidden bg-[var(--color-bg-neutral)]">
                      <Image
                        src={detail.gallery[0].src}
                        alt={detail.gallery[0].alt}
                        fill
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 900px"
                      />
                    </div>
                    <figcaption className="border-t border-[var(--color-border-light)] px-5 py-4 text-[14px] leading-[1.75] text-[var(--color-text-secondary)] md:px-6 md:text-[15px]">
                      {detail.gallery[0].caption}
                    </figcaption>
                  </figure>
                ) : null}
                {detail.gallery.length > 1 ? (
                  <div className="grid gap-5 md:grid-cols-2 md:gap-6">
                    {detail.gallery.slice(1).map((g) => (
                      <figure
                        key={g.src}
                        className="group overflow-hidden rounded-2xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)]"
                      >
                        <div className="relative aspect-video w-full overflow-hidden bg-[var(--color-bg-neutral)]">
                          <Image
                            src={g.src}
                            alt={g.alt}
                            fill
                            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                            sizes="(max-width: 768px) 100vw, 45vw"
                          />
                        </div>
                        <figcaption className="border-t border-[var(--color-border-light)] px-4 py-3 text-[14px] leading-[1.75] text-[var(--color-text-secondary)] md:px-5 md:py-4">
                          {g.caption}
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                ) : null}
              </div>
            </section>

            {/* Tech spec */}
            <section
              id="spec"
              className={sectionClass}
              aria-labelledby="case-study-spec-heading"
            >
              <SectionHeading
                id="case-study-spec-heading"
                number={numberOf("spec")}
                kicker="spec"
                title="技術・実装の考え方"
              />
              <ul className="space-y-3">
                {detail.techHighlights.map((line, index) => (
                  <li
                    key={line}
                    className="flex gap-4 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-5 py-4 md:px-6 md:py-5"
                  >
                    <span
                      className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-md text-[var(--color-accent-primary)]"
                      style={{
                        backgroundColor:
                          "color-mix(in srgb, var(--color-accent-primary-light) 70%, transparent)",
                      }}
                      aria-hidden
                    >
                      <CaseStudyCheck className="size-3.5" />
                    </span>
                    <p className="text-[15px] leading-[1.8] text-[var(--color-text-secondary)] md:text-[16px]">
                      {line}
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Try demo（インライン誘導） */}
            <section
              id="try-demo"
              className={sectionClass}
              aria-labelledby="case-study-try-heading"
            >
              <SectionHeading
                id="case-study-try-heading"
                number={numberOf("try-demo")}
                kicker="demo"
                title="実際に触ってみる"
              />
              <div className="overflow-hidden rounded-2xl border border-[var(--color-accent-primary)]/25 bg-[var(--color-accent-primary-light)]/40 p-7 md:p-9">
                <p className="max-w-[46ch] text-[15px] leading-[1.85] text-[var(--color-text-primary)] md:text-[16px]">
                  デモ環境は公開URLまたは自サイト内の体験ページから開けます。操作感をご確認いただいたうえで、要件のすり合わせに進めます。
                </p>
                <div className="mt-7">
                  <DemoLaunchLink
                    href={demoHref}
                    openInNewTab={demoOpenInNewTab}
                    className="group inline-flex min-h-[54px] items-center justify-center gap-2 rounded-xl bg-[var(--color-accent-primary)] px-9 text-[16px] font-semibold text-[var(--color-bg-pure)] shadow-[0_14px_30px_-14px_rgba(38,65,142,0.7)] transition-colors hover:bg-[var(--color-accent-primary-hover)] md:text-[17px]"
                  >
                    デモを開く
                    <CaseStudyArrowRight className="size-5 transition-transform group-hover:translate-x-0.5" />
                  </DemoLaunchLink>
                  {demoOpenInNewTab ? (
                    <p className="mt-3 text-[13px] text-[var(--color-text-tertiary)] md:text-[14px]">
                      {isHttpUrl(demoHref)
                        ? "外部サイトへ移動します（新しいタブ）。"
                        : "新しいタブで開きます。"}
                    </p>
                  ) : null}
                </div>
              </div>
            </section>

            {/* Related links */}
            <section
              className="py-14 md:py-20"
              aria-labelledby="case-study-related-heading"
            >
              <SectionHeading
                id="case-study-related-heading"
                number={numberOf("next")}
                kicker="next"
                title="関連する情報"
                lead="このサンプルと近い文脈での構想整理から実装まで、同一チームで伴走できます。"
              />
              <ul className="grid gap-3 sm:grid-cols-2">
                {detail.relatedLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-5 py-4 text-[15px] font-semibold text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] md:text-[16px]"
                    >
                      {link.label}
                      <CaseStudyArrowRight className="size-4 shrink-0 text-[var(--color-accent-primary)] transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={solutionsHref}
                    className="group flex items-center justify-between gap-3 rounded-xl border border-[var(--color-border-light)] bg-[var(--color-bg-pure)] px-5 py-4 text-[15px] font-semibold text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent-primary)] hover:text-[var(--color-accent-primary)] md:text-[16px]"
                  >
                    業界別ソリューションを見る
                    <CaseStudyArrowRight className="size-4 shrink-0 text-[var(--color-accent-primary)] transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>

      {/* 最終CTA（全幅ネイビー） */}
      <section
        className="border-t border-[var(--color-border-light)] bg-[var(--color-bg-base)] py-14 md:py-20"
        aria-labelledby="case-study-cta-heading"
      >
        <div className="container mx-auto max-w-7xl px-4 md:px-6">
          <div className="overflow-hidden rounded-3xl bg-[var(--color-accent-primary)] px-7 py-12 text-[var(--color-bg-pure)] md:px-14 md:py-16">
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--color-warm)] md:text-[12px]">
              contact
            </p>
            <h2
              id="case-study-cta-heading"
              className="mt-4 max-w-[20ch] text-balance text-[clamp(1.5rem,3.5vw,2.25rem)] font-bold leading-tight"
            >
              貴社向けの実装を相談する
            </h2>
            <p className="mt-5 max-w-[46ch] text-[15px] leading-[1.85] text-[var(--color-bg-pure)]/85 md:text-[16px]">
              画面はサンプルです。権限設計・連携・運用まで含めて、構想整理から実装まで一気通貫でご提案します。
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href="/contact"
                className="inline-flex min-h-[54px] items-center justify-center rounded-xl bg-[var(--color-bg-pure)] px-9 text-[16px] font-semibold text-[var(--color-accent-primary)] transition-transform hover:-translate-y-0.5 md:text-[17px]"
              >
                お問い合わせへ
              </Link>
              <Link
                href="/experience"
                className="inline-flex min-h-[54px] items-center justify-center rounded-xl border border-[var(--color-bg-pure)]/40 px-9 text-[16px] font-semibold text-[var(--color-bg-pure)] transition-colors hover:bg-[var(--color-bg-pure)]/10 md:text-[17px]"
              >
                体験ギャラリーへ戻る
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
