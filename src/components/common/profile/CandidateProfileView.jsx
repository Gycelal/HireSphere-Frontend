import ProfileCompletionBar from "../ProfileCompletionBar";
import AvatarManager from "./AvatarManager";
import ResumeManager from "./ResumeManager";
import SectionCard from "../ui/SectionCard";
import FieldLabel from "../form/FieldLabel";
import ViewField from "../data-display/ViewField";
import TagList from "../data-display/TagList";

const CandidateProfileView = ({ 
  profileData, 
  completionPercentage, 
  showCompletionBar = false,
  readOnly = false,
  onAvatarSuccess,
  onResumeSuccess,
  avatarUploadEndpoint
}) => {
  const savedAvatar = profileData?.profile?.profile_picture;
  const initials = `${profileData?.first_name?.[0] ?? ""}${profileData?.last_name?.[0] ?? ""}`.toUpperCase();
  const skills = profileData?.profile?.professional_skills || [];
  console.log("profileData",profileData)
  return (
    <div className="flex flex-col gap-6">
      {showCompletionBar && profileData && completionPercentage < 100 && (
        <>
          <div className="bg-yellow-50 dark:bg-yellow-950/30 rounded-2xl border border-yellow-200 dark:border-yellow-800 px-6 py-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[1.2rem] text-yellow-600">warning</span>
              <p className="text-sm text-yellow-800 dark:text-yellow-300">
                Your profile is {completionPercentage}% complete. Complete your profile to get discovered by top recruiters!
              </p>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 px-6 py-4">
            <ProfileCompletionBar percent={completionPercentage} showItems />
          </div>
        </>
      )}

      <div className="flex flex-col gap-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AvatarManager
            savedAvatar={savedAvatar}
            initials={initials}
            displayName={`${profileData?.first_name ?? ""} ${profileData?.last_name ?? ""}`.trim()}
            readOnly={readOnly}
            uploadEndpoint={avatarUploadEndpoint}
            onSuccess={onAvatarSuccess}
          />

          <SectionCard title="Resume" icon="description">
            <ResumeManager
              savedResume={profileData?.profile?.default_resume?.file_url}
              savedResumeFilename={profileData?.profile?.default_resume?.file_name}
              readOnly={readOnly}
              onSuccess={onResumeSuccess}
            />
          </SectionCard>
        </div>

        <SectionCard title="Profile Details" icon="person">
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
              <FieldLabel htmlFor="experienceYears">Years of Experience</FieldLabel>
              <ViewField
                value={
                  profileData?.profile?.experience_years != null
                    ? `${profileData.profile.experience_years} ${profileData.profile.experience_years === 1 ? "year" : "years"}`
                    : null
                }
                icon="work_history"
              />
            </div>

            <div>
              <FieldLabel htmlFor="headline">Headline</FieldLabel>
              <ViewField value={profileData?.profile?.headline} icon="badge" />
            </div>

            <div>
              <FieldLabel htmlFor="qualification">Qualification</FieldLabel>
              <ViewField value={profileData?.profile?.qualification} icon="school" />
            </div>

            <div className="sm:col-span-2">
              <FieldLabel htmlFor="skills">Professional Skills</FieldLabel>
              <TagList tags={skills} placeHolder="No skills added"/>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
};

export default CandidateProfileView;
