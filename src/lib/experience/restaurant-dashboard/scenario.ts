import type { HomeCardDef, ScenarioStep } from "./types";

export const HOME_CARDS: HomeCardDef[] = [
  {
    id: "shift",
    title: "シフト管理",
    subtitle: "提出・承認",
    interactive: true,
    targetChapter: "shift",
  },
  {
    id: "sales_traffic",
    title: "売上・入客",
    subtitle: "推移・分析",
    interactive: true,
    targetChapter: "traffic",
  },
  {
    id: "expense_settlement",
    title: "経費・精算",
    subtitle: "レシート・申告",
    interactive: true,
    targetChapter: "receipts",
  },
  {
    id: "cloud",
    title: "クラウド連携",
    subtitle: "POS・会計",
    interactive: false,
  },
  {
    id: "products",
    title: "商品登録",
    subtitle: "メニュー・価格",
    interactive: false,
  },
  {
    id: "stores",
    title: "店舗一覧",
    subtitle: "3店舗",
    interactive: false,
  },
  {
    id: "notifications",
    title: "通知設定",
    subtitle: "LINE・メール",
    interactive: false,
  },
  {
    id: "reports",
    title: "レポート",
    subtitle: "月次エクスポート",
    interactive: false,
  },
];

/** ①〜⑤をつなぐ再生シナリオ（各ステップ: テロップ → クロスフェードでログ・画面） */
export const DEMO_SCENARIO_STEPS: ScenarioStep[] = [
  // ① シフト
  {
    chapter: "shift",
    chapterPhase: 0,
    telop:
      "スタッフのシフト希望を集め、勤務可否と法令の範囲で仮シフトを自動組み立てします。",
    telopDurationMs: 3000,
    /** ログ→②テロップ→承認演出 まで含めたホールド（次ステップへ） */
    holdAfterRevealMs: 15000,
    lines: [
      {
        phase: "trigger",
        text: "アルバイト3名がシフト希望を送信",
      },
      {
        phase: "process",
        text: "勤務可能時間と法令上の拘束を照合し、候補シフトを自動生成",
      },
      {
        phase: "notify",
        text: "店長アプリに「承認待ち3件」を通知",
      },
      {
        phase: "state",
        text: "カレンダーに仮シフトが反映（承認前）",
      },
    ],
  },
  {
    chapter: "shift",
    chapterPhase: 1,
    telop:
      "店長が一括承認するとシフトが確定し、スタッフへ通知。給与計算の元データにも連携します。",
    telopDurationMs: 3000,
    /** ①のシーン内で上記テロップを既に表示するため、ここでは頭出ししない */
    skipOpeningTelop: true,
    holdAfterRevealMs: 6200,
    lines: [
      {
        phase: "trigger",
        text: "店長が「一括承認」を実行",
      },
      {
        phase: "process",
        text: "シフト確定・スタッフへ確定通知を送信",
      },
      {
        phase: "notify",
        text: "LINE公式に確定シフトを配信（モック）",
      },
      {
        phase: "state",
        text: "① シフト確定済み → 給与計算の元データに連携",
      },
    ],
  },
  // ② 入客
  {
    chapter: "traffic",
    chapterPhase: 0,
    telop:
      "POSの来店データを取り込み、曜日ごとの忙しさをグラフで可視化します。",
    telopDurationMs: 3000,
    holdAfterRevealMs: 6200,
    lines: [
      {
        phase: "trigger",
        text: "POSから前週の来店件数を取り込み",
      },
      {
        phase: "process",
        text: "曜日別に集計し、ピーク帯スコアを算出",
      },
      {
        phase: "notify",
        text: "週次レポート下書きを管理者に共有",
      },
      {
        phase: "state",
        text: "② 金土日の忙しさをグラフで可視化",
      },
    ],
  },
  // ③ レシート・申告区分
  {
    chapter: "receipts",
    chapterPhase: 0,
    telop:
      "レシート画像から金額・取引先を読み取り、経費科目と確定申告用タグの案を自動付与します。",
    telopDurationMs: 3000,
    holdAfterRevealMs: 6200,
    lines: [
      {
        phase: "trigger",
        text: "レシート画像が2件アップロードされた（デモ）",
      },
      {
        phase: "process",
        text: "OCRで日付・金額・取引先を抽出し、経費科目を自動提案",
      },
      {
        phase: "notify",
        text: "税理士共有用の「要確認」フラグを付与（按分など）",
      },
      {
        phase: "state",
        text: "③ 確定申告用タグまでドラフト反映（本番は要確認）",
      },
    ],
  },
  // ④ 給与
  {
    chapter: "payroll",
    chapterPhase: 0,
    telop:
      "確定シフトから労働時間を集計し、時給マスタと照らして支給額を試算します。",
    telopDurationMs: 3000,
    holdAfterRevealMs: 6200,
    lines: [
      {
        phase: "trigger",
        text: "確定シフトから実労働時間を集計",
      },
      {
        phase: "process",
        text: "時給マスタと照合し、支給額を試算（控除は簡略）",
      },
      {
        phase: "notify",
        text: "支払日7日前に店長へ試算サマリを通知",
      },
      {
        phase: "state",
        text: "④ 給与試算一覧を生成（デモ表示のみ）",
      },
    ],
  },
  // ⑤ 未払い・精算済み
  {
    chapter: "expenses",
    chapterPhase: 0,
    telop:
      "仕入・経費の支払ステータスを同期し、未払いと精算済みを一覧で確認できるようにします。",
    telopDurationMs: 3000,
    holdAfterRevealMs: 6200,
    lines: [
      {
        phase: "trigger",
        text: "仕入・経費の支払ステータスを同期",
      },
      {
        phase: "process",
        text: "未払いを期限順に並べ、精算済みを締め月で集約",
      },
      {
        phase: "notify",
        text: "未払いが期日接近時にリマインド（モック）",
      },
      {
        phase: "state",
        text: "⑤ 未払い／精算済みを一覧で確認可能",
      },
    ],
  },
];

export const CHAPTER_LABELS: Record<string, string> = {
  home: "ホーム",
  shift: "① シフト管理",
  traffic: "② 売上・入客",
  receipts: "③ 経費・レシート",
  payroll: "④ 給与試算",
  expenses: "⑤ 精算・未払い",
};

export const LOG_PHASE_LABELS: Record<string, string> = {
  trigger: "トリガー",
  process: "処理",
  notify: "通知",
  state: "状態更新",
};
