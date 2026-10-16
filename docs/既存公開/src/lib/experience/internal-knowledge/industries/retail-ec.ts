import type { IndustryDataset } from "../types";
import { withOther } from "./shared";

export const retailEcDataset: IndustryDataset = {
  id: "retail_ec",
  label: "小売・EC",
  icon: "🛒",
  toneInstruction:
    "お客様向け説明は丁寧に、社内向け判断は根拠条項を明示。キャンペーン条件を省略しない。",
  policies: ["cite_required", "pricing_kb_only"],
  policyDescription: "出典明示／SKUの現在価格はシステム照会",
  systemPreamble:
    "参照ナレッジは返品ポリシー・配送遅延対応・価格表示・特商法表記の社内ガイド抜粋である。",
  escalationContact: "店長またはCSリーダー",
  kb: [
    {
      id: "r-kb-1",
      title: "返品・交換ポリシー",
      section: "B2C一般",
      body: `未使用・未開封は受領日から14日以内に返送可（送料は規程による）。開封済は衛生品・セール品等を除き状況確認のうえ個別判断。不良品は送料当社負担で交換または返金を案内する。`,
    },
    {
      id: "r-kb-2",
      title: "配送トラブル対応",
      section: "遅延・紛失",
      body: `追跡番号でキャリア状況を確認する。キャリア起因の遅延は到着見込みを案内。当社起因は規程に基づき送料返金またはクーポンを提案できる。紛失は調査開始と暫定対応を24時間以内に連絡する。`,
    },
    {
      id: "r-kb-3",
      title: "価格・キャンペーン",
      section: "店舗とECの差",
      body: `同一SKUでもチャネル別キャンペーンにより価格が異なる場合がある。価格保証・マッチングは各キャンペーン条件に従う。`,
    },
    {
      id: "r-kb-4",
      title: "特定商取引法",
      section: "表示の要点",
      body: `販売業者・代表者・連絡先・代金支払時期・返品条件をサイトに掲示する。定期購入は解約条件を明示する。`,
    },
    {
      id: "r-kb-5",
      title: "クレームエスカレーション",
      section: "SNS・炎上初動",
      body: `公開投稿への返信はCS承認後にテンプレを使用する。事実関係の調査中は「確認中」の一次返信にとどめる。`,
    },
    {
      id: "r-kb-6",
      title: "在庫・予約販売",
      section: "欠品時",
      body: `欠品が判明した時点で顧客へ連絡し、代替・キャンセル・入荷予定を提示する。予約販売は決済タイミングを規程どおり説明する。`,
    },
    {
      id: "r-kb-7",
      title: "個人情報（EC）",
      section: "配送先変更",
      body: `本人確認のうえ配送先変更を受け付ける。第三者住所への変更は追加確認を行う。`,
    },
    {
      id: "r-kb-8",
      title: "POS・価格マスタ",
      section: "照会方法",
      body: `SKUの現在販売価格はPOSまたはEC管理画面を参照する。本ナレッジに個別価格は記載しない。`,
    },
  ],
  guidedRootId: "n0",
  guidedNodes: {
    n0: {
      id: "n0",
      breadcrumb: "トップ",
      prompt: "案件の種類は？",
      choices: withOther([
        { label: "返品・交換", nextNodeId: "n1" },
        { label: "配送", nextNodeId: "n2" },
        { label: "価格・表示", nextNodeId: "n3" },
        { label: "クレーム・コンプライアンス", nextNodeId: "n4" },
      ]),
    },
    n1: {
      id: "n1",
      breadcrumb: "返品",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "返品の基本条件", kbRefIds: ["r-kb-1"] },
      ]),
    },
    n2: {
      id: "n2",
      breadcrumb: "配送",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "遅延・紛失の対応", kbRefIds: ["r-kb-2"] },
        { label: "欠品・予約販売", kbRefIds: ["r-kb-6"] },
        { label: "配送先の変更", kbRefIds: ["r-kb-7"] },
      ]),
    },
    n3: {
      id: "n3",
      breadcrumb: "価格",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "店舗とECの価格差", kbRefIds: ["r-kb-3"] },
        { label: "SKUの現在価格の確認先", kbRefIds: ["r-kb-8"] },
        { label: "特商法の表示要点", kbRefIds: ["r-kb-4"] },
      ]),
    },
    n4: {
      id: "n4",
      breadcrumb: "CS",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "SNS・炎上の初動", kbRefIds: ["r-kb-5"] },
      ]),
    },
  },
};
