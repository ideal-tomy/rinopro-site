/**
 * Live Sync テンプレ用：日本語入力（音声認識想定）→ 指定言語への決定論的モック翻訳。
 * 実APIは使わず、フレーズ辞書＋残りはプレースホルダで表現（デモのライブ感優先）。
 */

export type TargetLanguageId = "en" | "ko" | "zh";

export type TonePreset = "standard" | "polite";

export interface LiveSyncTranslationOptions {
  targetLang: TargetLanguageId;
  tone: TonePreset;
}

/** 長いフレーズを先にマッチさせる（部分一致の取りこぼし防止） */
const JA_EN_PHRASES: [string, string][] = [
  [
    "明日の会議は誠に恐縮ながら無理です。",
    "I'm very sorry to say, but I can't make tomorrow's meeting.",
  ],
  [
    "明日の会議は誠に恐縮ながら無理です",
    "I'm very sorry to say, but I can't make tomorrow's meeting.",
  ],
  ["は誠に恐縮ながら", ", I'm very sorry to say, but"],
  ["無理です。", "it's not possible."],
  ["無理です", "it's not possible"],
  ["明日は無理です", "I'm afraid I can't make it tomorrow."],
  ["明日は難しいです", "Tomorrow will be difficult for me."],
  ["明日は都合が悪いです", "I'm not available tomorrow."],
  ["明日は大丈夫です", "Tomorrow works for me."],
  ["本日はありがとうございました", "Thank you very much for today."],
  ["お手数をおかけします", "Sorry for the trouble."],
  ["誠に恐縮ながら", "I'm very sorry to say, but"],
  ["恐れ入りますが", "I'm sorry, but"],
  ["ご確認ください", "Please confirm."],
  ["後ほど連絡します", "I'll get back to you later."],
  ["折り返しお電話します", "I'll call you back."],
  ["期限はいつですか", "When is the deadline?"],
  ["来週の会議", "the meeting next week"],
  ["今日の会議", "today's meeting"],
  ["明日の会議", "tomorrow's meeting"],
  ["よろしくお願いします", "Thank you in advance."],
  ["お願いします", "Please."],
  ["すみません", "I'm sorry."],
  ["申し訳ありません", "I apologize."],
  ["了解しました", "Understood."],
  ["承知しました", "Noted."],
  ["問題ありません", "No problem."],
  ["明日", "tomorrow"],
  ["今日", "today"],
  ["昨日", "yesterday"],
  ["来週", "next week"],
  ["先週", "last week"],
  ["会議", "meeting"],
  ["期限", "deadline"],
  ["無理", "difficult"],
  ["難しい", "difficult"],
  ["大丈夫", "okay"],
  ["急ぎ", "urgent"],
  ["送付", "send"],
  ["資料", "materials"],
  ["確認", "check"],
  ["連絡", "contact"],
  ["お客様", "the customer"],
  ["社内", "internal"],
];

function sortPhrasesLongestFirst(): [string, string][] {
  return [...JA_EN_PHRASES].sort((a, b) => b[0].length - a[0].length);
}

const SORTED_PHRASES = sortPhrasesLongestFirst();

function applyPoliteEnglish(en: string): string {
  const s = en.trim();
  if (!s) return s;
  if (/thank you/i.test(s)) return s;
  return `${s} Thank you.`;
}

/**
 * 辞書で置換しきれなかったかな・漢字を除去し、右ペインは英語のみに揃える（ライブ途中でも括弧日本語を出さない）。
 */
function stripRemainingJapanese(s: string): string {
  return s
    .replace(/[\u3040-\u30ff\u4e00-\u9faf]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+([.,!?;:])/g, "$1")
    .replace(/,\s*,/g, ",")
    .trim();
}

function polishEnglishSpacing(s: string): string {
  return s
    .replace(/\s+\./g, ".")
    .replace(/\s+,/g, ",")
    .replace(/\(\s+/g, "(")
    .replace(/\s+\)/g, ")")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * 日本語断片を英語モックに変換。未登録部分は表示せず除去し、英語のみを返す。
 */
export function translateMockJaToEn(text: string, tone: TonePreset): string {
  let s = text;
  for (const [ja, en] of SORTED_PHRASES) {
    if (ja.length === 0) continue;
    s = s.split(ja).join(en);
  }
  s = s.replace(/\s+/g, " ").trim();
  s = stripRemainingJapanese(s);
  s = polishEnglishSpacing(s);
  if (tone === "polite" && s.length > 0) {
    s = applyPoliteEnglish(s);
  }
  return s;
}

/** 英語ベースのモック。KO/ZH も本文は英語のみ（ラベルは UI 側のセレクトで示す）。 */
function localizeMock(en: string, lang: TargetLanguageId): string {
  if (lang === "en") return en;
  if (lang === "ko") {
    return en
      ? `${en} — In production, this line would stream in Korean with the same live sync.`
      : en;
  }
  return en
    ? `${en} — In production, this line would stream in Chinese with the same live sync.`
    : en;
}

/** 簡易「意図」チップ（キーワード） */
export function intentHintFromJapanese(source: string): string {
  const t = source;
  if (/無理|難しい|都合が悪い/.test(t)) return "日程・可否の調整";
  if (/期限|いつまで|締め切り/.test(t)) return "期限・スケジュールの確認";
  if (/会議|打ち合わせ/.test(t)) return "会議・調整";
  if (/すみません|申し訳|恐縮|お手数/.test(t)) return "謝意・丁寧な依頼";
  if (/確認|送付|資料/.test(t)) return "資料・確認依頼";
  if (/連絡|電話|折り返し/.test(t)) return "連絡・フォロー";
  if (t.trim().length === 0) return "（入力待ち）";
  return "一般メッセージ";
}

export interface LiveSyncTranslationOutput {
  sourceDraft: string;
  translatedDraft: string;
  intentHint: string;
}

/**
 * @param finalizedText 確定済みの全文（スペース区切り）
 * @param interimText 現在の途中認識（空ならなし）
 */
export function buildLiveSyncTranslationOutput(
  finalizedText: string,
  interimText: string,
  options: LiveSyncTranslationOptions
): LiveSyncTranslationOutput {
  const parts = [finalizedText.trim(), interimText.trim()].filter(Boolean);
  const sourceDraft = parts.join(" ");
  const en = translateMockJaToEn(sourceDraft, options.tone);
  const translatedDraft = localizeMock(en, options.targetLang);
  const intentHint = intentHintFromJapanese(sourceDraft);
  return { sourceDraft, translatedDraft, intentHint };
}
