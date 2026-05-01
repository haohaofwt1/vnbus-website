import Link from "next/link";

type DataTableProps = {
  columns: Array<{
    key: string;
    label: React.ReactNode;
    align?: "left" | "right";
  }>;
  rows: Array<Record<string, React.ReactNode>>;
  emptyMessage: React.ReactNode;
  pagination?: {
    page: number;
    totalPages: number;
    basePath: string;
    query?: Record<string, string | undefined>;
  };
  selectable?: boolean;
  selectionName?: string;
  rowSelectionValues?: string[];
};

export function DataTable({
  columns,
  rows,
  emptyMessage,
  pagination,
  selectable = true,
  selectionName,
  rowSelectionValues,
}: DataTableProps) {
  const hasSelection = selectable && Boolean(selectionName && rowSelectionValues);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              {hasSelection ? (
                <th className="w-10 px-4 py-3 text-left">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-brand-600"
                    aria-label="Select all"
                    data-admin-bulk-select-all={selectionName}
                    data-booking-bulk-select-all="true"
                    disabled={!rows.length}
                  />
                </th>
              ) : null}
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`whitespace-nowrap px-4 py-3 text-xs font-black uppercase tracking-[0.16em] text-slate-500 ${
                    column.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {rows.length ? (
              rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="align-top transition hover:bg-blue-50/35">
                  {hasSelection ? (
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        name={selectionName}
                        value={rowSelectionValues?.[rowIndex] ?? ""}
                        className="h-4 w-4 rounded border-slate-300 text-brand-600"
                        aria-label={`Select row ${rowIndex + 1}`}
                        data-admin-bulk-row={selectionName}
                        data-booking-bulk-row="true"
                        disabled={!rowSelectionValues?.[rowIndex]}
                      />
                    </td>
                  ) : null}
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className={`px-4 py-4 text-sm text-slate-700 ${
                        column.align === "right" ? "text-right" : "text-left"
                      }`}
                    >
                      {row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (hasSelection ? 1 : 0)}
                  className="px-5 py-12 text-center text-sm font-semibold text-slate-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 ? (
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50 px-5 py-4 text-sm text-slate-600">
          <span className="font-semibold">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          <div className="flex gap-2">
            <Link
              href={paginationHref(pagination.basePath, pagination.query, Math.max(1, pagination.page - 1))}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-bold transition hover:bg-slate-50"
            >
              Previous
            </Link>
            <Link
              href={paginationHref(pagination.basePath, pagination.query, Math.min(pagination.totalPages, pagination.page + 1))}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 font-bold transition hover:bg-slate-50"
            >
              Next
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}


function paginationHref(basePath: string, query: Record<string, string | undefined> | undefined, page: number) {
  const params = new URLSearchParams();
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value) params.set(key, value);
  });
  params.set("page", String(page));
  return `${basePath}?${params.toString()}`;
}
