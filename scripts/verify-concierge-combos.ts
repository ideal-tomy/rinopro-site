/**
 * ホームコンシェルジュ固定結果の全主要組み合わせ検証
 * 実行: npm run verify:concierge
 */

import {
  A_STEP_BUILD,
  A_STEP_SCOPE,
  B_STEP_SCOPE,
  B_STEP_SUPPORT,
  CDE_PICK_STEP,
  C_STEP2,
  D_STEP2,
  E_STEP2,
  buildCdeSummaryBlock,
  buildEstimateBlockA,
  buildEstimateBlockB,
  validateConciergeResultBody,
  type FlowSelection,
} from "../src/lib/chat/concierge-flow";

const ROOT_TITLE = "知りたいこと";

function rootSel(optionId: string, label: string): FlowSelection {
  return { stepKey: "root", optionId, label, stepTitle: ROOT_TITLE };
}

function stepSel(
  stepKey: string,
  choice: { id: string; label: string },
  stepTitle: string,
  freeform?: string
): FlowSelection {
  return {
    stepKey,
    optionId: choice.id,
    label: choice.label,
    stepTitle,
    freeform,
  };
}

const TITLE_A = "開発コスト（質問）";
const TITLE_B = "コンサル費用（質問）";
const TITLE_C = "開発技術（質問）";
const TITLE_D = "ツール内容（質問）";
const TITLE_E = "依頼方法（質問）";
const TITLE_CDE = "知りたいこと（詳細）";

function assertLeadBlock(track: string, body: string): void {
  const t = body.trimStart();
  if (track === "A" || track === "B") {
    if (!t.startsWith("約")) {
      throw new Error(
        `[${track}] 先頭は概算金額であること: ${t.slice(0, 100)}`
      );
    }
  } else {
    if (!t.startsWith("**ご案内**")) {
      throw new Error(`[${track}] 先頭はご案内であること: ${t.slice(0, 100)}`);
    }
  }
}

function run(): void {
  const failures: string[] = [];

  for (const build of A_STEP_BUILD.choices) {
    for (const scope of A_STEP_SCOPE.choices) {
      const path: FlowSelection[] = [
        rootSel("root_a", "開発コストの概算を知りたい"),
        stepSel(
          "A3",
          build,
          TITLE_A,
          build.id.endsWith("_other") ? "サンプル自由記述（PoC想定）" : undefined
        ),
        stepSel(
          "A_SCOPE",
          scope,
          TITLE_A,
          scope.id.endsWith("_other") ? "Salesforce連携を想定" : undefined
        ),
      ];
      const body = buildEstimateBlockA(path);
      const id = `A:${build.id}/${scope.id}`;
      try {
        assertLeadBlock("A", body);
        const v = validateConciergeResultBody(body);
        if (!v.ok) failures.push(`${id} → ${v.issues.join(",")}`);
      } catch (e) {
        failures.push(`${id} → ${String(e)}`);
      }
    }
  }

  for (const sup of B_STEP_SUPPORT.choices) {
    for (const bs of B_STEP_SCOPE.choices) {
      const path: FlowSelection[] = [
        rootSel("root_b", "コンサル・伴走の概算を知りたい"),
        stepSel(
          "B2",
          sup,
          TITLE_B,
          sup.id.endsWith("_other") ? "四半期ごとの伴走を希望" : undefined
        ),
        stepSel(
          "B_SCOPE",
          bs,
          TITLE_B,
          bs.id.endsWith("_other") ? "ナレッジ散在が課題" : undefined
        ),
      ];
      const body = buildEstimateBlockB(path);
      const id = `B:${sup.id}/${bs.id}`;
      try {
        assertLeadBlock("B", body);
        const v = validateConciergeResultBody(body);
        if (!v.ok) failures.push(`${id} → ${v.issues.join(",")}`);
      } catch (e) {
        failures.push(`${id} → ${String(e)}`);
      }
    }
  }

  const cdeRootLabel = "技術・ツール・進め方を知りたい";
  for (const pick of CDE_PICK_STEP.choices) {
    const step =
      pick.id === "cde_pick_c"
        ? C_STEP2
        : pick.id === "cde_pick_d"
          ? D_STEP2
          : E_STEP2;
    const title =
      pick.id === "cde_pick_c"
        ? TITLE_C
        : pick.id === "cde_pick_d"
          ? TITLE_D
          : TITLE_E;
    const track =
      pick.id === "cde_pick_c"
        ? "C"
        : pick.id === "cde_pick_d"
          ? "D"
          : "E";

    for (const choice of step.choices) {
      const path: FlowSelection[] = [
        rootSel("root_cde", cdeRootLabel),
        stepSel("CDE_PICK", pick, TITLE_CDE),
        stepSel(
          step.stepKey,
          choice,
          title,
          choice.id.endsWith("_other") ? "検証用の自由記述テキスト" : undefined
        ),
      ];
      const body = buildCdeSummaryBlock(track, path);
      const id = `${track}:${pick.id}/${choice.id}`;
      try {
        assertLeadBlock(track, body);
        const v = validateConciergeResultBody(body);
        if (!v.ok) failures.push(`${id} → ${v.issues.join(",")}`);
      } catch (e) {
        failures.push(`${id} → ${String(e)}`);
      }
    }
  }

  for (const choice of E_STEP2.choices) {
    const path: FlowSelection[] = [
      rootSel("root_e", "まず相談・窓口の進め方を知りたい"),
      stepSel(
        "E2",
        choice,
        TITLE_E,
        choice.id.endsWith("_other") ? "検証用の自由記述テキスト" : undefined
      ),
    ];
    const body = buildCdeSummaryBlock("E", path);
    const id = `E:direct:${choice.id}`;
    try {
      assertLeadBlock("E", body);
      const v = validateConciergeResultBody(body);
      if (!v.ok) failures.push(`${id} → ${v.issues.join(",")}`);
    } catch (e) {
      failures.push(`${id} → ${String(e)}`);
    }
  }

  if (failures.length > 0) {
    console.error("コンシェルジュ組み合わせ検証: 失敗");
    for (const f of failures) console.error(f);
    process.exit(1);
  }
  console.log(
    "コンシェルジュ組み合わせ検証: OK（A/B 全組み合わせ + CDE経由 + root_e 直）"
  );
}

run();
