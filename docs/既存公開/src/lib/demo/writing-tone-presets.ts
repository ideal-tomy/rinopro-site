/**
 * デモの文体プリセット（モック返答の口調 + 実AI system への追記に使用）
 * Sanity aiDemo.writingTone と値を揃える
 */

export const WRITING_TONE_IDS = [
  "default",
  "real_estate",
  "legal",
  "care",
  "b2b_ops",
  "cs_support",
] as const;

export type AiDemoWritingTone = (typeof WRITING_TONE_IDS)[number];

export const WRITING_TONE_LABELS: Record<AiDemoWritingTone, string> = {
  default: "標準（バランス）",
  real_estate: "接客・ホスピタリティ（不動産・接客系）",
  legal: "慎重・法務寄り（士業・契約）",
  care: "やさしく配慮（介護・医療・福祉）",
  b2b_ops: "簡潔・業務（建設・製造・物流の現場メモ）",
  cs_support: "丁寧・感情配慮（問い合わせ・クレーム）",
};

/** GROQ / 旧データで未定義のとき */
export function normalizeWritingTone(
  value: string | undefined | null
): AiDemoWritingTone {
  if (!value) return "default";
  const v = value.trim().toLowerCase();
  return (WRITING_TONE_IDS as readonly string[]).includes(v)
    ? (v as AiDemoWritingTone)
    : "default";
}

/** 実AI（ai_live）の system に追記する文体指示 */
export function getWritingToneSystemInstruction(
  tone: AiDemoWritingTone
): string {
  const blocks: Record<AiDemoWritingTone, string> = {
    default: `【文体】
- 日本語で、ビジネス向けに自然な会話調と箇条書きを併用する。
- マークダウンの見出し記号（#）は使わず、普通の文章で返す。`,

    real_estate: `【文体・トーン：接客・ホスピタリティ】
- お客様（内見者・入居検討者）への配慮を最優先に、丁寧で前向きな接客文調にする。
- 過度な断定や煽りは避け、「〜かと思います」「〜がおすすめです」など柔らかい表現を使う。
- マークダウンの見出し記号（#）は使わず、段落と箇条書きで読みやすく返す。`,

    legal: `【文体・トーン：慎重・法務寄り】
- 法的判断・最終結論の断定は避け、「要確認」「前提次第」など留保を明示する。
- 事実と推測を分け、確認すべき論点を箇条書きで示す。
- マークダウンの見出し記号（#）は使わず、落ち着いたビジネス文書調で返す。`,

    care: `【文体・トーン：やさしく配慮（介護・医療・福祉）】
- 利用者・ご家族への配慮を示す言い回しを用いる（押し付けない）。
- 専門用語は必要最小限にし、平易な言葉を補う。
- マークダウンの見出し記号（#）は使わず、短い段落と箇条書きで返す。`,

    b2b_ops: `【文体・トーン：簡潔・業務（現場・オペレーション）】
- 前置きは短く、優先度・次アクション・期限が一目で分かるようにする。
- 箇条書きを積極的に使う。冗長な敬語は抑える。
- マークダウンの見出し記号（#）は使わない。`,

    cs_support: `【文体・トーン：問い合わせ・クレーム対応】
- まず共感とお詫びのニュアンスを入れ、事実確認と次のステップを明確にする。
- 感情的な言い回しに煽られず、冷静かつ丁寧に。
- マークダウンの見出し記号（#）は使わず、お客様向け文面として自然に返す。`,
  };
  return blocks[tone];
}

/** モック返答の冒頭・締め・見出しラベルをプリセットで差し替え */
export function getMockTonePhrasing(tone: AiDemoWritingTone): {
  thanks: string;
  received: (preview: string, concern: string) => string;
  bodyIntro: (title: string) => string;
  summaryHeading: string;
  actionHeading: string;
  closing: string[];
} {
  switch (tone) {
    case "real_estate":
      return {
        thanks: "お問い合わせありがとうございます。内容を拝見しました。",
        received: (preview, concern) =>
          `「${preview}」というご状況ですね。まずは${concern}の観点で整理し、次のご提案につなげます。`,
        bodyIntro: (title) =>
          `${title}の観点では、現時点では次のようにまとめるのが自然かと思います。`,
        summaryHeading: "内見・状況の整理（お客様向けにそのまま使える粒度）",
        actionHeading: "次にお伝えすると良いこと・社内メモ",
        closing: [
          "トーンは「丁寧・前向き」「簡潔」のどちら寄りにするか、ご希望があれば合わせて整えます。",
        ],
      };
    case "legal":
      return {
        thanks: "ご共有ありがとうございます。内容を確認しました。",
        received: (preview, concern) =>
          `「${preview}」という事案として受け取りました。法的な最終判断ではなく、現時点で整理できる論点として${concern}を中心にまとめます（要確認事項は明示します）。`,
        bodyIntro: (title) =>
          `${title}について、前提が変わると結論も変わり得るため、たたき台として次をご参照ください。`,
        summaryHeading: "整理した論点・事実関係の仮整理",
        actionHeading: "確認・フォローすべき事項（次アクション）",
        closing: [
          "必要書面・契約条文の有無によって表現は調整が必要です。確定稿は担当者レビューを前提にしてください。",
        ],
      };
    case "care":
      return {
        thanks: "共有ありがとうございます。内容を拝見しました。",
        received: (preview, concern) =>
          `「${preview}」という内容ですね。利用者様・ご家族の不安が残らないよう、${concern}を踏まえてわかりやすく整理します。`,
        bodyIntro: (title) =>
          `${title}として、現場で共有しやすい形にしたたき台は次のとおりです。`,
        summaryHeading: "状況の整理（やさしい言葉で）",
        actionHeading: "見守り・連絡・引き継ぎのポイント",
        closing: [
          "医療・介護の個別判断が必要な場合は、必ず専門職の指示に従ってください。",
        ],
      };
    case "b2b_ops":
      return {
        thanks: "共有ありがとうございます。内容確認しました。",
        received: (preview, concern) =>
          `入力「${preview}」を${concern}中心に要約し、次アクションに落とし込みます。`,
        bodyIntro: (title) =>
          `${title} — たたき台（優先度つき）`,
        summaryHeading: "要点（一次整理）",
        actionHeading: "次アクション（担当・期限を追記して使う想定）",
        closing: [
          "現場名・日付・担当を追記すれば、そのまま朝礼・チャンネル投稿にも使えます。",
        ],
      };
    case "cs_support":
      return {
        thanks: "お問い合わせの内容、ありがとうございます。確認しました。",
        received: (preview, concern) =>
          `「${preview}」というご連絡として受け止めました。ご不便をおかけしている可能性がある点は${concern}として丁寧に扱います。`,
        bodyIntro: (title) =>
          `${title}として、お客様向けの返信たたき台と社内共有メモを分けて書くと運用しやすいです。`,
        summaryHeading: "状況整理（お客様向けに言い換えた要約）",
        actionHeading: "返信文の骨子・社内メモ",
        closing: [
          "トーンは「お詫び強め / 事実確認中心」のどちらに寄せるか指定いただければ調整します。",
        ],
      };
    default:
      return {
        thanks: "ありがとうございます。内容を確認しました。",
        received: (preview, concern) =>
          `「${preview}」というご相談として受け取り、まずは${concern}を中心に整理します。`,
        bodyIntro: (title) =>
          `${title}として、現時点のたたき台は次のとおりです。`,
        summaryHeading: "要点（一次整理）",
        actionHeading: "次アクション（そのまま使える文面・指示）",
        closing: [
          "必要であれば、お客様向けの返信トーン（丁寧/簡潔）や社内共有の粒度に合わせて最終版まで整えます。",
        ],
      };
  }
}

/**
 * シード用: industry / industryTags から推論（明示 writingTone が無いとき）
 */
export function inferWritingToneFromDemoTags(input: {
  industry?: string;
  industryTags?: string[];
}): AiDemoWritingTone {
  const tags = input.industryTags ?? [];
  const has = (t: string) => tags.includes(t);

  if (has("士業") || input.industry === "legal") {
    return "legal";
  }
  if (has("介護") || has("医療")) {
    return "care";
  }
  if (has("不動産") || has("小売") || has("飲食") || has("EC") || has("サービス")) {
    return "real_estate";
  }
  if (
    has("建設") ||
    has("製造") ||
    has("物流") ||
    input.industry === "construction" ||
    input.industry === "manufacturing"
  ) {
    return "b2b_ops";
  }
  return "default";
}
