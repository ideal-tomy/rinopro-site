import type { IndustryLpConfig } from "./types";
import { INDUSTRY_EXTERNAL_DEMOS } from "./external-demos";

const hubUrl = INDUSTRY_EXTERNAL_DEMOS.manufacturing;
const knowledgeUrl = INDUSTRY_EXTERNAL_DEMOS.internalKnowledge;

/** ideal manufacturing-judgment 移植。ROI 数値は初期値試算（年間 1,960万円） */
export const manufacturingIndustryLp: IndustryLpConfig = {
  slug: "manufacturing",
  demoName: "製造の判断デモ",
  demoUrl: hubUrl,
  ogp: {
    title: "製造の判断デモ｜聞いて、根拠付きで答えにたどり着く | AXEON",
    description:
      "規程・手順・判断基準を探し回る時間を減らし、回答と出典をセットで返します。製造ハブで体験できます。",
    image: {
      src: "/images/lp/manufacturing_light.png",
      alt: "製造の判断デモのイメージ",
    },
  },
  hero: {
    headline: "規程を探し回らず、聞けば根拠が届く。",
    subline:
      "判断基準がベテランの頭の中にある。文書はあるのに、たどり着くまでが仕事になっている。",
    body: "現場や部門からの質問に、回答だけでなく根拠の文書箇所まで添えて返せます。版ずれや窓口の違いで止まる時間を短くすることを目指します。",
    ctas: [
      {
        label: "お問い合わせ",
        href: "/contact",
        variant: "primary",
      },
      {
        label: "デモを試す ↗",
        href: hubUrl,
        external: true,
        variant: "secondary",
      },
    ],
    visual: {
      src: "/images/lp/manufacturing_light.png",
      alt: "製造現場・判断支援のイメージ",
      note: "※画像はイメージです",
      fit: "contain",
    },
  },
  impact: {
    mainFigure: {
      lead: "試算の初期値では、問い合わせ・探索に関わる40人で",
      value: "年間 1,960万円",
      trail: "が、資料探索と確認の待ちに使われています。",
    },
    basis:
      "計算根拠（初期値）: 1人35分/日 × 時給3,500円 × 240営業日 × 40人",
    metrics: [
      { value: "35分", label: "1人・1日あたりの探索・確認（試算初期値）" },
      { value: "¥0", label: "実証トライアルは無償" },
      { value: "根拠付き", label: "回答と出典をセット" },
      { value: "3〜6ヶ月", label: "投資回収の目安" },
    ],
  },
  problem: {
    label: "いま発生している作業",
    headline: "正解はあるのに、たどり着くまでが仕事になっていませんか。",
    lead: "フォルダを開き、詳しい人に聞き、根拠のページが共有されないまま同じ質問が繰り返されます。",
    diagram: {
      src: "/images/lp/manufacturing/search-maze-cost.svg",
      alt: "答えは文書にあるのに、たどり着くまでが仕事",
    },
    items: [
      {
        no: "01",
        title: "質問が発生する",
        body: "現場や他部門から、手順・優先・窓口についての問い合わせが来る。",
      },
      {
        no: "02",
        title: "資料を探す",
        body: "共有ドライブや紙・チャット履歴を探し回る。",
      },
      {
        no: "03",
        title: "詳しい人に聞く",
        body: "ベテランに口頭で確認し、根拠ページは曖昧なまま残る。",
      },
      {
        no: "04",
        title: "その場しのぎで返す",
        body: "同じ質問が再発し、判断のばらつきが残る。",
      },
    ],
    summary: {
      headline: "探す時間が、判断のリードタイムそのものです。",
      body: "回答と出典を同時にそろえると、次の人が同じ探索をしにくくなります。",
    },
  },
  recurringProblems: {
    label: "よく起きる問題",
    headline: "根拠が残らないと、同じ問い合わせが何度でも戻る。",
    diagram: {
      src: "/images/lp/manufacturing/same-question-loop.svg",
      alt: "同じ質問が毎週戻る。根拠が残らないから",
    },
    closing: {
      line1: "口頭だけで済ませると、組織に答えが残りません。",
      line2: "次の人がまた同じ探索を始め、同じ質問が毎週戻ってきます。",
    },
  },
  fit: {
    label: "どのような会社に向いているか",
    headline: "文書はあるのに、探すことがボトルネックの現場に向いています。",
    lead: "次のような状況に近いほど効きます。",
    scopeNote:
      "全社文書の一括取り込みを最初から前提にしません。対象コーパスと権限を決めてから進めます。",
    conditions: [
      {
        no: "1",
        roleLabel: "現場",
        title: "同じ問い合わせが繰り返される",
        body: "手順・優先・連絡先など、似た質問が毎週のように発生する。",
      },
      {
        no: "2",
        roleLabel: "文書",
        title: "規程・マニュアルが文書として存在する",
        body: "口頭だけの知識ではなく、参照できる文書がある（不十分でもよい）。",
      },
      {
        no: "3",
        roleLabel: "確認",
        title: "根拠の提示まで揃えたい",
        body: "「何を根拠にそう言ったか」を残したい運用である。",
      },
    ],
    affirm:
      "3つ当てはまるなら、探索時間と属人回答を減らす設計に乗せやすいです。",
    exclude:
      "文書がほぼ無く口頭だけ、回答を無確認で最終決定に使う、権限設計なしで機密を広く検索させたい、といった場合は向きません。",
  },
  usecases: {
    label: "業務ごとの利用例",
    headline: "製造の判断を、文書に聞ける形にできます。",
    lead: "手順改定・変更影響・日常の確認など、「探してから決める」場面に向きます。",
    items: [
      {
        industry: "生産・現場",
        scope: "手順・優先ルール",
        quote: "どの手順が正なのか、探すだけで時間が終わる",
        body: "質問に対して、該当する手順と根拠箇所を返せます。",
      },
      {
        industry: "品質・QC/QA",
        scope: "窓口・判断の分岐",
        quote: "窓口がどこか分からず、現場が止まる",
        body: "連絡先や優先の手がかりを、文書ベースで示せます。",
      },
      {
        industry: "技術・設計",
        scope: "変更影響・規格",
        quote: "影響範囲を思い出しながら調べている",
        body: "関連文書への手がかりを短時間で揃えやすくします。",
      },
      {
        industry: "間接部門",
        scope: "社内規程の問い合わせ",
        quote: "同じ規程の質問が何度も来る",
        body: "総務・人事寄りの社内ナレッジにも同じ型を適用できます。",
      },
    ],
    more: "製造ハブでは現場判断・手順改定・変更影響などの体験テーマにも触れられます。",
  },
  partsCatalog: {
    label: "必要な機能から導入できます",
    headline: "まずは「聞いて答えが返る」体験から始められます。",
    lead: "探索負担が大きい領域から試せます。",
    diagram: {
      src: "/images/lp/manufacturing/ask-to-decide-flow.svg",
      alt: "聞いて根拠が返ると、判断が先に進む",
    },
    closing: "効いた範囲だけを本番に広げられます。",
    items: [
      {
        no: "01",
        name: "製造の判断（ハブ）",
        body: "製造ハブで、現場判断・手順・変更影響をまとめて触れます。",
        demoUrl: hubUrl,
      },
      {
        no: "02",
        name: "社内ナレッジAI",
        body: "規程・マニュアルへの質問を、業務画面寄りに確認できます。",
        demoUrl: knowledgeUrl,
      },
      {
        no: "03",
        name: "相談・設計",
        body: "対象文書・権限・載せ方を、AXEONがヒアリングして設計します。",
        demoUrl: undefined,
      },
    ],
  },
  resultTabs: {
    sectionLabel: "実際の利用イメージ",
    headline: "質問 → 回答 → 根拠。止まらない判断。",
    note: "※掲載画面はイメージです。",
    tabs: [
      {
        id: "field",
        label: "質問",
        caption: "現場や部門が、自然な言葉で聞きます。",
        image: {
          src: "/images/lp/knowledge_light.png",
          alt: "質問入力のイメージ",
          note: "※画像はイメージです",
        },
      },
      {
        id: "office",
        label: "回答",
        caption: "要点が整理され、次の行動に使えます。",
        image: {
          src: "/images/lp/manufacturing_light.png",
          alt: "回答表示のイメージ",
          note: "※画像はイメージです",
        },
      },
      {
        id: "deliverable",
        label: "根拠",
        caption: "参照した規程・手順の箇所を添えます。",
        image: {
          src: "/images/lp/document_workflow_light.png",
          alt: "根拠文書のイメージ",
          note: "※画像はイメージです",
        },
      },
    ],
  },
  comparison: {
    label: "既存の文書管理を捨てる必要はありません",
    headline: "探す負担が大きい領域から入れます。",
    lead: "全文検索やフォルダ構成を否定せず、質問からの到着を早めます。",
    columns: {
      common: "一般的なやり方",
      ours: "この仕組み",
    },
    rows: [
      {
        point: "たどり着き方",
        common: "フォルダ階層をたどる",
        ours: "質問から候補と根拠へ",
      },
      {
        point: "根拠",
        common: "口頭で済ませがち",
        ours: "出典をセットで返す",
      },
      {
        point: "導入",
        common: "全社文書を一度に投入",
        ours: "対象コーパスから小さく",
      },
      {
        point: "確定",
        common: "回答をそのまま最終決定",
        ours: "人が確認してから使う",
      },
    ],
    fairnessNote:
      "回答の法的・品質上の正しさを保証するものではありません。対象範囲と権限設計が前提です。",
  },
  growth: {
    label: "使いながら、対象文書と語彙を育てます",
    headline: "版更新と現場の言い方に合わせて調整します。",
    lead: "一度入れたら終わりではなく、文書の更新と利用ログから改善します。",
    cycles: [
      {
        no: "1",
        title: "よく聞かれる質問を見る",
        body: "繰り返しの問い合わせを把握し、文書側の穴も見やすくします。",
      },
      {
        no: "2",
        title: "用語を揃える",
        body: "現場の言い方と規程の語を橋渡しします。",
      },
      {
        no: "3",
        title: "対象を広げる",
        body: "効いた領域から、他部門・他ラインへ広げます。",
      },
    ],
    closing: "運用しながら、御社の文書と権限に合わせて育てます。",
  },
  roiSummary: {
    label: "削減できる時間を試算",
    headline: "探索・確認の時間から、効果の目安を確認できます。",
    lead: "人数と1日あたりの探索時間により規模は変わります。初期値の試算では次の規模感になります。",
    figureValue: "年間 1,960万円",
    basis:
      "計算根拠（初期値）: 1人35分/日 × 時給3,500円 × 240営業日 × 40人",
    disclaimer:
      "※初期値にもとづく試算であり、効果を保証するものではありません。実態に合わせた試算はお問い合わせください。",
  },
  process: {
    label: "導入方法",
    headline: "まず触って、対象文書を決めてから進めます。",
    lead: "全社一括を先に決めなくて構いません。",
    steps: [
      {
        no: "01",
        title: "デモで体験する",
        costLabel: "費用：無償",
        body: "製造ハブや社内ナレッジで、回答と根拠がセットで返る感覚を確かめます。",
      },
      {
        no: "02",
        title: "対象コーパスを決める",
        costLabel: "ここまで費用ゼロに近い",
        body: "どの規程・手順から載せるか、権限とあわせて決めます。",
      },
      {
        no: "03",
        title: "小さく本番に載せる",
        costLabel: "本導入・運用",
        body: "環境に合わせて構築し、利用を見ながら広げます。",
      },
    ],
    exitNote: "体験だけで終えても問題ありません。",
  },
  faq: [
    {
      q: "文書が古いままでも始められますか？",
      a: "始められます。ただし正しい版の整備とセットで進めるのが安全です。デモでは「探索の型」を先に確認できます。",
      defaultOpen: true,
    },
    {
      q: "料金はいくらですか？",
      a: "対象範囲・文書量・権限連携により異なります。初期確認は無償で進め、本導入時に見積もります。",
    },
    {
      q: "問い合わせが増えたら費用はどうなりますか？",
      a: "利用量や基盤によって変わります。想定利用を伺ったうえで設計します。",
    },
    {
      q: "オンプレや閉域でもできますか？",
      a: "要件を伺い、配置方式を含めて検討します。",
    },
    {
      q: "回答は必ず正しいですか？",
      a: "保証しません。根拠を提示し、人が確認する運用を前提にします。",
    },
    {
      q: "機密文書を横断検索できますか？",
      a: "権限設計なしでの横断は想定しません。アクセス制御を設計してから載せます。",
    },
    {
      q: "既存の文書管理システムは残しますか？",
      a: "残したまま、検索・回答の層を足す形も取れます。",
    },
    {
      q: "全文書をOCRし直す必要がありますか？",
      a: "対象を絞れば、最初から全件は不要です。",
    },
    {
      q: "1ライン・1部門だけからできますか？",
      a: "できます。小さく始め、効いたら広げます。",
    },
    {
      q: "まずデモだけ試したいです。",
      a: "問題ありません。外部デモから始められます。",
    },
  ],
  finalCta: {
    headline: "まずは、聞いて根拠が返る感覚を試せます。",
    body: "製造の判断デモや社内ナレッジの体験から、探したい文書の種類を一緒に整理できます。",
    assurances: [
      "無理な営業は行いません",
      "NDAを締結できます",
      "権限と対象文書から設計します",
    ],
    contactLabel: "製造・ナレッジについて相談する",
    contactHref: "/contact",
    tryCta: {
      label: "デモを試す ↗",
      href: hubUrl,
      external: true,
      variant: "secondary",
    },
  },
};
