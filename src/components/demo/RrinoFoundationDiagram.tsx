"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Database,
  FileText,
  MessageSquare,
  Brain,
  Mic,
  Search,
} from "lucide-react";
import {
  INDUSTRY_KEYS,
  INDUSTRY_MODULE_MAP,
  type IndustryKey,
} from "@/lib/demo/industry-module-map";
import { useReducedMotion } from "@/hooks/use-reduced-motion";
import { cn } from "@/lib/utils";

const FUNCTION_TAGS = [
  { id: "voice", label: "音声入力", icon: Mic },
  { id: "search", label: "DB検索", icon: Search },
  { id: "summary", label: "要約", icon: FileText },
  { id: "chat", label: "対話", icon: MessageSquare },
] as const;

const INDUSTRY_LABELS: Record<IndustryKey, string> = {
  construction: "建設",
  legal: "士業",
  manufacturing: "製造",
};

interface RrinoFoundationDiagramProps {
  selectedIndustry: IndustryKey | null;
  onIndustryChange: (industry: IndustryKey) => void;
  selectedFunction: string | null;
  onFunctionChange: (fn: string) => void;
}

export function RrinoFoundationDiagram({
  selectedIndustry,
  onIndustryChange,
  selectedFunction,
  onFunctionChange,
}: RrinoFoundationDiagramProps) {
  const prefersReducedMotion = useReducedMotion();
  const diagramRef = useRef<HTMLDivElement>(null);
  const [isAssembled, setIsAssembled] = useState(prefersReducedMotion);

  const { scrollYProgress } = useScroll({
    target: diagramRef,
    offset: ["start end", "center center"],
  });

  const assemblyProgress = useTransform(
    scrollYProgress,
    [0.1, 0.35, 0.5],
    [0, 1, 1]
  );

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsAssembled(true);
      return;
    }
    const unsub = assemblyProgress.on("change", (v) => {
      setIsAssembled(v >= 0.99);
    });
    return () => unsub();
  }, [assemblyProgress, prefersReducedMotion]);

  const industry = selectedIndustry ?? "construction";
  const swapState = INDUSTRY_MODULE_MAP[industry];

  return (
    <div ref={diagramRef} className="w-full">
      {/* 機能タグ（左） */}
      <div className="mb-6 flex flex-wrap justify-center gap-2">
        {FUNCTION_TAGS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => onFunctionChange(id)}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors",
              selectedFunction === id
                ? "border-accent bg-accent/10 text-accent"
                : "border-silver/30 text-muted-foreground hover:border-silver/50"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {/* 業種タグ（右） */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        {INDUSTRY_KEYS.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => onIndustryChange(key)}
            className={cn(
              "rounded-lg border px-4 py-2 text-sm transition-colors",
              selectedIndustry === key
                ? "border-accent bg-accent/10 text-accent"
                : "border-silver/30 text-muted-foreground hover:border-silver/50"
            )}
          >
            {INDUSTRY_LABELS[key]}
          </button>
        ))}
      </div>

      {/* 基盤図：モジュール組み上げ */}
      <div className="relative mx-auto flex min-h-[280px] max-w-lg flex-wrap items-center justify-center gap-4">
        {/* 共通モジュール（Whisper, LLM 等） */}
        <motion.div
          className="flex items-center gap-2 rounded-xl border border-silver/30 bg-base-dark px-4 py-3"
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        >
          <Mic className="h-5 w-5 text-accent" />
          <span className="text-sm">音声認識</span>
        </motion.div>

        {/* DB（業種で差し替え） */}
        <motion.div
          key={swapState.db.id}
          className="flex items-center gap-2 rounded-xl border border-accent/50 bg-accent/5 px-4 py-3"
          initial={prefersReducedMotion ? false : { opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        >
          <Database className="h-5 w-5 text-accent" />
          <div className="text-start">
            <span className="block text-sm font-medium text-foreground">
              {swapState.db.label}
            </span>
            <span className="block text-xs text-muted-foreground">
              {swapState.db.short}
            </span>
          </div>
        </motion.div>

        {/* プロンプト（思考ロジック）（業種で差し替え） */}
        <motion.div
          key={swapState.promptLogic.id}
          className="flex items-center gap-2 rounded-xl border border-accent/50 bg-accent/5 px-4 py-3"
          initial={prefersReducedMotion ? false : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        >
          <Brain className="h-5 w-5 text-accent" />
          <div className="text-start">
            <span className="block text-sm font-medium text-foreground">
              {swapState.promptLogic.label}
            </span>
            <span className="block text-xs text-muted-foreground">
              {swapState.promptLogic.short}
            </span>
          </div>
        </motion.div>

        {/* LLM Wrapper（共通） */}
        <motion.div
          className="flex items-center gap-2 rounded-xl border border-silver/30 bg-base-dark px-4 py-3"
          initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
        >
          <MessageSquare className="h-5 w-5 text-accent" />
          <span className="text-sm">LLM</span>
        </motion.div>
      </div>
    </div>
  );
}
