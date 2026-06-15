import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import JobPostWizard from "../../components/common/form/JobPostWizard";
import PageHeader from "../../components/common/PageHeader";

export default function EditJobPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [jobData, setJobData]   = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        // TODO: replace with real API call
        // const res = await privateApi.get(`/recruiter/jobs/${id}/`);
        // setJobData(res.data);
        console.log("Fetching job:", id);

        // Placeholder until API is wired
        setJobData({
          title: "", location: "", employment_type: "", work_mode: "",
          vacancies: "", description: "", experience_required: "",
          skills_required: [], responsibilities: [],
        });
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
      // TODO: await privateApi.patch(`/recruiter/jobs/${id}/`, data);
      console.log("Saving edits:", data);
      toast.success("Job updated successfully!");
      navigate("/recruiter/my-job-posts");
    } catch (err) {
      console.error(err);
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
