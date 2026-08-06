import { useParams } from 'react-router-dom'
import JobDetailsPage from '../../components/job-details/JobDetailsPage'


export default function RecruiterJobDetailsPage() {
  const { id } = useParams()
  console.log("recently created recruiter job details page")

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
