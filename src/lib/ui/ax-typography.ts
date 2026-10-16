/**
 * AXEON 共通タイポロール（className 用）
 * @see docs/最終改善/AXEON_UI共通ルール.md
 * @see src/styles/axeon-ui.css
 */

export const axRole = {
  display: "ax-role-display",
  pageTitle: "ax-role-page-title",
  sectionTitle: "ax-role-section-title",
  itemTitle: "ax-role-item-title",
  lead: "ax-role-lead",
  body: "ax-role-body",
  supporting: "ax-role-supporting",
  uiLabel: "ax-role-ui-label",
  eyebrow: "ax-role-eyebrow",
} as const;

export type AxTextRole = keyof typeof axRole;

export const axLayout = {
  site: "ax-site",
  page: "ax-page",
  containerWide: "ax-container-wide",
  containerReading: "ax-container-reading",
  sectionStandard: "ax-section-standard",
  sectionCompact: "ax-section-compact",
  sectionMuted: "ax-section-muted",
  sectionSurface: "ax-section-surface",
  prose: "ax-prose",
} as const;
