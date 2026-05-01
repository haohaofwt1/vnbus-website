"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { submitBookingRequest } from "@/lib/actions/booking";
import { getRouteLabel, type Locale } from "@/lib/i18n";

type BookingModalProps = {
  routeId?: string;
  tripId?: string;
  fromCity: string;
  toCity: string;
  departureDate?: string;
  returnDate?: string;
  passengerCount?: number;
  vehicleType?: string;
  buttonLabel?: string;
  locale?: Locale;
};

function SubmitButton({
  pendingLabel,
  idleLabel,
}: {
  pendingLabel: string;
  idleLabel: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className="inline-flex w-full items-center justify-center rounded-2xl bg-accent-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:opacity-60"
      disabled={pending}
    >
      {pending ? pendingLabel : idleLabel}
    </button>
  );
}

export function BookingModal({
  routeId,
  tripId,
  fromCity,
  toCity,
  departureDate,
  returnDate,
  passengerCount = 1,
  vehicleType,
  buttonLabel,
  locale = "en",
}: BookingModalProps) {
  const [open, setOpen] = useState(false);
  const copy = {
    en: {
      anyVehicle: "Any vehicle",
      buttonLabel: "Book now",
      close: "Close",
      eyebrow: "Booking request",
      intro:
        "Submit your preferred departure and contact details. VNBus will confirm availability before any hosted payment step.",
      departureDate: "Departure date",
      returnDate: "Return date",
      passengers: "Passengers",
      vehicleType: "Vehicle type",
      fullName: "Full name",
      email: "Email",
      phone: "Phone",
      whatsapp: "WhatsApp",
      notes: "Notes",
      notesPlaceholder:
        "Pickup preference, luggage notes, group details, border questions...",
      submitting: "Submitting...",
      submit: "Send booking request",
    },
    vi: {
      anyVehicle: "Tất cả loại xe",
      buttonLabel: "Đặt ngay",
      close: "Đóng",
      eyebrow: "Yêu cầu đặt chỗ",
      intro:
        "Gửi ngày đi và thông tin liên hệ mong muốn. VNBus sẽ xác nhận chỗ trước khi chuyển sang bước thanh toán hosted checkout.",
      departureDate: "Ngày đi",
      returnDate: "Ngày về",
      passengers: "Số khách",
      vehicleType: "Loại xe",
      fullName: "Họ và tên",
      email: "Email",
      phone: "Số điện thoại",
      whatsapp: "WhatsApp",
      notes: "Ghi chú",
      notesPlaceholder:
        "Điểm đón mong muốn, hành lý, số lượng nhóm, câu hỏi cửa khẩu...",
      submitting: "Đang gửi...",
      submit: "Gửi yêu cầu đặt chỗ",
    },
    ko: {
      anyVehicle: "전체 차량",
      buttonLabel: "지금 예약",
      close: "닫기",
      eyebrow: "예약 요청",
      intro:
        "희망 출발 정보와 연락처를 보내주세요. VNBus가 호스티드 결제 단계 전 가용 여부를 먼저 확인합니다.",
      departureDate: "출발일",
      returnDate: "복귀일",
      passengers: "탑승객",
      vehicleType: "차량 유형",
      fullName: "이름",
      email: "이메일",
      phone: "전화번호",
      whatsapp: "WhatsApp",
      notes: "메모",
      notesPlaceholder:
        "픽업 희망 위치, 수하물, 단체 인원, 국경 관련 문의 등을 적어주세요.",
      submitting: "전송 중...",
      submit: "예약 요청 보내기",
    },
    ja: {
      anyVehicle: "すべての車両",
      buttonLabel: "今すぐ予約",
      close: "閉じる",
      eyebrow: "予約リクエスト",
      intro:
        "希望する出発情報と連絡先を送信してください。VNBusがホスト型決済の前に空き状況を確認します。",
      departureDate: "出発日",
      returnDate: "復路日",
      passengers: "人数",
      vehicleType: "車両タイプ",
      fullName: "氏名",
      email: "メール",
      phone: "電話番号",
      whatsapp: "WhatsApp",
      notes: "メモ",
      notesPlaceholder:
        "希望の乗車場所、荷物、グループ人数、国境に関する質問などを入力してください。",
      submitting: "送信中...",
      submit: "予約リクエストを送信",
    },
  }[locale];
  const resolvedVehicleType = vehicleType || copy.anyVehicle;
  const resolvedButtonLabel = buttonLabel ?? copy.buttonLabel;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center justify-center rounded-2xl bg-accent-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-accent-600"
      >
        {resolvedButtonLabel}
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
          <div className="card-surface relative max-h-[90vh] w-full max-w-2xl overflow-auto p-6 sm:p-8">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-500 transition hover:bg-slate-50"
            >
              {copy.close}
            </button>
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-700">
                {copy.eyebrow}
              </p>
              <h3 className="mt-3 font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
                {getRouteLabel(fromCity, toCity, locale)}
              </h3>
              <p className="mt-2 text-sm text-muted">
                {copy.intro}
              </p>
            </div>

            <form action={submitBookingRequest} className="grid gap-4 md:grid-cols-2">
              <input type="hidden" name="routeId" value={routeId ?? ""} />
              <input type="hidden" name="tripId" value={tripId ?? ""} />
              <input type="hidden" name="fromCity" value={fromCity} />
              <input type="hidden" name="toCity" value={toCity} />
              <input type="hidden" name="source" value="website" />
              <input type="hidden" name="lang" value={locale} />

              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>{copy.departureDate}</span>
                <input
                  type="date"
                  name="departureDate"
                  defaultValue={departureDate}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>{copy.returnDate}</span>
                <input
                  type="date"
                  name="returnDate"
                  defaultValue={returnDate}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>{copy.passengers}</span>
                <input
                  type="number"
                  min={1}
                  max={20}
                  name="passengerCount"
                  defaultValue={passengerCount}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  required
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>{copy.vehicleType}</span>
                <input
                  type="text"
                  name="vehicleType"
                  defaultValue={resolvedVehicleType}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  required
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>{copy.fullName}</span>
                <input
                  type="text"
                  name="customerName"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  required
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>{copy.email}</span>
                <input
                  type="email"
                  name="customerEmail"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  required
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>{copy.phone}</span>
                <input
                  type="tel"
                  name="customerPhone"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  required
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>{copy.whatsapp}</span>
                <input
                  type="text"
                  name="whatsapp"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
                <span>{copy.notes}</span>
                <textarea
                  name="notes"
                  rows={4}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                  placeholder={copy.notesPlaceholder}
                />
              </label>

              <div className="md:col-span-2">
                <SubmitButton pendingLabel={copy.submitting} idleLabel={copy.submit} />
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
