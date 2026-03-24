"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  buildContactHandoffUrl,
  buildHandoffPayloadV2FromDetailed,
  decodeConciergeEstimateContext,
} from "@/lib/chat/estimate-handoff";
import { suppressNextChatAutoOpen } from "@/lib/chat/chat-auto-open";
import { useConciergeChat } from "@/components/chat/concierge-chat-context";

type ApiResult = {
  requirementTitle: string;
  requirementSections: { heading: string; bullets: string[] }[];
  assumptions: string[];
  risks: string[];
  estimateLoMan: number;
  estimateHiMan: number;
};

const TEAM_OPTIONS = [
  { value: "1-10", label: "1〜10人" },
  { value: "11-50", label: "11〜50人" },
  { value: "51-200", label: "51〜200人" },
  { value: "201+", label: "201人以上" },
  { value: "unknown", label: "未定" },
] as const;

const TIMELINE_OPTIONS = [
  { value: "1m", label: "1ヶ月以内" },
  { value: "3m", label: "2〜3ヶ月以内" },
  { value: "6m", label: "半年以内" },
  { value: "unknown", label: "未定" },
] as const;

const INTEGRATION_OPTIONS = [
  { value: "required", label: "既存システム連携が必須" },
  { value: "nice", label: "できれば連携したい" },
  { value: "standalone", label: "まず単体でよい" },
  { value: "unknown", label: "未定" },
] as const;

function formatRequirementDoc(r: ApiResult): string {
  const lines = [
    `# ${r.requirementTitle}`,
    "",
    ...r.requirementSections.flatMap((s) => [
      `## ${s.heading}`,
      ...s.bullets.map((b) => `- ${b}`),
      "",
    ]),
    "## 前提・仮定",
    ...r.assumptions.map((a) => `- ${a}`),
    "",
    "## リスク・確認事項",
    ...r.risks.map((x) => `- ${x}`),
  ];
  return lines.join("\n");
}

function answersSummaryFromForm(f: FormState): string {
  return [
    `業務・ゴール: ${f.summary}`,
    `利用規模: ${f.teamSize}`,
    `希望スケジュール: ${f.timeline}`,
    `連携: ${f.integration}`,
    f.budgetFeel ? `予算感: ${f.budgetFeel}` : null,
    f.constraints ? `制約・セキュリティ: ${f.constraints}` : null,
  ]
    .filter(Boolean)
    .join("\n");
}

interface FormState {
  summary: string;
  teamSize: string;
  timeline: string;
  integration: string;
  budgetFeel: string;
  constraints: string;
}

const initialForm: FormState = {
  summary: "",
  teamSize: "11-50",
  timeline: "3m",
  integration: "nice",
  budgetFeel: "",
  constraints: "",
};

export function EstimateDetailedContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setOpen: setConciergeOpen } = useConciergeChat();
  const [priorBlock, setPriorBlock] = useState<string>("");
  const [form, setForm] = useState<FormState>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResult | null>(null);
  const [rangeRevealed, setRangeRevealed] = useState(false);

  useEffect(() => {
    const raw = searchParams.get("ctx");
    if (!raw) return;
    const decoded = decodeConciergeEstimateContext(raw);
    if (!decoded) return;
    const block = [
      `トラック: ${decoded.track}`,
      decoded.detailBlock,
    ].join("\n\n");
    setPriorBlock(block);
  }, [searchParams]);

  const canSubmit = useMemo(() => form.summary.trim().length >= 8, [form.summary]);

  const runGenerate = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setRangeRevealed(false);
    try {
      const answers: Record<string, string> = {
        業務概要とゴール: form.summary.trim(),
        利用者規模: TEAM_OPTIONS.find((o) => o.value === form.teamSize)?.label ?? form.teamSize,
        希望スケジュール:
          TIMELINE_OPTIONS.find((o) => o.value === form.timeline)?.label ?? form.timeline,
        連携の要否:
          INTEGRATION_OPTIONS.find((o) => o.value === form.integration)?.label ??
          form.integration,
      };
      if (form.budgetFeel.trim()) answers["予算感"] = form.budgetFeel.trim();
      if (form.constraints.trim()) answers["制約・セキュリティ"] = form.constraints.trim();

      const res = await fetch("/api/estimate-detailed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers,
          priorContext: priorBlock || undefined,
        }),
      });
      const data = (await res.json()) as ApiResult & { error?: string };
      if (!res.ok) {
        throw new Error(data.error ?? "生成に失敗しました");
      }
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "エラーが発生しました");
    } finally {
      setLoading(false);
    }
  }, [form, priorBlock]);

  const goContact = useCallback(() => {
    if (!result) return;
    const payload = buildHandoffPayloadV2FromDetailed({
      requirementDoc: formatRequirementDoc(result),
      estimateLoMan: result.estimateLoMan,
      estimateHiMan: result.estimateHiMan,
      answersSummary: answersSummaryFromForm(form),
    });
    suppressNextChatAutoOpen();
    setConciergeOpen(false);
    router.push(buildContactHandoffUrl(payload));
  }, [result, form, router, setConciergeOpen]);

  return (
    <div className="space-y-10">
      <header className="space-y-3">
        <p className="text-sm font-medium text-accent">詳細見積もり（初期検討）</p>
        <h1 className="text-2xl font-bold text-text md:text-3xl">
          より詳しい見積もりを希望の方はコチラ
        </h1>
        <p className="max-w-2xl text-sm text-text-sub md:text-base">
          追加のヒアリングに回答いただくと、
          <span className="font-medium text-text">仮要件定義</span>
          と
          <span className="font-medium text-text">概算レンジ（目安）</span>
          をAIが整理します。確定見積もりではなく、社内共有用のたたき台としてご利用ください。
        </p>
      </header>

      {priorBlock ? (
        <section className="rounded-xl border border-silver/20 bg-base-dark/40 p-4 text-sm text-text-sub">
          <p className="mb-2 font-medium text-text">コンシェルジュからの文脈</p>
          <pre className="max-h-40 overflow-auto whitespace-pre-wrap font-sans text-xs md:text-sm">
            {priorBlock}
          </pre>
        </section>
      ) : null}

      <section className="space-y-6 rounded-xl border border-silver/25 bg-base-dark/50 p-5 md:p-8">
        <h2 className="text-lg font-semibold text-accent">詳細ヒアリング</h2>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text" htmlFor="ed-summary">
            業務概要とゴール（必須）
          </label>
          <Textarea
            id="ed-summary"
            rows={4}
            value={form.summary}
            onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
            placeholder="例: 問い合わせ対応の工数を減らし、一次返信を24時間以内に標準化したい"
            className="resize-y"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text" htmlFor="ed-team">
              利用者規模
            </label>
            <select
              id="ed-team"
              className="flex h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-3 text-sm text-text"
              value={form.teamSize}
              onChange={(e) => setForm((f) => ({ ...f, teamSize: e.target.value }))}
            >
              {TEAM_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-text" htmlFor="ed-time">
              希望スケジュール
            </label>
            <select
              id="ed-time"
              className="flex h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-3 text-sm text-text"
              value={form.timeline}
              onChange={(e) => setForm((f) => ({ ...f, timeline: e.target.value }))}
            >
              {TIMELINE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text" htmlFor="ed-int">
            既存システム・SaaS との連携
          </label>
          <select
            id="ed-int"
            className="flex h-11 w-full rounded-lg border border-silver/30 bg-base-dark px-3 text-sm text-text"
            value={form.integration}
            onChange={(e) => setForm((f) => ({ ...f, integration: e.target.value }))}
          >
            {INTEGRATION_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text" htmlFor="ed-budget">
            予算感（任意）
          </label>
          <Input
            id="ed-budget"
            value={form.budgetFeel}
            onChange={(e) => setForm((f) => ({ ...f, budgetFeel: e.target.value }))}
            placeholder="例: 数百万円規模で検討 / まずはPoCのみ"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-text" htmlFor="ed-constraints">
            制約・セキュリティ（任意）
          </label>
          <Textarea
            id="ed-constraints"
            rows={3}
            value={form.constraints}
            onChange={(e) => setForm((f) => ({ ...f, constraints: e.target.value }))}
            placeholder="例: オンプレ不可 / 個人情報を扱う / ログ保存期間の要件あり"
            className="resize-y"
          />
        </div>

        {error && (
          <p className="text-sm text-destructive" role="alert">
            {error}
          </p>
        )}

        <Button type="button" disabled={!canSubmit || loading} onClick={runGenerate}>
          {loading ? "生成中…" : "仮要件定義を生成する"}
        </Button>
      </section>

      {result && (
        <section className="space-y-6 rounded-xl border border-accent/30 bg-accent/5 p-5 md:p-8">
          <h2 className="text-lg font-semibold text-accent">{result.requirementTitle}</h2>
          <div className="space-y-5 text-sm text-text">
            {result.requirementSections.map((s) => (
              <div key={s.heading}>
                <h3 className="mb-2 font-semibold text-text">{s.heading}</h3>
                <ul className="list-inside list-disc space-y-1 text-text-sub">
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="rounded-lg border border-silver/20 bg-base-dark/50 p-4">
            <p className="mb-2 text-xs font-medium text-text-sub">前提・仮定</p>
            <ul className="list-inside list-disc text-sm text-text-sub">
              {result.assumptions.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-silver/20 bg-base-dark/50 p-4">
            <p className="mb-2 text-xs font-medium text-text-sub">リスク・確認事項</p>
            <ul className="list-inside list-disc text-sm text-text-sub">
              {result.risks.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          </div>

          {!rangeRevealed ? (
            <Button type="button" variant="default" onClick={() => setRangeRevealed(true)}>
              この内容で概算レンジを表示する
            </Button>
          ) : (
            <div className="rounded-lg border border-accent/40 bg-base-dark/60 p-4">
              <p className="text-sm font-medium text-text">
                概算レンジ（目安・万円）: 約{result.estimateLoMan}万円〜
                {result.estimateHiMan}万円程度
              </p>
              <p className="mt-2 text-xs text-text-sub">
                本見積もりではなく初期検討用です。正式見積もりはヒアリング後に精緻化します。
              </p>
            </div>
          )}

          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <Button type="button" onClick={goContact} disabled={!rangeRevealed}>
              この内容で問い合わせる（見積もり希望）
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/demo/list">他のdemoも見る</Link>
            </Button>
          </div>
        </section>
      )}
    </div>
  );
}
