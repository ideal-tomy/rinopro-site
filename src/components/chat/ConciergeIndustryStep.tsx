"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ConciergeChoiceButton, ConciergeCtaButton } from "@/components/chat/ConciergeChoiceButton";
import { Input } from "@/components/ui/input";
import type { ConciergeIndustryBundle } from "@/lib/chat/estimate-handoff";
import type { ConciergeDomainId } from "@/lib/demo/intelligent-concierge";
import {
  CONCIERGE_DOMAIN_DETAIL_OPTIONS,
  CONCIERGE_DOMAIN_OPTIONS,
} from "@/lib/demo/intelligent-concierge";
import { cn } from "@/lib/utils";

type ConciergeIndustryStepProps = {
  disabled?: boolean;
  onBack?: () => void;
  onConfirm: (bundle: ConciergeIndustryBundle) => void;
  className?: string;
  /** スクロール領域末尾（次へボタンの上）に追加 */
  trailingSlot?: ReactNode;
};

export function ConciergeIndustryStep({
  disabled = false,
  onBack,
  onConfirm,
  className,
  trailingSlot,
}: ConciergeIndustryStepProps) {
  const [domain, setDomain] = useState<ConciergeDomainId | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [note, setNote] = useState("");

  const detailOptions = useMemo(() => {
    if (!domain) return [];
    return CONCIERGE_DOMAIN_DETAIL_OPTIONS[domain] ?? [];
  }, [domain]);

  const canSubmit = domain != null;

  const handleConfirm = () => {
    if (!domain || disabled) return;
    onConfirm({
      domainId: domain,
      domainDetailId: detailId ?? undefined,
      note: note.trim() || undefined,
    });
  };

  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col",
        className
      )}
    >
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto pb-2">
        {onBack ? (
          <div className="flex items-center justify-end">
            <button
              type="button"
              className="text-[10px] text-accent underline-offset-2 hover:underline sm:text-xs"
              onClick={onBack}
            >
              戻る
            </button>
          </div>
        ) : null}

        <h3 className="text-[14px] font-semibold leading-relaxed tracking-wide text-text/95 sm:text-[16px]">
          事業領域に近いものを選んでください
        </h3>

        <div className="grid grid-cols-2 gap-2">
          {CONCIERGE_DOMAIN_OPTIONS.map((opt, idx) => (
            <ConciergeChoiceButton
              key={opt.id}
              type="button"
              order={idx + 1}
              label={opt.label}
              labelDensity="compact"
              disabled={disabled}
              selected={domain === opt.id}
              onClick={() => {
                setDomain(opt.id);
                setDetailId(null);
              }}
            />
          ))}
        </div>

        {detailOptions.length > 0 ? (
          <details className="rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
            <summary className="cursor-pointer text-[12px] font-medium text-text/95 sm:text-sm">
              詳しく選ぶ（任意）
            </summary>
            <div className="mt-2 flex flex-col gap-2 pb-1">
              {detailOptions.map((opt, idx) => (
                <ConciergeChoiceButton
                  key={opt.id}
                  type="button"
                  order={idx + 1}
                  label={opt.label}
                  disabled={disabled || !domain}
                  selected={detailId === opt.id}
                  onClick={() => setDetailId(opt.id)}
                />
              ))}
            </div>
          </details>
        ) : null}

        <div className="space-y-1.5">
          <label
            htmlFor="concierge-industry-note"
            className="block text-[11px] font-medium text-text-sub sm:text-xs"
          >
            補足（任意・1行）
          </label>
          <Input
            id="concierge-industry-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={disabled}
            placeholder="例: 清掃・ビルメン、スリランカ人材の派遣"
            className="border-white/15 bg-white/[0.06] text-[16px] text-text placeholder:text-text-sub sm:text-sm"
          />
        </div>

        {trailingSlot ? <div className="pt-1">{trailingSlot}</div> : null}
      </div>

      <div className="sticky bottom-0 z-10 shrink-0 border-t border-white/10 bg-base/90 py-3 backdrop-blur-md">
        <ConciergeCtaButton
          type="button"
          variant="primary"
          disabled={disabled || !canSubmit}
          onClick={handleConfirm}
          className="w-full"
        >
          次へ
        </ConciergeCtaButton>
      </div>
    </div>
  );
}
