const MAX_RETURN_LEN = 2048;

/**
 * オープンリダイレクト防止のため、同一オリジン想定の相対パスのみ許可する。
 */
export function sanitizeInternalReturnPath(
  raw: string | null | undefined
): string | null {
  if (raw == null || raw === "") return null;
  let decoded: string;
  try {
    decoded = decodeURIComponent(raw.trim());
  } catch {
    return null;
  }
  if (decoded.length > MAX_RETURN_LEN) return null;
  if (!decoded.startsWith("/")) return null;
  if (decoded.startsWith("//") || decoded.includes("://")) return null;
  return decoded;
}

/**
 * 体験ページへ遷移する href。遷移元のパス（クエリ含む）を `returnTo` で渡す。
 */
export function buildExperienceEntryHref(
  experienceSlug: string,
  currentLocation: string
): string {
  const params = new URLSearchParams();
  params.set("returnTo", currentLocation);
  return `/experience/${experienceSlug}?${params.toString()}`;
}

/** ツールdemo詳細 `/demo/[slug]` へ遷移する href（一覧などから戻る用） */
export function buildToolDemoEntryHref(
  demoSlug: string,
  currentLocation: string
): string {
  const params = new URLSearchParams();
  params.set("returnTo", currentLocation);
  return `/demo/${demoSlug}?${params.toString()}`;
}

/** App Router の `searchParams` から `returnTo` を取り出して検証する */
export function parseReturnToFromSearchParams(
  sp: Record<string, string | string[] | undefined> | null | undefined
): string | null {
  const raw = sp?.returnTo;
  const v = Array.isArray(raw) ? raw[0] : raw;
  return sanitizeInternalReturnPath(v);
}
