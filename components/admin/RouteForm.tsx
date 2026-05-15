import { createRouteAction, updateRouteAction } from "@/lib/actions/admin-routes";
import { AdminImageUploadField } from "./AdminImageUploadField";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm";

function jsonTextareaValue(value: unknown) {
  if (!value) return "[]";
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2);
}

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
    commonRoad?: string;
    routePolyline?: string;
    borderCheckpointName?: string;
    borderCheckpointLatitude?: number | null;
    borderCheckpointLongitude?: number | null;
    travelAdvisory?: string;
    landmarkMarkers?: unknown;
    trafficStatus?: string;
    trafficDelayMinutes?: number;
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

      <section className="rounded-[1.5rem] border border-slate-200 bg-white p-5">
        <div>
          <h2 className="font-[family-name:var(--font-heading)] text-xl font-bold text-ink">
            Dữ liệu bản đồ hành trình
          </h2>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Dùng cho 3D Journey Map, bản đồ lớn và thông tin tuyến. Có thể để trống, frontend sẽ dùng fallback an toàn.
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Đường phổ biến / route badge</span>
            <input
              name="commonRoad"
              defaultValue={route?.commonRoad}
              className={inputClass}
              placeholder="Ví dụ: QL1A, AH16"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Trạng thái giao thông</span>
            <input
              name="trafficStatus"
              defaultValue={route?.trafficStatus}
              className={inputClass}
              placeholder="Ví dụ: Bình thường, Có thể chậm tại cửa khẩu"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Delay dự kiến (phút)</span>
            <input
              type="number"
              name="trafficDelayMinutes"
              defaultValue={route?.trafficDelayMinutes ?? 0}
              min={0}
              className={inputClass}
            />
          </label>
        </div>

        <label className="mt-4 block space-y-2">
          <span className="text-sm font-medium text-slate-700">Route polyline thật</span>
          <textarea
            name="routePolyline"
            rows={4}
            defaultValue={route?.routePolyline}
            className={inputClass}
            placeholder="Encoded polyline hoặc GeoJSON/polyline string từ Mapbox/Google/OSRM"
          />
        </label>

        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Cửa khẩu / checkpoint</span>
            <input
              name="borderCheckpointName"
              defaultValue={route?.borderCheckpointName}
              className={inputClass}
              placeholder="Ví dụ: Lao Bảo - Dansavanh"
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Checkpoint latitude</span>
            <input
              type="text"
              inputMode="decimal"
              name="borderCheckpointLatitude"
              defaultValue={route?.borderCheckpointLatitude ?? ""}
              className={inputClass}
              placeholder="16.626..."
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Checkpoint longitude</span>
            <input
              type="text"
              inputMode="decimal"
              name="borderCheckpointLongitude"
              defaultValue={route?.borderCheckpointLongitude ?? ""}
              className={inputClass}
              placeholder="106.590..."
            />
          </label>
        </div>

        <label className="mt-4 block space-y-2">
          <span className="text-sm font-medium text-slate-700">Travel advisory theo tuyến</span>
          <textarea
            name="travelAdvisory"
            rows={4}
            defaultValue={route?.travelAdvisory}
            className={inputClass}
            placeholder="Ví dụ: Khách đi Lào nên kiểm tra hộ chiếu/visa và có mặt sớm hơn tại điểm đón."
          />
        </label>

        <label className="mt-4 block space-y-2">
          <span className="text-sm font-medium text-slate-700">Landmark markers (JSON array)</span>
          <textarea
            name="landmarkMarkers"
            rows={7}
            defaultValue={jsonTextareaValue(route?.landmarkMarkers)}
            className={`${inputClass} font-mono text-xs`}
            placeholder='[{"name":"Lao Bao Border Gate","lat":16.626,"lng":106.59,"type":"border","imageUrl":""}]'
          />
          <span className="block text-xs leading-5 text-slate-500">
            Mỗi marker nên có name, lat, lng, type, imageUrl. Field này lưu JSON để sau này map thật dùng trực tiếp.
          </span>
        </label>
      </section>

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
