import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { privateApi } from '../../services/api'
import JobStatusBadge from './JobStatusBadge'
import JobInformationSection from './JobInformationSection'
import RecruiterSummaryCard from './RecruiterSummaryCard'
import JobActionSection from './JobActionSection'

function LoadingSkeleton() {
  return (
    <div className='flex flex-col gap-4 animate-pulse'>
      <div className='h-8 w-64 bg-gray-100 dark:bg-gray-800 rounded-xl' />
      <div className='h-4 w-40 bg-gray-100 dark:bg-gray-800 rounded-xl' />
      <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 flex flex-col gap-4'>
        <div className='h-4 w-32 bg-gray-100 dark:bg-gray-800 rounded-lg' />
        <div className='grid grid-cols-3 gap-4'>
          {[...Array(5)].map((_, i) => (
            <div key={i} className='h-10 bg-gray-100 dark:bg-gray-800 rounded-lg' />
          ))}
        </div>
      </div>
      <div className='bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 h-40' />
    </div>
  )
}
function ErrorState({ onBack }) {
  return (
    <div className='flex flex-col items-center justify-center gap-4 py-24 text-center'>
      <div className='w-16 h-16 rounded-2xl bg-red-50 dark:bg-red-950/40 flex items-center justify-center'>
        <span className='material-symbols-outlined text-[2rem] text-red-500'>error</span>
      </div>
      <div>
        <p className='text-base font-bold text-gray-900 dark:text-white'>Could not load job</p>
        <p className='text-sm text-gray-400 dark:text-gray-500 mt-1'>
          The job may have been removed or you don't have access.
        </p>
      </div>
      <button
        onClick={onBack}
        className='inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
          text-violet-600 dark:text-violet-400
          border border-violet-200 dark:border-violet-700
          hover:bg-violet-50 dark:hover:bg-violet-950/40
          transition-all duration-200'
      >
        <span className='material-symbols-outlined text-[1rem]'>arrow_back</span>
        Go back
      </button>
    </div>
  )
}
export default function JobDetailsPage({
  jobId,
  viewMode = 'candidate',
  backHref,
  jobDetailUrl,
  toggleUrl,
  applyUrl,
}) {
  const navigate = useNavigate()

  const [job,       setJob]       = useState(null)
  const [recruiter, setRecruiter] = useState(null)
  const [loading,   setLoading]   = useState(true)
  const [error,     setError]     = useState(false)
  const [applying,  setApplying]  = useState(false)
  const [applied,   setApplied]   = useState(false)

  const fetchJob = async () => {
    setLoading(true)
    setError(false)
    try {
      // Artificial delay to demonstrate loading skeleton
      await new Promise(resolve => setTimeout(resolve, 500))
      const res = await privateApi.get(jobDetailUrl || `jobs/${jobId}/`)
      console.log("result:", res)
      setJob(res.data)
      // The backend may nest recruiter data under `res.data.recruiter` or `res.data.posted_by`
      setRecruiter(res.data.recruiter ?? res.data.posted_by ?? null)
      setApplied(res.data.has_applied ?? false)
    } catch (err) {
      console.error('Failed to load job:', err)
      setError(true)
    } finally {
      setLoading(false)
    }
  }
  console.log("recrutier state:", recruiter)

  useEffect(() => {
    if (jobId) fetchJob()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId])

  // Toggle Job Status for recruiter
  const handleToggle = async () => {
    try {
      await privateApi.patch(toggleUrl || `jobs/${jobId}/`, { is_active: !job.is_active })
      toast.success(job.is_active ? 'Job closed successfully.' : 'Job reopened successfully.')
      setJob((prev) => ({ ...prev, is_active: !prev.is_active }))
    } catch (err) {
      console.error('Toggle error:', err)
      toast.error(err?.response?.data?.message || 'Failed to update job status.')
    }
  }

  // Apply for candidate
  const handleApply = async () => {
    if (applied) return
    setApplying(true)
    try {
      await privateApi.post(applyUrl || `jobs/${jobId}/apply/`)
      toast.success('Application submitted successfully!')
      setApplied(true)
    } catch (err) {
      console.error('Apply error:', err)
      const msg = err?.response?.data?.detail || err?.response?.data?.message || 'Failed to submit application.'
      toast.error(msg)
    } finally {
      setApplying(false)
    }
  }

  // Render States
  if (loading) return <LoadingSkeleton />
  if (error)   return <ErrorState onBack={() => (backHref ? navigate(backHref) : navigate(-1))} />

  return (
    <div className='flex flex-col gap-6'>

      {/* ── Page header ── */}
      <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3'>
        <div className='flex flex-col gap-1'>
          {/* Back link */}
          <button
            onClick={() => (backHref ? navigate(backHref) : navigate(-1))}
            className='inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500
              hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200 w-fit mb-1'
          >
            <span className='material-symbols-outlined text-[1.1rem]'>arrow_back</span>
            Back
          </button>

          {/* Title + badge */}
          <div className='flex flex-wrap items-center gap-3'>
            <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
              {job.title}
            </h1>
            <JobStatusBadge isActive={job.is_active} />
          </div>

          {/* Subtitle: location + type quick-read */}
          <p className='text-sm text-gray-400 dark:text-gray-500 flex items-center gap-1.5 mt-0.5'>
            <span className='material-symbols-outlined text-[0.95rem] text-violet-500'>location_on</span>
            {job.location || 'Location not specified'}
          </p>
        </div>
      </div>

      {/* ── Two-column layout on lg+ ── */}
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>

        {/* Left / main content (spans 2 of 3 columns) */}
        <div className='lg:col-span-2 flex flex-col gap-4'>
          <JobInformationSection job={job} />
        </div>

        {/* Right sidebar (spans 1 of 3 columns) — sticky on lg+ */}
        <div className='lg:col-span-1'>
          <div className='lg:sticky lg:top-6 flex flex-col gap-4'>
            {viewMode === 'candidate' ? (
              <RecruiterSummaryCard
                recruiter={recruiter}
                onApply={handleApply}
                applying={applying}
                applied={applied}
              />
            ) : (
              <JobActionSection
                jobId={jobId}
                isActive={job.is_active}
                onToggle={handleToggle}
              />
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
