"use client";

import { useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, TextStreamChatTransport } from "ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AiDemo } from "@/lib/sanity/types";
import { cn } from "@/lib/utils";

interface DemoRuntimePanelProps {
  demo: AiDemo;
  className?: string;
}

export function DemoRuntimePanel({ demo, className }: DemoRuntimePanelProps) {
  const [inputText, setInputText] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const runMode = demo.runMode ?? "mock_preview";
  const transport = useMemo(() => {
    const opts = {
      api: "/api/demo/run",
      body: { slug: demo.slug },
    };
    return runMode === "ai_live"
      ? new DefaultChatTransport(opts)
      : new TextStreamChatTransport(opts);
  }, [runMode, demo.slug]);

  const { messages, sendMessage, status, error, clearError } = useChat({
    id: `demo-${demo.slug ?? "unknown"}`,
    transport,
  });

  const isLoading = status === "streaming" || status === "submitted";
  const placeholder =
    demo.inputPlaceholder ?? "入力してください（例: 現場の状況を説明）";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (text && !isLoading) {
      sendMessage({ text });
      setInputText("");
      setImageFile(null);
    }
  };

  const handleSampleClick = (sample: string) => {
    setInputText(sample);
  };

  const inputType = demo.inputType ?? "text_only";

  return (
    <div
      className={cn(
        "rounded-xl border border-silver/20 bg-base-dark p-4 md:p-6",
        className
      )}
    >
      <h3 className="mb-3 text-base font-semibold text-text md:mb-4 md:text-lg">デモを体験</h3>

      {/* 入力エリア（チャット画面を先に表示） */}
      <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
        {inputType === "image_text" && (
          <div>
            <label className="mb-2 block text-sm text-text-sub">
              画像（任意）
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
              disabled={isLoading}
              className="text-sm"
            />
          </div>
        )}

        {inputType === "audio_text" && (
          <p className="text-sm text-text-sub">
            音声入力は検討中です。テキストで直接入力してください。
          </p>
        )}

        <div className="flex gap-2">
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !inputText.trim()}>
            {isLoading ? "送信中..." : "実行"}
          </Button>
        </div>
      </form>

      {/* サンプル（コンパクトでチャットの下に配置） */}
      {demo.sampleData && demo.sampleData.length > 0 && (
        <div className="mt-3 md:mt-4">
          <p className="mb-1.5 text-xs text-text-sub md:mb-2 md:text-sm">サンプルをワンクリック投入:</p>
          <div className="flex flex-wrap gap-1.5">
            {demo.sampleData.map((sample, i) => (
              <Button
                key={i}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleSampleClick(sample)}
                disabled={isLoading}
                className="h-7 px-2 text-xs md:h-8 md:px-3 md:text-sm"
              >
                {sample.length > 24 ? `${sample.slice(0, 24)}…` : sample}
              </Button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          <p className="mb-2">{error.message}</p>
          <button
            type="button"
            className="underline underline-offset-2"
            onClick={() => clearError()}
          >
            閉じる
          </button>
        </div>
      )}

      {/* ストリーミング出力 */}
      {messages.length > 0 && (
        <div className="mt-6 space-y-4">
          {messages.map((m) => {
            const text = m.parts
              .filter((p): p is { type: "text"; text: string } => p.type === "text")
              .map((p) => p.text)
              .join("");
            if (!text) return null;
            return (
              <div
                key={m.id}
                className={cn(
                  "rounded-lg p-4",
                  m.role === "user"
                    ? "ml-4 bg-accent/10 text-text"
                    : "mr-4 bg-base text-text"
                )}
              >
                <span className="text-xs text-text-sub">
                  {m.role === "user" ? "あなた" : "AI"}
                </span>
                <div className="mt-1 whitespace-pre-wrap break-words">{text}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
