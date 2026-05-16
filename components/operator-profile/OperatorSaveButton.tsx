"use client";

import { useSyncExternalStore } from "react";
import { Check, Heart } from "lucide-react";

type SavedOperator = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string;
  savedAt: string;
};

type OperatorSaveButtonProps = {
  operator: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string;
  };
  labels: {
    save: string;
    saved: string;
  };
};

const storageKey = "vnbus.savedOperators";
const storageChangedEvent = "vnbus:saved-operators-changed";

function readSavedOperators() {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(window.localStorage.getItem(storageKey) ?? "[]");
    return Array.isArray(parsed) ? (parsed as SavedOperator[]) : [];
  } catch {
    return [];
  }
}

function writeSavedOperators(items: SavedOperator[]) {
  window.localStorage.setItem(storageKey, JSON.stringify(items));
  window.dispatchEvent(new Event(storageChangedEvent));
}

function subscribeToSavedOperators(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(storageChangedEvent, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(storageChangedEvent, onStoreChange);
  };
}

export function OperatorSaveButton({ operator, labels }: OperatorSaveButtonProps) {
  const saved = useSyncExternalStore(
    subscribeToSavedOperators,
    () => readSavedOperators().some((item) => item.id === operator.id),
    () => false,
  );

  function toggleSaved() {
    const current = readSavedOperators();
    if (current.some((item) => item.id === operator.id)) {
      writeSavedOperators(current.filter((item) => item.id !== operator.id));
      return;
    }

    writeSavedOperators([
      {
        id: operator.id,
        name: operator.name,
        slug: operator.slug,
        logoUrl: operator.logoUrl,
        savedAt: new Date().toISOString(),
      },
      ...current,
    ]);
  }

  return (
    <button
      type="button"
      onClick={toggleSaved}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl border px-5 py-3 text-sm font-black transition ${
        saved
          ? "border-emerald-100 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
          : "border-[#D7E0EC] bg-white text-[#071A33] hover:bg-blue-50"
      }`}
      aria-pressed={saved}
    >
      {saved ? <Check className="h-4 w-4" /> : <Heart className="h-4 w-4 text-[#2563EB]" />}
      {saved ? labels.saved : labels.save}
    </button>
  );
}
