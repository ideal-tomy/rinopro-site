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
    heroTitle: "〇〇工業向け 現場ポケット",
    heroSubtitle: "現場でも事務所でも、今日の現場がひと目でわかる。",
    industryTag: "建設・工事",
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
      { label: "DX戦略・コンサルティング", href: "/services/consulting" },
    ],
  },
  {
    slug: "shaken-notify",
    metaTitle: "車検管理ダッシュボード（Shaken Notify）| 実装事例 | AXEON",
    metaDescription:
      "整備・車両管理向け。車検期限と顧客通知、優先度付きの業務キューを一元化するダッシュボードの実装サンプルです。",
    heroEyebrow: "Shaken Notify",
    heroTitle: "車検管理ダッシュボード",
    heroSubtitle: "期限・通知・対応履歴を、ひとつの画面で回す。",
    industryTag: "整備・車両管理",
    beforeAfter: {
      beforeTitle: "これまで",
      beforeBody:
        "期限管理がスプレッドシートと紙、メールに分散し、誰がどの顧客へ連絡済みかが追いにくい状態になりがちです。繁忙期は優先順位が曖昧になり、見積もりや入庫調整も後手に回ります。",
      afterTitle: "このサンプルで目指す姿",
      afterBody:
        "期限が近い車両が自動的に上位に浮かび、通知履歴と次アクションが同一画面に揃います。店舗全体で同じキューを見ながら、取りこぼしを減らす運用を想定しています。",
    },
    overviewParagraphs: [
      "車検・法定点検まわりは、期限ドリブンで例外処理も多い業務です。このサンプルは、期限・通知・対応状況をダッシュボードで一元管理し、スタッフが「いま何をすべきか」を迷わない状態をつくることを目的としています。",
      "顧客への連絡タイミングやチャネルは店舗ごとに異なるため、設定で調整できる余地を残しつつ、標準的な優先度ルール（期限の迫り具合・リピート顧客など）を初期表示に載せています。",
      "実運用では既存の基幹や DMS との連携範囲を決め、個人情報・メッセージテンプレート・監査ログの要件に合わせて拡張します。ここでは UI と業務フローのイメージ確認にフォーカスしています。",
    ],
    overviewMedia: {
      kind: "image",
      src: "/images/kurumakanri_pc.webp",
      alt: "車検管理ダッシュボードのPC画面",
    },
    flowSteps: [
      { number: "01", title: "期限の取り込み", duration: "データ" },
      { number: "02", title: "優先度付け", duration: "キュー" },
      { number: "03", title: "通知・フォロー", duration: "顧客" },
      { number: "04", title: "履歴・分析", duration: "改善" },
    ],
    painPoints: [
      {
        title: "期限の取りこぼし",
        body: "入力更新が止まると通知が遅れ、顧客満足や売上機会に直結する。",
      },
      {
        title: "連絡履歴の断絶",
        body: "誰がいつどの文面で連絡したかが残らず、引き継ぎでトラブルになりやすい。",
      },
      {
        title: "優先度が感覚頼り",
        body: "繁忙期は目の前の作業に追われ、本来先に触るべき案件が後ろに回る。",
      },
      {
        title: "モバイルとPCの差",
        body: "外回りと受付で見える情報が違うと、ダブル確認や手戻りが増える。",
      },
    ],
    features: [
      {
        title: "期限ドリブンのキュー",
        description: "残日数や稼働状況に応じて案件を並べ替え、チームで同じ優先度を共有します。",
      },
      {
        title: "通知テンプレと履歴",
        description: "定型文と送信履歴を残し、クレームや確認依頼にすぐ応えられる状態をつくります。",
      },
      {
        title: "モバイル対応ビュー",
        description: "外勤でもキューを確認し、次の一手をその場で記録できるレイアウトです。",
      },
      {
        title: "見積・入庫フローへの導線",
        description: "ダッシュボードから次工程へ進みやすく、オペレーションの脱線を減らします。",
      },
    ],
    gallery: [
      {
        src: "/images/kurumakanri_pc.webp",
        alt: "車検管理のPCダッシュボード",
        caption: "PC：優先度と期限が一目でわかるキュー",
      },
      {
        src: "/images/kurumakanri_mobile.webp",
        alt: "車検管理のモバイル画面",
        caption: "外出先でもキュー確認とメモの追記がしやすい画面",
      },
    ],
    techHighlights: [
      "一覧・フィルタ・ソートを中心とした高応答のダッシュボードUI",
      "通知チャネル（メール/LINE 等）は要件に応じてアダプタを差し替え可能な構成",
      "監査のための操作ログ・テンプレ版管理を前提にしたデータモデル",
      "繁忙期の負荷を考慮したバッチとオンライン処理の切り分け",
    ],
    relatedSolutionsSlug: "logistics-mobility",
    relatedLinks: [
      { label: "AI業務アプリ開発", href: "/services/development" },
      { label: "データ活用・基盤構築", href: "/services" },
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
    slug: "sales-pipeline",
    metaTitle: "営業パイプライン テンプレート | 実装事例 | AXEON",
    metaDescription:
      "営業・経営支援向け。商談の進行・受注見込み・停滞案件を一覧し、チームで優先度を揃えるダッシュボードのサンプルです。",
    heroEyebrow: "営業ダッシュボード",
    heroTitle: "営業パイプライン テンプレート",
    heroSubtitle: "商談の温度感と数字を、同じボードで共有する。",
    industryTag: "営業・経営支援",
    beforeAfter: {
      beforeTitle: "これまで",
      beforeBody:
        "案件ごとの進捗が個人のメールとメモに閉じ、週次ミーティングまで状況が見えない。受注予測が感覚頼みになり、経営サイドとのすり合わせに時間がかかります。",
      afterTitle: "このサンプルで目指す姿",
      afterBody:
        "ステージ・金額・次アクションがボードに揃い、停滞や期限超過が色で浮きます。誰がどこに時間を使うべきかをチームで素早く合意しやすくなります。",
    },
    overviewParagraphs: [
      "営業組織では「今四半期に何が閉まるか」と「個々の商談の深さ」の両方が必要です。このサンプルは、パイプラインと簡易KPIを同じ画面構成に近づけ、現場の更新負荷を下げつつ俯瞰できるようにしています。",
      "商談履歴や次アクションはカードに集約し、マネージャーはフィルタでチーム全体を切り替えて確認できます。テンプレートとして一般的な BtoB のステージ定義から始め、御社の商習慣へ寄せて調整します。",
      "CRM 本番と連携するか、まずは独立したボードとして試すかは導入戦略次第です。いずれの場合も、入力項目と権限を最小から始め、定着後に拡張する方針を推奨します。",
    ],
    overviewMedia: {
      kind: "image",
      src: "/images/salesdashboard_pc.webp",
      alt: "営業パイプラインのダッシュボード",
    },
    flowSteps: [
      { number: "01", title: "リードの整形", duration: "入口" },
      { number: "02", title: "商談の深化", duration: "提案" },
      { number: "03", title: "見極め", duration: "交渉" },
      { number: "04", title: "受注・振り返り", duration: "改善" },
    ],
    painPoints: [
      {
        title: "進捗の不透明さ",
        body: "クローズ予定日や確度が更新されず、予実がずれたときに原因が追いにくい。",
      },
      {
        title: "優先順位の不一致",
        body: "メンバーごとに「いま触るべき案件」が異なり、ミーティングが調整だらけになる。",
      },
      {
        title: "ナレッジの分散",
        body: "提案資料や競合メモが個人フォルダに散らばり、再利用されない。",
      },
      {
        title: "経営への説明コスト",
        body: "都度スライドを作り直し、同じ質問に答える時間が繰り返される。",
      },
    ],
    features: [
      {
        title: "パイプラインとカードビュー",
        description: "ステージ別に商談を並べ替え、ドラッグやワンクリックで状態更新します。",
      },
      {
        title: "停滞・期限アラート",
        description: "一定期間動いていない案件や締切接近案件を自動で浮かべます。",
      },
      {
        title: "簡易レポート",
        description: "受注見込みやパイプライン金額を期間で切り替え、振り返りを短時間で実施。",
      },
      {
        title: "メモ・添付の一元化",
        description: "商談カードに資料リンクやサマリを残し、引き継ぎとレビューを楽にします。",
      },
    ],
    gallery: [
      {
        src: "/images/salesdashboard_pc.webp",
        alt: "営業ダッシュボードPC",
        caption: "商談パイプラインと主要指標を同時に確認",
      },
      {
        src: "/images/salesdashboard_mobile.webp",
        alt: "営業ダッシュボードモバイル",
        caption: "外出先でもカードを更新し次アクションを記録",
      },
    ],
    techHighlights: [
      "ダッシュボードの集計はサーバ側で一貫したクエリに基づき算出",
      "権限によりチーム・個人の可视範囲を切り替え",
      "将来的なCRM連携を見越したID設計とイベントログ",
      "AI アラートはルールベースと併用し、誤検知時のチューニングがしやすい構成",
    ],
    relatedSolutionsSlug: "retail-distribution",
    relatedLinks: [
      { label: "AI業務アプリ開発", href: "/services/development" },
      { label: "サービス一覧", href: "/services" },
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
