import type { ComponentType } from "react";
import {
  PreSupportDiagramEnvironment,
  PreSupportDiagramKnowledge,
  PreSupportDiagramScope,
  PreSupportDiagramTime,
  PreSupportDiagramVendorSplit,
} from "./EnablementPreSupportDiagrams";

export type PreSupportCard = {
  title: string;
  body: string;
  Diagram: ComponentType;
};

export const preSupportCards: PreSupportCard[] = [
  {
    title: "社内の担当範囲",
    body: "社内と外部の担当を確認します。",
    Diagram: PreSupportDiagramScope,
  },
  {
    title: "担当者と時間",
    body: "担当する人と使える時間を確認します。",
    Diagram: PreSupportDiagramTime,
  },
  {
    title: "知識と手順",
    body: "操作方法と対応手順を共有します。",
    Diagram: PreSupportDiagramKnowledge,
  },
  {
    title: "開発・運用の環境",
    body: "今あるシステムと必要な環境を確認します。",
    Diagram: PreSupportDiagramEnvironment,
  },
  {
    title: "開発会社との分担",
    body: "依頼する範囲と社内の判断を整理します。",
    Diagram: PreSupportDiagramVendorSplit,
  },
];
