import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import JobPostWizard from "../../components/common/form/JobPostWizard";
import PageHeader from "../../components/common/PageHeader";
import {privateApi} from "../../services/api";

export default function PostJobPage() {
  const navigate = useNavigate();

  const handleSubmit = async (data) => {
    try {
      console.log("Submitting payload: ", data);
      await privateApi.post("/jobs/", data);
      toast.success("Job posted successfully!");
      navigate("/recruiter/my-job-posts");
    } catch (err) {
      console.error("Backend Error:", err.response?.data || err.message);
      if (err.response?.status === 400 && err.response?.data) {
        throw err.response.data;
      }
      
      let errorMsg = "Failed to post job. Please try again.";
      if (err.response?.data) {
        // If it's a Django DRF error, it usually returns an object of field errors
        const backendErrors = err.response.data;
        if (typeof backendErrors === 'object') {
          const firstKey = Object.keys(backendErrors)[0];
          errorMsg = `${firstKey}: ${backendErrors[firstKey]}`;
        }
      }
      toast.error(errorMsg);
    }
  };

  return (
    <>
      <PageHeader
        title="Post a New Job"
        description="Fill out the 3-step wizard to publish a job opening."
        showBackButton
        onBack={() => navigate(-1)}
      />
      <JobPostWizard onSubmit={handleSubmit} />
    </>
  );
}
