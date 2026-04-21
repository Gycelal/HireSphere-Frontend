/**
 * ProfileCompletionBar
 *
 * A minimal, reusable progress bar that shows profile completion percentage.
 * Can be used on any dashboard page — recruiter profile, candidate profile, etc.
 *
 * Props:
 *   fields       { label: string, filled: boolean }[]   — list of tracked fields
 *   showItems    boolean   — show incomplete field list below bar (default false)
 *   className    string    — optional wrapper class overrides
 *
 * Usage:
 *   const fields = [
 *     { label: "First name",   filled: !!draft.firstName },
 *     { label: "Profile photo",filled: !!avatarSrc },
 *     ...
 *   ];
 *   <ProfileCompletionBar fields={fields} showItems />
 */
export default function ProfileCompletionBar({ fields = [], showItems = false, className = "" }) {
  const total      = fields.length;
  const filled     = fields.filter((f) => f.filled).length;
  const percent    = total === 0 ? 0 : Math.round((filled / total) * 100);
  const missing    = fields.filter((f) => !f.filled);

  // Color tier based on completion
  const barColor =
    percent === 100 ? "bg-green-500"  :
    percent >= 70   ? "bg-violet-500" :
    percent >= 40   ? "bg-amber-400"  :
                      "bg-red-400";

  const labelColor =
    percent === 100 ? "text-green-600 dark:text-green-400"  :
    percent >= 70   ? "text-violet-600 dark:text-violet-400" :
    percent >= 40   ? "text-amber-600 dark:text-amber-400"  :
                      "text-red-500 dark:text-red-400";

  return (
    <div className={`flex flex-col gap-2 ${className}`}>

      {/* Label row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
          Profile completion
        </span>
        <span className={`text-xs font-bold tabular-nums ${labelColor}`}>
          {percent}%
        </span>
      </div>

      {/* Progress track */}
      <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          className={`h-full rounded-full transition-all duration-500 ease-out ${barColor}`}
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Optional: incomplete field pills */}
      {showItems && missing.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-0.5">
          {missing.map((f) => (
            <span
              key={f.label}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md
                text-[0.68rem] font-medium
                bg-gray-100 dark:bg-gray-800
                text-gray-500 dark:text-gray-400"
            >
              <span className="material-symbols-outlined text-[0.75rem]">circle</span>
              {f.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}