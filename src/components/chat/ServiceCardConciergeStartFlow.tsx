"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Variant = "development" | "consulting";

interface ServiceCardConciergeStartFlowProps {
  variant: Variant;
  disabled?: boolean;
  onChoosePreset: (label: string) => void;
  onChooseFreeform: () => void;
}

const DEVELOPMENT_OPTIONS = [
  "開発できるものを知りたい",
  "期間の目安を知りたい",
  "必要な環境・準備を知りたい",
  "技術スタックを知りたい",
  "開発コストの目安を知りたい",
] as const;

const CONSULTING_OPTIONS = [
  "具体的な支援内容を知りたい",
  "実績・進め方を知りたい",
  "期待できる成果を知りたい",
  "費用感を知りたい",
] as const;

export function ServiceCardConciergeStartFlow({
  variant,
  disabled = false,
  onChoosePreset,
  onChooseFreeform,
}: ServiceCardConciergeStartFlowProps) {
  const options =
    variant === "development" ? DEVELOPMENT_OPTIONS : CONSULTING_OPTIONS;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="border-b border-silver/15 px-4 py-3">
        <p className="text-xs font-medium uppercase tracking-wide text-text-sub">
          はじめに
        </p>
        <h3 className="mt-1 text-lg font-semibold text-text">
          どちらから始めますか？
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-text-sub">
          {variant === "development"
            ? "開発に関する質問にお答えします。下記の選択肢の中から選択するか、自由記述を選択し、相談内容を入力してください。※漠然とした記述でも構いません。"
            : "コンサルティングに関する質問にお答えします。下記の選択肢の中から選択するか、自由記述を選択し、相談内容を入力してください。※漠然とした記述でも構いません。"}
        </p>
      </div>
      <div className="space-y-2 p-4">
        {options.map((label) => (
          <Button
            key={label}
            type="button"
            variant="outline"
            disabled={disabled}
            className={cn(
              "h-auto min-h-11 w-full justify-start whitespace-normal border-silver/30 px-3 py-2.5 text-left text-sm leading-snug hover:border-accent/45 hover:bg-accent/5"
            )}
            onClick={() => onChoosePreset(label)}
          >
            {label}
          </Button>
        ))}
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="h-auto min-h-11 w-full justify-start whitespace-normal border-silver/30 px-3 py-2.5 text-left text-sm leading-snug hover:border-accent/45 hover:bg-accent/5"
          onClick={onChooseFreeform}
        >
          自由記述で相談する
        </Button>
      </div>
    </div>
  );
}
