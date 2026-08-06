import { useParams } from "react-router-dom";
import JobDetailsPage from "../../components/job-details/JobDetailsPage";

const HomeJobDetailsWrapper = () => {
  const { id } = useParams();
  return (
    <div className="p-6 sm:p-8 max-w-7xl mx-auto w-full">
      <JobDetailsPage
        jobId={id}
        viewMode="candidate"
        backHref="/candidate/find-jobs"
        jobDetailUrl={`jobs/${id}/`}
        applyUrl={`jobs/${id}/apply/`}
      />
    </div>
  );
};

export default HomeJobDetailsWrapper;
