import { useParams } from 'react-router-dom'
import JobDetailsPage from '../../components/job-details/JobDetailsPage'

/**
 * RecruiterJobDetailsPage
 *
 * Route: /recruiter/jobs/:id
 * Renders JobDetailsPage in "recruiter" (owner) view mode.
 */
export default function RecruiterJobDetailsPage() {
  const { id } = useParams()

  return (
    <JobDetailsPage
      jobId={id}
      viewMode='recruiter'
      backHref='/recruiter/my-job-posts'
      jobDetailUrl={`jobs/${id}/`}
      toggleUrl={`jobs/${id}/`}
    />
  )
}
