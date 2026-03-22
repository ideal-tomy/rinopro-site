"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  buildPropertyMockFromPins,
  type PropertyPhotoPin,
} from "@/lib/experience/property-exterior-mock";
import type { ExperiencePrototypeMeta } from "@/lib/experience/prototype-registry";
import { cn } from "@/lib/utils";

const LABEL_PRESETS = ["照明", "外壁", "共用部", "その他"] as const;

function newPinId(): string {
  return `pin-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

interface PropertyExteriorPhotoExperienceProps {
  meta: ExperiencePrototypeMeta;
  className?: string;
}

export function PropertyExteriorPhotoExperience({
  meta,
  className,
}: PropertyExteriorPhotoExperienceProps) {
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewWrapRef = useRef<HTMLDivElement>(null);

  const [text, setText] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [pins, setPins] = useState<PropertyPhotoPin[]>([]);
  const [selectedPinId, setSelectedPinId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [analyzeError, setAnalyzeError] = useState<string | null>(null);
  const [result, setResult] = useState<
    ReturnType<typeof buildPropertyMockFromPins> | null
  >(null);

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
      setPins([]);
      setSelectedPinId(null);
      setResult(null);
      setAnalyzeError(null);
    },
    [revokePreview]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const f = e.dataTransfer.files?.[0];
    applyImageFile(f ?? null);
  };

  const onPreviewClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewWrapRef.current || !previewUrl) return;
    const target = e.target as HTMLElement;
    if (target.closest("[data-pin-marker]")) return;

    const rect = previewWrapRef.current.getBoundingClientRect();
    const xPct = ((e.clientX - rect.left) / rect.width) * 100;
    const yPct = ((e.clientY - rect.top) / rect.height) * 100;
    const clampedX = Math.min(100, Math.max(0, xPct));
    const clampedY = Math.min(100, Math.max(0, yPct));
    const id = newPinId();
    setPins((prev) => [
      ...prev,
      { id, xPct: clampedX, yPct: clampedY, label: "共用部" },
    ]);
    setSelectedPinId(id);
    setResult(null);
  };

  const updatePinLabel = (id: string, label: string) => {
    setPins((prev) =>
      prev.map((p) => (p.id === id ? { ...p, label } : p))
    );
    setResult(null);
  };

  const removePin = (id: string) => {
    setPins((prev) => prev.filter((p) => p.id !== id));
    setSelectedPinId((s) => (s === id ? null : s));
    setResult(null);
  };

  const runAnalyze = () => {
    if (!previewUrl) {
      setAnalyzeError("先に写真をドロップするか、ファイルを選択してください。");
      setResult(null);
      return;
    }
    setAnalyzeError(null);
    setResult(buildPropertyMockFromPins(text, pins, true));
  };

  const samples = [
    "共用廊下の照明が1基消灯",
    "外壁にひび、雨漏りは未確認",
  ];

  const selectedPin = pins.find((p) => p.id === selectedPinId) ?? null;

  return (
    <div className={cn("space-y-6", className)}>
      <div className="rounded-xl border border-silver/25 bg-base-dark/80 p-4 md:p-6">
        <h2 className="mb-3 text-sm font-semibold text-accent md:text-base">
          入力
        </h2>

        <div
          role="region"
          aria-label="現場写真をここにドロップするか、クリックでファイルを選択"
          onDragEnter={(e) => {
            e.preventDefault();
            setDragActive(true);
          }}
          onDragLeave={(e) => {
            e.preventDefault();
            if (!e.currentTarget.contains(e.relatedTarget as Node)) {
              setDragActive(false);
            }
          }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={onDrop}
          className={cn(
            "relative mb-4 flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors md:min-h-[240px]",
            dragActive
              ? "border-accent/70 bg-accent/10"
              : "border-silver/35 bg-silver/5 hover:border-accent/40",
            previewUrl && "min-h-0 border-solid border-silver/25 p-2"
          )}
        >
          <input
            ref={fileInputRef}
            id={fileInputId}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => applyImageFile(e.target.files?.[0] ?? null)}
          />

          {!previewUrl ? (
            <button
              type="button"
              className="flex flex-col items-center gap-2 text-center text-sm text-text-sub"
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="text-text">
                写真をドラッグ＆ドロップ
              </span>
              <span>またはクリックでファイルを選択</span>
              <span className="text-xs text-text-sub/80">
                配置後、画像上をクリックしてピン（所見位置）を追加できます
              </span>
            </button>
          ) : (
            <div className="w-full space-y-2">
              <div
                ref={previewWrapRef}
                role="presentation"
                className="relative mx-auto max-h-[min(420px,55vh)] w-full cursor-crosshair overflow-hidden rounded-lg bg-black/40"
                onClick={onPreviewClick}
              >
                {/* blob URL のため next/image は使わず img（LCP 対象外のプロトタイプ） */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewUrl}
                  alt="アップロードした現場写真のプレビュー"
                  className="mx-auto max-h-[min(420px,55vh)] w-full object-contain"
                />
                {pins.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    data-pin-marker
                    aria-label={`ピン${i + 1} ${p.label}`}
                    className={cn(
                      "absolute flex h-7 w-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-base-dark text-xs font-bold text-base-dark motion-safe:transition motion-safe:duration-150",
                      selectedPinId === p.id
                        ? "z-10 scale-110 bg-accent"
                        : "z-[1] bg-accent/85 hover:bg-accent"
                    )}
                    style={{ left: `${p.xPct}%`, top: `${p.yPct}%` }}
                    onClick={(ev) => {
                      ev.stopPropagation();
                      setSelectedPinId(p.id);
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => fileInputRef.current?.click()}
                >
                  写真を差し替え
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="text-xs text-text-sub"
                  onClick={() => {
                    revokePreview();
                    setPins([]);
                    setSelectedPinId(null);
                    setResult(null);
                    setAnalyzeError(null);
                  }}
                >
                  写真をクリア
                </Button>
              </div>
            </div>
          )}
        </div>

        {selectedPin && (
          <div className="mb-4 rounded-lg border border-silver/20 bg-silver/5 p-3">
            <p className="mb-2 text-xs font-medium text-text">
              ピン「{pins.findIndex((x) => x.id === selectedPin.id) + 1}
              」のラベル
            </p>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {LABEL_PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => updatePinLabel(selectedPin.id, preset)}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-xs motion-safe:transition",
                    selectedPin.label === preset
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-silver/30 text-text-sub hover:border-accent/40"
                  )}
                >
                  {preset}
                </button>
              ))}
            </div>
            <label className="mt-2 block text-xs text-text-sub">
              ラベル（自由入力・補足）
              <Input
                className="mt-1 max-w-md text-sm"
                value={selectedPin.label}
                onChange={(e) =>
                  updatePinLabel(selectedPin.id, e.target.value)
                }
                placeholder="例: 照明（北側）"
              />
            </label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="mt-2 text-xs text-amber-200/90"
              onClick={() => removePin(selectedPin.id)}
            >
              このピンを削除
            </Button>
          </div>
        )}

        <Textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setResult(null);
          }}
          placeholder={meta.inputHint}
          rows={4}
          className="mb-3 resize-y text-sm md:text-base"
        />
        <div className="mb-3 flex flex-wrap gap-2">
          {samples.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setText(s);
                setResult(null);
              }}
              className="rounded-full border border-silver/30 bg-silver/5 px-3 py-1 text-xs text-text-sub transition hover:border-accent/40 hover:text-text md:text-sm"
            >
              {s}
            </button>
          ))}
        </div>

        {analyzeError && (
          <p className="mb-2 text-sm text-amber-200/90" role="status">
            {analyzeError}
          </p>
        )}

        <Button
          type="button"
          onClick={runAnalyze}
          disabled={!previewUrl}
          className="disabled:opacity-50"
        >
          分析（モック結果）
        </Button>
        {!previewUrl && (
          <p className="mt-1 text-xs text-text-sub">
            写真を配置すると分析ボタンが有効になります。
          </p>
        )}

        <p className="mt-3 text-xs text-text-sub">
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
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-silver/20 bg-base-dark p-4">
            <h3 className="mb-2 text-sm font-semibold text-text md:text-base">
              状況タグ
            </h3>
            <div className="flex flex-wrap gap-2">
              {result.tags.map((t) => (
                <span
                  key={t}
                  className="rounded-full border border-silver/30 bg-silver/10 px-3 py-1 text-xs md:text-sm"
                >
                  {t}
                </span>
              ))}
            </div>
            {result.pinFindings.length > 0 && (
              <div className="mt-4 border-t border-silver/15 pt-4">
                <h4 className="mb-2 text-xs font-medium text-accent md:text-sm">
                  ピン連動所見
                </h4>
                <ul className="list-inside list-disc space-y-1.5 text-sm text-text-sub">
                  {result.pinFindings.map((line, idx) => (
                    <li key={idx}>{line}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="rounded-xl border border-silver/20 bg-base-dark p-4">
              <h3 className="mb-2 text-sm font-semibold text-text md:text-base">
                記録メモ
              </h3>
              <p className="whitespace-pre-wrap text-sm text-text-sub">
                {result.memo}
              </p>
            </div>
            <div className="rounded-xl border border-accent/25 bg-accent/5 p-4">
              <h3 className="mb-2 text-sm font-semibold text-text md:text-base">
                次アクション
              </h3>
              <p className="text-sm text-text-sub">{result.next}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
