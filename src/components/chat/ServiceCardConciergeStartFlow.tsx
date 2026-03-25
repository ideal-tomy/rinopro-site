"use client";

import { ConciergeChoiceButton } from "@/components/chat/ConciergeChoiceButton";
import {
  CONSULTING_PRESET_LABELS,
  DEVELOPMENT_PRESET_LABELS,
} from "@/lib/chat/service-card-preset-content";

type Variant = "development" | "consulting";

interface ServiceCardConciergeStartFlowProps {
  variant: Variant;
  disabled?: boolean;
  onChoosePreset: (label: string) => void;
  onChooseFreeform: () => void;
}

export function ServiceCardConciergeStartFlow({
  variant,
  disabled = false,
  onChoosePreset,
  onChooseFreeform,
}: ServiceCardConciergeStartFlowProps) {
  const options =
    variant === "development"
      ? DEVELOPMENT_PRESET_LABELS
      : CONSULTING_PRESET_LABELS;

  const freeformOrder = options.length + 1;

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <div className="space-y-4 p-4">
        <h3 className="text-center text-[16px] font-semibold leading-relaxed tracking-wide text-text/95">
          どちらから始めますか？
        </h3>
        <div className="flex flex-col gap-3">
          {options.map((label, idx) => (
            <ConciergeChoiceButton
              key={label}
              type="button"
              order={idx + 1}
              label={label}
              disabled={disabled}
              onClick={() => onChoosePreset(label)}
            />
          ))}
          <ConciergeChoiceButton
            type="button"
            order={freeformOrder}
            label="自由記述で相談する"
            disabled={disabled}
            onClick={onChooseFreeform}
          />
        </div>
      </div>
    </div>
  );
}
