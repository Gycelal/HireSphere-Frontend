import { useEffect, useState } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { privateApi } from '../../services/api'
import RecruiterProfileView from '../../components/common/profile/RecruiterProfileView'
import PageSkeleton from '../../components/common/ui/PageSkeleton'
import ErrorState from '../../components/common/error-components/ErrorState'

export default function CandidateRecruiterProfilePage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()

  const stateRecruiter = location.state?.recruiter
  const jobId = location.state?.jobId

  const [profileData, setProfileData] = useState(stateRecruiter || null)
  const [loading, setLoading] = useState(!stateRecruiter)
  const [error, setError] = useState(false)

  const handleBack = () => {
    if (jobId) {
      navigate(`/candidate/jobs/${jobId}`)
    } else {
      navigate(-1)
    }
  }

  useEffect(() => {
    const fetchRecruiterDetails = async () => {
      if (!stateRecruiter) {
        setLoading(true)
      }
      setError(false)
      try {
        const res = await privateApi.get('jobs/')
        const allJobs = res?.data?.results || res?.data || []

        const matchingJobs = allJobs.filter((j) => {
          const recId = j.recruiter?.id ?? j.posted_by?.id ?? j.recruiter
          return String(recId) === String(id)
        })

        if (matchingJobs.length > 0) {
          const rawRecruiter =
            matchingJobs[0].recruiter || matchingJobs[0].posted_by
          setProfileData(rawRecruiter)
        } else if (!stateRecruiter) {
          setError(true)
        }
      } catch (err) {
        console.error('Failed to load recruiter details:', err)
        if (!stateRecruiter) {
          setError(true)
        }
      } finally {
        setLoading(false)
      }
    }

    fetchRecruiterDetails()
  }, [id, stateRecruiter])

  if (loading) {
    return (
      <div className='p-6 sm:p-8 max-w-7xl mx-auto w-full'>
        <PageSkeleton hasSidebar={false} cardsCount={2} />
      </div>
    )
  }

  if (error && !profileData) {
    return (
      <div className='p-6 sm:p-8 max-w-7xl mx-auto w-full'>
        <ErrorState
          onBack={handleBack}
          title='Recruiter Profile Not Found'
          message='The recruiter profile you are looking for may have been removed or does not exist.'
          icon='person_off'
        />
      </div>
    )
  }

  return (
    <div className='p-6 sm:p-8 max-w-7xl mx-auto w-full space-y-6'>
      {/* ── Page header ── */}
      <div className='flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3'>
        <div className='flex flex-col gap-1'>
          {/* Back link */}
          <button
            onClick={handleBack}
            className='inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500
              hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200 w-fit mb-1'
          >
            <span className='material-symbols-outlined text-[1.1rem]'>arrow_back</span>
            Back
          </button>

          <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
            Recruiter Profile
          </h1>
          <p className='text-sm text-gray-400 dark:text-gray-500'>
            Viewing profile details of the recruiter
          </p>
        </div>
      </div>

      {/* ── Recruiter Profile View ── */}
      <RecruiterProfileView
        profileData={profileData}
        completionPercentage={100}
        showCompletionBar={false}
        readOnly={true}
      />
    </div>
  )
}
