/**
 * 集客トップ（課題提示・6パターン）用コピーとデータ
 * 文言の基準: docs/集客LP完成文_2026-05.md のファーストビュー・課題共感
 */

export const homeAcquisitionHeroCopy = {
  tagline: "話すだけで、次が見えてくる。",
  subline:
    "AXEONは、ただ情報を並べるだけのサイトではありません。\nAIとの対話を通じて、頭の中にある漠然とした悩みを、最短で整理します。\n日報、写真、問い合わせ対応など、定型業務に奪われる時間を減らし、\n人にしかできない判断と創造に集中できる環境づくりを支援します。",
  empathyHeading: "こんな状態が続いていませんか？",
  empathyLead:
    "手作業が多く、毎日の処理に時間がかかる。\n情報が散らばっていて、確認や引き継ぎに手間がかかる。\n担当者ごとに対応品質がぶれ、判断が遅れる。\nこうした状態は、現場の努力だけでは解消しにくい課題です。",
  empathyClosing:
    "いまの課題を完璧に言語化できていなくても問題ありません。下の参考パターンから近いものを選ぶか、まずは相談へ進んでください。",
  patternsHeading: "業務の型から考える、改善のヒント",
  patternsIntro:
    "よくある組み合わせです。自社に当てはまりそうなものがあれば、そこから具体的な話がしやすくなります。",
} as const;

export type HomeAcquisitionPattern = {
  id: string;
  title: string;
  pain: string;
  approach: string;
  outcomeHint: string;
  exampleLine?: string;
};

export const HOME_ACQUISITION_PATTERNS: readonly HomeAcquisitionPattern[] = [
  {
    id: "routine-automation",
    title: "定型作業・転記の自動化",
    pain: "日報・申請・データ入力が日々積み上がり、チェックと修正に追われている。",
    approach:
      "入力フォーム、チャット、音声メモからの抜き出しや、既存システム連携による自動登録を設計します。",
    outcomeHint: "入力・確認の工数を抑え、例外処理に集中できる状態へ。",
    exampleLine: "例：現場報告、受発注データ、顧客カルテの転記",
  },
  {
    id: "information-scatter",
    title: "情報の散在と検索コスト",
    pain: "チャット、ファイル、台帳に情報が分かれ、都度「どこにあったか」を探している。",
    approach:
      "検索しやすい索引、タグ付け、要約・一覧ビュー、必要に応じたナレッジ化の仕組みを開発・導入します。",
    outcomeHint: "引き継ぎと照会のスピードを上げ、抜け漏れを減らします。",
    exampleLine: "例：図面・見積・過去メールの横断検索",
  },
  {
    id: "approval-bottleneck",
    title: "承認・確認の滞留",
    pain: "稟議、在庫・金額確認などで待ちが発生し、現場の手が止まる。",
    approach:
      "ルール化できる条件はシステム判定に寄せ、例外だけ人に上がるフローを設計します。通知・リマインドも含めます。",
    outcomeHint: "待ち時間と差し戻しを減らし、判断の抜け漏れを防ぎます。",
    exampleLine: "例：割引承認、在庫引当、見積の上長確認",
  },
  {
    id: "customer-response",
    title: "顧客対応のばらつきとスピード",
    pain: "問い合わせ対応が担当依存で品質が不均一。一次返信までに時間がかかる。",
    approach:
      "よくある問い合わせの下書き、ナレッジ提示、エスカレーション条件を組み込んだ対応支援を構築します。",
    outcomeHint: "初動の均一化と対応時間の短縮、属人化の緩和。",
    exampleLine: "例：BtoB問い合わせ窓口、予約変更、クレーム一次対応",
  },
  {
    id: "visibility-gap",
    title: "現場と本社の認識のズレ",
    pain: "数字や稼働状況がすぐに見えず、会議と根回しに時間がかかる。",
    approach:
      "既存データの集計・可視化、ダッシュボード、定期レポートの自動生成を検討・実装します。",
    outcomeHint: "状況の共有が早まり、意思決定と優先順位付けがしやすくなります。",
    exampleLine: "例：工数・売上粗利・案件ステータスの見える化",
  },
  {
    id: "reporting-load",
    title: "レポート・集計の手作り負荷",
    pain: "月次や監査、KPI提出のたびにExcel集計やコピペが発生している。",
    approach:
      "データ取得元と提出形式に合わせた集計パイプ、テンプレ出力、半自動チェックを開発します。",
    outcomeHint: "締め作業の短縮と、集計ミスの削減。",
    exampleLine: "例：月次実績、原価集計、コンプライアンス用エビデンス",
  },
] as const;

const patternById = new Map<string, HomeAcquisitionPattern>(
  HOME_ACQUISITION_PATTERNS.map((p) => [p.id, p])
);

export function getHomeAcquisitionPatternById(
  id: string | null | undefined
): HomeAcquisitionPattern | null {
  if (!id) return null;
  return patternById.get(id) ?? null;
}

/**
 * トップページに出すフィーチャー業務（4件）。
 * 「全方位カバー」より「代表的な型に当てはまる人に刺す」狙いで、
 * 入力負荷・情報分散・顧客対応・レポート集計の4軸を採用。
 */
export const FEATURED_PATTERN_IDS = [
  "routine-automation",
  "information-scatter",
  "customer-response",
  "reporting-load",
] as const;

export type FeaturedPatternId = (typeof FEATURED_PATTERN_IDS)[number];

export const FEATURED_HOME_ACQUISITION_PATTERNS: readonly HomeAcquisitionPattern[] =
  FEATURED_PATTERN_IDS.map((id) => {
    const item = HOME_ACQUISITION_PATTERNS.find((p) => p.id === id);
    if (!item) {
      throw new Error(`FEATURED_PATTERN_IDS に存在しない id が含まれています: ${id}`);
    }
    return item;
  });
