/** 数値メモからレポート草案を返すモック */

export interface OpsReportMockResult {
  headline: string;
  kpis: { label: string; value: string; delta: string }[];
  narrative: string;
  nextActions: string[];
}

export function buildOpsReportMock(raw: string): OpsReportMockResult {
  const lines = raw
    .split(/\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  const kpis =
    lines.length > 0
      ? lines.slice(0, 4).map((l, i) => ({
          label: `指標${i + 1}`,
          value: l.slice(0, 24) + (l.length > 24 ? "…" : ""),
          delta: i === 0 ? "+2.1% 先週比" : "±0%",
        }))
      : [
          { label: "売上（例）", value: "—", delta: "入力で反映" },
          { label: "稼働率（例）", value: "—", delta: "入力で反映" },
        ];

  return {
    headline: "週次オペレーションサマリ",
    kpis,
    narrative:
      "入力されたメモをもとに、重点課題とトレンドを1段落に圧縮した体験です。実装では部門・期間・目標値をヒアリングし、グラフとアラート閾値まで含めて生成できます。",
    nextActions: [
      "在庫偏りが続くSKUの上位3件を確認",
      "遅延理由タグの分類ルールを週次で見直し",
    ],
  };
}
