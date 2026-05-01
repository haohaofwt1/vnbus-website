"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CheckSquare, Trash2, X } from "lucide-react";
import { AdminConfirmDialog } from "@/components/admin/AdminConfirmDialog";
import { formatAdminTemplate, useAdminCopy } from "@/components/admin/admin-i18n";
import { bulkDeleteAdminRecordsAction } from "@/lib/actions/admin-bulk-delete";

type BulkDeleteEntity =
  | "trips"
  | "routes"
  | "operators"
  | "vehicles"
  | "cities"
  | "payments"
  | "promotions";

function getRows(selectionName: string) {
  return Array.from(document.querySelectorAll<HTMLInputElement>(`input[data-admin-bulk-row="${selectionName}"]`));
}

function getSelectAllControls(selectionName: string) {
  return Array.from(document.querySelectorAll<HTMLInputElement>(`input[data-admin-bulk-select-all="${selectionName}"]`));
}

function syncSelectAll(selectionName: string, rows: HTMLInputElement[], selectedCount: number) {
  getSelectAllControls(selectionName).forEach((control) => {
    control.checked = rows.length > 0 && selectedCount === rows.length;
    control.indeterminate = selectedCount > 0 && selectedCount < rows.length;
  });
}

export function AdminBulkDeleteBar({
  entity,
  entityLabel,
  selectionName,
  totalOnPage,
  returnTo,
}: {
  entity: BulkDeleteEntity;
  entityLabel: string;
  selectionName: string;
  totalOnPage: number;
  returnTo: string;
}) {
  const copy = useAdminCopy();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const selectedCount = selectedIds.length;
  const hiddenInputs = useMemo(() => selectedIds.map((id) => <input key={id} type="hidden" name="ids" value={id} />), [selectedIds]);
  const localizedEntity = selectedCount === 1
    ? copy.entities[entity] ?? entityLabel
    : copy.entityPlurals[entity] ?? entityLabel;

  const syncSelection = useCallback(() => {
    const rows = getRows(selectionName);
    const nextIds = rows.filter((row) => row.checked && row.value).map((row) => row.value);
    syncSelectAll(selectionName, rows, nextIds.length);
    setSelectedIds(nextIds);
  }, [selectionName]);

  const setRowsChecked = (checked: boolean) => {
    const rows = getRows(selectionName);
    rows.forEach((row) => {
      row.checked = checked;
    });
    syncSelectAll(selectionName, rows, checked ? rows.length : 0);
    setSelectedIds(checked ? rows.map((row) => row.value).filter(Boolean) : []);
  };

  useEffect(() => {
    const handleChange = (event: Event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;
      if (target.dataset.adminBulkSelectAll === selectionName) {
        getRows(selectionName).forEach((row) => {
          row.checked = target.checked;
        });
      }
      if (target.dataset.adminBulkRow === selectionName || target.dataset.adminBulkSelectAll === selectionName) {
        syncSelection();
      }
    };

    document.addEventListener("change", handleChange);
    return () => document.removeEventListener("change", handleChange);
  }, [selectionName, syncSelection]);

  return (
    <form action={bulkDeleteAdminRecordsAction} className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
      <input type="hidden" name="entity" value={entity} />
      <input type="hidden" name="returnTo" value={returnTo} />
      {hiddenInputs}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
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

        <div className="lg:ml-auto">
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
        body={formatAdminTemplate(copy.bulk.deleteBody, { count: selectedCount, entity: localizedEntity })}
        detail={copy.bulk.cannotUndo}
        cancelLabel={copy.bulk.cancel}
        confirmLabel={copy.bulk.confirmDelete}
        pendingLabel={copy.bulk.deleting}
        onClose={() => setConfirmOpen(false)}
      />
    </form>
  );
}
