import type {
  ConciergeTrack,
  FlowChoice,
  FlowStepDef,
  FlowSelection,
  ShortcutPanel,
} from "@/lib/chat/concierge-flow";
import type { ConciergeIndustryBundle } from "@/lib/chat/estimate-handoff";

/** ホーム分岐フローのフッター（結果→CTA→入力）と ChatContainer の入力欄表示を同期 */
export type HomeConciergeFooterPhase =
  | "wizard"
  | "done_result"
  | "done_cta"
  | "done_input";

/** ホームウィザードの遷移用（C/D/E 確定前の中間フェーズ） */
export type ConciergePhase = ConciergeTrack | "CDE";

export type IndustryPending =
  | { kind: "cde" }
  | { kind: "track"; track: ConciergeTrack };

export type FlowFrame =
  | { kind: "root" }
  | {
      kind: "industry_gate";
      rootPath: FlowSelection[];
      pending: IndustryPending;
    }
  | {
      kind: "question";
      track: ConciergePhase;
      step: FlowStepDef;
      path: FlowSelection[];
      industryBundle?: ConciergeIndustryBundle;
    }
  | {
      kind: "freeform";
      track: ConciergePhase;
      step: FlowStepDef;
      path: FlowSelection[];
      choice: FlowChoice;
      industryBundle?: ConciergeIndustryBundle;
    }
  | {
      kind: "done";
      track: ConciergeTrack;
      path: FlowSelection[];
      body: string;
      shortcut?: ShortcutPanel;
      industryBundle?: ConciergeIndustryBundle;
    };
