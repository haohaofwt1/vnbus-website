import { createTripAction, updateTripAction } from "@/lib/actions/admin-trips";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm";

function toDatetimeLocal(value?: Date | string) {
  if (!value) return "";
  return new Date(value).toISOString().slice(0, 16);
}

type TripFormProps = {
  trip?: {
    id: string;
    routeId: string;
    operatorId: string;
    vehicleTypeId: string;
    departureTime: Date;
    arrivalTime: Date;
    duration: number;
    price: number;
    currency: string;
    pickupPoint: string;
    dropoffPoint: string;
    availableSeats: number;
    amenities: string[];
    status: string;
  };
  routes: Array<{
    id: string;
    slug: string;
    fromCity: { name: string };
    toCity: { name: string };
  }>;
  operators: Array<{
    id: string;
    name: string;
  }>;
  vehicleTypes: Array<{
    id: string;
    name: string;
  }>;
  defaultRouteId?: string;
};

export function TripForm({
  trip,
  routes,
  operators,
  vehicleTypes,
  defaultRouteId,
}: TripFormProps) {
  const action = trip ? updateTripAction : createTripAction;

  return (
    <form action={action} className="card-surface space-y-6 p-6">
      {trip ? <input type="hidden" name="id" value={trip.id} /> : null}

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Tuyến</span>
          <select
            name="routeId"
            defaultValue={trip?.routeId ?? defaultRouteId}
            className={inputClass}
            required
          >
            <option value="">Chọn tuyến</option>
            {routes.map((route) => (
              <option key={route.id} value={route.id}>
                {route.fromCity.name} → {route.toCity.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Nhà xe</span>
          <select
            name="operatorId"
            defaultValue={trip?.operatorId}
            className={inputClass}
            required
          >
            <option value="">Chọn nhà xe</option>
            {operators.map((operator) => (
              <option key={operator.id} value={operator.id}>
                {operator.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Loại xe</span>
          <select
            name="vehicleTypeId"
            defaultValue={trip?.vehicleTypeId}
            className={inputClass}
            required
          >
            <option value="">Chọn loại xe</option>
            {vehicleTypes.map((vehicleType) => (
              <option key={vehicleType.id} value={vehicleType.id}>
                {vehicleType.name}
              </option>
            ))}
          </select>
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Giờ khởi hành</span>
          <input
            type="datetime-local"
            name="departureTime"
            defaultValue={toDatetimeLocal(trip?.departureTime)}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Giờ đến</span>
          <input
            type="datetime-local"
            name="arrivalTime"
            defaultValue={toDatetimeLocal(trip?.arrivalTime)}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Thời lượng (phút)</span>
          <input
            type="number"
            name="duration"
            defaultValue={trip?.duration}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Giá vé</span>
          <input
            type="number"
            name="price"
            defaultValue={trip?.price}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Tiền tệ</span>
          <input
            name="currency"
            defaultValue={trip?.currency ?? "VND"}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Số chỗ còn lại</span>
          <input
            type="number"
            name="availableSeats"
            defaultValue={trip?.availableSeats}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2 lg:col-span-2 xl:col-span-1">
          <span className="text-sm font-medium text-slate-700">Trạng thái</span>
          <select name="status" defaultValue={trip?.status ?? "ACTIVE"} className={inputClass}>
            <option value="ACTIVE">Đang bán</option>
            <option value="SOLD_OUT">Hết chỗ</option>
            <option value="CANCELLED">Đã hủy</option>
            <option value="DRAFT">Nháp</option>
          </select>
        </label>
      </div>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Điểm đón</span>
        <input
          name="pickupPoint"
          defaultValue={trip?.pickupPoint}
          className={inputClass}
          minLength={3}
          placeholder="Ví dụ: Văn phòng trung tâm Huế"
          required
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Điểm trả</span>
        <input
          name="dropoffPoint"
          defaultValue={trip?.dropoffPoint}
          className={inputClass}
          minLength={3}
          placeholder="Ví dụ: Bến xe trung tâm Phong Nha"
          required
        />
      </label>

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">
          Tiện ích (ngăn cách bằng dấu phẩy)
        </span>
        <textarea
          name="amenities"
          rows={4}
          defaultValue={trip?.amenities.join(", ")}
          className={inputClass}
          required
        />
      </label>

      <button
        type="submit"
        className="inline-flex rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        {trip ? "Cập nhật chuyến xe" : "Tạo chuyến xe"}
      </button>
    </form>
  );
}
