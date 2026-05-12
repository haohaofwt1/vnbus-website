export default function VehiclesLoading() {
  return (
    <section className="bg-[#F6F9FC] py-10 sm:py-12">
      <div className="mx-auto max-w-[1180px] space-y-6 px-4 sm:px-6 lg:px-8">
        <div className="h-36 animate-pulse rounded-[28px] bg-white" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-24 animate-pulse rounded-[24px] bg-white" />)}
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-96 animate-pulse rounded-[24px] bg-white" />)}
        </div>
      </div>
    </section>
  );
}
