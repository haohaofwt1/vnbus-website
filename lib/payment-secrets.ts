import "server-only";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export const PAYMENT_SECRET_SETTING_KEY = "payment_provider_secrets";

type PaymentSecretValues = {
  stripeSecretKey?: string;
  stripeWebhookSecret?: string;
  stripePublishableKey?: string;
  vnpayTmnCode?: string;
  vnpayHashSecret?: string;
  vnpayPaymentUrl?: string;
  confirmationWebhookUrl?: string;
};

type StoredPaymentSecrets = Partial<Record<keyof PaymentSecretValues, string>>;

function getEncryptionKey() {
  const raw = process.env.PAYMENT_SETTINGS_ENCRYPTION_KEY || process.env.ADMIN_SESSION_SECRET;

  if (!raw || raw.length < 16) {
    throw new Error(
      "Missing PAYMENT_SETTINGS_ENCRYPTION_KEY. Add a long random value before saving payment credentials.",
    );
  }

  return crypto.createHash("sha256").update(raw).digest();
}

function encryptSecret(value: string) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return [iv, tag, encrypted].map((part) => part.toString("base64url")).join(".");
}

function decryptSecret(value?: string) {
  if (!value) return undefined;

  const [ivText, tagText, encryptedText] = value.split(".");
  if (!ivText || !tagText || !encryptedText) return undefined;

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(ivText, "base64url"),
  );
  decipher.setAuthTag(Buffer.from(tagText, "base64url"));

  return Buffer.concat([
    decipher.update(Buffer.from(encryptedText, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

async function getStoredSecrets() {
  const setting = await prisma.siteSetting.findUnique({
    where: { key: PAYMENT_SECRET_SETTING_KEY },
    select: { value: true },
  });

  return isObject(setting?.value) ? (setting.value as StoredPaymentSecrets) : {};
}

export async function getPaymentSecrets() {
  const stored = await getStoredSecrets();

  return {
    stripeSecretKey: decryptSecret(stored.stripeSecretKey) || process.env.STRIPE_SECRET_KEY || "",
    stripeWebhookSecret:
      decryptSecret(stored.stripeWebhookSecret) || process.env.STRIPE_WEBHOOK_SECRET || "",
    stripePublishableKey:
      decryptSecret(stored.stripePublishableKey) || process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
    vnpayTmnCode: decryptSecret(stored.vnpayTmnCode) || process.env.VNPAY_TMN_CODE || "",
    vnpayHashSecret: decryptSecret(stored.vnpayHashSecret) || process.env.VNPAY_HASH_SECRET || "",
    vnpayPaymentUrl:
      decryptSecret(stored.vnpayPaymentUrl) ||
      process.env.VNPAY_PAYMENT_URL ||
      "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    confirmationWebhookUrl:
      decryptSecret(stored.confirmationWebhookUrl) || process.env.CONFIRMATION_WEBHOOK_URL || "",
  };
}

export async function getPaymentSecretStatus() {
  const secrets = await getPaymentSecrets();

  return {
    stripeSecretConfigured: Boolean(secrets.stripeSecretKey),
    stripeWebhookConfigured: Boolean(secrets.stripeWebhookSecret),
    stripePublishableConfigured: Boolean(secrets.stripePublishableKey),
    vnpayConfigured: Boolean(secrets.vnpayTmnCode && secrets.vnpayHashSecret),
    vnpayPaymentUrlConfigured: Boolean(secrets.vnpayPaymentUrl),
    confirmationWebhookConfigured: Boolean(secrets.confirmationWebhookUrl),
    encryptionConfigured: Boolean(
      process.env.PAYMENT_SETTINGS_ENCRYPTION_KEY || process.env.ADMIN_SESSION_SECRET,
    ),
  };
}

export async function updatePaymentSecrets(input: PaymentSecretValues) {
  const existing = await getStoredSecrets();
  const next: StoredPaymentSecrets = { ...existing };

  (Object.keys(input) as Array<keyof PaymentSecretValues>).forEach((key) => {
    const value = input[key]?.trim();
    if (value) {
      next[key] = encryptSecret(value);
    }
  });

  return prisma.siteSetting.upsert({
    where: { key: PAYMENT_SECRET_SETTING_KEY },
    update: { value: next },
    create: { key: PAYMENT_SECRET_SETTING_KEY, value: next },
  });
}
