const STORAGE_PREFIX = "axeon:scrollRestore:";

function keyForLocation(location: string): string {
  return STORAGE_PREFIX + location;
}

/**
 * `returnTo` 付きで体験／demo 詳細へ進む直前に呼ぶ。現在の pathname + search をキーに scrollY を保存する。
 */
export function saveScrollForBeforeReturnNavigation(): void {
  if (typeof window === "undefined") return;
  const loc = window.location.pathname + window.location.search;
  try {
    sessionStorage.setItem(keyForLocation(loc), String(window.scrollY));
  } catch {
    // 容量・プライベートモード等
  }
}

/**
 * 復元してキーを削除する。該当がなければ null。
 */
export function readAndConsumeScrollRestore(location: string): number | null {
  if (typeof window === "undefined") return null;
  try {
    const k = keyForLocation(location);
    const raw = sessionStorage.getItem(k);
    if (raw == null) return null;
    sessionStorage.removeItem(k);
    const y = Number.parseInt(raw, 10);
    if (!Number.isFinite(y) || y < 0) return null;
    return y;
  } catch {
    return null;
  }
}
