/**
 * 回答本文を先に読ませ、CTAは短文3秒・長文5〜7秒後に表示（アニメーション軽減時は即時）。
 */
export function getConciergeCtaDelayMs(
  textLength: number,
  reducedMotion: boolean
): number {
  if (reducedMotion) return 0;
  if (textLength < 400) return 3000;
  if (textLength < 1200) return 5000;
  return 7000;
}
