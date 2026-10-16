"use client";

import { ConciergeChoiceButton } from "@/components/chat/ConciergeChoiceButton";
import { cn } from "@/lib/utils";
import { Globe, LayoutTemplate } from "lucide-react";

export type ConciergeEntryChoice = "page" | "global";

interface ConciergeEntryPickerProps {
  disabled?: boolean;
  className?: string;
  onChoose: (choice: ConciergeEntryChoice) => void;
}

/**
 * FAB 初回: ページ文脈の案内 vs トップと同じ全体ガイド
 */
export function ConciergeEntryPicker({
  disabled = false,
  className,
  onChoose,
}: ConciergeEntryPickerProps) {
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col overflow-y-auto p-4",
        className
      )}
    >
      <div className="mb-4 flex flex-col gap-3">
        <ConciergeChoiceButton
          type="button"
          order={1}
          label="このページについて"
          description="このページに沿った案内"
          icon={<LayoutTemplate className="h-4 w-4" aria-hidden />}
          disabled={disabled}
          className="min-h-[4.25rem]"
          onClick={() => onChoose("page")}
        />

        <ConciergeChoiceButton
          type="button"
          order={2}
          label="サイト全体のガイド"
          description="費用・期間・demo 導線の選択式ガイド"
          icon={<Globe className="h-4 w-4" aria-hidden />}
          disabled={disabled}
          className="min-h-[4.25rem]"
          onClick={() => onChoose("global")}
        />
      </div>
    </div>
  );
}
