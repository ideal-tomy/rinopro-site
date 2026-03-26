"use client";

import Link from "next/link";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { TargetLanguageId, TonePreset } from "@/lib/experience/live-sync-translation-mock";
import { buildLiveSyncUnifiedOutput } from "@/lib/experience/live-sync-modes-mock";
import type { LiveSyncMode } from "@/lib/experience/live-sync-modes-mock";
import {
  MOCK_VOICE_STREAM_CHUNKS,
  MOCK_VOICE_STREAM_COUNT,
  pickRandomMockStreamIndex,
} from "@/lib/experience/live-sync-mock-voice-streams";
import type { ExperiencePrototypeMeta } from "@/lib/experience/prototype-registry";
import { cn } from "@/lib/utils";

interface LiveSyncTranslationExperienceProps {
  meta: ExperiencePrototypeMeta;
  className?: string;
}

function subscribePrefersReducedMotion(cb: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function prefersReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function prefersReducedMotionServerSnapshot() {
  return false;
}

function getSpeechRecognitionCtor(): (new () => SpeechRecognition) | null {
  if (typeof window === "undefined") return null;
  return (
    window.SpeechRecognition ??
    (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognition })
      .webkitSpeechRecognition ??
    null
  );
}

const LANG_LABEL: Record<TargetLanguageId, string> = {
  en: "English",
  ko: "한국어（モイ）",
  zh: "中文（模拟）",
};

const LIVE_SYNC_MODE_LABEL: Record<LiveSyncMode, string> = {
  translation: "リアルタイム翻訳",
  rewrite: "丁寧語・言い換え",
  digest: "結論・期限・TODO",
  handover: "申し送り",
};

function PseudoWaveform({
  active,
  reduceMotion,
}: {
  active: boolean;
  reduceMotion: boolean;
}) {
  const bars = 24;
  return (
    <div
      className="flex h-16 w-full items-end justify-center gap-px overflow-hidden rounded-lg border border-silver/20 bg-black/30 px-2 pb-2 pt-3"
      aria-hidden
    >
      {Array.from({ length: bars }, (_, i) => (
        <div
          key={i}
          className={cn(
            "w-1 rounded-sm bg-accent/70",
            active &&
              !reduceMotion &&
              "motion-safe:origin-bottom motion-safe:animate-pulse"
          )}
          style={{
            height: active ? `${20 + (i % 7) * 8}px` : "12px",
            animationDelay: reduceMotion ? undefined : `${(i % 8) * 80}ms`,
          }}
        />
      ))}
    </div>
  );
}

export function LiveSyncTranslationExperience({
  meta,
  className,
}: LiveSyncTranslationExperienceProps) {
  const mode = meta.liveSyncMode ?? "translation";
  const panelId = useId();
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mockTimerRef = useRef<number | null>(null);

  const reduceMotion = useSyncExternalStore(
    subscribePrefersReducedMotion,
    prefersReducedMotionSnapshot,
    prefersReducedMotionServerSnapshot
  );

  const [speechFinal, setSpeechFinal] = useState("");
  const [speechInterim, setSpeechInterim] = useState("");
  const [manualText, setManualText] = useState("");
  const [listening, setListening] = useState(false);
  const [mockStreaming, setMockStreaming] = useState(false);
  const [inputChannel, setInputChannel] = useState<"speech" | "manual">(
    "speech"
  );

  const [targetLang, setTargetLang] = useState<TargetLanguageId>("en");
  const [tone, setTone] = useState<TonePreset>("standard");

  const [speechSupported, setSpeechSupported] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [showMicDemoScopeNote, setShowMicDemoScopeNote] = useState(false);
  const [lastMockPatternLabel, setLastMockPatternLabel] = useState<string | null>(
    null
  );

  const [timeline, setTimeline] = useState<string[]>([]);

  useEffect(() => {
    setSpeechSupported(Boolean(getSpeechRecognitionCtor()));
  }, []);

  const speechDraft = `${speechFinal}${speechInterim}`;

  const liveOut = useMemo(() => {
    const finalized = inputChannel === "manual" ? manualText : speechFinal;
    const interim = inputChannel === "manual" ? "" : speechInterim;
    return buildLiveSyncUnifiedOutput(mode, finalized, interim, {
      targetLang,
      tone,
    });
  }, [
    mode,
    inputChannel,
    manualText,
    speechFinal,
    speechInterim,
    targetLang,
    tone,
  ]);

  const pushTimeline = useCallback((line: string) => {
    setTimeline((prev) => [...prev.slice(-12), line]);
  }, []);

  const stopMockStream = useCallback(() => {
    if (mockTimerRef.current != null) {
      window.clearInterval(mockTimerRef.current);
      mockTimerRef.current = null;
    }
    setMockStreaming(false);
  }, []);

  useEffect(() => {
    return () => {
      if (mockTimerRef.current != null) {
        window.clearInterval(mockTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;

    const rec = new Ctor();
    rec.lang = "ja-JP";
    rec.continuous = true;
    rec.interimResults = true;

    rec.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      let addFinal = "";
      for (let j = event.resultIndex; j < event.results.length; j++) {
        const r = event.results[j];
        const piece = r[0]?.transcript ?? "";
        if (r.isFinal) {
          addFinal += piece;
        } else {
          interim += piece;
        }
      }
      if (addFinal) {
        setSpeechFinal((prev) => prev + addFinal);
      }
      setSpeechInterim(interim);
    };

    rec.onerror = (event) => {
      const code =
        event &&
        typeof event === "object" &&
        "error" in event &&
        typeof (event as { error: string }).error === "string"
          ? (event as { error: string }).error
          : "unknown";
      if (code === "not-allowed") {
        setSpeechError("マイクの使用が拒否されました。ブラウザ設定をご確認ください。");
      } else if (code === "no-speech") {
        setSpeechError(null);
      } else {
        setSpeechError(`音声認識エラー: ${code}`);
      }
      setListening(false);
      setShowMicDemoScopeNote(false);
    };

    rec.onend = () => {
      setListening(false);
      setShowMicDemoScopeNote(false);
    };

    recognitionRef.current = rec;
    return () => {
      try {
        rec.abort();
      } catch {
        /* noop */
      }
      recognitionRef.current = null;
    };
  }, []);

  const startListening = useCallback(() => {
    setSpeechError(null);
    stopMockStream();
    setInputChannel("speech");
    const rec = recognitionRef.current;
    if (!rec) {
      setSpeechError("このブラウザでは Web Speech API が使えません。モック音声をご利用ください。");
      return;
    }
    try {
      setListening(true);
      setShowMicDemoScopeNote(true);
      setSpeechInterim("");
      rec.start();
      pushTimeline("音声認識: 開始");
    } catch {
      setListening(false);
      setShowMicDemoScopeNote(false);
      setSpeechError("音声認識を開始できませんでした。少し待って再度お試しください。");
    }
  }, [pushTimeline, stopMockStream]);

  const stopListening = useCallback(() => {
    const rec = recognitionRef.current;
    if (rec) {
      try {
        rec.stop();
      } catch {
        /* noop */
      }
    }
    setListening(false);
    setSpeechInterim("");
    setShowMicDemoScopeNote(false);
    pushTimeline("音声認識: 停止");
  }, [pushTimeline]);

  const startMockStream = useCallback(() => {
    if (listening) {
      stopListening();
    }
    setShowMicDemoScopeNote(false);
    stopMockStream();
    setInputChannel("speech");
    setSpeechFinal("");
    setSpeechInterim("");
    const patternIndex = pickRandomMockStreamIndex();
    const parts = MOCK_VOICE_STREAM_CHUNKS[patternIndex] ?? [];
    setLastMockPatternLabel(
      `${patternIndex + 1} / ${MOCK_VOICE_STREAM_COUNT}`
    );
    setMockStreaming(true);
    let i = 0;
    const stepMs = reduceMotion ? 80 : 420;
    pushTimeline(
      `モック音声ストリーム開始（ランダム ${patternIndex + 1}/${MOCK_VOICE_STREAM_COUNT}）`
    );
    mockTimerRef.current = window.setInterval(() => {
      if (i >= parts.length) {
        stopMockStream();
        pushTimeline("モック音声ストリーム: 完了");
        return;
      }
      const part = parts[i];
      i += 1;
      setSpeechFinal((prev) => prev + part);
      setSpeechInterim("");
    }, stepMs);
  }, [
    listening,
    pushTimeline,
    reduceMotion,
    stopMockStream,
    stopListening,
  ]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && e.code === "KeyM") {
        e.preventDefault();
        if (listening) stopListening();
        else startListening();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [listening, startListening, stopListening]);

  return (
    <div className={cn("space-y-6", className)}>
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
        <section
          className="rounded-xl border border-silver/25 bg-base-dark/80 p-4 md:p-6"
          aria-labelledby={`${panelId}-in`}
        >
          <h2
            id={`${panelId}-in`}
            className="mb-3 text-sm font-semibold text-accent md:text-[1rem]"
          >
            入力（音声 / 手入力）
          </h2>

          {!speechSupported && (
            <p className="mb-3 rounded-lg border border-amber-400/30 bg-amber-400/10 px-3 py-2 text-sm text-amber-100">
              このブラウザでは Web Speech API が利用できません。下の「モック音声ストリームを再生」で
              Live Sync（{LIVE_SYNC_MODE_LABEL[mode]}）の演出をお試しください。
            </p>
          )}

          <div className="mb-4 flex flex-wrap gap-2">
            <Button
              type="button"
              size="sm"
              variant={inputChannel === "speech" ? "default" : "outline"}
              onClick={() => setInputChannel("speech")}
            >
              音声優先
            </Button>
            <Button
              type="button"
              size="sm"
              variant={inputChannel === "manual" ? "default" : "outline"}
              onClick={() => {
                setInputChannel("manual");
                setShowMicDemoScopeNote(false);
                stopListening();
                stopMockStream();
              }}
            >
              手入力
            </Button>
          </div>

          <div className="mb-5 rounded-xl border-2 border-accent/55 bg-gradient-to-br from-accent/20 via-base-dark/90 to-base-dark/95 p-4 shadow-[0_0_24px_-4px_rgba(34,211,238,0.35)] ring-1 ring-accent/30 md:p-5">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">
              おすすめ
            </p>
            <h3 className="mt-1 text-sm font-semibold text-white md:text-[1rem]">
              Live Sync（{LIVE_SYNC_MODE_LABEL[mode]}）の演出を試す
            </h3>
            <Button
              type="button"
              size="lg"
              className="mt-4 w-full font-semibold shadow-md sm:w-auto"
              disabled={mockStreaming}
              onClick={() => {
                setInputChannel("speech");
                startMockStream();
              }}
            >
              {mockStreaming ? "再生中…" : "モック音声ストリームを再生"}
            </Button>
            {lastMockPatternLabel && !mockStreaming && (
              <p className="mt-3 text-xs text-text-sub">
                直近のパターン: {lastMockPatternLabel}
              </p>
            )}
          </div>

          <div className="mb-3 space-y-3 border-t border-silver/20 pt-4">
            <p className="text-xs font-medium text-text-sub">
              実マイク（ブラウザの音声認識）
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={!speechSupported || inputChannel !== "speech"}
                onClick={listening ? stopListening : startListening}
              >
                {listening ? "音声入力を停止" : "音声入力を開始"}
              </Button>
              <span className="text-xs text-text-sub">
                ショートカット: Alt+M
              </span>
            </div>
            {showMicDemoScopeNote && speechSupported && (
              <div
                className="rounded-lg border border-silver/25 bg-silver/5 px-3 py-2.5 text-xs leading-relaxed text-text-sub"
                role="note"
                aria-live="polite"
              >
                <span className="font-medium text-text">このデモの範囲: </span>
                マイク入力は<strong className="text-text">日本語の文字起こし</strong>
                までです。
                {mode === "translation" ? (
                  <>
                    右ペインの英語が実音声にリアルタイムで連動するには、本番で
                    <strong className="text-text">
                      サーバー経由の翻訳API
                    </strong>
                    （例: Cloud Translation / DeepL）を組み込む必要があります。ライブ感の確認は上の「モック音声ストリーム」が該当します。
                  </>
                ) : (
                  <>
                    右ペインの{LIVE_SYNC_MODE_LABEL[mode]}
                    は<strong className="text-text">辞書・ルールベースのモック</strong>
                    です。本番では意図抽出・要約モデルをサーバー経由で組み込む想定です。ライブ感の確認は「モック音声ストリーム」が該当します。
                  </>
                )}
              </div>
            )}
            <PseudoWaveform active={listening || mockStreaming} reduceMotion={reduceMotion} />
          </div>

          {speechError && (
            <p className="mb-3 text-sm text-amber-200/90" role="status">
              {speechError}
            </p>
          )}

          <div className="mb-2">
            <p className="mb-1 text-xs text-text-sub">ライブ認識（日本語）</p>
            <div
              className="min-h-[5rem] rounded-lg border border-silver/20 bg-black/25 p-3 text-sm text-text"
              aria-live="polite"
            >
              {inputChannel === "speech"
                ? speechDraft || "（音声入力待ち）"
                : "（手入力モード）"}
            </div>
          </div>

          <label className="mb-2 block text-xs text-text-sub" htmlFor={`${panelId}-ta`}>
            手入力（フォールバック・編集用）
          </label>
          <Textarea
            id={`${panelId}-ta`}
            value={manualText}
            onChange={(e) => {
              setManualText(e.target.value);
              setInputChannel("manual");
              stopListening();
              stopMockStream();
            }}
            placeholder={meta.inputHint}
            rows={5}
            className="resize-y text-sm md:text-[1rem]"
          />

          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-xs text-text-sub"
              onClick={() => {
                setSpeechFinal("");
                setSpeechInterim("");
                setManualText("");
                setTimeline([]);
                setLastMockPatternLabel(null);
                setShowMicDemoScopeNote(false);
              }}
            >
              入力をクリア
            </Button>
          </div>
        </section>

        <section
          className="rounded-xl border border-accent/25 bg-accent/5 p-4 md:p-6"
          aria-labelledby={`${panelId}-out`}
        >
          <h2
            id={`${panelId}-out`}
            className="mb-3 text-sm font-semibold text-accent md:text-[1rem]"
          >
            Live Sync（自動更新）
            <span className="mt-1 block text-xs font-normal text-text-sub">
              {LIVE_SYNC_MODE_LABEL[mode]}
            </span>
          </h2>

          {liveOut.mode === "translation" && (
            <>
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="w-full text-xs text-text-sub">翻訳先</span>
                {(["en", "ko", "zh"] as const).map((id) => (
                  <Button
                    key={id}
                    type="button"
                    size="sm"
                    variant={targetLang === id ? "default" : "outline"}
                    onClick={() => setTargetLang(id)}
                  >
                    {LANG_LABEL[id]}
                  </Button>
                ))}
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                <span className="w-full text-xs text-text-sub">トーン（英語モック）</span>
                <Button
                  type="button"
                  size="sm"
                  variant={tone === "standard" ? "default" : "outline"}
                  onClick={() => setTone("standard")}
                >
                  標準
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={tone === "polite" ? "default" : "outline"}
                  onClick={() => setTone("polite")}
                >
                  丁寧
                </Button>
              </div>
            </>
          )}

          <p className="mb-2 text-xs font-medium text-text-sub">意図</p>
          <p className="mb-4 inline-block rounded-full border border-silver/30 bg-base-dark/80 px-3 py-1 text-xs text-accent">
            {liveOut.intentHint}
          </p>

          <p className="mb-1 text-xs font-medium text-text-sub">結合ソース</p>
          <p className="mb-4 whitespace-pre-wrap rounded-lg border border-silver/20 bg-base-dark/80 p-3 text-sm text-text">
            {liveOut.sourceDraft || "（空）"}
          </p>

          {liveOut.mode === "translation" && (
            <>
              <p className="mb-1 text-xs font-medium text-text-sub">翻訳（自動）</p>
              <div
                className="min-h-[8rem] whitespace-pre-wrap rounded-lg border border-accent/30 bg-base-dark/90 p-3 text-sm text-text"
                aria-live="polite"
                aria-atomic="false"
              >
                {liveOut.translatedDraft || "（入力に応じて更新）"}
              </div>
            </>
          )}

          {liveOut.mode === "rewrite" && (
            <>
              <p className="mb-1 text-xs font-medium text-text-sub">丁寧語・言い換え（自動）</p>
              <div
                className="min-h-[8rem] whitespace-pre-wrap rounded-lg border border-accent/30 bg-base-dark/90 p-3 text-sm text-text"
                aria-live="polite"
                aria-atomic="false"
              >
                {liveOut.politeDraft || "（入力に応じて更新）"}
              </div>
            </>
          )}

          {liveOut.mode === "digest" && (
            <>
              <p className="mb-1 text-xs font-medium text-text-sub">結論</p>
              <p className="mb-3 whitespace-pre-wrap rounded-lg border border-accent/30 bg-base-dark/90 p-3 text-sm text-text">
                {liveOut.conclusion || "（入力に応じて更新）"}
              </p>
              <p className="mb-1 text-xs font-medium text-text-sub">期限</p>
              <p className="mb-3 rounded-lg border border-silver/20 bg-base-dark/80 p-3 text-sm text-text">
                {liveOut.deadline}
              </p>
              <p className="mb-1 text-xs font-medium text-text-sub">TODO</p>
              <ul className="min-h-[4rem] list-inside list-disc space-y-1 rounded-lg border border-accent/25 bg-base-dark/90 p-3 text-sm text-text">
                {liveOut.todos.length > 0 ? (
                  liveOut.todos.map((t, i) => (
                    <li key={`${i}-${t.slice(0, 12)}`}>{t}</li>
                  ))
                ) : (
                  <li className="list-none text-text-sub">（入力に応じて更新）</li>
                )}
              </ul>
            </>
          )}

          {liveOut.mode === "handover" && (
            <>
              <p className="mb-1 text-xs font-medium text-text-sub">申し送りメモ</p>
              <p className="mb-3 whitespace-pre-wrap rounded-lg border border-accent/30 bg-base-dark/90 p-3 text-sm text-text">
                {liveOut.handoverNote || "（入力に応じて更新）"}
              </p>
              <p className="mb-1 text-xs font-medium text-text-sub">注意</p>
              <p className="mb-3 rounded-lg border border-amber-400/20 bg-amber-400/5 p-3 text-sm text-text">
                {liveOut.caution}
              </p>
              <p className="mb-1 text-xs font-medium text-text-sub">次アクション</p>
              <div className="min-h-[4rem] whitespace-pre-wrap rounded-lg border border-accent/25 bg-base-dark/90 p-3 text-sm text-text">
                {liveOut.nextAction}
              </div>
            </>
          )}

          <details className="mt-4 rounded-lg border border-silver/20 bg-base-dark/50 p-2 text-xs text-text-sub">
            <summary className="cursor-pointer select-none font-medium text-text">
              更新ログ（最新）
            </summary>
            <ul className="mt-2 max-h-32 list-inside list-disc space-y-1 overflow-y-auto">
              {timeline.map((t, i) => (
                <li key={`${i}-${t.slice(0, 12)}`}>{t}</li>
              ))}
            </ul>
          </details>
        </section>
      </div>

      <p className="text-xs text-text-sub">
        本画面はプロトタイプです（辞書ベースのモック翻訳）。実AIを試す場合は{" "}
        <Link
          href={`/demo/${meta.demoSlug}`}
          className="text-accent underline-offset-2 hover:underline"
        >
          ツールdemo
        </Link>
        へ。
      </p>
    </div>
  );
}
