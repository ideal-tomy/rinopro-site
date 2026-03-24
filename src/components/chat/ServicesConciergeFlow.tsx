"use client";

import { Button } from "@/components/ui/button";
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
      <div className="border-b border-silver/15 px-4 py-2">
        <p className="text-xs font-medium uppercase tracking-wide text-text-sub">
          サービス案内
        </p>
        <p className="text-sm text-text-sub">
          知りたい内容を選ぶと、下の入力欄から自由に深掘りできます。必要になったときだけ関連ページも案内します。
        </p>
      </div>

      <div className="flex-1 space-y-4 p-4">
        <p className="text-center text-xs font-medium uppercase tracking-wide text-text-sub">
          Step 1
        </p>
        <h3 className="text-center text-base font-semibold text-accent">
          どのサービスについて知りたいですか？
        </h3>
        <p className="text-center text-sm text-text-sub">Step 2</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className="h-auto min-h-11 justify-center whitespace-normal px-3 py-2.5 text-sm leading-snug"
            onClick={() => onPickService("development")}
          >
            開発
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={disabled}
            className="h-auto min-h-11 justify-center whitespace-normal px-3 py-2.5 text-sm leading-snug"
            onClick={() => onPickService("consulting")}
          >
            コンサルティング
          </Button>
        </div>
      </div>
    </div>
  );
}
