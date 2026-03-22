import { DURATION_SMOOTH } from "@/lib/motion/config";

/** UI クロスフェード秒（ウィザード等と同じ DURATION_SMOOTH） */
export const DEMO_CROSSFADE_SEC = DURATION_SMOOTH / 1000;

/** イントロ・タイトル表示後、再生ボタンへ切り替えるまで */
export const DEMO_INTRO_TITLE_MS = 5000;

/** テロップ表示（読了） */
export const DEFAULT_TELOP_MS = 3000;
/** ログ・章ビュー表示後のホールド（次シーンへ進む前） */
export const DEFAULT_HOLD_AFTER_REVEAL_MS = 6000;
/** テロップ消去〜ログ反映の間（クロスフェードと同周期） */
export const CROSSFADE_GAP_MS = DURATION_SMOOTH;
/** 最終シーン表示ホールド後、ホームに戻るまで */
export const LOOP_RESET_HOME_MS = 5000;
