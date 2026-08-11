/** 業種ワークフロー LP（ideal W型移植・AXEON 向け） */

export type IndustryLpSlug = "construction" | "manufacturing";

export type AssetRef = {
  src: string;
  alt: string;
  note?: string;
};

export type IndustryLpCta = {
  label: string;
  href: string;
  external?: boolean;
  variant: "primary" | "secondary";
};

export type IndustryLpConfig = {
  slug: IndustryLpSlug;
  demoName: string;
  demoUrl: string;
  ogp: {
    title: string;
    description: string;
    image: AssetRef;
  };
  hero: {
    headline: string;
    subline: string;
    body: string;
    ctas: [IndustryLpCta, IndustryLpCta];
    visual: AssetRef & { fit?: "cover" | "contain" };
  };
  impact: {
    mainFigure: { lead: string; value: string; trail: string };
    basis: string;
    metrics: { value: string; label: string }[];
  };
  problem: {
    label: string;
    headline: string;
    lead: string;
    diagram?: AssetRef;
    items: { no: string; title: string; body: string }[];
    summary: { headline: string; body: string };
  };
  recurringProblems: {
    label: string;
    headline: string;
    diagram: AssetRef;
    closing: { line1: string; line2?: string };
  };
  fit: {
    label: string;
    headline: string;
    lead: string;
    scopeNote?: string;
    conditions: {
      no: string;
      roleLabel?: string;
      title: string;
      body: string;
    }[];
    affirm: string;
    exclude: string;
  };
  usecases: {
    label: string;
    headline: string;
    lead: string;
    items: {
      industry: string;
      scope: string;
      quote: string;
      body: string;
    }[];
    more: string;
  };
  partsCatalog: {
    label: string;
    headline: string;
    lead: string;
    diagram?: AssetRef;
    closing: string;
    items: {
      no: string;
      name: string;
      body: string;
      demoUrl?: string;
    }[];
  };
  resultTabs: {
    sectionLabel: string;
    headline: string;
    note: string;
    tabs: {
      id: string;
      label: string;
      caption: string;
      image: AssetRef;
    }[];
  };
  comparison: {
    label: string;
    headline: string;
    lead: string;
    columns: { common: string; ours: string };
    rows: { point: string; common: string; ours: string }[];
    fairnessNote: string;
  };
  growth: {
    label: string;
    headline: string;
    lead: string;
    cycles: { no: string; title: string; body: string }[];
    closing: string;
  };
  /** インタラクティブ ROI は置かず、要約のみ */
  roiSummary: {
    label: string;
    headline: string;
    lead: string;
    figureValue: string;
    basis: string;
    disclaimer: string;
  };
  process: {
    label: string;
    headline: string;
    lead: string;
    steps: {
      no: string;
      title: string;
      costLabel: string;
      body: string;
    }[];
    exitNote: string;
  };
  faq: { q: string; a: string; defaultOpen?: boolean }[];
  finalCta: {
    headline: string;
    body: string;
    assurances: string[];
    contactLabel: string;
    contactHref: string;
    tryCta: IndustryLpCta;
  };
};
