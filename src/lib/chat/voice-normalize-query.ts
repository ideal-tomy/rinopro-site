/**
 * 音声認識の生テキストから、検索・送信向けに軽く整形する（フィラー・口語の末尾を落とす）。
 * 厳密な自然言語処理ではなく、デモ向けのヒューリスティック。
 */
export function normalizeVoiceSearchQuery(raw: string): string {
  let s = raw.trim();
  if (!s) return "";

  s = s.replace(/[、。！？!?\s]+/g, " ");

  const fillers = ["えーと", "えっと", "あの", "その", "なんか", "うーん", "えー"];
  for (const f of fillers) {
    const re = new RegExp(`^${f}\\s*`, "i");
    s = s.replace(re, "");
  }

  s = s.replace(
    /\s*(を|に)?\s*(見せて|見せてください|探して|探してほしい|検索して|教えて|教えてください|お願いします|ください)$/u,
    ""
  );

  s = s.replace(/\s+/g, " ").trim();
  return s;
}
