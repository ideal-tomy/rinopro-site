"use client";

import { ConciergeChoiceButton } from "@/components/chat/ConciergeChoiceButton";
import type { DocumentShellChoiceStep } from "@/lib/experience/document-shell-preset-types";
import { cn } from "@/lib/utils";

export interface DocumentShellChoiceFieldsProps {
  steps: DocumentShellChoiceStep[];
  selections: Record<string, string>;
  onChange: (stepId: string, optionId: string) => void;
  disabled?: boolean;
  className?: string;
}

export function DocumentShellChoiceFields({
  steps,
  selections,
  onChange,
  disabled = false,
  className,
}: DocumentShellChoiceFieldsProps) {
  if (steps.length === 0) return null;

  return (
    <div className={cn("mb-4 space-y-4 border-b border-silver/20 pb-4", className)}>
      {steps.map((step) => (
        <div key={step.id}>
          <h3 className="mb-2 text-xs font-medium text-text-sub md:text-sm">
            {step.title}
            {step.optional ? (
              <span className="ml-1 text-text-sub/80">（任意）</span>
            ) : null}
          </h3>
          <div
            className={cn(
              "grid gap-2",
              step.options.length <= 2 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-2"
            )}
          >
            {step.options.map((opt, oi) => (
              <ConciergeChoiceButton
                key={opt.id}
                type="button"
                order={oi + 1}
                label={opt.label}
                disabled={disabled}
                selected={selections[step.id] === opt.id}
                onClick={() => onChange(step.id, opt.id)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
