type AdminImageThumbProps = {
  src?: string | null;
  alt: string;
  missingLabel?: string;
};

export function AdminImageThumb({ src, alt, missingLabel = "No image" }: AdminImageThumbProps) {
  if (!src) {
    return (
      <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-2xl border border-dashed border-amber-300 bg-amber-50 px-2 text-center text-[10px] font-black uppercase leading-3 tracking-[0.08em] text-amber-700">
        {missingLabel}
      </div>
    );
  }

  return (
    <div className="h-14 w-20 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 shadow-sm">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
    </div>
  );
}
