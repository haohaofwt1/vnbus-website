export default function OperatorsLoading() {
  return (
    <section className="bg-[#F6F9FC] py-10 sm:py-12">
      <div className="mx-auto max-w-[1180px] space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          <div className="h-4 w-32 animate-pulse rounded-full bg-slate-200" />
          <div className="h-12 w-full max-w-xl animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-5 w-full max-w-2xl animate-pulse rounded-full bg-slate-200" />
        </div>
        <div className="h-20 animate-pulse rounded-[24px] border border-[#E5EAF2] bg-white" />
        <div className="h-28 animate-pulse rounded-[24px] border border-[#E5EAF2] bg-white" />
        <div className="grid gap-5 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-80 animate-pulse rounded-[24px] border border-[#E5EAF2] bg-white" />
          ))}
        </div>
      </div>
    </section>
  );
}
