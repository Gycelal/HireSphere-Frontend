import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { privateApi } from "../../services/api";
import PageHeader from "../../components/common/PageHeader";
import CandidateProfileView from "../../components/common/profile/CandidateProfileView";
import RecruiterProfileView from "../../components/common/profile/RecruiterProfileView";
import toast from "react-hot-toast";

const AdminUserProfilePage = () => {
  const { role, id } = useParams(); 
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(()=>{
      fetchUserProfile();
    },500);
    
  }, [id, role]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await privateApi.get(`/admin/users/${id}/`);
      setProfileData(response.data);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      toast.error("Failed to load user profile");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-6 items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="flex flex-col gap-6 items-center justify-center min-h-[50vh]">
        <p className="text-gray-500">Profile not found.</p>
        <button onClick={handleBack} className="text-violet-600 font-semibold hover:underline">
          Go Back
        </button>
      </div>
    );
  }

  // Determine role either from URL params or from the user data itself
  const displayRole = role || profileData.role || "candidate";

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page header ── */}
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={handleBack}
          className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200"
          title="Go Back"
        >
          <span className="material-symbols-outlined text-[1.2rem]">arrow_back</span>
        </button>
        <PageHeader
          title={`${displayRole === "recruiter" ? "Recruiter" : "Candidate"} Profile`}
          description={`Viewing profile details for ${profileData.first_name || ""} ${profileData.last_name || ""}`}
        />
      </div>

      {/* ── Profile View Render ── */}
      {displayRole === "recruiter" ? (
        <RecruiterProfileView
          profileData={profileData}
          completionPercentage={profileData.completion_percentage}
          showCompletionBar={false}
          readOnly={true}
        />
      ) : (
        <CandidateProfileView
          profileData={profileData}
          completionPercentage={profileData.completion_percentage}
          showCompletionBar={false}
          readOnly={true}
        />
      )}
    </div>
  );
};

export default AdminUserProfilePage;
