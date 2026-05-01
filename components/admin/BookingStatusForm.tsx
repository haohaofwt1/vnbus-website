import { updateBookingStatusAction } from "@/lib/actions/admin-bookings";

export function BookingStatusForm({
  bookingRequestId,
  currentStatus,
}: {
  bookingRequestId: string;
  currentStatus: string;
}) {
  return (
    <form action={updateBookingStatusAction} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5">
      <input type="hidden" name="bookingRequestId" value={bookingRequestId} />
      <div className="grid gap-4 lg:grid-cols-[220px_1fr_auto]">
        <select
          name="status"
          defaultValue={currentStatus}
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
        >
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="PENDING_PAYMENT">Pending payment</option>
          <option value="PAID">Paid</option>
          <option value="FAILED">Failed</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="REFUNDED">Refunded</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <input
          name="note"
          placeholder="Optional internal note"
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center rounded-2xl bg-brand-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          Update status
        </button>
      </div>
    </form>
  );
}

