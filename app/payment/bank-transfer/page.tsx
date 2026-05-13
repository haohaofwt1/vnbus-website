import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Download, Mail, Phone, TicketCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n";
import { getRouteLabel, resolveLocale, withLang } from "@/lib/i18n";
import { getBankTransferPageCopy, getBookingStatusCopy } from "@/lib/public-locale-copy";
import { getPaymentSettings } from "@/lib/site-settings";
import { formatCurrency, formatDate, formatDateTime, formatTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BankTransferPage({
  searchParams,
}: {
  searchParams: Promise<{ booking?: string; payment?: string; lang?: string }>;
}) {
  const params = await searchParams;
  const locale = resolveLocale(params.lang);
  const t = getBankTransferPageCopy(locale);
  const [booking, paymentSettings] = await Promise.all([
    params.booking
      ? prisma.bookingRequest.findUnique({
          where: { id: params.booking },
          include: {
            trip: {
              include: {
                operator: true,
                vehicleType: true,
                route: { include: { fromCity: true, toCity: true } },
              },
            },
            payments: { orderBy: { createdAt: "desc" }, take: 1 },
          },
        })
      : null,
    getPaymentSettings(),
  ]);

  if (!booking || !booking.totalAmount || !booking.currency) {
    notFound();
  }

  const bank = paymentSettings.bankTransfer;
  const transferCode = `${bank.transferPrefix || "VNBUS"}-${booking.id.slice(-8).toUpperCase()}`;
  const qrImageUrl = buildVietQrImageUrl({
    bankCode: bank.bankCode,
    accountNumber: bank.accountNumber,
    accountName: bank.accountName,
    amount: booking.totalAmount,
    currency: booking.currency,
    transferCode,
    fallbackImageUrl: bank.qrImageUrl,
  });
  const isConfirmed = booking.status === "PAID" || booking.status === "CONFIRMED";
  const paidAt = booking.payments.find((payment) => payment.status === "PAID")?.paidAt;
  const ticketCode = `TICKET-${booking.id.slice(-8).toUpperCase()}`;

  if (isConfirmed) {
    const routeLine = getRouteLabel(booking.fromCity, booking.toCity, locale);
    return (
      <section className="bg-slate-50 py-10">
        <div className="container-shell">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_380px]">
            <main className="rounded-3xl border border-emerald-200 bg-white p-6 shadow-soft sm:p-8">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700">
                {t.confirmedEyebrow}
              </p>
              <h1 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-bold text-ink">
                {t.confirmedTitle}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                {t.confirmedBody}
              </p>

              <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex flex-col gap-4 border-b border-slate-200 pb-5 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">{t.ticket}</p>
                    <h2 className="mt-2 text-2xl font-bold text-ink">{ticketCode}</h2>
                  </div>
                  <span className="inline-flex w-fit items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                    <TicketCheck className="h-4 w-4" /> {t.paidConfirmed}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <TicketRow label={t.route} value={routeLine} />
                  <TicketRow label={t.departureDate} value={formatDate(booking.departureDate)} />
                  <TicketRow label={t.departureTime} value={booking.trip ? formatTime(booking.trip.departureTime) : t.seeOperator} />
                  <TicketRow label={t.passengers} value={String(booking.passengerCount)} />
                  <TicketRow label={t.seatType} value={booking.vehicleType} />
                  <TicketRow label={t.totalPaid} value={formatCurrency(booking.totalAmount, booking.currency)} />
                  <TicketRow label={t.pickup} value={booking.trip?.pickupPoint || t.seeOperator} />
                  <TicketRow label={t.dropoff} value={booking.trip?.dropoffPoint || t.seeOperator} />
                  <TicketRow label={t.operator} value={booking.trip?.operator.name || t.vnbusSupport} />
                  <TicketRow label={t.paidAt} value={paidAt ? formatDateTime(paidAt) : t.verifiedByAdmin} />
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <a
                  href={`mailto:${booking.customerEmail}?subject=VNBus ticket ${ticketCode}`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
                >
                  <Mail className="h-4 w-4" /> {t.emailReceipt}
                </a>
                {booking.trip?.operator.contactPhone ? (
                  <a
                    href={`tel:${booking.trip.operator.contactPhone}`}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                  >
                    <Phone className="h-4 w-4" /> {t.contactOperator}
                  </a>
                ) : null}
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <Download className="h-4 w-4" /> {t.downloadTicket}
                </button>
              </div>
            </main>

            <BookingSummary booking={booking} ticketCode={ticketCode} locale={locale} t={t} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50 py-10">
      <div className="container-shell">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1fr_380px]">
          <main className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-700">
              {t.qrEyebrow}
            </p>
            <h1 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-bold text-ink">
              {t.qrTitle}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              {t.qrBody}
            </p>

            <div className="mt-8 grid gap-6 lg:grid-cols-[300px_1fr]">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-center">
                {qrImageUrl ? (
                  <div className="relative mx-auto aspect-square w-full max-w-[260px] overflow-hidden rounded-2xl bg-white">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={qrImageUrl} alt={t.qrAlt} className="h-full w-full object-contain" />
                  </div>
                ) : (
                  <div className="mx-auto flex aspect-square w-full max-w-[260px] items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
                    {t.qrPlaceholder}
                  </div>
                )}
                <p className="mt-4 text-sm font-semibold text-slate-700">{t.scanHint}</p>
                {booking.currency === "VND" && bank.bankCode && bank.accountNumber ? (
                  <p className="mt-2 text-xs font-semibold text-emerald-700">
                    {locale === "vi"
                      ? "Quét QR sẽ tự điền ngân hàng, tên tài khoản, số tiền và nội dung chuyển khoản."
                      : "QR includes the bank account, account name, exact amount and transfer note."}
                  </p>
                ) : null}
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold leading-6 text-emerald-800">
                  {locale === "vi"
                    ? "Khách chỉ cần quét QR bằng app ngân hàng và bấm chuyển. Các thông tin bên dưới chỉ để kiểm tra lại."
                    : "Scan the QR with a banking app and confirm. Details below are only for review."}
                </div>
                <TransferRow label={t.bank} value={`${bank.bankName}${bank.bankCode ? ` (${bank.bankCode})` : ""}`} />
                <TransferRow label={t.accountHolder} value={bank.accountName || t.notConfigured} />
                <TransferRow label={t.accountNumber} value={bank.accountNumber || t.notConfigured} strong />
                <TransferRow label={t.amount} value={formatCurrency(booking.totalAmount, booking.currency)} strong />
                <TransferRow label={t.transferContent} value={transferCode} strong highlight />
                <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                  {bank.instructions || t.defaultInstructions}
                </div>
              </div>
            </div>
          </main>

          <BookingSummary booking={booking} ticketCode={ticketCode} locale={locale} t={t} />
        </div>
      </div>
    </section>
  );
}

type BankTransferCopy = ReturnType<typeof getBankTransferPageCopy>;

function BookingSummary({
  booking,
  ticketCode,
  locale,
  t,
}: {
  booking: {
    id: string;
    fromCity: string;
    toCity: string;
    departureDate: Date;
    passengerCount: number;
    vehicleType: string;
    status: string;
  };
  ticketCode: string;
  locale: Locale;
  t: BankTransferCopy;
}) {
  const statusLabel = getBookingStatusCopy(locale, booking.status).label;
  return (
    <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-soft lg:self-start">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
        {t.summaryEyebrow}
      </p>
      <h2 className="mt-3 text-xl font-bold text-ink">
        {getRouteLabel(booking.fromCity, booking.toCity, locale)}
      </h2>
      <div className="mt-5 space-y-4 text-sm text-slate-600">
        <TransferRow label={t.ticket} value={ticketCode} />
        <TransferRow label={t.reference} value={booking.id} />
        <TransferRow label={t.date} value={formatDate(booking.departureDate)} />
        <TransferRow label={t.passengers} value={String(booking.passengerCount)} />
        <TransferRow label={t.seatType} value={booking.vehicleType} />
        <TransferRow label={t.status} value={statusLabel} />
      </div>
      <div className="mt-6 border-t border-slate-200 pt-5">
        <Link
          href={withLang("/contact", locale)}
          className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
        >
          {t.needHelp}
        </Link>
      </div>
    </aside>
  );
}

function TransferRow({
  label,
  value,
  strong = false,
  highlight = false,
}: {
  label: string;
  value: string;
  strong?: boolean;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl border px-4 py-3 ${highlight ? "border-brand-200 bg-brand-50" : "border-slate-200 bg-white"}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className={`mt-1 break-words ${strong ? "text-lg font-bold text-ink" : "font-semibold text-slate-700"}`}>
        {value}
      </p>
    </div>
  );
}

function TicketRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{label}</p>
      <p className="mt-1 font-semibold text-ink">{value}</p>
    </div>
  );
}

function buildVietQrImageUrl({
  bankCode,
  accountNumber,
  accountName,
  amount,
  currency,
  transferCode,
  fallbackImageUrl,
}: {
  bankCode: string;
  accountNumber: string;
  accountName: string;
  amount: number;
  currency: string;
  transferCode: string;
  fallbackImageUrl: string;
}) {
  const vietQrBankId = resolveVietQrBankId(bankCode);

  if (currency === "VND" && vietQrBankId && accountNumber && amount > 0) {
    const params = new URLSearchParams({
      amount: String(Math.round(amount)),
      addInfo: transferCode,
    });

    if (accountName) {
      params.set("accountName", accountName);
    }

    return `https://img.vietqr.io/image/${encodeURIComponent(vietQrBankId)}-${encodeURIComponent(accountNumber)}-compact2.png?${params.toString()}`;
  }

  return fallbackImageUrl || "";
}

function resolveVietQrBankId(value: string) {
  const normalized = value.trim().toUpperCase().replace(/\s+/g, "");
  if (!normalized) return "";
  if (/^\d{6}$/.test(normalized)) return normalized;

  const bankBins: Record<string, string> = {
    VCB: "970436",
    VIETCOMBANK: "970436",
    TCB: "970407",
    TECHCOMBANK: "970407",
    MB: "970422",
    MBB: "970422",
    MBBANK: "970422",
    BIDV: "970418",
    VIETINBANK: "970415",
    ICB: "970415",
    ACB: "970416",
    VPB: "970432",
    VPBANK: "970432",
    TPB: "970423",
    TPBANK: "970423",
    VIB: "970441",
    HDB: "970437",
    HDBANK: "970437",
    MSB: "970426",
    SACOMBANK: "970403",
    STB: "970403",
    OCB: "970448",
    SHB: "970443",
    LPB: "970449",
    LIENVIETPOSTBANK: "970449",
    EXIMBANK: "970431",
    EIB: "970431",
    SEABANK: "970440",
    ABBANK: "970425",
    NAMABANK: "970428",
    NAB: "970428",
    VIETBANK: "970433",
    BAB: "970409",
    BACABANK: "970409",
    PGBANK: "970430",
    PVCOMBANK: "970412",
    SCB: "970429",
    OCEANBANK: "970414",
    KIENLONGBANK: "970452",
    KLB: "970452",
    VIETABANK: "970427",
    VAB: "970427",
    WOORIBANK: "970457",
    WOORI: "970457",
    HSBC: "458761",
    CIMB: "422589",
  };

  return bankBins[normalized] ?? normalized;
}
