"use client";

import { ActionMessage } from "@/components/admin/ActionMessage";
import { formatAdminTemplate, useAdminCopy } from "@/components/admin/admin-i18n";

export function BookingBulkResultMessage({
  updated,
  deleted,
  error,
}: {
  updated?: string;
  deleted?: string;
  error?: string;
}) {
  const copy = useAdminCopy();
  const entity = deleted === "1" || updated === "1" ? copy.entities.bookings : copy.entityPlurals.bookings;

  if (updated) {
    return <ActionMessage type="success" message={formatAdminTemplate(copy.bulk.updated, { count: updated, entity })} />;
  }

  if (deleted) {
    return <ActionMessage type="success" message={formatAdminTemplate(copy.bulk.deleted, { count: deleted, entity })} />;
  }

  if (error === "select") {
    return <ActionMessage type="error" message={formatAdminTemplate(copy.bulk.noSelection, { entity })} />;
  }

  if (error) {
    return <ActionMessage type="error" message={copy.bulk.failed} />;
  }

  return null;
}
