export default function SearchLoading() {
  return (
    <section className="bg-[linear-gradient(180deg,#f7fbff_0%,#ffffff_58%)] py-5 sm:py-7">
      <div className="mx-auto max-w-[1280px] space-y-7 px-4 sm:px-6 lg:px-8">
        <div className="h-24 animate-pulse rounded-[24px] border border-[#E5EAF2] bg-white shadow-[0_16px_42px_rgba(15,23,42,0.08)]" />
        <div className="grid gap-5 lg:grid-cols-[270px_1fr]">
          <div className="hidden h-[520px] animate-pulse rounded-[24px] border border-[#E5EAF2] bg-white lg:block" />
          <div className="space-y-4">
            <div className="h-40 animate-pulse rounded-[24px] border border-[#E5EAF2] bg-white" />
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-64 animate-pulse rounded-[24px] border border-[#E5EAF2] bg-white" />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
