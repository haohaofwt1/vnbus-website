"use client";

import { translateAdminText, useAdminLocale } from "@/components/admin/admin-i18n";

type AdminLocalizedSelectOption = {
  value: string;
  label: string;
};

export function AdminLocalizedSelect({
  name,
  defaultValue,
  options,
  className,
  required,
}: {
  name: string;
  defaultValue?: string;
  options: AdminLocalizedSelectOption[];
  className?: string;
  required?: boolean;
}) {
  const locale = useAdminLocale();

  return (
    <select name={name} defaultValue={defaultValue} className={className} required={required}>
      {options.map((option) => (
        <option key={`${name}:${option.value}`} value={option.value}>
          {translateAdminText(locale, option.label)}
        </option>
      ))}
    </select>
  );
}
