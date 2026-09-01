/** デモショーケース用サンプルデータ（Ideal gallery から最小抽出） */

export interface SamplePhoto {
  id: string;
  originalName: string;
  label: string;
  color: string;
}

export interface ClassifiedPhoto {
  id: string;
  originalName: string;
  newName: string;
  folder: string;
  description: string;
}

export interface PhotoSampleSet {
  id: string;
  name: string;
  industry: string;
  photos: SamplePhoto[];
  results: ClassifiedPhoto[];
  folders: string[];
}

export const photoProcessingSteps = [
  "画像を読み込み中…",
  "内容を判定中…",
  "ファイル名を生成中…",
  "フォルダへ分類中…",
  "整理が完了しました",
];

export const photoSampleSets: PhotoSampleSet[] = [
  {
    id: "construction",
    name: "建設現場",
    industry: "建設",
    photos: [
      { id: "c1", originalName: "IMG_4832.jpg", label: "基礎工事", color: "#6B7280" },
      { id: "c2", originalName: "IMG_4833.jpg", label: "鉄筋配筋", color: "#78716C" },
      { id: "c3", originalName: "IMG_4834.jpg", label: "型枠設置", color: "#57534E" },
      { id: "c4", originalName: "IMG_4835.jpg", label: "安全確認", color: "#44403C" },
    ],
    results: [
      {
        id: "c1",
        originalName: "IMG_4832.jpg",
        newName: "現場A_基礎工事_2024-03-12.jpg",
        folder: "基礎工事",
        description: "基礎掘削完了の記録",
      },
      {
        id: "c2",
        originalName: "IMG_4833.jpg",
        newName: "現場A_鉄筋配筋_2024-03-12.jpg",
        folder: "鉄筋工事",
        description: "配筋検査前の状態",
      },
      {
        id: "c3",
        originalName: "IMG_4834.jpg",
        newName: "現場A_型枠設置_2024-03-13.jpg",
        folder: "型枠工事",
        description: "型枠組立完了",
      },
      {
        id: "c4",
        originalName: "IMG_4835.jpg",
        newName: "現場A_安全確認_2024-03-13.jpg",
        folder: "安全管理",
        description: "朝礼・安全確認の記録",
      },
    ],
    folders: ["基礎工事", "鉄筋工事", "型枠工事", "安全管理"],
  },
];

export const knowledgeProcessingSteps = [
  "質問を解析中…",
  "関連文書を検索中…",
  "回答を生成中…",
  "根拠を整理中…",
  "回答が完了しました",
];
