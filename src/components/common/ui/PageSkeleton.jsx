/**
 * HireSphere — Common Page Loading Skeleton
 * Reusable shimmer skeleton for details pages, profile views, and dashboards.
 *
 * Props:
 *   hasSidebar  {boolean} — true: 2-column layout with right sidebar (e.g. Job Details)
 *                           false: single-column card layout (e.g. Profile Views)
 *   cardsCount  {number}  — Number of section cards in main column (default: 2)
 *   className   {string}  — Additional wrapper classes
 */
export default function PageSkeleton({
  hasSidebar = false,
  cardsCount = 2,
  className = '',
}) {
  return (
    <div className={`flex flex-col gap-6 animate-pulse ${className}`}>
      {/* Header bar skeleton */}
      <div className='flex flex-col gap-2'>
        <div className='h-4 w-20 bg-gray-100 dark:bg-gray-800 rounded-md' />
        <div className='flex flex-wrap items-center gap-3'>
          <div className='h-8 w-64 bg-gray-100 dark:bg-gray-800 rounded-xl' />
          <div className='h-6 w-20 bg-gray-100 dark:bg-gray-800 rounded-full' />
        </div>
        <div className='h-4 w-40 bg-gray-100 dark:bg-gray-800 rounded-md' />
      </div>

      {/* Main content grid */}
      <div className={`grid grid-cols-1 ${hasSidebar ? 'lg:grid-cols-3' : ''} gap-5`}>
        {/* Left / main column */}
        <div className={`${hasSidebar ? 'lg:col-span-2' : ''} flex flex-col gap-5`}>
          {/* Avatar / top card (in profile mode) */}
          {!hasSidebar && (
            <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-5'>
              <div className='w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gray-100 dark:bg-gray-800 shrink-0' />
              <div className='flex flex-col gap-2 flex-1'>
                <div className='h-6 w-48 bg-gray-100 dark:bg-gray-800 rounded-lg' />
                <div className='h-4 w-36 bg-gray-100 dark:bg-gray-800 rounded-md' />
                <div className='h-4 w-60 bg-gray-100 dark:bg-gray-800 rounded-md' />
              </div>
            </div>
          )}

          {/* Section cards */}
          {[...Array(cardsCount)].map((_, i) => (
            <div
              key={i}
              className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 flex flex-col gap-4'
            >
              <div className='h-5 w-36 bg-gray-100 dark:bg-gray-800 rounded-md' />
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2'>
                {[...Array(4)].map((_, j) => (
                  <div key={j} className='flex flex-col gap-1.5'>
                    <div className='h-3.5 w-24 bg-gray-100 dark:bg-gray-800 rounded-md' />
                    <div className='h-9 bg-gray-100 dark:bg-gray-800 rounded-xl' />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right sidebar column (for details layout) */}
        {hasSidebar && (
          <div className='lg:col-span-1 flex flex-col gap-4'>
            <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 flex flex-col gap-4'>
              <div className='h-5 w-32 bg-gray-100 dark:bg-gray-800 rounded-md' />
              <div className='flex items-center gap-3'>
                <div className='w-14 h-14 rounded-xl bg-gray-100 dark:bg-gray-800 shrink-0' />
                <div className='flex flex-col gap-2 flex-1'>
                  <div className='h-4 w-28 bg-gray-100 dark:bg-gray-800 rounded-md' />
                  <div className='h-3.5 w-20 bg-gray-100 dark:bg-gray-800 rounded-md' />
                </div>
              </div>
              <div className='h-10 bg-gray-100 dark:bg-gray-800 rounded-xl mt-2' />
              <div className='h-10 bg-gray-100 dark:bg-gray-800 rounded-xl' />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
