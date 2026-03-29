/**
 * コンシェルジュ用チャット API エラーをユーザー向け短文に変換する。
 */
export function formatConciergeChatErrorMessage(raw: string): string {
  const lower = raw.toLowerCase();
  if (
    lower.includes("quota") ||
    lower.includes("exceeded your current quota") ||
    lower.includes("resource exhausted") ||
    lower.includes("429")
  ) {
    return "いまは応答サービスの利用上限に達しています。しばらくしてから再度お試しください。";
  }
  if (
    lower.includes("network") ||
    lower.includes("fetch") ||
    lower.includes("failed to fetch") ||
    lower.includes("econnrefused")
  ) {
    return "通信に失敗しました。接続を確認のうえ、もう一度お試しください。";
  }
  if (lower.includes("rate limit") || lower.includes("too many requests")) {
    return "短時間にリクエストが集中しています。少し時間をおいてから再度お試しください。";
  }
  return "応答を取得できませんでした。しばらくしてから再度お試しください。";
}
