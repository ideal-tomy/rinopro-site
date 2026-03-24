"use client";

import type { ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  A_STEP_BUILD,
  A_STEP_INTEGRATION,
  A_STEP_TEAM,
  B_STEP_CHALLENGE,
  B_STEP_SUPPORT,
  B_STEP_TEAM,
  C_STEP2,
  COMMON_FINISH_BODY,
  CTA_ADJUST_LABEL,
  CTA_FREEFORM_LABEL,
  CTA_PRIMARY_LABEL,
  D_STEP2,
  E_STEP2,
  ROOT_CHOICES,
  SHORTCUT_PANELS,
  type ConciergeTrack,
  type FlowChoice,
  type FlowSelection,
  type FlowStepDef,
  type ShortcutPanel,
  buildCdeSummaryBlock,
  buildEstimateBlockA,
  buildEstimateBlockB,
} from "@/lib/chat/concierge-flow";
import {
  buildContactHandoffUrl,
  buildHandoffPayload,
} from "@/lib/chat/estimate-handoff";

type FlowFrame =
  | { kind: "root" }
  | {
      kind: "question";
      track: ConciergeTrack;
      step: FlowStepDef;
      path: FlowSelection[];
    }
  | {
      kind: "freeform";
      track: ConciergeTrack;
      step: FlowStepDef;
      path: FlowSelection[];
      choice: FlowChoice;
    }
  | {
      kind: "done";
      track: ConciergeTrack;
      path: FlowSelection[];
      body: string;
      shortcut?: ShortcutPanel;
    };

function buildNextFrameAfterAnswer(
  track: ConciergeTrack,
  completedStepKey: string,
  path: FlowSelection[]
): FlowFrame {
  if (track === "A") {
    if (completedStepKey === "A2") {
      return { kind: "question", track: "A", step: A_STEP_BUILD, path };
    }
    if (completedStepKey === "A3") {
      return {
        kind: "question",
        track: "A",
        step: A_STEP_INTEGRATION,
        path,
      };
    }
    if (completedStepKey === "A4") {
      const body = buildEstimateBlockA(path);
      return { kind: "done", track: "A", path, body };
    }
    return { kind: "done", track: "A", path, body: buildEstimateBlockA(path) };
  }
  if (track === "B") {
    if (completedStepKey === "B2") {
      return { kind: "question", track: "B", step: B_STEP_TEAM, path };
    }
    if (completedStepKey === "B3") {
      return {
        kind: "question",
        track: "B",
        step: B_STEP_CHALLENGE,
        path,
      };
    }
    if (completedStepKey === "B4") {
      const body = buildEstimateBlockB(path);
      return { kind: "done", track: "B", path, body };
    }
    return { kind: "done", track: "B", path, body: buildEstimateBlockB(path) };
  }
  const t = track as "C" | "D" | "E";
  const shortcut = SHORTCUT_PANELS[t];
  const body = buildCdeSummaryBlock(t, path);
  return { kind: "done", track: t, path, body, shortcut };
}

const ROOT_TITLE = "知りたいこと";

function rootSelection(choice: FlowChoice): FlowSelection {
  return {
    stepKey: "root",
    optionId: choice.id,
    label: choice.label,
    stepTitle: ROOT_TITLE,
  };
}

function parseBoldLine(line: string): ReactNode {
  const parts = line.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = part.match(/^\*\*([^*]+)\*\*$/);
    if (m) return <strong key={i}>{m[1]}</strong>;
    return <span key={i}>{part}</span>;
  });
}

interface HomeConciergeFlowProps {
  disabled?: boolean;
  /** チャット入力欄へ分岐メモを追記（APIは呼ばない） */
  onInjectDraft: (draft: string) => void;
  className?: string;
}

export function HomeConciergeFlow({
  disabled = false,
  onInjectDraft,
  className,
}: HomeConciergeFlowProps) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [frames, setFrames] = useState<FlowFrame[]>([{ kind: "root" }]);

  const current = frames[frames.length - 1];

  /** root 直後の質問、または freeform の上積みに使う */
  const push = useCallback((f: FlowFrame) => {
    setFrames((prev) => [...prev, f]);
  }, []);

  const pop = useCallback(() => {
    setFrames((prev) => (prev.length <= 1 ? prev : prev.slice(0, -1)));
  }, []);

  const restart = useCallback(() => {
    setFrames([{ kind: "root" }]);
  }, []);

  const trackFromRootId = (id: string): ConciergeTrack | null => {
    if (id === "root_a") return "A";
    if (id === "root_b") return "B";
    if (id === "root_c") return "C";
    if (id === "root_d") return "D";
    if (id === "root_e") return "E";
    return null;
  };

  const stepTitleFor = (step: FlowStepDef): string => {
    if (step.stepKey.startsWith("A")) return "開発コスト（質問）";
    if (step.stepKey.startsWith("B")) return "コンサル費用（質問）";
    if (step.stepKey.startsWith("C")) return "開発技術（質問）";
    if (step.stepKey.startsWith("D")) return "ツール内容（質問）";
    if (step.stepKey.startsWith("E")) return "依頼方法（質問）";
    return "質問";
  };

  const handleRootPick = (choice: FlowChoice) => {
    const track = trackFromRootId(choice.id);
    if (!track) return;
    const path = [rootSelection(choice)];
    if (track === "A") {
      push({ kind: "question", track: "A", step: A_STEP_TEAM, path });
      return;
    }
    if (track === "B") {
      push({ kind: "question", track: "B", step: B_STEP_SUPPORT, path });
      return;
    }
    if (track === "C") {
      push({ kind: "question", track: "C", step: C_STEP2, path });
      return;
    }
    if (track === "D") {
      push({ kind: "question", track: "D", step: D_STEP2, path });
      return;
    }
    push({ kind: "question", track: "E", step: E_STEP2, path });
  };

  const handleChoicePick = (
    frame: Extract<FlowFrame, { kind: "question" }>,
    choice: FlowChoice
  ) => {
    const isOther =
      choice.id.endsWith("_other") || choice.label.includes("その他（自由記述）");
    if (isOther) {
      push({
        kind: "freeform",
        track: frame.track,
        step: frame.step,
        path: frame.path,
        choice,
      });
      return;
    }

    const sel: FlowSelection = {
      stepKey: frame.step.stepKey,
      optionId: choice.id,
      label: choice.label,
      stepTitle: stepTitleFor(frame.step),
    };
    const path = [...frame.path, sel];
    const next = buildNextFrameAfterAnswer(
      frame.track,
      frame.step.stepKey,
      path
    );
    setFrames((prev) => [...prev.slice(0, -1), next]);
  };

  const handleFreeformConfirm = (text: string) => {
    setFrames((prev) => {
      const top = prev[prev.length - 1];
      if (top.kind !== "freeform") return prev;
      const trimmed = text.trim();
      const sel: FlowSelection = {
        stepKey: top.step.stepKey,
        optionId: top.choice.id,
        label: top.choice.label,
        stepTitle: stepTitleFor(top.step),
        freeform: trimmed || "（詳細はチャットで補足予定）",
      };
      const path = [...top.path, sel];
      const withoutFree = prev.slice(0, -1);
      const next = buildNextFrameAfterAnswer(
        top.track,
        top.step.stepKey,
        path
      );
      return [...withoutFree.slice(0, -1), next];
    });
  };

  const handlePrimaryCta = () => {
    if (current.kind !== "done") return;
    const payload = buildHandoffPayload(current.track, current.path, current.body);
    router.push(buildContactHandoffUrl(payload));
  };

  const handleFreeformCta = () => {
    if (current.kind !== "done") return;
    const pathLines = current.path.map(
      (p) => `- ${p.stepTitle}: ${p.freeform ? `${p.label}（${p.freeform}）` : p.label}`
    );
    const draft = [
      "【AIコンシェルジュ分岐メモ】",
      "",
      ...pathLines,
      "",
      current.body,
      "",
      "---",
      "（続きを追記して送信してください）",
    ].join("\n");
    onInjectDraft(draft);
  };

  const frameKey = useMemo(() => {
    if (current.kind === "root") return "root";
    if (current.kind === "question")
      return `q-${current.track}-${current.step.stepKey}`;
    if (current.kind === "freeform")
      return `ff-${current.track}-${current.step.stepKey}`;
    return `done-${current.track}-${current.path.length}`;
  }, [current]);

  const motionProps = useMemo(
    () => ({
      initial: reduce ? false : { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: reduce ? undefined : { opacity: 0, y: -6 },
      transition: reduce ? { duration: 0 } : { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const },
    }),
    [reduce]
  );

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col overflow-y-auto", className)}>
      <div className="border-b border-silver/15 px-4 py-2">
        <p className="text-xs font-medium uppercase tracking-wide text-text-sub">
          ガイド
        </p>
        <p className="text-sm text-text-sub">
          タップで進めます。いつでも下の入力欄から自由にご相談いただけます。
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={frameKey} {...motionProps} className="flex-1 p-4">
          {current.kind === "root" && (
            <div className="space-y-4">
              <p className="text-center text-xs font-medium uppercase tracking-wide text-text-sub">
                Step 1
              </p>
              <h3 className="text-center text-base font-semibold text-accent">
                まず、知りたいことを選んでください
              </h3>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {ROOT_CHOICES.map((c) => (
                  <Button
                    key={c.id}
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    className="h-auto min-h-11 justify-center whitespace-normal px-3 py-2.5 text-left text-sm leading-snug"
                    onClick={() => handleRootPick(c)}
                  >
                    {c.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {current.kind === "question" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-medium uppercase tracking-wide text-text-sub">
                  {current.step.stepLabel}
                </p>
                <button
                  type="button"
                  className="text-xs text-accent underline-offset-2 hover:underline"
                  onClick={pop}
                >
                  戻る
                </button>
              </div>
              <h3 className="text-base font-semibold text-text">
                {current.step.question}
              </h3>
              <div className="flex flex-col gap-2">
                {current.step.choices.map((c) => (
                  <Button
                    key={c.id}
                    type="button"
                    variant="outline"
                    disabled={disabled}
                    className="h-auto min-h-11 justify-start whitespace-normal px-3 py-2.5 text-left text-sm leading-snug"
                    onClick={() => handleChoicePick(current, c)}
                  >
                    {c.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {current.kind === "freeform" && (
            <FreeformStep
              key={`${current.step.stepKey}-${current.choice.id}`}
              disabled={disabled}
              onBack={pop}
              onConfirm={handleFreeformConfirm}
              stepLabel={current.step.stepLabel}
              choiceLabel={current.choice.label}
            />
          )}

          {current.kind === "done" && (
            <DoneStep
              disabled={disabled}
              body={current.body}
              shortcut={current.shortcut}
              onBack={pop}
              onAdjust={restart}
              onPrimary={handlePrimaryCta}
              onFreeform={handleFreeformCta}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function FreeformStep({
  disabled,
  onBack,
  onConfirm,
  stepLabel,
  choiceLabel,
}: {
  disabled: boolean;
  onBack: () => void;
  onConfirm: (text: string) => void;
  stepLabel: string;
  choiceLabel: string;
}) {
  const [text, setText] = useState("");
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-text-sub">
          {stepLabel} · 自由記述
        </p>
        <button
          type="button"
          className="text-xs text-accent underline-offset-2 hover:underline"
          onClick={onBack}
        >
          戻る
        </button>
      </div>
      <p className="text-sm text-text-sub">
        「{choiceLabel}」について、簡単で構いませんのでご記入ください。
      </p>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        rows={4}
        className="resize-none text-sm"
        placeholder="例：〇〇部門の△△業務で、□□を減らしたい"
      />
      <Button
        type="button"
        disabled={disabled || !text.trim()}
        onClick={() => onConfirm(text)}
      >
        確定して次へ
      </Button>
    </div>
  );
}

function DoneStep({
  body,
  shortcut,
  disabled,
  onBack,
  onAdjust,
  onPrimary,
  onFreeform,
}: {
  body: string;
  shortcut?: ShortcutPanel;
  disabled: boolean;
  onBack: () => void;
  onAdjust: () => void;
  onPrimary: () => void;
  onFreeform: () => void;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-text-sub">
          結果
        </p>
        <button
          type="button"
          className="text-xs text-accent underline-offset-2 hover:underline"
          onClick={onBack}
        >
          戻る
        </button>
      </div>

      <div className="rounded-lg border border-silver/20 bg-base/40 p-3 text-sm leading-relaxed text-text">
        {body.split("\n").map((line, i) => (
          <p key={i} className="mb-1.5 last:mb-0">
            {parseBoldLine(line)}
          </p>
        ))}
      </div>

      {shortcut && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-text">おすすめの次の一歩</p>
          <div className="flex flex-col gap-2">
            {shortcut.links.map((l) => (
              <Button
                key={l.href}
                asChild
                variant="outline"
                className="w-full justify-center"
              >
                <Link href={l.href}>{l.label}</Link>
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-accent/25 bg-accent/5 p-3 text-sm leading-relaxed text-text">
        {parseBoldLine(COMMON_FINISH_BODY)}
      </div>

      <div className="flex flex-col gap-2">
        <Button type="button" disabled={disabled} onClick={onPrimary}>
          {CTA_PRIMARY_LABEL}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          onClick={onAdjust}
        >
          {CTA_ADJUST_LABEL}
        </Button>
        <Button
          type="button"
          variant="ghost"
          className="text-text-sub"
          disabled={disabled}
          onClick={onFreeform}
        >
          {CTA_FREEFORM_LABEL}
        </Button>
      </div>
    </div>
  );
}
