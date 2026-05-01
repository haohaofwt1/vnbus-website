export const ADMIN_SESSION_COOKIE_NAME = "vnbus-admin-session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

export type AdminAccessRole = "ADMIN" | "STAFF";

type AdminSessionTokenPayload = {
  userId: string;
  role: AdminAccessRole;
  exp: number;
};

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bytesToBase64Url(bytes: Uint8Array) {
  const binary = Array.from(bytes, (byte) => String.fromCharCode(byte)).join("");
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function getAdminSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (secret) {
    return secret;
  }

  if (process.env.NODE_ENV !== "production") {
    return "vnbus-dev-admin-session-secret";
  }

  throw new Error("Missing ADMIN_SESSION_SECRET in production.");
}

async function getSigningKey() {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(getAdminSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );
}

async function signValue(value: string) {
  const key = await getSigningKey();
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return bytesToBase64Url(new Uint8Array(signature));
}

export async function createAdminSessionToken(input: {
  userId: string;
  role: AdminAccessRole;
}) {
  const payload: AdminSessionTokenPayload = {
    userId: input.userId,
    role: input.role,
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE,
  };

  const payloadString = JSON.stringify(payload);
  const payloadEncoded = bytesToBase64Url(encoder.encode(payloadString));
  const signature = await signValue(payloadEncoded);
  return `${payloadEncoded}.${signature}`;
}

export async function verifyAdminSessionToken(token?: string | null) {
  if (!token) {
    return null;
  }

  const [payloadEncoded, signature] = token.split(".");

  if (!payloadEncoded || !signature) {
    return null;
  }

  const key = await getSigningKey();
  const isValid = await crypto.subtle.verify(
    "HMAC",
    key,
    base64UrlToBytes(signature),
    encoder.encode(payloadEncoded),
  );

  if (!isValid) {
    return null;
  }

  try {
    const payload = JSON.parse(
      decoder.decode(base64UrlToBytes(payloadEncoded)),
    ) as AdminSessionTokenPayload;

    if (!payload.userId || !payload.role || payload.exp <= Math.floor(Date.now() / 1000)) {
      return null;
    }

    if (payload.role !== "ADMIN" && payload.role !== "STAFF") {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
