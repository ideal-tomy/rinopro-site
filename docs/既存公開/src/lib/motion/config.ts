/**
 * Motion timing constants - docs/デザイン要件.md
 * 即応: 150-250ms / 余韻: 400-700ms
 */
export const DURATION_INSTANT = 200;
export const DURATION_SMOOTH = 400;
export const DURATION_PAGE_OUT = 250;
export const DURATION_PAGE_IN = 350;
export const STAGGER_DELAY = 80;

/**
 * Flutter _OnboardingResultStep 由来の非均等スタッガー
 * 序盤は速く→中盤はゆっくり→最後に弾むリズム
 */
export const HERO_SEQUENCE_DURATION = 3000;
export const HERO_THRESHOLDS = [0, 0.1, 0.2, 0.4, 0.6, 0.8, 0.9, 1.0] as const;
