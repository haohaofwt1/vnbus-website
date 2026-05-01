"use client";

import { ActionMessage } from "@/components/admin/ActionMessage";
import { formatAdminTemplate, useAdminCopy } from "@/components/admin/admin-i18n";

function resolveEntityKey(label: string) {
  if (label === "trip") return "trips";
  if (label === "route") return "routes";
  if (label === "operator") return "operators";
  if (label === "vehicle type") return "vehicles";
  if (label === "city") return "cities";
  if (label === "payment") return "payments";
  if (label === "promotion") return "promotions";
  if (label === "booking") return "bookings";
  return label;
}

export function AdminBulkResultMessage({
  deleted,
  error,
  label,
}: {
  deleted?: string;
  error?: string;
  label: string;
}) {
  const copy = useAdminCopy();
  const entityKey = resolveEntityKey(label);
  const entity = deleted === "1"
    ? copy.entities[entityKey] ?? label
    : copy.entityPlurals[entityKey] ?? label;

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
