"use client";

import { useFormStatus } from "react-dom";
import { AlertTriangle, X } from "lucide-react";

export function AdminConfirmDialog({
  open,
  title,
  body,
  detail,
  cancelLabel,
  confirmLabel,
  pendingLabel,
  confirmName,
  confirmValue,
  onClose,
}: {
  open: boolean;
  title: string;
  body: string;
  detail?: string;
  cancelLabel: string;
  confirmLabel: string;
  pendingLabel: string;
  confirmName?: string;
  confirmValue?: string;
  onClose: () => void;
}) {
  const { pending } = useFormStatus();

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-6">
      <button
        type="button"
        aria-label={cancelLabel}
        className="absolute inset-0 bg-slate-950/45 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <div className="flex items-start gap-4 border-b border-slate-100 p-5">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-rose-50 text-rose-700 ring-1 ring-rose-100">
            <AlertTriangle className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-black text-ink">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
            {detail ? <p className="mt-2 text-sm font-semibold text-rose-700">{detail}</p> : null}
          </div>
          <button
            type="button"
            aria-label={cancelLabel}
            className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-ink"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex flex-col-reverse gap-2 bg-slate-50 px-5 py-4 sm:flex-row sm:justify-end">
          <button
            type="button"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-sm font-black text-slate-700 transition hover:bg-slate-50"
            onClick={onClose}
            disabled={pending}
          >
            {cancelLabel}
          </button>
          <button
            type="submit"
            name={confirmName}
            value={confirmValue}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-rose-600 px-4 text-sm font-black text-white shadow-[0_12px_26px_rgba(225,29,72,0.22)] transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={pending}
          >
            {pending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
