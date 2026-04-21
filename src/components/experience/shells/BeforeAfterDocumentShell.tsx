"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { DocumentShellChoiceWizard } from "@/components/experience/shells/DocumentShellChoiceWizard";
import type {
  DocumentShellChoiceStep,
  DocumentShellUserInput,
} from "@/lib/experience/document-shell-preset-types";
import type { DocumentShellBlock, DocumentShellMockResult } from "@/lib/experience/document-plan-shell-types";
import type { ExperiencePrototypeMeta } from "@/lib/experience/prototype-registry";
import { cn } from "@/lib/utils";

const TYPE_MS = 22;
const CHARS_PER_TICK = 2;

export interface BeforeAfterDocumentShellProps {
  meta: ExperiencePrototypeMeta;
  className?: string;
  sampleTexts: string[];
  /** `sampleTexts` と同じ長さ。未指定時は「サンプル1」…で表示 */
  sampleLabels?: string[];
  buildMock: (input: DocumentShellUserInput) => DocumentShellMockResult;
  choiceSteps?: DocumentShellChoiceStep[];
  leftPanelTitle?: string;
  centerButtonLabel?: string;
  rightPanelTitle?: string;
}

type Cursor =
  | { phase: "idle" }
  | { phase: "typing"; blockIndex: number; bulletIndex: number; charIndex: number };

function BlockHeading({ text }: { text: string }) {
  return (
    <h3 className="mt-4 text-sm font-semibold text-white first:mt-0 md:text-[1rem]">
      {text}
    </h3>
  );
}

function BlockParagraph({ text }: { text: string }) {
  return (
    <p className="mt-2 text-sm leading-relaxed text-text md:text-[1rem]">{text}</p>
  );
}

function BlockBullets({ items }: { items: string[] }) {
  return (
    <ul className="mt-2 list-inside list-disc space-y-1.5 text-sm text-text md:text-[1rem]">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  );
}

function BlockTable({
  caption,
  headers,
  rows,
}: {
  caption?: string;
  headers: string[];
  rows: string[][];
}) {
  return (
    <div className="mt-3 overflow-x-auto rounded-lg border border-silver/25 bg-base-dark/40">
      {caption ? (
        <p className="border-b border-silver/20 px-3 py-2 text-xs text-text-sub md:text-sm">
          {caption}
        </p>
      ) : null}
      <table className="w-full min-w-[280px] text-left text-xs text-text md:text-sm">
        <thead>
          <tr className="border-b border-silver/20 bg-silver/5">
            {headers.map((h) => (
              <th key={h} className="px-3 py-2 font-medium text-white/90">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-silver/15 last:border-0">
              {row.map((cell, ci) => (
                <td key={ci} className="px-3 py-2 text-text-sub">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BlockKpis({
  items,
}: {
  items: { label: string; value: string; note?: string }[];
}) {
  return (
    <div className="mt-3 grid gap-2 sm:grid-cols-3">
      {items.map((k) => (
        <div
          key={k.label}
          className="rounded-lg border border-accent/25 bg-accent/5 p-3"
        >
          <p className="text-xs text-text-sub">{k.label}</p>
          <p className="text-lg font-semibold text-accent">{k.value}</p>
          {k.note ? (
            <p className="mt-1 text-[11px] text-text-sub md:text-xs">{k.note}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

function BlockChecklist({
  items,
}: {
  items: { label: string; done?: boolean; note?: string }[];
}) {
  return (
    <ul className="mt-3 space-y-2">
      {items.map((it, i) => (
        <li
          key={i}
          className="flex gap-2 rounded-lg border border-silver/25 bg-base-dark/50 px-3 py-2 text-sm text-text md:text-[1rem]"
        >
          <span
            className={cn(
              "mt-0.5 h-4 w-4 shrink-0 rounded border border-accent/50",
              it.done ? "bg-accent/30" : "bg-transparent"
            )}
            aria-hidden
          />
          <span className="min-w-0 flex-1">
            <span className="font-medium text-white/90">{it.label}</span>
            {it.note ? (
              <span className="mt-0.5 block text-xs text-text-sub">{it.note}</span>
            ) : null}
          </span>
        </li>
      ))}
    </ul>
  );
}

function renderPartialBlock(
  block: DocumentShellBlock,
  partial: { bulletIndex: number; charIndex: number } | null
): ReactNode {
  if (!partial) {
    switch (block.type) {
      case "heading":
        return <BlockHeading text={block.text} />;
      case "paragraph":
        return <BlockParagraph text={block.text} />;
      case "bullets":
        return <BlockBullets items={block.items} />;
      case "table":
        return (
          <BlockTable
            caption={block.caption}
            headers={block.headers}
            rows={block.rows}
          />
        );
      case "kpis":
        return <BlockKpis items={block.items} />;
      default:
        return null;
    }
  }

  if (block.type === "heading") {
    const t = block.text.slice(0, partial.charIndex);
    return t ? <BlockHeading text={t} /> : null;
  }
  if (block.type === "paragraph") {
    const t = block.text.slice(0, partial.charIndex);
    return t ? <BlockParagraph text={t} /> : null;
  }
  if (block.type === "bullets") {
    const done = block.items.slice(0, partial.bulletIndex);
    const cur = block.items[partial.bulletIndex];
    const curText = cur ? cur.slice(0, partial.charIndex) : "";
    const items = curText ? [...done, curText] : done;
    if (items.length === 0) return null;
    return <BlockBullets items={items} />;
  }
  if (block.type === "table") {
    return (
      <BlockTable
        caption={block.caption}
        headers={block.headers}
        rows={block.rows}
      />
    );
  }
  if (block.type === "kpis") {
    return <BlockKpis items={block.items} />;
  }
  if (block.type === "checklist") {
    return <BlockChecklist items={block.items} />;
  }
  return null;
}

function RightPanel({
  result,
  cursor,
  fullReveal,
  runButtonLabel,
}: {
  result: DocumentShellMockResult;
  cursor: Cursor;
  fullReveal: boolean;
  runButtonLabel: string;
}) {
  const blocks = result.blocks;
  const out: ReactNode[] = [];

  const showFull =
    fullReveal ||
    (cursor.phase === "idle" && blocks.length > 0 && result.documentTitle);

  if (showFull) {
    return (
      <div className="space-y-1">
        <h2 className="border-b border-accent/30 pb-2 text-lg font-semibold text-accent md:text-xl">
          {result.documentTitle}
        </h2>
        {blocks.map((b, i) => (
          <div key={i}>{renderPartialBlock(b, null)}</div>
        ))}
      </div>
    );
  }

  if (cursor.phase === "idle") {
    return (
      <p className="text-sm text-text-sub md:text-[1rem]">
        左のメモを入力し、中央の「{runButtonLabel}」でたたき台を生成します。
      </p>
    );
  }

  const { blockIndex, bulletIndex, charIndex } = cursor;

  out.push(
    <h2
      key="title"
      className="border-b border-accent/30 pb-2 text-lg font-semibold text-accent md:text-xl"
    >
      {result.documentTitle}
    </h2>
  );

  for (let i = 0; i < blockIndex; i++) {
    out.push(
      <div key={i}>{renderPartialBlock(blocks[i]!, null)}</div>
    );
  }

  if (blockIndex < blocks.length) {
    const b = blocks[blockIndex]!;
    out.push(
      <div key={`cur-${blockIndex}`}>
        {renderPartialBlock(b, { bulletIndex, charIndex })}
      </div>
    );
  }

  return <div className="space-y-1">{out}</div>;
}

function advanceCursor(blocks: DocumentShellBlock[], c: Cursor): Cursor {
  if (c.phase !== "typing") return c;
  const { blockIndex, bulletIndex, charIndex } = c;
  const block = blocks[blockIndex];
  if (!block) return { phase: "idle" };

  if (block.type === "heading" || block.type === "paragraph") {
    const text = block.text;
    const next = charIndex + CHARS_PER_TICK;
    if (next >= text.length) {
      return { phase: "typing", blockIndex: blockIndex + 1, bulletIndex: 0, charIndex: 0 };
    }
    return { phase: "typing", blockIndex, bulletIndex: 0, charIndex: next };
  }

  if (block.type === "bullets") {
    const item = block.items[bulletIndex];
    if (!item) {
      return { phase: "typing", blockIndex: blockIndex + 1, bulletIndex: 0, charIndex: 0 };
    }
    const next = charIndex + CHARS_PER_TICK;
    if (next >= item.length) {
      if (bulletIndex + 1 >= block.items.length) {
        return { phase: "typing", blockIndex: blockIndex + 1, bulletIndex: 0, charIndex: 0 };
      }
      return { phase: "typing", blockIndex, bulletIndex: bulletIndex + 1, charIndex: 0 };
    }
    return { phase: "typing", blockIndex, bulletIndex, charIndex: next };
  }

  if (
    block.type === "table" ||
    block.type === "kpis" ||
    block.type === "checklist"
  ) {
    return { phase: "typing", blockIndex: blockIndex + 1, bulletIndex: 0, charIndex: 0 };
  }

  return { phase: "idle" };
}

function requiredChoicesFilled(
  steps: DocumentShellChoiceStep[],
  selections: Record<string, string>
): boolean {
  return steps.every((s) => s.optional || Boolean(selections[s.id]?.trim()));
}

export function BeforeAfterDocumentShell({
  meta,
  className,
  sampleTexts,
  sampleLabels,
  buildMock,
  choiceSteps = [],
  leftPanelTitle = "入力メモ（雑でOK）",
  centerButtonLabel = "AI実行",
  rightPanelTitle = "生成結果（体裁イメージ）",
}: BeforeAfterDocumentShellProps) {
  const reduceMotion = useReducedMotion();
  const [text, setText] = useState("");
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [wizardOpen, setWizardOpen] = useState(false);
  const [wizardStepIndex, setWizardStepIndex] = useState(0);
  const wizardAutoOpenedRef = useRef(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<DocumentShellMockResult | null>(null);
  const [cursor, setCursor] = useState<Cursor>({ phase: "idle" });
  const [fullReveal, setFullReveal] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const blocksRef = useRef<DocumentShellBlock[]>([]);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const canRun =
    text.trim().length > 0 &&
    (choiceSteps.length === 0 || requiredChoicesFilled(choiceSteps, selections));

  const choiceStepsKey = choiceSteps.map((s) => s.id).join("|");

  useEffect(() => {
    wizardAutoOpenedRef.current = false;
  }, [choiceStepsKey]);

  useEffect(() => {
    if (
      choiceSteps.length === 0 ||
      requiredChoicesFilled(choiceSteps, selections) ||
      wizardAutoOpenedRef.current
    ) {
      return;
    }
    wizardAutoOpenedRef.current = true;
    queueMicrotask(() => {
      setWizardStepIndex(0);
      setWizardOpen(true);
    });
  }, [choiceSteps, selections]);

  function openChoiceWizard() {
    setWizardStepIndex(0);
    setWizardOpen(true);
  }

  const run = useCallback(() => {
    if (busy || !canRun) return;
    clearTimer();
    setBusy(true);
    setResult(null);
    setCursor({ phase: "idle" });
    setFullReveal(false);

    const delay = reduceMotion ? 0 : 520;
    window.setTimeout(() => {
      const built = buildMock({
        rawText: text.trim(),
        selections,
      });
      setResult(built);
      blocksRef.current = built.blocks;
      setBusy(false);

      if (reduceMotion) {
        setFullReveal(true);
        setCursor({ phase: "idle" });
        return;
      }

      setCursor({
        phase: "typing",
        blockIndex: 0,
        bulletIndex: 0,
        charIndex: 0,
      });
    }, delay);
  }, [
    busy,
    canRun,
    text,
    selections,
    buildMock,
    reduceMotion,
    clearTimer,
    setBusy,
    setResult,
    setCursor,
    setFullReveal,
  ]);

  useEffect(() => {
    if (!result || reduceMotion || cursor.phase !== "typing") {
      clearTimer();
      return;
    }

    const blocks = blocksRef.current;
    timerRef.current = setInterval(() => {
      setCursor((prev) => {
        if (prev.phase !== "typing") return prev;
        const next = advanceCursor(blocks, prev);
        if (next.phase === "typing" && next.blockIndex >= blocks.length) {
          clearTimer();
          return { phase: "idle" };
        }
        if (next.phase === "idle") {
          clearTimer();
        }
        return next;
      });
    }, TYPE_MS);

    return clearTimer;
  }, [result, reduceMotion, cursor.phase, clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  return (
    <div className={cn("space-y-6", className)}>
      {/* lg: items-start で右だけ縦に伸びる。左・中央は sticky で入力と実行が見え続ける */}
      <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-start lg:gap-3">
        <div className="relative flex min-h-[200px] flex-col rounded-xl border border-silver/25 bg-[#141820] p-4 md:min-h-[240px] md:p-5 lg:sticky lg:top-24 lg:z-10 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:shadow-lg lg:shadow-black/20">
          <h2 className="mb-2 text-sm font-semibold text-accent md:text-[1rem]">
            {leftPanelTitle}
          </h2>
          {choiceSteps.length > 0 ? (
            <div className="mb-3 space-y-2">
              <p className="text-xs leading-relaxed text-text-sub md:text-sm">
                {requiredChoicesFilled(choiceSteps, selections)
                  ? "選択項目は埋まっています。必要なら編集できます。"
                  : `選択項目が${choiceSteps.length}つあります。ウィザードで順に選んでください。`}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-text-sub hover:bg-silver/10 hover:text-text"
                disabled={busy}
                onClick={openChoiceWizard}
              >
                {requiredChoicesFilled(choiceSteps, selections)
                  ? "選択を編集"
                  : "選択を設定"}
              </Button>
            </div>
          ) : null}
          {sampleTexts.length > 0 ? (
            <div className="mb-3">
              <p className="mb-2 text-xs font-medium text-text md:text-sm">
                別のシナリオを読み込む
              </p>
              <div className="flex flex-wrap gap-2">
                {sampleTexts.map((s, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setText(s)}
                    className="max-w-full rounded-lg border border-accent/35 bg-accent/5 px-3 py-1.5 text-left text-xs text-text transition hover:border-accent/55 hover:bg-accent/10 md:text-sm"
                    title={s}
                    aria-label={`${sampleLabels?.[i] ?? `シナリオ${i + 1}`}の文面を入力欄に読み込む`}
                  >
                    {sampleLabels?.[i] ?? `シナリオ${i + 1}`}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={meta.inputHint}
            rows={8}
            className="min-h-[140px] flex-1 resize-y font-mono text-sm text-text md:text-[1rem]"
            spellCheck={false}
          />
          <p className="mt-2 text-xs text-text-sub">
            本画面はプロトタイプです。同じテーマの{" "}
            <Link
              href={`/demo/${meta.demoSlug}`}
              className="text-accent underline-offset-2 hover:underline"
            >
              ツールdemo
            </Link>
            ではチャット形式も試せます。
          </p>
          {choiceSteps.length > 0 ? (
            <DocumentShellChoiceWizard
              steps={choiceSteps}
              selections={selections}
              onSelect={(stepId, optionId) =>
                setSelections((prev) => ({ ...prev, [stepId]: optionId }))
              }
              stepIndex={wizardStepIndex}
              onStepIndexChange={setWizardStepIndex}
              open={wizardOpen}
              onOpenChange={setWizardOpen}
              onComplete={() => {}}
              disabled={busy}
            />
          ) : null}
        </div>

        <div className="flex flex-row justify-center gap-3 lg:sticky lg:top-24 lg:z-10 lg:flex-col lg:items-center lg:justify-start lg:gap-0 lg:px-2 lg:pt-1">
          <Button
            type="button"
            onClick={run}
            disabled={busy || !canRun}
            className="size-[5.25rem] min-h-0 min-w-0 shrink-0 rounded-full px-2 py-2 text-center text-[13px] font-semibold leading-snug [word-break:keep-all] whitespace-normal hover:text-white"
          >
            {busy ? "実行中" : centerButtonLabel}
          </Button>
        </div>

        <div
          className="flex min-h-[200px] flex-col rounded-xl border border-accent/35 bg-gradient-to-b from-base-dark to-base-dark/90 p-4 shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-glow)_18%,transparent)] md:min-h-[240px] md:p-5 lg:min-h-0"
          aria-live="polite"
          aria-busy={busy}
        >
          <h2 className="mb-2 shrink-0 text-sm font-semibold text-white md:text-[1rem]">
            {rightPanelTitle}
          </h2>
          <div className="min-h-[120px] overflow-y-auto pr-1 lg:max-h-[calc(100vh-7rem)]">
            {result ? (
              <RightPanel
                result={result}
                cursor={cursor}
                fullReveal={fullReveal}
                runButtonLabel={centerButtonLabel}
              />
            ) : (
              <p className="text-sm text-text-sub md:text-[1rem]">
                左のメモを入力し、中央の「{centerButtonLabel}」で体裁のたたき台を生成します。
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
