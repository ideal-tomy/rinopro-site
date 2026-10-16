function utf8ToBase64Url(str: string): string {
  const bytes = new TextEncoder().encode(str);
  let bin = "";
  for (const b of bytes) {
    bin += String.fromCharCode(b);
  }
  if (typeof btoa !== "function") {
    throw new Error("btoa is not available");
  }
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToUtf8(b64url: string): string {
  const padded = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const padLen = (4 - (padded.length % 4)) % 4;
  const b64 = padded + "=".repeat(padLen);
  if (typeof atob !== "function") {
    throw new Error("atob is not available");
  }
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) {
    bytes[i] = bin.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}

export function encodeHandoffPayload(payload: unknown): string {
  return utf8ToBase64Url(JSON.stringify(payload));
}

export function decodeHandoffPayload(raw: string): Record<string, unknown> | null {
  try {
    const parsed = JSON.parse(base64UrlToUtf8(raw)) as Record<string, unknown>;
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}
