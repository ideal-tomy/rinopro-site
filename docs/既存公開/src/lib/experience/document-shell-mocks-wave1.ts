import type {
  DocumentShellPresetDefinition,
  DocumentShellUserInput,
} from "@/lib/experience/document-shell-preset-types";
import type { DocumentShellMockResult } from "@/lib/experience/document-plan-shell-types";
import {
  extractBulletLikeLines,
  splitLines,
} from "@/lib/experience/document-shell-signals";

export const bulletMessPreset: DocumentShellPresetDefinition = {
  choiceSteps: [
    {
      id: "meetingType",
      title: "会議の種類は？",
      options: [
        { id: "regular", label: "定例" },
        { id: "adhoc", label: "臨時" },
      ],
    },
    {
      id: "duration",
      title: "想定時間は？",
      options: [
        { id: "60", label: "60分" },
        { id: "90", label: "90分" },
      ],
    },
    {
      id: "focus",
      title: "主な焦点は？",
      options: [
        { id: "sales", label: "営業・売上" },
        { id: "dev", label: "開発・プロダクト" },
        { id: "mgmt", label: "経営・予算" },
      ],
    },
  ],
  samples: [
    "来週キックオフ、予算の話したい、Aさん遅れるかも\nデザインの件も触れたい",
    "採用 / オンボーディング / ツール費用\n次回までに各自メモまとめる",
    "障害の振り返りと再発防止、顧客への連絡文言",
  ],
  sampleLabels: [
    "キックオフ・予算の例",
    "採用・オンボーディングの例",
    "障害振り返りの例",
  ],
  build: (input: DocumentShellUserInput): DocumentShellMockResult => {
    const lines = extractBulletLikeLines(input.rawText);
    const fallback = splitLines(input.rawText);
    const topics = (lines.length ? lines : fallback).slice(0, 5);
    const typeLabel =
      input.selections.meetingType === "adhoc" ? "臨時会議" : "定例会議";
    const dur = input.selections.duration === "90" ? "90分" : "60分";
    const focus =
      input.selections.focus === "dev"
        ? "開発・プロダクト"
        : input.selections.focus === "mgmt"
          ? "経営・予算"
          : "営業・売上";

    const endTime = input.selections.duration === "90" ? "1:30" : "1:00";
    const rows: string[][] = [
      ["0:00–0:10", "オープニング・目的共有", "司会"],
      ["0:10–0:35", topics[0] ?? "論点1（メモから抽出）", "担当A"],
      ["0:35–0:55", topics[1] ?? "論点2（メモから抽出）", "担当B"],
      ["0:55–" + endTime, "まとめ・ネクストアクション", "司会"],
    ];

    return {
      documentTitle: "会議アジェンダ（整形案・体験用）",
      blocks: [
        {
          type: "paragraph",
          text: `種別: ${typeLabel}／想定時間: ${dur}／焦点: ${focus}（選択に基づくデモ）`,
        },
        { type: "heading", text: "1. 目的" },
        {
          type: "paragraph",
          text: `${focus}に関する意思決定と次アクションの合意を得る。`,
        },
        { type: "heading", text: "2. アジェンダ（案）" },
        {
          type: "table",
          headers: ["時間", "論点", "担当"],
          rows,
        },
        { type: "heading", text: "3. 未決・持ち越し" },
        {
          type: "bullets",
          items:
            topics.length > 2
              ? topics.slice(2).map((t) => `検討: ${t}`)
              : ["（メモが短い場合は次回までに論点を具体化）"],
        },
      ],
    };
  },
  leftPanelTitle: "飛び跳びメモ（そのまま貼ってOK）",
  centerButtonLabel: "アジェンダを生成",
  rightPanelTitle: "会議アジェンダ（体裁イメージ）",
};

export const execMeetingPreset: DocumentShellPresetDefinition = {
  choiceSteps: [
    {
      id: "quarter",
      title: "対象期間のイメージは？",
      options: [
        { id: "q1", label: "第1四半期" },
        { id: "q2", label: "第2四半期" },
        { id: "h2", label: "下期まとめ" },
      ],
    },
    {
      id: "risk",
      title: "リスクの感触は？",
      options: [
        { id: "low", label: "低め・順調" },
        { id: "mid", label: "やや注意" },
        { id: "high", label: "要フォロー多い" },
      ],
    },
  ],
  samples: [
    "売上108% 粗利は圧迫\n新規パイプラインは前年比+15%\n採用2名内定",
    "投資案件3件承認\n工場停止リスクは先方と週次でフォロー\n法務レビュー遅延",
    "来期方針: 海外10%目標\n為替ヘッジ方針は次回深掘り",
  ],
  build: (input: DocumentShellUserInput): DocumentShellMockResult => {
    const lines = splitLines(input.rawText);
    const decisions = lines.filter((l) => /承認|決定|合意|OK/i.test(l)).slice(0, 4);
    const todos = lines.filter((l) => /次|までに|期限|フォロー/i.test(l)).slice(0, 4);
    const risk = input.selections.risk ?? "mid";
    const riskLine =
      risk === "high"
        ? "優先監視: キャッシュ・契約・コンプラの3点（デモ）"
        : risk === "low"
          ? "優先監視: 計画どおりの進捗確認に留める（デモ）"
          : "優先監視: 主要KPIと例外要因の週次確認（デモ）";

    return {
      documentTitle: "経営会議サマリ・宿題（体験用）",
      blocks: [
        {
          type: "paragraph",
          text: `対象: ${input.selections.quarter === "q2" ? "第2四半期" : input.selections.quarter === "h2" ? "下期まとめ" : "第1四半期"}（選択・デモ）`,
        },
        {
          type: "kpis",
          items: [
            { label: "決定事項（抽出）", value: `${decisions.length || 2}件`, note: "メモからキーワード抽出" },
            { label: "宿題・フォロー（抽出）", value: `${todos.length || 2}件`, note: "次回までの追いかけ" },
            { label: "リスク感触", value: risk === "high" ? "高" : risk === "low" ? "低" : "中", note: "選択に基づく" },
          ],
        },
        { type: "heading", text: "決定事項" },
        {
          type: "bullets",
          items:
            decisions.length > 0
              ? decisions
              : ["（メモから明確な決定語が無い場合の一般例）方針承認", "予算枠の仮置き"],
        },
        { type: "heading", text: "宿題・担当（案）" },
        {
          type: "table",
          headers: ["内容", "担当", "期限"],
          rows:
            todos.length > 0
              ? todos.map((t, i) => [t, `担当${String.fromCharCode(65 + i)}`, "次回まで"])
              : [
                  ["数値の確定版を共有", "CFO室", "翌営業日"],
                  ["顧客向け説明のたたき台", "CS責任者", "3営業日以内"],
                ],
        },
        { type: "heading", text: "リスク・論点メモ" },
        { type: "paragraph", text: riskLine },
      ],
    };
  },
  leftPanelTitle: "会議メモ・箇条書き",
  centerButtonLabel: "サマリを生成",
  rightPanelTitle: "共有用サマリ（体裁イメージ）",
};

export const presentationOutlinePreset: DocumentShellPresetDefinition = {
  choiceSteps: [
    {
      id: "audience",
      title: "主な聴衆は？",
      options: [
        { id: "exec", label: "経営層" },
        { id: "field", label: "現場・実務" },
        { id: "customer", label: "顧客・パートナー" },
      ],
    },
    {
      id: "purpose",
      title: "目的に近いものは？",
      options: [
        { id: "proposal", label: "提案・説得" },
        { id: "report", label: "報告・共有" },
        { id: "edu", label: "教育・オンボーディング" },
      ],
    },
  ],
  samples: [
    "AI導入のPoC結果と次の投資判断\n競合比較は付録に回す",
    "四半期レビュー: 数字はダッシュボード参照\n議論は次の打ち手のみ",
    "新サービスの価格体系とロードマップ",
  ],
  sampleLabels: [
    "PoC・投資判断の例",
    "四半期レビューの例",
    "新サービス価格の例",
  ],
  build: (input: DocumentShellUserInput): DocumentShellMockResult => {
    const theme = input.rawText.split(/\n/)[0]?.trim() || "プレゼンテーマ（デモ）";
    const aud =
      input.selections.audience === "field"
        ? "現場"
        : input.selections.audience === "customer"
          ? "顧客・パートナー"
          : "経営層";
    const pur =
      input.selections.purpose === "report"
        ? "報告・共有"
        : input.selections.purpose === "edu"
          ? "教育"
          : "提案";

    return {
      documentTitle: "プレゼン骨子（体験用）",
      blocks: [
        {
          type: "paragraph",
          text: `テーマ要約: ${theme.slice(0, 120)}${theme.length > 120 ? "…" : ""}`,
        },
        {
          type: "paragraph",
          text: `聴衆: ${aud}／目的: ${pur}（選択に基づくトーンのデモ）`,
        },
        { type: "heading", text: "章立て（案）" },
        {
          type: "bullets",
          items: [
            "オープニング: 論点と期待アウトカム",
            "現状と課題（データ1枚）",
            pur === "提案" ? "提案内容・効果試算" : "経緯・結果サマリ",
            "リスクと対応方針",
            "ネクストステップ・質疑",
          ],
        },
        {
          type: "table",
          caption: "スライド設計メモ（デモ）",
          headers: ["#", "スライド見出し", "キーメッセージ", "想定質問"],
          rows: [
            ["1", "今日お伝えすること", aud + "向けに1行で要約", "結論は何か"],
            ["2", "背景", "なぜ今このテーマか", "他の選択肢は"],
            ["3", "本論", pur + "の中心メッセージ", "根拠データは"],
            ["4", "まとめ", "決めてほしいこと", "次の日程"],
          ],
        },
        {
          type: "paragraph",
          text: "締め: 次アクションとオーナーを1行で明示すると承認が早まりやすい（一般論・デモ）。",
        },
      ],
    };
  },
  leftPanelTitle: "話したいテーマ・メモ",
  centerButtonLabel: "骨子を生成",
  rightPanelTitle: "プレゼン骨子（体裁イメージ）",
};

export const rfpRequirementsPreset: DocumentShellPresetDefinition = {
  choiceSteps: [
    {
      id: "vertical",
      title: "業界イメージに近いものは？",
      options: [
        { id: "fin", label: "金融" },
        { id: "mfg", label: "製造・サプライ" },
        { id: "svc", label: "サービス・SaaS" },
      ],
    },
    {
      id: "priority",
      title: "最優先の観点は？",
      options: [
        { id: "sec", label: "セキュリティ" },
        { id: "cost", label: "コスト" },
        { id: "delivery", label: "納期・SLA" },
      ],
    },
  ],
  samples: [
    "可用性99.9% / ログ保管7年\nSSO必須 オンプレ不可\nカスタム開発は別契約",
    "請求は月次アライアンス 為替は当社負担\nデータ所在地は国内",
    "既存ERP連携 在庫リアルタイム同期",
  ],
  build: (input: DocumentShellUserInput): DocumentShellMockResult => {
    const lines = splitLines(input.rawText);
    const pri =
      input.selections.priority === "cost"
        ? "コスト"
        : input.selections.priority === "delivery"
          ? "納期・SLA"
          : "セキュリティ";
    const vert =
      input.selections.vertical === "mfg"
        ? "製造"
        : input.selections.vertical === "svc"
          ? "SaaS"
          : "金融";

    const reqs = lines.length
      ? lines.slice(0, 6).map((l, i) => [`REQ-${String(i + 1).padStart(3, "0")}`, l, i % 2 === 0 ? "必須" : "推奨"])
      : [
          ["REQ-001", "認証・認可（SSO/MFA）", "必須"],
          ["REQ-002", "ログ・監査証跡", "必須"],
          ["REQ-003", "データ所在地（国内）", "必須"],
        ];

    return {
      documentTitle: "要件リスト・ギャップメモ（体験用）",
      blocks: [
        {
          type: "paragraph",
          text: `想定業界: ${vert}／最優先観点: ${pri}（選択に基づくデモ）`,
        },
        {
          type: "table",
          caption: "抽出要件（メモ行から）",
          headers: ["ID", "要件", "優先度"],
          rows: reqs,
        },
        {
          type: "heading",
          text: "ギャップ・確認したいこと",
        },
        {
          type: "bullets",
          items: [
            `${pri}に関する定量指標（数値・期限）がメモに明示されているか`,
            "既存システムとの境界（I/F仕様・責任分界）",
            "契約上のデータ削除・持ち出しポリシー",
          ],
        },
      ],
    };
  },
  leftPanelTitle: "RFP・要件の断片メモ",
  rightPanelTitle: "要件整理（体裁イメージ）",
};
