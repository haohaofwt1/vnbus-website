import {
  createReviewAction,
  deleteReviewAction,
  updateReviewAction,
} from "@/lib/actions/admin-reviews";

const inputClass =
  "w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm";

type ReviewFormProps = {
  review?: {
    id: string;
    bookingRequestId: string | null;
    routeId: string | null;
    operatorId: string | null;
    customerName: string;
    rating: number;
    comment: string;
    status: string;
  };
  routes: Array<{
    id: string;
    fromCity: { name: string };
    toCity: { name: string };
  }>;
  operators: Array<{
    id: string;
    name: string;
  }>;
  bookingRequests: Array<{
    id: string;
    customerName: string;
    fromCity: string;
    toCity: string;
    status: string;
    review?: {
      id: string;
    } | null;
  }>;
};

export function ReviewForm({ review, routes, operators, bookingRequests }: ReviewFormProps) {
  const action = review ? updateReviewAction : createReviewAction;

  return (
    <div className="space-y-6">
      <form action={action} className="card-surface space-y-6 p-6">
        {review ? <input type="hidden" name="id" value={review.id} /> : null}

        <div>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl font-bold text-ink">
            {review ? "Edit review" : "Add review"}
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Published reviews appear publicly. Pending reviews wait for approval. Hidden reviews stay private.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
          <label className="space-y-2 lg:col-span-2 xl:col-span-4">
            <span className="text-sm font-medium text-slate-700">Booking request</span>
            <select
              name="bookingRequestId"
              defaultValue={review?.bookingRequestId ?? ""}
              className={inputClass}
            >
              <option value="">Not linked to a booking</option>
              {bookingRequests.map((booking) => (
                <option key={booking.id} value={booking.id}>
                  {booking.customerName} · {booking.fromCity} to {booking.toCity} · {booking.status}
                  {booking.review && booking.review.id !== review?.id ? " · already linked" : ""}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Route</span>
            <select name="routeId" defaultValue={review?.routeId ?? ""} className={inputClass}>
              <option value="">None</option>
              {routes.map((route) => (
                <option key={route.id} value={route.id}>
                  {route.fromCity.name} to {route.toCity.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Operator</span>
            <select name="operatorId" defaultValue={review?.operatorId ?? ""} className={inputClass}>
              <option value="">None</option>
              {operators.map((operator) => (
                <option key={operator.id} value={operator.id}>
                  {operator.name}
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Customer name</span>
            <input
              name="customerName"
              defaultValue={review?.customerName}
              className={inputClass}
              required
            />
          </label>
          <label className="space-y-2">
            <span className="text-sm font-medium text-slate-700">Rating</span>
            <select name="rating" defaultValue={review?.rating ?? 5} className={inputClass}>
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} / 5
                </option>
              ))}
            </select>
          </label>
          <label className="space-y-2 lg:col-span-2 xl:col-span-1">
            <span className="text-sm font-medium text-slate-700">Status</span>
            <select name="status" defaultValue={review?.status ?? "PENDING"} className={inputClass}>
              <option value="PUBLISHED">Published</option>
              <option value="PENDING">Pending</option>
              <option value="HIDDEN">Hidden</option>
            </select>
          </label>
        </div>

        <label className="block space-y-2">
          <span className="text-sm font-medium text-slate-700">Comment</span>
          <textarea
            name="comment"
            rows={5}
            defaultValue={review?.comment}
            className={inputClass}
            required
          />
        </label>

        <button
          type="submit"
          className="inline-flex rounded-2xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
        >
          {review ? "Update review" : "Create review"}
        </button>
      </form>

      {review ? (
        <div className="card-surface p-6">
          <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold text-ink">
            Danger zone
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Delete permanently removes this review from admin and public pages.
          </p>
          <form action={deleteReviewAction} className="mt-4">
            <input type="hidden" name="id" value={review.id} />
            <button
              type="submit"
              className="inline-flex rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
            >
              Delete review
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
