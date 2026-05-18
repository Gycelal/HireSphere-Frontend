import { useState, useRef, useEffect } from "react";
import ProfileCompletionBar from "../../components/common/ProfileCompletionBar";
import { privateApi } from "../../services/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { recruiterProfileValidationSchema } from "../../validation/ProfileValidationSchemas";
import { RECRUITER_TYPES } from "../../constants/RecruiterProfileConstants";
import CropModal from "../../utils/cropImage";
import ConfirmModal from "../../components/common/ConfirmModal";

// ── Avatar lightbox ───────────────────────────────────────────────────────────
function AvatarLightbox({ src, initials, onClose }) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative flex flex-col items-center gap-4">
        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute -top-3 -right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white shadow-lg transition-colors duration-150"
        >
          <span className="material-symbols-outlined text-[1.1rem]">close</span>
        </button>

        {/* Full-size image or initials */}
        <div className="w-64 h-64 rounded-3xl overflow-hidden bg-violet-100 dark:bg-violet-950 border-4 border-white dark:border-gray-800 shadow-2xl shadow-black/40 flex items-center justify-center">
          {src ? (
            <img
              src={src}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-7xl font-bold text-violet-600 dark:text-violet-400 select-none">
              {initials}
            </span>
          )}
        </div>

        <p className="text-xs text-white/60">
          Press Esc or click outside to close
        </p>
      </div>
    </div>
  );
}

//Reusable field components
function FieldLabel({ htmlFor, children, required }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide mb-1.5"
    >
      {children}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
  );
}

function TextInput({ id, placeholder, type = "text", ...props }) {
  return (
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      {...props}
      className="w-full px-4 py-2.5 rounded-xl text-sm
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-700
        text-gray-900 dark:text-white
        placeholder-gray-400 dark:placeholder-gray-600
        focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
        transition-all duration-200"
    />
  );
}

function SelectInput({ id, name, value, onChange, options }) {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2.5 pr-10 rounded-xl text-sm appearance-none cursor-pointer
          bg-white dark:bg-gray-900
          border border-gray-200 dark:border-gray-700
          text-gray-900 dark:text-white
          focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent
          transition-all duration-200"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[1rem] text-gray-400 dark:text-gray-500 pointer-events-none">
        expand_more
      </span>
    </div>
  );
}

// Section card wrapper
function SectionCard({ title, icon, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Section header */}
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <span className="material-symbols-outlined text-[1.1rem] text-violet-500">
          {icon}
        </span>
        <h2 className="text-sm font-semibold text-gray-800 dark:text-white">
          {title}
        </h2>
      </div>
      {/* Section body */}
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

// ── Read-only field display ───────────────────────────────────────────────────
function ViewField({ label, value, icon }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wide">
        {label}
      </span>
      <div className="flex items-center gap-2 py-2">
        {icon && (
          <span className="material-symbols-outlined text-[1rem] text-gray-400 dark:text-gray-500 shrink-0">
            {icon}
          </span>
        )}
        <span className="text-sm text-gray-800 dark:text-gray-200 break-all">
          {value || (
            <span className="text-gray-400 dark:text-gray-600 italic">
              Not set
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

// ── RecruiterProfilePage ──────────────────────────────────────────────────────
export default function RecruiterProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [profileData, setProfileData] = useState(null);
  const [draftAvatar, setDraftAvatar] = useState(null); // cropped but unsaved image
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [cropSrc, setCropSrc] = useState(null); // raw image waiting for crop
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [viewAvatar, setViewAvatar] = useState(false);
  const fileInputRef = useRef(null);

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
      const response = await privateApi.put(
        "/recruiter/profile/",
        profileForm.getValues(),
      );
      console.log("Profile data saved:", response.data);
    } catch (error) {
      console.log("Error saving profile data:", error);
    } finally {
      setIsEditing(false);
    }
  };

  useEffect(() => {
    getProfileData();
  }, []);

  // Handlers
  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Reset input so re-selecting the same file triggers onChange again
    e.target.value = "";
    const reader = new FileReader();
    reader.onload = (ev) => {
      setCropSrc(ev.target.result); // open crop modal with selected image
    };
    reader.readAsDataURL(file);
  }

  function handleCropApply(croppedDataUrl) {
    setDraftAvatar(croppedDataUrl); // set cropped result as draft
    setCropSrc(null); // close crop modal
  }

  function handleCropCancel() {
    setCropSrc(null); // discard, keep existing avatar
  }

  function handleCancelDraft() {
    setDraftAvatar(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function handleSaveAvatar() {
    if (!draftAvatar) return;
    setIsSavingAvatar(true);
    try {
      const currentValues = profileForm.getValues();
      const payload = {
        ...currentValues,
        profile: {
          ...currentValues.profile,
          profile_picture: draftAvatar,
        },
      };
      const response = await privateApi.put("/recruiter/profile/", payload);
      setProfileData(response.data);
      profileForm.reset(response.data);
      setDraftAvatar(null);
      console.log("Profile picture saved:", response.data);
    } catch (error) {
      console.error("Error saving profile picture:", error);
    } finally {
      setIsSavingAvatar(false);
    }
  }

  async function handleRemoveAvatar() {
    setShowRemoveModal(false);
    setIsSavingAvatar(true);
    try {
      const currentValues = profileForm.getValues();
      const payload = {
        ...currentValues,
        profile: {
          ...currentValues.profile,
          profile_picture: null,
        },
      };
      const response = await privateApi.put("/recruiter/profile/", payload);
      setProfileData(response.data);
      profileForm.reset(response.data);
      if (fileInputRef.current) fileInputRef.current.value = "";
      console.log("Profile picture removed:", response.data);
    } catch (error) {
      console.error("Error removing profile picture:", error);
    } finally {
      setIsSavingAvatar(false);
    }
  }

  function handleEdit() {
    setIsEditing(true);
  }

  function handleCancel() {
    setIsEditing(false);
    profileForm.reset(profileData); // revert form to last saved state
  }

  // Avatar logic
  const savedAvatar = profileData?.profile?.profile_picture;
  const displayAvatar = draftAvatar || savedAvatar;
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
      {completionPercentage < 100 && (
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
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
              {/* Avatar — click to view full size */}
              <div className="relative shrink-0">
                <button
                  type="button"
                  onClick={() => setViewAvatar(true)}
                  aria-label="View profile picture"
                  className="group relative w-20 h-20 rounded-2xl overflow-hidden
                    bg-violet-100 dark:bg-violet-950
                    border-2 border-violet-200 dark:border-violet-800
                    flex items-center justify-center
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                >
                  {displayAvatar ? (
                    <img
                      src={displayAvatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-bold text-violet-600 dark:text-violet-400 select-none">
                      {initials}
                    </span>
                  )}
                  {/* Hover overlay */}
                  <span
                    className="absolute inset-0 bg-black/40 flex items-center justify-center
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl"
                  >
                    <span className="material-symbols-outlined text-white text-[1.2rem]">
                      zoom_in
                    </span>
                  </span>
                </button>
                {/* Online dot */}
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-900" />
              </div>

              {/* Info + upload */}
              <div className="flex flex-col gap-1.5 min-w-0">
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {profileData?.profile?.display_name ||
                    `${profileData?.first_name} ${profileData?.last_name}`}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Photo is always changeable · JPG, PNG or WEBP · Max 2 MB
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {draftAvatar ? (
                    <>
                      {/* Draft State Buttons */}
                      <button
                        type="button"
                        onClick={handleSaveAvatar}
                        disabled={isSavingAvatar}
                        className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold
                          text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800
                          disabled:opacity-60 disabled:cursor-not-allowed
                          shadow-md shadow-violet-200 dark:shadow-violet-900/30 transition-all duration-200"
                      >
                        <span className="material-symbols-outlined text-[0.9rem]">
                          {isSavingAvatar ? "autorenew" : "save"}
                        </span>
                        {isSavingAvatar ? "Saving..." : "Save Photo"}
                      </button>

                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isSavingAvatar}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                          bg-violet-50 dark:bg-violet-950/60
                          text-violet-700 dark:text-violet-300
                          border border-violet-200 dark:border-violet-800
                          hover:bg-violet-100 dark:hover:bg-violet-900/40
                          transition-colors duration-200"
                      >
                        <span className="material-symbols-outlined text-[0.9rem]">
                          change_circle
                        </span>
                        Change Photo
                      </button>

                      <button
                        type="button"
                        onClick={handleCancelDraft}
                        disabled={isSavingAvatar}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                          text-red-500 dark:text-red-400
                          hover:bg-red-50 dark:hover:bg-red-950/40
                          transition-colors duration-200"
                      >
                        <span className="material-symbols-outlined text-[0.9rem]">
                          cancel
                        </span>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Viewing Saved State Buttons */}
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                          bg-violet-50 dark:bg-violet-950/60
                          text-violet-700 dark:text-violet-300
                          border border-violet-200 dark:border-violet-800
                          hover:bg-violet-100 dark:hover:bg-violet-900/40
                          transition-colors duration-200"
                      >
                        <span className="material-symbols-outlined text-[0.9rem]">
                          {savedAvatar ? "change_circle" : "upload"}
                        </span>
                        {savedAvatar ? "Change Photo" : "Upload Photo"}
                      </button>

                      {savedAvatar && (
                        <button
                          type="button"
                          onClick={() => setShowRemoveModal(true)}
                          disabled={isSavingAvatar}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                            text-red-500 dark:text-red-400
                            hover:bg-red-50 dark:hover:bg-red-950/40
                            transition-colors duration-200"
                        >
                          <span className="material-symbols-outlined text-[0.9rem]">
                            {isSavingAvatar ? "autorenew" : "delete"}
                          </span>
                          Remove Photo
                        </button>
                      )}
                    </>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>
          </div>

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
                <FieldLabel htmlFor="company">Company / Branch Name</FieldLabel>
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
      {/* ── Crop modal — shown immediately after file selection ── */}
      {cropSrc && (
        <CropModal
          imageSrc={cropSrc}
          onApply={handleCropApply}
          onCancel={handleCropCancel}
        />
      )}

      {/* ── Avatar lightbox (view-only) — triggered by clicking the avatar ── */}
      {viewAvatar && (
        <AvatarLightbox
          src={displayAvatar}
          initials={initials}
          onClose={() => setViewAvatar(false)}
        />
      )}

      {/* Remove Avatar Confirmation Modal */}
      {showRemoveModal && (
        <ConfirmModal
          open={showRemoveModal}
          title="Remove Profile Picture"
          message="Are you sure you want to remove your profile picture? This action cannot be undone."
          confirmText="Remove Photo"
          variant="danger"
          onConfirm={handleRemoveAvatar}
          onCancel={() => setShowRemoveModal(false)}
        />
      )}
    </div>
  );
}
