/** ダッシュボード章（ホーム＋①〜⑤） */
export type DashboardChapter =
  | "home"
  | "shift"
  | "traffic"
  | "receipts"
  | "payroll"
  | "expenses";

/** ホーム8カードの識別子 */
export type HomeCardId =
  | "shift"
  | "sales_traffic"
  | "expense_settlement"
  | "cloud"
  | "products"
  | "stores"
  | "notifications"
  | "reports";

export type LogPhase = "trigger" | "process" | "notify" | "state";

export interface ScenarioLogLine {
  phase: LogPhase;
  text: string;
}

/** シナリオの1ステップ（ログ1ブロック分） */
export interface ScenarioStep {
  chapter: DashboardChapter;
  /** 同一章内の見た目進行（承認ボタン表示など） */
  chapterPhase: number;
  /**
   * 画面更新の直前に表示する説明テロップ（読了後にログ・UIが現れる）
   * @default 3000
   */
  telopDurationMs?: number;
  /**
   * ログ・画面表示後、次ステップへ進むまでの待ち（ゆっくり見せる）
   * @default 6000
   */
  holdAfterRevealMs?: number;
  /** @deprecated スケジュールは telop + hold を使用 */
  delayMs?: number;
  /** このステップの画面が動く直前に見せる説明文 */
  telop: string;
  /**
   * true のとき、再生でこのステップの冒頭テロップを出さない（直前ステップのシーン内で既に表示済み）
   */
  skipOpeningTelop?: boolean;
  lines: ScenarioLogLine[];
}

export interface HomeCardDef {
  id: HomeCardId;
  title: string;
  subtitle: string;
  /** デモ章への入口 */
  interactive: boolean;
  /** ハイライト対応する章（装飾カードは undefined） */
  targetChapter?: Exclude<DashboardChapter, "home">;
}
