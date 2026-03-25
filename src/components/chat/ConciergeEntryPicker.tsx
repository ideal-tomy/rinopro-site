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
      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-text-sub">
        はじめに
      </p>
      <h3 className="mb-1 text-base font-semibold text-text">
        どちらから始めますか？
      </h3>
      <p className="mb-5 text-sm leading-relaxed text-text-sub">
        いま見ているページに寄せた案内と、サイト全体の選択式ガイド（費用の目安・進め方・demo
        への導線）を分けています。営業ではなく、整理・確認のための入口です。
      </p>

      <div className="flex flex-col gap-3">
        <ConciergeChoiceButton
          type="button"
          order={1}
          label="このページについて"
          description="いまのページの内容に沿って補足します（サービスページでは開発／コンサルを選べます）。"
          icon={<LayoutTemplate className="h-4 w-4" aria-hidden />}
          disabled={disabled}
          className="min-h-[4.25rem]"
          onClick={() => onChoose("page")}
        />

        <ConciergeChoiceButton
          type="button"
          order={2}
          label="サイト全体のガイド"
          description="トップページと同じ分岐（開発コスト・コンサル費用・技術・demo など）から、目安と次の一歩を選べます。"
          icon={<Globe className="h-4 w-4" aria-hidden />}
          disabled={disabled}
          className="min-h-[4.25rem]"
          onClick={() => onChoose("global")}
        />
      </div>
    </div>
  );
}
