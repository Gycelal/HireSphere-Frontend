import { useState, useRef, useEffect, forwardRef } from "react";
import ProfileCompletionBar from "../../components/common/ProfileCompletionBar";
import { privateApi } from "../../services/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { recruiterProfileValidationSchema } from "../../validation/ProfileValidationSchemas";
import { RECRUITER_TYPES } from "../../constants/RecruiterProfileConstants";
import toast from "react-hot-toast";

import AvatarManager from "../../components/common/profile/AvatarManager";
import ViewField from "../../components/common/data-display/ViewField";
import SectionCard from "../../components/common/ui/SectionCard";
import FieldLabel from "../../components/common/form/FieldLabel";
import TextInput from "../../components/common/form/TextInput";
import SelectInput from "../../components/common/form/SelectInput";

// ── RecruiterProfilePage
export default function RecruiterProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [profileData, setProfileData] = useState(null);
  const firstFieldRef = useRef(null);


  const profileForm = useForm({
    resolver: zodResolver(recruiterProfileValidationSchema),
    mode: "onTouched",
    reValidationMode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      profile: {
        display_name: "",
        profile_picture: "",
        recruiter_type: "",
        company_or_brand_name: "",
        website_url: "",
        location: "",
      },
    },
  });

  // function to get profile information from backend and set to form data
  const getProfileData = async () => {
    try {
      const response = await privateApi.get("/recruiter/profile/");
      console.log("Profile data fetched:", response.data);
      profileForm.reset(response?.data);
      setCompletionPercentage(response?.data?.completion_percentage || 0);
      setProfileData(response?.data);
    } catch (error) {
      console.log("Error fetching profile data:", error);
    }
  };
  // function to save profile information to backend from form data
  const handleSave = async (data) => {
    try {
      const response = await privateApi.patch(
        "/recruiter/profile/",
        data,
      );
      console.log("Profile data saved:", response.data);
      toast.success("Profile updated successfully!");
      setProfileData(response.data);
      setCompletionPercentage(response.data.completion_percentage || 0);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile data:", error);
      
      if (error.response && error.response.status === 400) {
        const errors = error.response.data;
        let hasFieldErrors = false;

        //for handling flat errors and non_field_errors
        Object.keys(errors).forEach((key) => {
          if (key === "non_field_errors") {
            toast.error(Array.isArray(errors[key]) ? errors[key][0] : errors[key]);
          } else if (key !== "profile") {
            profileForm.setError(key, {
              type: "server",
              message: Array.isArray(errors[key]) ? errors[key][0] : errors[key],
            });
            hasFieldErrors = true;
          }
        });

        // Handle nested profile errors
        if (errors.profile && typeof errors.profile === "object") {
          Object.keys(errors.profile).forEach((nestedKey) => {
            if (nestedKey === "non_field_errors") {
              toast.error(
                Array.isArray(errors.profile[nestedKey])
                  ? errors.profile[nestedKey][0]
                  : errors.profile[nestedKey]
              );
            } else {
              profileForm.setError(`profile.${nestedKey}`, {
                type: "server",
                message: Array.isArray(errors.profile[nestedKey])
                  ? errors.profile[nestedKey][0]
                  : errors.profile[nestedKey],
              });
              hasFieldErrors = true;
            }
          });
        }

        if (hasFieldErrors) {
          toast.error("Please fix the errors in the form.");
        }
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);

  // Scroll to Personal Info section when edit mode activates
  useEffect(() => {
    if (isEditing) {
      firstFieldRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [isEditing]);

  function handleEdit() {
    setIsEditing(true);
  }

  function handleCancel() {
    setIsEditing(false);
    profileForm.reset(profileData); // revert form to last saved state
  }

  // Avatar logic
  const savedAvatar = profileData?.profile?.profile_picture;
  const initials =
    `${profileData?.first_name?.[0] ?? ""}${profileData?.last_name?.[0] ?? ""}`.toUpperCase();

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

        {/* Edit Profile button — view mode only */}
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

      {/* ── Profile completion ── */}
      {profileData && completionPercentage < 100 && (
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

      <form onSubmit={profileForm.handleSubmit(handleSave)} noValidate>
        <div className="flex flex-col gap-5">
          {/* ── Profile picture card ── */}
          <AvatarManager
            savedAvatar={profileData?.profile?.profile_picture}
            initials={initials}
            displayName={profileData?.profile?.display_name || `${profileData?.first_name} ${profileData?.last_name}`}
            uploadEndpoint="/recruiter/profile/photo/"
            onSuccess={getProfileData}
          />

          {/* Scroll anchor — edit mode scrolls here ── */}
          <div ref={firstFieldRef} />

          {/* ── Personal information ── */}
          <SectionCard title="Personal Information" icon="person">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="firstName" required>
                  First Name
                </FieldLabel>
                {isEditing ? (
                  <TextInput
                    id="firstName"
                    {...profileForm.register("first_name")}
                    placeholder="Enter first name"
                  />
                ) : (
                  <ViewField value={profileData?.first_name} />
                )}
                {profileForm.formState.errors.first_name && (
                  <p className="mt-1.5 text-[0.7rem] text-red-600 dark:text-red-400 font-medium">
                    {profileForm.formState.errors.first_name.message}
                  </p>
                )}
              </div>

              <div>
                <FieldLabel htmlFor="lastName" required>
                  Last Name
                </FieldLabel>
                {isEditing ? (
                  <TextInput
                    id="lastName"
                    {...profileForm.register("last_name")}
                    placeholder="Enter last name"
                  />
                ) : (
                  <ViewField value={profileData?.last_name} />
                )}
                {profileForm.formState.errors.last_name && (
                  <p className="mt-1.5 text-[0.7rem] text-red-600 dark:text-red-400 font-medium">
                    {profileForm.formState.errors.last_name.message}
                  </p>
                )}
              </div>

              <div>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <ViewField value={profileData?.email} icon="email" />
                <p className="mt-1.5 text-[0.7rem] text-gray-400 dark:text-gray-500">
                  Change email from the settings.
                </p>
              </div>

              <div>
                <FieldLabel htmlFor="displayName">Display Name</FieldLabel>
                {isEditing ? (
                  <TextInput
                    id="displayName"
                    {...profileForm.register("profile.display_name")}
                    placeholder="How others see you"
                  />
                ) : (
                  <ViewField value={profileData?.profile?.display_name} />
                )}
                {profileForm.formState.errors.profile?.display_name && (
                  <p className="mt-1.5 text-[0.7rem] text-red-600 dark:text-red-400 font-medium">
                    {profileForm.formState.errors.profile?.display_name.message}
                  </p>
                )}
              </div>
            </div>
          </SectionCard>

          {/* ── Professional information ── */}
          <SectionCard title="Professional Information" icon="business_center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <FieldLabel htmlFor="recruiterType">Recruiter Type</FieldLabel>
                {isEditing ? (
                  <SelectInput
                    id="recruiterType"
                    {...profileForm.register("profile.recruiter_type")}
                    options={RECRUITER_TYPES}
                  />
                ) : (
                  <ViewField
                    value={
                      profileData?.profile?.recruiter_type
                        ? RECRUITER_TYPES.find(
                            (t) =>
                              t.value === profileData.profile.recruiter_type,
                          )?.label
                        : null
                    }
                    icon="work_outline"
                  />
                )}
                {profileForm.formState.errors.profile?.recruiter_type && (
                  <p className="mt-1.5 text-[0.7rem] text-red-600 dark:text-red-400 font-medium">
                    {
                      profileForm.formState.errors.profile?.recruiter_type
                        .message
                    }
                  </p>
                )}
              </div>

              <div>
                <FieldLabel htmlFor="company">Company / Brand Name</FieldLabel>
                {isEditing ? (
                  <TextInput
                    id="company"
                    {...profileForm.register("profile.company_or_brand_name")}
                    placeholder="e.g. Acme Corp"
                  />
                ) : (
                  <ViewField
                    value={profileData?.profile?.company_or_brand_name}
                    icon="business"
                  />
                )}
                {profileForm.formState.errors.profile
                  ?.company_or_brand_name && (
                  <p className="mt-1.5 text-[0.7rem] text-red-600 dark:text-red-400 font-medium">
                    {
                      profileForm.formState.errors.profile
                        ?.company_or_brand_name.message
                    }
                  </p>
                )}
              </div>

              <div>
                <FieldLabel htmlFor="website">Website URL</FieldLabel>
                {isEditing ? (
                  <TextInput
                    id="website"
                    type="url"
                    {...profileForm.register("profile.website_url")}
                    placeholder="https://yourcompany.com"
                  />
                ) : (
                  <ViewField
                    value={profileData?.profile?.website_url}
                    icon="link"
                  />
                )}
                {profileForm.formState.errors.profile?.website_url && (
                  <p className="mt-1.5 text-[0.7rem] text-red-600 dark:text-red-400 font-medium">
                    {profileForm.formState.errors.profile?.website_url.message}
                  </p>
                )}
              </div>

              <div>
                <FieldLabel htmlFor="location">Location</FieldLabel>
                {isEditing ? (
                  <TextInput
                    id="location"
                    {...profileForm.register("profile.location")}
                    placeholder="City, Country"
                  />
                ) : (
                  <ViewField
                    value={profileData?.profile?.location}
                    icon="location_on"
                  />
                )}
                {profileForm.formState.errors.profile?.location && (
                  <p className="mt-1.5 text-[0.7rem] text-red-600 dark:text-red-400 font-medium">
                    {profileForm.formState.errors.profile?.location.message}
                  </p>
                )}
              </div>
            </div>
          </SectionCard>

          {/* ── Action bar — edit mode only ── */}
          {isEditing && (
            <div
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3
              bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 px-6 py-4"
            >
              {/* Buttons */}
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
          )}
        </div>
      </form>
    </div>
  );
}
