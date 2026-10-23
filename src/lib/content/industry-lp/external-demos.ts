import { CONSTRUCTION_DEMO_URLS } from "../external-demos";

/** AXEONの業界LPから開く外部デモ */
export const INDUSTRY_EXTERNAL_DEMOS = {
  construction: CONSTRUCTION_DEMO_URLS.hub,
  ocrConstruction: CONSTRUCTION_DEMO_URLS.report,
  constructionOps: "https://kanri-kensetsu.vercel.app/login",
  manufacturing: "https://product-flow-jet.vercel.app/manufacturing",
  internalKnowledge: "https://internal-knowledge-demo.vercel.app/?brand=axeon",
} as const;
