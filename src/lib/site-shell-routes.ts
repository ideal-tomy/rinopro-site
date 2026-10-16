/** サイト共通ヘッダー・フッターを出さない LP（LP 専用ナビに一本化） */
export const ROUTES_WITHOUT_GLOBAL_CHROME = ["/lp/chuken-enterprise-v2"] as const;

export function shouldHideGlobalChrome(pathname: string): boolean {
  return ROUTES_WITHOUT_GLOBAL_CHROME.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
}
