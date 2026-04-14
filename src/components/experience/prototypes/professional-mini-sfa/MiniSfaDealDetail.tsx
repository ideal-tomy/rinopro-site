"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  CONFLICT_CHECK_STATUS_OPTIONS,
  DEAL_STAGE_LABEL,
  DEAL_STAGE_ORDER,
} from "@/lib/experience/professional-mini-sfa/constants";
import type { DealCard, DealStageId } from "@/lib/experience/professional-mini-sfa/types";

interface MiniSfaDealDetailProps {
  deal: DealCard | null;
  onMoveStage: (dealId: string, stage: DealStageId) => void;
  onUpdateDeal: (dealId: string, patch: Partial<DealCard>) => void;
}

export function MiniSfaDealDetail({
  deal,
  onMoveStage,
  onUpdateDeal,
}: MiniSfaDealDetailProps) {
  const [nextAction, setNextAction] = useState(deal?.nextAction ?? "");
  const [nextActionDate, setNextActionDate] = useState(deal?.nextActionDate ?? "");
  const [note, setNote] = useState(deal?.note ?? "");

  if (!deal) {
    return (
      <div className="rounded-xl border border-silver/20 bg-base-dark/50 p-4 text-sm text-text-sub">
        相談を選択すると、ここに詳細が表示されます。
      </div>
    );
  }

  const saveActionFields = () => {
    if (!nextAction.trim() || !nextActionDate) return;

    onUpdateDeal(deal.id, {
      nextAction: nextAction.trim(),
      nextActionDate,
      note: note.trim() || undefined,
      lastContactAt: new Date().toISOString().slice(0, 10),
    });
  };

  return (
    <div className="space-y-4 rounded-xl border border-silver/25 bg-base-dark/80 p-3 md:p-5">
      <div>
        <h3 className="text-xs font-semibold text-white md:text-[16px]">
          選択中の相談
        </h3>
        <p className="mt-1 text-[15px] font-medium text-accent md:text-lg">
          {deal.title}
        </p>
        <p className="mt-1 text-xs text-text md:text-[16px]">{deal.clientName}</p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-[11px] font-medium text-text-sub md:text-sm">担当者</p>
          <p className="mt-1 text-xs text-text md:text-[15px]">{deal.assignee}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-text-sub md:text-sm">紹介元</p>
          <p className="mt-1 text-xs text-text md:text-[15px]">{deal.referrer}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-text-sub md:text-sm">流入経路</p>
          <p className="mt-1 text-xs text-text md:text-[15px]">{deal.inquiryChannel}</p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-text-sub md:text-sm">案件種別</p>
          <p className="mt-1 text-xs text-text md:text-[15px]">{deal.practiceArea}</p>
        </div>
      </div>

      <div>
        <p className="text-[11px] font-medium text-text-sub md:text-sm">相談概要</p>
        <p className="mt-1 text-xs leading-relaxed text-text md:text-[15px]">
          {deal.summary}
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-[11px] font-medium text-text-sub md:text-sm">
            次アクション
          </span>
          <Input value={nextAction} onChange={(event) => setNextAction(event.target.value)} />
        </label>
        <label className="space-y-1.5">
          <span className="text-[11px] font-medium text-text-sub md:text-sm">
            次回アクション日
          </span>
          <Input
            type="date"
            value={nextActionDate}
            onChange={(event) => setNextActionDate(event.target.value)}
          />
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className="text-[11px] font-medium text-text-sub md:text-sm">申し送り</span>
        <Textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className="min-h-[88px] md:min-h-[110px]"
        />
      </label>

      <div className="grid gap-3 md:grid-cols-2">
        <div>
          <p className="text-[11px] font-medium text-text-sub md:text-sm">
            利益相反確認
          </p>
          <p className="mt-1 text-xs text-text md:text-[15px]">
            {deal.conflictCheckStatus ?? "未設定"}
          </p>
        </div>
        <div>
          <p className="text-[11px] font-medium text-text-sub md:text-sm">費用レンジメモ</p>
          <p className="mt-1 text-xs text-text md:text-[15px]">
            {deal.estimatedValueLabel ?? "未設定"}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          size="sm"
          onClick={saveActionFields}
          disabled={!nextAction.trim() || !nextActionDate}
        >
          次アクションを保存
        </Button>
        {CONFLICT_CHECK_STATUS_OPTIONS.map((status) => (
          <button
            key={status}
            type="button"
            onClick={() =>
              onUpdateDeal(deal.id, {
                conflictCheckStatus: status,
                lastContactAt: new Date().toISOString().slice(0, 10),
              })
            }
            className={`rounded-full border px-3 py-1 text-[11px] transition md:text-xs ${
              deal.conflictCheckStatus === status
                ? "border-accent/45 bg-accent/15 text-accent"
                : "border-silver/30 text-text-sub hover:border-silver/50 hover:text-text"
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      <div>
        <p className="mb-2 text-[11px] font-medium text-text-sub md:text-sm">
          ステージを変更
        </p>
        <div className="flex flex-wrap gap-2">
          {DEAL_STAGE_ORDER.map((stage) => (
            <Button
              key={stage}
              type="button"
              variant={deal.stage === stage ? "default" : "outline"}
              size="sm"
              className="text-xs md:text-sm"
              onClick={() => onMoveStage(deal.id, stage)}
            >
              {DEAL_STAGE_LABEL[stage]}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
