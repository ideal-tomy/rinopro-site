"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useReducedMotion as useFramerReducedMotion,
} from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ConciergeChoiceButton,
  ConciergeCtaButton,
} from "@/components/chat/ConciergeChoiceButton";
import {
  A_STEP_BUILD,
  A_STEP_SCOPE,
  B_STEP_SCOPE,
  B_STEP_SUPPORT,
  CDE_PICK_STEP,
  C_STEP2,
  CTA_ADJUST_LABEL,
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
  buildEstimateContextPayload,
  buildEstimateDetailedEntryUrl,
  buildHandoffPayloadV1,
} from "@/lib/chat/estimate-handoff";
import type { ConciergeIndustryBundle } from "@/lib/chat/estimate-handoff";
import { ConciergeIndustryStep } from "@/components/chat/ConciergeIndustryStep";
import {
  experienceHref,
  getDemoSlugForAbTrack,
  getDemoSlugForCdeTrack,
} from "@/lib/chat/concierge-routing";
import { suppressNextChatAutoOpen } from "@/lib/chat/chat-auto-open";
import { emitConciergeKpi } from "@/lib/chat/concierge-analytics";
import {
  readVisitorJourneySummary,
  recordVisitorIndustryBundle,
} from "@/lib/journey/visitor-journey-storage";
import { useConciergeChat } from "@/components/chat/concierge-chat-context";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import type {
  ConciergePhase,
  FlowFrame,
  HomeConciergeFooterPhase,
  IndustryPending,
} from "@/components/chat/home-concierge-flow-types";

export type { HomeConciergeFooterPhase };

const DONE_STEP_MS_TO_CTA = 3000;
const DONE_STEP_MS_CTA_TO_INPUT = 3000;

function attachIndustry(
  next: FlowFrame,
  bundle?: ConciergeIndustryBundle
): FlowFrame {
  if (!bundle) return next;
  if (
    next.kind === "question" ||
    next.kind === "freeform" ||
    next.kind === "done"
  ) {
    return { ...next, industryBundle: bundle };
  }
  return next;
}

function buildNextFrameAfterAnswer(
  phase: ConciergePhase,
  completedStepKey: string,
  path: FlowSelection[]
): FlowFrame {
  if (phase === "CDE" && completedStepKey === "CDE_PICK") {
    const pick = path.find((p) => p.stepKey === "CDE_PICK");
    const id = pick?.optionId;
    if (id === "cde_pick_d") {
      return { kind: "question", track: "D", step: D_STEP2, path };
    }
    if (id === "cde_pick_e") {
      return { kind: "question", track: "E", step: E_STEP2, path };
    }
    return { kind: "question", track: "C", step: C_STEP2, path };
  }

  if (phase === "A") {
    if (completedStepKey === "A3") {
      return { kind: "question", track: "A", step: A_STEP_SCOPE, path };
    }
    if (completedStepKey === "A_SCOPE") {
      const body = buildEstimateBlockA(path);
      return { kind: "done", track: "A", path, body };
    }
    return { kind: "done", track: "A", path, body: buildEstimateBlockA(path) };
  }

  if (phase === "B") {
    if (completedStepKey === "B2") {
      return { kind: "question", track: "B", step: B_STEP_SCOPE, path };
    }
    if (completedStepKey === "B_SCOPE") {
      const body = buildEstimateBlockB(path);
      return { kind: "done", track: "B", path, body };
    }
    return { kind: "done", track: "B", path, body: buildEstimateBlockB(path) };
  }

  const t = phase as "C" | "D" | "E";
  const shortcut = SHORTCUT_PANELS[t];
  const body = buildCdeSummaryBlock(t, path);
  return { kind: "done", track: t, path, body, shortcut };
}

function commitIndustryGateFrame(
  bundle: ConciergeIndustryBundle,
  gate: Extract<FlowFrame, { kind: "industry_gate" }>
): FlowFrame {
  const { rootPath, pending } = gate;
  if (pending.kind === "cde") {
    return {
      kind: "question",
      track: "CDE",
      step: CDE_PICK_STEP,
      path: rootPath,
      industryBundle: bundle,
    };
  }
  if (pending.track === "A") {
    return {
      kind: "question",
      track: "A",
      step: A_STEP_BUILD,
      path: rootPath,
      industryBundle: bundle,
    };
  }
  if (pending.track === "B") {
    return {
      kind: "question",
      track: "B",
      step: B_STEP_SUPPORT,
      path: rootPath,
      industryBundle: bundle,
    };
  }
  return {
    kind: "question",
    track: "E",
    step: E_STEP2,
    path: rootPath,
    industryBundle: bundle,
  };
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

const NEXT_STEPS_HEADING = "**次の一歩**";
const SELECTION_MARKER = "**選択内容（参考）**";

/** 画面上はタップカードで示すため、スクロール内の「次の一歩」箇条書きを除く（全文は body のまま） */
function stripNextStepsSectionForDisplay(text: string): string {
  const i = text.indexOf(NEXT_STEPS_HEADING);
  if (i === -1) return text;
  const sel = text.indexOf(SELECTION_MARKER, i);
  if (sel !== -1) {
    return `${text.slice(0, i).trimEnd()}\n\n${text.slice(sel).trimStart()}`.trim();
  }
  const disc = text.indexOf("※ ", i);
  if (disc !== -1) {
    return `${text.slice(0, i).trimEnd()}\n\n${text.slice(disc).trimStart()}`.trim();
  }
  return text.slice(0, i).trimEnd();
}

function ConciergeNextStepsCard({
  track,
  path,
  disabled,
  onDismissForNavigation,
  onDetailedEstimate,
}: {
  track: ConciergeTrack;
  path: FlowSelection[];
  disabled: boolean;
  onDismissForNavigation: () => void;
  onDetailedEstimate: () => void;
}) {
  const router = useRouter();
  const demoSlugResolved =
    track === "A" || track === "B"
      ? getDemoSlugForAbTrack(track, path)
      : getDemoSlugForCdeTrack(track, path);
  const demoHref = demoSlugResolved
    ? experienceHref(demoSlugResolved)
    : "/demo/list";

  const goDemo = () => {
    emitConciergeKpi({
      name: "cta_click",
      href: demoHref,
      ctaKind: demoSlugResolved ? "experience_prototype" : "demo_list",
      mode: "default",
    });
    onDismissForNavigation();
    router.push(demoHref);
  };

  return (
    <div className="mt-5 grid grid-cols-2 gap-2.5" role="navigation" aria-label="結果導線">
      <Link
        href={demoHref}
        className={cn(
          "flex min-h-[3.2rem] items-center justify-center rounded-xl border border-white/18 bg-white/[0.07] px-3 py-3 text-center text-[12px] font-semibold leading-snug text-white shadow-[0_6px_20px_rgba(0,0,0,0.18)] transition-[transform,background-color,border-color,box-shadow] sm:text-[14px]",
          "hover:-translate-y-0.5 hover:border-action/55 hover:bg-action/18 hover:shadow-[0_10px_26px_rgba(0,103,192,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action",
          disabled && "pointer-events-none opacity-50"
        )}
        onClick={(e) => {
          e.preventDefault();
          if (disabled) return;
          goDemo();
        }}
      >
        demoを体験
      </Link>
      <button
        type="button"
        disabled={disabled}
        className={cn(
          "flex min-h-[3.2rem] w-full items-center justify-center rounded-xl border border-action/45 bg-action/22 px-3 py-3 text-center text-[12px] font-semibold leading-snug text-white shadow-[0_8px_22px_rgba(0,103,192,0.16)] transition-[transform,background-color,border-color,box-shadow] sm:text-[14px]",
          "hover:-translate-y-0.5 hover:border-action/75 hover:bg-action/35 hover:shadow-[0_12px_28px_rgba(0,103,192,0.24)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-action",
          disabled && "opacity-50"
        )}
        onClick={() => {
          if (disabled) return;
          onDetailedEstimate();
        }}
      >
        要件をまとめてみる
      </button>
    </div>
  );
}

function stepTitleFor(step: FlowStepDef): string {
  if (step.stepKey === "CDE_PICK") return "知りたいこと（詳細）";
  if (step.stepKey === "A_SCOPE") return "開発コスト（質問）";
  if (step.stepKey === "B_SCOPE") return "コンサル費用（質問）";
  if (step.stepKey.startsWith("A")) return "開発コスト（質問）";
  if (step.stepKey.startsWith("B")) return "コンサル費用（質問）";
  if (step.stepKey.startsWith("C")) return "開発技術（質問）";
  if (step.stepKey.startsWith("D")) return "ツール内容（質問）";
  if (step.stepKey.startsWith("E")) return "依頼方法（質問）";
  return "質問";
}

interface HomeConciergeFlowProps {
  disabled?: boolean;
  /** チャット入力欄へ分岐メモを追記（APIは呼ばない） */
  onInjectDraft: (draft: string) => void;
  /** 結果画面の段階（入力欄の遅延表示と同期） */
  onFooterPhaseChange?: (phase: HomeConciergeFooterPhase) => void;
  className?: string;
}

export function HomeConciergeFlow({
  disabled = false,
  onInjectDraft,
  onFooterPhaseChange,
  className,
}: HomeConciergeFlowProps) {
  const router = useRouter();
  const { setOpen: setConciergeOpen } = useConciergeChat();
  const reduce = useFramerReducedMotion();
  const [frames, setFrames] = useState<FlowFrame[]>([{ kind: "root" }]);
  /** 押下直後の視覚フィードバック用（フレーム遷移前に「選択済み」を短時間表示） */
  const [pressedChoiceKey, setPressedChoiceKey] = useState<string | null>(null);
  const feedbackTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
        feedbackTimeoutRef.current = null;
      }
    };
  }, []);

  /** チャット内リンク・router 遷移でページを開く直前に呼ぶ（ポップアップ状態は pathname ではリセットされない） */
  const dismissConciergeForNavigation = useCallback(() => {
    suppressNextChatAutoOpen();
    setConciergeOpen(false);
  }, [setConciergeOpen]);

  const current = frames[frames.length - 1];

  useEffect(() => {
    if (current.kind !== "done") {
      onFooterPhaseChange?.("wizard");
    }
  }, [current.kind, onFooterPhaseChange]);

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
    if (id === "root_e") return "E";
    return null;
  };

  const handleRootPick = useCallback(
    (choice: FlowChoice) => {
      const path = [rootSelection(choice)];
      if (choice.id === "root_cde") {
        push({
          kind: "industry_gate",
          rootPath: path,
          pending: { kind: "cde" },
        });
        return;
      }
      const track = trackFromRootId(choice.id);
      if (!track) return;
      if (track === "A") {
        push({
          kind: "industry_gate",
          rootPath: path,
          pending: { kind: "track", track: "A" },
        });
        return;
      }
      if (track === "B") {
        push({
          kind: "industry_gate",
          rootPath: path,
          pending: { kind: "track", track: "B" },
        });
        return;
      }
      push({
        kind: "industry_gate",
        rootPath: path,
        pending: { kind: "track", track: "E" },
      });
    },
    [push]
  );

  const handleIndustryConfirm = useCallback((bundle: ConciergeIndustryBundle) => {
    setFrames((prev) => {
      const top = prev[prev.length - 1];
      if (top.kind !== "industry_gate") return prev;
      const next = commitIndustryGateFrame(bundle, top);
      return [...prev.slice(0, -1), next];
    });
  }, []);

  const handleChoicePick = useCallback(
    (
      frame: Extract<FlowFrame, { kind: "question" }>,
      choice: FlowChoice
    ) => {
      const isOther =
        choice.id.endsWith("_other") ||
        choice.label.includes("その他（自由記述）");
      if (isOther) {
        push({
          kind: "freeform",
          track: frame.track,
          step: frame.step,
          path: frame.path,
          choice,
          industryBundle: frame.industryBundle,
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
      const bundle = frame.industryBundle;
      const next = attachIndustry(
        buildNextFrameAfterAnswer(frame.track, frame.step.stepKey, path),
        bundle
      );
      setFrames((prev) => [...prev.slice(0, -1), next]);
    },
    [push]
  );

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
      const next = attachIndustry(
        buildNextFrameAfterAnswer(top.track, top.step.stepKey, path),
        top.industryBundle
      );
      return [...withoutFree.slice(0, -1), next];
    });
  };

  const handleDetailedEstimate = () => {
    if (current.kind !== "done") return;
    if (current.industryBundle) {
      recordVisitorIndustryBundle(current.industryBundle);
    }
    const ctx = buildEstimateContextPayload(
      current.track,
      current.path,
      current.body,
      current.industryBundle ?? null,
      readVisitorJourneySummary()
    );
    dismissConciergeForNavigation();
    router.push(buildEstimateDetailedEntryUrl(ctx));
  };

  const handleContactSimple = () => {
    if (current.kind !== "done") return;
    if (current.industryBundle) {
      recordVisitorIndustryBundle(current.industryBundle);
    }
    const payload = buildHandoffPayloadV1(
      current.track,
      current.path,
      current.body,
      readVisitorJourneySummary()
    );
    dismissConciergeForNavigation();
    router.push(buildContactHandoffUrl(payload));
  };

  const handleFreeformCta = () => {
    if (current.kind !== "done") return;
    const pathLines = current.path.map(
      (p) =>
        `- ${p.stepTitle}: ${p.freeform ? `${p.label}（${p.freeform}）` : p.label}`
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
    if (current.kind === "industry_gate")
      return `ig-${current.pending.kind}-${
        current.pending.kind === "track" ? current.pending.track : "cde"
      }`;
    if (current.kind === "question")
      return `q-${current.track}-${current.step.stepKey}`;
    if (current.kind === "freeform")
      return `ff-${current.track}-${current.step.stepKey}`;
    return `done-${current.track}-${current.path.length}`;
  }, [current]);

  const [prevFrameKey, setPrevFrameKey] = useState(frameKey);
  if (frameKey !== prevFrameKey) {
    setPrevFrameKey(frameKey);
    setPressedChoiceKey(null);
  }

  const choiceKey = useCallback(
    (choiceId: string) => `${frameKey}-${choiceId}`,
    [frameKey]
  );

  const choiceBusy = pressedChoiceKey !== null;

  const FEEDBACK_DELAY_MS = 100;

  const scheduleRootPick = useCallback(
    (choice: FlowChoice) => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
      setPressedChoiceKey(choiceKey(choice.id));
      feedbackTimeoutRef.current = setTimeout(() => {
        feedbackTimeoutRef.current = null;
        handleRootPick(choice);
      }, FEEDBACK_DELAY_MS);
    },
    [choiceKey, handleRootPick]
  );

  const scheduleChoicePick = useCallback(
    (
      frame: Extract<FlowFrame, { kind: "question" }>,
      choice: FlowChoice
    ) => {
      if (feedbackTimeoutRef.current) {
        clearTimeout(feedbackTimeoutRef.current);
      }
      setPressedChoiceKey(choiceKey(choice.id));
      feedbackTimeoutRef.current = setTimeout(() => {
        feedbackTimeoutRef.current = null;
        handleChoicePick(frame, choice);
      }, FEEDBACK_DELAY_MS);
    },
    [choiceKey, handleChoicePick]
  );

  const motionProps = useMemo(
    () => ({
      initial: reduce ? false : { opacity: 0, y: 10 },
      animate: { opacity: 1, y: 0 },
      exit: reduce ? undefined : { opacity: 0, y: -6 },
      transition: reduce ? { duration: 0 } : { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const },
    }),
    [reduce]
  );

  const doneFrame = current.kind === "done";

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col",
        doneFrame ? "min-h-[min(72dvh,640px)] overflow-hidden md:min-h-0" : "overflow-y-auto",
        className
      )}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={frameKey}
          {...motionProps}
          className={cn(
            "flex min-h-0 flex-1 flex-col p-4",
            doneFrame && "overflow-hidden"
          )}
        >
          {current.kind === "industry_gate" && (
            <ConciergeIndustryStep
              disabled={disabled}
              onBack={pop}
              onConfirm={handleIndustryConfirm}
            />
          )}

          {current.kind === "root" && (
            <div className="space-y-4">
              <h3 className="text-center text-[14px] font-semibold leading-relaxed tracking-wide text-text/95 sm:text-[16px]">
                目的に近いものを選んでください
              </h3>
              <div className="flex flex-col gap-3">
                {ROOT_CHOICES.map((c, idx) => (
                  <ConciergeChoiceButton
                    key={c.id}
                    order={idx + 1}
                    label={c.label}
                    disabled={disabled || choiceBusy}
                    selected={pressedChoiceKey === choiceKey(c.id)}
                    onClick={() => scheduleRootPick(c)}
                  />
                ))}
              </div>
            </div>
          )}

          {current.kind === "question" && (
            <div className="space-y-4">
              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="text-[10px] text-accent underline-offset-2 hover:underline sm:text-xs"
                  onClick={pop}
                >
                  戻る
                </button>
              </div>
              <h3 className="text-[14px] font-semibold leading-relaxed tracking-wide text-text/95 sm:text-[16px]">
                {current.step.question}
              </h3>
              <div
                className={cn(
                  current.step.stepLabel === "Step 3"
                    ? "grid grid-cols-2 gap-2"
                    : "flex flex-col gap-3"
                )}
              >
                {current.step.choices.map((c, idx) => (
                  <ConciergeChoiceButton
                    key={c.id}
                    order={idx + 1}
                    label={c.label}
                    disabled={disabled || choiceBusy}
                    selected={pressedChoiceKey === choiceKey(c.id)}
                    onClick={() => scheduleChoicePick(current, c)}
                  />
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
              choiceLabel={current.choice.label}
            />
          )}

          {current.kind === "done" && (
            <DoneStep
              disabled={disabled}
              track={current.track}
              path={current.path}
              body={current.body}
              onBack={pop}
              onAdjust={restart}
              onDetailedEstimate={handleDetailedEstimate}
              onContactSimple={handleContactSimple}
              onDismissForNavigation={dismissConciergeForNavigation}
              onFooterPhaseChange={onFooterPhaseChange}
              onPasteMemoToInput={handleFreeformCta}
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
  choiceLabel,
}: {
  disabled: boolean;
  onBack: () => void;
  onConfirm: (text: string) => void;
  choiceLabel: string;
}) {
  const [text, setText] = useState("");
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-wide text-text-sub">
          自由記述
        </p>
        <button
          type="button"
          className="text-[10px] text-accent underline-offset-2 hover:underline sm:text-xs"
          onClick={onBack}
        >
          戻る
        </button>
      </div>
      <p className="text-[12px] leading-relaxed text-text/95 sm:text-sm">
        「{choiceLabel}」について、簡単で構いませんのでご記入ください。
      </p>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={disabled}
        rows={4}
        className="resize-none text-[12px] sm:text-sm"
        placeholder="例：〇〇部門の△△業務で、□□を減らしたい"
      />
      <ConciergeCtaButton
        type="button"
        variant="primary"
        disabled={disabled || !text.trim()}
        onClick={() => onConfirm(text)}
      >
        確定して次へ
      </ConciergeCtaButton>
    </div>
  );
}

function doneBodyForDisplay(_track: ConciergeTrack, body: string): string {
  return body.trim();
}

/** 開発コスト／コンサル：金額・一言説明を上に、前提以降を下に */
function splitAbEstimateBody(body: string): {
  headline: string;
  sub: string;
  detail: string;
} {
  const marker = "**前提条件**";
  const idx = body.indexOf(marker);
  if (idx === -1) {
    return { headline: body.trim(), sub: "", detail: "" };
  }
  const head = body.slice(0, idx).trim();
  const detail = body.slice(idx).trim();
  const parts = head.split(/\n\n+/);
  const headline = parts[0] ?? "";
  const sub = parts.slice(1).join("\n\n").trim();
  return { headline, sub, detail };
}

/** C/D/E：ご案内を上、選択は下（参考） */
function splitCdeResultBody(body: string): { intro: string; selection: string } {
  const marker = "**選択した内容**";
  const idx = body.indexOf(marker);
  if (idx === -1) {
    return { intro: body.trim(), selection: "" };
  }
  return {
    intro: body.slice(0, idx).trim(),
    selection: body.slice(idx).trim(),
  };
}

function DoneStep({
  track,
  path,
  body,
  disabled,
  onBack,
  onAdjust,
  onDetailedEstimate,
  onContactSimple,
  onDismissForNavigation,
  onFooterPhaseChange,
  onPasteMemoToInput,
}: {
  track: ConciergeTrack;
  path: FlowSelection[];
  body: string;
  disabled: boolean;
  onBack: () => void;
  onAdjust: () => void;
  onDetailedEstimate: () => void;
  onContactSimple: () => void;
  onDismissForNavigation: () => void;
  onFooterPhaseChange?: (phase: HomeConciergeFooterPhase) => void;
  onPasteMemoToInput: () => void;
}) {
  const router = useRouter();
  const prefsReduced = useReducedMotion();
  const [footerUi, setFooterUi] = useState<"result" | "cta" | "input">("result");

  const demoSlugResolved =
    track === "A" || track === "B"
      ? getDemoSlugForAbTrack(track, path)
      : getDemoSlugForCdeTrack(track, path);

  const displayBody = doneBodyForDisplay(track, body);
  const displayBodyForUi = stripNextStepsSectionForDisplay(displayBody);
  const isAb = track === "A" || track === "B";
  const abParts = isAb ? splitAbEstimateBody(displayBodyForUi) : null;
  const cdeParts = !isAb ? splitCdeResultBody(displayBodyForUi) : null;

  useEffect(() => {
    onFooterPhaseChange?.("done_result");
    setFooterUi("result");
    const t1 = window.setTimeout(() => {
      setFooterUi("cta");
      onFooterPhaseChange?.("done_cta");
    }, DONE_STEP_MS_TO_CTA);
    const t2 = window.setTimeout(() => {
      setFooterUi("input");
      onFooterPhaseChange?.("done_input");
    }, DONE_STEP_MS_TO_CTA + DONE_STEP_MS_CTA_TO_INPUT);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      onFooterPhaseChange?.("wizard");
    };
  }, [displayBody, onFooterPhaseChange]);

  const showNextStepsCard = displayBody.includes(NEXT_STEPS_HEADING);

  const openDemo = () => {
    emitConciergeKpi({
      name: "cta_click",
      href: demoSlugResolved ? experienceHref(demoSlugResolved) : "/demo/list",
      ctaKind: demoSlugResolved ? "experience_prototype" : "demo_list",
      mode: "default",
    });
    onDismissForNavigation();
    if (demoSlugResolved) {
      router.push(experienceHref(demoSlugResolved));
    } else {
      router.push("/demo/list");
    }
  };

  const ctaBase =
    "flex min-h-[3.5rem] w-full flex-col items-center justify-center gap-0.5 rounded-2xl border px-1.5 py-2 text-center text-[9px] font-semibold leading-snug tracking-wide transition-[transform,box-shadow,border-color,background-color] duration-200 sm:min-h-[3.75rem] sm:text-xs";

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex shrink-0 items-center justify-between gap-2 pb-3">
        <p className="text-[10px] font-medium uppercase tracking-wide text-text/90 sm:text-xs">
          結果
        </p>
        <button
          type="button"
          className="text-[10px] text-accent underline-offset-2 hover:underline sm:text-xs"
          onClick={onBack}
        >
          戻る
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pb-4">
        {isAb && abParts ? (
          <div className="rounded-2xl border border-silver/20 bg-base/40 p-4 sm:p-6">
            <p className="text-center text-[16px] font-bold leading-snug text-white sm:text-2xl">
              {parseBoldLine(abParts.headline)}
            </p>
            {abParts.sub ? (
              <p className="mt-3 text-[13px] leading-relaxed text-text/90 sm:text-[16px]">
                {parseBoldLine(abParts.sub)}
              </p>
            ) : null}
            {showNextStepsCard ? (
              <ConciergeNextStepsCard
                track={track}
                path={path}
                disabled={disabled}
                onDismissForNavigation={onDismissForNavigation}
                onDetailedEstimate={onDetailedEstimate}
              />
            ) : null}
            {abParts.detail ? (
              <div className="mt-6 max-h-[min(38vh,320px)] overflow-y-auto border-t border-silver/15 pt-4 text-[12px] leading-relaxed text-text/90 sm:text-sm">
                {abParts.detail.split("\n").map((line, i) => (
                  <p key={`ab-${i}`} className="mb-1.5 last:mb-0">
                    {parseBoldLine(line)}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        ) : cdeParts ? (
          <div className="rounded-2xl border border-silver/20 bg-base/40 p-4 sm:p-6">
            <div className="text-[10px] font-semibold leading-relaxed tracking-wide text-text/95 sm:text-[16px]">
              {cdeParts.intro.split("\n").map((line, i) => (
                <p key={`ci-${i}`} className="mb-2 last:mb-0">
                  {parseBoldLine(line)}
                </p>
              ))}
            </div>
            {showNextStepsCard ? (
              <ConciergeNextStepsCard
                track={track}
                path={path}
                disabled={disabled}
                onDismissForNavigation={onDismissForNavigation}
                onDetailedEstimate={onDetailedEstimate}
              />
            ) : null}
            {cdeParts.selection ? (
              <div className="mt-6 max-h-[min(32vh,280px)] overflow-y-auto border-t border-silver/15 pt-4 text-[10px] leading-relaxed text-text/80 sm:text-sm">
                {cdeParts.selection.split("\n").map((line, i) => (
                  <p key={`cs-${i}`} className="mb-1.5 last:mb-0">
                    {parseBoldLine(line)}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      <AnimatePresence>
        {(footerUi === "cta" || footerUi === "input") && (
          <motion.div
            key="done-footer"
            initial={prefsReduced ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: prefsReduced ? 0 : 0.3 }}
            className="pointer-events-none relative shrink-0"
          >
            <div className="pointer-events-auto space-y-3 bg-gradient-to-t from-base-dark from-35% via-base-dark/96 to-transparent pb-1 pt-6">
                <div className="grid grid-cols-3 gap-2">
                  {(
                    [
                      {
                        key: "demo",
                        label: "参考demo",
                        variant: "secondary" as const,
                        onClick: openDemo,
                      },
                      {
                        key: "est",
                        label: "自動見積もり",
                        variant: "primary" as const,
                        onClick: () => {
                          emitConciergeKpi({
                            name: "cta_click",
                            href: "/estimate-detailed",
                            ctaKind: "estimate_detailed",
                            mode: "default",
                          });
                          onDetailedEstimate();
                        },
                      },
                      {
                        key: "adj",
                        label: CTA_ADJUST_LABEL,
                        variant: "secondary" as const,
                        onClick: () => {
                          emitConciergeKpi({
                            name: "cta_click",
                            ctaKind: "concierge_adjust",
                            mode: "default",
                          });
                          onAdjust();
                        },
                      },
                    ] as const
                  ).map((item, idx) => (
                    <motion.div
                      key={item.key}
                      initial={
                        prefsReduced ? false : { opacity: 0, y: 18 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: prefsReduced ? 0 : idx * 0.12,
                        duration: prefsReduced ? 0 : 0.38,
                        ease: [0.22, 0.99, 0.35, 1],
                      }}
                    >
                      <button
                        type="button"
                        disabled={disabled}
                        onClick={item.onClick}
                        className={cn(
                          ctaBase,
                          item.variant === "primary"
                            ? "border-action/50 bg-action/25 text-white shadow-[0_0_18px_rgba(0,103,192,0.18)] hover:border-action/70 hover:bg-action/35"
                            : "border-white/15 bg-white/[0.06] text-text/95 hover:border-white/25"
                        )}
                      >
                        {item.label}
                      </button>
                    </motion.div>
                  ))}
                </div>
                <p className="flex flex-col items-center gap-2 text-center sm:flex-row sm:justify-center sm:gap-4">
                  <button
                    type="button"
                    disabled={disabled}
                    className="text-[10px] text-accent/90 underline-offset-2 hover:underline sm:text-xs"
                    onClick={() => {
                      emitConciergeKpi({
                        name: "cta_click",
                        href: "/contact",
                        ctaKind: "contact",
                        mode: "default",
                      });
                      onContactSimple();
                    }}
                    >
                    お問い合わせ
                  </button>
                  {footerUi === "input" ? (
                    <button
                      type="button"
                      disabled={disabled}
                      className="text-[10px] text-text-sub underline-offset-2 hover:text-text/90 hover:underline sm:text-xs"
                      onClick={() => {
                        emitConciergeKpi({
                          name: "cta_click",
                          ctaKind: "concierge_freeform",
                          mode: "default",
                        });
                        onPasteMemoToInput();
                      }}
                    >
                      メモを入力欄に貼る
                    </button>
                  ) : null}
                </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
