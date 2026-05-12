"use client";

export default function SearchError({ reset }: { reset: () => void }) {
  return (
    <section className="bg-[#F6F9FC] py-16">
      <div className="mx-auto max-w-xl px-4 text-center">
        <div className="rounded-[28px] border border-[#E5EAF2] bg-white p-8 shadow-[0_16px_42px_rgba(15,23,42,0.08)]">
          <h1 className="font-[family-name:var(--font-heading)] text-2xl font-black text-[#071A33]">
            Không thể tải chuyến xe
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#64748B]">
            Vui lòng thử lại. Nếu lỗi còn tiếp diễn, hãy đổi ngày đi hoặc bỏ bớt bộ lọc.
          </p>
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-2xl bg-[#FF6A1A] px-5 py-3 text-sm font-black text-white shadow-[0_12px_26px_rgba(255,106,26,0.22)]"
          >
            Thử lại
          </button>
        </div>
      </div>
    </section>
  );
}
