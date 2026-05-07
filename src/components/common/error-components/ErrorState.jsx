/**
 * HireSphere — Generic Error Component
 * Reusable in dashboard layouts and standalone pages.
 *
 * Props:
 *   title        {string}   — Override headline  (default: "Something went wrong")
 *   message      {string}   — Override body text
 *   onRetry      {function} — If provided, shows a "Try Again" button
 *   fullPage     {boolean}  — true → min-h-screen centering; false (default) → fills parent
 */

import { AlertCircle } from "lucide-react"; // or swap for Google Icon if bundled separately

export default function ErrorState({
  title = "Something went wrong",
  message = "We're unable to complete your request right now. Please try again later.",
  onRetry,
  fullPage = false,
}) {
  return (
    <div
      className={`
        flex items-center justify-center w-full px-4 py-12
        bg-white dark:bg-gray-950
        ${fullPage ? "min-h-screen" : "min-h-80"}
      `}
    >
      <div className="flex flex-col items-center text-center max-w-sm w-full gap-5">

        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/40">
          <AlertCircle
            className="w-7 h-7 text-red-500 dark:text-red-400"
            strokeWidth={1.75}
          />
        </div>

        {/* Text */}
        <div className="flex flex-col gap-1.5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            {message}
          </p>
        </div>

        {/* Optional retry action */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="
              mt-1 inline-flex items-center gap-2 px-4 py-2 rounded-md
              bg-purple-600 hover:bg-purple-700 active:bg-purple-800
              text-white text-sm font-medium
              transition-colors duration-150 focus:outline-none
              focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:ring-offset-2
              dark:focus-visible:ring-offset-gray-950
            "
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}