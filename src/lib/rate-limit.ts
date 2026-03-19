const requests = new Map<string, number[]>();
const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 30;

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
