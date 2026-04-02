import { z } from "zod";
import { estimateDetailedAiOutputSchema } from "@/lib/estimate/estimate-snapshot";

export const ESTIMATE_DETAILED_FLOW_KEY = "rinopro_estimate_detailed_flow_v1";

/** 質問フォームの下書き（セッションに保持し「質問に戻る」で復元する） */
export const estimateFormDraftSchema = z.object({
  industry: z.string(),
  /** コンシェルジュ handoff 等で確定した「業種」表示行（設定時は answers の業種に優先） */
  industryDisplayLine: z.string().optional(),
  summary: z.string(),
  pain: z.string(),
  teamSize: z.string(),
  timeline: z.string(),
  integration: z.string(),
  /** データ・システムの到達範囲のイメージ（インターネット／社内のみ等） */
  hostingContext: z.string().default("unknown"),
  /** 載せる場所・利用チャネル（レンジ絞り込み用） */
  usageSurface: z.string().default("unknown"),
  dataSensitivity: z.string().default("unknown"),
  audienceScope: z.string().default("unknown"),
  currentWorkflow: z.string().default("unknown"),
  updateFrequency: z.string().default("unknown"),
  designExpectation: z.string().default("unknown"),
  loginModel: z.string().default("unknown"),
  budgetBand: z.string(),
  budgetFeel: z.string(),
  constraints: z.string(),
});

export type EstimateFormDraft = z.infer<typeof estimateFormDraftSchema>;

const estimateDetailedFlowSchema = z.object({
  v: z.literal(1),
  /** 質問ページに戻るとき ?ctx= にそのまま使う値（null は概算から来ていない） */
  ctxQuery: z.string().nullable(),
  priorContext: z.string(),
  answers: z.record(z.string(), z.string()),
  ai: estimateDetailedAiOutputSchema.nullable(),
  formDraft: estimateFormDraftSchema.optional(),
});

export type EstimateDetailedFlowState = z.infer<typeof estimateDetailedFlowSchema>;

export function parseEstimateDetailedFlow(raw: string | null): EstimateDetailedFlowState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as unknown;
    const r = estimateDetailedFlowSchema.safeParse(parsed);
    return r.success ? r.data : null;
  } catch {
    return null;
  }
}

export function readEstimateDetailedFlow(): EstimateDetailedFlowState | null {
  if (typeof window === "undefined") return null;
  return parseEstimateDetailedFlow(sessionStorage.getItem(ESTIMATE_DETAILED_FLOW_KEY));
}

export function writeEstimateDetailedFlow(state: EstimateDetailedFlowState): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(ESTIMATE_DETAILED_FLOW_KEY, JSON.stringify(state));
  } catch {
    // quota
  }
}

export function clearEstimateDetailedFlow(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(ESTIMATE_DETAILED_FLOW_KEY);
}

/** 処理失敗など、セッションを捨ててフォームを初期化するときの URL */
export function buildEstimateDetailedEditHref(ctxQuery: string | null): string {
  const p = new URLSearchParams();
  p.set("reset", "1");
  if (ctxQuery) p.set("ctx", ctxQuery);
  return `/estimate-detailed?${p.toString()}`;
}

/** 入力を保持したまま質問ページへ（ai のみクリアは呼び出し側で writeEstimateDetailedFlow） */
export function buildEstimateDetailedResumeHref(ctxQuery: string | null): string {
  if (ctxQuery) {
    const p = new URLSearchParams();
    p.set("ctx", ctxQuery);
    return `/estimate-detailed?${p.toString()}`;
  }
  return "/estimate-detailed";
}
