/**
 * サービス詳細・長文ブロック向けの共通タイポグラフィ。
 * 正本は ax-role-*（src/styles/axeon-ui.css）。`text-base` は使わない。
 */
import { axLayout, axRole } from "@/lib/ui/ax-typography";

export const serviceReading = {
  body: `${axRole.body} text-[color:var(--ax-text-body)]`,
  bodyCenter: `text-center ${axRole.body} text-[color:var(--ax-text-body)]`,
  leadMuted: `${axRole.supporting} text-[color:var(--ax-text-supporting)] md:text-[length:var(--ax-lead-size)] md:leading-[var(--ax-lead-lh)]`,
} as const;

/** 埋め込みコンテナの横余白（モバイル最低 16px 相当） */
export const serviceShellInset = {
  embeddedX: "px-4 sm:px-5 md:px-6",
  embeddedY: "py-6 md:py-10 lg:py-12",
} as const;

export { axLayout, axRole };
