"use client";

import { Button } from "@/components/ui/button";
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
        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="h-auto min-h-[4.25rem] flex-col items-stretch gap-1.5 whitespace-normal border-silver/30 px-4 py-3 text-left hover:border-accent/45 hover:bg-accent/5"
          onClick={() => onChoose("page")}
        >
          <span className="flex w-full items-center gap-2 font-semibold text-text">
            <LayoutTemplate
              className="h-4 w-4 shrink-0 text-accent"
              aria-hidden
            />
            このページについて
          </span>
          <span className="pl-6 text-xs font-normal leading-snug text-text-sub">
            いまのページの内容に沿って補足します（サービスページでは開発／コンサルを選べます）。
          </span>
        </Button>

        <Button
          type="button"
          variant="outline"
          disabled={disabled}
          className="h-auto min-h-[4.25rem] flex-col items-stretch gap-1.5 whitespace-normal border-silver/30 px-4 py-3 text-left hover:border-accent/45 hover:bg-accent/5"
          onClick={() => onChoose("global")}
        >
          <span className="flex w-full items-center gap-2 font-semibold text-text">
            <Globe className="h-4 w-4 shrink-0 text-accent" aria-hidden />
            サイト全体のガイド
          </span>
          <span className="pl-6 text-xs font-normal leading-snug text-text-sub">
            トップページと同じ分岐（開発コスト・コンサル費用・技術・demo
            など）から、目安と次の一歩を選べます。
          </span>
        </Button>
      </div>
    </div>
  );
}
