import type { FlowTrackKey } from "@/lib/content/site-copy";

export type FlowStepMediaConfig = {
  src: string;
  alt: string;
  objectPosition?: string;
};

const DEV_BASE = "/images/services/dev";

function devMedia(
  track: FlowTrackKey,
  step: string,
  alt: string
): FlowStepMediaConfig {
  return {
    src: `${DEV_BASE}/${track}-${step}.png`,
    alt,
  };
}

/** 開発フロー：トラック×ステップ別ビジュアル */
export const FLOW_STEP_MEDIA_BY_TRACK: Record<
  FlowTrackKey,
  Record<string, FlowStepMediaConfig>
> = {
  common: {
    "01": devMedia(
      "common",
      "01",
      "業務フローを俯瞰し、ボトルネックを特定するイメージ"
    ),
    "02": devMedia(
      "common",
      "02",
      "入力から出力への設計図・要件整理のイメージ"
    ),
    "03": devMedia(
      "common",
      "03",
      "触れる試作を現場で検証するイメージ"
    ),
    "04": devMedia(
      "common",
      "04",
      "本番システムの稼働と運用引き渡しのイメージ"
    ),
  },
  website: {
    "01": devMedia(
      "website",
      "01",
      "サイト導線とアクセス解析を俯瞰するイメージ"
    ),
    "02": devMedia(
      "website",
      "02",
      "サイトマップ・ワイヤー・CMS設計のイメージ"
    ),
    "03": devMedia(
      "website",
      "03",
      "ブラウザ試作と表示速度を検証するイメージ"
    ),
    "04": devMedia(
      "website",
      "04",
      "公開済みレスポンシブサイトと計測のイメージ"
    ),
  },
  app: {
    "01": devMedia(
      "app",
      "01",
      "利用シーン・端末・連携先を整理するイメージ"
    ),
    "02": devMedia("app", "02", "画面遷移・API・認証設計のイメージ"),
    "03": devMedia(
      "app",
      "03",
      "スマホ試作ビルドとエラー処理を検証するイメージ"
    ),
    "04": devMedia(
      "app",
      "04",
      "リリース済みアプリと監視のイメージ"
    ),
  },
  dashboard: {
    "01": devMedia(
      "dashboard",
      "01",
      "意思決定フローとKPI候補を洗い出すイメージ"
    ),
    "02": devMedia(
      "dashboard",
      "02",
      "KPI辞書・データマッピング・権限設計のイメージ"
    ),
    "03": devMedia(
      "dashboard",
      "03",
      "試作チャートを現場でレビューするイメージ"
    ),
    "04": devMedia(
      "dashboard",
      "04",
      "本番BIダッシュボードとライブデータのイメージ"
    ),
  },
};

export function getFlowStepMedia(
  track: FlowTrackKey,
  step: string
): FlowStepMediaConfig | undefined {
  return FLOW_STEP_MEDIA_BY_TRACK[track]?.[step];
}
