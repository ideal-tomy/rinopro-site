/**
 * Cloudflare Turnstile の確認。
 * トークンなし、失敗、期限切れ、許可していないホスト名は拒否する。
 */

const SITEVERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";

const DEFAULT_ALLOWED_HOSTS = ["axeon.jp", "www.axeon.jp"];

const CONFIRM_FAILED = "確認が完了していません。ページを再読み込みして再度お試しください。";
const CONFIRM_EXPIRED = "確認の有効期限が切れています。ページを再読み込みして再度お試しください。";
const CONFIRM_UNAVAILABLE = "確認に失敗しました。しばらくしてから再度お試しください。";
const NOT_CONFIGURED = "送信確認の設定が完了していません。しばらくしてから再度お試しください。";

export type TurnstileDecision =
  | { ok: true }
  | { ok: false; status: 400 | 403 | 503; error: string; code: string };

type SiteverifyPayload = {
  success?: boolean;
  hostname?: string;
  "error-codes"?: string[];
};

function allowedHosts(): string[] {
  const configured = process.env.TURNSTILE_ALLOWED_HOSTS?.split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
  return configured && configured.length > 0 ? configured : DEFAULT_ALLOWED_HOSTS;
}

export function isAllowedTurnstileHostname(hostname: string): boolean {
  const normalized = hostname.trim().toLowerCase();
  if (!normalized) return false;
  if (allowedHosts().includes(normalized)) return true;
  if (process.env.VERCEL_ENV === "production") return false;
  if (normalized === "localhost" || normalized === "127.0.0.1" || normalized === "::1") {
    return true;
  }
  return process.env.VERCEL_ENV === "preview" && normalized.endsWith(".vercel.app");
}

export function interpretSiteverify(payload: unknown): TurnstileDecision {
  if (!payload || typeof payload !== "object") {
    return { ok: false, status: 503, error: CONFIRM_UNAVAILABLE, code: "verify_failed" };
  }

  const body = payload as SiteverifyPayload;
  const errors = Array.isArray(body["error-codes"])
    ? body["error-codes"].filter((code): code is string => typeof code === "string")
    : [];

  if (body.success !== true) {
    if (errors.includes("internal-error")) {
      return { ok: false, status: 503, error: CONFIRM_UNAVAILABLE, code: "verify_failed" };
    }
    if (errors.includes("timeout-or-duplicate")) {
      return { ok: false, status: 400, error: CONFIRM_EXPIRED, code: "timeout_or_duplicate" };
    }
    return { ok: false, status: 400, error: CONFIRM_FAILED, code: "invalid_token" };
  }

  const hostname = typeof body.hostname === "string" ? body.hostname : "";
  if (!hostname || !isAllowedTurnstileHostname(hostname)) {
    return { ok: false, status: 403, error: CONFIRM_FAILED, code: "hostname_mismatch" };
  }

  return { ok: true };
}

export async function verifyTurnstileToken(token: string | undefined): Promise<TurnstileDecision> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false, status: 503, error: NOT_CONFIGURED, code: "not_configured" };
    }
    return { ok: true };
  }
  if (!token?.trim()) {
    return { ok: false, status: 400, error: CONFIRM_FAILED, code: "missing_token" };
  }

  let response: Response;
  try {
    response = await fetch(SITEVERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token.trim() }),
      signal: AbortSignal.timeout(8000),
    });
  } catch (err) {
    console.error("[Contact] turnstile request failed", {
      name: err instanceof Error ? err.name : "UnknownError",
    });
    return { ok: false, status: 503, error: CONFIRM_UNAVAILABLE, code: "verify_failed" };
  }

  if (!response.ok) {
    console.error("[Contact] turnstile status", response.status);
    return { ok: false, status: 503, error: CONFIRM_UNAVAILABLE, code: "verify_failed" };
  }

  const payload: unknown = await response.json().catch(() => null);
  return interpretSiteverify(payload);
}
