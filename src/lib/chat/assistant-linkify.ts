import { isSafeAssistantInternalPath } from "@/lib/chat/assistant-internal-path";

/**
 * LLM 出力で `[表示名](/path)` がそのまま見える典型原因を緩和する。
 *
 * - `]` と `(` の間に空白・ゼロ幅文字があると CommonMark でリンクにならない
 * - 全角 `［］（）` はパーサがリンクと認識しない
 * - 全体を `` `...` `` で囲むとインラインコードになり、クリック不能になる
 */
export function normalizeAssistantMarkdownArtifacts(content: string): string {
  if (!content) return content;
  let s = content;
  s = s.replace(/\]\s*[\u200b-\u200d\ufeff]*\s*(\(\/[^)\s]{1,240}\))/g, "]$1");
  s = s.replace(/\]\s+(\(\/[^)\s]{1,240}\))/g, "]$1");
  s = s.replace(/［([^］]{1,200})］\s*（(\/[^）\s]{1,240})）/g, "[$1]($2)");
  s = s.replace(
    /`(\[[^\]]{1,200}\]\(\/[a-z0-9/._~-]{1,240}\))`/gi,
    "$1"
  );
  return s;
}

/**
 * モデルが `/demo/foo` のように **Markdown リンクなし**でパスだけ出したとき、
 * ユーザーがコピペしなくてよいよう `[ラベル](パス)` に補う。
 *
 * - フェンスコード・インラインコード・既存の `[text](url)` は触らない
 * - 許可パスは正規表現で厳しく限定（プロンプトのサイト内誘導と整合）
 */
const PLACEHOLDER = (i: number) => `\u2063LINKIFY${i}\u2063`;

/** 許可パス本体（先頭スラッシュなし・先頭からマッチ） */
const PATH_CORE =
  "demo/list" +
  "|demo/[a-z0-9]+(?:-[a-z0-9]+)*" +
  "|experience/[a-z0-9]+(?:-[a-z0-9]+)*" +
  "|estimate-detailed(?:/[a-z0-9-]+)?" +
  "|services(?:/(?:development|consulting))?" +
  "|contact" +
  "|flow" +
  "|consulting" +
  "|about";

const BARE_INTERNAL_PATH_RE = new RegExp(
  `(^|[^\\w/])(/(?:${PATH_CORE}))(?![a-z0-9/-])`,
  "gi"
);

const FIXED_LABELS: Record<string, string> = {
  "/demo/list": "demo一覧",
  "/contact": "お問い合わせ",
  "/estimate-detailed": "詳細見積もり",
  "/flow": "開発の進め方（/flow）",
  "/consulting": "コンサルティング（/consulting）",
  "/about": "会社情報（/about）",
  "/services": "サービス一覧",
  "/services/development": "開発サービス",
  "/services/consulting": "コンサルティングサービス",
};

function linkLabelForPath(path: string): string {
  const fixed = FIXED_LABELS[path];
  if (fixed) return fixed;
  if (path.startsWith("/demo/")) {
    const slug = path.slice("/demo/".length);
    if (!slug) return "デモ";
    return slug.includes("-")
      ? slug.replace(/-/g, " ")
      : `デモ（${slug}）`;
  }
  if (path.startsWith("/experience/")) {
    const slug = path.slice("/experience/".length);
    return slug ? `体験（${slug.replace(/-/g, " ")}）` : "体験ページ";
  }
  if (path.startsWith("/estimate-detailed/")) {
    return "詳細見積もり（次のステップ）";
  }
  return path;
}

function stash(
  source: string,
  pattern: RegExp,
  chunks: string[]
): string {
  return source.replace(pattern, (m) => {
    chunks.push(m);
    return PLACEHOLDER(chunks.length - 1);
  });
}

export function linkifyBareInternalPathsForAssistant(content: string): string {
  if (!content || !content.includes("/")) return content;

  const chunks: string[] = [];
  let s = content;

  s = stash(s, /^```[\s\S]*?^```/gm, chunks);
  s = stash(s, /`[^`\n]+`/g, chunks);
  s = stash(s, /(?<!!)\[([^\]]*)\]\(([^)\s]+)\)/g, chunks);

  s = s.replace(BARE_INTERNAL_PATH_RE, (full, prefix: string, path: string) => {
    if (!isSafeAssistantInternalPath(path)) return full;
    return `${prefix}[${linkLabelForPath(path)}](${path})`;
  });

  return s.replace(/\u2063LINKIFY(\d+)\u2063/g, (_, i) => {
    const idx = Number(i);
    return Number.isFinite(idx) ? (chunks[idx] ?? _) : _;
  });
}
