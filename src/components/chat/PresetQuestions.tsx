"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const PRESET_QUESTIONS = [
  "どんなツールを開発していますか？",
  "導入までの流れを教えてください",
  "事例を見たい",
] as const;

interface PresetQuestionsProps {
  onSelect: (question: string) => void;
  disabled?: boolean;
  className?: string;
}

export function PresetQuestions({
  onSelect,
  disabled = false,
  className,
}: PresetQuestionsProps) {
  return (
    <div className={cn("flex flex-wrap gap-2 p-4", className)}>
      {PRESET_QUESTIONS.map((q) => (
        <Button
          key={q}
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => onSelect(q)}
          className="text-sm"
        >
          {q}
        </Button>
      ))}
    </div>
  );
}
