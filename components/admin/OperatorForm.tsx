import { createOperatorAction, updateOperatorAction } from "@/lib/actions/admin-operators";
import { AdminImageUploadField } from "./AdminImageUploadField";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm";

type OperatorFormProps = {
  operator?: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string;
    description: string;
    rating: number;
    verified: boolean;
    contactEmail: string;
    contactPhone: string;
    website: string;
    status: string;
  };
};

export function OperatorForm({ operator }: OperatorFormProps) {
  const action = operator ? updateOperatorAction : createOperatorAction;

  return (
    <form action={action} className="card-surface space-y-6 p-6">
      {operator ? <input type="hidden" name="id" value={operator.id} /> : null}
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Tên nhà xe</span>
          <input name="name" defaultValue={operator?.name} className={inputClass} required />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Slug</span>
          <input name="slug" defaultValue={operator?.slug} className={inputClass} required />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Đánh giá</span>
          <input
            type="number"
            step="0.1"
            min={0}
            max={5}
            name="rating"
            defaultValue={operator?.rating}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Email liên hệ</span>
          <input
            type="email"
            name="contactEmail"
            defaultValue={operator?.contactEmail}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Số điện thoại liên hệ</span>
          <input
            name="contactPhone"
            defaultValue={operator?.contactPhone}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2 lg:col-span-2">
          <span className="text-sm font-medium text-slate-700">Website</span>
          <input
            name="website"
            defaultValue={operator?.website}
            className={inputClass}
            required
          />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-medium text-slate-700">Trạng thái</span>
          <select name="status" defaultValue={operator?.status ?? "ACTIVE"} className={inputClass}>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="DRAFT">Nháp</option>
            <option value="ARCHIVED">Lưu trữ</option>
          </select>
        </label>
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
          <input type="checkbox" name="verified" defaultChecked={operator?.verified} />
          <span>Nhà xe đã xác minh</span>
        </label>
      </div>

      <AdminImageUploadField
        name="logoUrl"
        label="Logo hoặc ảnh nhà xe"
        defaultValue={operator?.logoUrl}
        folder="operators"
        required
        hint="Ảnh này hiển thị trên kết quả tìm kiếm, card nhà xe và trang chi tiết nhà xe."
      />

      <label className="block space-y-2">
        <span className="text-sm font-medium text-slate-700">Mô tả</span>
        <textarea
          name="description"
          rows={6}
          defaultValue={operator?.description}
          className={inputClass}
          required
        />
      </label>

      <button
        type="submit"
        className="inline-flex rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
      >
        {operator ? "Cập nhật nhà xe" : "Tạo nhà xe"}
      </button>
    </form>
  );
}
