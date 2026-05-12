"use client";

export default function VehiclesError({ reset }: { reset: () => void }) {
  return (
    <section className="bg-[#F6F9FC] py-12">
      <div className="mx-auto max-w-[760px] px-4 text-center">
        <div className="rounded-[28px] border border-[#E5EAF2] bg-white p-8 shadow-[0_14px_36px_rgba(15,23,42,0.06)]">
          <h1 className="font-[family-name:var(--font-heading)] text-3xl font-black text-[#071A33]">Không thể tải danh sách loại xe</h1>
          <p className="mt-3 text-sm leading-6 text-[#64748B]">Vui lòng thử lại. Nếu lỗi vẫn xảy ra, dữ liệu loại xe hoặc kết nối database cần được kiểm tra.</p>
          <button type="button" onClick={reset} className="mt-5 rounded-2xl bg-[#FF6A1A] px-5 py-3 text-sm font-black text-white">
            Thử lại
          </button>
        </div>
      </div>
    </section>
  );
}
