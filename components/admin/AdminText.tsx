"use client";

import { translateAdminText, useAdminLocale } from "@/components/admin/admin-i18n";

export function AdminText({ text }: { text: string }) {
  const locale = useAdminLocale();
  return <>{translateAdminText(locale, text)}</>;
}
