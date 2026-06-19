/**
 * 旧 `/case-studies/[slug]` 用コンテンツ（ルートは `/experience` に統合済み。参照はレガシー用途のみ）。
 * LP の実装事例カード（implementation-showcase）と slug を共有する。
 */

import type { ApproachTimelineStep } from "@/components/illustrations/approach-timeline";

export type CaseStudyMedia =
  | { kind: "image"; src: string; alt: string }
  | { kind: "video"; src: string; ariaLabel: string };

export type CaseStudyGalleryItem = {
  src: string;
  alt: string;
  caption: string;
};

export type CaseStudyMetric = {
  label: string;
  before: string;
  after: string;
};

export type CaseStudyDetail = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  /** ギャラリー直上に表示する注記（未取得スクショのプレースホルダ説明など） */
  galleryNote?: string;
  /** ブランド名（カードと一致） */
  heroEyebrow: string;
  heroTitle: string;
  heroSubtitle: string;
  industryTag: string;
  /** 想定ユーザー・規模 */
  whoFor?: string;
  /** デモ形式（未指定時は showcase の liveDemo から導出） */
  demoFormat?: "live" | "external";
  /** Before→After 指標（表示時に「想定例」キャプションを付与） */
  metrics?: readonly CaseStudyMetric[];
  beforeAfter: {
    beforeTitle: string;
    beforeBody: string;
    afterTitle: string;
    afterBody: string;
  };
  overviewParagraphs: readonly string[];
  overviewMedia: CaseStudyMedia;
  /** ApproachTimeline 用（duration は短いラベルでも可） */
  flowSteps: readonly ApproachTimelineStep[];
  painPoints: readonly { title: string; body: string }[];
  features: readonly { title: string; description: string }[];
  gallery: readonly CaseStudyGalleryItem[];
  techHighlights: readonly string[];
  /** /solutions/[slug] */
  relatedSolutionsSlug: string;
  relatedLinks: readonly { label: string; href: string }[];
};

const DETAILS: readonly CaseStudyDetail[] = [
  {
    slug: "gempo",
    metaTitle: "現場ポケット（GEMPO）| 実装事例 | AXEON",
    metaDescription:
      "建設・工事向け。現場と本社の情報分断を減らし、報告・配員・書類を一つのハブにまとめる実装サンプルの紹介です。",
    heroEyebrow: "GEMPO",
    heroTitle: "建設業向け 現場ポケット",
    heroSubtitle: "現場でも事務所でも、今日の現場がひと目でわかる。",
    industryTag: "建設・工事",
    whoFor: "施工会社・サブコン（従業員50〜500名、複数現場を抱える現場監督・工事部門）",
    metrics: [
      { label: "日報作成時間", before: "45分/日", after: "15分/日" },
      { label: "本社確認リードタイム", before: "2日", after: "当日" },
      { label: "配員変更の連絡漏れ", before: "月5件", after: "月1件" },
    ],
    beforeAfter: {
      beforeTitle: "これまで",
      beforeBody:
        "写真・音声・チャット・紙の報告がバラバラに残り、本社は「いま現場で何が起きているか」を後追いで確認がちです。転記や報告書作成に時間が取られ、配員変更や承認も連絡ミスで遅れやすくなります。",
      afterTitle: "このサンプルで目指す姿",
      afterBody:
        "入力は現場のやり方に合わせて軽く、記録は一覧で追える形に寄せます。誰がどこで何をしているかがダッシュボードに集約され、必要な書類や履歴にもすぐたどれます。",
    },
    overviewParagraphs: [
      "このサンプルは、協力会社・本社・現場の間で散らばりがちな「報告・連絡・記録」を、ひとつの現場ポケットとしてまとめることをイメージした画面構成です。現場監督がスマホから短く入力し、事務所側がPCで全体を見渡す、という役割分担を前提にしています。",
      "配員や締切が迫る案件はアラートで浮かび、報告のたたき台を支援することで、転記や書式調整にかける時間を削ります。現場の一次情報を起点に、承認や共有の流れまでを短く設計できるようにしています。",
      "実際の運用では、御社の協力会社ルール・安全基準・帳票様式に合わせて項目や権限を調整します。ここでは「動く画面」として、入力→確認→共有のリズムをイメージしていただくことを目的としています。",
    ],
    overviewMedia: {
      kind: "image",
      src: "/images/genbakanri_admin.webp",
      alt: "現場ポケット管理画面のスクリーンショット",
    },
    flowSteps: [
      { number: "01", title: "現場から入力", duration: "記録" },
      { number: "02", title: "下書き・整理", duration: "支援" },
      { number: "03", title: "承認・配員", duration: "判断" },
      { number: "04", title: "共有・履歴", duration: "ナレッジ" },
    ],
    painPoints: [
      {
        title: "報告の形がバラバラ",
        body: "写真だけ、短文だけ、電話フォローだけ、など人や現場ごとにフォーマットが分かれ、後から検索しづらい。",
      },
      {
        title: "本社確認が後手に回る",
        body: "まとめ直しや転記に時間がかかり、判断や指示が遅れると工程や安全確認にも影響する。",
      },
      {
        title: "配員・締切の見落とし",
        body: "繁忙期は担当交代も多く、誰がどの現場のどの期限を見ているかが曖昧になりやすい。",
      },
      {
        title: "過去の経緯を探すコスト",
        body: "トラブルや監査対応のとき、チャットの遡及や紙の探索に時間が溶ける。",
      },
    ],
    features: [
      {
        title: "ダッシュボードで俯瞰",
        description: "現場単位で進捗・報告・期限を一覧し、優先度の高い案件を先に確認できるようにします。",
      },
      {
        title: "報告のたたき台支援",
        description: "写真や短文から、承認に必要な項目が抜けにくい下書きへ寄せることを想定したUIです。",
      },
      {
        title: "配員・期限のアラート",
        description: "締切や人手が薄い日を先に浮かべ、現場と本社で同じ注意点を共有します。",
      },
      {
        title: "書類・履歴のハブ",
        description: "関連資料や過去スレッドへたどれる導線をまとめ、引き継ぎや監査時の負担を下げます。",
      },
      {
        title: "モバイル前提の入力",
        description: "屋外・移動中でも負担の少ない簡潔入力を優先し、後からPCで整える流れを前提にします。",
      },
    ],
    gallery: [
      {
        src: "/images/genbakanri_admin.webp",
        alt: "管理画面の一覧ビュー",
        caption: "本社・管理者向け：複数現場の状況を一覧で把握",
      },
      {
        src: "/images/genbakanri_pc.webp",
        alt: "PC向け詳細画面",
        caption: "PCでもチャートやテーブルでじっくり確認できるレイアウト",
      },
      {
        src: "/images/genbakanri_mobile.webp",
        alt: "モバイル向け画面",
        caption: "現場向け：移動中でも必要な操作に絞った画面",
      },
    ],
    techHighlights: [
      "モダンな Web フロントと API を組み合わせた一般的な構成で、画面応答と権限制御を両立",
      "ファイルやメディアを扱う前提のストレージ設計（容量・保持期間は要件に応じて調整）",
      "通知・バッチで期限管理やリマインドを運用に載せやすい形へ",
      "AI は「下書き・整理」の補助として組み込み、最終判断は人が行う前提で設計可能",
    ],
    relatedSolutionsSlug: "construction",
    relatedLinks: [
      { label: "AI業務アプリ開発", href: "/services/development" },
      { label: "DX戦略設計", href: "/services/consulting" },
    ],
  },
  {
    slug: "recruit-cockpit",
    metaTitle: "採用コックピット | 実装事例 | AXEON",
    metaDescription:
      "人事・採用向け。候補者・選考ステージ・KPIを一画面で追い、選考の滞留と属人化を減らすパイプライン管理のサンプルです。",
    heroEyebrow: "採用コックピット",
    heroTitle: "採用・選考パイプライン管理",
    heroSubtitle: "候補者の流れと数字を、同じテーブルで見る。",
    industryTag: "人事・採用",
    whoFor: "人事部・採用担当（年間数十〜数百名規模の採用計画がある企業）",
    metrics: [
      { label: "パイプライン集計", before: "半日", after: "15分" },
      { label: "ステージ滞留の把握", before: "週次手作業", after: "リアルタイム" },
      { label: "候補者フォロー遅延", before: "3日超", after: "24h以内" },
    ],
    beforeAfter: {
      beforeTitle: "これまで",
      beforeBody:
        "スプレッドシート、メール、採用ATSが並立し、どの候補者がどの段階で止まっているかが見えにくい。面接官ごとに評価基準がぶれ、振り返りのたびに集計作業が発生します。",
      afterTitle: "このサンプルで目指す姿",
      afterBody:
        "パイプライン上の滞留が色や数で浮き、次の打ち手がチームで共有されます。応募から内定までの各ステージで、必要な情報と次アクションが揃った状態を維持しやすくします。",
    },
    overviewParagraphs: [
      "採用は「数」と「質」の両方を同時に追う必要があります。このサンプルは、候補者一人ひとりの所在と、チャネル別・職種別のコンバージョンを同じ画面近傍に置き、意思決定が速くなるレイアウトを意識しています。",
      "書類・面接・オファーなどステージを標準化しつつ、御社の実際の選考フローへ寄せたカスタマイズを前提にしています。評価コメントやタグを蓄積し、次回の採用計画に活かせる形へ繋げます。",
      "個人情報・採用データの取り扱いは厳格に扱うべき領域です。権限・マスキング・保管期間などは要件定義で固定し、画面はそのルールを破らないよう設計します。",
    ],
    overviewMedia: {
      kind: "image",
      src: "/images/saiyoumaching_pc.webp",
      alt: "採用パイプライン管理画面",
    },
    flowSteps: [
      { number: "01", title: "応募の集約", duration: "入口" },
      { number: "02", title: "スクリーニング", duration: "選別" },
      { number: "03", title: "面接・評価", duration: "判断" },
      { number: "04", title: "オファー・分析", duration: "改善" },
    ],
    painPoints: [
      {
        title: "パイプラインのブラックボックス化",
        body: "どこで止まっているかが見えず、採用チームと現場の認識がズレる。",
      },
      {
        title: "集計とレポートの手作業",
        body: "週次・月次の振り返りのたびに、コピペとピボットに時間がかかる。",
      },
      {
        title: "評価のばらつき",
        body: "面接官ごとに観点が違い、候補者体験と採用品質にムラが出る。",
      },
      {
        title: "候補者体験の遅延",
        body: "返信や次日程の調整が遅れると、優秀層の離脱に直結する。",
      },
    ],
    features: [
      {
        title: "パイプラインの可視化",
        description: "ステージごとの人数と滞留日数を強調し、ボトルネックを素早く特定します。",
      },
      {
        title: "候補者カード",
        description: "履歴書・メモ・次アクションを一カードに集約し、引き継ぎをスムーズにします。",
      },
      {
        title: "KPIダッシュボード",
        description: "応募経路や職種別の歩留まりを俯瞰し、広告・イベント投資の判断材料にします。",
      },
      {
        title: "通知とタスク",
        description: "期限付きタスクでフォロー漏れを減らし、候補者へのレスポンスを一定化します。",
      },
    ],
    gallery: [
      {
        src: "/images/saiyoumaching_pc.webp",
        alt: "採用パイプラインのPC画面",
        caption: "選考ステージと候補者の流れを一覧",
      },
      {
        src: "/images/saiyoumaching_mobile.webp",
        alt: "採用パイプラインのモバイル画面",
        caption: "外出先でもキューと急ぎのタスクを確認",
      },
    ],
    techHighlights: [
      "権限ベースの閲覧制御と監査ログを前提にしたデータ設計",
      "大量レコードでも探索しやすいフィルタ・全文検索の拡張余地",
      "ダッシュボード指標はデータモデルから再計算し、ブレのない数字を提示",
      "必要に応じて外部ATSやスプレッドシートとのインポート／エクスポート連携",
    ],
    relatedSolutionsSlug: "professional-services",
    relatedLinks: [
      { label: "AI業務アプリ開発", href: "/services/development" },
      { label: "コンサルティング", href: "/services/consulting" },
    ],
  },
  {
    slug: "shift-auto",
    metaTitle: "シフト自動くん（SHIFT AUTO）| 実装事例 | AXEON",
    metaDescription:
      "飲食・サービス向け。スタッフの希望を取り込み、シフト案を素早く作成・調整するオペレーションの実装サンプルです。",
    heroEyebrow: "SHIFT AUTO",
    heroTitle: "シフト自動くん",
    heroSubtitle: "希望と法令・稼働を踏まえたシフト案を、短時間で。",
    industryTag: "飲食・サービス",
    whoFor: "飲食・サービスチェーンの店長・シフト担当（5〜30名/店舗）",
    metrics: [
      { label: "シフト作成時間", before: "4h", after: "45分" },
      { label: "希望取りこぼし率", before: "約15%", after: "3%未満" },
      { label: "法令チェック漏れ", before: "月2〜3件", after: "ほぼゼロ" },
    ],
    beforeAfter: {
      beforeTitle: "これまで",
      beforeBody:
        "シフト作成は店長の頭の中とExcel頼み。希望の募集LINEや紙が混在し、公平感や法令順守の説明が難しい。急な欠員でその場しのぎの割り振りが続きます。",
      afterTitle: "このサンプルで目指す姿",
      afterBody:
        "希望をフォームで集約し、シフト案を自動生成したうえで店長が微調整します。公開までの履歴が残り、スタッフにも説明しやすくなります。",
    },
    overviewParagraphs: [
      "飲食やサービス業では、ピーク時間帯の人手と個人の希望の両立がしんどい業務です。このサンプルは、欠員や資格要件などの制約を入力として持ち、シフト案を素早く提示するところまでをカバーする画面構成です。",
      "自動生成は「案」を出すことが主目的で、最終決定と説明責任は店長・現場リーダーに残します。公平性や法令チェックはロジックと運用ルールの両方で担保する前提です。",
      "実際には勤怠システムや給与計算との連携、交通費や連続勤務の上限など細かなルールが入ります。ここではデモとして一般的な制約セットを想定し、拡張しやすいデータ構造にしています。",
    ],
    overviewMedia: {
      kind: "video",
      src: "/images/shiftkanri_pc.mp4",
      ariaLabel: "シフト自動くんの操作デモ動画",
    },
    flowSteps: [
      { number: "01", title: "希望の収集", duration: "入力" },
      { number: "02", title: "制約の整理", duration: "ルール" },
      { number: "03", title: "案の生成", duration: "自動" },
      { number: "04", title: "調整・公開", duration: "確定" },
    ],
    painPoints: [
      {
        title: "作成に何時間もかかる",
        body: "繁忙期はシフト作成だけで店長の丸一日が消えることがある。",
      },
      {
        title: "希望の取りこぼし",
        body: "チャットや口頭の希望が散らばり、公平感を欠いたように見える。",
      },
      {
        title: "法令・資格の見落とし",
        body: "資格保持者の配置や休憩ルールのミスが、コンプライアンスリスクになる。",
      },
      {
        title: "急な欠員への弱さ",
        body: "当日欠員が出たとき、代替案を素早く再計算する仕組みがない。",
      },
    ],
    features: [
      {
        title: "希望入力フォーム",
        description: "スマホから希望休・勤務可否を集約し、締切後に一括処理します。",
      },
      {
        title: "シフト案ジェネレータ",
        description: "稼働予測と制約から複数案を提示し、店長が比較選択します。",
      },
      {
        title: "ドラッグ調整",
        description: "自動案をベースにセルを入れ替え、リアルタイムで整合性を確認。",
      },
      {
        title: "公開と通知",
        description: "確定版をスタッフに通知し、変更履歴を残して説明しやすくします。",
      },
    ],
    gallery: [
      {
        src: "/images/shiftkanri_pc.webp",
        alt: "シフト管理PC画面",
        caption: "カレンダー上でシフト案を俯瞰・編集",
      },
    ],
    techHighlights: [
      "制約充足に近い問題としてバックエンドで組み合わせを探索し、UI は応答性を優先",
      "ルールは設定テーブル化し、店舗ごとにチューニング可能",
      "モバイルファーストの入力フローと、店長向けの広い編集画面を分離",
      "将来的な勤怠API連携を見越したシフト確定イベント設計",
    ],
    relatedSolutionsSlug: "hospitality-food",
    relatedLinks: [
      { label: "AI業務アプリ開発", href: "/services/development" },
      { label: "サービス一覧", href: "/services" },
    ],
  },
  {
    slug: "ma-dd-valueup",
    metaTitle: "M&A DDプラットフォーム | 実装事例 | AXEON",
    metaDescription:
      "M&A・投資向け。デューデリジェンスからバリューアップ、EXITまでを一気通貫で支援するシステムの実装サンプルです。",
    heroEyebrow: "M&A バリューアップ",
    heroTitle: "DD〜バリューアップ〜EXIT 一気通貫システム",
    heroSubtitle: "調査・改善・出口戦略を、同じデータ基盤でつなぐ。",
    industryTag: "M&A・投資",
    whoFor: "投資ファンド・事業会社のM&A担当・財務部門（案件単位でDD〜EXITを追うチーム）",
    metrics: [
      { label: "DD資料整理", before: "2週間", after: "5日" },
      { label: "改善施策の追跡", before: "Excel散在", after: "一本化" },
      { label: "EXIT準備の可視性", before: "四半期末", after: "常時" },
    ],
    beforeAfter: {
      beforeTitle: "これまで",
      beforeBody:
        "DD資料、改善施策、バリュエーションがフォルダとスプレッドシートに分散し、案件ごとにフォーマットが異なります。関係者間で「いまどのフェーズか」の認識が揃いにくく、出口までのストーリーが弱くなりがちです。",
      afterTitle: "このサンプルで目指す姿",
      afterBody:
        "DDの論点、改善バックログ、バリューアップ指標が一つの案件ビューに揃い、次の打ち手と出口シナリオを同じ画面で議論できます。投資判断から実行・EXITまでの一気通貫を支援します。",
    },
    overviewParagraphs: [
      "M&A案件では、調査フェーズで得た知見がそのまま改善とバリューアップに繋がらないことが多いです。このサンプルは、DDチェックリスト・リスク・改善施策・KPIを案件単位で一元管理し、投資後の実行フェーズまで同じデータ基盤で追える構成を想定しています。",
      "バリュエーションやシナリオ比較はテンプレート化しつつ、案件特性に応じて論点を追加できる余地を残しています。関係者（投資・経営・現場）が同じ画面を見ながら優先順位を合意しやすいUIを意識しています。",
      "実運用では情報の機密区分・監査ログ・外部アドバイザーとの共有範囲を要件に合わせて設計します。公開デモでは代表的な画面フローのイメージ確認にフォーカスしています。",
    ],
    overviewMedia: {
      kind: "image",
      src: "/images/demo_images/m&a_demo01.png",
      alt: "M&A DDプラットフォームのダッシュボード画面",
    },
    flowSteps: [
      { number: "01", title: "DD・論点整理", duration: "調査" },
      { number: "02", title: "リスクと改善", duration: "計画" },
      { number: "03", title: "バリューアップ", duration: "実行" },
      { number: "04", title: "EXITシナリオ", duration: "出口" },
    ],
    painPoints: [
      {
        title: "フェーズ間の断絶",
        body: "DD結果が改善計画に落ちず、投資後に同じ論点を繰り返し調査することになる。",
      },
      {
        title: "資料の散在",
        body: "Excel・PDF・メールに情報が分散し、最新版がどれか分からなくなる。",
      },
      {
        title: "出口ストーリーの弱さ",
        body: "バリューアップ施策とEXITシナリオが別資料になり、投資委員会への説明が非効率。",
      },
      {
        title: "関係者の認識ズレ",
        body: "投資・経営・現場で優先すべき改善が異なり、実行が遅れる。",
      },
    ],
    features: [
      {
        title: "案件ダッシュボード",
        description: "DD進捗・リスク・改善KPIを案件単位で俯瞰し、次アクションを共有します。",
      },
      {
        title: "論点・エビデンス管理",
        description: "チェックリストと根拠資料を紐づけ、監査や再調査に備えた記録を残します。",
      },
      {
        title: "バリューアップバックログ",
        description: "改善施策を優先度・担当・効果見込みで管理し、実行フェーズへスムーズに移行。",
      },
      {
        title: "EXITシナリオ比較",
        description: "複数の出口パターンを並べ、前提と指標の差分を議論しやすくします。",
      },
    ],
    gallery: [
      {
        src: "/images/demo_images/m&a_demo01.png",
        alt: "M&A案件ダッシュボード",
        caption: "案件全体のフェーズと主要指標を俯瞰",
      },
      {
        src: "/images/demo_images/m&a_demo02.png",
        alt: "DD論点とリスク一覧",
        caption: "論点・リスク・エビデンスを一覧で管理",
      },
      {
        src: "/images/demo_images/m&a_demo03.png",
        alt: "バリューアップとEXITシナリオ",
        caption: "改善施策と出口シナリオを同じ案件文脈で比較",
      },
    ],
    techHighlights: [
      "案件・論点・施策を正規化したデータモデルでフェーズ横断の追跡が可能",
      "権限と機密区分に応じた閲覧・編集制御を前提にした設計",
      "ドキュメント参照とメタデータを分離し、更新と監査を両立",
      "BI連携や外部DDツールとのインポート余地を確保したAPI構成",
    ],
    relatedSolutionsSlug: "professional-services",
    relatedLinks: [
      { label: "DX戦略設計", href: "/services/consulting" },
      { label: "AI業務アプリ開発", href: "/services/development" },
    ],
  },
  {
    slug: "smart-agri-copilot",
    metaTitle: "スマート農業コパイロット | 実装事例 | AXEON",
    metaDescription:
      "農業・アグリテック向け。圃場データと作業記録を現場で素早く整理し、栽培判断を支援するデモの実装サンプルです。",
    heroEyebrow: "Oriza Copilot",
    heroTitle: "スマート農業コパイロット",
    heroSubtitle: "圃場の状況と作業を、現場で記録・共有する。",
    industryTag: "農業・アグリテック",
    whoFor: "農業法人・JA関連の生産管理担当（圃場・作付を複数管理する現場リーダー）",
    metrics: [
      { label: "作業記録入力", before: "30分/日", after: "10分/日" },
      { label: "生育判断の属人性", before: "ベテラン依存", after: "データ共有" },
      { label: "異常検知の初動", before: "翌日", after: "当日" },
    ],
    beforeAfter: {
      beforeTitle: "これまで",
      beforeBody:
        "圃場ごとのメモ、天候、施肥・収穫記録が紙や個人のスマホに分散し、後から集計や振り返りに時間がかかります。ベテランの判断が属人化し、新人への引き継ぎが難しい場面もあります。",
      afterTitle: "このサンプルで目指す姿",
      afterBody:
        "圃場単位で状況と作業がタイムラインに揃い、必要な情報を短時間で入力・参照できます。データの蓄積が次シーズンの栽培計画に活かしやすい形を目指しています。",
    },
    overviewParagraphs: [
      "農業現場では、記録の手間と「記録しないと後で困る」のジレンマが常につきまといます。このサンプルは、圃場・作業・環境データをモバイルでも入力しやすいUIで整理し、栽培判断の材料をチームで共有できる構成を想定しています。",
      "センサーや気象APIとの連携は段階的に拡張可能です。まずは手入力と写真・メモから始め、定着後に自動取り込みを足していく導入パスを推奨します。",
      "地域・品目・契約形態によって必要な項目は異なるため、フォームとダッシュボードはカスタマイズ前提で設計します。",
    ],
    overviewMedia: {
      kind: "image",
      src: "/images/demo_images/farm_demo01.png",
      alt: "スマート農業デモのダッシュボード画面",
    },
    flowSteps: [
      { number: "01", title: "圃場・作付登録", duration: "準備" },
      { number: "02", title: "現場記録", duration: "入力" },
      { number: "03", title: "状況の俯瞰", duration: "判断" },
      { number: "04", title: "次シーズンへ", duration: "改善" },
    ],
    painPoints: [
      {
        title: "記録の負荷",
        body: "作業の合間に詳細を書き残す時間がなく、後から思い出しで補完することになる。",
      },
      {
        title: "データの散在",
        body: "圃場ごとに形式が違い、集計や比較に手作業が必要。",
      },
      {
        title: "属人化した判断",
        body: "経験則が個人に閉じ、組織としての栽培知見が蓄積されにくい。",
      },
      {
        title: "新人の立ち上がり",
        body: "どの圃場で何をしたかが見えず、引き継ぎに時間がかかる。",
      },
    ],
    features: [
      {
        title: "圃場ダッシュボード",
        description: "圃場ごとの状況・予定・直近作業を一覧し、優先順位を素早く把握します。",
      },
      {
        title: "現場入力フォーム",
        description: "短い項目と写真で記録し、オフラインや簡易入力にも対応できる設計余地。",
      },
      {
        title: "タイムライン",
        description: "施肥・収穫・病害などの履歴を時系列で追い、振り返りと計画に活用。",
      },
      {
        title: "アラート・リマインド",
        description: "作業予定や異常気象の注意を通知し、取りこぼしを減らします。",
      },
    ],
    gallery: [
      {
        src: "/images/demo_images/farm_demo01.png",
        alt: "圃場ダッシュボード",
        caption: "圃場ごとの状況と作業予定を俯瞰",
      },
      {
        src: "/images/demo_images/farm_demo02.png",
        alt: "現場記録画面",
        caption: "現場で素早く作業と状況を記録",
      },
      {
        src: "/images/demo_images/farm_demo03.png",
        alt: "栽培データの分析ビュー",
        caption: "蓄積データを次の栽培判断に活用",
      },
    ],
    techHighlights: [
      "モバイルファーストの入力UIと、管理画面での集計・エクスポート",
      "気象・センサーAPI連携を見越したイベントログ設計",
      "圃場・作付・作業の階層モデルで品目や地域に応じた拡張が可能",
      "オフライン同期や権限（作業者・管理者）の切り分けに対応可能な構成",
    ],
    relatedSolutionsSlug: "retail-distribution",
    relatedLinks: [
      { label: "AI業務アプリ開発", href: "/services/development" },
      { label: "サービス一覧", href: "/services" },
    ],
  },
  {
    slug: "restaurant-ops-dashboard-demo",
    metaTitle: "飲食店オペレーション・ダッシュボード | 実装事例 | AXEON",
    metaDescription:
      "飲食・サービス向け。売上・シフト・入金など店舗オペレーションを短時間で体感できるダッシュボードの実装サンプルです。",
    heroEyebrow: "Restaurant Ops",
    heroTitle: "飲食店オペレーション・ダッシュボード",
    heroSubtitle: "売上・シフト・入金を、ひとつの業務UIで俯瞰する。",
    industryTag: "飲食・サービス",
    whoFor: "複数店舗の飲食チェーン運営・店舗管理者（本部と現場の双方）",
    demoFormat: "live",
    metrics: [
      { label: "KPI確認の頻度", before: "週次", after: "日次" },
      { label: "欠品・アラート対応", before: "店舗ごとバラバラ", after: "本部で一元" },
      { label: "レポート作成", before: "3h/週", after: "30分/週" },
    ],
    beforeAfter: {
      beforeTitle: "これまで",
      beforeBody:
        "売上見込み、シフト、入金リクエスト、客単価などの情報が複数ツールと紙に分散し、店長が状況を把握するのに時間がかかります。繁忙期は「いま何を優先すべきか」が見えにくくなります。",
      afterTitle: "このサンプルで目指す姿",
      afterBody:
        "主要オペレーション指標が一画面に揃い、3分程度で店舗運営のイメージを共有できます。デモでは実際にUIを操作し、日次の判断フローを体感いただけます。",
    },
    overviewParagraphs: [
      "多店舗・多拠点の飲食では、現場と本部で見たい数字が異なります。このサンプルは、店長・スタッフが日次で触る指標を業務UIに集約し、短時間で操作感を伝えられる構成を想定しています。",
      "売上推定、シフト状況、入金リクエスト、客先設定など、代表的な画面遷移をデモ内で体験できます。実装時はPOS・勤怠・会計との連携範囲を要件に合わせて設計します。",
      "公開デモはサイト内のインタラクティブ体験として提供しています。「デモ体験」から新しいタブで操作画面を開けます。",
    ],
    overviewMedia: {
      kind: "image",
      src: "/images/top07_restauland.png",
      alt: "飲食店オペレーション・ダッシュボードの画面イメージ",
    },
    flowSteps: [
      { number: "01", title: "ダッシュボード確認", duration: "俯瞰" },
      { number: "02", title: "シフト・売上", duration: "日次" },
      { number: "03", title: "入金・設定", duration: "運用" },
      { number: "04", title: "振り返り", duration: "改善" },
    ],
    painPoints: [
      {
        title: "情報の分散",
        body: "売上・シフト・入金が別システムにあり、店長が状況把握に時間を取られる。",
      },
      {
        title: "繁忙期の優先度",
        body: "ピーク時に「次に何をすべきか」が共有されず、対応が後手に回る。",
      },
      {
        title: "本部との認識差",
        body: "現場の実態と本部の数字のズレが、指示と現場の乖離を生む。",
      },
      {
        title: "新人の立ち上がり",
        body: "オペレーション画面の使い方が人依存で、教育コストが高い。",
      },
    ],
    features: [
      {
        title: "オペレーション一覧",
        description: "売上・シフト・入金など主要指標を一画面で俯瞰します。",
      },
      {
        title: "シフト・売上連動",
        description: "人員配置と売上見込みを近い文脈で確認できるレイアウトです。",
      },
      {
        title: "入金・客先設定",
        description: "日次の入金リクエストや客単価まわりの設定を素早く触れます。",
      },
      {
        title: "短時間デモ体験",
        description: "約3分で代表的な画面遷移を体験し、導入イメージを共有できます。",
      },
    ],
    gallery: [
      {
        src: "/images/top07_restauland.png",
        alt: "飲食店オペレーション・ダッシュボード",
        caption: "店舗オペレーションの主要指標を一覧",
      },
    ],
    techHighlights: [
      "業務UIを意識したダッシュボードとドリルダウン設計",
      "POS・勤怠など外部連携を見越したAPI境界",
      "権限（店長・スタッフ・本部）に応じた表示切り替え",
      "デモ用の軽量モードと本番データ連携の切り分け",
    ],
    relatedSolutionsSlug: "hospitality-food",
    relatedLinks: [
      { label: "AI業務アプリ開発", href: "/services/development" },
      { label: "サービス一覧", href: "/services" },
    ],
  },
  {
    slug: "hr-evaluation-support",
    metaTitle: "人事評価サポートAI | 実装事例 | AXEON",
    metaDescription:
      "人事・組織開発向け。評価コメントや面談準備を整理し、判断のムラを減らすAI支援ツールの実装サンプルです。",
    heroEyebrow: "人事評価サポートAI",
    heroTitle: "評価コメント・面談準備サポート",
    heroSubtitle: "評価プロセスを整理し、記録と対話の質を上げる。",
    industryTag: "人事・組織開発",
    whoFor: "人事部・各事業部の評価担当（従業員200〜3000名規模の評価シーズン運用）",
    metrics: [
      { label: "評価シート回収", before: "2週間", after: "5日" },
      { label: "1on1記録の散在", before: "個人メモ", after: "共有DB" },
      { label: "評価のばらつき", before: "部門差大", after: "基準で統一" },
    ],
    beforeAfter: {
      beforeTitle: "これまで",
      beforeBody:
        "評価シーズンになると、マネージャーごとにコメントの書き方や観点がばらつきます。面談準備に時間がかかり、記録が属人化しやすい状態になりがちです。",
      afterTitle: "このサンプルで目指す姿",
      afterBody:
        "評価観点と下書きの整理を支援し、面談前の準備と記録の一貫性を高めます。最終判断は人が行い、AIは整理とたたき台づくりに徹する設計です。",
    },
    overviewParagraphs: [
      "人事評価は、公平性とスピードの両立が求められる領域です。このサンプルは、評価コメントの下書きや面談準備メモの構造化を支援し、マネージャーの負荷を下げつつ品質のばらつきを抑えることを目的としています。",
      "評価制度・等級・コンピテンシーは組織ごとに異なるため、テンプレートとルールはカスタマイズ前提です。個人情報・評価データの取り扱いは厳格な権限設計とセットで実装します。",
      "公開デモは外部環境で操作感をご確認いただけます。",
    ],
    overviewMedia: {
      kind: "image",
      src: "/images/hyouka_pc.png",
      alt: "人事評価サポートAIツールの画面",
    },
    flowSteps: [
      { number: "01", title: "評価観点の確認", duration: "準備" },
      { number: "02", title: "下書き整理", duration: "記録" },
      { number: "03", title: "面談準備", duration: "対話" },
      { number: "04", title: "記録・振り返り", duration: "改善" },
    ],
    painPoints: [
      {
        title: "コメントのばらつき",
        body: "マネージャーごとに観点や粒度が異なり、評価の納得感が下がる。",
      },
      {
        title: "面談準備の負荷",
        body: "シーズン前後で準備と記録に時間が集中し、本業に影響する。",
      },
      {
        title: "記録の属人化",
        body: "過去の評価やフィードバックが探しづらく、継続的な育成に繋がらない。",
      },
      {
        title: "制度変更への追従",
        body: "評価制度の改定のたびに、運用とツールの説明が追いつかない。",
      },
    ],
    features: [
      {
        title: "評価コメント支援",
        description: "観点に沿った下書きを提案し、マネージャーの記述負荷を下げます。",
      },
      {
        title: "面談準備メモ",
        description: "対話の論点と過去記録を整理し、面談の質を一定化します。",
      },
      {
        title: "テンプレート連動",
        description: "等級・コンピテンシー定義に合わせた項目を組み込めます。",
      },
      {
        title: "権限と監査",
        description: "評価データの閲覧範囲と操作ログを要件に合わせて設計可能です。",
      },
    ],
    gallery: [
      {
        src: "/images/hyouka_pc.png",
        alt: "人事評価サポート画面",
        caption: "評価コメントと面談準備を支援するUI",
      },
    ],
    techHighlights: [
      "LLMは下書き・整理に限定し、最終確定は人の操作で行う設計",
      "評価マスタと履歴を分離したデータモデル",
      "人事システム・SSO連携を見越したAPI構成",
      "監査ログとマスキングを前提としたセキュリティ設計",
    ],
    relatedSolutionsSlug: "professional-services",
    relatedLinks: [
      { label: "AI業務アプリ開発", href: "/services/development" },
      { label: "コンサルティング", href: "/services/consulting" },
    ],
  },
  {
    slug: "handover-ai-charting",
    metaTitle: "申し送りAI（自動カルテ作成）| 実装事例 | AXEON",
    metaDescription:
      "医療・介護向け。音声メモから申し送り内容を素早く構造化するAI支援の実装サンプルです。",
    heroEyebrow: "申し送りAI",
    heroTitle: "自動カルテ作成サポート",
    heroSubtitle: "音声メモから、申し送りのたたき台を素早く。",
    industryTag: "医療・介護",
    whoFor: "病院・クリニック・介護施設の看護師・医療事務（シフト交代時の申し送り担当）",
    metrics: [
      { label: "申し送り作成", before: "15分/回", after: "5分/回" },
      { label: "情報漏れの指摘", before: "週3件", after: "週1件未満" },
      { label: "継続ケアの引き継ぎ", before: "口頭中心", after: "構造化記録" },
    ],
    beforeAfter: {
      beforeTitle: "これまで",
      beforeBody:
        "シフト交代時の申し送りが手書きや口頭中心で、記録の粒度や伝達漏れにばらつきが出ます。忙しい時間帯は後からカルテを書く負担が集中します。",
      afterTitle: "このサンプルで目指す姿",
      afterBody:
        "音声メモを構造化し、申し送りのたたき台を短時間で用意できます。最終確認はスタッフが行い、記録の均一化とスピードを両立します。",
    },
    overviewParagraphs: [
      "介護・医療現場では、記録の質とスピードが安全と業務効率に直結します。このサンプルは、音声入力から申し送り項目を整理し、スタッフが確認・修正するフローを想定しています。",
      "個人情報・医療情報の取り扱いは厳格な要件が必要です。マスキング、権限、保管期間、監査ログは導入前に設計します。",
      "公開デモは外部環境で代表フローをご確認いただけます。",
    ],
    overviewMedia: {
      kind: "image",
      src: "/images/voicememo.png",
      alt: "申し送りAIの画面イメージ",
    },
    flowSteps: [
      { number: "01", title: "音声メモ", duration: "入力" },
      { number: "02", title: "構造化", duration: "整理" },
      { number: "03", title: "確認・修正", duration: "記録" },
      { number: "04", title: "申し送り共有", duration: "引継" },
    ],
    painPoints: [
      {
        title: "記録の遅れ",
        body: "忙しい時間帯に記録が後回しになり、申し送りの質が落ちる。",
      },
      {
        title: "伝達漏れ",
        body: "口頭中心の申し送りで、重要な観察事項が次シフトに届かない。",
      },
      {
        title: "記述のばらつき",
        body: "スタッフごとに記録の粒度が異なり、引き継ぎに不安が残る。",
      },
      {
        title: "事務負荷",
        body: "カルテ作成に時間がかかり、ケアや対応時間を圧迫する。",
      },
    ],
    features: [
      {
        title: "音声から構造化",
        description: "音声メモを申し送り項目に沿って整理し、たたき台を生成します。",
      },
      {
        title: "確認フロー",
        description: "スタッフが内容を確認・修正してから確定する安全な運用を想定。",
      },
      {
        title: "テンプレート",
        description: "施設・サービス種別に合わせた申し送り項目を設定できます。",
      },
      {
        title: "監査・権限",
        description: "閲覧範囲と操作ログを要件に合わせて設計可能です。",
      },
    ],
    gallery: [
      {
        src: "/images/voicememo.png",
        alt: "申し送りAIの画面",
        caption: "音声メモから申し送り内容を構造化",
      },
    ],
    techHighlights: [
      "音声認識と構造化パイプラインの分離設計",
      "PHI・個人情報を考慮したマスキングと保存ポリシー",
      "既存電子カルテ・記録システムとの連携余地",
      "オフライン入力と後送の同期を見越した構成",
    ],
    relatedSolutionsSlug: "healthcare-public",
    relatedLinks: [
      { label: "AI業務アプリ開発", href: "/services/development" },
      { label: "サービス一覧", href: "/services" },
    ],
  },
  {
    slug: "property-matching",
    metaTitle: "物件マッチング | 実装事例 | AXEON",
    metaDescription:
      "不動産向け。希望条件の整理と提案候補の比較を素早く行うマッチングUIの実装サンプルです。",
    heroEyebrow: "物件マッチング",
    heroTitle: "条件整理と提案候補の可視化",
    heroSubtitle: "希望条件に合わせて、提案候補を素早く比較する。",
    industryTag: "不動産",
    whoFor: "不動産仲介・投資部門の営業・データ分析担当（提案スピードを重視するチーム）",
    metrics: [
      { label: "物件マッチング検索", before: "1h", after: "10分" },
      { label: "候補リスト作成", before: "半日", after: "1h" },
      { label: "顧客への提案精度", before: "試行錯誤", after: "条件フィルタで絞込" },
    ],
    beforeAfter: {
      beforeTitle: "これまで",
      beforeBody:
        "顧客の希望条件がメールや口頭で散らばり、物件リストとの突合に時間がかかります。提案理由の説明も担当者ごとにばらつきが出やすいです。",
      afterTitle: "このサンプルで目指す姿",
      afterBody:
        "条件を構造化して候補を並べ、比較と説明を短時間で行える状態を目指します。顧客とのすり合わせと社内共有がしやすくなります。",
    },
    overviewParagraphs: [
      "不動産提案では、「条件の言語化」と「候補の比較」に多くの時間が使われます。このサンプルは、希望条件を入力・整理し、マッチ度の高い候補を一覧で比較できるUIを想定しています。",
      "物件マスタ・図面・周辺情報の連携は段階的に拡張可能です。まずは条件整理と候補提示の体験から始め、定着後にデータ連携を足していく導入が現実的です。",
      "公開デモは外部環境で操作感をご確認いただけます。",
    ],
    overviewMedia: {
      kind: "image",
      src: "/images/hudousan_pc.png",
      alt: "物件マッチングの画面イメージ",
    },
    flowSteps: [
      { number: "01", title: "希望条件入力", duration: "整理" },
      { number: "02", title: "候補抽出", duration: "比較" },
      { number: "03", title: "提案・説明", duration: "共有" },
      { number: "04", title: "フォロー", duration: "更新" },
    ],
    painPoints: [
      {
        title: "条件の曖昧さ",
        body: "顧客の「なんとなく」が構造化されず、提案の精度が下がる。",
      },
      {
        title: "突合の手作業",
        body: "物件リストと希望の照合に時間がかかり、初回提案が遅れる。",
      },
      {
        title: "説明のばらつき",
        body: "なぜこの物件かの説明が担当者依存になり、信頼感に差が出る。",
      },
      {
        title: "情報の散在",
        body: "図面・周辺情報・過去提案が別管理で、引き継ぎが難しい。",
      },
    ],
    features: [
      {
        title: "条件ウィザード",
        description: "エリア・予算・間取りなどを段階的に整理し、漏れを減らします。",
      },
      {
        title: "候補比較ビュー",
        description: "マッチ度と差分を並べ、顧客への説明材料を素早く用意します。",
      },
      {
        title: "提案メモ",
        description: "担当者のコメントと顧客フィードバックを案件に紐づけて残します。",
      },
      {
        title: "データ連携",
        description: "物件マスタやCRMとの連携を見越したID設計が可能です。",
      },
    ],
    gallery: [
      {
        src: "/images/hudousan_pc.png",
        alt: "物件マッチング画面",
        caption: "希望条件と提案候補を並べて比較",
      },
    ],
    techHighlights: [
      "条件モデルとスコアリングを分離したマッチング設計",
      "地図・物件API連携の拡張余地",
      "顧客・案件・物件の関係を正規化したデータ構造",
      "権限と監査ログを前提とした営業支援UI",
    ],
    relatedSolutionsSlug: "professional-services",
    relatedLinks: [
      { label: "AI業務アプリ開発", href: "/services/development" },
      { label: "サービス一覧", href: "/services" },
    ],
  },
  {
    slug: "internal-knowledge-bot",
    galleryNote:
      "業種横断デモの複数画面スクショは順次差し替え予定です。現時点は代表画面のイメージを掲載しています（`/experience/internal-knowledge-share-bot` で実際の操作をご確認ください）。",
    metaTitle: "社内ナレッジ共有BOT | 実装事例 | AXEON",
    metaDescription:
      "業種別ナレッジに沿って回答し、ガイドツリーとチャットの両方から同じルールで案内する AI アシスタントの実装サンプルです。",
    heroEyebrow: "AI Knowledge Bot",
    heroTitle: "社内ナレッジ共有BOT",
    heroSubtitle: "ガイドもチャットも、同じポリシーと出典でつなぐ。",
    industryTag: "横断（AIアシスタント）",
    whoFor: "社内サポート・情シス・全社員（社内FAQ・規程検索の利用者）",
    demoFormat: "live",
    metrics: [
      { label: "FAQ解決時間", before: "15分", after: "3分" },
      { label: "同質問の窓口負荷", before: "件数多", after: "約半減" },
      { label: "ドキュメント発見", before: "探し回り", after: "一問一答" },
    ],
    beforeAfter: {
      beforeTitle: "これまで",
      beforeBody:
        "マニュアルとFAQがフォルダやチャットに分散し、新人や非定型的な問いに強い担当者へ質問が集中します。回答に出典がなく、部署によって説明がぶれることもあります。",
      afterTitle: "このサンプルで目指す姿",
      afterBody:
        "業種モードを選ぶだけで回答の前提が揃い、ステップガイドとチャットの両方から同じナレッジベースを参照します。重要な注意事項と参照元を画面に残し、確認と教育をしやすくします。",
    },
    overviewParagraphs: [
      "社内ナレッジは「探す時間」と「解釈のブレ」の両方がコストです。このサンプルは、業種別の前提とポリシーを最初に固定し、その上でガイドツリーと対話の両方からたどれる二画面体験を実装しています。",
      "回答には参照元の表示余地を確保し、最終判断が人にある領域（法令・契約・医療判断など）は注意書きとエスカレーション導線を明示します。実サイト上では実際に入力して挙動を確認できます。",
      "ナレッジの一次ソースは御社のドキュメントや規程に置き換え可能です。公開情報のみで試す PoC から、認証付きの閉じたナレッジへ段階的に広げる設計が可能です。",
    ],
    overviewMedia: {
      kind: "video",
      src: "/media/showcase/internal-knowledge-share-bot.mp4",
      ariaLabel: "社内ナレッジ共有BOTのデモ動画",
    },
    flowSteps: [
      { number: "01", title: "業種モード選択", duration: "前提" },
      { number: "02", title: "ガイドで確認", duration: "手順" },
      { number: "03", title: "チャットで深掘り", duration: "対話" },
      { number: "04", title: "出典・記録", duration: "安心" },
    ],
    painPoints: [
      {
        title: "検索できないナレッジ",
        body: "ファイル名やフォルダ運用に依存し、必要な段落にたどり着けない。",
      },
      {
        title: "回答のブレ",
        body: "同じ質問でも担当者によって結論や注意事項が異なり、監査や教育に不安が残る。",
      },
      {
        title: "オンボーディング負荷",
        body: "新人が「誰に聞けばいいか」わからず、ベテランの時間を消費する。",
      },
      {
        title: "参照履歴の欠如",
        body: "いつ誰がどの回答を見たかが残らず、インシデント後の追跡が難しい。",
      },
    ],
    features: [
      {
        title: "業種別モード",
        description: "建設・医療事務・自治体など前提を切り替え、回答の枠組みを誤らないようにします。",
      },
      {
        title: "ステップガイド",
        description: "定型フローを画面左で確認しながら、進捗を迷わず進められます。",
      },
      {
        title: "チャットでの深掘り",
        description: "ガイドで足りない部分を自然文で質問し、同じナレッジから補足を得られます。",
      },
      {
        title: "出典・注意の明示",
        description: "参照ドキュメントや注意書きを表示し、コンプライアンス配慮をUIに埋め込みます。",
      },
    ],
    gallery: [
      {
        src: "/images/regaldashboard_pc.webp",
        alt: "ダッシュボード風の参照画面イメージ",
        caption: "業種別ダッシュボードとガイドを組み合わせたイメージ",
      },
      {
        src: "/images/jinji_pc.webp",
        alt: "業務アプリ画面イメージ",
        caption: "社内向け業務UIとの並列イメージ（実装は御社要件に合わせて調整）",
      },
    ],
    techHighlights: [
      "LLM と検索・ルールエンジンを組み合わせ、出典可能性を高めるRAG構成を想定",
      "ガイドツリーとチャットで同じポリシーサーバを参照する二系統UI",
      "認証・権限・ログを前提としたAPI設計（公開デモは軽量モード）",
      "プロンプトとナレッジ更新の運用フローを別途すり合わせ可能",
    ],
    relatedSolutionsSlug: "professional-services",
    relatedLinks: [
      { label: "AI業務アプリ開発", href: "/services/development" },
      { label: "コンサルティング", href: "/services/consulting" },
    ],
  },
];

const bySlug = new Map<string, CaseStudyDetail>(DETAILS.map((d) => [d.slug, d]));

export function getCaseStudyDetail(slug: string): CaseStudyDetail | undefined {
  return bySlug.get(slug);
}

export function getAllCaseStudySlugs(): string[] {
  return DETAILS.map((d) => d.slug);
}

/** OGP 用。動画ヒーロー時はギャラリー先頭の静止画を使用 */
export function getCaseStudyOpenGraphImageSrc(detail: CaseStudyDetail): string {
  if (detail.overviewMedia.kind === "image") {
    return detail.overviewMedia.src;
  }
  const first = detail.gallery[0];
  return first?.src ?? "/images/genbakanri_admin.webp";
}
