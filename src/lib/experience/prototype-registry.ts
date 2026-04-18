import type { LiveSyncMode } from "@/lib/experience/live-sync-modes-mock";
import { LIVE_SYNC_AUDIO_TEXT_PROTOTYPES } from "@/lib/experience/live-sync-audio-text-prototypes";

export type ExperiencePrototypeTier = "track3" | "track2";

export interface ExperiencePrototypeMeta {
  slug: string;
  title: string;
  tier: ExperiencePrototypeTier;
  /** 対応する文章デモ slug（同一の場合もある） */
  demoSlug: string;
  shortDescription: string;
  inputHint: string;
  /**
   * true のとき `/demo/{demoSlug}` でチャットより先に体験UI（同一 Runner）を表示する。
   * 書類たたき台系など「開いた瞬間から専用画面」を優先するデモ向け。
   */
  immersiveOnDemoDetail?: boolean;
  /** true のとき `/experience/{slug}` で `shortDescription` を折りたたみ（任意で開く） */
  foldLeadCopy?: boolean;
  /** Live Sync テンプレの出力モード（`ExperiencePrototypeRunner` が Live Sync へルーティング） */
  liveSyncMode?: LiveSyncMode;
}

/** ③を先、②を後（一覧・静的パラメータの順序） */
export const EXPERIENCE_PROTOTYPES: ExperiencePrototypeMeta[] = [
  {
    slug: "legal-memory-secretary",
    title: "10年分の記憶を持つ秘書",
    tier: "track3",
    demoSlug: "legal-memory-secretary",
    shortDescription:
      "過去文書を引用付きで探し、要約と次アクションまで一画面で整理します。",
    inputHint: "例: 港区の賃貸、3年前の契約で解約条項は？",
  },
  {
    slug: "service-claim-reply-assist",
    title: "クレーム返信下書き",
    tier: "track3",
    demoSlug: "service-claim-reply-assist",
    shortDescription:
      "お客様向け返信案と社内メモを並べ、承認の流れをイメージできます。",
    inputHint: "例: 配送が1日遅れ、お詫びと再配送希望",
  },
  {
    slug: "internal-knowledge-share-bot",
    title: "社内ナレッジ共有BOT（業種別・二画面）",
    tier: "track3",
    demoSlug: "internal-knowledge-share-bot",
    shortDescription:
      "ステップガイドとチャットの両方から、同じルールで回答。業種別の出典・ポリシーを体験できます。",
    inputHint: "業種を選び、ガイドまたはチャットから質問してください。",
  },
  {
    slug: "restaurant-ops-dashboard-demo",
    title: "飲食店オペレーション・ダッシュボード",
    tier: "track3",
    demoSlug: "restaurant-ops-dashboard-demo",
    shortDescription:
      "白基調の業務UIで、シフト承認・入客分析・レシート経費・給与試算・精算状況を1本のログで追体験できます。",
    inputHint: "「最初から再生」で自動化の流れを確認してください。",
  },
  {
    slug: "inquiry-intake-triage-demo",
    title: "問い合わせ受付トリアージ（分類・返信草案）",
    tier: "track3",
    demoSlug: "inquiry-intake-triage-demo",
    shortDescription:
      "問い合わせ本文からカテゴリ・優先度・タグを付与し、顧客向け返信案と社内メモをモック生成します。",
    inputHint: "例: 配送が遅れている／商品が破損／解約の手続きを知りたい",
    foldLeadCopy: true,
  },
  {
    slug: "live-sync-voice-translation",
    title: "Live Sync：音声入力のリアルタイム翻訳",
    tier: "track3",
    demoSlug: "live-sync-voice-translation",
    shortDescription:
      "マイク入力（Web Speech API）の日本語を、右ペインへ辞書ベースのモック翻訳で逐次表示。非対応時はモック音声ストリームで同じ体験を再現します。",
    inputHint:
      "例: 明日の会議は誠に恐縮ながら無理です。期限だけ先に教えてください。",
    immersiveOnDemoDetail: true,
    liveSyncMode: "translation",
  },
  {
    slug: "workflow-approval-lite-demo",
    title: "承認・通知フロー（ライト）",
    tier: "track3",
    demoSlug: "workflow-approval-lite-demo",
    shortDescription:
      "承認待ち一覧からワンタップで承認・差し戻しするUIの体験。通知・アラート連携のイメージ用です。",
    inputHint: "各行のボタンで状態を更新して操作感を確認してください。",
  },
  {
    slug: "legal-professional-mini-sfa-demo",
    title: "士業向けミニSFA（相談〜受任の見える化）",
    tier: "track3",
    demoSlug: "legal-professional-mini-sfa-demo",
    shortDescription:
      "ダッシュボード・顧客一覧・相談ボードを実際に操作し、相談から受任までの流れと将来連携のイメージを確認できます。",
    inputHint:
      "左メニューでダッシュボード／相談ボード／顧客一覧を切り替え、新規相談追加やステージ変更をお試しください。",
  },
  {
    slug: "ops-report-metrics-demo",
    title: "数値メモから週次レポート草案",
    tier: "track3",
    demoSlug: "ops-report-metrics-demo",
    shortDescription:
      "箇条書きの数値・メモから、KPIカードと要約・次アクション案をモック生成します。",
    inputHint: "例: 売上320万 / 欠品3SKU / 客訴2件 などを改行で入力",
  },
  {
    slug: "loan-interview-business-outline",
    title: "事業メモから融資・事業計画のたたき台",
    tier: "track3",
    demoSlug: "loan-interview-business-outline",
    shortDescription:
      "雑な事業メモから、事業概要・収支のたたき台・資金用途・面談で想定されやすい論点まで、体裁を模したモックを一画面で確認できます。",
    inputHint:
      "例: エステを銀座で開業、融資の計画書を作りたい（内装の目安額があればメモ）",
    immersiveOnDemoDetail: true,
    foldLeadCopy: true,
  },
  {
    slug: "bullet-mess-to-meeting-agenda",
    title: "雑メモから会議アジェンダ整形",
    tier: "track3",
    demoSlug: "bullet-mess-to-meeting-agenda",
    shortDescription:
      "飛び跳びメモから、目的・アジェンダ表・未決論点を体裁付きでモック生成します。",
    inputHint: "例: 来週のキックオフで話したいこと、担当、気になる点をそのまま書いてください",
    immersiveOnDemoDetail: true,
  },
  {
    slug: "exec-meeting-notes-to-summary",
    title: "経営会議メモからサマリと宿題",
    tier: "track3",
    demoSlug: "exec-meeting-notes-to-summary",
    shortDescription:
      "箇条書きメモから、決定事項・宿題表・リスク一言をモックで整理します。",
    inputHint: "例: 承認した投資、次アクション、数字のメモを箇条書きで",
    immersiveOnDemoDetail: true,
  },
  {
    slug: "presentation-outline",
    title: "プレゼン資料の骨子作成",
    tier: "track3",
    demoSlug: "presentation-outline",
    shortDescription:
      "テーマメモから、章立てとスライド設計表をモックで組み立てます。",
    inputHint: "例: 聴衆に伝えたい結論と、話したい論点をメモ",
    immersiveOnDemoDetail: true,
    foldLeadCopy: true,
  },
  {
    slug: "rfp-requirements-extract",
    title: "提案依頼書から要件抜き出し",
    tier: "track3",
    demoSlug: "rfp-requirements-extract",
    shortDescription:
      "RFPの断片から要件表とギャップメモをモックで一覧化します。",
    inputHint: "例: 可用性・セキュリティ・支払条件などの要件を貼り付け",
    immersiveOnDemoDetail: true,
  },
  {
    slug: "order-form-generator",
    title: "受注書を即作成",
    tier: "track3",
    demoSlug: "order-form-generator",
    shortDescription:
      "品目・数量メモから受注明細と取引条件のたたき台をモック生成します。",
    inputHint: "例: 品名、数量、単価、納期を行でメモ",
    immersiveOnDemoDetail: true,
  },
  {
    slug: "quote-draft-generator",
    title: "見積書ドラフト",
    tier: "track3",
    demoSlug: "quote-draft-generator",
    shortDescription:
      "メモから見積の表組みと注意書きをモックで整形します。",
    inputHint: "例: 品目、単価、納期、込み条件のメモ",
    immersiveOnDemoDetail: true,
  },
  {
    slug: "webinar-invite-email-draft",
    title: "ウェビナー案内メール草案",
    tier: "track3",
    demoSlug: "webinar-invite-email-draft",
    shortDescription:
      "日時・テーマメモから案内メール体裁の草案をモック生成します。",
    inputHint: "例: 日時、対象者、URLや資料の有無",
    immersiveOnDemoDetail: true,
  },
  {
    slug: "nonprofit-donor-thanks-letter-draft",
    title: "寄付感謝レターの草案",
    tier: "track3",
    demoSlug: "nonprofit-donor-thanks-letter-draft",
    shortDescription:
      "プロジェクト名とメモから感謝レターのたたき台をモック生成します。",
    inputHint: "例: プロジェクト名、使途、匿名希望の有無",
    immersiveOnDemoDetail: true,
  },
  {
    slug: "contract-amendment-draft",
    title: "契約修正提案ドラフト",
    tier: "track3",
    demoSlug: "contract-amendment-draft",
    shortDescription:
      "変更メモから条項対比表とリスクメモをモックで整理します。",
    inputHint: "例: 変えたい条項と希望の内容を箇条書き",
    immersiveOnDemoDetail: true,
  },
  {
    slug: "release-note-draft-from-ship-list",
    title: "変更メモからリリースノート草案",
    tier: "track3",
    demoSlug: "release-note-draft-from-ship-list",
    shortDescription:
      "リリース項目リストからユーザー向け・社内向けの草案をモック生成します。",
    inputHint: "例: バージョン、改善点、既知の制限を列挙",
    immersiveOnDemoDetail: true,
  },
  {
    slug: "job-offer-draft-from-terms",
    title: "条件メモから内定通知の文面骨子",
    tier: "track3",
    demoSlug: "job-offer-draft-from-terms",
    shortDescription:
      "条件メモから通知文と条件表の骨子をモック生成します。",
    inputHint: "例: 年収、勤務地、入社日、試用期間のメモ",
    immersiveOnDemoDetail: true,
  },
  {
    slug: "privacy-notice-update-draft",
    title: "プライバシー通知の改定骨子",
    tier: "track3",
    demoSlug: "privacy-notice-update-draft",
    shortDescription:
      "改定ポイントメモから要点リストと条文風ドラフトをモック生成します。",
    inputHint: "例: 第三者提供、Cookie、保管期間の変更点",
    immersiveOnDemoDetail: true,
  },
  {
    slug: "subsidy-application-topic-checklist",
    title: "補助金申請の論点チェックリスト",
    tier: "track3",
    demoSlug: "subsidy-application-topic-checklist",
    shortDescription:
      "事業メモから提出物チェックとギャップ表をモックで一覧化します。",
    inputHint: "例: 事業内容、規模、すでに揃っている資料のメモ",
    immersiveOnDemoDetail: true,
  },
  {
    slug: "onboarding-checklist-from-role",
    title: "入社手続きチェックリスト生成",
    tier: "track3",
    demoSlug: "onboarding-checklist-from-role",
    shortDescription:
      "役割・勤務地メモから手続きチェックと担当表をモック生成します。",
    inputHint: "例: 職種、勤務形態、入社日、希望機器",
    immersiveOnDemoDetail: true,
  },
  {
    slug: "property-exterior-photo-memo",
    title: "外観・共用部の写真メモ",
    tier: "track2",
    demoSlug: "property-exterior-photo-memo",
    shortDescription: "写真から状況タグと記録メモ、次アクションをまとめます。",
    inputHint: "例: 共用廊下の照明が1基消灯、管理会社へ連絡予定",
  },
  {
    slug: "receipt-photo-expense-memo",
    title: "領収書から経費メモ",
    tier: "track2",
    demoSlug: "receipt-photo-expense-memo",
    shortDescription: "領収書から項目抽出と精算前チェックを一覧化します。",
    inputHint: "例: 出張タクシー、領収書のみ手元",
  },
  {
    slug: "driver-voice-incident-draft",
    title: "配送インシデント報告",
    tier: "track2",
    demoSlug: "driver-voice-incident-draft",
    shortDescription:
      "書き起こしをレーンへ振り分け、報告ドラフトと荷主連絡メモをモックで組み立てます。",
    inputHint:
      "例: 積み忘れ1箱、15時着予定が17時に変更連絡済み（分割後にドラッグでレーンへ）",
  },
  ...LIVE_SYNC_AUDIO_TEXT_PROTOTYPES,
];

const PROTOTYPE_SLUGS = new Set(EXPERIENCE_PROTOTYPES.map((p) => p.slug));

/**
 * aiDemo.slug が体験レジストリ（`/experience/{slug}` または対応する `demoSlug`）と結びつくかの判定用。
 * レポート・タイブレーク用。公開可否の唯一の根拠にはしない（`listedOnCatalog` を正とする）。
 */
const DEMO_SLUGS_LINKED_TO_EXPERIENCE_REGISTRY = new Set<string>(
  EXPERIENCE_PROTOTYPES.flatMap((p) => [p.slug, p.demoSlug])
);

export function getDemoSlugsLinkedToExperienceRegistry(): ReadonlySet<string> {
  return DEMO_SLUGS_LINKED_TO_EXPERIENCE_REGISTRY;
}

/** トップ・/demo で最上段に置く注力プロトタイプ（順序固定） */
export const FEATURED_EXPERIENCE_SLUGS = [
  "internal-knowledge-share-bot",
  "restaurant-ops-dashboard-demo",
] as const;

/**
 * `/demo` ハブ・トップ「タイプ別に体験する」セクションの固定6件（順序固定・3列×2行）。
 * 変更時は `docs/demo-portfolio-governance.md` の「`/demo` ハブの4段構成」節も更新する。
 */
export const DEMO_HUB_TYPE_SECTION_SLUGS = [
  "live-sync-voice-translation",
  "loan-interview-business-outline",
  "workflow-approval-lite-demo",
  "legal-memory-secretary",
  "webinar-invite-email-draft",
  "legal-professional-mini-sfa-demo",
] as const;

export type FeaturedExperienceSlug =
  (typeof FEATURED_EXPERIENCE_SLUGS)[number];

const FEATURED_SLUG_SET = new Set<string>(FEATURED_EXPERIENCE_SLUGS);

export function getFeaturedExperiencePrototypes(): ExperiencePrototypeMeta[] {
  return FEATURED_EXPERIENCE_SLUGS.map((slug) => {
    const meta = EXPERIENCE_PROTOTYPES.find((p) => p.slug === slug);
    if (!meta) {
      throw new Error(`Featured prototype missing from registry: ${slug}`);
    }
    return meta;
  });
}

export function getOtherExperiencePrototypes(): ExperiencePrototypeMeta[] {
  return EXPERIENCE_PROTOTYPES.filter((p) => !FEATURED_SLUG_SET.has(p.slug));
}

export function getExperiencePrototypeBySlug(
  slug: string
): ExperiencePrototypeMeta | undefined {
  return EXPERIENCE_PROTOTYPES.find((p) => p.slug === slug);
}

/** Sanity に experienceUrl が無い場合でも、体験ページへ誘導するホワイトリスト */
export function getExperienceUrlForDemoSlug(
  demoSlug: string | undefined
): string | undefined {
  if (!demoSlug || !PROTOTYPE_SLUGS.has(demoSlug)) return undefined;
  return `/experience/${demoSlug}`;
}
