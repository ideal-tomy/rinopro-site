/**
 * 旧クラス → ax ロールの対照（開発・移行用）
 * @see docs/ui-migration/token-map.md
 */
import { axLayout, axRole } from "@/lib/ui/ax-typography";

export const AX_MIGRATE_HINTS = {
  "text-[16px]": axRole.body,
  "text-sm": axRole.supporting,
  "text-lg": axRole.lead,
  "text-2xl": axRole.sectionTitle,
  "text-3xl": axRole.pageTitle,
  "text-4xl": axRole.display,
  "max-w-4xl mx-auto": axLayout.containerWide,
  "max-w-prose": axLayout.containerReading,
} as const;

export { axLayout, axRole };
