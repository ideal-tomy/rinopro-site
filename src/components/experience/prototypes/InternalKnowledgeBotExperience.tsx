"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import type { ExperiencePrototypeMeta } from "@/lib/experience/prototype-registry";
import type { GuidedChoice } from "@/lib/experience/internal-knowledge/types";
import {
  getInternalKnowledgeDataset,
  getKbChunksForRequest,
  listInternalKnowledgeIndustries,
} from "@/lib/experience/internal-knowledge";
import { streamKnowledgeBotResponse } from "@/lib/experience/internal-knowledge/stream-client";
import { WizardOverlay } from "@/components/experience/prototypes/wizard/WizardOverlay";
import { IndustryPicker } from "@/components/experience/prototypes/wizard/IndustryPicker";
import { GuidedStepPanel } from "@/components/experience/prototypes/wizard/GuidedStepPanel";
import { FreeformChatPanel } from "@/components/experience/prototypes/wizard/FreeformChatPanel";
import {
  KnowledgeAnswerCard,
  type CitationLine,
} from "@/components/experience/prototypes/wizard/KnowledgeAnswerCard";
import { LoadingPanel } from "@/components/experience/prototypes/wizard/LoadingPanel";
import { cn } from "@/lib/utils";

type WizardPhase =
  | "pickIndustry"
  | "guidedStep"
  | "freeformChat"
  | "loading"
  | "showAnswer";

interface InternalKnowledgeBotExperienceProps {
  meta: ExperiencePrototypeMeta;
  className?: string;
}

function toCitationLines(
  dataset: NonNullable<ReturnType<typeof getInternalKnowledgeDataset>>,
  kbRefIds: string[]
): CitationLine[] {
  const chunks = getKbChunksForRequest(dataset, kbRefIds);
  return chunks.map((k) => ({
    id: k.id,
    title: k.title,
    section: k.section,
    excerpt:
      k.body.length > 220 ? `${k.body.slice(0, 220)}…` : k.body,
  }));
}

export function InternalKnowledgeBotExperience({
  meta,
  className,
}: InternalKnowledgeBotExperienceProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();

  const industryList = useMemo(() => listInternalKnowledgeIndustries(), []);

  const [phase, setPhase] = useState<WizardPhase>("pickIndustry");
  const [industryId, setIndustryId] = useState<string | null>(null);
  const [pathLabels, setPathLabels] = useState<string[]>([]);
  const [stack, setStack] = useState<string[]>([]);
  const [streamPreview, setStreamPreview] = useState("");
  const [answerBody, setAnswerBody] = useState("");
  const [citations, setCitations] = useState<CitationLine[]>([]);
  const [policyLine, setPolicyLine] = useState("");
  const dataset = industryId ? getInternalKnowledgeDataset(industryId) : undefined;

  const applyIndustryFromQuery = useCallback(() => {
    const q = searchParams.get("industry");
    if (!q) return;
    const d = getInternalKnowledgeDataset(q);
    if (!d) return;
    setIndustryId(q);
    setPathLabels([d.label]);
    setStack([d.guidedRootId]);
    setPhase("guidedStep");
  }, [searchParams]);

  useEffect(() => {
    applyIndustryFromQuery();
  }, [applyIndustryFromQuery]);

  const setIndustryInUrl = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id) params.set("industry", id);
      else params.delete("industry");
      const q = params.toString();
      router.replace(q ? `${pathname}?${q}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const resetToPickIndustry = useCallback(() => {
    setIndustryId(null);
    setPathLabels([]);
    setStack([]);
    setAnswerBody("");
    setCitations([]);
    setStreamPreview("");
    setPhase("pickIndustry");
    setIndustryInUrl(null);
  }, [setIndustryInUrl]);

  const startIndustry = useCallback(
    (id: string) => {
      const d = getInternalKnowledgeDataset(id);
      if (!d) return;
      setIndustryId(id);
      setPathLabels([d.label]);
      setStack([d.guidedRootId]);
      setPhase("guidedStep");
      setIndustryInUrl(id);
    },
    [setIndustryInUrl]
  );

  const runAi = useCallback(
    async (
      kbRefIds: string[],
      labels: string[],
      freeformText?: string
    ) => {
      if (!industryId) return;
      setPhase("loading");
      setStreamPreview("");
      setAnswerBody("");
      const ac = new AbortController();
      const timeoutMs = 45000;
      const timer = window.setTimeout(() => ac.abort(), timeoutMs);
      try {
        const text = await streamKnowledgeBotResponse(
          {
            industryId,
            pathLabels: labels,
            kbRefIds,
            freeformText,
          },
          (acc) => setStreamPreview(acc),
          { signal: ac.signal }
        );
        window.clearTimeout(timer);
        const d = getInternalKnowledgeDataset(industryId);
        if (d) {
          const idsForCite =
            kbRefIds.length > 0 ? kbRefIds : d.kb.map((k) => k.id);
          setCitations(toCitationLines(d, idsForCite));
          setPolicyLine(d.policyDescription);
        }
        setAnswerBody(text);
        setPhase("showAnswer");
      } catch (e) {
        window.clearTimeout(timer);
        const msg =
          e instanceof Error
            ? e.name === "AbortError"
              ? "時間がかかりすぎたため中断しました。もう一度お試しください。"
              : e.message
            : "エラーが発生しました";
        setAnswerBody(msg);
        const d = getInternalKnowledgeDataset(industryId);
        if (d) {
          const idsForCite =
            kbRefIds.length > 0 ? kbRefIds : d.kb.map((k) => k.id);
          setCitations(toCitationLines(d, idsForCite));
          setPolicyLine(d.policyDescription);
        }
        setPhase("showAnswer");
      }
    },
    [industryId]
  );

  const currentNodeId = stack[stack.length - 1];
  const currentNode =
    dataset && currentNodeId ? dataset.guidedNodes[currentNodeId] : undefined;

  const handleGuidedChoice = (choice: GuidedChoice) => {
    if (!dataset) return;
    const nextLabels = [...pathLabels, choice.label];

    if (choice.freeform) {
      setPathLabels(nextLabels);
      setPhase("freeformChat");
      return;
    }

    if (choice.kbRefIds && choice.kbRefIds.length > 0) {
      void runAi(choice.kbRefIds, nextLabels);
      return;
    }

    if (choice.nextNodeId) {
      setPathLabels(nextLabels);
      setStack((s) => [...s, choice.nextNodeId!]);
    }
  };

  const handleGuidedBack = () => {
    if (!dataset) return;
    if (stack.length <= 1) {
      resetToPickIndustry();
      return;
    }
    setStack((s) => s.slice(0, -1));
    setPathLabels((p) => p.slice(0, -1));
  };

  const handleFreeformBack = () => {
    setPathLabels((p) => (p.length > 1 ? p.slice(0, -1) : p));
    setPhase("guidedStep");
  };

  const handleFreeformSubmit = (text: string) => {
    void runAi([], pathLabels, text);
  };

  const handleAnotherQuestion = () => {
    if (!dataset) return;
    setPathLabels([dataset.label]);
    setStack([dataset.guidedRootId]);
    setAnswerBody("");
    setCitations([]);
    setPhase("guidedStep");
  };

  const breadcrumbTrail =
    pathLabels.length > 0 ? pathLabels.join(" › ") : "";

  const phaseKey =
    phase === "guidedStep" && currentNode
      ? `guided-${currentNode.id}`
      : phase;

  return (
    <div className={cn("space-y-4", className)}>
      <p className="text-xs text-text-sub md:text-sm">
        登録済みの社内ナレッジのみを根拠に、Gemini
        が回答します。流れに沿って選ぶか、「その他」から自由入力できます。
      </p>

      <WizardOverlay phaseKey={phaseKey}>
        {phase === "pickIndustry" && (
          <IndustryPicker
            items={industryList}
            onSelect={(id) => startIndustry(id)}
          />
        )}

        {phase === "guidedStep" && dataset && currentNode && (
          <motion.div
            key={currentNode.id}
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.28 }}
          >
            <GuidedStepPanel
              breadcrumbTrail={breadcrumbTrail}
              prompt={currentNode.prompt}
              choices={currentNode.choices}
              onChoice={handleGuidedChoice}
              onBack={handleGuidedBack}
            />
          </motion.div>
        )}

        {phase === "freeformChat" && (
          <FreeformChatPanel
            contextLine={breadcrumbTrail}
            onSubmit={handleFreeformSubmit}
            onBack={handleFreeformBack}
          />
        )}

        {phase === "loading" && (
          <LoadingPanel streamingText={streamPreview} />
        )}

        {phase === "showAnswer" && (
          <KnowledgeAnswerCard
            body={answerBody}
            citations={citations}
            policyLine={policyLine}
            onAnotherQuestion={handleAnotherQuestion}
            onChangeIndustry={resetToPickIndustry}
          />
        )}
      </WizardOverlay>

      <p className="text-xs text-text-sub">
        ツールdemo（文章カタログ）は{" "}
        <Link
          href={`/demo/${meta.demoSlug}`}
          className="text-accent underline-offset-2 hover:underline"
        >
          こちら
        </Link>
        。
      </p>
    </div>
  );
}
