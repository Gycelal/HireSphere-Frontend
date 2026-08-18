import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "../../store/slices/authSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { candidateProfileValidationSchema } from "../../validation/ProfileValidationSchemas";
import toast from "react-hot-toast";
import { privateApi } from "../../services/api";
import AvatarManager from "../../components/common/profile/AvatarManager";
import ResumeManager from "../../components/common/profile/ResumeManager";
import SectionCard from "../../components/common/ui/SectionCard";
import FieldLabel from "../../components/common/form/FieldLabel";
import TextInput from "../../components/common/form/TextInput";
import TextArea from "../../components/common/form/TextArea";
import TagInput from "../../components/common/form/TagInput";
import ViewField from "../../components/common/data-display/ViewField";
import CandidateProfileView from "../../components/common/profile/CandidateProfileView";

const CandidateProfile = () => {
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [profileData, setProfileData] = useState(null);
  const [skills, setSkills] = useState([]);
  const firstFieldRef = useRef(null);
  console.log("profile form data:", profileData);
  const profileForm = useForm({
    resolver: zodResolver(candidateProfileValidationSchema),
    mode: "onTouched",
    reValidationMode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      first_name: "",
      last_name: "",
      profile: {
        headline: "",
        qualification: "",
        experience_years: "",
        professional_skills: [],
      },
    },
  });

  const getProfileData = async () => {
    try {
      const response = await privateApi.get("/candidate/profile/");
      profileForm.reset(response?.data);
      setCompletionPercentage(response?.data?.completion_percentage || 0);
      setProfileData(response?.data);
      setSkills(response?.data?.profile?.professional_skills || []);
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  };

  const handleSave = async (data) => {
    try {
      const payload = {
        ...data,
        profile: {
          ...data.profile,
          professional_skills: skills,
          experience_years:
            data.profile.experience_years === ""
              ? null
              : Number(data.profile.experience_years),
        },
      };
      const response = await privateApi.patch("/candidate/profile/", payload);
      toast.success("Profile updated successfully!");
      setProfileData(response.data);
      setCompletionPercentage(response.data.completion_percentage || 0);
      setSkills(response.data?.profile?.professional_skills || []);
      setIsEditing(false);
      dispatch(fetchCurrentUser());
    } catch (error) {
      console.error("Error saving profile:", error);
      if (error.response?.status === 400) {
        const errors = error.response.data;
        let hasFieldErrors = false;
        Object.keys(errors).forEach((key) => {
          if (key === "non_field_errors") {
            toast.error(
              Array.isArray(errors[key]) ? errors[key][0] : errors[key],
            );
          } else if (key !== "profile") {
            profileForm.setError(key, {
              type: "server",
              message: Array.isArray(errors[key])
                ? errors[key][0]
                : errors[key],
            });
            hasFieldErrors = true;
          }
        });
        if (errors.profile && typeof errors.profile === "object") {
          Object.keys(errors.profile).forEach((nestedKey) => {
            profileForm.setError(`profile.${nestedKey}`, {
              type: "server",
              message: Array.isArray(errors.profile[nestedKey])
                ? errors.profile[nestedKey][0]
                : errors.profile[nestedKey],
            });
            hasFieldErrors = true;
          });
        }
        if (hasFieldErrors) toast.error("Fix the errors on the fields.");
      } else {
        toast.error("Updation Failed. Please try again.");
      }
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);

  // Scroll to Personal Info section when edit mode activates
  useEffect(() => {
    if (isEditing) {
      firstFieldRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isEditing]);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setSkills(profileData?.profile?.professional_skills || []);
    profileForm.reset(profileData);
  };

  const savedAvatar = profileData?.profile?.profile_picture;
  const initials =
    `${profileData?.first_name?.[0] ?? ""}${profileData?.last_name?.[0] ?? ""}`.toUpperCase();
  const errors = profileForm.formState.errors;

  const getSkillsErrorMessage = () => {
    const err = errors.profile?.professional_skills;
    if (!err) return null;
    if (err.message) return err.message;
    const firstElError = Object.values(err).find((e) => e?.message);
    return firstElError?.message || "Invalid skill(s) provided";
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            My Profile
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            {isEditing
              ? "You are editing your profile. Save or cancel when done."
              : "View and manage your personal and professional information."}
          </p>
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shrink-0
              text-violet-700 dark:text-violet-300
              bg-violet-50 dark:bg-violet-950/60
              border border-violet-200 dark:border-violet-800
              hover:bg-violet-100 dark:hover:bg-violet-900/40
              transition-all duration-200"
          >
            <span className="material-symbols-outlined text-[1rem]">edit</span>
            Edit Profile
          </button>
        )}
      </div>

      {/* Profile View or Profile Edit render */}
      {!isEditing ? (
        <CandidateProfileView
          profileData={profileData}
          completionPercentage={completionPercentage}
          showCompletionBar={true}
          readOnly={false}
          onAvatarSuccess={getProfileData}
          onResumeSuccess={getProfileData}
          avatarUploadEndpoint="/candidate/profile/photo/"
        />
      ) : (
        <form onSubmit={profileForm.handleSubmit(handleSave)} noValidate>
          <div className="flex flex-col gap-5">
            {/* profile picture and resume upload */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <AvatarManager
                savedAvatar={savedAvatar}
                initials={initials}
                displayName={`${profileData?.first_name ?? ""} ${profileData?.last_name ?? ""}`.trim()}
                uploadEndpoint="/candidate/profile/photo/"
                onSuccess={getProfileData}
              />

              <SectionCard title="Resume" icon="description">
                <ResumeManager
                  savedResume={
                    profileData?.profile?.resume_url ||
                    profileData?.profile?.resume
                  }
                  savedResumeFilename={profileData?.profile?.resume_filename}
                  onSuccess={getProfileData}
                />
              </SectionCard>
            </div>

            {/* Scroll anchor — edit mode scrolls here ── */}
            <div ref={firstFieldRef} />

            {/* ── Profile Details ── */}
            <SectionCard title="Profile Details" icon="person">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* First Name */}
                <div>
                  <FieldLabel htmlFor="firstName" required>
                    First Name
                  </FieldLabel>
                  <TextInput
                    id="firstName"
                    {...profileForm.register("first_name")}
                    placeholder="Enter first name"
                  />
                  {errors.first_name && (
                    <p className="mt-1.5 text-[0.7rem] text-red-600 dark:text-red-400 font-medium">
                      {errors.first_name.message}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <FieldLabel htmlFor="lastName" required>
                    Last Name
                  </FieldLabel>
                  <TextInput
                    id="lastName"
                    {...profileForm.register("last_name")}
                    placeholder="Enter last name"
                  />
                  {errors.last_name && (
                    <p className="mt-1.5 text-[0.7rem] text-red-600 dark:text-red-400 font-medium">
                      {errors.last_name.message}
                    </p>
                  )}
                </div>

                {/* Email — always read-only */}
                <div>
                  <FieldLabel htmlFor="email">Email Address</FieldLabel>
                  <ViewField value={profileData?.email} icon="email" />
                  <p className="mt-1.5 text-[0.7rem] text-gray-400 dark:text-gray-500">
                    Change email from the settings.
                  </p>
                </div>

                {/* Experience Years */}
                <div>
                  <FieldLabel htmlFor="experienceYears">
                    Years of Experience
                  </FieldLabel>
                  <TextInput
                    id="experienceYears"
                    type="number"
                    min="0"
                    max="60"
                    step="1"
                    {...profileForm.register("profile.experience_years")}
                    placeholder="e.g. 3"
                  />
                  {errors.profile?.experience_years && (
                    <p className="mt-1.5 text-[0.7rem] text-red-600 dark:text-red-400 font-medium">
                      {errors.profile.experience_years.message}
                    </p>
                  )}
                </div>

                {/* Headline */}
                <div>
                  <FieldLabel htmlFor="headline">Headline</FieldLabel>
                  <div className="relative">
                    <TextArea
                      id="headline"
                      {...profileForm.register("profile.headline")}
                      placeholder="e.g. Full-Stack Developer · React · Node.js"
                    />
                    <span className="absolute right-3 bottom-2 text-[0.65rem] text-gray-400 dark:text-gray-500 pointer-events-none">
                      {(profileForm.watch("profile.headline") || "").length}/150
                    </span>
                  </div>
                  {errors.profile?.headline && (
                    <p className="mt-1.5 text-[0.7rem] text-red-600 dark:text-red-400 font-medium">
                      {errors.profile.headline.message}
                    </p>
                  )}
                </div>

                {/* Qualification */}
                <div>
                  <FieldLabel htmlFor="qualification">Qualification</FieldLabel>
                  <TextArea
                    id="qualification"
                    {...profileForm.register("profile.qualification")}
                    placeholder="e.g. B.Tech Computer Science"
                  />
                  {errors.profile?.qualification && (
                    <p className="mt-1.5 text-[0.7rem] text-red-600 dark:text-red-400 font-medium">
                      {errors.profile.qualification.message}
                    </p>
                  )}
                </div>

                {/* Professional Skills */}
                <div className="sm:col-span-2">
                  <FieldLabel htmlFor="skills">Professional Skills</FieldLabel>
                  <TagInput
                    tags={skills}
                    onChange={(newSkills) => {
                      setSkills(newSkills);
                      profileForm.setValue(
                        "profile.professional_skills",
                        newSkills,
                        { shouldValidate: true },
                      );
                    }}
                    isEditing={isEditing}
                    placeholder="Type a skill and press Enter or comma…"
                  />
                  {getSkillsErrorMessage() && (
                    <p className="mt-1.5 text-[0.7rem] text-red-600 dark:text-red-400 font-medium">
                      {getSkillsErrorMessage()}
                    </p>
                  )}
                  <p className="mt-1.5 text-[0.7rem] text-gray-400 dark:text-gray-500">
                    Press Enter, Tab, or comma to add a skill. Backspace to
                    remove the last one.
                  </p>
                </div>
              </div>
            </SectionCard>

            {/* ── Action bar ── */}
            <div
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3
              bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 px-6 py-4"
            >
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold
                    text-gray-600 dark:text-gray-300
                    bg-gray-100 dark:bg-gray-800
                    hover:bg-gray-200 dark:hover:bg-gray-700
                    transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white
                    bg-violet-600 hover:bg-violet-700 active:bg-violet-800
                    transition-all duration-200
                    shadow-md shadow-violet-200 dark:shadow-violet-900/30"
                >
                  <span className="material-symbols-outlined text-[1rem]">
                    save
                  </span>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default CandidateProfile;
