import type { FlowTrackKey } from "@/lib/content/site-copy";

export type EnablementDevelopmentFlipCardBullet = {
  term: string;
  detail: string;
};

export type EnablementDevelopmentFlipCard = {
  step: string;
  labelJa: string;
  frontSubtitle: string;
  backTitle: string;
  backLead: string;
  bullets: readonly EnablementDevelopmentFlipCardBullet[];
  summaryLabel: string;
  summaryText: string;
  mediaTrack: FlowTrackKey;
};

export const enablementDevelopmentFlipCards: readonly EnablementDevelopmentFlipCard[] =
  [
    {
      step: "01",
      labelJa: "現状整理",
      frontSubtitle: "仕事の流れと、困っている箇所を確認",
      backTitle: "どの業務から見直すかを決める",
      backLead:
        "担当者へのヒアリングと実際のデータから、仕事の流れと負担を確認します。",
      bullets: [
        {
          term: "業務の流れ",
          detail: "誰が、何を、どの順番で行っているか",
        },
        {
          term: "負担のある箇所",
          detail: "時間がかかる作業や、重複する入力",
        },
        {
          term: "改善の優先順位",
          detail: "先に見直す業務と、変更する範囲",
        },
      ],
      summaryLabel: "整理するもの",
      summaryText: "業務の流れと、改善する箇所",
      mediaTrack: "dashboard",
    },
    {
      step: "02",
      labelJa: "要件化",
      frontSubtitle: "作る機能と、使い方を具体的にする",
      backTitle: "必要な機能と、完成の条件を決める",
      backLead:
        "使う人や業務に合わせて、システムに必要な内容を関係者で確認します。",
      bullets: [
        {
          term: "入力と出力",
          detail: "何を入力し、どんな結果を表示するか",
        },
        {
          term: "連携と権限",
          detail: "つなぐシステムと、誰が何を使えるか",
        },
        {
          term: "完成の判断",
          detail: "どの状態になれば、業務で使えるか",
        },
      ],
      summaryLabel: "整理するもの",
      summaryText: "開発する範囲と、確認する条件",
      mediaTrack: "dashboard",
    },
    {
      step: "03",
      labelJa: "試作・現場検証",
      frontSubtitle: "触って確かめ、現場で使えるか見る",
      backTitle: "操作感と抜け漏れを確認する",
      backLead:
        "完成を待たずに触れる試作を先に出し、現場で速さ・分かりやすさを確認します。",
      bullets: [
        {
          term: "操作の確認",
          detail: "実際の画面で、迷わず進めるか",
        },
        {
          term: "業務での検証",
          detail: "想定した流れで、データや連携が動くか",
        },
        {
          term: "修正のタイミング",
          detail: "本実装前に直す箇所と範囲",
        },
      ],
      summaryLabel: "整理するもの",
      summaryText: "試作で確認した内容と、直す箇所",
      mediaTrack: "dashboard",
    },
    {
      step: "04",
      labelJa: "本実装",
      frontSubtitle: "本番品質に仕上げ、運用まで引き渡す",
      backTitle: "業務で使える状態まで整えて渡す",
      backLead:
        "試作で固めた範囲を本番品質にし、権限・運用・改善の手順までセットで引き渡します。",
      bullets: [
        {
          term: "本番の品質",
          detail: "速度・安定性・セキュリティの要件",
        },
        {
          term: "運用の準備",
          detail: "権限・バックアップ・監視の整備",
        },
        {
          term: "引き渡し",
          detail: "操作と変更の手順を共有し、改善できる状態に",
        },
      ],
      summaryLabel: "整理するもの",
      summaryText: "引き渡す範囲と、運用の起点",
      mediaTrack: "dashboard",
    },
  ];
