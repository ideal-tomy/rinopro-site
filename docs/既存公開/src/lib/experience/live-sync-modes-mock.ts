/**
 * Live Sync 横展開用：translation 以外のモード（辞書・ルールベースのモック）。
 */

import type { TonePreset } from "@/lib/experience/live-sync-translation-mock";
import {
  buildLiveSyncTranslationOutput,
  intentHintFromJapanese,
} from "@/lib/experience/live-sync-translation-mock";
import type { TargetLanguageId } from "@/lib/experience/live-sync-translation-mock";

export type LiveSyncMode = "translation" | "rewrite" | "digest" | "handover";

const FILLER_RE = /(えーっと|えっと|あのー|そのー|まあ|なんか|ちょっと)/g;

function stripFillers(ja: string): string {
  return ja.replace(FILLER_RE, "").replace(/\s+/g, " ").trim();
}

/** 口語→丁寧語のモック（実APIなし） */
export function buildLiveSyncRewriteOutput(
  finalizedText: string,
  interimText: string
): { sourceDraft: string; politeDraft: string; intentHint: string } {
  const parts = [finalizedText.trim(), interimText.trim()].filter(Boolean);
  const sourceDraft = parts.join(" ");
  const cleaned = stripFillers(sourceDraft);
  const politeDraft =
    cleaned.length > 0
      ? `恐れ入りますが、${cleaned}（モック：丁寧語調整）`
      : "";
  const intentHint = intentHintFromJapanese(sourceDraft);
  return { sourceDraft, politeDraft, intentHint };
}

/** 結論・期限・TODO のモック */
export function buildLiveSyncDigestOutput(
  finalizedText: string,
  interimText: string
): {
  sourceDraft: string;
  conclusion: string;
  deadline: string;
  todos: string[];
  intentHint: string;
} {
  const parts = [finalizedText.trim(), interimText.trim()].filter(Boolean);
  const sourceDraft = parts.join(" ");
  const t = sourceDraft;
  let deadline = "未定";
  if (/来週|金曜|月曜|火曜|水曜|木曜|土曜|日曜/.test(t)) {
    deadline = "来週中（モック・キーワード検出）";
  }
  if (/明日|明後日|本日|今日/.test(t)) {
    deadline = "近日中（モック・キーワード検出）";
  }
  if (/期限|締め切り|いつまで/.test(t)) {
    deadline = "要確認（モック・期限言及あり）";
  }
  const conclusion =
    t.length > 0
      ? `要点：${t.slice(0, 80)}${t.length > 80 ? "…" : ""}`
      : "（入力待ち）";
  const todos =
    t.length > 0
      ? [
          "関係者へ共有",
          "進捗を次回までに確認",
          "必要なら資料を添付",
        ]
      : [];
  const intentHint = intentHintFromJapanese(sourceDraft);
  return { sourceDraft, conclusion, deadline, todos, intentHint };
}

/** 申し送り系のモック */
export function buildLiveSyncHandoverOutput(
  finalizedText: string,
  interimText: string
): {
  sourceDraft: string;
  handoverNote: string;
  caution: string;
  nextAction: string;
  intentHint: string;
} {
  const parts = [finalizedText.trim(), interimText.trim()].filter(Boolean);
  const sourceDraft = parts.join(" ");
  const t = sourceDraft;
  const handoverNote =
    t.length > 0
      ? `【申し送り】${t.slice(0, 120)}${t.length > 120 ? "…" : ""}`
      : "";
  const caution = /急ぎ|注意|至急|重要/.test(t)
    ? "優先度高：フォロー要"
    : "特記なし";
  const nextAction = "次シフトで状況確認";
  const intentHint = intentHintFromJapanese(sourceDraft);
  return { sourceDraft, handoverNote, caution, nextAction, intentHint };
}

export type LiveSyncUnifiedOutput =
  | (ReturnType<typeof buildLiveSyncTranslationOutput> & { mode: "translation" })
  | (ReturnType<typeof buildLiveSyncRewriteOutput> & { mode: "rewrite" })
  | (ReturnType<typeof buildLiveSyncDigestOutput> & { mode: "digest" })
  | (ReturnType<typeof buildLiveSyncHandoverOutput> & { mode: "handover" });

export function buildLiveSyncUnifiedOutput(
  mode: LiveSyncMode,
  finalizedText: string,
  interimText: string,
  translationOpts: { targetLang: TargetLanguageId; tone: TonePreset }
): LiveSyncUnifiedOutput {
  if (mode === "translation") {
    return {
      mode: "translation",
      ...buildLiveSyncTranslationOutput(
        finalizedText,
        interimText,
        translationOpts
      ),
    };
  }
  if (mode === "rewrite") {
    return { mode: "rewrite", ...buildLiveSyncRewriteOutput(finalizedText, interimText) };
  }
  if (mode === "digest") {
    return { mode: "digest", ...buildLiveSyncDigestOutput(finalizedText, interimText) };
  }
  return {
    mode: "handover",
    ...buildLiveSyncHandoverOutput(finalizedText, interimText),
  };
}
