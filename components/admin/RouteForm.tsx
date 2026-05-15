import { createRouteAction, updateRouteAction } from "@/lib/actions/admin-routes";
import { AdminImageUploadField } from "./AdminImageUploadField";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm";

type RouteFormProps = {
  route?: {
    id: string;
    slug: string;
    fromCityId: string;
    toCityId: string;
    countryFrom: string;
    countryTo: string;
    isInternational: boolean;
    distanceKm: number;
    estimatedDuration: string;
    priceFrom: number;
    currency: string;
    imageUrl: string;
    shortDescription: string;
    longDescription: string;
    luggageNotes?: string;
    policyNotes?: string;
    seoTitle: string;
    seoDescription: string;
    status: string;
  };
  cities: Array<{
    id: string;
    name: string;
  }>;
};

export function RouteForm({ route, cities }: RouteFormProps) {
  const action = route ? updateRouteAction : createRouteAction;

  return (
    <form action={action} className="card-surface space-y-6 p-6">
      {route ? <input type="hidden" name="id" value={route.id} /> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Slug</span>
          <input name="slug" defaultValue={route?.slug} className={inputClass} required />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Điểm đi</span>
          <select
            name="fromCityId"
            defaultValue={route?.fromCityId}
            className={inputClass}
            required
          >
            <option value="">Chọn thành phố</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Điểm đến</span>
          <select
            name="toCityId"
            defaultValue={route?.toCityId}
            className={inputClass}
            required
          >
            <option value="">Chọn thành phố</option>
            {cities.map((city) => (
              <option key={city.id} value={city.id}>
                {city.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Quốc gia đi</span>
          <input
            name="countryFrom"
            defaultValue={route?.countryFrom}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Quốc gia đến</span>
          <input
            name="countryTo"
            defaultValue={route?.countryTo}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Trạng thái</span>
          <select name="status" defaultValue={route?.status ?? "ACTIVE"} className={inputClass}>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="DRAFT">Nháp</option>
            <option value="ARCHIVED">Lưu trữ</option>
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Khoảng cách (km)</span>
          <input
            type="number"
            name="distanceKm"
            defaultValue={route?.distanceKm}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Thời lượng dự kiến</span>
          <input
            name="estimatedDuration"
            defaultValue={route?.estimatedDuration}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Giá từ</span>
          <input
            type="number"
            name="priceFrom"
            defaultValue={route?.priceFrom}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Tiền tệ</span>
          <input
            name="currency"
            defaultValue={route?.currency ?? "VND"}
            className={inputClass}
            required
          />
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
          <input type="checkbox" name="isInternational" defaultChecked={route?.isInternational} />
          <span>Tuyến quốc tế</span>
        </label>
      </div>

      <AdminImageUploadField
        name="imageUrl"
        label="Ảnh tuyến"
        defaultValue={route?.imageUrl}
        folder="routes"
        hint="Ảnh này được dùng ưu tiên trên trang Tuyến xe. Nếu để trống, website sẽ dùng ảnh thành phố đến hoặc ảnh mặc định."
      />

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Mô tả ngắn</span>
        <textarea
          name="shortDescription"
          rows={3}
          defaultValue={route?.shortDescription}
          className={inputClass}
          required
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Mô tả chi tiết</span>
        <textarea
          name="longDescription"
          rows={8}
          defaultValue={route?.longDescription}
          className={inputClass}
          required
        />
      </label>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Hành lý & lưu ý trong popup chuyến</span>
          <textarea
            name="luggageNotes"
            rows={6}
            defaultValue={route?.luggageNotes}
            className={inputClass}
            placeholder="Mỗi dòng một lưu ý. Ví dụ: Hành lý tiêu chuẩn 1 vali + 1 túi xách..."
          />
        </label>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Chính sách trong popup chuyến</span>
          <textarea
            name="policyNotes"
            rows={6}
            defaultValue={route?.policyNotes}
            className={inputClass}
            placeholder="Mỗi dòng một chính sách. Ví dụ: Đổi/hủy tùy theo thời điểm khởi hành..."
          />
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Tiêu đề SEO</span>
          <input
            name="seoTitle"
            defaultValue={route?.seoTitle}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Mô tả SEO</span>
          <textarea
            name="seoDescription"
            rows={3}
            defaultValue={route?.seoDescription}
            className={inputClass}
            required
          />
        </label>
      </div>

      <button
        type="submit"
        className="inline-flex rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        {route ? "Cập nhật tuyến" : "Tạo tuyến"}
      </button>
    </form>
  );
}
