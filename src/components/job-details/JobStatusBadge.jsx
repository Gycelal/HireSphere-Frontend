

const JobStatusBadge = ({ isActive, isExpired = false }) => {
  let label = 'Active'
  let badgeStyles =
    'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800'
  let dotStyles = 'bg-green-500'

  if (!isActive) {
    label = 'Closed'
    badgeStyles =
      'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800'
    dotStyles = 'bg-red-500'
  } else if (isExpired) {
    label = 'Expired'
    badgeStyles =
      'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800'
    dotStyles = 'bg-amber-500'
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${badgeStyles}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotStyles}`} />
      {label}
    </span>
  )
}

export default JobStatusBadge
