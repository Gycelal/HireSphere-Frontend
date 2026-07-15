import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ConfirmModal from '../common/ConfirmModal'

/**
 * JobActionSection
 *
 * Shown to the recruiter who owns the job. Provides:
 *   – Edit Job button
 *   – Close Job / Open Job toggle (with a confirm modal)
 *
 * Props:
 *   jobId      – string | number   job ID for navigation / API calls
 *   isActive   – boolean           current job status
 *   onToggle   – async () => void  called after user confirms the toggle
 */
export default function JobActionSection({ jobId, isActive, onToggle }) {
  const navigate = useNavigate()

  const [modalOpen, setModalOpen] = useState(false)
  const [toggling, setToggling]   = useState(false)

  const handleConfirmToggle = async () => {
    setToggling(true)
    try {
      await onToggle?.()
    } finally {
      setToggling(false)
      setModalOpen(false)
    }
  }

  return (
    <>
      <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden'>

        {/* ── Card header ── */}
        <div className='flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 dark:border-gray-800'>
          <span className='material-symbols-outlined text-[1.1rem] text-violet-500'>
            manage_accounts
          </span>
          <h2 className='text-sm font-semibold text-gray-800 dark:text-white'>
            Job Actions
          </h2>
        </div>

        {/* ── Card body ── */}
        <div className='px-6 py-5 flex flex-col gap-3'>

          {/* Status info */}
          <p className='text-xs text-gray-400 dark:text-gray-500 leading-relaxed'>
            {isActive
              ? 'This job is currently open. Candidates can discover and apply for it.'
              : 'This job is currently closed. Candidates cannot apply until you reopen it.'}
          </p>

          {/* Edit Job */}
          <button
            id='edit-job-btn'
            onClick={() => navigate(`/recruiter/edit-job/${jobId}`)}
            className='w-full inline-flex items-center justify-center gap-2
              px-5 py-2.5 rounded-xl text-sm font-semibold
              text-violet-600 dark:text-violet-400
              border border-violet-200 dark:border-violet-700
              hover:bg-violet-50 dark:hover:bg-violet-950/40
              transition-all duration-200'
          >
            <span className='material-symbols-outlined text-[1rem]'>edit</span>
            Edit Job
          </button>

          {/* Close / Open toggle */}
          <button
            id='toggle-job-status-btn'
            onClick={() => setModalOpen(true)}
            className={`w-full inline-flex items-center justify-center gap-2
              px-5 py-2.5 rounded-xl text-sm font-bold text-white
              transition-all duration-200
              ${isActive
                ? 'bg-red-500 hover:bg-red-600 active:bg-red-700 shadow-md shadow-red-200 dark:shadow-red-900/30'
                : 'bg-green-600 hover:bg-green-700 active:bg-green-800 shadow-md shadow-green-200 dark:shadow-green-900/30'
              }`}
          >
            <span className='material-symbols-outlined text-[1rem]'>
              {isActive ? 'lock' : 'lock_open'}
            </span>
            {isActive ? 'Close Job' : 'Open Job'}
          </button>

        </div>
      </div>

      {/* Confirm modal */}
      <ConfirmModal
        open={modalOpen}
        title={isActive ? 'Close this job?' : 'Reopen this job?'}
        message={
          isActive
            ? 'Closing the job will hide it from candidates. You can reopen it anytime.'
            : 'Reopening this job will make it visible to candidates again.'
        }
        confirmText={toggling ? 'Processing…' : isActive ? 'Close Job' : 'Open Job'}
        variant={isActive ? 'danger' : 'success'}
        onConfirm={handleConfirmToggle}
        onCancel={() => setModalOpen(false)}
      />
    </>
  )
}
