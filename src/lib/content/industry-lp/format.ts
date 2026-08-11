/** yen（円）→ "344万円" 形式 */
export function formatManYen(yen: number): string {
  const man = Math.round(yen / 10_000);
  return `${man.toLocaleString("ja-JP")}万円`;
}
