"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface CitationLine {
  id: string;
  title: string;
  section: string;
  excerpt?: string;
}

interface KnowledgeAnswerCardProps {
  body: string;
  citations: CitationLine[];
  policyLine: string;
  onAnotherQuestion: () => void;
  onChangeIndustry: () => void;
  className?: string;
}

const DEMO_NOTE =
  "参考資料（ナレッジ）やルールブックを事前に登録しておくことで、誤った回答や曖昧な回答を抑え、関係者全員が同じ情報と手順を前提に業務できます。実運用では版管理・承認フロー・アクセス権と組み合わせるのが一般的です。";

export function KnowledgeAnswerCard({
  body,
  citations,
  policyLine,
  onAnotherQuestion,
  onChangeIndustry,
  className,
}: KnowledgeAnswerCardProps) {
  return (
    <div
      className={cn(
        "max-h-[min(520px,75vh)] overflow-y-auto rounded-2xl border border-silver/25 bg-base-dark/95 p-5 shadow-xl md:p-7",
        className
      )}
    >
      <h3 className="mb-2 text-sm font-semibold text-accent">回答</h3>
      <div className="mb-6 whitespace-pre-wrap rounded-lg border border-accent/20 bg-accent/5 p-4 text-sm leading-relaxed text-text">
        {body}
      </div>

      <h3 className="mb-2 text-sm font-semibold text-text">引用元ナレッジ</h3>
      <ul className="mb-6 space-y-2">
        {citations.map((c, idx) => (
          <li key={c.id}>
            <details className="rounded-lg border border-silver/15 bg-silver/5">
              <summary className="cursor-pointer px-3 py-2 text-xs font-medium text-text md:text-sm">
                [{idx + 1}] {c.title} — {c.section}
              </summary>
              {c.excerpt ? (
                <p className="border-t border-silver/10 px-3 py-2 text-xs leading-relaxed text-text-sub">
                  {c.excerpt}
                </p>
              ) : null}
            </details>
          </li>
        ))}
      </ul>

      <p className="mb-4 text-xs text-amber-200/90">適用ルール: {policyLine}</p>

      <details className="mb-6 rounded-lg border border-silver/20 text-xs text-text-sub">
        <summary className="cursor-pointer px-3 py-2 font-medium text-text">
          このデモについて
        </summary>
        <p className="border-t border-silver/15 px-3 py-2 leading-relaxed">
          {DEMO_NOTE}
        </p>
      </details>

      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="default" size="sm" onClick={onAnotherQuestion}>
          別の質問へ
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onChangeIndustry}>
          業種を変える
        </Button>
      </div>
    </div>
  );
}
