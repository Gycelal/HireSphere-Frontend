/**
 * HireSphere — Common Reusable Error Component
 * Clean fallback UI for HomeLayout, DashboardLayout, card sections, and pages.
 *
 * Props:
 *   title      {string}   — Headline text (default: "Something went wrong")
 *   message    {string}   — Descriptive error message
 *   icon       {string}   — Material symbol icon name (default: "error")
 *   onBack     {function} — If provided, renders a "Go back" button
 *   onRetry    {function} — If provided, renders a "Try Again" button
 *   backText   {string}   — Custom text for the back button (default: "Go back")
 *   retryText  {string}   — Custom text for retry button (default: "Try Again")
 *   fullPage   {boolean}  — If true, expands to min-h-screen (default: false)
 *   className  {string}   — Custom container class names
 */
export default function ErrorState({
  title = 'Something went wrong',
  message = "We're unable to complete your request right now. Please try again later.",
  icon = 'error',
  onBack,
  onRetry,
  backText = 'Go back',
  retryText = 'Try Again',
  fullPage = false,
  className = '',
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-4 py-16 sm:py-24 text-center px-4 ${
        fullPage ? 'min-h-screen' : 'w-full'
      } ${className}`}
    >
      {/* Icon badge */}
      <div className='w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center shrink-0'>
        <span className='material-symbols-outlined text-[2rem] text-red-500'>
          {icon}
        </span>
      </div>

      {/* Text message */}
      <div className='max-w-md'>
        <h2 className='text-base sm:text-lg font-bold text-gray-900 dark:text-white'>
          {title}
        </h2>
        {message && (
          <p className='text-sm text-gray-400 dark:text-gray-500 mt-1 leading-relaxed'>
            {message}
          </p>
        )}
      </div>

      {/* Action buttons */}
      {(onBack || onRetry) && (
        <div className='flex flex-wrap items-center justify-center gap-3 mt-2'>
          {onBack && (
            <button
              onClick={onBack}
              className='inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold
                text-violet-600 dark:text-violet-400
                border border-violet-200 dark:border-violet-700
                hover:bg-violet-50 dark:hover:bg-violet-950/40
                transition-all duration-200'
            >
              <span className='material-symbols-outlined text-[1.1rem]'>
                arrow_back
              </span>
              {backText}
            </button>
          )}

          {onRetry && (
            <button
              onClick={onRetry}
              className='inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white
                bg-violet-600 hover:bg-violet-700 active:bg-violet-800
                shadow-md shadow-violet-200 dark:shadow-violet-900/30
                transition-all duration-200'
            >
              <span className='material-symbols-outlined text-[1.1rem]'>
                refresh
              </span>
              {retryText}
            </button>
          )}
        </div>
      )}
    </div>
  )
}