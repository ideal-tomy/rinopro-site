"use client";

import { useCallback, useEffect, useId, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { ExperiencePrototypeMeta } from "@/lib/experience/prototype-registry";
import {
  buildReceiptExpenseMock,
  FIELD_HINTS,
  RECEIPT_HIGHLIGHT_REGIONS,
  RECEIPT_HINT_DEFAULT,
  type ReceiptFieldId,
} from "@/lib/experience/receipt-expense-mock";
import { cn } from "@/lib/utils";

interface ReceiptPhotoExpenseExperienceProps {
  meta: ExperiencePrototypeMeta;
  className?: string;
}

const SAMPLES = ["出張タクシー 領収書のみ", "飲食費 4名 会議後"] as const;

function ReceiptImageStage({
  previewUrl,
  selectedFieldId,
}: {
  previewUrl: string | null;
  selectedFieldId: ReceiptFieldId | null;
}) {
  const region = selectedFieldId
    ? RECEIPT_HIGHLIGHT_REGIONS[selectedFieldId]
    : null;

  return (
    <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg border border-silver/20 bg-silver/10">
      {previewUrl ? (
        <>
          {/* blob URL のため next/image は使わず img（LCP 対象外のプロトタイプ） */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="アップロードした領収書のプレビュー"
            className="h-full w-full object-contain object-top"
          />
          {region && (
            <div
              className="pointer-events-none absolute rounded-sm border-2 border-accent bg-accent/20 shadow-[0_0_0_1px_rgba(0,0,0,0.2)] ring-2 ring-accent/50"
              style={{
                top: `${region.topPct}%`,
                left: `${region.leftPct}%`,
                width: `${region.widthPct}%`,
                height: `${region.heightPct}%`,
              }}
              aria-hidden
            />
          )}
        </>
      ) : (
        <>
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center text-sm text-text-sub"
            aria-hidden
          >
            <span className="font-medium text-text">領収書プレースホルダ</span>
            <span className="text-xs leading-relaxed">
              画像未設定でも実行できます。下の抽出項目を選ぶと、ここに擬似ハイライトが表示されます。
            </span>
          </div>
          {region && (
            <div
              className="pointer-events-none absolute rounded-sm border-2 border-accent bg-accent/25 ring-2 ring-accent/50"
              style={{
                top: `${region.topPct}%`,
                left: `${region.leftPct}%`,
                width: `${region.widthPct}%`,
                height: `${region.heightPct}%`,
              }}
              aria-hidden
            />
          )}
        </>
      )}
    </div>
  );
}

export function ReceiptPhotoExpenseExperience({
  meta,
  className,
}: ReceiptPhotoExpenseExperienceProps) {
  const fileInputId = useId();
  const [text, setText] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [result, setResult] = useState<ReturnType<
    typeof buildReceiptExpenseMock
  > | null>(null);
  const [selectedFieldId, setSelectedFieldId] =
    useState<ReceiptFieldId | null>(null);

  const revokePreview = useCallback(() => {
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
  }, []);

  useEffect(() => () => revokePreview(), [revokePreview]);

  const applyImageFile = useCallback(
    (file: File | null) => {
      if (!file || !file.type.startsWith("image/")) return;
      revokePreview();
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    },
    [revokePreview]
  );

  const run = () => {
    setResult(buildReceiptExpenseMock(text));
    setSelectedFieldId(null);
  };

  const hintText =
    selectedFieldId != null
      ? FIELD_HINTS[selectedFieldId]
      : RECEIPT_HINT_DEFAULT;

  return (
    <div className={cn("space-y-6", className)}>
      <div className="rounded-xl border border-silver/25 bg-base-dark/80 p-4 md:p-6">
        <h2 className="mb-3 text-sm font-semibold text-accent md:text-[1rem]">
          入力
        </h2>
        <div className="mb-3">
          <label
            htmlFor={fileInputId}
            className="mb-1 block text-xs text-text-sub md:text-sm"
          >
            画像（任意）
          </label>
          <Input
            id={fileInputId}
            type="file"
            accept="image/*"
            onChange={(e) =>
              applyImageFile(e.target.files?.[0] ?? null)
            }
            className="text-sm"
          />
        </div>
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={meta.inputHint}
          rows={4}
          className="mb-3 resize-y text-sm md:text-[1rem]"
        />
        <div className="mb-3 flex flex-wrap gap-2">
          {SAMPLES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setText(s)}
              className="rounded-full border border-silver/30 bg-silver/5 px-3 py-1 text-xs text-text-sub transition hover:border-accent/40 hover:text-text md:text-sm"
            >
              {s}
            </button>
          ))}
        </div>
        <Button type="button" onClick={run}>
          実行（モック結果）
        </Button>
        {result ? (
          <div
            className="mt-4 rounded-lg border border-accent/30 bg-accent/5 px-3 py-3 text-sm leading-relaxed text-text md:px-4"
            role="status"
          >
            <p>自動で指定の計算シートに振り分けることが可能です。</p>
            <p className="mt-2">
              経費項目ごとに自動で振り分け、画像投稿のみで申告書類作成の手間を大幅削減できます。
            </p>
          </div>
        ) : null}
        <p className="mt-2 text-xs text-text-sub">
          本画面はプロトタイプです。チャットで実AIを試す場合は{" "}
          <Link
            href={`/demo/${meta.demoSlug}`}
            className="text-accent underline-offset-2 hover:underline"
          >
            ツールdemo
          </Link>
          へ。
        </p>
      </div>

      {result && (
        <div
          className="grid gap-4 md:grid-cols-3"
          aria-label="抽出結果と領収書対応"
        >
          <div className="rounded-xl border border-silver/20 bg-base-dark p-4 md:order-1">
            <h3 className="mb-3 text-sm font-semibold text-text md:text-[1rem]">
              領収書
            </h3>
            <ReceiptImageStage
              previewUrl={previewUrl}
              selectedFieldId={selectedFieldId}
            />
          </div>

          <div className="rounded-xl border border-silver/20 bg-base-dark p-4 md:order-2">
            <h3 className="mb-3 text-sm font-semibold text-text md:text-[1rem]">
              抽出フィールド
            </h3>
            <p className="mb-2 text-xs text-text-sub">
              行を選ぶと左の領収書上で該当箇所を強調します。
            </p>
            <ul className="space-y-1">
              {result.fields.map((f) => {
                const pressed = selectedFieldId === f.id;
                return (
                  <li key={f.id}>
                    <button
                      type="button"
                      aria-pressed={pressed}
                      onClick={() =>
                        setSelectedFieldId((cur) =>
                          cur === f.id ? null : f.id
                        )
                      }
                      className={cn(
                        "w-full rounded-lg border px-3 py-2 text-left text-sm transition",
                        pressed
                          ? "border-accent/60 bg-accent/10 text-text"
                          : "border-silver/15 bg-silver/5 text-text-sub hover:border-accent/35 hover:text-text"
                      )}
                    >
                      <span className="block text-xs text-text-sub">
                        {f.label}
                      </span>
                      <span className="font-medium text-text">{f.value}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-3 text-xs text-text-sub">
              補足: {text.trim() || "（入力なし時はサンプル値）"}
            </p>
          </div>

          <div className="flex flex-col gap-4 md:order-3">
            <div className="rounded-xl border border-accent/25 bg-accent/5 p-4">
              <h3 className="mb-2 text-sm font-semibold text-text md:text-[1rem]">
                承認前チェック
              </h3>
              <div
                className={cn(
                  "mb-3 rounded-lg border p-3",
                  result.compliance.ok
                    ? "border-emerald-500/35 bg-emerald-500/10"
                    : "border-amber-500/35 bg-amber-500/10"
                )}
                role="status"
                aria-live="polite"
              >
                <p className="text-xs font-semibold text-text">
                  社内規定チェック（AI照合ログ）
                </p>
                <p className="mt-1 text-sm font-semibold text-text md:text-[1rem]">
                  {result.compliance.label}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-text-sub">
                  {result.compliance.advice}
                </p>
              </div>
              <ul className="space-y-2 text-sm">
                {result.checks.map((c) => {
                  const related =
                    selectedFieldId != null &&
                    c.relatedFieldId === selectedFieldId;
                  return (
                    <li
                      key={c.label}
                      className={cn(
                        "flex items-start gap-2 rounded-lg border px-2 py-2 text-text-sub transition",
                        related
                          ? "border-accent/45 bg-accent/10"
                          : "border-transparent"
                      )}
                    >
                      <span
                        className={cn(
                          "shrink-0 font-medium",
                          c.ok ? "text-emerald-400" : "text-amber-400"
                        )}
                        aria-hidden
                      >
                        {c.ok ? "✓" : "!"}
                      </span>
                      <span>{c.label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div
              className="rounded-lg border border-silver/20 bg-silver/5 px-3 py-2 text-sm leading-relaxed text-text-sub"
              role="status"
              aria-live="polite"
            >
              {hintText}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
