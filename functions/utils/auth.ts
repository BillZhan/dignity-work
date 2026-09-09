// functions/utils/auth.ts
// 服务端会话工具：HMAC 签名 cookie，HttpOnly 防 XSS 偷取

const SESSION_TTL_MS = 24 * 60 * 60 * 1000; // 24 小时

export async function hmacSign(message: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return toBase64Url(new Uint8Array(sig));
}

function toBase64Url(bytes: Uint8Array): string {
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export async function createSessionCookie(secret: string): Promise<string> {
  const exp = Date.now() + SESSION_TTL_MS;
  const sig = await hmacSign(String(exp), secret);
  return `${exp}.${sig}`;
}

export async function verifySessionCookie(
  cookie: string,
  secret: string
): Promise<boolean> {
  const dot = cookie.indexOf(".");
  if (dot < 0) return false;
  const expStr = cookie.slice(0, dot);
  const sig = cookie.slice(dot + 1);
  const exp = Number(expStr);
  if (!Number.isFinite(exp)) return false;
  if (Date.now() > exp) return false;
  const expected = await hmacSign(expStr, secret);
  return timingSafeEqual(sig, expected);
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

export function parseCookie(header: string, name: string): string | null {
  for (const part of header.split(/;\s*/)) {
    const eq = part.indexOf("=");
    if (eq < 0) continue;
    const k = part.slice(0, eq).trim();
    if (k === name) return part.slice(eq + 1);
  }
  return null;
}

export function getSessionSecret(env: { ADMIN_PASSWORD?: string; SESSION_SECRET?: string }): string {
  return env.SESSION_SECRET || env.ADMIN_PASSWORD || "fallback-dev-secret-do-not-use-in-production";
}