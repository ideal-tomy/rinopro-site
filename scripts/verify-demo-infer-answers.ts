/**
 * フリーテキスト→4軸推定のスモーク（LLMなし）。
 * npx tsx scripts/verify-demo-infer-answers.ts
 */
import {
  inferConciergeAnswersFromText,
  shouldAttemptDemoRecommendFromText,
} from "../src/lib/demo/infer-concierge-answers-from-text";
import { pickRecommendedDemos } from "../src/lib/demo/intelligent-concierge";
import { fetchDemosForDisplay } from "../src/lib/sanity/fetch";

const samples = [
  "業務効率化に役立つdemoを教えて",
  "書類作成を楽にできるツールはありますか",
  "はい",
];

async function main() {
  for (const s of samples) {
    const attempt = shouldAttemptDemoRecommendFromText(s);
    const answers = inferConciergeAnswersFromText(s);
    console.log(JSON.stringify({ text: s, attempt, answers }, null, 2));
  }

  const demos = await fetchDemosForDisplay();
  const picks = pickRecommendedDemos(
    demos,
    inferConciergeAnswersFromText(samples[0]!)
  );
  console.log(
    "picks count",
    picks.length,
    picks.map((p) => (typeof p.demo.slug === "object" ? p.demo.slug?.current : p.demo.slug))
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
