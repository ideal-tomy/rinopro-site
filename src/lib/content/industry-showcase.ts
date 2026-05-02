/**
 * トップの業種カードと /solutions/[slug] ハブ用データ
 * 関連デモは docs/demo-mock-inventory.md の既存 slug のみ参照
 */

export const industryShowcaseSectionCopy = {
  heading: "業種から探す",
  intro:
    "現場に近い例から、よくある負荷と改善のヒントを整理しています。詳しい説明と体験デモは各ページでご覧いただけます。",
} as const;

export type IndustryRelatedDemo = {
  slug: string;
  title: string;
};

export type IndustryShowcaseItem = {
  slug: string;
  label: string;
  tagline: string;
  painHint: string;
  solutionHint: string;
  imageSrc: string;
  imageAlt: string;
  metaDescription: string;
  hub: {
    lead: string;
    painSectionTitle: string;
    painBody: string;
    approachSectionTitle: string;
    approachBody: string;
    relatedDemos: readonly IndustryRelatedDemo[];
  };
};

function solutionsPath(slug: string): string {
  return `/solutions/${slug}`;
}

export type IndustryShowcaseItemWithPath = IndustryShowcaseItem & {
  hubPath: string;
};

const INDUSTRY_SHOWCASE_ITEMS_RAW: readonly IndustryShowcaseItem[] = [
  {
    slug: "construction",
    label: "建設・工事",
    tagline: "現場報告と工程まわりの手戻りを減らす",
    painHint:
      "点検・日報・写真・工程連絡がチャットと紙に散らばり、確認と再入力に時間がかかる。",
    solutionHint:
      "音声・写真・テキストから報告や連絡文案を下書きし、承認と記録の流れを短く設計します。",
    imageSrc: "/media/industries/construction.svg",
    imageAlt: "建設現場のイメージ。クレーンと建物のシルエットを抽象的に表現したイラスト",
    metaDescription:
      "建設・工事向け。現場報告、点検、工程連絡の負荷を下げるヒントと体験デモへの導線。",
    hub: {
      lead:
        "協力会社・本社・現場の間で、報告と連絡が追いづらいと、判断と手戻りが増えます。まずは「どこで情報が分断しているか」を整理し、入力と承認の最短ルートを一緒に設計します。",
      painSectionTitle: "よくある負荷",
      painBody:
        "写真や音声は取っているが、報告書やメールに転記する作業が残る。雨天やトラブル時の連絡が遅れ、工程表と現場感覚にズレが出る。担当者が変わると、過去の経緯を探すのに時間がかかる。",
      approachSectionTitle: "解決の考え方（概要）",
      approachBody:
        "現場の入力手段（音声・写真・短文）に合わせて下書きを生成し、確認すべき項目だけを人に回す流れにします。既存の帳票やチャット運用との境界も含め、小さく試せる範囲から段階的に広げます。",
      relatedDemos: [
        { slug: "construction-shadow-foreman", title: "現場監督の影武者" },
        { slug: "photo-inspection-report", title: "写真から点検報告" },
        { slug: "daily-weekly-report-summary", title: "日報・週報の要約" },
      ],
    },
  },
  {
    slug: "professional-services",
    label: "士業・専門事務",
    tagline: "調べ物・文書・期限を、探し回らない状態へ",
    painHint:
      "先例検索、契約・議事の整理、期限管理が属人化し、確認依頼と差し戻しが繰り返される。",
    solutionHint:
      "検索・要約・ドラフト生成とリマインドを組み合わせ、判断に必要な材料を揃える時間を短縮します。",
    imageSrc: "/media/industries/professional-services.svg",
    imageAlt: "書類とディスプレイを想起させる抽象的なイラスト。士業・オフィス業務のイメージ",
    metaDescription:
      "士業・専門事務所向け。調べ物、契約・議事、期限まわりの負荷を下げるヒントと体験デモ。",
    hub: {
      lead:
        "正確さが求められる一方で、調べ物と文書化に時間が寄っていませんか。ナレッジの置き場所と、AIで任せる範囲（下書き・要約・チェックリスト）を切り分けると、レビューに集中しやすくなります。",
      painSectionTitle: "よくある負荷",
      painBody:
        "類似案件の調査に毎回時間がかかる。議事録や契約の要点が散在し、誰が何を確認したか追いにくい。更新期限や提出物の管理が個人メモに寄り、引き継ぎで抜けが出る。",
      approachSectionTitle: "解決の考え方（概要）",
      approachBody:
        "まずは「検索しやすい要約」と「次アクションの見える化」から入り、承認フローに合わせて段階的に広げます。機密領域はルールで守り、下書き生成やチェック補助から効果を測ります。",
      relatedDemos: [
        { slug: "legal-memory-secretary", title: "10年分の記憶を持つ秘書" },
        { slug: "contract-review-summary", title: "契約書レビューサマリ" },
        { slug: "meeting-minutes-auto", title: "議事録を3秒で" },
      ],
    },
  },
  {
    slug: "retail-distribution",
    label: "小売・卸・メーカー現場",
    tagline: "店頭・倉庫・本部の情報のズレを減らす",
    painHint:
      "受発注・在庫・接客メモが系統ごとに分かれ、都度の確認と手入力が残業とミスを生む。",
    solutionHint:
      "現場の入力に合わせた集計・引き渡し文面・差分検知で、つなぎの手作業を減らします。",
    imageSrc: "/media/industries/retail-distribution.svg",
    imageAlt: "棚と箱をイメージした抽象的なイラスト。小売・流通のイメージ",
    metaDescription:
      "小売・卸・製造の現場向け。受発注・在庫・接客まわりの負荷を下げるヒントと体験デモ。",
    hub: {
      lead:
        "売場・倉庫・本部で使う言葉と単位が揃わないと、同じ数字を何度も確認することになります。入力のしやすさと、本部が欲しい粒度のレポートを両立する形を一緒に決めます。",
      painSectionTitle: "よくある負荷",
      painBody:
        "接客や巡回のメモが個人の手元に残り、本部への共有が遅れる。在庫の偏りや差異の原因が後追いになり、発注判断が遅い。受注・出荷情報がメールとシステムに混在する。",
      approachSectionTitle: "解決の考え方（概要）",
      approachBody:
        "現場のボイス・写真・短文からサマリと次アクションを残し、既存の受発注・在庫ツールとつなぐ境界を設計します。いきなり全置き換えではなく、負荷の大きい接点から試します。",
      relatedDemos: [
        { slug: "retail-floor-voice-handoff", title: "店頭接客ボイスメモの共有整理" },
        { slug: "inventory-balance-proposal", title: "在庫偏り是正提案" },
        { slug: "order-form-generator", title: "受注書を即作成" },
      ],
    },
  },
  {
    slug: "logistics-mobility",
    label: "運輸・配送",
    tagline: "現場音声と写真から、報告と連絡を素早く",
    painHint:
      "ドライバー・倉庫・荷主の間で、遅延・事故・納品の連絡が後追いになりトラブルが膨らむ。",
    solutionHint:
      "音声・写真からたたき台を作り、定型連絡と記録に残る形へそろえる仕組みを組み立てます。",
    imageSrc: "/media/industries/logistics-mobility.svg",
    imageAlt: "ルートと車両を想起させる抽象的なイラスト。配送・運輸のイメージ",
    metaDescription:
      "運輸・配送向け。遅延連絡・インシデント・納品報告の負荷を下げるヒントと体験デモ。",
    hub: {
      lead:
        "走行中や荷役の合間に情報を残しづらいほど、後工程の調整コストが上がります。音声と写真から即座に社内が理解できる草案を出し、エスカレーションの線引きまで含めて整理します。",
      painSectionTitle: "よくある負荷",
      painBody:
        "インシデントや遅延の連絡がテンプレ化されておらず、都度の文章作成に時間がかかる。納品証跡が写真とメールに散らばり、問い合わせ対応に手が取られる。現場の実態と配車計画のズレが起きやすい。",
      approachSectionTitle: "解決の考え方（概要）",
      approachBody:
        "現場からの入力を短時間で「誰が読んでも追えるメモ」に変換し、荷主・社内への連絡文案までつなげます。個人情報・事故情報はマスキングや権限の設計とセットで扱います。",
      relatedDemos: [
        { slug: "driver-voice-incident-draft", title: "ドライバー音声から配送インシデント草案" },
        { slug: "delivery-photo-completion-report", title: "納品写真から配送完了レポート" },
        { slug: "delay-notice-template", title: "遅延連絡テンプレ自動化" },
      ],
    },
  },
  {
    slug: "healthcare-public",
    label: "医療・公的窓口",
    tagline: "問い合わせ対応の均一化と記録のしやすさ",
    painHint:
      "一般問い合わせや窓口対応が担当依存で、注意事項の取りこぼしや二次対応のばらつきが出る。",
    solutionHint:
      "返信の骨子・要確認事項の整理と、院内・管内共有のたたき台で初動の質をそろえます。",
    imageSrc: "/media/industries/healthcare-public.svg",
    imageAlt: "ケアと案内を想起させる抽象的なイラスト。医療・公的窓口のイメージ",
    metaDescription:
      "医療・公的窓口向け。問い合わせ対応の均一化と記録のしやすさのヒントと体験デモ。",
    hub: {
      lead:
        "正確な説明と慎重な判断が求められる場面ほど、初動の文章とチェック項目が揃っていると負担が下がります。法令・個人情報・院内ルールの枠内で、骨子と要確認の整理から始めます。",
      painSectionTitle: "よくある負荷",
      painBody:
        "似た問い合わせでも、担当ごとに回答トーンや注意書きが違う。電話・窓口のメモが残りにくく、引き継ぎで意図が抜ける。多忙時にテンプレを探す・書き直す手間が積み上がる。",
      approachSectionTitle: "解決の考え方（概要）",
      approachBody:
        "注意書き付きの返信骨子や、院内・関係部署向けの共有メモのたたき台を用意し、最終判断は人が行う前提で設計します。公開文と内部メモを分け、ログの取り方も運用に合わせます。",
      relatedDemos: [
        { slug: "clinic-general-inquiry-skeleton", title: "一般問い合わせの返信骨子（注意書き付き）" },
        { slug: "civic-counter-reply-outline", title: "窓口・電話問い合わせの回答骨子" },
      ],
    },
  },
  {
    slug: "hospitality-food",
    label: "飲食・サービス",
    tagline: "忙しい時間帯ほど、申し送りと仕込み判断を早く",
    painHint:
      "予約・クレーム・シフト申し送りが口頭とチャットに散らばり、当番ごとに品質がぶれる。",
    solutionHint:
      "予約・客情・在庫の情報を短いサマリにまとめ、仕込みと対応の優先順位をそろえやすくします。",
    imageSrc: "/media/industries/hospitality-food.svg",
    imageAlt: "皿と湯気を想起させる抽象的なイラスト。飲食・サービス業のイメージ",
    metaDescription:
      "飲食・サービス向け。予約・申し送り・クレーム対応の負荷を下げるヒントと体験デモ。",
    hub: {
      lead:
        "ピーク時は判断が連鎖し、記録と共有が後回しになりがちです。短い入力から当番が読めるメモへ圧縮し、仕込み・人員・返信の優先度をそろえるところから始めます。",
      painSectionTitle: "よくある負荷",
      painBody:
        "予約状況と仕込み量の感覚がずれ、廃棄や品切れが出る。クレーム対応が担当の経験値に依存する。シフト交代時の申し送りが口頭中心で、次の当番が状況を取りこぼす。",
      approachSectionTitle: "解決の考え方（概要）",
      approachBody:
        "予約・販促・在庫に近いデータから「今日の注意点」を短く出し、接客・厨房・本部で同じ画面を見られるようにします。対外メッセージはトーンと注意事項をテンプレ化し、最終文面は人が調整する前提です。",
      relatedDemos: [
        { slug: "restaurant-prep-list-from-bookings", title: "予約状況から仕込みリスト草案" },
        { slug: "shift-handover-summary", title: "シフト引継ぎサマリ生成" },
        { slug: "service-claim-reply-assist", title: "クレームをファンに変える返信下書き" },
      ],
    },
  },
];

export const INDUSTRY_SHOWCASE_ITEMS: readonly IndustryShowcaseItemWithPath[] =
  INDUSTRY_SHOWCASE_ITEMS_RAW.map((item) => ({
    ...item,
    hubPath: solutionsPath(item.slug),
  }));

const bySlug = new Map<string, IndustryShowcaseItemWithPath>(
  INDUSTRY_SHOWCASE_ITEMS.map((item) => [item.slug, item])
);

export function getIndustryShowcaseBySlug(
  slug: string
): IndustryShowcaseItemWithPath | null {
  return bySlug.get(slug) ?? null;
}

export function getAllIndustryShowcaseSlugs(): string[] {
  return INDUSTRY_SHOWCASE_ITEMS.map((i) => i.slug);
}
