/**
 * Pagination
 *
 * Props:
 *   page          number   — current page (1-based)
 *   totalPages    number
 *   onPageChange  (page: number) => void
 *   pageSize      number   — rows per page (optional, for display only)
 *   totalItems    number   — total record count (optional, for display)
 */
export default function Pagination({
  page,
  totalPages,
  onPageChange,
  pageSize,
  totalItems,
}) {
  if (totalPages <= 1) return null;

  const from = pageSize ? (page - 1) * pageSize + 1 : null;
  const to   = pageSize ? Math.min(page * pageSize, totalItems ?? page * pageSize) : null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4">

      {/* Record count label */}
      {from !== null && totalItems !== undefined ? (
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Showing <span className="font-medium text-gray-600 dark:text-gray-300">{from}–{to}</span> of{" "}
          <span className="font-medium text-gray-600 dark:text-gray-300">{totalItems}</span> results
        </p>
      ) : (
        <p className="text-xs text-gray-400 dark:text-gray-500">
          Page <span className="font-medium text-gray-600 dark:text-gray-300">{page}</span> of{" "}
          <span className="font-medium text-gray-600 dark:text-gray-300">{totalPages}</span>
        </p>
      )}

      {/* Controls */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          aria-label="Previous page"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-sm
            text-gray-500 dark:text-gray-400
            hover:bg-gray-100 dark:hover:bg-gray-800
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors duration-150"
        >
          <span className="material-symbols-outlined text-[1.1rem]">chevron_left</span>
        </button>

        {/* Page numbers */}
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter(p => {
            // Show first, last, current, and neighbours
            if (totalPages <= 5) return true;
            return p === 1 || p === totalPages || Math.abs(p - page) <= 1;
          })
          .reduce((acc, p, idx, arr) => {
            // Insert ellipsis where pages are skipped
            if (idx > 0 && p - arr[idx - 1] > 1) {
              acc.push("…");
            }
            acc.push(p);
            return acc;
          }, [])
          .map((p, idx) =>
            p === "…" ? (
              <span key={`ellipsis-${idx}`}
                className="w-8 h-8 flex items-center justify-center text-xs text-gray-400 dark:text-gray-600">
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                aria-current={p === page ? "page" : undefined}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold
                  transition-all duration-150
                  ${p === page
                    ? "bg-violet-600 text-white shadow-sm shadow-violet-200 dark:shadow-violet-900/30"
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
              >
                {p}
              </button>
            )
          )}

        {/* Next */}
        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          aria-label="Next page"
          className="w-8 h-8 flex items-center justify-center rounded-lg text-sm
            text-gray-500 dark:text-gray-400
            hover:bg-gray-100 dark:hover:bg-gray-800
            disabled:opacity-40 disabled:cursor-not-allowed
            transition-colors duration-150"
        >
          <span className="material-symbols-outlined text-[1.1rem]">chevron_right</span>
        </button>
      </div>
    </div>
  );
}