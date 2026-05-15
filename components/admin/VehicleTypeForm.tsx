import { createVehicleTypeAction, updateVehicleTypeAction } from "@/lib/actions/admin-vehicles";
import { AdminImageUploadField } from "@/components/admin/AdminImageUploadField";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm";

type VehicleTypeFormProps = {
  vehicleType?: {
    id: string;
    name: string;
    slug: string;
    description: string;
    subtitle: string;
    bestFor: string;
    imageUrl: string;
    featuredImageUrl: string;
    privacyScore: number;
    comfortScore: number;
    valueScore: number;
    passengerCapacity: number;
    amenities: string[];
  };
};

export function VehicleTypeForm({ vehicleType }: VehicleTypeFormProps) {
  const action = vehicleType ? updateVehicleTypeAction : createVehicleTypeAction;

  return (
    <form action={action} className="card-surface space-y-6 p-6">
      {vehicleType ? <input type="hidden" name="id" value={vehicleType.id} /> : null}

      <div className="grid gap-4 lg:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Tên loại xe</span>
          <input name="name" defaultValue={vehicleType?.name} className={inputClass} required />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Slug</span>
          <input name="slug" defaultValue={vehicleType?.slug} className={inputClass} required />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Sức chứa hành khách</span>
          <input
            type="number"
            min={1}
            name="passengerCapacity"
            defaultValue={vehicleType?.passengerCapacity}
            className={inputClass}
            required
          />
        </label>
      </div>

      <section className="rounded-3xl border border-blue-100 bg-blue-50/50 p-4">
        <div className="mb-4">
          <p className="eyebrow">Ảnh hiển thị public</p>
          <h2 className="mt-2 text-xl font-black text-ink">Ảnh cho loại xe này</h2>
          <p className="mt-1 text-sm leading-6 text-slate-600">
            Các ảnh này hiển thị trên trang /vehicles. Nếu để trống, frontend sẽ dùng hình minh họa tạm.
          </p>
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <AdminImageUploadField
            name="imageUrl"
            label="Ảnh card loại xe"
            folder="vehicles"
            defaultValue={vehicleType?.imageUrl}
            hint="Hiển thị trong card từng loại xe. Nên dùng tỷ lệ 4:3 hoặc 16:10."
          />
          <AdminImageUploadField
            name="featuredImageUrl"
            label="Ảnh lớn / đề xuất"
            folder="vehicles"
            defaultValue={vehicleType?.featuredImageUrl}
            hint="Hiển thị khi loại xe này được đề xuất nổi bật. Có thể để trống để dùng lại ảnh card."
          />
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Subtitle hiển thị public</span>
          <input
            name="subtitle"
            defaultValue={vehicleType?.subtitle}
            className={inputClass}
            placeholder="Ví dụ: Phù hợp 2 khách"
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Phù hợp với</span>
          <input
            name="bestFor"
            defaultValue={vehicleType?.bestFor}
            className={inputClass}
            placeholder="Ví dụ: Gia đình hoặc nhóm nhỏ"
          />
        </label>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="mb-4">
          <h2 className="text-base font-black text-ink">Chỉ số trải nghiệm</h2>
          <p className="mt-1 text-sm text-slate-500">
            Nhập 0 để trang public tự tính theo tên, tiện ích và giá. Nhập 1-5 nếu muốn kiểm soát thủ công.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Riêng tư</span>
            <input type="number" min={0} max={5} name="privacyScore" defaultValue={vehicleType?.privacyScore ?? 0} className={inputClass} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Thoải mái</span>
            <input type="number" min={0} max={5} name="comfortScore" defaultValue={vehicleType?.comfortScore ?? 0} className={inputClass} />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Giá tốt</span>
            <input type="number" min={0} max={5} name="valueScore" defaultValue={vehicleType?.valueScore ?? 0} className={inputClass} />
          </label>
        </div>
      </section>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Mô tả</span>
        <textarea
          name="description"
          rows={5}
          defaultValue={vehicleType?.description}
          className={inputClass}
          minLength={12}
          placeholder="Ví dụ: Cabin riêng tư, phù hợp hành trình đêm hoặc khách muốn không gian yên tĩnh."
          required
        />
        <span className="text-xs font-medium text-slate-500">
          Tối thiểu 12 ký tự. Mô tả này hiển thị trên trang Loại xe public.
        </span>
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Tiện ích</span>
        <textarea
          name="amenities"
          rows={4}
          defaultValue={vehicleType?.amenities.join(", ")}
          className={inputClass}
          placeholder="Máy lạnh, Nước uống, Sạc USB"
        />
        <span className="text-xs font-medium text-slate-500">
          Ngăn cách các tiện ích bằng dấu phẩy.
        </span>
      </label>

      <button
        type="submit"
        className="inline-flex rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        {vehicleType ? "Cập nhật loại xe" : "Tạo loại xe"}
      </button>
    </form>
  );
}
