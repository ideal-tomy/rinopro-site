"use client";

import { useEffect, useState } from "react";
import { ConciergeChoiceButton } from "@/components/chat/ConciergeChoiceButton";
import {
  CON_STEP1_DEFS,
  DEV_STEP1_DEFS,
  getStep2Labels,
  type ServicePresetVariant,
} from "@/lib/chat/service-card-preset-content";

interface ServiceCardConciergeStartFlowProps {
  variant: ServicePresetVariant;
  disabled?: boolean;
  onChoosePreset: (label: string) => void;
  onChooseFreeform: () => void;
  /** インクリメントで内部状態を step1 にリセット */
  resetKey?: number;
}

export function ServiceCardConciergeStartFlow({
  variant,
  disabled = false,
  onChoosePreset,
  onChooseFreeform,
  resetKey,
}: ServiceCardConciergeStartFlowProps) {
  const [phase, setPhase] = useState<"step1" | "step2">("step1");
  const [step1Key, setStep1Key] = useState<string | null>(null);

  useEffect(() => {
    setPhase("step1");
    setStep1Key(null);
  }, [resetKey]);

  const step1Defs = variant === "development" ? DEV_STEP1_DEFS : CON_STEP1_DEFS;

  if (phase === "step2" && step1Key) {
    const step2Labels = getStep2Labels(variant, step1Key);
    const step1Label = step1Defs.find((d) => d.key === step1Key)?.label ?? "";

    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="space-y-4 p-4">
          <button
            type="button"
            className="flex items-center gap-1 text-xs text-text/55 transition-colors hover:text-text/90"
            onClick={() => setPhase("step1")}
          >
            ← {step1Label}
          </button>
          <div className="flex flex-col gap-3">
            {step2Labels.map((label, idx) => (
              <ConciergeChoiceButton
                key={label}
                type="button"
                order={idx + 1}
                label={label}
                disabled={disabled}
                onClick={() => onChoosePreset(label)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="space-y-4 p-4">
        <div className="flex flex-col gap-3">
          {step1Defs.map((def, idx) => (
            <ConciergeChoiceButton
              key={def.key}
              type="button"
              order={idx + 1}
              label={def.label}
              disabled={disabled}
              onClick={() => {
                setStep1Key(def.key);
                setPhase("step2");
              }}
            />
          ))}
          <ConciergeChoiceButton
            type="button"
            order={step1Defs.length + 1}
            label="自由記述で相談する"
            disabled={disabled}
            onClick={onChooseFreeform}
          />
        </div>
      </div>
    </div>
  );
}
