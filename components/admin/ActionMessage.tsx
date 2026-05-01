"use client";

import { translateAdminText, useAdminLocale } from "@/components/admin/admin-i18n";

type ActionMessageProps = {
  type: "success" | "error";
  message: string;
};

export function ActionMessage({ type, message }: ActionMessageProps) {
  const locale = useAdminLocale();

  return (
    <div
      className={`rounded-2xl border px-4 py-3 text-sm ${
        type === "success"
          ? "border-emerald-200 bg-emerald-50 text-emerald-800"
          : "border-rose-200 bg-rose-50 text-rose-800"
      }`}
    >
      {translateAdminText(locale, message)}
    </div>
  );
}
