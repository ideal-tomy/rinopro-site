"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  buildLegalMemoryMock,
  getSearchScopeLabel,
  LEGAL_MEMORY_TAG_OPTIONS,
  type LegalMemoryTagId,
} from "@/lib/experience/legal-memory-secretary-mock";
import type { ExperiencePrototypeMeta } from "@/lib/experience/prototype-registry";
import { cn } from "@/lib/utils";

const SAMPLES = [
  "港区の賃貸、3年前の契約で解約は何日前？",
  "NDAの秘密保持は契約終了後どれくらい？",
];

interface LegalMemorySecretaryExperienceProps {
  meta: ExperiencePrototypeMeta;
  className?: string;
}

export function LegalMemorySecretaryExperience({
  meta,
  className,
}: LegalMemorySecretaryExperienceProps) {
  const [text, setText] = useState("");
  const [selectedTags, setSelectedTags] = useState<LegalMemoryTagId[]>([]);
  const [result, setResult] = useState<ReturnType<
    typeof buildLegalMemoryMock
  > | null>(null);
  const [selectedHitId, setSelectedHitId] = useState<string | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const hitRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduceMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const scopePreview = useMemo(
    () => getSearchScopeLabel(selectedTags),
    [selectedTags]
  );

  const toggleTag = (id: LegalMemoryTagId) => {
    setSelectedTags((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
    setResult(null);
    setSelectedHitId(null);
  };

  const run = () => {
    setResult(buildLegalMemoryMock({ tagIds: selectedTags, query: text }));
    setSelectedHitId(null);
  };

  const focusHit = useCallback(
    (hitId: string) => {
      setSelectedHitId(hitId);
      const el = hitRefs.current[hitId];
      el?.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "nearest",
      });
      const details = el?.closest("details");
      if (details && !details.open) {
        details.open = true;
      }
    },
    [reduceMotion]
  );

  const onSummaryKeyDown = (
    e: React.KeyboardEvent,
    hitId: string | undefined
  ) => {
    if (!hitId) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      focusHit(hitId);
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      <div className="rounded-xl border border-silver/25 bg-base-dark/80 p-4 md:p-6">
        <h2 className="mb-3 text-sm font-semibold text-accent md:text-base">
          入力
        </h2>

        <p className="mb-2 text-xs font-medium text-text-sub md:text-sm">
          メタデータ（検索対象の絞り込み・モック）
        </p>
        <div
          className="mb-4 flex flex-wrap gap-2"
          role="group"
          aria-label="文書カテゴリタグ"
        >
          {LEGAL_MEMORY_TAG_OPTIONS.map((opt) => {
            const pressed = selectedTags.includes(opt.id);
            return (
              <button
                key={opt.id}
                type="button"
                role="checkbox"
                aria-checked={pressed}
                onClick={() => toggleTag(opt.id)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs transition md:text-sm",
                  pressed
                    ? "border-accent/60 bg-accent/15 text-text"
                    : "border-silver/30 bg-silver/5 text-text-sub hover:border-accent/40 hover:text-text"
                )}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        <div className="mb-4 rounded-lg border border-silver/20 bg-silver/5 px-3 py-2 text-xs text-text-sub md:text-sm">
          <span className="font-medium text-text">検索対象: </span>
          {scopePreview}
        </div>

        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={meta.inputHint}
          rows={4}
          className="mb-3 resize-y text-sm md:text-base"
        />
        <div className="mb-3 flex flex-wrap gap-2">
          {SAMPLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setText(s)}
              className="rounded-full border border-silver/30 bg-silver/5 px-3 py-1 text-xs text-text-sub transition hover:border-accent/40 hover:text-text md:text-sm"
            >
              {s}
            </button>
          ))}
        </div>
        <Button type="button" onClick={run}>
          実行（モック結果）
        </Button>
        <p className="mt-2 text-xs text-text-sub">
          本画面はプロトタイプです。チャットで実AIを試す場合は{" "}
          <Link
            href={`/demo/${meta.demoSlug}`}
            className="text-accent underline-offset-2 hover:underline"
          >
            ツールdemo
          </Link>
          へ。
        </p>
      </div>

      {result && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-silver/20 bg-base-dark p-4">
            <h3 className="mb-2 text-sm font-semibold text-text md:text-base">
              検索ヒット（引用付き）
            </h3>
            <p className="mb-3 text-xs text-text-sub">
              スコープ: {result.searchScope}
            </p>
            <ul className="space-y-2">
              {result.hits.map((h) => (
                <li key={h.id} ref={(el) => { hitRefs.current[h.id] = el; }}>
                  <details
                    className={cn(
                      "group rounded-lg border bg-silver/5 text-sm transition-colors",
                      selectedHitId === h.id
                        ? "border-accent/50 bg-accent/10"
                        : "border-silver/15"
                    )}
                    style={{
                      transitionDuration: reduceMotion ? "0ms" : undefined,
                    }}
                    onToggle={(e) => {
                      if ((e.currentTarget as HTMLDetailsElement).open) {
                        setSelectedHitId(h.id);
                      }
                    }}
                  >
                    <summary
                      className="cursor-pointer list-none p-3 [&::-webkit-details-marker]:hidden"
                    >
                      <p className="font-medium text-accent">{h.title}</p>
                      <p className="mt-1 text-text-sub">{h.collapsedExcerpt}</p>
                      <span className="mt-2 inline-block text-xs text-accent/80 underline-offset-2 group-open:no-underline">
                        根拠スニペットを展開
                      </span>
                    </summary>
                    <div className="border-t border-silver/10 px-3 pb-3 pt-2">
                      <p className="text-text-sub">{h.expandedExcerpt}</p>
                      <p className="mt-2 font-mono text-xs text-accent/90">
                        {h.citation}
                      </p>
                    </div>
                  </details>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-amber-200/90">
              ※ デモは固定モックです。本番では根拠と元ファイル位置を必ず紐づけます。
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl border border-silver/20 bg-base-dark p-4">
              <h3 className="mb-2 text-sm font-semibold text-text md:text-base">
                対外メモ（要約）
              </h3>
              <div className="text-sm leading-relaxed text-text-sub">
                {result.summarySegments.map((seg, i) => {
                  if (!seg.hitId) {
                    return <span key={i}>{seg.text}</span>;
                  }
                  return (
                    <button
                      key={i}
                      type="button"
                      tabIndex={0}
                      onClick={() => focusHit(seg.hitId!)}
                      onKeyDown={(e) => onSummaryKeyDown(e, seg.hitId)}
                      className={cn(
                        "mx-0.5 inline rounded px-0.5 text-left underline decoration-accent/50 decoration-dotted underline-offset-2 transition-colors",
                        selectedHitId === seg.hitId
                          ? "bg-accent/15 text-text ring-1 ring-accent/40"
                          : "hover:bg-silver/10 hover:text-text"
                      )}
                    >
                      {seg.text}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="rounded-xl border border-accent/25 bg-accent/5 p-4">
              <h3 className="mb-2 text-sm font-semibold text-text md:text-base">
                社内メモ
              </h3>
              <p className="text-sm leading-relaxed text-text-sub">
                {result.internal}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
