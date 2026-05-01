"use client";

import { useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { CheckSquare, Trash2, X } from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { formatAdminTemplate, translateAdminStatus, useAdminCopy, useAdminLocale } from "@/components/admin/admin-i18n";

const bookingStatusOptions = [
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "PENDING_PAYMENT", label: "Pending payment" },
  { value: "PAID", label: "Paid" },
  { value: "FAILED", label: "Failed" },
  { value: "CONFIRMED", label: "Confirmed" },
  { value: "CANCELLED", label: "Cancelled" },
  { value: "REFUNDED", label: "Refunded" },
  { value: "COMPLETED", label: "Completed" },
];

function getBulkForm() {
  return document.getElementById("booking-bulk-form") as HTMLFormElement | null;
}

function getRowCheckboxes(form: HTMLFormElement) {
  return Array.from(form.querySelectorAll<HTMLInputElement>('input[data-booking-bulk-row="true"]'));
}

function syncSelectAll(form: HTMLFormElement, rows: HTMLInputElement[], selectedCount: number) {
  const selectAll = form.querySelector<HTMLInputElement>('input[data-booking-bulk-select-all="true"]');
  if (!selectAll) return;
  selectAll.checked = rows.length > 0 && selectedCount === rows.length;
  selectAll.indeterminate = selectedCount > 0 && selectedCount < rows.length;
}

function BulkSubmitButtons({ selectedCount }: { selectedCount: number }) {
  const copy = useAdminCopy();
  const { pending } = useFormStatus();
  const disabled = pending || selectedCount === 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="submit"
        name="bulkAction"
        value="status"
        disabled={disabled}
        className="inline-flex h-10 items-center justify-center rounded-xl bg-brand-600 px-4 text-sm font-black text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-45"
      >
        {pending ? copy.bookingsBulk.updating : copy.bookingsBulk.updateStatus}
      </button>
    </div>
  );
}

export function BookingBulkActions({
  totalOnPage,
  returnTo,
}: {
  totalOnPage: number;
  returnTo: string;
}) {
  const copy = useAdminCopy();
  const locale = useAdminLocale();
  const [selectedCount, setSelectedCount] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const bookingEntity = selectedCount === 1 ? copy.entities.bookings : copy.entityPlurals.bookings;

  const syncSelection = () => {
    const form = getBulkForm();
    if (!form) return;
    const rows = getRowCheckboxes(form);
    const nextSelectedCount = rows.filter((row) => row.checked).length;
    syncSelectAll(form, rows, nextSelectedCount);
    setSelectedCount(nextSelectedCount);
  };

  const setRowsChecked = (checked: boolean) => {
    const form = getBulkForm();
    if (!form) return;
    const rows = getRowCheckboxes(form);
    rows.forEach((row) => {
      row.checked = checked;
    });
    syncSelectAll(form, rows, checked ? rows.length : 0);
    setSelectedCount(checked ? rows.length : 0);
  };

  useEffect(() => {
    const form = getBulkForm();
    if (!form) return;

    const handleChange = (event: Event) => {
      const target = event.target;
      if (target instanceof HTMLInputElement && target.dataset.bookingBulkSelectAll === "true") {
        getRowCheckboxes(form).forEach((row) => {
          row.checked = target.checked;
        });
      }
      syncSelection();
    };

    form.addEventListener("change", handleChange);
    return () => form.removeEventListener("change", handleChange);
  }, [totalOnPage]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <input type="hidden" name="returnTo" value={returnTo} />
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <div className="flex min-w-[190px] items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
            <CheckSquare className="h-5 w-5" />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-black text-ink">{selectedCount} {copy.bulk.selected}</p>
            <p className="text-xs font-semibold text-slate-500">{totalOnPage} {copy.bulk.visibleOnPage}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
            onClick={() => setRowsChecked(true)}
            disabled={totalOnPage === 0 || selectedCount === totalOnPage}
          >
            {copy.bulk.selectAllVisible}
          </button>
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-45"
            onClick={() => setRowsChecked(false)}
            disabled={selectedCount === 0}
          >
            <X className="h-4 w-4" />
            {copy.bulk.clear}
          </button>
        </div>

        <div className="grid min-w-0 flex-1 gap-2 md:grid-cols-[220px_1fr]">
          <select
            name="status"
            defaultValue="CONTACTED"
            className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-cyan-100"
          >
            {bookingStatusOptions.map((status) => (
              <option key={status.value} value={status.value}>{translateAdminStatus(locale, status.value, status.label)}</option>
            ))}
          </select>
          <input
            name="note"
            placeholder={copy.bookingsBulk.optionalNote}
            className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm font-semibold text-slate-800 outline-none focus:border-brand-500 focus:ring-2 focus:ring-cyan-100"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <BulkSubmitButtons selectedCount={selectedCount} />
          <button
            type="button"
            disabled={selectedCount === 0}
            onClick={() => setConfirmOpen(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 text-sm font-black text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Trash2 className="h-4 w-4" />
            {copy.bulk.delete}
          </button>
        </div>
      </div>
      <AdminConfirmDialog
        open={confirmOpen}
        title={copy.bulk.deleteTitle}
        body={formatAdminTemplate(copy.bulk.deleteBody, { count: selectedCount, entity: bookingEntity })}
        detail={copy.bulk.cannotUndo}
        cancelLabel={copy.bulk.cancel}
        confirmLabel={copy.bulk.confirmDelete}
        pendingLabel={copy.bulk.deleting}
        confirmName="bulkAction"
        confirmValue="delete"
        onClose={() => setConfirmOpen(false)}
      />
    </div>
  );
}
