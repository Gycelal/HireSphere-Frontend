import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import JobPostWizard from "../../components/common/form/JobPostWizard";
import PageHeader from "../../components/common/PageHeader";
import { privateApi } from "../../services/api";

export default function EditJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData]   = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await privateApi.get(`/jobs/${id}/`);
        console.log('res:', res)
        setJobData(res.data)
        console.log("jobData:", jobData)

      } catch (err) {
        console.error(err);
        toast.error("Could not load job details.");
        navigate("/recruiter/my-job-posts");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleSubmit = async (data) => {
    try {
      const res = await privateApi.post("/jobs/", jobData)
      console.log("Saving edits:", data);
      toast.success("Job updated successfully!");
      navigate("/recruiter/my-job-posts");
    } catch (err) {
      console.error(err);
      if (err.response?.status === 400 && err.response?.data) {
        throw err.response.data;
      }
      toast.error("Failed to save changes. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-gray-400 dark:text-gray-600">
        <span className="material-symbols-outlined animate-spin text-[1.8rem] text-violet-500">
          progress_activity
        </span>
        Loading job details…
      </div>
    );
  }

  return (
    <>
      <PageHeader
        title="Edit Job Post"
        description="Update your listing and save when ready."
        showBackButton
        onBack={() => navigate(-1)}
      />
      <JobPostWizard
        initialData={jobData}
        isEditing
        onSubmit={handleSubmit}
      />
    </>
  );
}
