import ProfileCompletionBar from "../ProfileCompletionBar";
import AvatarManager from "./AvatarManager";
import SectionCard from "../ui/SectionCard";
import FieldLabel from "../form/FieldLabel";
import ViewField from "../data-display/ViewField";
import { RECRUITER_TYPES } from "../../../constants/RecruiterProfileConstants";
import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { fetchCurrentUser } from "../../../store/slices/authSlice";
import toast from "react-hot-toast";

const RecruiterProfileView = ({ 
  profileData, 
  completionPercentage, 
  showCompletionBar = false,
  readOnly = false,
  onAvatarSuccess,
  avatarUploadEndpoint
}) => {
  const [checkingStatus, setCheckingStatus] = useState(false);
  const dispatch = useDispatch();
  const savedAvatar = profileData?.profile?.profile_picture;
  const initials = `${profileData?.first_name?.[0] ?? ""}${profileData?.last_name?.[0] ?? ""}`.toUpperCase();

  const userState = useSelector((state)=> state.auth.user)

  const handleCheckStatus = async () => {
    try {
      setCheckingStatus(true);
      const result = await dispatch(fetchCurrentUser()).unwrap();
      const status = result?.approval_status || result?.user?.approval_status;
      if (status !== "approved") {
        toast("Your account is currently pending admin review.", {
          icon: (
            <span className="material-symbols-outlined text-amber-500 text-[1.25rem]">
              hourglass_top
            </span>
          ),
        });
      }
    } catch (error) {
      toast.error("Failed to check status. Please try again.");
    } finally {
      setCheckingStatus(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Pending Approval Banner */}
      {!readOnly && userState?.role === "recruiter" && userState?.approval_status !== "approved" && (
        <div className="bg-amber-50 dark:bg-amber-950/30 rounded-2xl border border-amber-200 dark:border-amber-800 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[1.4rem] text-amber-600 dark:text-amber-400 shrink-0 mt-0.5">
              hourglass_top
            </span>
            <div className="flex flex-col gap-0.5">
              <h3 className="text-sm font-bold text-amber-900 dark:text-amber-200">
                Pending Admin Approval
              </h3>
              <p className="text-xs text-amber-700 dark:text-amber-300">
                Your recruiter account is under review by the administrator. Full access to job postings and candidate tools will unlock upon approval.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCheckStatus}
            disabled={checkingStatus}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold shrink-0
              bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white
              disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm"
          >
            <span className={`material-symbols-outlined text-[1rem] ${checkingStatus ? "animate-spin" : ""}`}>
              {checkingStatus ? "progress_activity" : "refresh"}
            </span>
            {checkingStatus ? "Checking..." : "Check Status"}
          </button>
        </div>
      )}
      {/* Profile completion */}
      {showCompletionBar && profileData && completionPercentage < 100 && (
        <>
          <div className="bg-yellow-50 dark:bg-yellow-950/30 rounded-2xl border border-yellow-200 dark:border-yellow-800 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[1.2rem] text-yellow-600">
                warning
              </span>
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                Your profile is {completionPercentage}% complete. Add more
                information to show your authentic self and get approved by the
                Admin team faster!
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 px-6 py-4">
            <ProfileCompletionBar percent={completionPercentage} showItems />
          </div>
        </>
      )}

      <div className="flex flex-col gap-5">
        <AvatarManager
          savedAvatar={savedAvatar}
          initials={initials}
          displayName={profileData?.profile?.display_name || `${profileData?.first_name} ${profileData?.last_name}`}
          readOnly={readOnly}
          uploadEndpoint={avatarUploadEndpoint}
          onSuccess={onAvatarSuccess}
        />

        {/* Personal information */}
        <SectionCard title="Personal Information" icon="person">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel htmlFor="firstName">First Name</FieldLabel>
              <ViewField value={profileData?.first_name} />
            </div>

            <div>
              <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
              <ViewField value={profileData?.last_name} />
            </div>

            <div>
              <FieldLabel htmlFor="email">Email Address</FieldLabel>
              <ViewField value={profileData?.email} icon="email" />
            </div>

            <div>
              <FieldLabel htmlFor="displayName">Display Name</FieldLabel>
              <ViewField value={profileData?.profile?.display_name} />
            </div>
          </div>
        </SectionCard>

        {/* Professional information */}
        <SectionCard title="Professional Information" icon="business_center">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <FieldLabel htmlFor="recruiterType">Recruiter Type</FieldLabel>
              <ViewField
                value={
                  profileData?.profile?.recruiter_type
                    ? RECRUITER_TYPES.find(
                        (t) => t.value === profileData.profile.recruiter_type
                      )?.label
                    : null
                }
                icon="work_outline"
              />
            </div>

            <div>
              <FieldLabel htmlFor="company">Company / Brand Name</FieldLabel>
              <ViewField
                value={profileData?.profile?.company_or_brand_name}
                icon="business"
              />
            </div>

            <div>
              <FieldLabel htmlFor="website">Website URL</FieldLabel>
              <ViewField
                value={profileData?.profile?.website_url}
                icon="link"
              />
            </div>

            <div>
              <FieldLabel htmlFor="location">Location</FieldLabel>
              <ViewField
                value={profileData?.profile?.location}
                icon="location_on"
              />
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default RecruiterProfileView;
