import type { IndustryDataset } from "../types";
import { guidedOtherChoice, withOther } from "./shared";

export const constructionDataset: IndustryDataset = {
  id: "construction",
  label: "建設・設備",
  icon: "🏗",
  toneInstruction:
    "現場監督・作業員がその場で理解できるよう、専門用語には短い補足を添える。断定はナレッジの範囲のみ。",
  policies: ["pricing_kb_only", "cite_required"],
  policyDescription: "料金・条件はナレッジ記載の範囲のみ／回答には出典を明示",
  systemPreamble:
    "参照ナレッジは、貴社の「安全衛生管理規程」「入場管理要領」「悪天候作業基準」「協力会社取引規程」の抜粋である。実際の現場では最新版規程を確認すること。",
  escalationContact: "現場所長または安全衛生管理者",
  kb: [
    {
      id: "c-kb-1",
      title: "安全衛生管理規程",
      section: "第12条 保護具の着用義務",
      body: `作業員は作業区域に立ち入る際、保護帽（ヘルメット）、安全靴、反射ベストを常時着用する。高さ2m以上の開口部・端部等で墜落危険がある作業では、労働安全衛生規則に基づき、墜落制止用器具（フルハーネス型等）を使用する。保護具は作業開始前に点検し、損傷・変形があれば使用禁止とし、即時交換する。`,
    },
    {
      id: "c-kb-2",
      title: "安全衛生管理規程",
      section: "第15条 ヒヤリハット報告",
      body: `ヒヤリハット（危険の予感・ニアミス）は、事象・場所・時刻・再発防止案を様式Aで提出する。個人名の記載は任意。提出後48時間以内に安全担当が一次返信し、必要に応じて現場巡回で是正を確認する。重大度が高いものは所長へ即日エスカレーションする。`,
    },
    {
      id: "c-kb-3",
      title: "入場管理要領",
      section: "第4章 搬入車両",
      body: `材料・機材の搬入は、搬入30分前までに現場事務所へ連絡し、入場証と車両台帳（車番・ドライバー名）を提出する。ゲート通過後は誘導員の指示に従い、指定ルートのみ通行する。危険物を積載する場合は別紙様式で事前申請し、保安担当の立会いを受ける。`,
    },
    {
      id: "c-kb-4",
      title: "悪天候時作業基準",
      section: "屋外作業の中止判断",
      body: `気象庁等の予報で時間降水量20mm/h超の見込み、または現場責任者が視認で危険と判断した場合、屋外の高所作業・足場上作業を中止する。再開は所長（または代理人）が現地確認のうえ承認し、朝礼で全員に周知する。記録は安全管理日誌に残す。`,
    },
    {
      id: "c-kb-5",
      title: "協力会社取引規程",
      section: "別表 標準作業単価（抜粋）",
      body: `掘削（軟質土）〇〇円/m³、足場組立〇〇円/m²、コンクリート打設監督〇〇円/m³（年度版は購買システムを正とする）。現場条件・狭小地・夜間等の割増は営業工事部が個別見積で定める。本表にない作業は見積依頼書を提出すること。`,
    },
    {
      id: "c-kb-6",
      title: "安全衛生管理規程",
      section: "第8条 朝礼・KY活動",
      body: `全作業は朝礼後に開始する。危険作業については指差呼称またはKY（危険予知）活動の記録を残す。多職種が重なる作業では、元請が主導で調整会議を開き、安全管理計画と整合させる。`,
    },
    {
      id: "c-kb-7",
      title: "火気・危険物作業",
      section: "動火作業許可",
      body: `溶接・切断等の動火作業は、動火許可票の発行を受け、消火器・監視者を配置してから実施する。可燃物は移動または不燃シートで遮蔽する。終了後30分は火の監視を継続する。`,
    },
    {
      id: "c-kb-8",
      title: "労働安全衛生法関係",
      section: "元請の安全配慮義務（要約）",
      body: `元請事業者は、協力会社を含む全作業員の安全衛生を確保するため、関連法令に基づき必要な措置を講じる。具体的には作業環境の整備、保護具の着用徹底、教育・指導、事故発生時の報告体制の確保が含まれる。詳細は総括安全衛生責任者が統括する。`,
    },
  ],
  guidedRootId: "n0",
  guidedNodes: {
    n0: {
      id: "n0",
      breadcrumb: "トップ",
      prompt: "どの分野について知りたいですか？",
      choices: withOther([
        { label: "安全衛生・保護具", nextNodeId: "n1" },
        { label: "搬入・入場・車両", nextNodeId: "n2" },
        { label: "悪天候・工程", nextNodeId: "n3" },
        { label: "協力会社・単価", nextNodeId: "n4" },
      ]),
    },
    n1: {
      id: "n1",
      breadcrumb: "安全衛生",
      prompt: "内容を選んでください",
      choices: withOther([
        { label: "ヘルメット・安全靴・墜落防止", kbRefIds: ["c-kb-1"] },
        { label: "朝礼・KY活動", kbRefIds: ["c-kb-6"] },
        { label: "ヒヤリハットの出し方", kbRefIds: ["c-kb-2"] },
        { label: "動火・溶接の手続き", kbRefIds: ["c-kb-7"] },
        { label: "元請の安全上の役割（概要）", kbRefIds: ["c-kb-8"] },
      ]),
    },
    n2: {
      id: "n2",
      breadcrumb: "入場",
      prompt: "該当する内容は？",
      choices: withOther([
        { label: "搬入車両の手続き", kbRefIds: ["c-kb-3"] },
      ]),
    },
    n3: {
      id: "n3",
      breadcrumb: "天候",
      prompt: "知りたいことは？",
      choices: withOther([
        { label: "雨天時に屋外作業を止める基準", kbRefIds: ["c-kb-4"] },
      ]),
    },
    n4: {
      id: "n4",
      breadcrumb: "協力会社",
      prompt: "どちらに近いですか？",
      choices: withOther([
        { label: "標準単価表に載っている作業の単価", kbRefIds: ["c-kb-5"] },
        { label: "表にない作業の見積・割増", kbRefIds: ["c-kb-5"] },
      ]),
    },
  },
};
