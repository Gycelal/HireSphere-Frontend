import { useState, useRef, useEffect } from "react";
import ProfileCompletionBar from "../../components/common/ProfileCompletionBar";

// ── Avatar lightbox ───────────────────────────────────────────────────────────
function AvatarLightbox({ src, initials, onClose }) {
  useEffect(() => {
    function onKey(e) { if (e.key === "Escape") onClose(); }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/70 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
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
            <img src={src} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <span className="text-7xl font-bold text-violet-600 dark:text-violet-400 select-none">
              {initials}
            </span>
          )}
        </div>

        <p className="text-xs text-white/60">Press Esc or click outside to close</p>
      </div>
    </div>
  );
}

// ── Reusable field components ─────────────────────────────────────────────────

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

function TextInput({ id, name, value, onChange, placeholder, disabled, type = "text" }) {
  if (disabled) {
    return (
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          disabled
          readOnly
          className="w-full px-4 py-2.5 rounded-xl text-sm
            bg-gray-50 dark:bg-gray-800/60
            border border-gray-200 dark:border-gray-700
            text-gray-400 dark:text-gray-500
            cursor-not-allowed select-none"
        />
        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[1rem] text-gray-300 dark:text-gray-600 pointer-events-none">
          lock
        </span>
      </div>
    );
  }

  return (
    <input
      id={id}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
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

// ── Section card wrapper ──────────────────────────────────────────────────────
function SectionCard({ title, icon, children }) {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
      {/* Section header */}
      <div className="flex items-center gap-2.5 px-6 py-4 border-b border-gray-100 dark:border-gray-800">
        <span className="material-symbols-outlined text-[1.1rem] text-violet-500">{icon}</span>
        <h2 className="text-sm font-semibold text-gray-800 dark:text-white">{title}</h2>
      </div>
      {/* Section body */}
      <div className="px-6 py-5">{children}</div>
    </div>
  );
}

// ── Mock initial data ─────────────────────────────────────────────────────────
const INITIAL_STATE = {
  firstName:     "Sarah",
  lastName:      "Connor",
  email:         "sarah.connor@acme.com",   // read-only
  displayName:   "Sarah C.",
  recruiterType: "corporate",
  company:       "Acme Corp",
  website:       "https://acme.com",
  location:      "San Francisco, CA",
};

const RECRUITER_TYPES = [
  { value: "",           label: "Select type…" },
  { value: "corporate",  label: "Corporate Recruiter" },
  { value: "agency",     label: "Agency Recruiter" },
  { value: "freelance",  label: "Freelance Recruiter" },
  { value: "executive",  label: "Executive Search" },
  { value: "hr",         label: "HR Generalist" },
];

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
          {value || <span className="text-gray-400 dark:text-gray-600 italic">Not set</span>}
        </span>
      </div>
    </div>
  );
}

// ── RecruiterProfilePage ──────────────────────────────────────────────────────
export default function RecruiterProfile() {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData]           = useState(INITIAL_STATE);   // committed data
  const [profileData, setProfileData]         = useState(INITIAL_STATE);   // working copy
  const [avatarSrc, setAvatarSrc] = useState(null);            // committed avatar
  const [draftAvatar, setDraftAvatar] = useState(null);        // working avatar (always editable)
  const [savedMsg, setSavedMsg]   = useState(false);
  const [viewAvatar, setViewAvatar] = useState(false);
  const fileInputRef              = useRef(null);

  // ── Handlers ──────────────────────────────────────────────────────────────
  function handleChange(e) {
    const { name, value } = e.target;
    setDraft((prev) => ({ ...prev, [name]: value }));
  }

  function handleAvatarChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setDraftAvatar(ev.target.result);
      setAvatarSrc(ev.target.result);   // avatar saves immediately, independent of edit mode
    };
    reader.readAsDataURL(file);
  }

  function handleRemoveAvatar() {
    setDraftAvatar(null);
    setAvatarSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleEdit() {
    setDraft(form);       // sync draft to current committed data
    setIsEditing(true);
  }

  function handleCancel() {
    setDraft(form);       // revert all changes
    setIsEditing(false);
  }

  function handleSave(e) {
    e.preventDefault();
    setForm(draft);       // commit draft → form
    setIsEditing(false);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  }

  // Avatar: always show committed avatarSrc (independent of edit mode)
  const displayAvatar = avatarSrc;
  const initials = `${form.firstName?.[0] ?? ""}${form.lastName?.[0] ?? ""}`.toUpperCase();

  // Completion uses committed form (view mode shows real completion)

  const completionFields = [
    { label: "First name",     filled: !!form.firstName.trim() },
    { label: "Last name",      filled: !!form.lastName.trim() },
    { label: "Display name",   filled: !!form.displayName.trim() },
    { label: "Recruiter type", filled: !!form.recruiterType },
    { label: "Company name",   filled: !!form.company.trim() },
    { label: "Website",        filled: !!form.website.trim() },
    { label: "Location",       filled: !!form.location.trim() },
    { label: "Profile photo",  filled: !!avatarSrc },
  ];

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
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 px-6 py-4">
        <ProfileCompletionBar fields={completionFields} showItems />
      </div>

      <form onSubmit={handleSave} noValidate>
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
                    <img src={displayAvatar} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-violet-600 dark:text-violet-400 select-none">
                      {initials}
                    </span>
                  )}
                  {/* Hover overlay */}
                  <span className="absolute inset-0 bg-black/40 flex items-center justify-center
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-2xl">
                    <span className="material-symbols-outlined text-white text-[1.2rem]">zoom_in</span>
                  </span>
                </button>
                {/* Online dot */}
                <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white dark:border-gray-900" />
              </div>

              {/* Info + upload */}
              <div className="flex flex-col gap-1.5 min-w-0">
                <p className="text-base font-semibold text-gray-900 dark:text-white">
                  {form.displayName || `${form.firstName} ${form.lastName}`}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  Photo is always changeable · JPG, PNG or WEBP · Max 2 MB
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  {/* Change photo — always available */}
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
                    <span className="material-symbols-outlined text-[0.9rem]">upload</span>
                    {displayAvatar ? "Change Photo" : "Upload Photo"}
                  </button>

                  {/* Remove — always available when photo exists */}
                  {displayAvatar && (
                    <button
                      type="button"
                      onClick={handleRemoveAvatar}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                        text-gray-500 dark:text-gray-400
                        hover:bg-gray-100 dark:hover:bg-gray-800
                        transition-colors duration-200"
                    >
                      <span className="material-symbols-outlined text-[0.9rem]">delete</span>
                      Remove
                    </button>
                  )}

                  {/* View photo — always visible */}
                  <button
                    type="button"
                    onClick={() => setViewAvatar(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                      text-gray-500 dark:text-gray-400
                      hover:bg-gray-100 dark:hover:bg-gray-800
                      transition-colors duration-200"
                  >
                    <span className="material-symbols-outlined text-[0.9rem]">zoom_in</span>
                    View Photo
                  </button>
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
                <FieldLabel htmlFor="firstName" required>First Name</FieldLabel>
                {isEditing
                  ? <TextInput id="firstName" name="firstName" value={draft.firstName} onChange={handleChange} placeholder="Enter first name" />
                  : <ViewField value={form.firstName} />
                }
              </div>

              <div>
                <FieldLabel htmlFor="lastName" required>Last Name</FieldLabel>
                {isEditing
                  ? <TextInput id="lastName" name="lastName" value={draft.lastName} onChange={handleChange} placeholder="Enter last name" />
                  : <ViewField value={form.lastName} />
                }
              </div>

              <div>
                <FieldLabel htmlFor="email">Email Address</FieldLabel>
                <TextInput id="email" name="email" type="email" value={form.email} disabled />
                <p className="mt-1.5 text-[0.7rem] text-gray-400 dark:text-gray-500">
                  Contact support to change your email address.
                </p>
              </div>

              <div>
                <FieldLabel htmlFor="displayName">Display Name</FieldLabel>
                {isEditing
                  ? <TextInput id="displayName" name="displayName" value={draft.displayName} onChange={handleChange} placeholder="How others see you" />
                  : <ViewField value={form.displayName} />
                }
              </div>

            </div>
          </SectionCard>

          {/* ── Professional information ── */}
          <SectionCard title="Professional Information" icon="business_center">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>
                <FieldLabel htmlFor="recruiterType">Recruiter Type</FieldLabel>
                {isEditing
                  ? <SelectInput id="recruiterType" name="recruiterType" value={draft.recruiterType} onChange={handleChange} options={RECRUITER_TYPES} />
                  : <ViewField value={RECRUITER_TYPES.find(t => t.value === form.recruiterType)?.label} icon="work_outline" />
                }
              </div>

              <div>
                <FieldLabel htmlFor="company">Company / Branch Name</FieldLabel>
                {isEditing
                  ? <TextInput id="company" name="company" value={draft.company} onChange={handleChange} placeholder="e.g. Acme Corp" />
                  : <ViewField value={form.company} icon="business" />
                }
              </div>

              <div>
                <FieldLabel htmlFor="website">Website URL</FieldLabel>
                {isEditing
                  ? <TextInput id="website" name="website" type="url" value={draft.website} onChange={handleChange} placeholder="https://yourcompany.com" />
                  : <ViewField value={form.website} icon="link" />
                }
              </div>

              <div>
                <FieldLabel htmlFor="location">Location</FieldLabel>
                {isEditing
                  ? <TextInput id="location" name="location" value={draft.location} onChange={handleChange} placeholder="City, Country" />
                  : <ViewField value={form.location} icon="location_on" />
                }
              </div>

            </div>
          </SectionCard>

          {/* ── Action bar — edit mode only ── */}
          {isEditing && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3
              bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 px-6 py-4">

              {/* Saved confirmation */}
              <div className="flex items-center gap-2 text-sm">
                {savedMsg && (
                  <span className="flex items-center gap-1.5 text-green-600 dark:text-green-400 font-medium">
                    <span className="material-symbols-outlined text-[1rem]">check_circle</span>
                    Changes saved
                  </span>
                )}
              </div>

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
                  <span className="material-symbols-outlined text-[1rem]">save</span>
                  Save Changes
                </button>
              </div>
            </div>
          )}

        </div>
      </form>
      {/* ── Avatar lightbox ── */}
      {viewAvatar && (
        <AvatarLightbox
          src={displayAvatar}
          initials={initials}
          onClose={() => setViewAvatar(false)}
        />
      )}

    </div>
  );
}