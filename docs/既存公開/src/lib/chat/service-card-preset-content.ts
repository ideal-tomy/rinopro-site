/**
 * サービスページのカード経由チャット：プリセット定義と固定回答。
 * ラベル文字列は UI と完全一致させること。
 * 返信は【次の一歩】を含まない（行動誘導は下部 CTA ブロックに一本化）。
 */

import {
  createFactEmission,
  createQuestionChoice,
  type QuestionChoiceDefinition,
} from "@/lib/chat/question-definition";

export type ServicePresetVariant = "development" | "consulting";

// ---------------------------------------------------------------------------
// Step 1 定義（2〜3 項目。「自由記述で相談する」は UI 側で付加）
// ---------------------------------------------------------------------------

export type DevStep1Key = "dev_what" | "dev_cost";
export type ConStep1Key = "con_support" | "con_outcome";
export type ServiceStep1Key = DevStep1Key | ConStep1Key;

export const DEV_STEP1_DEFS: ReadonlyArray<{ key: DevStep1Key; label: string }> = [
  { key: "dev_what", label: "作りたい業務ツールを整理したい" },
  { key: "dev_cost", label: "進め方と概算の目安を知りたい" },
] as const;

export const CON_STEP1_DEFS: ReadonlyArray<{ key: ConStep1Key; label: string }> = [
  { key: "con_support", label: "業務整理から伴走してほしい" },
  { key: "con_outcome", label: "改善成果のイメージを固めたい" },
] as const;

export function getStep2Labels(
  variant: ServicePresetVariant,
  step1Key: string
): readonly string[] {
  return getStep2Defs(variant, step1Key).map((def) => def.label);
}

export function getServiceStep1Defs(variant: ServicePresetVariant) {
  return variant === "development"
    ? DEV_STEP1_QUESTION_DEFS
    : CON_STEP1_QUESTION_DEFS;
}

export function getStep2Defs(
  variant: ServicePresetVariant,
  step1Key: string
): readonly QuestionChoiceDefinition[] {
  if (variant === "development") {
    return SERVICE_STEP2_DEFS.development[step1Key as DevStep1Key] ?? [];
  }
  return SERVICE_STEP2_DEFS.consulting[step1Key as ConStep1Key] ?? [];
}

export function getServicePresetDefinition(
  variant: ServicePresetVariant,
  optionId: string
): QuestionChoiceDefinition | undefined {
  const step1Def = getServiceStep1Defs(variant).find((def) => def.optionId === optionId);
  if (step1Def) return step1Def;
  return Object.values(
    variant === "development"
      ? SERVICE_STEP2_DEFS.development
      : SERVICE_STEP2_DEFS.consulting
  )
    .flat()
    .find((def) => def.optionId === optionId);
}

// ---------------------------------------------------------------------------
// 最終ラベル一覧（後方互換・型参照用）
// ---------------------------------------------------------------------------

export const DEVELOPMENT_PRESET_LABELS = [
  "開発できるものを知りたい",
  "技術スタックを知りたい",
  "開発コストの目安を知りたい",
  "期間の目安を知りたい",
  "必要な環境・準備を知りたい",
] as const;

export const CONSULTING_PRESET_LABELS = [
  "具体的な支援内容を知りたい",
  "実績・進め方を知りたい",
  "期待できる成果を知りたい",
  "費用感を知りたい",
] as const;

export type DevelopmentPresetLabel = (typeof DEVELOPMENT_PRESET_LABELS)[number];
export type ConsultingPresetLabel = (typeof CONSULTING_PRESET_LABELS)[number];

const DEV_STEP1_QUESTION_DEFS: ReadonlyArray<QuestionChoiceDefinition<DevStep1Key>> = [
  createQuestionChoice("dev_what", "作りたい業務ツールを整理したい", [
    createFactEmission("entryIntent", "candidate"),
    createFactEmission("productCategory", "candidate"),
  ]),
  createQuestionChoice("dev_cost", "進め方と概算の目安を知りたい", [
    createFactEmission("entryIntent", "candidate"),
    createFactEmission("desiredReply", "candidate"),
  ]),
] as const;

const CON_STEP1_QUESTION_DEFS: ReadonlyArray<QuestionChoiceDefinition<ConStep1Key>> = [
  createQuestionChoice("con_support", "業務整理から伴走してほしい", [
    createFactEmission("entryIntent", "candidate"),
    createFactEmission("desiredReply", "candidate"),
  ]),
  createQuestionChoice("con_outcome", "改善成果のイメージを固めたい", [
    createFactEmission("entryIntent", "candidate"),
    createFactEmission("desiredReply", "candidate"),
  ]),
] as const;

const SERVICE_STEP2_DEFS = {
  development: {
    dev_what: [
      createQuestionChoice("開発できるものを知りたい", "開発できるものを知りたい", [
        createFactEmission("productCategory", "candidate"),
        createFactEmission("productArchetype", "candidate"),
      ]),
      createQuestionChoice("技術スタックを知りたい", "技術スタックを知りたい", [
        createFactEmission("desiredReply", "candidate"),
        createFactEmission("entryIntent", "candidate"),
      ]),
    ],
    dev_cost: [
      createQuestionChoice("開発コストの目安を知りたい", "開発コストの目安を知りたい", [
        createFactEmission("desiredReply", "candidate"),
        createFactEmission("entryIntent", "candidate"),
      ]),
      createQuestionChoice("期間の目安を知りたい", "期間の目安を知りたい", [
        createFactEmission("timeline", "candidate"),
        createFactEmission("desiredReply", "candidate"),
      ]),
      createQuestionChoice(
        "必要な環境・準備を知りたい",
        "必要な環境・準備を知りたい",
        [
          createFactEmission("constraints", "candidate"),
          createFactEmission("desiredReply", "candidate"),
        ]
      ),
    ],
  },
  consulting: {
    con_support: [
      createQuestionChoice("具体的な支援内容を知りたい", "具体的な支援内容を知りたい", [
        createFactEmission("entryIntent", "candidate"),
        createFactEmission("desiredReply", "candidate"),
      ]),
      createQuestionChoice("実績・進め方を知りたい", "実績・進め方を知りたい", [
        createFactEmission("desiredReply", "candidate"),
        createFactEmission("entryIntent", "candidate"),
      ]),
    ],
    con_outcome: [
      createQuestionChoice("期待できる成果を知りたい", "期待できる成果を知りたい", [
        createFactEmission("desiredReply", "candidate"),
        createFactEmission("currentPain", "candidate"),
      ]),
      createQuestionChoice("費用感を知りたい", "費用感を知りたい", [
        createFactEmission("desiredReply", "candidate"),
        createFactEmission("entryIntent", "candidate"),
      ]),
    ],
  },
} as const;

// ---------------------------------------------------------------------------
// 固定返信（受容→言語化→判断軸。行動誘導は CTA ブロックへ）
// ---------------------------------------------------------------------------

const DEVELOPMENT_PRESET_REPLIES: Record<DevelopmentPresetLabel, string> = {
  "開発できるものを知りたい":
    "業務に合ったWebアプリ・社内ツール・既存システムとのAPI連携など、「現場の詰まり」を解く実装が中心です。" +
    "いきなり大規模な基幹刷新より、課題を1つ切り出してプロトタイプで形を見せ、現場の反応を確認しながら広げる進め方が向いているケースが多いです。" +
    "公開範囲・ユーザー数・セキュリティ要件によって最適な構成は変わります。" +
    "「今一番手間のかかっている業務」を1つ思い浮かべると、開発対象が絞り込みやすくなります。",

  "技術スタックを知りたい":
    "既存環境やチームの習熟度によって選定が変わるため、一概に「これを使う」とは言い切れないのが実情です。" +
    "判断に使える軸は「長く触る人が扱いやすいか」と「採用・外注時に説明しやすいか」の2点です。" +
    "流行りの技術より、保守・引き継ぎのしやすさを優先するほうが現場定着の観点で有利です。" +
    "既存で必須の言語やプラットフォームがあれば、それに合わせた構成から提案できます。",

  "開発コストの目安を知りたい":
    "費用は「何をどこまで作るか」と「既存システムとの接続が必要かどうか」で大きく変わります。" +
    "「試作（1業務・小規模）から始めるか」「複数業務を一気に実装するか」で概算の桁が変わります。" +
    "運用・保守の扱いをどこまで含めるかでも総額感は変わるため、まず「最小単位」を決めるところから始めるのが現実的です。" +
    "概算の土台を作るには、「まずこれだけは自動化したい」という最小単位が決まると動きやすくなります。",

  "期間の目安を知りたい":
    "期間は「何をどこまで仕上げるか」で大きく変わります。" +
    "単機能の試作なら2〜4週間で確認サイクルを回せる一方、複数部署・外部連携を含む本実装は1〜2ヶ月以上かかることが多いです。" +
    "社内承認・セキュリティレビューのリードタイムもカレンダー上の実感に直結します。" +
    "「いつまでに、誰が、何を試したいか」のゴールが決まると、逆算した段取りを出しやすくなります。",

  "必要な環境・準備を知りたい":
    "最低限必要なのは「要件を言語化できる担当者」と「テスト用のサンプルデータ」の2点です。" +
    "クラウド利用可否・社内VPNルール・個人情報の取り扱いなどは早めに確認しておくと手戻りを減らせます。" +
    "すべてが揃ってからでなくても大丈夫です。不明点は対話で埋めていく形で問題ありません。" +
    "「社内で決まっている制約（クラウド・認証方式）」があれば、それが最初の確認ポイントになります。",
};

const CONSULTING_PRESET_REPLIES: Record<ConsultingPresetLabel, string> = {
  "具体的な支援内容を知りたい":
    "課題がまだ言葉にできていない状態から入ってもらって大丈夫です。" +
    "業務課題の整理・プロセスの可視化・改善案の優先付けに加え、検証設計や社内合意形成まで、フェーズに応じて伴走します。" +
    "開発に落とし込む前の「何を決めるべきか」を整理するところから入ることも多く、課題が曖昧な段階でもヒアリングから構造化できます。" +
    "「今一番時間やストレスがかかっている業務」を1つ教えてもらえると、支援の入口が具体化します。",

  "実績・進め方を知りたい":
    "進め方は「現状把握→課題の仮説→検証→施策化」のループを短いサイクルで回すことを重視します。" +
    "関係者が多いほど合意形成の設計に時間を割くほうが後戻りが減ります。" +
    "実績については機密に配慮しつつ、あなたの状況に近い論点を一緒に探します。" +
    "「近い規模・業種の事例が知りたい」という点があれば、そこから話を絞り込めます。",

  "期待できる成果を知りたい":
    "成果は「数字の改善」だけでなく、現場の負担軽減・判断スピードの向上・属人化の解消など多面的に定義できます。" +
    "組織の受け止め方やデータの質によって効果の出方は変わるため、過大な約束はせず検証可能な単位で期待値を調整していきます。" +
    "「半年後にこれが良くなっていれば成功」という状態を1つ決めておくと、進捗の見え方がはっきりします。" +
    "まず「成功のラインを言語化」するところから始めると、支援の全体像が見えてきます。",

  "費用感を知りたい":
    "費用は「支援範囲（週あたりの関与度・期間）」と「成果物の形式（報告書のみか、ワークショップ込みか）」で変動します。" +
    "「診断だけ」か「実装まで伴走」かで概算の桁が変わります。" +
    "小さな診断から始め、深掘りが必要な部分だけ段階的に拡張する方法もあります。" +
    "「想定している期間や関与の頻度」が決まると、概算の土台ができます。",
};

export type ServiceCardPresetVariant = "development" | "consulting";

export function getServiceCardPresetReply(
  variant: ServiceCardPresetVariant,
  label: string
): string | undefined {
  if (variant === "development") {
    return DEVELOPMENT_PRESET_REPLIES[label as DevelopmentPresetLabel];
  }
  return CONSULTING_PRESET_REPLIES[label as ConsultingPresetLabel];
}
