/**
 * JobStatusBadge
 * Shows a pill badge: "Open" (green) or "Closed" (red) based on is_active.
 */
const JobStatusBadge = ({ isActive }) => (
  <span
    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
      isActive
        ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800'
        : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800'
    }`}
  >
    <span
      className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-green-500' : 'bg-red-500'}`}
    />
    {isActive ? 'Open' : 'Closed'}
  </span>
)

export default JobStatusBadge
