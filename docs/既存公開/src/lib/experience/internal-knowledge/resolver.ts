import type { IndustryDataset, KbChunk, PolicyFlag } from "./types";

function policyRulesForPrompt(flags: PolicyFlag[]): string {
  const lines: string[] = [];
  if (flags.includes("pricing_kb_only")) {
    lines.push(
      "料金・条件・数値については、参照ナレッジに明記がある場合のみ回答し、推測や補完はしないこと。"
    );
  }
  if (flags.includes("cite_required")) {
    lines.push("回答の根拠となった社内資料名と条・節を必ず「引用元」に列挙すること。");
  }
  if (flags.includes("no_diagnosis")) {
    lines.push("診断・治療の判断は行わず、受付・手続きの範囲にとどめること。");
  }
  if (flags.includes("no_legal_advice")) {
    lines.push("法的判断・契約の有効性の断定は行わず、担当（法務・宅建士等）への確認を促すこと。");
  }
  if (flags.includes("no_investment_advice")) {
    lines.push("投資助言・商品の推奨は行わず、一般説明とコンプライアンス上の注意にとどめること。");
  }
  return lines.join("\n");
}

export function getKbChunksForRequest(
  dataset: IndustryDataset,
  kbRefIds: string[]
): KbChunk[] {
  if (kbRefIds.length === 0) {
    return [...dataset.kb];
  }
  const map = new Map(dataset.kb.map((k) => [k.id, k] as const));
  return kbRefIds
    .map((id) => map.get(id))
    .filter((k): k is KbChunk => Boolean(k));
}

export function formatKnowledgeBlocks(chunks: KbChunk[]): string {
  return chunks
    .map(
      (k) =>
        `---\n[${k.title} / ${k.section}]\n${k.body}\n---`
    )
    .join("\n\n");
}

export function buildKnowledgeBotSystemPrompt(args: {
  dataset: IndustryDataset;
  kbChunks: KbChunk[];
  pathLabels: string[];
  freeformText?: string;
}): string {
  const { dataset, kbChunks, pathLabels, freeformText } = args;
  const path = pathLabels.length > 0 ? pathLabels.join(" > ") : "（未選択）";
  const question =
    freeformText?.trim() ||
    (pathLabels.length > 0 ? pathLabels[pathLabels.length - 1] : "一般問い合わせ");

  const kbBlock =
    kbChunks.length > 0
      ? formatKnowledgeBlocks(kbChunks)
      : "（参照ナレッジなし）";

  const policyExtra = policyRulesForPrompt(dataset.policies);

  return [
    dataset.systemPreamble,
    "",
    `あなたは「${dataset.label}」向けの社内ナレッジ案内ボットです。`,
    dataset.toneInstruction,
    "",
    "【回答ルール】",
    "1. 必ず下記「参照ナレッジ」の範囲内で回答すること。記載がない事項は、推測せず次のように返答すること：",
    `   「社内ナレッジに該当する記載がありません。${dataset.escalationContact}へお問い合わせください。」`,
    "2. 回答は簡潔に。必要に応じて箇条書き（最大5項目程度）。",
    "3. 回答本文の後に、必ず次の見出しで引用を書くこと：",
    "   「引用元」",
    "   - 資料名（セクション名）を列挙。参照しなかった資料は書かない。",
    policyExtra ? `4. 追加制約:\n${policyExtra}` : "",
    "",
    "【参照ナレッジ】",
    kbBlock,
    "",
    "【ユーザーの選択経路】",
    path,
    "",
    "【ユーザーの質問】",
    question,
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildKnowledgeBotUserMessage(): string {
  return "上記に基づき、社内向けに回答してください。引用元は必ず最後に記載してください。";
}

export function getCitationsMeta(
  dataset: IndustryDataset,
  kbRefIds: string[]
): { id: string; title: string; section: string }[] {
  return getKbChunksForRequest(dataset, kbRefIds).map((k) => ({
    id: k.id,
    title: k.title,
    section: k.section,
  }));
}
