"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FreeformChatPanelProps {
  contextLine: string;
  onSubmit: (text: string) => void;
  onBack: () => void;
  className?: string;
}

export function FreeformChatPanel({
  contextLine,
  onSubmit,
  onBack,
  className,
}: FreeformChatPanelProps) {
  const [text, setText] = useState("");

  return (
    <div
      className={cn(
        "rounded-2xl border border-silver/25 bg-base-dark/95 p-5 shadow-xl md:p-7",
        className
      )}
    >
      <p className="mb-1 text-xs text-text-sub">自由入力</p>
      <h2 className="mb-3 text-base font-semibold text-accent md:text-lg">
        内容を具体的に書いてください
      </h2>
      <p className="mb-4 rounded-lg border border-silver/15 bg-silver/5 p-2 text-xs leading-relaxed text-text-sub">
        選択済み: {contextLine}
      </p>
      <p className="mb-2 text-xs text-text-sub">
        これまでの選択とあわせて、登録ナレッジの範囲で回答します。
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="例: 足場の点検記録の保存年数は？"
          className="text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              const t = text.trim();
              if (t) onSubmit(t);
            }
          }}
        />
        <Button
          type="button"
          className="shrink-0"
          onClick={() => {
            const t = text.trim();
            if (t) onSubmit(t);
          }}
        >
          送信
        </Button>
      </div>
      <div className="mt-5">
        <Button type="button" variant="ghost" size="sm" onClick={onBack}>
          戻る
        </Button>
      </div>
    </div>
  );
}
