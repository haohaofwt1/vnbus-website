import { updatePaymentSettingsAction } from "@/lib/actions/admin-payments";
import type { PaymentSettings } from "@/lib/site-settings";

type PaymentSettingsFormProps = {
  settings: PaymentSettings;
  status: {
    stripeSecretConfigured: boolean;
    stripeWebhookConfigured: boolean;
    stripePublishableConfigured: boolean;
    vnpayConfigured: boolean;
    vnpayPaymentUrlConfigured: boolean;
    confirmationWebhookConfigured: boolean;
    encryptionConfigured: boolean;
  };
};

export function PaymentSettingsForm({ settings, status }: PaymentSettingsFormProps) {
  const stripeReady =
    status.stripeSecretConfigured &&
    status.stripeWebhookConfigured &&
    status.stripePublishableConfigured;
  const vnpayReady = status.vnpayConfigured && status.vnpayPaymentUrlConfigured;
  const bankReady = Boolean(settings.bankTransfer.accountNumber && settings.bankTransfer.accountName);

  return (
    <form action={updatePaymentSettingsAction} className="space-y-6">
      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-soft">
        <div className="border-b border-slate-200 bg-slate-50 px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
            Payment settings
          </p>
          <div className="mt-3 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
                Third-party payment connections
              </h2>
              <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600">
                Manage live providers, test mode, and encrypted credentials used by checkout.
              </p>
            </div>
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Save changes
            </button>
          </div>
        </div>

        <div className="grid gap-4 border-b border-slate-200 p-6 lg:grid-cols-4">
          <StatusCard title="Stripe" ok={stripeReady} body={stripeReady ? "Ready for card checkout" : "Missing required keys"} />
          <StatusCard title="VNPay" ok={vnpayReady} body={vnpayReady ? "Ready for redirect checkout" : "Missing credentials"} />
          <StatusCard title="Bank QR" ok={bankReady} body={bankReady ? "Manual transfer available" : "Missing account info"} />
          <StatusCard title="Test mode" ok={settings.testModeEnabled} body={settings.testModeEnabled ? "Visible in checkout" : "Disabled"} tone="amber" />
          <StatusCard title="Encryption" ok={status.encryptionConfigured} body={status.encryptionConfigured ? "Credential storage protected" : "Key missing"} />
        </div>

        <div className="grid gap-6 p-6 xl:grid-cols-[360px_1fr]">
          <aside className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <h3 className="font-semibold text-ink">Checkout availability</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                These switches control what customers see during payment.
              </p>
              <div className="mt-5 space-y-3">
                <ProviderSwitch
                  name="stripeEnabled"
                  title="Stripe Checkout"
                  enabled={settings.stripeEnabled}
                  ready={stripeReady}
                />
                <ProviderSwitch
                  name="vnpayEnabled"
                  title="VNPay"
                  enabled={settings.vnpayEnabled}
                  ready={vnpayReady}
                />
                <ProviderSwitch
                  name="momoEnabled"
                  title="MoMo"
                  enabled={settings.momoEnabled}
                  ready={false}
                  mutedLabel="Not implemented"
                />
                <ProviderSwitch
                  name="bankTransferEnabled"
                  title="Bank transfer QR"
                  enabled={settings.bankTransferEnabled}
                  ready={bankReady}
                />
                <ProviderSwitch
                  name="testModeEnabled"
                  title="Test payment mode"
                  enabled={settings.testModeEnabled}
                  ready
                  warning
                />
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-5">
              <label className="space-y-2 text-sm font-semibold text-slate-700">
                <span>Payment owner</span>
                <select
                  name="paymentOwner"
                  defaultValue={settings.paymentOwner}
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                >
                  <option value="platform">Platform collects payment</option>
                  <option value="operator">Operator collects payment</option>
                </select>
              </label>
              <p className="mt-3 text-xs leading-5 text-slate-500">
                Use platform collection for instant confirmation. Use operator collection only when operators settle payments directly.
              </p>
            </div>
          </aside>

          <div className="space-y-5">
            {!status.encryptionConfigured ? (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                Add PAYMENT_SETTINGS_ENCRYPTION_KEY before saving credentials.
              </div>
            ) : null}

            <CredentialPanel
              eyebrow="Stripe"
              title="Card checkout credentials"
              description="Required for hosted card checkout, Apple Pay, and Google Pay through Stripe Checkout."
              ready={stripeReady}
            >
              <SecretField label="Secret key" name="stripeSecretKey" placeholder="sk_test_... or sk_live_..." configured={status.stripeSecretConfigured} />
              <SecretField label="Webhook secret" name="stripeWebhookSecret" placeholder="whsec_..." configured={status.stripeWebhookConfigured} />
              <SecretField label="Publishable key" name="stripePublishableKey" placeholder="pk_test_... or pk_live_..." configured={status.stripePublishableConfigured} />
            </CredentialPanel>

            <CredentialPanel
              eyebrow="VNPay"
              title="Vietnam local payment credentials"
              description="Required for redirect payments through VNPay sandbox or production gateway."
              ready={vnpayReady}
            >
              <SecretField label="Terminal code" name="vnpayTmnCode" placeholder="VNPAY_TMN_CODE" configured={status.vnpayConfigured} />
              <SecretField label="Hash secret" name="vnpayHashSecret" placeholder="VNPAY_HASH_SECRET" configured={status.vnpayConfigured} />
              <SecretField label="Payment URL" name="vnpayPaymentUrl" placeholder="https://sandbox.vnpayment.vn/paymentv2/vpcpay.html" configured={status.vnpayPaymentUrlConfigured} />
            </CredentialPanel>

            <CredentialPanel
              eyebrow="Bank transfer"
              title="Manual QR payment details"
              description="Shown to customers when they choose bank transfer. Admin confirms payment after checking the bank account."
              ready={bankReady}
            >
              <PlainField label="Bank name" name="bankName" defaultValue={settings.bankTransfer.bankName} placeholder="Vietcombank" />
              <PlainField label="Bank code" name="bankCode" defaultValue={settings.bankTransfer.bankCode} placeholder="VCB" />
              <PlainField label="Account holder" name="accountName" defaultValue={settings.bankTransfer.accountName} placeholder="VNBus Company" />
              <PlainField label="Account number" name="accountNumber" defaultValue={settings.bankTransfer.accountNumber} placeholder="0123456789" />
              <PlainField label="QR image URL" name="qrImageUrl" defaultValue={settings.bankTransfer.qrImageUrl} placeholder="https://.../qr.png" />
              <PlainField label="Transfer prefix" name="transferPrefix" defaultValue={settings.bankTransfer.transferPrefix} placeholder="VNBUS" />
              <label className="space-y-2 text-sm font-semibold text-slate-700 lg:col-span-2">
                <span>Instructions</span>
                <textarea
                  name="bankInstructions"
                  rows={3}
                  defaultValue={settings.bankTransfer.instructions}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
                />
              </label>
            </CredentialPanel>

            <CredentialPanel
              eyebrow="Automation"
              title="Post-payment notifications"
              description="Optional webhook used to trigger receipt email, WhatsApp, CRM, or operator notifications."
              ready={status.confirmationWebhookConfigured}
            >
              <SecretField label="Confirmation webhook URL" name="confirmationWebhookUrl" placeholder="https://..." configured={status.confirmationWebhookConfigured} />
            </CredentialPanel>
          </div>
        </div>
      </section>
    </form>
  );
}

function StatusCard({
  title,
  ok,
  body,
  tone = "green",
}: {
  title: string;
  ok: boolean;
  body: string;
  tone?: "green" | "amber";
}) {
  const positive = tone === "green";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-semibold text-ink">{title}</p>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            ok
              ? positive
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
              : "bg-red-50 text-red-700"
          }`}
        >
          {ok ? (positive ? "Ready" : "On") : "Missing"}
        </span>
      </div>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
    </div>
  );
}

function ProviderSwitch({
  name,
  title,
  enabled,
  ready,
  warning = false,
  mutedLabel,
}: {
  name: string;
  title: string;
  enabled: boolean;
  ready: boolean;
  warning?: boolean;
  mutedLabel?: string;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3">
      <span>
        <span className="block text-sm font-semibold text-ink">{title}</span>
        <span
          className={`mt-1 block text-xs font-semibold ${
            ready ? (warning ? "text-amber-700" : "text-emerald-700") : "text-slate-500"
          }`}
        >
          {mutedLabel || (ready ? (warning ? "Use for testing only" : "Configured") : "Needs setup")}
        </span>
      </span>
      <input
        type="checkbox"
        name={name}
        defaultChecked={enabled}
        className="h-5 w-5 rounded border-slate-300 text-brand-600"
      />
    </label>
  );
}

function CredentialPanel({
  eyebrow,
  title,
  description,
  ready,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  ready: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">{eyebrow}</p>
          <h3 className="mt-2 text-lg font-bold text-ink">{title}</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
        </div>
        <span
          className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
            ready ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}
        >
          {ready ? "Complete" : "Needs setup"}
        </span>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">{children}</div>
    </section>
  );
}

function SecretField({
  label,
  name,
  placeholder,
  configured,
}: {
  label: string;
  name: string;
  placeholder: string;
  configured: boolean;
}) {
  return (
    <label className="space-y-2 text-sm font-semibold text-slate-700">
      <span className="flex items-center justify-between gap-3">
        <span>{label}</span>
        <span className={configured ? "text-xs text-emerald-700" : "text-xs text-red-700"}>
          {configured ? "Saved" : "Missing"}
        </span>
      </span>
      <input
        type="password"
        name={name}
        autoComplete="off"
        placeholder={configured ? "Leave blank to keep current value" : placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
      />
    </label>
  );
}

function PlainField({
  label,
  name,
  defaultValue,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue: string;
  placeholder: string;
}) {
  return (
    <label className="space-y-2 text-sm font-semibold text-slate-700">
      <span>{label}</span>
      <input
        type="text"
        name={name}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:bg-white focus:ring-4 focus:ring-brand-100"
      />
    </label>
  );
}
