/**
 * サービス詳細・長文ブロック向けの共通タイポグラフィ。
 * プロジェクトルールに従い `text-base` は使わない（`text-[16px]` / `text-[1rem]`）。
 * 他ページ横展開時もこの定数を参照する。
 */
export const serviceReading = {
  /** 本文（左寄せ想定） */
  body: "text-[16px] leading-[1.8] text-text/90 md:text-[1rem] md:leading-[1.85]",
  /** 本文（中央） */
  bodyCenter:
    "text-center text-[16px] leading-[1.8] text-text/90 md:text-[1rem] md:leading-[1.85]",
  /** 補助リード */
  leadMuted:
    "text-sm leading-relaxed text-text-sub/90 md:text-[1rem] md:leading-relaxed",
} as const;

/** 埋め込みコンテナの横余白（モバイル最低 16px 相当） */
export const serviceShellInset = {
  embeddedX: "px-4 sm:px-5 md:px-6",
  embeddedY: "py-6 md:py-10 lg:py-12",
} as const;
