"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import type { ExperiencePrototypeMeta } from "@/lib/experience/prototype-registry";
import {
  DISCLAIMER_LINES,
  ESTIMATE_RANGE_LABEL,
  EXCLUDES,
  INCLUDES,
  MVP_ONE_LINER,
  MVP_SCOPE_BULLETS,
  ONBOARDING_DAY_RATE_LABEL,
} from "@/lib/experience/professional-mini-sfa/estimate-anchors";
import { MOCK_CONTACTS } from "@/lib/experience/professional-mini-sfa/mock-contacts";
import {
  DEAL_STAGE_LABEL,
  DEAL_STAGE_ORDER,
  INITIAL_DEALS,
} from "@/lib/experience/professional-mini-sfa/mock-deals";
import type { DealCard, DealStageId } from "@/lib/experience/professional-mini-sfa/types";
import { cn } from "@/lib/utils";

type TabId = "contacts" | "board";

interface ProfessionalMiniSfaExperienceProps {
  meta: ExperiencePrototypeMeta;
  className?: string;
}

export function ProfessionalMiniSfaExperience({
  meta: _meta,
  className,
}: ProfessionalMiniSfaExperienceProps) {
  const [tab, setTab] = useState<TabId>("board");
  const [deals, setDeals] = useState<DealCard[]>(INITIAL_DEALS);
  const [selectedDealId, setSelectedDealId] = useState<string>(INITIAL_DEALS[0]?.id ?? "");

  const selectedDeal = useMemo(
    () => deals.find((d) => d.id === selectedDealId) ?? deals[0],
    [deals, selectedDealId]
  );

  const setStage = (id: string, stage: DealStageId) => {
    setDeals((prev) => prev.map((d) => (d.id === id ? { ...d, stage } : d)));
  };

  return (
    <div className={cn("space-y-8", className)}>
      <p className="text-sm text-text-sub md:text-[16px]">
        士業事務所での「相談の流れ」と「次にやること」を、軽量なSFAイメージでまとめたデモです。操作はブラウザ内のモックのみで、データは保存されません。
      </p>

      <div
        className="flex flex-wrap gap-2 border-b border-silver/20 pb-3"
        role="tablist"
        aria-label="表示切替"
      >
        <button
          type="button"
          role="tab"
          aria-selected={tab === "board"}
          onClick={() => setTab("board")}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition md:text-[16px]",
            tab === "board"
              ? "bg-accent/15 text-accent ring-1 ring-accent/40"
              : "text-text-sub hover:bg-silver/10 hover:text-text"
          )}
        >
          商談ボード
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "contacts"}
          onClick={() => setTab("contacts")}
          className={cn(
            "rounded-lg px-4 py-2 text-sm font-medium transition md:text-[16px]",
            tab === "contacts"
              ? "bg-accent/15 text-accent ring-1 ring-accent/40"
              : "text-text-sub hover:bg-silver/10 hover:text-text"
          )}
        >
          顧客・案件一覧
        </button>
      </div>

      {tab === "contacts" && (
        <div className="overflow-x-auto rounded-xl border border-silver/20">
          <table className="w-full min-w-[640px] text-left text-sm text-text md:text-[16px]">
            <thead className="border-b border-silver/20 bg-base-dark/90 text-text-sub">
              <tr>
                <th className="px-3 py-2 font-medium">組織名</th>
                <th className="px-3 py-2 font-medium">担当者</th>
                <th className="px-3 py-2 font-medium">紹介元</th>
                <th className="px-3 py-2 font-medium">案件種別</th>
                <th className="px-3 py-2 font-medium">最終接触日</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_CONTACTS.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-silver/15 last:border-0 hover:bg-silver/5"
                >
                  <td className="px-3 py-2 text-white/95">{c.organization}</td>
                  <td className="px-3 py-2">{c.contactName}</td>
                  <td className="px-3 py-2">{c.referrer}</td>
                  <td className="px-3 py-2">{c.matterType}</td>
                  <td className="px-3 py-2 text-text-sub">{c.lastTouch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tab === "board" && (
        <div className="space-y-4">
          <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:overflow-visible">
            {DEAL_STAGE_ORDER.map((stage) => {
              const columnDeals = deals.filter((d) => d.stage === stage);
              return (
                <div
                  key={stage}
                  className="flex w-[min(100%,280px)] shrink-0 flex-col rounded-xl border border-silver/25 bg-base-dark/60 md:w-auto"
                >
                  <div className="border-b border-silver/20 px-3 py-2">
                    <p className="text-xs font-semibold text-accent md:text-sm">
                      {DEAL_STAGE_LABEL[stage]}
                    </p>
                    <p className="text-[11px] text-text-sub">{columnDeals.length} 件</p>
                  </div>
                  <ul className="flex max-h-[min(420px,55vh)] flex-col gap-2 overflow-y-auto p-2">
                    {columnDeals.map((d) => (
                      <li key={d.id}>
                        <button
                          type="button"
                          onClick={() => setSelectedDealId(d.id)}
                          className={cn(
                            "w-full rounded-lg border p-3 text-left text-sm transition md:text-[15px]",
                            selectedDealId === d.id
                              ? "border-accent/50 bg-accent/10 ring-1 ring-accent/30"
                              : "border-silver/25 bg-base/80 hover:border-silver/45"
                          )}
                        >
                          <span className="block font-medium text-white/95">{d.title}</span>
                          <span className="mt-1 block text-xs text-text-sub md:text-sm">
                            {d.organization}
                          </span>
                          <span className="mt-2 block text-xs text-text md:text-[13px]">
                            次: {d.nextActionDate}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>

          {selectedDeal ? (
            <div className="rounded-xl border border-silver/25 bg-base-dark/80 p-4 md:p-5">
              <h3 className="text-sm font-semibold text-white md:text-[16px]">
                選択中の相談
              </h3>
              <p className="mt-1 text-lg font-medium text-accent">{selectedDeal.title}</p>
              <p className="mt-2 text-sm text-text md:text-[16px]">{selectedDeal.organization}</p>
              <p className="mt-3 text-sm text-text md:text-[16px]">
                <span className="text-text-sub">次アクション: </span>
                {selectedDeal.nextAction}（{selectedDeal.nextActionDate}）
              </p>
              <p className="mt-2 text-sm text-text-sub md:text-[15px]">{selectedDeal.note}</p>
              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-text-sub md:text-sm">
                  ステージを変更（デモ）
                </p>
                <div className="flex flex-wrap gap-2">
                  {DEAL_STAGE_ORDER.map((st) => (
                    <Button
                      key={st}
                      type="button"
                      variant={selectedDeal.stage === st ? "default" : "outline"}
                      size="sm"
                      className="text-xs md:text-sm"
                      onClick={() => setStage(selectedDeal.id, st)}
                    >
                      {DEAL_STAGE_LABEL[st]}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      <section
        className="space-y-5 rounded-xl border border-silver/30 bg-silver/5 p-4 md:p-6"
        aria-labelledby="mvp-estimate-heading"
      >
        <h2
          id="mvp-estimate-heading"
          className="text-base font-semibold text-white md:text-lg"
        >
          制作イメージと概算レンジ（例示）
        </h2>
        <p className="text-sm text-text md:text-[16px]">{MVP_ONE_LINER}</p>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-text-sub md:text-sm">
            MVP の範囲（目安）
          </p>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-text md:text-[16px]">
            {MVP_SCOPE_BULLETS.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-accent/25 bg-accent/5 px-4 py-3">
          <p className="text-sm font-semibold text-accent md:text-[16px]">
            概算レンジ: {ESTIMATE_RANGE_LABEL}
          </p>
          <p className="mt-2 text-xs text-text-sub md:text-sm">{ONBOARDING_DAY_RATE_LABEL}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <p className="text-xs font-semibold text-emerald-400/90 md:text-sm">含む（例）</p>
            <ul className="mt-2 space-y-1.5 text-sm text-text md:text-[15px]">
              {INCLUDES.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="shrink-0 text-emerald-400/80" aria-hidden>
                    ✓
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="text-xs font-semibold text-amber-400/90 md:text-sm">
              含まない（別途・例）
            </p>
            <ul className="mt-2 space-y-1.5 text-sm text-text md:text-[15px]">
              {EXCLUDES.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="shrink-0 text-amber-400/70" aria-hidden>
                    ×
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="space-y-2 border-t border-silver/20 pt-4 text-xs text-text-sub md:text-sm">
          {DISCLAIMER_LINES.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <p className="text-sm text-text-sub md:text-[16px]">
          ご自身の案件の整理・概算レンジの切り出しは{" "}
          <Link
            href="/estimate-detailed"
            className="text-accent underline-offset-2 hover:underline"
          >
            詳細見積のヒアリング
          </Link>
          からも進められます（任意）。
        </p>
      </section>
    </div>
  );
}
