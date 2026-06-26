export type ConsultingStepMediaConfig = {
  src: string;
  alt: string;
  objectPosition?: string;
};

const CONSULTING_BASE = "/images/services/consulting";

/** コンサル③進め方ブロック用（3ステップ） */
export const CONSULTING_STEP_MEDIA_BY_KEY: Record<
  string,
  ConsultingStepMediaConfig
> = {
  diagnosis: {
    src: `${CONSULTING_BASE}/diagnosis.png`,
    alt: "業務診断・現場ヒアリングとボトルネック発見のイメージ",
  },
  priority: {
    src: `${CONSULTING_BASE}/priority.png`,
    alt: "効果と実現性のマトリクスで優先順位を設計するイメージ",
  },
  poc: {
    src: `${CONSULTING_BASE}/poc.png`,
    alt: "PoC試作と現場定着を支援するイメージ",
  },
};
