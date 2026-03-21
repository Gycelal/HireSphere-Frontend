/**
 * TableToolbar
 *
 * Props:
 *   searchValue       string
 *   onSearchChange    (value: string) => void
 *   searchPlaceholder string   (optional)
 *   filters           { label, value }[]  (optional)
 *   selectedFilter    string
 *   onFilterChange    (value: string) => void
 *   sortOptions       { label, value }[]  (optional)
 *   selectedSort      string
 *   onSortChange      (value: string) => void
 */
export default function TableToolbar({
  searchValue      = "",
  onSearchChange,
  searchPlaceholder = "Search…",
  filters          = [],
  selectedFilter   = "",
  onFilterChange,
  sortOptions      = [],
  selectedSort     = "",
  onSortChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-4">

      {/* Search */}
      <div className="relative flex-1 min-w-0">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2
          text-[1.1rem] text-gray-400 dark:text-gray-500 pointer-events-none select-none">
          search
        </span>
        <input
          type="text"
          value={searchValue}
          onChange={e => onSearchChange?.(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm
            bg-white dark:bg-gray-900
            border border-gray-200 dark:border-gray-700
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-600
            focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
            transition-all duration-200"
        />
      </div>

      <div className="flex items-center gap-2.5 shrink-0">
        {/* Filter dropdown */}
        {filters.length > 0 && (
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2
              text-[1rem] text-gray-400 dark:text-gray-500 pointer-events-none select-none">
              filter_list
            </span>
            <select
              value={selectedFilter}
              onChange={e => onFilterChange?.(e.target.value)}
              className="pl-8 pr-8 py-2.5 rounded-xl text-sm appearance-none cursor-pointer
                bg-white dark:bg-gray-900
                border border-gray-200 dark:border-gray-700
                text-gray-700 dark:text-gray-300
                focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
                transition-all duration-200"
            >
              {filters.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2
              text-[1rem] text-gray-400 dark:text-gray-500 pointer-events-none select-none">
              expand_more
            </span>
          </div>
        )}

        {/* Sort dropdown */}
        {sortOptions.length > 0 && (
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2
              text-[1rem] text-gray-400 dark:text-gray-500 pointer-events-none select-none">
              sort
            </span>
            <select
              value={selectedSort}
              onChange={e => onSortChange?.(e.target.value)}
              className="pl-8 pr-8 py-2.5 rounded-xl text-sm appearance-none cursor-pointer
                bg-white dark:bg-gray-900
                border border-gray-200 dark:border-gray-700
                text-gray-700 dark:text-gray-300
                focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
                transition-all duration-200"
            >
              {sortOptions.map(s => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <span className="material-symbols-outlined absolute right-2.5 top-1/2 -translate-y-1/2
              text-[1rem] text-gray-400 dark:text-gray-500 pointer-events-none select-none">
              expand_more
            </span>
          </div>
        )}
      </div>
    </div>
  );
}