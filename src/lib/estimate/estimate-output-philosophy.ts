import type { EstimateDetailedAiOutput } from "@/lib/estimate/estimate-snapshot";

/** 詳細見積の全チャネルで共有する「具体化・スコープ」に関する一文（営業色を抑えたトーン） */

export const ESTIMATE_PHILOSOPHY_ASSUMPTION_BULLET =
  "開発の内容や実装には、はじめからすべてが固まらないことがあります。不確実なまま進めると、のちのち「必要以上の機能（オーバースペック）」が増えたり、認識のずれで手戻りが出たりしやすくなります。実現したいことを具体的にそろえていくことは、正しい金額感を出すうえでも、最小コストに近づけるうえでも欠かせません。わからない点は、無理に決めず、あとから一緒に整理する前提でも問題ありません。";

/** UI・Markdown 用の同趣旨の段落（見出しなし本文） */
export const ESTIMATE_PHILOSOPHY_UI_PARAGRAPH = ESTIMATE_PHILOSOPHY_ASSUMPTION_BULLET;

export const ESTIMATE_PHILOSOPHY_MARKDOWN_HEADING = "見積もりにあたって";

export function applyEstimateOutputPhilosophy(output: EstimateDetailedAiOutput): void {
  if (output.assumptions[0] === ESTIMATE_PHILOSOPHY_ASSUMPTION_BULLET) return;
  output.assumptions = [ESTIMATE_PHILOSOPHY_ASSUMPTION_BULLET, ...output.assumptions];
}
