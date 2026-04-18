import type { DocumentShellMockResult } from "@/lib/experience/document-plan-shell-types";

export interface DocumentShellChoiceOption {
  id: string;
  label: string;
}

export interface DocumentShellChoiceStep {
  id: string;
  title: string;
  options: DocumentShellChoiceOption[];
  /** true のステップは未選択でも実行可 */
  optional?: boolean;
}

/** モックビルダ・将来の API が共通で受け取る入力 */
export interface DocumentShellUserInput {
  rawText: string;
  selections: Record<string, string>;
}

export interface DocumentShellPresetDefinition {
  choiceSteps: DocumentShellChoiceStep[];
  samples: string[];
  /** サンプルボタン表記（`samples` と同じ長さ）。未指定時は「サンプル1」形式 */
  sampleLabels?: string[];
  build: (input: DocumentShellUserInput) => DocumentShellMockResult;
  leftPanelTitle?: string;
  centerButtonLabel?: string;
  rightPanelTitle?: string;
}
