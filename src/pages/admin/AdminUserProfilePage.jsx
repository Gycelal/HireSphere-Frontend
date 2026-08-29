import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { privateApi } from "../../services/api";
import PageHeader from "../../components/common/PageHeader";
import CandidateProfileView from "../../components/common/profile/CandidateProfileView";
import RecruiterProfileView from "../../components/common/profile/RecruiterProfileView";
import PageSkeleton from "../../components/common/ui/PageSkeleton";
import ErrorState from "../../components/common/error-components/ErrorState";
import ConfirmModal from "../../components/common/ConfirmModal";
import { formatDate } from "../../utils/dateUtils";
import toast from "react-hot-toast";

const AdminUserProfilePage = () => {
  const { role, id } = useParams(); 
  const navigate = useNavigate();
  const location = useLocation();
  
  const isApprovalView = location.pathname.includes("/admin/recruiter-approvals");

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUserProfile();
    }, 500);

    return () => clearTimeout(timer);
  }, [id, role]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await privateApi.get(`/admin/users/${id}/`);
      console.log("user profile data:", response)
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

  const handleTriggerApproval = (actionType) => {
    setModalAction(actionType);
    setOpenModal(true);
  };

  const handleTriggerStatusChange = () => {
    setModalAction(profileData?.is_active ? "suspend" : "activate");
    setOpenModal(true);
  };

  const handleConfirmAction = async () => {
    try {
      if (modalAction === "approve" || modalAction === "reject") {
        await privateApi.patch(`admin/recruiters/${id}/approval/`, {
          action: modalAction,
        });
        toast.success(`Recruiter ${modalAction}d successfully!`);
        const updatedStatus = modalAction === "approve" ? "approved" : "rejected";
        setProfileData((prev) => ({
          ...prev,
          approval_status: updatedStatus,
        }));
      } else if (modalAction === "suspend" || modalAction === "activate") {
        const newStatus = modalAction === "activate";
        await privateApi.patch(`admin/users/${id}/`, {
          is_active: newStatus,
        });
        toast.success(`User successfully ${newStatus ? "activated" : "suspended"}!`);
        setProfileData((prev) => ({
          ...prev,
          is_active: newStatus,
        }));
      }
      setOpenModal(false);
      setModalAction(null);
    } catch (error) {
      console.error("Action error:", error);
      toast.error(error?.response?.data?.message || `Failed to ${modalAction} user.`);
    }
  };

  if (loading) {
    return <PageSkeleton hasSidebar={false} cardsCount={2} />;
  }

  if (!profileData) {
    return (
      <ErrorState
        onBack={handleBack}
        title="Profile Not Found"
        message="Could not find user profile details."
        icon="person_off"
      />
    );
  }

  // Determine role either from context or from the user data
  const displayRole = isApprovalView ? "recruiter" : role || profileData.role || "candidate";

  // Extract recruiter approval status from profileData
  const recruiterApprovalStatus = (profileData?.approval_status || "").toLowerCase();

  const isPendingApproval = recruiterApprovalStatus === "pending";

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 shrink-0"
            title="Go Back"
          >
            <span className="material-symbols-outlined text-[1.2rem]">arrow_back</span>
          </button>
          <PageHeader
            title={`${displayRole === "recruiter" ? "Recruiter" : "Candidate"} Profile`}
            description={`Viewing profile details for ${profileData.first_name || ""} ${profileData.last_name || ""}`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-center">
          {/* Joined Date Badge */}
          {profileData?.date_joined && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-50 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700/80">
              <span className="material-symbols-outlined text-[1rem] text-gray-400 dark:text-gray-500">
                calendar_today
              </span>
              Joined {formatDate(profileData.date_joined)}
            </span>
          )}

          {isApprovalView ? (
            <>
              {/* Approval Status Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                  recruiterApprovalStatus === "approved"
                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800"
                    : recruiterApprovalStatus === "rejected"
                    ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800"
                    : "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800"
                }`}
              >
                <span className="material-symbols-outlined text-[1rem]">
                  {recruiterApprovalStatus === "approved"
                    ? "check_circle"
                    : recruiterApprovalStatus === "rejected"
                    ? "cancel"
                    : "schedule"}
                </span>
                {recruiterApprovalStatus.charAt(0).toUpperCase() + recruiterApprovalStatus.slice(1)}
              </span>

              {/* Only show Approve and Reject buttons when status is PENDING */}
              {isPendingApproval && (
                <>
                  {/* Approve Button */}
                  <button
                    onClick={() => handleTriggerApproval("approve")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-green-600 hover:bg-green-700 active:bg-green-800 text-white shadow-sm transition-all duration-150"
                  >
                    <span className="material-symbols-outlined text-[1.1rem]">check_circle</span>
                    Approve
                  </button>

                  {/* Reject Button */}
                  <button
                    onClick={() => handleTriggerApproval("reject")}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-red-600 hover:bg-red-700 active:bg-red-800 text-white shadow-sm transition-all duration-150"
                  >
                    <span className="material-symbols-outlined text-[1.1rem]">cancel</span>
                    Reject
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              {/* Account Active / Suspended Badge */}
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
                  profileData.is_active
                    ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/40 dark:text-green-400 dark:border-green-800"
                    : "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-800"
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${profileData.is_active ? "bg-green-500" : "bg-red-500"}`} />
                {profileData.is_active ? "Active" : "Suspended"}
              </span>

              {/* Suspend / Activate Button */}
              <button
                onClick={handleTriggerStatusChange}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150 shadow-sm text-white ${
                  profileData.is_active
                    ? "bg-red-600 hover:bg-red-700 active:bg-red-800"
                    : "bg-green-600 hover:bg-green-700 active:bg-green-800"
                }`}
              >
                <span className="material-symbols-outlined text-[1.1rem]">
                  {profileData.is_active ? "block" : "check_circle"}
                </span>
                {profileData.is_active ? "Suspend User" : "Activate User"}
              </button>
            </>
          )}
        </div>
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

      {/* ── Confirmation Modal ── */}
      <ConfirmModal
        open={openModal}
        title={
          modalAction === "approve"
            ? "Approve Recruiter?"
            : modalAction === "reject"
            ? "Reject Recruiter?"
            : modalAction === "activate"
            ? "Activate User?"
            : "Suspend User?"
        }
        message={`Are you sure you want to ${modalAction} this ${isApprovalView ? "recruiter" : "user"}?`}
        confirmText={modalAction ? modalAction.charAt(0).toUpperCase() + modalAction.slice(1) : "Confirm"}
        variant={modalAction === "approve" || modalAction === "activate" ? "success" : "danger"}
        onCancel={() => {
          setOpenModal(false);
          setModalAction(null);
        }}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

export default AdminUserProfilePage;
