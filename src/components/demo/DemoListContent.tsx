"use client";

import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Mic, Search } from "lucide-react";
import type { AiDemo, DemoItem } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
  getCategoryId,
  CATEGORY_LABELS,
  getIndustryTagClass,
  getFunctionTagClass,
} from "@/lib/demo/demo-taxonomy";

const PURPOSE_FILTER_LABELS: Record<string, string> = {
  report: "報告・記録",
  search: "検索・要約",
  inquiry: "問い合わせ",
  document: "帳票・契約",
  safety: "安全管理",
  quality: "品質・製造",
  sales: "販促・営業",
  legal: "士業・法務",
  hr: "採用・人材",
  inspection: "点検・画像",
  logistics: "物流",
  other: "その他",
};

type SpeechRecognitionLike = new () => {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  start: () => void;
  onresult: ((event: { results?: ArrayLike<ArrayLike<{ transcript?: string }>> }) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};

function getSpeechRecognitionCtor(): SpeechRecognitionLike | undefined {
  if (typeof window === "undefined") return undefined;
  const browserWindow = window as Window & {
    SpeechRecognition?: SpeechRecognitionLike;
    webkitSpeechRecognition?: SpeechRecognitionLike;
  };
  return browserWindow.SpeechRecognition ?? browserWindow.webkitSpeechRecognition;
}

function getSlug(demo: AiDemo | DemoItem): string | undefined {
  return typeof demo.slug === "object" ? demo.slug?.current : demo.slug;
}

function RunModeBadge({ demo }: { demo: AiDemo | DemoItem }) {
  if ((demo as AiDemo)._type !== "aiDemo") return null;
  const runMode = (demo as AiDemo).runMode ?? "mock_preview";
  const isLive = runMode === "ai_live";
  return (
    <span
      className={cn(
        "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
        isLive
          ? "border border-accent/50 bg-accent/10 text-accent"
          : "border border-silver/40 bg-silver/10 text-text-sub"
      )}
    >
      {isLive ? "実AI" : "モック"}
    </span>
  );
}

function DemoCard({
  demo,
  className,
}: {
  demo: AiDemo | DemoItem;
  className?: string;
}) {
  const slug = getSlug(demo);
  const imageUrl = demo.image?.url;
  const oneLiner = demo.oneLiner ?? demo.description;
  const functionTags = demo.functionTags ?? [];
  const industryTags = demo.industryTags ?? [];

  return (
    <Link
      href={slug ? `/demo/${slug}` : "#"}
      className={cn(
        "group flex w-[152px] shrink-0 snap-start flex-col overflow-hidden rounded-xl border border-silver/20 bg-base-dark transition-colors hover:border-accent/40 md:w-[248px]",
        className
      )}
    >
      {imageUrl ? (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={imageUrl}
            alt={demo.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 152px, 248px"
          />
        </div>
      ) : (
        <div className="aspect-video w-full bg-silver/10" />
      )}
      <div className="flex flex-1 flex-col p-2.5 md:p-4">
        <div className="mb-1.5 flex items-center gap-1.5 md:mb-2 md:gap-2">
          <RunModeBadge demo={demo} />
          <h2 className="line-clamp-1 text-sm font-semibold text-text group-hover:text-accent md:text-[1rem]">
            {demo.title}
          </h2>
        </div>
        {oneLiner && (
          <p className="mb-2 line-clamp-2 flex-1 text-xs leading-4 text-text-sub md:mb-3 md:text-sm md:leading-5">
            {oneLiner}
          </p>
        )}
        <div className="mb-2 flex flex-wrap gap-1 md:mb-3 md:gap-1.5">
          {functionTags.slice(0, 1).map((t) => (
            <span
              key={`fn-${t}`}
              className={cn(
                "rounded-full border px-1.5 py-0.5 text-[10px] font-medium md:px-2 md:text-xs",
                getFunctionTagClass(t)
              )}
            >
              {t}
            </span>
          ))}
          {industryTags.slice(0, 2).map((t) => (
            <span
              key={`ind-${t}`}
              className={cn(
                "rounded-full border px-1.5 py-0.5 text-[10px] font-medium md:px-2 md:text-xs",
                getIndustryTagClass(t)
              )}
            >
              {t}
            </span>
          ))}
        </div>
        <span className="inline-flex h-8 items-center rounded-md border border-silver/30 px-2.5 text-xs font-medium text-text-sub group-hover:border-accent/50 group-hover:text-accent md:h-9 md:px-3 md:text-sm">
          体験する
        </span>
      </div>
    </Link>
  );
}

function HorizontalRail({
  children,
  ariaLabel,
}: {
  children: ReactNode;
  ariaLabel: string;
}) {
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);
  const [mounted, setMounted] = useState(false);
  const railRef = useRef<HTMLDivElement | null>(null);

  const updateScrollState = () => {
    const node = railRef.current;
    if (!node) return;
    setCanLeft(node.scrollLeft > 4);
    setCanRight(node.scrollLeft + node.clientWidth < node.scrollWidth - 4);
  };

  useEffect(() => {
    setMounted(true);
    updateScrollState();
    const node = railRef.current;
    if (!node) return;
    const onScroll = () => updateScrollState();
    node.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      node.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", updateScrollState);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollByAmount = (direction: 1 | -1) => {
    const node = railRef.current;
    if (!node) return;
    node.scrollBy({ left: direction * node.clientWidth * 0.72, behavior: "smooth" });
  };

  return (
    <div className="relative left-1/2 w-screen -translate-x-1/2">
      <div
        ref={(el) => {
          railRef.current = el;
          if (mounted) updateScrollState();
        }}
        className={cn(
          "no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:gap-4 md:px-8 xl:px-12"
        )}
        aria-label={ariaLabel}
      >
        {children}
      </div>

      {canLeft && (
        <>
          <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-16 bg-gradient-to-r from-base via-base/80 to-transparent md:block" />
          <button
            type="button"
            onClick={() => scrollByAmount(-1)}
            className="absolute left-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-silver/40 bg-base-dark/85 p-1.5 text-text-sub transition-colors hover:border-accent/60 hover:text-accent md:block"
            aria-label="左にスクロール"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </>
      )}
      {canRight && (
        <>
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-16 bg-gradient-to-l from-base via-base/80 to-transparent md:block" />
          <button
            type="button"
            onClick={() => scrollByAmount(1)}
            className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-full border border-silver/40 bg-base-dark/85 p-1.5 text-text-sub transition-colors hover:border-accent/60 hover:text-accent md:block"
            aria-label="右にスクロール"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </>
      )}
    </div>
  );
}

interface DemoListContentProps {
  demos: (AiDemo | DemoItem)[];
}

export function DemoListContent({ demos }: DemoListContentProps) {
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<string[]>([]);
  const [keywordQuery, setKeywordQuery] = useState("");
  const [isConciergeOpen, setIsConciergeOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    if (typeof window === "undefined") return;
    setSpeechSupported(Boolean(getSpeechRecognitionCtor()));
    // 一覧に来たら毎回、最上部でAIコンシェルジュを表示
    setIsConciergeOpen(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isConciergeOpen) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isConciergeOpen]);

  if (demos.length === 0) {
    return (
      <p className="py-16 text-center text-text-sub">デモは準備中です。</p>
    );
  }

  const categoryOrder = [
    "report",
    "search",
    "inquiry",
    "document",
    "safety",
    "quality",
    "sales",
    "legal",
    "hr",
    "inspection",
    "logistics",
    "other",
  ];

  const availableIndustries = useMemo(() => {
    const set = new Set<string>();
    for (const demo of demos) {
      for (const tag of demo.industryTags ?? []) set.add(tag);
    }
    return [...set].sort((a, b) => a.localeCompare(b, "ja"));
  }, [demos]);

  const availableCategoryIds = useMemo(() => {
    const set = new Set<string>();
    for (const demo of demos) {
      set.add(getCategoryId(demo.functionTags));
    }
    return categoryOrder.filter((id) => set.has(id));
  }, [demos]);

  const filteredDemos = useMemo(() => {
    const normalizedQuery = keywordQuery.trim().toLowerCase();
    return demos.filter((demo) => {
      const catId = getCategoryId(demo.functionTags);
      const industryTags = demo.industryTags ?? [];
      const categoryOk =
        selectedCategoryIds.length === 0 || selectedCategoryIds.includes(catId);
      const industryOk =
        selectedIndustries.length === 0 ||
        industryTags.some((tag) => selectedIndustries.includes(tag));
      const searchable = [
        demo.title,
        demo.description ?? "",
        demo.oneLiner ?? "",
        ...(demo.functionTags ?? []),
        ...(demo.industryTags ?? []),
      ]
        .join(" ")
        .toLowerCase();
      const keywordOk =
        normalizedQuery.length === 0 || searchable.includes(normalizedQuery);
      return categoryOk && industryOk && keywordOk;
    });
  }, [demos, keywordQuery, selectedCategoryIds, selectedIndustries]);

  const grouped = useMemo(() => {
    const map = new Map<string, (AiDemo | DemoItem)[]>();
    for (const demo of filteredDemos) {
      const catId = getCategoryId(demo.functionTags);
      const list = map.get(catId) ?? [];
      list.push(demo);
      map.set(catId, list);
    }
    return map;
  }, [filteredDemos]);

  const orderedCategories = categoryOrder.filter((id) => grouped.has(id));
  const rest = [...grouped.keys()].filter((id) => !categoryOrder.includes(id));
  const allCategories = [...orderedCategories, ...rest];

  const recommendedDemos = useMemo(() => filteredDemos.slice(0, 6), [filteredDemos]);

  const toggleCategory = (id: string) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]
    );
  };

  const toggleIndustry = (tag: string) => {
    setSelectedIndustries((prev) =>
      prev.includes(tag) ? prev.filter((v) => v !== tag) : [...prev, tag]
    );
  };

  const handleConciergeApply = () => {
    setIsConciergeOpen(false);
  };

  const startVoiceInput = () => {
    const SpeechRecognitionCtor = getSpeechRecognitionCtor();
    if (!SpeechRecognitionCtor) return;
    const recognition = new SpeechRecognitionCtor();
    recognition.lang = "ja-JP";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    setIsListening(true);
    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? "";
      if (transcript.trim()) {
        setKeywordQuery((prev) =>
          prev.trim() ? `${prev.trim()} ${transcript.trim()}` : transcript.trim()
        );
      }
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  return (
    <div className="space-y-8 pb-8">
      <section className="rounded-xl border border-silver/20 bg-base-dark/70 p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-sm text-text-sub">
            AI提案条件: {keywordQuery || "キーワード未入力"} / 目的
            {selectedCategoryIds.length > 0 ? ` ${selectedCategoryIds.length}` : " 未選択"} / 業種
            {selectedIndustries.length > 0 ? ` ${selectedIndustries.length}` : " 未選択"}
          </p>
          <button
            type="button"
            onClick={() => setIsConciergeOpen(true)}
            className="rounded-md border border-silver/30 px-3 py-1 text-xs text-text-sub transition-colors hover:border-accent/50 hover:text-accent"
          >
            AIに相談し直す
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {selectedCategoryIds.map((id) => (
            <span
              key={`selected-cat-${id}`}
              className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs text-accent"
            >
              {PURPOSE_FILTER_LABELS[id] ?? CATEGORY_LABELS[id] ?? id}
            </span>
          ))}
          {selectedIndustries.map((tag) => (
            <span
              key={`selected-ind-${tag}`}
              className="rounded-full border border-accent/40 bg-accent/10 px-2.5 py-1 text-xs text-accent"
            >
              {tag}
            </span>
          ))}
          {!keywordQuery && selectedCategoryIds.length === 0 && selectedIndustries.length === 0 && (
            <span className="text-xs text-text-sub">条件は未設定です</span>
          )}
        </div>
      </section>

      {recommendedDemos.length > 0 && (
        <section>
          <h2 className="mb-3 text-lg font-bold text-accent md:text-xl">
            AIが提案した候補
          </h2>
          <HorizontalRail ariaLabel="AIが提案した候補">
            {recommendedDemos.map((demo) => (
              <DemoCard key={`rec-${demo._id}`} demo={demo} />
            ))}
          </HorizontalRail>
        </section>
      )}

      {allCategories.map((catId) => {
        const items = grouped.get(catId) ?? [];
        const label = CATEGORY_LABELS[catId] ?? catId;
        return (
          <section key={catId}>
            <h2 className="mb-3 text-lg font-bold text-text md:text-xl">
              {label}
            </h2>
            <HorizontalRail ariaLabel={`${label}のデモ一覧`}>
              {items.map((demo) => (
                <DemoCard key={demo._id} demo={demo} />
              ))}
            </HorizontalRail>
          </section>
        );
      })}

      {filteredDemos.length === 0 && (
        <p className="rounded-lg border border-silver/20 bg-base-dark/70 p-4 text-sm text-text-sub">
          条件に合うデモが見つかりませんでした。業種または目的の選択を少し広げてみてください。
        </p>
      )}

      {hasMounted && isConciergeOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-base/80 p-4 pt-24 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-silver/30 bg-base-dark p-5 shadow-2xl">
            <p className="mb-1 text-xs uppercase tracking-[0.16em] text-accent/90">
              AI Concierge
            </p>
            <h3 className="mb-2 text-lg font-semibold text-text">
              どんなデモをお探しですか？
            </h3>
            <p className="mb-4 text-sm text-text-sub">
              キーワード入力を中心に、必要に応じて業種と目的を追加すると精度が上がります。
            </p>
            <div className="mb-4">
              <p className="mb-2 text-xs text-text-sub">ワード検索（音声入力対応）</p>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-sub" />
                  <Input
                    value={keywordQuery}
                    onChange={(e) => setKeywordQuery(e.target.value)}
                    placeholder="例: クレーム 返信 / 面接 評価 / 点検 報告"
                    className="pl-9"
                  />
                </div>
                <button
                  type="button"
                  onClick={startVoiceInput}
                  disabled={!speechSupported}
                  className={cn(
                    "inline-flex h-10 items-center justify-center rounded-md border px-3",
                    speechSupported
                      ? "border-silver/30 text-text-sub hover:border-accent/50 hover:text-accent"
                      : "cursor-not-allowed border-silver/20 text-text-sub/50"
                  )}
                  aria-label="音声入力を開始"
                >
                  <Mic className={cn("h-4 w-4", isListening && "text-accent")} />
                </button>
              </div>
              {isListening && (
                <p className="mt-1 text-xs text-accent">音声を認識しています...</p>
              )}
            </div>
            <div className="mb-4">
              <p className="mb-2 text-xs text-text-sub">目的（複数選択可）</p>
              <div className="flex gap-2 overflow-x-auto pb-1 whitespace-nowrap scrollbar-thin scrollbar-track-transparent scrollbar-thumb-silver/30">
                {availableCategoryIds.map((id) => {
                  const active = selectedCategoryIds.includes(id);
                  return (
                    <button
                      key={`modal-cat-${id}`}
                      type="button"
                      onClick={() => toggleCategory(id)}
                      className={cn(
                        "shrink-0 rounded-full border px-2.5 py-1 text-xs transition-colors",
                        active
                          ? "border-accent/60 bg-accent/15 text-accent"
                          : "border-silver/30 text-text-sub hover:border-accent/40 hover:text-accent"
                      )}
                    >
                      {PURPOSE_FILTER_LABELS[id] ?? CATEGORY_LABELS[id] ?? id}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="mb-5">
              <p className="mb-2 text-xs text-text-sub">業種（複数選択可）</p>
              <div className="flex gap-2 overflow-x-auto pb-1 whitespace-nowrap scrollbar-thin scrollbar-track-transparent scrollbar-thumb-silver/30">
                {availableIndustries.map((tag) => {
                  const active = selectedIndustries.includes(tag);
                  return (
                    <button
                      key={`modal-ind-${tag}`}
                      type="button"
                      onClick={() => toggleIndustry(tag)}
                      className={cn(
                        "shrink-0 rounded-full border px-2.5 py-1 text-xs transition-colors",
                        active
                          ? "border-accent/60 bg-accent/15 text-accent"
                          : "border-silver/30 text-text-sub hover:border-accent/40 hover:text-accent"
                      )}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsConciergeOpen(false)}
                className="rounded-md border border-silver/30 px-3 py-2 text-sm text-text-sub transition-colors hover:border-silver/50 hover:text-text"
              >
                あとで
              </button>
              <button
                type="button"
                onClick={handleConciergeApply}
                className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-[color:var(--color-base)] transition-opacity hover:opacity-90"
              >
                AIに提案してもらう
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
