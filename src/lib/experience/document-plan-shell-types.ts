/**
 * BeforeAfterDocumentShell 用のブロック型（横展開でプリセットごとに組み立てる）
 */

export type DocumentShellBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "bullets"; items: string[] }
  | {
      type: "table";
      caption?: string;
      headers: string[];
      rows: string[][];
    }
  | {
      type: "kpis";
      items: { label: string; value: string; note?: string }[];
    };

export interface DocumentShellMockResult {
  /** 右ペイン上部のタイトル */
  documentTitle: string;
  blocks: DocumentShellBlock[];
}
