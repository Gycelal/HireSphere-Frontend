import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { privateApi } from "../../services/api";
import ProfileCompletionBar from "../../components/common/ProfileCompletionBar";
import AvatarManager from "../../components/common/profile/AvatarManager";
import SectionCard from "../../components/common/ui/SectionCard";
import FieldLabel from "../../components/common/form/FieldLabel";
import TextInput from "../../components/common/form/TextInput";
import ViewField from "../../components/common/data-display/ViewField";

// ── Validation Schema ────────────────────────────────────────────────────────
const candidateProfileSchema = z.object({
  first_name: z.string().min(1, "First name is required").max(50),
  last_name: z.string().min(1, "Last name is required").max(50),
  profile: z.object({
    display_name: z.string().max(80).optional(),
    headline: z.string().max(120, "Headline must be 120 characters or less").optional(),
    qualification: z.string().max(100).optional(),
    experience_years: z
      .union([z.coerce.number().int().min(0, "Must be a positive number").max(60), z.literal("")])
      .optional(),
  }),
});

// ── Skills Tag Input ─────────────────────────────────────────────────────────
const SkillsTagInput = ({ skills, onChange, isEditing }) => {
  const [inputVal, setInputVal] = useState("");
  const inputRef = useRef(null);

  const addSkill = (val) => {
    const trimmed = val.trim();
    if (!trimmed || skills.includes(trimmed)) return;
    onChange([...skills, trimmed]);
    setInputVal("");
  };

  const removeSkill = (skill) => onChange(skills.filter((s) => s !== skill));

  const handleKeyDown = (e) => {
    if (["Enter", ",", "Tab"].includes(e.key)) {
      e.preventDefault();
      addSkill(inputVal);
    } else if (e.key === "Backspace" && !inputVal && skills.length > 0) {
      removeSkill(skills[skills.length - 1]);
    }
  };

  if (!isEditing) {
    return (
      <div className="flex flex-wrap gap-2 py-2">
        {skills.length > 0 ? (
          skills.map((s) => (
            <span
              key={s}
              className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold
                bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300
                border border-violet-200 dark:border-violet-800"
            >
              {s}
            </span>
          ))
        ) : (
          <span className="text-sm text-gray-400 dark:text-gray-600 italic">Not set</span>
        )}
      </div>
    );
  }

  return (
    <div
      className="flex flex-wrap gap-2 w-full min-h-[44px] px-3 py-2 rounded-xl
        bg-white dark:bg-gray-900
        border border-gray-200 dark:border-gray-700
        focus-within:ring-2 focus-within:ring-violet-500 focus-within:border-transparent
        transition-all duration-200 cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {skills.map((s) => (
        <span
          key={s}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold
            bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300
            border border-violet-200 dark:border-violet-800"
        >
          {s}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); removeSkill(s); }}
            className="ml-0.5 text-violet-400 hover:text-red-500 transition-colors"
            aria-label={`Remove ${s}`}
          >
            <span className="material-symbols-outlined text-[0.85rem]">close</span>
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => inputVal.trim() && addSkill(inputVal)}
        placeholder={skills.length === 0 ? "Type a skill and press Enter or comma…" : "Add more…"}
        className="flex-1 min-w-[140px] bg-transparent text-sm text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-600 outline-none"
      />
    </div>
  );
};

// ── Resume Manager ───────────────────────────────────────────────────────────
const ResumeManager = ({ savedResume, onSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const fileInputRef = useRef(null);

  const validateAndUpload = async (file) => {
    if (!file) return;
    const allowed = ["application/pdf", "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (!allowed.includes(file.type)) {
      toast.error("Only PDF or Word documents are allowed.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File must be under 5 MB.");
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);
      await privateApi.patch("/candidate/profile/resume/", formData);
      toast.success("Resume uploaded successfully!");
      if (onSuccess) await onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Resume upload failed. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    setIsRemoving(true);
    try {
      await privateApi.delete("/candidate/profile/resume/");
      toast.success("Resume removed.");
      if (onSuccess) await onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove resume.");
    } finally {
      setIsRemoving(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndUpload(file);
  };

  const resumeFileName = savedResume
    ? savedResume.split("/").pop().split("?")[0]
    : null;

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative rounded-2xl border-2 border-dashed p-6 transition-all duration-200
        ${isDragging
          ? "border-violet-400 bg-violet-50 dark:bg-violet-950/30"
          : "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50"
        }`}
    >
      {savedResume ? (
        /* ── Saved state ── */
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/60 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-violet-600 dark:text-violet-400 text-[1.2rem]">
                description
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-white truncate">
                {resumeFileName}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Resume on file</p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={savedResume}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300
                border border-violet-200 dark:border-violet-800
                hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors duration-200"
            >
              <span className="material-symbols-outlined text-[0.9rem]">open_in_new</span>
              View
            </a>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300
                border border-violet-200 dark:border-violet-800
                hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-colors duration-200"
            >
              <span className="material-symbols-outlined text-[0.9rem]">change_circle</span>
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              disabled={isRemoving}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                text-red-500 dark:text-red-400
                hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors duration-200"
            >
              <span className="material-symbols-outlined text-[0.9rem]">
                {isRemoving ? "autorenew" : "delete"}
              </span>
              {isRemoving ? "Removing…" : "Remove"}
            </button>
          </div>
        </div>
      ) : (
        /* ── Empty state ── */
        <div className="flex flex-col items-center gap-3 text-center py-2">
          <div className="w-12 h-12 rounded-2xl bg-violet-100 dark:bg-violet-950/60 flex items-center justify-center">
            <span className="material-symbols-outlined text-violet-500 text-[1.5rem]">
              {isUploading ? "autorenew" : "upload_file"}
            </span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800 dark:text-white">
              {isUploading ? "Uploading…" : "Upload your resume"}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
              PDF or Word · Max 5 MB · Drag & drop or click to browse
            </p>
          </div>
          {!isUploading && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                text-violet-700 dark:text-violet-300
                bg-violet-50 dark:bg-violet-950/60
                border border-violet-200 dark:border-violet-800
                hover:bg-violet-100 dark:hover:bg-violet-900/40 transition-all duration-200"
            >
              <span className="material-symbols-outlined text-[1rem]">folder_open</span>
              Browse File
            </button>
          )}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={(e) => validateAndUpload(e.target.files?.[0])}
      />
    </div>
  );
};

// ── CandidateProfile Page ────────────────────────────────────────────────────
const CandidateProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [profileData, setProfileData] = useState(null);
  const [skills, setSkills] = useState([]);

  const profileForm = useForm({
    resolver: zodResolver(candidateProfileSchema),
    mode: "onTouched",
    reValidationMode: "onChange",
    shouldFocusError: true,
    defaultValues: {
      first_name: "",
      last_name: "",
      profile: {
        display_name: "",
        headline: "",
        qualification: "",
        experience_years: "",
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
          experience_years: data.profile.experience_years === "" ? null : Number(data.profile.experience_years),
        },
      };
      const response = await privateApi.patch("/candidate/profile/", payload);
      toast.success("Profile updated successfully!");
      setProfileData(response.data);
      setCompletionPercentage(response.data.completion_percentage || 0);
      setSkills(response.data?.profile?.professional_skills || []);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
      if (error.response?.status === 400) {
        const errors = error.response.data;
        let hasFieldErrors = false;
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
        if (hasFieldErrors) toast.error("Please fix the errors in the form.");
      } else {
        toast.error("Failed to update profile. Please try again.");
      }
    }
  };

  useEffect(() => { getProfileData(); }, []);

  const handleEdit = () => setIsEditing(true);
  const handleCancel = () => {
    setIsEditing(false);
    setSkills(profileData?.profile?.professional_skills || []);
    profileForm.reset(profileData);
  };

  const savedAvatar = profileData?.profile?.profile_picture;
  const initials = `${profileData?.first_name?.[0] ?? ""}${profileData?.last_name?.[0] ?? ""}`.toUpperCase();
  const errors = profileForm.formState.errors;

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

      {/* ── Profile completion ── */}
      {completionPercentage < 100 && (
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

      <form onSubmit={profileForm.handleSubmit(handleSave)} noValidate>
        <div className="flex flex-col gap-5">

          {/* ── Profile picture ── */}
          <AvatarManager
            savedAvatar={savedAvatar}
            initials={initials}
            displayName={
              profileData?.profile?.display_name ||
              `${profileData?.first_name ?? ""} ${profileData?.last_name ?? ""}`.trim()
            }
            uploadEndpoint="/candidate/profile/photo/"
            onSuccess={getProfileData}
          />

          {/* ── Resume ── */}
          <SectionCard title="Resume" icon="description">
            <ResumeManager
              savedResume={profileData?.profile?.resume}
              onSuccess={getProfileData}
            />
          </SectionCard>

          {/* ── Personal Information ── */}
          <SectionCard title="Personal Information" icon="person">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* First Name */}
              <div>
                <FieldLabel htmlFor="firstName" required>First Name</FieldLabel>
                {isEditing ? (
                  <TextInput
                    id="firstName"
                    {...profileForm.register("first_name")}
                    placeholder="Enter first name"
                  />
                ) : (
                  <ViewField value={profileData?.first_name} />
                )}
                {errors.first_name && (
                  <p className="mt-1.5 text-[0.7rem] text-red-600 dark:text-red-400 font-medium">
                    {errors.first_name.message}
                  </p>
                )}
              </div>

              {/* Last Name */}
              <div>
                <FieldLabel htmlFor="lastName" required>Last Name</FieldLabel>
                {isEditing ? (
                  <TextInput
                    id="lastName"
                    {...profileForm.register("last_name")}
                    placeholder="Enter last name"
                  />
                ) : (
                  <ViewField value={profileData?.last_name} />
                )}
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

              {/* Display Name */}
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
                {errors.profile?.display_name && (
                  <p className="mt-1.5 text-[0.7rem] text-red-600 dark:text-red-400 font-medium">
                    {errors.profile.display_name.message}
                  </p>
                )}
              </div>
            </div>
          </SectionCard>

          {/* ── Professional Information ── */}
          <SectionCard title="Professional Information" icon="business_center">
            <div className="flex flex-col gap-4">

              {/* Headline — full width, stands out */}
              <div>
                <FieldLabel htmlFor="headline">Headline</FieldLabel>
                {isEditing ? (
                  <div className="relative">
                    <TextInput
                      id="headline"
                      {...profileForm.register("profile.headline")}
                      placeholder="e.g. Full-Stack Developer · React · Node.js"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[0.65rem] text-gray-400 dark:text-gray-500 pointer-events-none">
                      {(profileForm.watch("profile.headline") || "").length}/120
                    </span>
                  </div>
                ) : (
                  <ViewField
                    value={profileData?.profile?.headline}
                    icon="badge"
                  />
                )}
                {errors.profile?.headline && (
                  <p className="mt-1.5 text-[0.7rem] text-red-600 dark:text-red-400 font-medium">
                    {errors.profile.headline.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Qualification */}
                <div>
                  <FieldLabel htmlFor="qualification">Qualification</FieldLabel>
                  {isEditing ? (
                    <TextInput
                      id="qualification"
                      {...profileForm.register("profile.qualification")}
                      placeholder="e.g. B.Tech Computer Science"
                    />
                  ) : (
                    <ViewField
                      value={profileData?.profile?.qualification}
                      icon="school"
                    />
                  )}
                  {errors.profile?.qualification && (
                    <p className="mt-1.5 text-[0.7rem] text-red-600 dark:text-red-400 font-medium">
                      {errors.profile.qualification.message}
                    </p>
                  )}
                </div>

                {/* Experience Years */}
                <div>
                  <FieldLabel htmlFor="experienceYears">Years of Experience</FieldLabel>
                  {isEditing ? (
                    <TextInput
                      id="experienceYears"
                      type="number"
                      min="0"
                      max="60"
                      step="1"
                      {...profileForm.register("profile.experience_years")}
                      placeholder="e.g. 3"
                    />
                  ) : (
                    <ViewField
                      value={
                        profileData?.profile?.experience_years != null
                          ? `${profileData.profile.experience_years} ${profileData.profile.experience_years === 1 ? "year" : "years"}`
                          : null
                      }
                      icon="work_history"
                    />
                  )}
                  {errors.profile?.experience_years && (
                    <p className="mt-1.5 text-[0.7rem] text-red-600 dark:text-red-400 font-medium">
                      {errors.profile.experience_years.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Professional Skills — full width tag input */}
              <div>
                <FieldLabel htmlFor="skills">Professional Skills</FieldLabel>
                <SkillsTagInput
                  skills={skills}
                  onChange={setSkills}
                  isEditing={isEditing}
                />
                {isEditing && (
                  <p className="mt-1.5 text-[0.7rem] text-gray-400 dark:text-gray-500">
                    Press Enter, Tab, or comma to add a skill. Backspace to remove the last one.
                  </p>
                )}
              </div>
            </div>
          </SectionCard>

          {/* ── Action bar — edit mode only ── */}
          {isEditing && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3
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
                  <span className="material-symbols-outlined text-[1rem]">save</span>
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </form>
    </div>
  );
};

export default CandidateProfile;
