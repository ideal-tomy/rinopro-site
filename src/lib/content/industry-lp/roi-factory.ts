import type { IndustryLpCta } from "./types";

export type RoiSlider = {
  key: string;
  label: string;
  unit: string;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  note: string;
};

export type LaborRoiDefaults = {
  people: number;
  minutesPerDay: number;
  hourlyYen: number;
  workDays: number;
  recoverRate?: number;
  devLow?: number;
  devHigh?: number;
};

export type WorkflowSiteRoiDefaults = {
  sites: number;
  minutesPerSiteDay: number;
  hourlyYen: number;
  reworkRatePercent: number;
  workDays?: number;
  recoverRate?: number;
  reworkFactor?: number;
  devLow?: number;
  devHigh?: number;
  leadTimeLabel?: string;
  leadTimeValue?: string;
};

/** Server→Client に渡せる ROI 仕様（関数を含まない） */
export type IndustryRoiSpec =
  | {
      kind: "labor";
      defaults: LaborRoiDefaults;
      cta: IndustryLpCta;
      disclaimer?: string;
    }
  | {
      kind: "workflow-site";
      defaults: WorkflowSiteRoiDefaults;
      cta: IndustryLpCta;
      disclaimer?: string;
    };

export type IndustryRoiConfig = {
  sliders: RoiSlider[];
  computeAnnualLoss: (v: Record<string, number>) => number;
  computeRecoverable: (v: Record<string, number>) => number;
  estimateDevCost: () => { low: number; high: number };
  outputs: {
    lossLabel: string;
    recoverableLabel: string;
    paybackLabel?: string;
    leadTimeLabel?: string;
    leadTimeValue?: string;
  };
  cta: IndustryLpCta;
  disclaimer: string;
};

export function createLaborRoiConfig(
  defaults: LaborRoiDefaults,
  externalCta: IndustryLpCta,
  disclaimer?: string
): IndustryRoiConfig {
  const recoverRate = defaults.recoverRate ?? 0.55;
  const computeAnnualLoss = (v: Record<string, number>) => {
    const people = v.people ?? 0;
    const minutes = v.minutesPerDay ?? 0;
    const hourly = v.hourlyYen ?? 0;
    const days = v.workDays ?? 0;
    return people * (minutes / 60) * hourly * days;
  };

  return {
    sliders: [
      {
        key: "people",
        label: "影響する人数",
        unit: "人",
        min: 5,
        max: 200,
        step: 5,
        defaultValue: defaults.people,
        note: "この業務に関わる人数を想定してください",
      },
      {
        key: "minutesPerDay",
        label: "1人あたりの損失時間",
        unit: "分/日",
        min: 5,
        max: 120,
        step: 5,
        defaultValue: defaults.minutesPerDay,
        note: "控えめに見たい場合は下げてください",
      },
      {
        key: "hourlyYen",
        label: "時間単価",
        unit: "円/時",
        min: 1500,
        max: 8000,
        step: 100,
        defaultValue: defaults.hourlyYen,
        note: "人件費の目安（負担単価）",
      },
      {
        key: "workDays",
        label: "稼働日数",
        unit: "日/年",
        min: 100,
        max: 260,
        step: 10,
        defaultValue: defaults.workDays,
        note: "年間の稼働日",
      },
    ],
    computeAnnualLoss,
    computeRecoverable: (v) => Math.round(computeAnnualLoss(v) * recoverRate),
    estimateDevCost: () => ({
      low: defaults.devLow ?? 1_500_000,
      high: defaults.devHigh ?? 4_500_000,
    }),
    outputs: {
      lossLabel: "想定される年間ロス",
      recoverableLabel: "取り戻せる金額（試算）",
      paybackLabel: "回収期間の目安",
    },
    cta: externalCta,
    disclaimer:
      disclaimer ??
      "※入力内容にもとづく試算であり、効果を保証するものではありません。",
  };
}

export function createWorkflowSiteRoiConfig(
  defaults: WorkflowSiteRoiDefaults,
  externalCta: IndustryLpCta,
  disclaimer?: string
): IndustryRoiConfig {
  const workDays = defaults.workDays ?? 240;
  const recoverRate = defaults.recoverRate ?? 0.5;
  const reworkFactor = defaults.reworkFactor ?? 0.5;

  const transferCost = (v: Record<string, number>) => {
    const sites = v.sites ?? 0;
    const minutes = v.minutesPerSiteDay ?? 0;
    const hourly = v.hourlyYen ?? 0;
    const days = v.workDays ?? workDays;
    return sites * (minutes / 60) * hourly * days;
  };

  const computeAnnualLoss = (v: Record<string, number>) => {
    const base = transferCost(v);
    const reworkPct = (v.reworkRate ?? 0) / 100;
    return base + base * reworkPct * reworkFactor;
  };

  return {
    sliders: [
      {
        key: "sites",
        label: "同時に動いている現場数",
        unit: "現場",
        min: 1,
        max: 50,
        step: 1,
        defaultValue: defaults.sites,
        note: "まず1部署から。全社ならその分大きくなります",
      },
      {
        key: "minutesPerSiteDay",
        label: "1現場・1日あたりの整理や入力時間",
        unit: "分",
        min: 10,
        max: 120,
        step: 5,
        defaultValue: defaults.minutesPerSiteDay,
        note: "名前付け・入力・貼り付けの合計",
      },
      {
        key: "hourlyYen",
        label: "人件費の時間単価（会社負担）",
        unit: "円",
        min: 2000,
        max: 8000,
        step: 100,
        defaultValue: defaults.hourlyYen,
        note: "実勢に合わせて動かしてください",
      },
      {
        key: "reworkRate",
        label: "写真の不足による差し戻し率",
        unit: "%",
        min: 0,
        max: 50,
        step: 1,
        defaultValue: defaults.reworkRatePercent,
        note: "控えめに見たい場合は下げてください",
      },
    ],
    computeAnnualLoss,
    computeRecoverable: (v) => Math.round(computeAnnualLoss(v) * recoverRate),
    estimateDevCost: () => ({
      low: defaults.devLow ?? 2_000_000,
      high: defaults.devHigh ?? 6_000_000,
    }),
    outputs: {
      lossLabel: "現在使われている人件費（年間）",
      recoverableLabel: "削減できる金額の目安（年間）",
      paybackLabel: "回収期間の目安",
      leadTimeLabel:
        defaults.leadTimeLabel ?? "提出までのリードタイム（イメージ）",
      leadTimeValue: defaults.leadTimeValue ?? "2〜3日 → 即日",
    },
    cta: externalCta,
    disclaimer:
      disclaimer ??
      "※入力内容にもとづく試算であり、効果を保証するものではありません。",
  };
}

/** Client Component 内で仕様から計算付き config を復元する */
export function resolveIndustryRoiConfig(spec: IndustryRoiSpec): IndustryRoiConfig {
  if (spec.kind === "labor") {
    return createLaborRoiConfig(spec.defaults, spec.cta, spec.disclaimer);
  }
  return createWorkflowSiteRoiConfig(spec.defaults, spec.cta, spec.disclaimer);
}
