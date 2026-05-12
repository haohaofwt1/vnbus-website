"use client";

import Image from "next/image";
import { useId, useState, useTransition } from "react";

type AdminImageUploadFieldProps = {
  name: string;
  label: string;
  defaultValue?: string;
  folder?: "branding" | "operators" | "cities" | "routes" | "vehicles" | "blog";
  required?: boolean;
  hint?: string;
};

export function AdminImageUploadField({
  name,
  label,
  defaultValue = "",
  folder = "branding",
  required = false,
  hint,
}: AdminImageUploadFieldProps) {
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const inputId = useId();

  function handleUpload(file: File | null) {
    if (!file) {
      return;
    }

    setError(null);

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", folder);

        const response = await fetch("/api/admin/uploads", {
          method: "POST",
          body: formData,
        });

        const result = (await response.json()) as { url?: string; error?: string };

        if (!response.ok || !result.url) {
          setError(result.error ?? "Upload failed.");
          return;
        }

        setValue(result.url);
      } catch {
        setError("Upload failed.");
      }
    });
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
        <label className="inline-flex cursor-pointer items-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-200 hover:text-brand-700">
          {isPending ? "Uploading..." : "Upload image"}
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/svg+xml"
            className="sr-only"
            onChange={(event) => handleUpload(event.target.files?.[0] ?? null)}
          />
        </label>
      </div>

      <input
        id={inputId}
        name={name}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm"
        required={required}
      />

      {hint ? <p className="text-xs text-slate-500">{hint}</p> : null}
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        <div className="relative flex h-40 items-center justify-center">
          {value ? (
            <Image
              src={value}
              alt={label}
              fill
              className="object-contain"
              sizes="320px"
            />
          ) : (
            <span className="text-sm text-slate-400">No image selected</span>
          )}
        </div>
      </div>
    </div>
  );
}
