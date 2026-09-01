"use client";

import { useEffect } from "react";
import { DemoFrame } from "@/components/home/demo-showcase/DemoFrame";
import { useDemoProcess } from "@/components/home/demo-showcase/useDemoProcess";
import { useInViewAutoPlay } from "@/components/home/demo-showcase/useInViewAutoPlay";
import {
  knowledgeProcessingSteps,
  photoProcessingSteps,
  photoSampleSets,
} from "@/lib/content/demo-showcase-samples";
import type { TopFeaturedDemo } from "@/lib/content/top-featured-demos";

const approvalSteps = [
  "図面指定を読み取り",
  "証明書と突合せ",
  "一致 / 要確認 / 記載なし",
  "人の判断待ちへ",
];

const childcareSteps = [
  "事案メモを受領",
  "園ルールと照合",
  "妥当性チェック",
  "報告書下書き生成",
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
    <section ref={ref as React.RefObject<HTMLElement>}>
      <DemoFrame title="写真 → 報告">
        <div className="grid items-start gap-4 lg:grid-cols-[0.8fr_0.3fr_1fr]">
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
    <section ref={ref as React.RefObject<HTMLElement>}>
      <DemoFrame title="質問 → 根拠付き回答">
        <div className="grid gap-4 lg:grid-cols-[0.9fr_1fr_0.9fr]">
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
              className={`text-sm leading-relaxed text-gray-800 transition-opacity duration-500 ${
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
              className={`mt-2 text-xs leading-relaxed text-[var(--site-fg-muted)] transition-opacity duration-500 ${
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
    <section ref={ref as React.RefObject<HTMLElement>}>
      <DemoFrame title="図面 × 証明書 → 承認">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
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
  const { logs, isComplete, start, reset } = useDemoProcess(400);
  const { ref, isInView } = useInViewAutoPlay();

  useEffect(() => {
    if (isInView) start(childcareSteps);
    else reset();
  }, [isInView, reset, start]);

  const fields = [
    { key: "児童", value: "A君（4歳）" },
    { key: "事象", value: "園庭転倒・擦り傷" },
    { key: "対応", value: "流水洗浄・絆創膏" },
    { key: "根拠", value: "安全管理マニュアル 3-2" },
  ];

  return (
    <section ref={ref as React.RefObject<HTMLElement>}>
      <DemoFrame title="事案メモ → 報告書">
        <div className="grid items-center gap-4 lg:grid-cols-[0.95fr_0.2fr_1fr]">
          <div className="rounded-xl border border-[#D9DDE3] bg-white p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-[var(--site-fg-muted)]">
              デモシナリオ
            </p>
            <p className="text-sm leading-relaxed text-gray-700">
              10時15分頃、A君が園庭でかけっこ中に転倒し、右膝に擦り傷。水道で洗浄し絆創膏を貼付。その後元気に活動。
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {childcareSteps.map((step, index) => (
                <span
                  key={step}
                  className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                    isComplete || index < logs.length
                      ? "bg-brand/15 text-brand-deep"
                      : "bg-gray-100 text-[var(--site-fg-muted)]"
                  }`}
                >
                  {step}
                </span>
              ))}
            </div>
          </div>
          <div className="text-brand hidden items-center justify-center text-2xl lg:flex">
            ↓ AI
          </div>
          <div className="rounded-xl border border-[#D9DDE3] bg-white p-4">
            <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[var(--site-fg-muted)]">
              報告書下書き
            </p>
            <div className="space-y-2 text-sm">
              {fields.map((field, index) => (
                <div
                  key={field.key}
                  className={`grid grid-cols-[52px_1fr] gap-3 transition-all duration-500 ${
                    isComplete || index < logs.length
                      ? "translate-y-0 opacity-100"
                      : "translate-y-1 opacity-20"
                  }`}
                >
                  <span className="text-[var(--site-fg-muted)]">{field.key}</span>
                  <span className="text-gray-800">{field.value}</span>
                </div>
              ))}
            </div>
            <p
              className={`mt-3 rounded-lg border px-3 py-2 text-xs ${
                isComplete
                  ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                  : "border-[#D9DDE3] bg-gray-50 text-[var(--site-fg-muted)]"
              }`}
            >
              {isComplete
                ? "根拠ルール照合済・保護者連絡文案まで生成"
                : "生成中…"}
            </p>
          </div>
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
    <div className="relative">
      <div className="absolute top-[2.85rem] left-2.5 z-10 flex max-w-[calc(100%-1.25rem)] flex-wrap gap-1 sm:top-[3.1rem] sm:left-3.5 sm:gap-1.5">
        {demo.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-black/55 px-2 py-0.5 text-[10px] font-semibold text-white/90 shadow-sm backdrop-blur-sm sm:px-2.5 sm:text-[11px]"
          >
            {tag}
          </span>
        ))}
      </div>
      <FeaturedShowcase demo={demo} />
    </div>
  );
}

function FeaturedText({ demo }: { demo: TopFeaturedDemo }) {
  return (
    <div className="max-w-xl">
      <h3
        title={demo.title}
        className="mb-2 truncate text-lg leading-tight font-bold text-[var(--site-fg)] sm:mb-3 sm:text-2xl md:mb-6 md:text-5xl md:leading-tight md:whitespace-normal"
      >
        {demo.title}
      </h3>
      <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-[var(--site-fg)]/85 md:mb-6 md:line-clamp-none md:text-lg">
        {demo.lead}
      </p>
      <div className="hidden space-y-2 text-sm md:block">
        <div className="flex gap-3">
          <span className="w-14 shrink-0 text-[var(--site-fg-muted)]">Before</span>
          <span className="text-[var(--site-fg)]/80">{demo.before}</span>
        </div>
        <div className="flex gap-3">
          <span className="text-brand-deep w-14 shrink-0 font-semibold">After</span>
          <span className="text-[var(--site-fg)]">{demo.after}</span>
        </div>
      </div>
      {demo.sampleNote ? (
        <p className="mt-4 hidden text-xs text-[var(--site-fg-muted)] md:block">
          {demo.sampleNote}
        </p>
      ) : null}
    </div>
  );
}

function FeaturedActions({ demo }: { demo: TopFeaturedDemo }) {
  return (
    <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:flex-wrap">
      <a
        href={demo.tryHref}
        target={demo.tryExternal ? "_blank" : undefined}
        rel={demo.tryExternal ? "noopener noreferrer" : undefined}
        className="bg-brand hover:bg-brand-hover inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold text-[var(--df-on-primary)] transition-colors sm:w-auto md:px-5 md:py-3"
      >
        {demo.tryLabel}
      </a>
    </div>
  );
}

type Props = {
  demos: TopFeaturedDemo[];
};

export function TopFeaturedDemoShowcase({ demos }: Props) {
  return (
    <div className="mx-auto max-w-7xl space-y-4 px-4 py-2 sm:space-y-8 sm:px-6 md:space-y-10 lg:px-8">
      {demos.map((demo) => (
        <article
          key={demo.id}
          id={`featured-${demo.id}`}
          className="scroll-mt-[13.5rem] rounded-2xl border border-[var(--site-border)] bg-[var(--df-bg)] p-3 sm:rounded-[28px] sm:p-6 md:scroll-mt-[16rem] md:p-8 lg:scroll-mt-[18rem] lg:p-10"
        >
          <div className="grid items-center gap-4 sm:gap-8 lg:grid-cols-2 lg:gap-10">
            <FeaturedText demo={demo} />
            <ShowcaseWithTags demo={demo} />
          </div>
          <div className="mt-4 sm:mt-6 md:mt-8">
            <FeaturedActions demo={demo} />
          </div>
        </article>
      ))}
    </div>
  );
}
