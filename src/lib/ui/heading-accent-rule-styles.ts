/** 見出し直下のグラデーションアクセント線（`src/app/globals.css`） */
export const headingAccentRule = {
  base: "heading-with-accent-rule",
  center: "heading-with-accent-rule--center",
  onDark: "heading-with-accent-rule--on-dark",
} as const;

export const headingAccentRuleClasses = {
  default: headingAccentRule.base,
  centered: `${headingAccentRule.base} ${headingAccentRule.center}`,
  onDark: `${headingAccentRule.base} ${headingAccentRule.center} ${headingAccentRule.onDark}`,
  onDarkInline: `${headingAccentRule.base} ${headingAccentRule.onDark}`,
} as const;
