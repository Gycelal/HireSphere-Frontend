/**
 * DataTable
 *
 * Props:
 *   columns        { key, label, render? }[]
 *   data           object[]
 *   renderActions  (row) => ReactNode   (optional — adds an Actions column)
 *   emptyMessage   string               (optional — shown when data is empty)
 */
export default function DataTable({
  columns       = [],
  data          = [],
  renderActions,
  emptyMessage  = "No records found.",
}) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">

      {/* Scrollable wrapper for small screens */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">

          {/* Head */}
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              {columns.map(col => (
                <th
                  key={col.key}
                  className="px-4 py-3.5 text-left text-xs font-semibold
                    text-gray-400 dark:text-gray-500 uppercase tracking-wide
                    whitespace-nowrap"
                >
                  {col.label}
                </th>
              ))}
              {renderActions && (
                <th className="px-4 py-3.5 text-right text-xs font-semibold
                  text-gray-400 dark:text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (renderActions ? 1 : 0)}
                  className="px-4 py-12 text-center text-sm text-gray-400 dark:text-gray-500"
                >
                  <span className="material-symbols-outlined block text-[2rem] mx-auto mb-2
                    text-gray-300 dark:text-gray-700">
                    inbox
                  </span>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={row.id ?? rowIndex}
                  className="hover:bg-gray-50/60 dark:hover:bg-gray-800/40 transition-colors duration-150"
                >
                  {columns.map(col => (
                    <td
                      key={col.key}
                      className="px-4 py-3.5 text-gray-700 dark:text-gray-300 whitespace-nowrap"
                    >
                      {col.render ? col.render(row) : (row[col.key] ?? "—")}
                    </td>
                  ))}
                  {renderActions && (
                    <td className="px-4 py-3.5 text-right whitespace-nowrap">
                      {renderActions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}