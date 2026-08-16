import { useNavigate } from 'react-router-dom'

export default function RecruiterSummaryCard({ recruiter, onApply, applying = false, applied = false }) {
  const navigate = useNavigate()

  const displayName =
    recruiter?.display_name ||
    `${recruiter?.first_name ?? ''} ${recruiter?.last_name ?? ''}`.trim() ||
    'Recruiter'
  const company = recruiter?.company_or_brand_name
  const profilePicture    = recruiter?.profile_picture

  const initials = displayName
    .split(' ')
    .map((w) => w[0] ?? '')
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden'>

      <div className='flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 dark:border-gray-800'>
        <span className='material-symbols-outlined text-[1.1rem] text-violet-500'>
          person
        </span>
        <h2 className='text-sm font-semibold text-gray-800 dark:text-white'>
          About the Recruiter
        </h2>
      </div>

      <div className='px-6 py-5 flex flex-col gap-5'>

        <div className='flex items-center gap-4'>
          {/* Recruiter profile picture*/}
          {profilePicture ? (
            <img
              src={profilePicture}
              alt={displayName}
              className='w-14 h-14 rounded-xl object-cover border border-purple-500 dark: shrink-0'
            />
          ) : (
            <div
              className='w-14 h-14 rounded-xl shrink-0
                bg-gradient-to-br from-violet-500 to-purple-600
                flex items-center justify-center
                text-white font-bold text-lg tracking-tight'
            >
              {initials || '?'}
            </div>
          )}

          {/* Name + company */}
          <div className='min-w-0'>
            <p className='text-base font-bold text-gray-900 dark:text-white truncate'>
              {displayName}
            </p>
            {company && (
              <p className='text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5'>
                <span className='material-symbols-outlined text-[0.9rem] text-violet-500'>
                  business
                </span>
                {company}
              </p>
            )}
          </div>
        </div>

        <div className='border-t border-gray-100 dark:border-gray-800' />

        {/* action buttons*/}
        <div className='flex flex-col sm:flex-row gap-2.5'>
        
          <button
            id='apply-now-btn'
            onClick={onApply}
            disabled={applying || applied}
            className={`flex-1 inline-flex items-center justify-center gap-2
              px-5 py-2.5 rounded-xl text-sm font-bold text-white
              transition-all duration-200
              disabled:opacity-60 disabled:cursor-not-allowed
              ${applied
                ? 'bg-green-600 hover:bg-green-700'
                : 'bg-violet-600 hover:bg-violet-700 active:bg-violet-800 shadow-md shadow-violet-200 dark:shadow-violet-900/30'
              }`}
          >
            <span className='material-symbols-outlined text-[1rem]'>
              {applied ? 'check_circle' : applying ? 'progress_activity' : 'send'}
            </span>
            {applied ? 'Applied' : applying ? 'Applying…' : 'Apply Now'}
          </button>

          {/* View Recruiter Profile */}
          <button
            id='view-recruiter-profile-btn'
            onClick={() => navigate(`/candidate/recruiter/${recruiter?.id}`)}
            className='flex-1 inline-flex items-center justify-center gap-2
              px-5 py-2.5 rounded-xl text-sm font-semibold
              text-violet-600 dark:text-violet-400
              border border-violet-200 dark:border-violet-700
              hover:bg-violet-50 dark:hover:bg-violet-950/40
              transition-all duration-200'
          >
            <span className='material-symbols-outlined text-[1rem]'>
              account_circle
            </span>
            View Profile
          </button>
        </div>

      </div>
    </div>
  )
}
