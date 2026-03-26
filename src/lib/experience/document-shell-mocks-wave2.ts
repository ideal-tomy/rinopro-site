import type {
  DocumentShellPresetDefinition,
  DocumentShellUserInput,
} from "@/lib/experience/document-shell-preset-types";
import type { DocumentShellMockResult } from "@/lib/experience/document-plan-shell-types";
import { extractNumericHints, splitLines } from "@/lib/experience/document-shell-signals";

export const orderFormPreset: DocumentShellPresetDefinition = {
  choiceSteps: [
    {
      id: "tax",
      title: "価格表示は？",
      options: [
        { id: "ex", label: "税抜" },
        { id: "in", label: "税込" },
      ],
    },
    {
      id: "ship",
      title: "納品形態に近いものは？",
      options: [
        { id: "single", label: "一括納品" },
        { id: "split", label: "分割納品" },
      ],
    },
  ],
  samples: [
    "商品A 数量120 単価450 納期4/30\n商品B 数量30 単価1200 納期5/15",
    "ライセンス年間 50席 納品は契約締結後即日",
    "試作部品 1式 図面番号XX-001",
  ],
  build: (input: DocumentShellUserInput): DocumentShellMockResult => {
    const lines = splitLines(input.rawText);
    const tax = input.selections.tax === "in" ? "税込" : "税抜";
    const ship = input.selections.ship === "split" ? "分割納品" : "一括納品";
    const rows =
      lines.length >= 2
        ? lines.slice(0, 4).map((l, i) => [`ITEM-${i + 1}`, l.slice(0, 40), "1", "—", "—"])
        : [
            ["ITEM-1", "サンプル商品（デモ）", "10", "1,000", "10,000"],
            ["ITEM-2", "付属サービス（デモ）", "1", "5,000", "5,000"],
          ];

    return {
      documentTitle: "受注書ドラフト（体験用）",
      blocks: [
        { type: "paragraph", text: `価格: ${tax}／納品: ${ship}（選択・デモ）` },
        {
          type: "table",
          caption: "明細（メモから抽出またはサンプル）",
          headers: ["コード", "品目・摘要", "数量", "単価", "金額"],
          rows,
        },
        {
          type: "paragraph",
          text: "取引条件（定型・デモ）: 支払月末締め翌月末払い。検収後に請求。瑕疵は30日以内に通知。",
        },
        {
          type: "bullets",
          items: [
            "納期遅延時は書面での連絡を原則とする（デモ文面）",
            "図面・仕様変更は別途見積（デモ文面）",
          ],
        },
      ],
    };
  },
  leftPanelTitle: "受注内容メモ",
  rightPanelTitle: "受注書（体裁イメージ）",
};

export const quoteDraftPreset: DocumentShellPresetDefinition = {
  choiceSteps: [
    {
      id: "valid",
      title: "見積有効期限のイメージは？",
      options: [
        { id: "30", label: "30日" },
        { id: "60", label: "60日" },
      ],
    },
    {
      id: "terms",
      title: "支払条件に近いものは？",
      options: [
        { id: "end", label: "月末締め翌月末" },
        { id: "split50", label: "着手50%・検収50%" },
      ],
    },
  ],
  samples: [
    "品目X 単価8万 数量5 納期6週間\n現場立会い3回まで込み",
    "保守 月額12万 最低契約12か月\n障害対応は平日9-18",
    "カスタマイズ工数 人日40 単価14万",
  ],
  build: (input: DocumentShellUserInput): DocumentShellMockResult => {
    const nums = extractNumericHints(input.rawText);
    const valid = input.selections.valid === "60" ? "60日" : "30日";
    const pay =
      input.selections.terms === "split50"
        ? "着手時50%・検収時50%"
        : "月末締め翌月末払い";

    return {
      documentTitle: "見積書ドラフト（体験用）",
      blocks: [
        {
          type: "paragraph",
          text: `有効期限: ${valid}／支払: ${pay}（選択・デモ）${nums.length ? `／検出: ${nums.join(", ")}` : ""}`,
        },
        {
          type: "table",
          headers: ["摘要", "数量", "単価", "金額"],
          rows: [
            ["一式（メモ要約）", "1", "要確認", "要確認"],
            ["値引・調整", "—", "—", "別紙"],
          ],
        },
        {
          type: "bullets",
          items: [
            "本見積は概算であり詳細設計後に再見積する場合がある（デモ）",
            "消費税は別途（または内訳に準ずる）（デモ）",
          ],
        },
      ],
    };
  },
  leftPanelTitle: "見積メモ・条件",
  rightPanelTitle: "見積書（体裁イメージ）",
};

export const webinarInvitePreset: DocumentShellPresetDefinition = {
  choiceSteps: [
    {
      id: "aud",
      title: "主な対象は？",
      options: [
        { id: "cust", label: "既存顧客" },
        { id: "lead", label: "見込み客" },
        { id: "in", label: "社内向け" },
      ],
    },
    {
      id: "cta",
      title: "主なCTAは？",
      options: [
        { id: "reg", label: "申し込み" },
        { id: "doc", label: "資料DL" },
        { id: "demo", label: "個別デモ" },
      ],
    },
  ],
  samples: [
    "3/15 15:00 新機能ウェビナー 60分\n登録URLは別途\nQA10分",
    "セキュリティアップデート説明 既存契約者向け",
    "採用ブランディング 学生向け オンラインのみ",
  ],
  build: (input: DocumentShellUserInput): DocumentShellMockResult => {
    const raw = input.rawText;
    const aud =
      input.selections.aud === "lead"
        ? "見込みのお客様"
        : input.selections.aud === "in"
          ? "社内関係者"
          : "既存のお客様";
    const cta =
      input.selections.cta === "doc"
        ? "資料をダウンロード"
        : input.selections.cta === "demo"
          ? "個別デモを予約"
          : "お申し込み";

    return {
      documentTitle: "ウェビナー案内メール（体裁イメージ・体験用）",
      blocks: [
        { type: "heading", text: "件名案" },
        {
          type: "paragraph",
          text: `【ご案内】${raw.slice(0, 40)}${raw.length > 40 ? "…" : ""}（デモ）`,
        },
        { type: "heading", text: "本文案" },
        {
          type: "paragraph",
          text: `${aud}各位\n\nいつもお世話になっております。\n下記のとおりオンラインセッションを開催いたします（デモ文面）。\n\n日時・内容はメモをご確認ください。\nご参加をお待ちしております。`,
        },
        {
          type: "bullets",
          items: [
            `想定対象: ${aud}（選択）`,
            `お願いしたいアクション: ${cta}（選択）`,
            "リマインドは前日・当日の2通を推奨（一般論・デモ）",
          ],
        },
      ],
    };
  },
  leftPanelTitle: "日時・テーマメモ",
  rightPanelTitle: "メール草案（体裁イメージ）",
};

export const nonprofitThanksPreset: DocumentShellPresetDefinition = {
  choiceSteps: [
    {
      id: "amountBand",
      title: "寄付の規模感（デモ）",
      options: [
        { id: "s", label: "小額・継続" },
        { id: "m", label: "中額" },
        { id: "l", label: "大額・法人" },
      ],
    },
    {
      id: "tone",
      title: "トーンは？",
      options: [
        { id: "warm", label: "温かめ" },
        { id: "formal", label: "格式ばった" },
      ],
    },
  ],
  samples: [
    "プロジェクト緑の風 植林活動 ご寄付ありがとう\n使途は苗木と現地スタッフに",
    "災害支援 緊急募金 匿名希望の方多数",
    "奨学金 第3期 卒業生からの寄付",
  ],
  build: (input: DocumentShellUserInput): DocumentShellMockResult => {
    const project = input.rawText.split(/\n/)[0]?.trim() || "ご支援のプロジェクト（デモ）";
    const formal = input.selections.tone === "formal";
    const band = input.selections.amountBand ?? "m";
    const open = formal
      ? "拝啓 時下ますますご清栄のこととお慶び申し上げます。"
      : "いつも温かいご支援をありがとうございます。";

    return {
      documentTitle: "寄付感謝レター草案（体験用）",
      blocks: [
        {
          type: "paragraph",
          text: open,
        },
        {
          type: "paragraph",
          text: formal
            ? `このたびは「${project}」にご寄付を賜り、厚く御礼申し上げます。おかげさまで活動を継続してまいります。`
            : `「${project}」へのご寄付、本当にありがとうございました。みなさまのおかげで、現場で具体的な成果につなげています。`,
        },
        {
          type: "paragraph",
          text:
            band === "l"
              ? "ご寄付の使途について、年次レポートにてご報告いたします（デモ）。"
              : "領収・税務上の記載が必要な場合は事務局より別途ご連絡します（デモ）。",
        },
        {
          type: "bullets",
          items: [
            "事務局連絡先・振込明細の同封有無（デモチェック）",
            "公開感谢（匿名希望の確認）（デモチェック）",
          ],
        },
      ],
    };
  },
  leftPanelTitle: "プロジェクト・寄付メモ",
  rightPanelTitle: "感謝レター（体裁イメージ）",
};
