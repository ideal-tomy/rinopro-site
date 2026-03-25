"use client";

import { ConciergeChoiceButton } from "@/components/chat/ConciergeChoiceButton";
import { cn } from "@/lib/utils";
import type { ServicesFlowPick } from "@/lib/chat/chat-auto-open";

export interface ServicesConciergeFlowProps {
  disabled?: boolean;
  className?: string;
  onPickService: (mode: ServicesFlowPick) => void;
}

export function ServicesConciergeFlow({
  disabled = false,
  className,
  onPickService,
}: ServicesConciergeFlowProps) {
  return (
    <div className={cn("flex min-h-0 flex-1 flex-col overflow-y-auto", className)}>
      <div className="flex-1 space-y-4 p-4">
        <h3 className="text-center text-[16px] font-semibold leading-relaxed tracking-wide text-text/95">
          どのサービスについて知りたいですか？
        </h3>
        <div className="flex flex-col gap-3">
          <ConciergeChoiceButton
            type="button"
            order={1}
            label="開発"
            disabled={disabled}
            onClick={() => onPickService("development")}
          />
          <ConciergeChoiceButton
            type="button"
            order={2}
            label="コンサルティング"
            disabled={disabled}
            onClick={() => onPickService("consulting")}
          />
        </div>
      </div>
    </div>
  );
}
