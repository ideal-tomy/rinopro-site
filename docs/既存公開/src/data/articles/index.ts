export type ArticleIndustry =
  | "建設"
  | "製造"
  | "医療・介護"
  | "保育"
  | "小売"
  | "飲食"
  | "ビルメンテナンス"
  | "運送・物流"
  | "倉庫";

export type IndustryArticle = {
  slug: string;
  title: string;
  description: string;
  industry: ArticleIndustry;
  /** ハブ「業界から」に出す短い名 */
  hubIndustry: string;
  /** ハブ「よくある悩み」に出す短い名 */
  jamLabel: string;
  /** 読む目安（分） */
  readingMinutes: number;
  /** 画面デモへの導線があるか（URL未公開の準備中は false） */
  hasDemo: boolean;
  /** ハブに出す補足: 画面あり / 知識のみ / 画面準備中 */
  demoLabel: "画面あり" | "知識のみ" | "画面準備中";
  publishedAt: string;
  lawCheckedAt: string;
  /** 対応する W型LP（任意） */
  relatedDemoLp?: string;
};

export const industryArticles: IndustryArticle[] = [
  {
    slug: "construction",
    title: "工事写真の整理が終わらない理由と、その直し方。",
    description:
      "事務所に戻ってから写真を整理する。この順番のままでは終わりません。撮る前・撮るとき・撮ったあとに分けて、工事写真の実務のやり方をまとめました。",
    industry: "建設",
    hubIndustry: "建設",
    jamLabel: "写真が終わらない",
    readingMinutes: 10,
    hasDemo: true,
    demoLabel: "画面あり",
    publishedAt: "2026-08",
    lawCheckedAt: "2026-08",
    relatedDemoLp: "/demo/w/construction-record",
  },
  {
    slug: "manufacturing",
    title: "ベテランの手順を、聞き取って書き残す方法。",
    description:
      "工程を一つ決め、ベテランに話してもらい、聞き取った内容を書き残す。聞き取りの順番と、録音・撮影の前に決めることをまとめました。",
    industry: "製造",
    hubIndustry: "製造",
    jamLabel: "手順が残らない",
    readingMinutes: 9,
    hasDemo: true,
    demoLabel: "画面あり",
    publishedAt: "2026-08",
    lawCheckedAt: "2026-08",
    relatedDemoLp: "/demo/w/manufacturing-judgment",
  },
  {
    slug: "care",
    title: "記録がずれる理由と、その残し方。",
    description:
      "書類どうしが食い違うのは、その日のうちに書けていないからです。その場で残す、五つを突き合わせる、運営指導の前に揃える、の順でまとめました。",
    industry: "医療・介護",
    hubIndustry: "医療・介護",
    jamLabel: "記録がずれる",
    readingMinutes: 9,
    hasDemo: true,
    demoLabel: "画面あり",
    publishedAt: "2026-08",
    lawCheckedAt: "2026-08",
    relatedDemoLp: "/demo/w/care-records",
  },
  {
    slug: "childcare",
    title: "保育の記録がずれる理由と、残し方。",
    description:
      "午睡中に決まった回数を見る、見る時間より書く時間を長くしない、何かあった日に出せる形にしておく。ガイドラインの三つの場面から、記録の残し方をまとめました。",
    industry: "保育",
    hubIndustry: "保育",
    jamLabel: "何かあった日の記録",
    readingMinutes: 8,
    hasDemo: true,
    demoLabel: "画面あり",
    publishedAt: "2026-08",
    lawCheckedAt: "2026-08",
    relatedDemoLp: "/demo/w/childcare-records",
  },
  {
    slug: "retail",
    title: "問い合わせが減らない理由と、その直し方。",
    description:
      "届く問い合わせの多くは、書いていない・届いていない・見つからない、から来ています。返品の表示、発送の通知、置き場所。直す順番をまとめました。",
    industry: "小売",
    hubIndustry: "小売",
    jamLabel: "問い合わせが減らない",
    readingMinutes: 9,
    hasDemo: true,
    demoLabel: "画面あり",
    publishedAt: "2026-08",
    lawCheckedAt: "2026-08",
    relatedDemoLp: "/demo/w/retail-support",
  },
  {
    slug: "restaurant",
    title: "シフトでもめる理由と、先に決めること。",
    description:
      "雇うときに働く時間の幅を書いて渡す、希望を集めてから組んで表で伝える、一日八時間を超える組み方と当日欠勤の直し方。厚労省の留意事項をふまえてまとめました。",
    industry: "飲食",
    hubIndustry: "飲食",
    jamLabel: "シフトでもめる",
    readingMinutes: 8,
    hasDemo: false,
    demoLabel: "画面準備中",
    publishedAt: "2026-08",
    lawCheckedAt: "2026-08",
  },
  {
    slug: "building",
    title: "法定点検が漏れる理由と、台帳の作り方。",
    description:
      "一棟の台帳に起点の列を入れる、実施した日に次回期限を書き直す、棟が増えたら件数が掛け算になる前提で見る。台帳の作り方をまとめました。",
    industry: "ビルメンテナンス",
    hubIndustry: "ビルメン",
    jamLabel: "点検が漏れる",
    readingMinutes: 9,
    hasDemo: false,
    demoLabel: "画面準備中",
    publishedAt: "2026-08",
    lawCheckedAt: "2026-08",
  },
  {
    slug: "logistics",
    title: "日報を残し、途中で見て、配車を変える。",
    description:
      "改善基準告示は、その場で分かるものから年度末まで分からないものまであります。日報と点呼を残し、月の途中で見て、配車を変える順でまとめました。",
    industry: "運送・物流",
    hubIndustry: "運送",
    jamLabel: "守れているか分からない",
    readingMinutes: 9,
    hasDemo: false,
    demoLabel: "知識のみ",
    publishedAt: "2026-08",
    lawCheckedAt: "2026-08",
  },
  {
    slug: "warehouse",
    title: "数が合わないとき、範囲を絞り、原因を書く。",
    description:
      "棚卸の差異には四つの原因があり、原因ごとに直し方が違います。範囲を絞り、原因を一つ書き、担当を決める順でまとめました。",
    industry: "倉庫",
    hubIndustry: "倉庫",
    jamLabel: "数が合わない",
    readingMinutes: 9,
    hasDemo: false,
    demoLabel: "知識のみ",
    publishedAt: "2026-08",
    lawCheckedAt: "2026-08",
  },
];

export function getArticleBySlug(slug: string): IndustryArticle | undefined {
  return industryArticles.find((a) => a.slug === slug);
}

export function getAllArticleSlugs(): string[] {
  return industryArticles.map((a) => a.slug);
}

export function getArticleHref(slug: string): string {
  return `/articles/${slug}`;
}

export function getArticleContactHref(slug: string): string {
  return `/contact?service=ai-consulting&intent=article&article=${encodeURIComponent(slug)}`;
}

/** 横断記事（よくある悩み）。/articles/t/{slug} */
export type ThemeArticle = {
  slug: string;
  title: string;
  description: string;
  /** ハブ「よくある悩み」に出す短い名 */
  hub: string;
  /** 表紙の職場ラベル */
  workplace: string;
  readingMinutes: number;
  hasDemo: boolean;
  demoLabel: "画面あり" | "知識のみ" | "画面準備中";
  publishedAt: string;
  lawCheckedAt?: string;
  /** 原型の業界記事 slug（横断のみの記事は省略可） */
  prototypeSlug?: "retail" | "manufacturing" | "restaurant";
};

export const themeArticles: ThemeArticle[] = [
  {
    slug: "night-inquiry",
    title: "夜間の問い合わせが、間違った答えになる。",
    description:
      "夜10時を過ぎて届いた4件。翌朝には返信が出ていたが、その答えが店の決まりと合っていなかった。返品の表示と、人に残す範囲の決め方をまとめました。",
    hub: "夜間に間違えると怖い",
    workplace: "ネットショップ",
    readingMinutes: 9,
    hasDemo: true,
    demoLabel: "画面あり",
    publishedAt: "2026-08",
    lawCheckedAt: "2026-08",
    prototypeSlug: "retail",
  },
  {
    slug: "shop-voice",
    title: "現場の音声を、そのまま入れられない。",
    description:
      "ベテランの話を録音して整理したい。でも図面番号や取引先名が入る。録音前に決める四つと、外に出せる線をまとめました。",
    hub: "現場の話を出せない",
    workplace: "製造業",
    readingMinutes: 9,
    hasDemo: true,
    demoLabel: "画面あり",
    publishedAt: "2026-08",
    prototypeSlug: "manufacturing",
  },
  {
    slug: "shift-notice",
    title: "「シフトによる」だけでは、もめは消えない。",
    description:
      "労働条件通知書に「シフトによる」とだけ書いてある。今週の表と、雇ったときの説明が噛み合っていない線をまとめました。",
    hub: "聞いていた時間と違う",
    workplace: "飲食店",
    readingMinutes: 9,
    hasDemo: false,
    demoLabel: "画面準備中",
    publishedAt: "2026-08",
    lawCheckedAt: "2026-08",
    prototypeSlug: "restaurant",
  },
  {
    slug: "receipt-search",
    title: "PDFをフォルダに入れても、保存したことにはならない。",
    description:
      "scan001.pdf のままフォルダに入れても、日付・金額・取引先で探せない。電帳法が求める検索要件と、ファイル名の一手をまとめました。",
    hub: "領収書が探せない",
    workplace: "経理",
    readingMinutes: 8,
    hasDemo: false,
    demoLabel: "知識のみ",
    publishedAt: "2026-08",
    lawCheckedAt: "2026-08",
  },
  {
    slug: "invoice-fields",
    title: "請求書を自動で作っても、適格の欄が空だと出せない。",
    description:
      "品目と金額までは出る。登録番号と税率の欄が空だと、相手が適格として使えない。ひな形に書く二欄をまとめました。",
    hub: "請求の欄が空",
    workplace: "経理",
    readingMinutes: 7,
    hasDemo: false,
    demoLabel: "知識のみ",
    publishedAt: "2026-08",
    lawCheckedAt: "2026-08",
  },
  {
    slug: "minutes-names",
    title: "会議の録音を、そのまま文字にできない。",
    description:
      "残したいのは決定事項。文字にすると顧客名と個人名が並ぶ。残してよい名前を会議の前に紙一枚にする話です。",
    hub: "議事に名前が残る",
    workplace: "事務所",
    readingMinutes: 7,
    hasDemo: false,
    demoLabel: "知識のみ",
    publishedAt: "2026-08",
    lawCheckedAt: "2026-08",
  },
  {
    slug: "mail-paste",
    title: "返信の下書きは欲しい。本文はそのまま貼れない。",
    description:
      "金額・条件・個人が入った受信メールは、そのまま貼れない。伏せてから下書きの骨格を作る順をまとめました。",
    hub: "メールを貼れない",
    workplace: "営業",
    readingMinutes: 7,
    hasDemo: false,
    demoLabel: "知識のみ",
    publishedAt: "2026-08",
    lawCheckedAt: "2026-08",
  },
  {
    slug: "folder-rights",
    title: "社内の文書を全部入れると、見えないはずのものまで出る。",
    description:
      "フォルダの閲覧範囲は検索に残らない。全員が見てよいフォルダを一つ決めてから対象を渡す話です。",
    hub: "見えない文書まで出る",
    workplace: "事務所",
    readingMinutes: 6,
    hasDemo: false,
    demoLabel: "知識のみ",
    publishedAt: "2026-08",
  },
  {
    slug: "quote-price",
    title: "見積を早く出しても、根拠が残らない。",
    description:
      "金額は出ている。単価の出どころが頭にしかない。一品目だけ余白に書く話です。",
    hub: "見積の根拠が残らない",
    workplace: "営業・施工",
    readingMinutes: 8,
    hasDemo: false,
    demoLabel: "知識のみ",
    publishedAt: "2026-08",
    lawCheckedAt: "2026-08",
  },
  {
    slug: "time-stamp",
    title: "勤怠を自動にしても、打刻のない日は埋まらない。",
    description:
      "空欄をいつもの時間で埋めると表は揃う。働いた時間の記録にはならない。本人確認の欄を残す話です。",
    hub: "打刻のない日が埋まる",
    workplace: "店舗",
    readingMinutes: 7,
    hasDemo: false,
    demoLabel: "画面準備中",
    publishedAt: "2026-08",
    lawCheckedAt: "2026-08",
  },
];

export function getThemeArticleBySlug(slug: string): ThemeArticle | undefined {
  return themeArticles.find((a) => a.slug === slug);
}

export function getAllThemeArticleSlugs(): string[] {
  return themeArticles.map((a) => a.slug);
}

export function getThemeArticleHref(slug: string): string {
  return `/articles/t/${slug}`;
}

export function getThemeArticleContactHref(slug: string): string {
  return `/contact?service=ai-consulting&intent=article&article=${encodeURIComponent(slug)}`;
}
