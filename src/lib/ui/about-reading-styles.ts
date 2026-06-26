/**
 * About ページ向けの共通タイポグラフィ。
 * プロジェクトルールに従い `text-base` は使わない。
 */
export const aboutReading = {
  /** リード文（太字・結論先出し） */
  lead: "font-semibold text-text text-[16px] leading-[1.8] md:text-[17px] md:leading-[1.85]",
  /** 補足本文 */
  body: "text-text-sub text-[16px] leading-[1.8] md:text-[17px]",
  /** セクション内コンテナ */
  sectionInset:
    "container mx-auto max-w-6xl scroll-mt-32 px-4 py-20 md:px-6 md:py-[100px]",
} as const;
