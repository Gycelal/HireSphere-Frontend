import { useParams } from 'react-router-dom'
import JobDetailsPage from '../../components/job-details/JobDetailsPage'
import { useSelector } from 'react-redux'


export default function ApplicationJobDetailsWrapper() {
  const { id } = useParams()

  return (
    <JobDetailsPage
      jobId={id}
      viewMode='candidate'
      backHref='/candidate/jobs'
      jobDetailUrl={`jobs/${id}/`}
      applyUrl={`jobs/${id}/apply/`}
    />
  )
}
