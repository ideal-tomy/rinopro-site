"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {
  ConciergeChoiceButton,
  ConciergeCtaButton,
  ConciergeCtaLink,
} from "@/components/chat/ConciergeChoiceButton";
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
  CTA_CONTACT_SIMPLE_LABEL,
  CTA_DETAILED_ESTIMATE_LABEL,
  CTA_DEMO_DIRECT_LABEL,
  CTA_FREEFORM_LABEL,
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
import {
  experienceHref,
  getDemoSlugForAbTrack,
  getDemoSlugForCdeTrack,
} from "@/lib/chat/concierge-routing";
import { suppressNextChatAutoOpen } from "@/lib/chat/chat-auto-open";
import { getExperiencePrototypeBySlug } from "@/lib/experience/prototype-registry";
import { useConciergeChat } from "@/components/chat/concierge-chat-context";

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

function stepTitleFor(step: FlowStepDef): string {
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
  className?: string;
}

export function HomeConciergeFlow({
  disabled = false,
  onInjectDraft,
  className,
}: HomeConciergeFlowProps) {
  const router = useRouter();
  const { setOpen: setConciergeOpen } = useConciergeChat();
  const reduce = useReducedMotion();
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

  const handleRootPick = useCallback(
    (choice: FlowChoice) => {
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
    },
    [push]
  );

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
      const next = buildNextFrameAfterAnswer(
        top.track,
        top.step.stepKey,
        path
      );
      return [...withoutFree.slice(0, -1), next];
    });
  };

  const handleDetailedEstimate = () => {
    if (current.kind !== "done") return;
    const ctx = buildEstimateContextPayload(
      current.track,
      current.path,
      current.body
    );
    dismissConciergeForNavigation();
    router.push(buildEstimateDetailedEntryUrl(ctx));
  };

  const handleContactSimple = () => {
    if (current.kind !== "done") return;
    const payload = buildHandoffPayloadV1(
      current.track,
      current.path,
      current.body
    );
    dismissConciergeForNavigation();
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

  useEffect(() => {
    setPressedChoiceKey(null);
  }, [frameKey]);

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

  return (
    <div className={cn("flex min-h-0 flex-1 flex-col overflow-y-auto", className)}>
      <AnimatePresence mode="wait">
        <motion.div key={frameKey} {...motionProps} className="flex-1 p-4">
          {current.kind === "root" && (
            <div className="space-y-4">
              <h3 className="text-center text-base font-semibold leading-relaxed tracking-wide text-text/95">
                まず、知りたいことを選んでください
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
                  className="text-xs text-accent underline-offset-2 hover:underline"
                  onClick={pop}
                >
                  戻る
                </button>
              </div>
              <h3 className="text-base font-semibold leading-relaxed tracking-wide text-text/95">
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
              shortcutIntro={current.shortcut?.intro}
              onBack={pop}
              onAdjust={restart}
              onDetailedEstimate={handleDetailedEstimate}
              onContactSimple={handleContactSimple}
              onFreeform={handleFreeformCta}
              onDismissForNavigation={dismissConciergeForNavigation}
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
          className="text-xs text-accent underline-offset-2 hover:underline"
          onClick={onBack}
        >
          戻る
        </button>
      </div>
      <p className="text-sm leading-relaxed text-text/95">
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

function DoneStep({
  track,
  path,
  body,
  shortcutIntro,
  disabled,
  onBack,
  onAdjust,
  onDetailedEstimate,
  onContactSimple,
  onFreeform,
  onDismissForNavigation,
}: {
  track: ConciergeTrack;
  path: FlowSelection[];
  body: string;
  shortcutIntro?: string;
  disabled: boolean;
  onBack: () => void;
  onAdjust: () => void;
  onDetailedEstimate: () => void;
  onContactSimple: () => void;
  onFreeform: () => void;
  onDismissForNavigation: () => void;
}) {
  const demoSlugResolved =
    track === "A" || track === "B"
      ? getDemoSlugForAbTrack(track, path)
      : getDemoSlugForCdeTrack(track, path);

  const demoMeta = demoSlugResolved
    ? getExperiencePrototypeBySlug(demoSlugResolved)
    : undefined;

  const extraLinks =
    track === "C"
      ? [
          { href: "/services/development", label: "開発スタック" },
          { href: "/demo/list", label: "demo一覧" },
        ]
      : track === "D"
        ? [{ href: "/demo/list", label: "demo一覧" }]
        : [
            { href: "/consulting", label: "コンサル・流れ" },
            { href: "/flow", label: "開発の流れ" },
          ];

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

      {shortcutIntro && (
        <p className="text-sm text-text-sub">{shortcutIntro}</p>
      )}

      {demoSlugResolved && demoMeta && (
        <ConciergeCtaLink
          href={experienceHref(demoSlugResolved)}
          variant="secondary"
          disabled={disabled}
          onClick={() => onDismissForNavigation()}
        >
          {CTA_DEMO_DIRECT_LABEL}（{demoMeta.title}）
        </ConciergeCtaLink>
      )}

      {!demoSlugResolved && (track === "C" || track === "D" || track === "E") && (
        <p className="text-xs text-text-sub">
          選択内容に専用demoが未割当のため、demo一覧から近いものをお選びください。
        </p>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-accent">
        {extraLinks.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className="underline-offset-2 hover:underline"
            onClick={() => onDismissForNavigation()}
          >
            {l.label}
          </Link>
        ))}
      </div>

      <div className="rounded-lg border border-accent/25 bg-accent/5 p-3 text-sm leading-relaxed text-text">
        {parseBoldLine(COMMON_FINISH_BODY)}
      </div>

      <div className="flex flex-col gap-2">
        <ConciergeCtaButton
          type="button"
          variant="primary"
          disabled={disabled}
          onClick={onDetailedEstimate}
        >
          {CTA_DETAILED_ESTIMATE_LABEL}
        </ConciergeCtaButton>
        {demoSlugResolved && demoMeta && (
          <ConciergeCtaLink
            href={experienceHref(demoSlugResolved)}
            variant="secondary"
            disabled={disabled}
            onClick={() => onDismissForNavigation()}
          >
            {CTA_DEMO_DIRECT_LABEL}（{demoMeta.title}）
          </ConciergeCtaLink>
        )}
        <ConciergeCtaButton
          type="button"
          variant="secondary"
          disabled={disabled}
          onClick={onContactSimple}
        >
          {CTA_CONTACT_SIMPLE_LABEL}
        </ConciergeCtaButton>
        <ConciergeCtaButton
          type="button"
          variant="secondary"
          disabled={disabled}
          onClick={onAdjust}
        >
          {CTA_ADJUST_LABEL}
        </ConciergeCtaButton>
        <ConciergeCtaButton
          type="button"
          variant="ghost"
          disabled={disabled}
          onClick={onFreeform}
        >
          {CTA_FREEFORM_LABEL}
        </ConciergeCtaButton>
      </div>
    </div>
  );
}
