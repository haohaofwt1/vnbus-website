import Link from "next/link";
import { StatusBadge } from "@/components/admin/AdminModuleChrome";
import { updatePaymentStatusAction } from "@/lib/actions/admin-payments";
import { formatCurrency, formatDateTime } from "@/lib/utils";

type PaymentTableProps = {
  payments: Array<{
    id: string;
    amount: number;
    currency: string;
    status: string;
    provider: string;
    paidAt: Date | null;
    createdAt: Date;
    bookingRequest: { id: string; customerName: string; customerEmail: string; fromCity?: string; toCity?: string };
  }>;
};

export function PaymentTable({ payments }: PaymentTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50"><tr><th className="w-10 px-4 py-3 text-left"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-brand-600" aria-label="Select all payments" data-admin-bulk-select-all="paymentIds" disabled={!payments.length} /></th>{["Booking", "Provider", "Amount", "Status", "Created / paid", "Update"].map((label) => <th key={label} className="px-4 py-3 text-left text-xs font-black uppercase tracking-[0.16em] text-slate-500">{label}</th>)}</tr></thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {payments.length ? payments.map((payment) => (
              <tr key={payment.id} className="transition hover:bg-blue-50/35">
                <td className="px-4 py-4"><input type="checkbox" value={payment.id} className="h-4 w-4 rounded border-slate-300 text-brand-600" aria-label={`Select payment ${payment.id}`} data-admin-bulk-row="paymentIds" /></td>
                <td className="px-4 py-4 text-sm text-slate-700"><p className="font-black text-ink">{payment.bookingRequest.customerName}</p><p className="text-slate-500">{payment.bookingRequest.customerEmail}</p><Link href={`/admin/bookings/${payment.bookingRequest.id}`} className="mt-1 inline-flex font-black text-brand-700">Open booking</Link></td>
                <td className="px-4 py-4 text-sm text-slate-700">{payment.provider}</td>
                <td className="px-4 py-4 text-sm font-black text-ink">{formatCurrency(payment.amount, payment.currency)}</td>
                <td className="px-4 py-4 text-sm text-slate-700"><StatusBadge status={payment.status} /></td>
                <td className="px-4 py-4 text-sm text-slate-700"><p>{formatDateTime(payment.createdAt)}</p><p className="text-slate-500">{payment.paidAt ? `Paid ${formatDateTime(payment.paidAt)}` : "Not paid"}</p></td>
                <td className="px-4 py-4 text-sm text-slate-700"><form action={updatePaymentStatusAction} className="flex flex-wrap gap-2"><input type="hidden" name="paymentId" value={payment.id} /><select name="status" defaultValue={payment.status} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold"><option value="PENDING">Pending</option><option value="PAID">Paid</option><option value="FAILED">Failed</option><option value="CANCELLED">Cancelled</option><option value="REFUNDED">Refunded</option></select><button type="submit" className="rounded-xl bg-brand-600 px-3 py-2 text-sm font-black text-white transition hover:bg-brand-700">Save</button></form></td>
              </tr>
            )) : <tr><td colSpan={7} className="px-5 py-12 text-center text-sm font-semibold text-slate-500">No payments found.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
