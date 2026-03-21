/**
 * aiDemo を Sanity に投入するシードスクリプト
 *
 * 実行: npm run seed:ai-demos
 * 必要: .env.local に SANITY_API_TOKEN と Sanity 設定
 *
 * existingDemos: 10本（1本 ai_live + 9本 mock_preview）
 * nextMockDemos: 20本（全て mock_preview）
 */

import { config } from "dotenv";

// .env.local を読み込む（tsx は自動で読まないため）
config({ path: ".env.local" });

import { createClient } from "@sanity/client";
import {
  inferWritingToneFromDemoTags,
  normalizeWritingTone,
} from "../src/lib/demo/writing-tone-presets";
import { nextMockDemos } from "./next-20-demos-data";

const projectId =
  process.env.SANITY_PROJECT_ID ?? process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET ?? process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
const token = process.env.SANITY_API_TOKEN;

if (!projectId || !dataset) {
  console.error("SANITY_PROJECT_ID と SANITY_DATASET を設定してください");
  process.exit(1);
}
if (!token) {
  console.error("書き込みには SANITY_API_TOKEN が必要です。.env.local に追加してください。");
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  token,
  useCdn: false,
});

/** 既存10本（1本 ai_live + 9本 mock_preview） */
const existingDemos = [
  {
    _type: "aiDemo",
    title: "現場監督の影武者",
    slug: { _type: "slug", current: "construction-shadow-foreman" },
    industry: "construction",
    inputType: "audio_text",
    inputPlaceholder: "現場の状況を音声で話すか、テキストで入力してください",
    runMode: "mock_preview",
    mockOutputPrimary: `## 1. 点検報告書

- 日付: 本日
- 場所: A棟3階
- 点検内容: 外壁下地の養生シート剥がれ
- 所見: 雨予報のため明日AM中に補修が必要。作業再開前に養生の確認を推奨。`,
    mockOutputSecondary: `## 2. 協力会社への指示メール

宛名: 外壁工事担当 〇〇様

用件: A棟3階の養生シート補修について
本日14時時点で養生シートが剥がれている箇所を確認しました。雨予報のため、明日AM中に補修をお願いします。作業再開前にご確認ください。

期限: 明日12時まで`,
    systemPrompt: `あなたは建設現場の「現場監督の影武者」です。`,
    outputStructure: `必ず以下の2セクションで出力すること。`,
    sampleData: [
      "本日14時、A棟3階。外壁下地の養生シートが剥がれている。雨予報なので明日AM中に補修してほしい",
      "B棟1階のコンクリート打設完了。養生期間7日。次工程は来週火曜から。協力会社に連絡が必要",
      "安全点検済み。足場の手すり1箇所ゆるみ。作業再開前に補修必須",
    ],
    ctaTitle: "あなたの帳票フォーマットに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "写真1枚＋音声メモから、点検報告書と協力会社への指示メールを自動生成。スマホだけで完結し、帰社後の事務作業が半減します。",
    industryTags: ["建設"],
    functionTags: ["音声入力", "報告書生成"],
    moduleTags: ["Whisper", "LLM"],
    oneLiner: "現場の音声から報告書と指示メールを即生成",
  },
  {
    _type: "aiDemo",
    title: "10年分の記憶を持つ秘書",
    slug: { _type: "slug", current: "legal-memory-secretary" },
    industry: "legal",
    inputType: "text_only",
    inputPlaceholder: "曖昧な質問を入力（例：3年前の港区のトラブル案件）",
    runMode: "mock_preview",
    mockOutputPrimary: `## 1. 検索結果の要約

- 該当案件: 2022年 港区〇〇町 賃貸トラブル（大家・入居者間）
- 関連文書: 賃貸契約書、メール往復（2022/3〜5月）、和解覚書
- キーワード: 原状回復、敷金返還、解約通知`,
    mockOutputSecondary: `## 2. 次アクション提案

1. 和解覚書の有効期限を確認する
2. 類似案件の判例を担当弁護士に共有する
3. 入居者側の連絡先が最新か確認する`,
    systemPrompt: `あなたは「10年分の記憶を持つ秘書」です。`,
    outputStructure: `必ず以下の2セクションで出力すること。`,
    sampleData: [
      "3年前の港区の賃貸トラブル案件。大家と入居者の間で何かあった",
      "〇〇社とのNDA。有効期限が切れているか確認したい",
      "去年の年末に締結した業務委託契約。解約条項を確認したい",
    ],
    ctaTitle: "まずは過去100ファイルでPoC（2週間）を無料で試せます。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "曖昧な質問から契約書・メール・チャットを横断検索し要約。探す時間0秒体験を実演し、再現性を示します。",
    industryTags: ["士業", "不動産"],
    functionTags: ["検索", "要約"],
    moduleTags: ["Vector DB", "LLM"],
    oneLiner: "曖昧な質問で過去案件を即検索・要約",
  },
  {
    _type: "aiDemo",
    title: "クレームをファンに変える返信下書き",
    slug: { _type: "slug", current: "service-claim-reply-assist" },
    industry: "manufacturing",
    inputType: "text_only",
    inputPlaceholder: "お客様からの問い合わせ・クレーム文をペーストしてください",
    runMode: "ai_live",
    writingTone: "cs_support",
    mockOutputPrimary: "",
    mockOutputSecondary: "",
    systemPrompt: `あなたは「クレームをファンに変える返信下書き」を生成するアシスタントです。忙しい時間帯の長文問い合わせ対応で精神的に消耗する悩みを解消します。

【役割】
- 問い合わせ文を解析し、怒りのポイントを分解する
- 丁寧かつポリシー準拠の返信案を3秒で提示する
- 担当者の負担減と炎上予防を同時に実現する
- 営業的な表現は一切使わない

【出力は必ず2つ】
1. お客様向け返信文（丁寧・ポリシー準拠。そのまま送信可能な形式）
2. 社内共有メモ（要点・再発防止のポイント。1〜3行）`,
    outputStructure: `必ず以下の2セクションで出力すること。見出しはそのまま使う。

## 1. お客様向け返信文
（丁寧・ポリシー準拠。そのまま送信可能な形式）

## 2. 社内共有メモ
（要点・再発防止のポイント。1〜3行）`,
    sampleData: [
      "注文から1週間経つのに届かない。連絡もない。どうなっているのか説明してほしい。",
      "商品に傷があった。高額なので交換か返金を希望する。",
      "前回の問い合わせにまだ返事が来ていない。至急対応してほしい。",
    ],
    ctaTitle: "よくある問い合わせ10件で精度検証を無料で実施します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "問い合わせ文を解析し、怒りのポイントを分解。丁寧かつポリシー準拠の返信案を即提示。担当者の負担減と炎上予防を同時に実現します。",
    industryTags: ["飲食", "小売", "サービス"],
    functionTags: ["問い合わせ対応", "返信生成"],
    moduleTags: ["LLM"],
    oneLiner: "問い合わせ文から返信案と社内メモを即生成",
  },
  {
    _type: "aiDemo",
    title: "議事録を3秒で",
    slug: { _type: "slug", current: "meeting-minutes-auto" },
    industry: "legal",
    inputType: "audio_text",
    inputPlaceholder: "会議の音声を録音するか、要点をテキストで入力してください",
    runMode: "mock_preview",
    mockOutputPrimary: `## 1. 議事録

- 日時: 2025/3/20 14:00〜15:00
- 参加者: 田中、佐藤、鈴木
- 議題: 新規プロジェクトの進捗確認
- 決定事項: 次回MTGは来週火曜。資料は金曜までに共有
- アクション: 佐藤→見積書作成、鈴木→スケジュール調整`,
    mockOutputSecondary: `## 2. 社内共有メモ

- クライアントへの報告は来週水曜を目標
- 予算承認待ちのため、発注は保留`,
    systemPrompt: `あなたは会議の議事録を自動生成するアシスタントです。`,
    outputStructure: `議事録と社内共有メモの2セクションで出力すること。`,
    sampleData: [
      "新規プロジェクトの進捗確認。佐藤が見積書、鈴木がスケジュールを担当。次回は来週火曜。",
      "クレーム対応の振り返り。再発防止策としてマニュアル更新を決定。",
      "予算承認の件。来週の役員会で承認見込み。発注は保留。",
    ],
    ctaTitle: "あなたの会議フォーマットに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "会議音声から議事録とアクション項目を自動抽出。議事録作成の手間をゼロにします。",
    industryTags: ["士業", "製造", "小売"],
    functionTags: ["音声入力", "議事録生成"],
    moduleTags: ["Whisper", "LLM"],
    oneLiner: "会議音声から議事録を即生成",
  },
  {
    _type: "aiDemo",
    title: "受注書を即作成",
    slug: { _type: "slug", current: "order-form-generator" },
    industry: "manufacturing",
    inputType: "text_only",
    inputPlaceholder: "受注内容を入力（品名・数量・納期など）",
    runMode: "mock_preview",
    mockOutputPrimary: `## 1. 受注書

- 受注番号: ORD-2025-0320-001
- 品名: 〇〇部品 A型 100個
- 数量: 100
- 単価: 1,200円（税別）
- 納期: 2025/4/15
- 支払条件: 納品後30日`,
    mockOutputSecondary: `## 2. 社内メモ

- 在庫確認済み。生産ライン空きあり
- 発注書は本日中に発行予定`,
    systemPrompt: `あなたは受注書を自動生成するアシスタントです。`,
    outputStructure: `受注書と社内メモの2セクションで出力すること。`,
    sampleData: [
      "〇〇部品A型100個、単価1200円、納期4/15、支払30日",
      "B型50個、特注仕様、納期5月末、見積済み",
      "C型200個、リピート注文、前回単価で",
    ],
    ctaTitle: "あなたの帳票フォーマットに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "受注内容を入力するだけで、受注書と社内メモを即生成。入力ミスを防ぎ、業務を効率化します。",
    industryTags: ["製造", "小売"],
    functionTags: ["帳票生成", "受注管理"],
    moduleTags: ["LLM"],
    oneLiner: "受注内容から受注書を即生成",
  },
  {
    _type: "aiDemo",
    title: "プレゼン資料の骨子作成",
    slug: { _type: "slug", current: "presentation-outline" },
    industry: "legal",
    inputType: "text_only",
    inputPlaceholder: "プレゼンのテーマ・対象・目的を入力してください",
    runMode: "mock_preview",
    mockOutputPrimary: `## 1. プレゼン骨子

1. 表紙・アジェンダ（1分）
2. 現状課題の整理（3分）
3. 提案内容の概要（5分）
4. 導入効果・ROI（3分）
5. 次のステップ（2分）
6. Q&A`,
    mockOutputSecondary: `## 2. 補足メモ

- スライド枚数目安: 15枚程度
- 資料共有は前日までに実施推奨`,
    systemPrompt: `あなたはプレゼン資料の骨子を作成するアシスタントです。`,
    outputStructure: `骨子と補足メモの2セクションで出力すること。`,
    sampleData: [
      "新規事業の投資説明会。経営層向け。15分。予算承認が目的",
      "導入事例の社内共有。営業向け。10分。横展開の検討",
      "技術選定の提案。開発チーム向け。20分。採用判断の材料",
    ],
    ctaTitle: "あなたのフォーマットに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "テーマと目的を入力するだけで、プレゼンの骨子と時間配分を即提示。資料作成の時間を半減します。",
    industryTags: ["士業", "製造", "建設"],
    functionTags: ["資料作成", "要約"],
    moduleTags: ["LLM"],
    oneLiner: "テーマからプレゼン骨子を即生成",
  },
  {
    _type: "aiDemo",
    title: "契約書レビューサマリ",
    slug: { _type: "slug", current: "contract-review-summary" },
    industry: "legal",
    inputType: "text_only",
    inputPlaceholder: "契約書の要点または懸念点を入力してください",
    runMode: "mock_preview",
    mockOutputPrimary: `## 1. レビューサマリ

- 解約条項: 30日前通知。違約金なし
- 秘密保持: 契約終了後2年間
- 責任制限: 損害賠償は直接損害に限定
- 準拠法: 日本法`,
    mockOutputSecondary: `## 2. 確認推奨事項

1. 知的財産権の帰属を明文化するか検討
2. 不可抗力条項の有無を確認`,
    systemPrompt: `あなたは契約書のレビューサマリを作成するアシスタントです。`,
    outputStructure: `レビューサマリと確認推奨事項の2セクションで出力すること。`,
    sampleData: [
      "業務委託契約。解約条項と秘密保持が気になる",
      "SaaS利用規約。データの取り扱いと責任制限を確認したい",
      "NDA。有効期限と範囲を確認したい",
    ],
    ctaTitle: "まずは1契約で無料レビューを実施します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "契約書の要点を入力すると、重要条項のサマリと確認推奨事項を即提示。法務負荷を軽減します。",
    industryTags: ["士業", "製造"],
    functionTags: ["契約レビュー", "要約"],
    moduleTags: ["LLM"],
    oneLiner: "契約書の要点からレビューサマリを即生成",
  },
  {
    _type: "aiDemo",
    title: "見積書ドラフト",
    slug: { _type: "slug", current: "quote-draft-generator" },
    industry: "manufacturing",
    inputType: "text_only",
    inputPlaceholder: "見積内容を入力（品目・数量・単価・納期など）",
    runMode: "mock_preview",
    mockOutputPrimary: `## 1. 見積書ドラフト

- 品目: 〇〇システム 導入支援
- 内容: 要件定義、設計、開発、テスト、導入
- 金額: 2,500,000円（税別）
- 納期: 契約から3ヶ月
- 有効期限: 本見積から30日`,
    mockOutputSecondary: `## 2. 社内メモ

- 競合相場と比較し妥当な水準
- オプション（保守契約）は別途提案可能`,
    systemPrompt: `あなたは見積書ドラフトを生成するアシスタントです。`,
    outputStructure: `見積書ドラフトと社内メモの2セクションで出力すること。`,
    sampleData: [
      "システム導入支援。要件定義から導入まで。250万円、3ヶ月",
      "保守契約。月額5万円、年間60万円。 SLA 99.9%",
      "カスタマイズ開発。50人日、単価8万円",
    ],
    ctaTitle: "あなたの見積フォーマットに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "見積内容を入力するだけで、見積書ドラフトを即生成。営業の事務作業を効率化します。",
    industryTags: ["製造", "士業", "建設"],
    functionTags: ["見積作成", "帳票生成"],
    moduleTags: ["LLM"],
    oneLiner: "見積内容から見積書ドラフトを即生成",
  },
  {
    _type: "aiDemo",
    title: "日報・週報の要約",
    slug: { _type: "slug", current: "daily-weekly-report-summary" },
    industry: "construction",
    inputType: "text_only",
    inputPlaceholder: "日報や週報の要点を入力してください",
    runMode: "mock_preview",
    mockOutputPrimary: `## 1. 週報サマリ

- 進捗: A棟3階 外壁工事 80%完了。養生補修対応済み
- 課題: B棟1階 養生期間中。来週火曜から次工程
- 来週: 足場撤去、内装着手`,
    mockOutputSecondary: `## 2. 上司向け共有メモ

- スケジュール遅延なし。予算内
- 安全点検は毎週水曜に実施`,
    systemPrompt: `あなたは日報・週報の要約を作成するアシスタントです。`,
    outputStructure: `サマリと上司向け共有メモの2セクションで出力すること。`,
    sampleData: [
      "今週はA棟3階の外壁。養生シート補修完了。B棟は養生中",
      "3案件並行。1件は納品済み。残り2件は来週中に",
      "クレーム対応2件。いずれも解決。マニュアル更新を提案",
    ],
    ctaTitle: "あなたの報告フォーマットに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "日報・週報の要点を入力すると、サマリと共有メモを即生成。報告業務の負荷を軽減します。",
    industryTags: ["建設", "製造", "小売"],
    functionTags: ["報告書生成", "要約"],
    moduleTags: ["LLM"],
    oneLiner: "日報・週報からサマリを即生成",
  },
  {
    _type: "aiDemo",
    title: "写真から点検報告",
    slug: { _type: "slug", current: "photo-inspection-report" },
    industry: "construction",
    inputType: "image_text",
    inputPlaceholder: "写真をアップロードし、状況をテキストで補足してください",
    runMode: "mock_preview",
    mockOutputPrimary: `## 1. 点検報告書

- 日付: 本日
- 場所: （写真・入力から判定）
- 点検内容: 外観・損傷・不具合の有無
- 所見: 要対応／経過観察／問題なし`,
    mockOutputSecondary: `## 2. 次アクション

- 補修が必要な場合: 業者手配、予算確認
- 経過観察: 次回点検日を設定`,
    systemPrompt: `あなたは写真とメモから点検報告書を作成するアシスタントです。`,
    outputStructure: `点検報告書と次アクションの2セクションで出力すること。`,
    sampleData: [
      "外壁のひび割れ。A棟2階東側。雨漏りリスクあり",
      "足場の手すりゆるみ。作業再開前に補修必須",
      "養生シート剥がれ。雨予報のため至急対応",
    ],
    ctaTitle: "あなたの点検フォーマットに合わせた試作を3営業日で提出します。",
    ctaButtonText: "3営業日で試作デモを受け取る",
    description: "写真1枚＋メモから、点検報告書と次アクションを即生成。現場の記録業務を効率化します。",
    industryTags: ["建設", "不動産", "保険"],
    functionTags: ["画像入力", "報告書生成"],
    moduleTags: ["Vision", "LLM"],
    oneLiner: "写真＋メモから点検報告を即生成",
  },
];

/** 全デモ（既存 + 次の20本） */
const demos = [...existingDemos, ...nextMockDemos];

const OLD_DEMO_IDS = [
  "aiDemo-construction-voice-demo",
  "aiDemo-legal-summary-demo",
  "aiDemo-manufacturing-image-demo",
];

async function main() {
  console.log("aiDemo を Sanity に投入しています...");
  for (const id of OLD_DEMO_IDS) {
    try {
      await client.delete(id);
      console.log(`  - 旧データ削除: ${id}`);
    } catch {
      // 存在しない場合は無視
    }
  }
  for (const demo of demos) {
    const slug = (demo.slug as { current: string }).current;
    const id = `aiDemo-${slug}`;
    const explicitTone = (demo as { writingTone?: string }).writingTone;
    const writingTone = explicitTone
      ? normalizeWritingTone(explicitTone)
      : inferWritingToneFromDemoTags({
          industry: (demo as { industry?: string }).industry,
          industryTags: (demo as { industryTags?: string[] }).industryTags,
        });
    await client.createOrReplace({
      ...demo,
      writingTone,
      _id: id,
    });
    console.log(`  ✓ ${demo.title} (${slug})`);
  }
  console.log("完了しました。");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
