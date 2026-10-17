"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import {
  DemoFrame,
  DemoFrameBottomOverlayContext,
} from "@/components/home/demo-showcase/DemoFrame";
import { useDemoProcess } from "@/components/home/demo-showcase/useDemoProcess";
import { useInViewAutoPlay } from "@/components/home/demo-showcase/useInViewAutoPlay";
import { useScrollLinkedOpacity } from "@/components/home/demo-showcase/useScrollLinkedOpacity";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import {
  viewSlideEase,
  viewSlideProgress,
  viewSlideTranslateX,
} from "@/lib/motion/view-slide";
import {
  knowledgeProcessingSteps,
  photoProcessingSteps,
  photoSampleSets,
} from "@/lib/content/demo-showcase-samples";
import type { TopFeaturedDemo } from "@/lib/content/top-featured-demos";

/** lg 二列時：文案列とデモ列の共通行高 */
const FEATURED_LG_ROW_HEIGHT = "lg:h-[420px] lg:max-h-[420px]";
const FEATURED_LG_ROW_CLIP = `${FEATURED_LG_ROW_HEIGHT} lg:overflow-hidden`;
const FEATURED_LG_ROW_TEXT = `${FEATURED_LG_ROW_HEIGHT} lg:overflow-visible`;

/** デモ枠：lg 未満は中身の高さに合わせて全体を見せ、lg は文案列と同じ固定高 */
const FEATURED_DEMO_VIEWPORT = `min-h-0 ${FEATURED_LG_ROW_CLIP}`;

const approvalSteps = [
  "図面指定を読み取り",
  "証明書と突合せ",
  "一致 / 要確認 / 記載なし",
  "人の判断待ちへ",
];

const childcareShots = [
  {
    src: "/images/demo-showcase/childcare/today.png",
    alt: "今日の様子。園長確認待ちや園児・設備の記録が一覧できる画面",
    className: "col-span-2 min-h-0",
  },
  {
    src: "/images/demo-showcase/childcare/report-slide.png",
    alt: "すべり台の報告書。写真付きで設備異常と根拠ルールが残る詳細",
    className: "min-h-0",
  },
  {
    src: "/images/demo-showcase/childcare/chat.png",
    alt: "質問・相談。園の決まりに沿って対応を確かめる画面",
    className: "min-h-0",
  },
];

function ConstructionShowcase() {
  const sample = photoSampleSets[0];
  const { logs, isComplete, start, reset } = useDemoProcess(380);
  const { ref, isInView } = useInViewAutoPlay();

  useEffect(() => {
    if (isInView) start(photoProcessingSteps);
    else reset();
  }, [isInView, reset, start]);

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="flex h-full flex-col">
      <DemoFrame title="写真 → 報告" className="min-h-0 flex-1">
        <div className="grid h-full min-h-0 gap-4 overflow-hidden lg:grid-cols-[0.8fr_0.3fr_1fr]">
          <div className="rounded-xl border border-[#D9DDE3] bg-white p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--site-fg-muted)]">
              現場写真
            </p>
            <ul className="space-y-2">
              {sample.photos.map((photo) => (
                <li key={photo.id} className="font-mono text-sm text-gray-700">
                  {photo.originalName}
                </li>
              ))}
            </ul>
          </div>
          <div className="hidden flex-col gap-2 pt-6 lg:flex">
            {logs.map((log) => (
              <span key={log} className="text-brand text-xs">
                {log}
              </span>
            ))}
          </div>
          <div className="rounded-xl border border-[#D9DDE3] bg-white p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--site-fg-muted)]">
              整理結果 → 報告
            </p>
            <ul className="space-y-2 text-sm">
              {sample.results.map((result, index) => (
                <li
                  key={result.id}
                  className={`transition-all duration-500 ${
                    isComplete || index < logs.length
                      ? "translate-y-0 opacity-100"
                      : "translate-y-1 opacity-20"
                  }`}
                >
                  <span className="block text-xs text-[var(--site-fg-muted)]">
                    {result.folder}/
                  </span>
                  <span className="font-mono text-gray-800">{result.newName}</span>
                </li>
              ))}
            </ul>
            <p
              className={`mt-3 rounded-lg border px-3 py-2 text-xs ${
                isComplete
                  ? "border-brand/30 bg-brand/10 text-brand-deep"
                  : "border-[#D9DDE3] bg-gray-50 text-[var(--site-fg-muted)]"
              }`}
            >
              {isComplete ? "報告書下書きの素材が揃いました" : "分類処理中…"}
            </p>
          </div>
        </div>
      </DemoFrame>
    </section>
  );
}

function ManufacturingShowcase() {
  const question =
    "図面S-204の材質指定と、証明書のSUSXM7は同等として通してよいか？";
  const answer =
    "同等材の可能性があるため自動確定はしません。受入検査で「要確認」とし、人が同等判定と根拠を承認に残してください。";
  const sourceTitle = "受入検査基準（材質確認）";
  const sourceExcerpt =
    "表記が異なる場合は「違う」と断定せず、要確認として人に渡し、確認内容を承認記録に紐づける。";
  const { logs, isComplete, start, reset } = useDemoProcess(420);
  const { ref, isInView } = useInViewAutoPlay();

  useEffect(() => {
    if (isInView) start(knowledgeProcessingSteps);
    else reset();
  }, [isInView, reset, start]);

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="flex h-full flex-col">
      <DemoFrame title="質問 → 根拠付き回答" className="min-h-0 flex-1">
        <div className="grid h-full min-h-0 gap-4 overflow-hidden lg:grid-cols-[0.9fr_1fr_0.9fr]">
          <div className="rounded-xl border border-[#D9DDE3] bg-white p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--site-fg-muted)]">
              現場の質問
            </p>
            <p className="text-sm text-gray-800">{question}</p>
          </div>
          <div className="rounded-xl border border-[#D9DDE3] bg-white p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--site-fg-muted)]">
              回答
            </p>
            <p
              className={`line-clamp-5 text-sm leading-[1.5] text-gray-800 transition-opacity duration-500 ${
                isComplete || logs.length > 1 ? "opacity-100" : "opacity-25"
              }`}
            >
              {answer}
            </p>
          </div>
          <div className="rounded-xl border border-[#D9DDE3] bg-white p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--site-fg-muted)]">
              出典
            </p>
            <p
              className={`text-sm text-gray-800 transition-opacity duration-500 ${
                isComplete ? "opacity-100" : "opacity-25"
              }`}
            >
              {sourceTitle}
            </p>
            <p
              className={`mt-2 text-xs leading-[1.5] text-[var(--site-fg-muted)] transition-opacity duration-500 ${
                isComplete ? "opacity-100" : "opacity-25"
              }`}
            >
              {sourceExcerpt}
            </p>
          </div>
        </div>
      </DemoFrame>
    </section>
  );
}

function ApprovalShowcase() {
  const { logs, isComplete, start, reset } = useDemoProcess(400);
  const { ref, isInView } = useInViewAutoPlay();

  useEffect(() => {
    if (isInView) start(approvalSteps);
    else reset();
  }, [isInView, reset, start]);

  const rows = [
    { label: "材質記号", drawing: "SUS304", cert: "SUSXM7", status: "要確認" },
    { label: "規格", drawing: "JIS G4304", cert: "JIS G4304", status: "一致" },
    { label: "板厚", drawing: "10.0", cert: "10.0", status: "一致" },
    {
      label: "ロット番号",
      drawing: "記録必須",
      cert: "記載なし",
      status: "記載なし",
    },
  ] as const;

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="flex h-full flex-col">
      <DemoFrame title="図面 × 証明書 → 承認" className="min-h-0 flex-1">
        <div className="grid h-full min-h-0 gap-4 overflow-hidden lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-xl border border-[#D9DDE3] bg-white">
            <div className="grid grid-cols-[1fr_1fr_1fr_0.9fr] gap-2 border-b border-[#D9DDE3] bg-gray-50 px-3 py-2 text-[10px] font-medium uppercase tracking-wider text-[var(--site-fg-muted)]">
              <span>項目</span>
              <span>図面</span>
              <span>証明書</span>
              <span>判定</span>
            </div>
            <div className="divide-y divide-[#D9DDE3]">
              {rows.map((row, index) => {
                const visible = isComplete || index < logs.length;
                const statusClass =
                  row.status === "一致"
                    ? "bg-emerald-50 text-emerald-800"
                    : row.status === "要確認"
                      ? "bg-amber-50 text-amber-800"
                      : "bg-rose-50 text-rose-800";
                return (
                  <div
                    key={row.label}
                    className={`grid grid-cols-[1fr_1fr_1fr_0.9fr] gap-2 px-3 py-2.5 text-xs transition-all duration-500 sm:text-sm ${
                      visible
                        ? "translate-y-0 opacity-100"
                        : "translate-y-1 opacity-20"
                    }`}
                  >
                    <span className="font-medium text-gray-800">{row.label}</span>
                    <span className="text-gray-700">{row.drawing}</span>
                    <span className="text-gray-700">{row.cert}</span>
                    <span
                      className={`inline-flex w-fit items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusClass}`}
                    >
                      {row.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="rounded-xl border border-[#D9DDE3] bg-white p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--site-fg-muted)]">
              人の判断待ち
            </p>
            <ul className="space-y-2 text-sm">
              <li
                className={`rounded-lg border p-3 transition-opacity duration-500 ${
                  isComplete || logs.length >= 3
                    ? "border-amber-200 bg-amber-50 opacity-100"
                    : "border-[#D9DDE3] bg-gray-50 opacity-25"
                }`}
              >
                材質記号は同等材か確認
              </li>
              <li
                className={`rounded-lg border p-3 transition-opacity duration-500 ${
                  isComplete
                    ? "border-rose-200 bg-rose-50 opacity-100"
                    : "border-[#D9DDE3] bg-gray-50 opacity-25"
                }`}
              >
                ロット番号を別書類で特定し承認に残す
              </li>
            </ul>
            <p
              className={`mt-3 text-xs ${
                isComplete ? "text-brand-deep" : "text-[var(--site-fg-muted)]"
              }`}
            >
              {isComplete
                ? "確認した根拠が承認に残ります"
                : (logs[logs.length - 1] ?? "突合せ準備中…")}
            </p>
          </div>
        </div>
      </DemoFrame>
    </section>
  );
}

function ChildcareShowcase() {
  return (
    <section className="flex h-full flex-col">
      <DemoFrame title="今日の様子 → 報告書" className="min-h-0 flex-1">
        <div className="grid h-[280px] min-h-0 grid-cols-2 grid-rows-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-2 sm:h-[360px] sm:gap-3 lg:h-full">
          {childcareShots.map((shot) => (
            <div
              key={shot.src}
              className={`relative min-h-0 overflow-hidden rounded-lg border border-[#D9DDE3] bg-white ${shot.className}`}
            >
              <Image
                src={shot.src}
                alt={shot.alt}
                fill
                className="object-cover object-left-top"
                sizes="(max-width: 1024px) 100vw, 560px"
              />
            </div>
          ))}
        </div>
      </DemoFrame>
    </section>
  );
}

function FeaturedShowcase({ demo }: { demo: TopFeaturedDemo }) {
  switch (demo.showcase) {
    case "construction-record":
      return <ConstructionShowcase />;
    case "manufacturing-judgment":
      return <ManufacturingShowcase />;
    case "approval-double-check":
      return <ApprovalShowcase />;
    case "childcare-support":
      return <ChildcareShowcase />;
    default:
      return null;
  }
}

function ShowcaseWithTags({ demo }: { demo: TopFeaturedDemo }) {
  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <div className="absolute top-[3.1rem] left-3.5 z-10 hidden max-w-[calc(100%-1.25rem)] flex-wrap gap-1.5 lg:flex">
        {demo.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white/90 shadow-sm backdrop-blur-sm sm:px-2.5 sm:text-[11px]"
          >
            {tag}
          </span>
        ))}
      </div>
      <div className="flex h-full min-h-0 flex-col [&>section]:min-h-0 [&>section]:flex-1">
        <FeaturedShowcase demo={demo} />
      </div>
    </div>
  );
}

type BaVariant = "before" | "after";

const BA_LABEL_TONE: Record<BaVariant, string> = {
  before: "bg-[#E8EAED] text-[#3D3D3D]",
  after: "bg-[var(--color-accent-primary-light)] text-brand-deep",
};

const BA_TEXT_TONE: Record<BaVariant, string> = {
  before: "text-[#2B2B2B]",
  after: "text-brand-deep",
};

function FeaturedBaLabel({
  variant,
  compact = false,
}: {
  variant: BaVariant;
  compact?: boolean;
}) {
  return (
    <span
      className={`inline-flex w-fit rounded-full font-bold leading-none ${
        compact ? "px-2.5 py-1 text-[13px]" : "px-3.5 py-1.5 text-[20px]"
      } ${BA_LABEL_TONE[variant]}`}
    >
      {variant === "before" ? "Before" : "After"}
    </span>
  );
}

function FeaturedBaBody({
  lines,
  variant,
}: {
  lines: readonly [string, string];
  variant: BaVariant;
}) {
  return (
    <p
      className={`mt-3 max-w-none text-[30px] leading-[1.4] font-bold break-keep ${BA_TEXT_TONE[variant]}`}
    >
      {lines[0]}
      <br />
      {lines[1]}
    </p>
  );
}

function FeaturedTryLink({ demo }: { demo: TopFeaturedDemo }) {
  return (
    <a
      href={demo.tryHref}
      target={demo.tryExternal ? "_blank" : undefined}
      rel={demo.tryExternal ? "noopener noreferrer" : undefined}
      className="bg-brand hover:bg-brand-hover inline-flex min-h-11 w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-[var(--df-on-primary)] transition-colors lg:w-auto lg:px-5 lg:py-3"
    >
      {demo.tryLabel}
    </a>
  );
}

/** lg 以上：左列の文案（タイトル 2 行・Before/After・CTA） */
function FeaturedCopyColumn({ demo }: { demo: TopFeaturedDemo }) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <h3
        title={demo.title}
        className="text-[1.875rem] leading-[1.25] font-bold break-keep text-[var(--site-fg)]"
      >
        {demo.titleLines[0]}
        <br />
        {demo.titleLines[1]}
      </h3>

      <div className="flex min-h-0 flex-1 flex-col justify-between pt-4">
        <div>
          <div>
            <FeaturedBaLabel variant="before" />
            <FeaturedBaBody lines={demo.beforeLines} variant="before" />
          </div>
          <div className="mt-6">
            <FeaturedBaLabel variant="after" />
            <FeaturedBaBody lines={demo.afterLines} variant="after" />
          </div>
        </div>

        <div className="mt-4">
          <FeaturedTryLink demo={demo} />
        </div>
      </div>
    </div>
  );
}

/** lg 未満：Before/After 表示と同じ opacity でデモ本文を暗くする */
function FeaturedMobileBaDimmer({ opacity }: { opacity: number }) {
  const visible = opacity > 0.04;
  return (
    <div
      className="pointer-events-none absolute inset-0 z-[5] bg-black/42 lg:hidden"
      style={{ opacity }}
      aria-hidden={!visible}
    />
  );
}

function FeaturedMobileBaPill({
  variant,
  lines,
  slide,
}: {
  variant: BaVariant;
  lines: readonly [string, string];
  slide: number;
}) {
  const translateX = viewSlideTranslateX(slide, 120);
  const shellTone =
    variant === "before"
      ? "bg-[#E8EAED] border-[#D9DDE3]"
      : "bg-[var(--color-accent-primary-light)] border-brand/20";

  if (slide <= 0.001) {
    return null;
  }

  return (
    <div
      className={`flex w-full max-w-[min(100%,19.5rem)] items-start gap-2.5 rounded-2xl border px-3 py-2.5 shadow-[0_6px_18px_rgb(15_23_42_/_0.14)] sm:max-w-[min(100%,21rem)] sm:gap-3 sm:px-3.5 sm:py-3 ${shellTone}`}
      style={{ transform: `translateX(${translateX}px)` }}
    >
      <FeaturedBaLabel variant={variant} compact />
      <p
        className={`min-w-0 flex-1 text-[13px] leading-[1.45] font-bold break-keep sm:text-[14px] ${BA_TEXT_TONE[variant]}`}
      >
        {lines[0]}
        <br />
        {lines[1]}
      </p>
    </div>
  );
}

function FeaturedMobileSpOverlays({
  demo,
  opacity,
  motionReduced,
}: {
  demo: TopFeaturedDemo;
  opacity: number;
  motionReduced: boolean;
}) {
  const beforeSlide = motionReduced
    ? 1
    : viewSlideProgress(opacity, 0.16, 0.75);
  const afterSlide = motionReduced
    ? 1
    : viewSlideProgress(opacity, 0.3, 0.75);
  const showLayer = motionReduced || opacity > 0.04;

  return (
    <>
      <FeaturedMobileBaDimmer opacity={motionReduced ? 1 : opacity} />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-3 z-10 flex flex-col items-start gap-2 px-1 sm:bottom-4 sm:gap-2.5 sm:px-2 lg:hidden"
        aria-hidden={!showLayer}
      >
        <h3 className="sr-only">{demo.title}</h3>
        <FeaturedMobileBaPill
          variant="before"
          lines={demo.beforeLines}
          slide={beforeSlide}
        />
        <FeaturedMobileBaPill
          variant="after"
          lines={demo.afterLines}
          slide={afterSlide}
        />
      </div>
    </>
  );
}

function FeaturedDemoArticle({ demo }: { demo: TopFeaturedDemo }) {
  const demoColumnRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const baOpacity = useScrollLinkedOpacity(demoColumnRef, {
    disabled: reduceMotion,
  });

  return (
    <article
      id={`featured-${demo.id}`}
      className="scroll-mt-[13.5rem] rounded-2xl border border-[var(--site-border)] bg-[var(--df-bg)] p-3 sm:rounded-[28px] sm:p-6 md:scroll-mt-[16rem] md:p-8 lg:scroll-mt-[18rem] lg:p-10"
    >
      <div className="grid min-h-0 gap-4 sm:gap-5 lg:grid-cols-2 lg:items-stretch lg:gap-10">
        <div
          className={`hidden min-h-0 lg:block lg:pl-10 xl:pl-14 ${FEATURED_LG_ROW_TEXT}`}
        >
          <FeaturedCopyColumn demo={demo} />
        </div>
        <div
          ref={demoColumnRef}
          className={`flex flex-col ${FEATURED_DEMO_VIEWPORT}`}
        >
          <DemoFrameBottomOverlayContext.Provider
            value={
              <FeaturedMobileSpOverlays
                demo={demo}
                opacity={baOpacity}
                motionReduced={reduceMotion}
              />
            }
          >
            <ShowcaseWithTags demo={demo} />
          </DemoFrameBottomOverlayContext.Provider>
        </div>
        <div className="lg:hidden">
          <FeaturedTryLink demo={demo} />
        </div>
      </div>
    </article>
  );
}

type Props = {
  demos: TopFeaturedDemo[];
};

export function TopFeaturedDemoShowcase({ demos }: Props) {
  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-2 sm:space-y-8 sm:px-6 md:space-y-10 lg:px-8">
      {demos.map((demo) => (
        <FeaturedDemoArticle key={demo.id} demo={demo} />
      ))}
    </div>
  );
}
