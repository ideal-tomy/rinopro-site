const requests = new Map<string, number[]>();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 30;

/**
 * プロセス内の制限。サーバーレスではインスタンスごとに別カウントになるため、
 * 全体の上限は Cloudflare / Vercel 側のルールで掛ける。
 */
export function rateLimit(identifier: string): boolean {
  const now = Date.now();
  const timestamps = requests.get(identifier) ?? [];
  const recent = timestamps.filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS) {
    return false;
  }

  recent.push(now);
  requests.set(identifier, recent);
  return true;
}

/** x-forwarded-for は経由順に並ぶため、先頭の接続元だけを使う */
export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || req.headers.get("x-real-ip")?.trim() || "anonymous";
}

/** API ごとに別のカウントにする（問い合わせとチャットで回数を共有しない） */
export function rateLimitRequest(req: Request, scope: string): boolean {
  return rateLimit(`${scope}:${clientIp(req)}`);
}
