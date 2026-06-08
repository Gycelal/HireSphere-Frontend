import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { privateApi } from "../../../services/api";
import CropModal from "../../../utils/cropImage";
import ConfirmModal from "../ConfirmModal";
import AvatarLightbox from "../data-display/AvatarLightbox";

const AvatarManager = ({
  savedAvatar,
  initials,
  displayName,
  uploadEndpoint,
  onSuccess,
}) => {
  const [draftAvatar, setDraftAvatar] = useState(null); // cropped but unsaved image
  const [isSavingAvatar, setIsSavingAvatar] = useState(false);
  const [cropSrc, setCropSrc] = useState(null); // raw image waiting for crop
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [viewAvatar, setViewAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState("");
  const fileInputRef = useRef(null);

  const displayAvatar = draftAvatar || savedAvatar;

  function handleAvatarChange(e) {
    setAvatarError(""); // Clear previous errors
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(file.type)) {
      setAvatarError("Only JPG, JPEG, PNG and WEBP image formats are allowed.");
      toast.error("Invalid format.");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setAvatarError("File size exceeds 2MB limit.");
      toast.error("Upload Failed.");
      e.target.value = "";
      return;
    }

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
      const responseBlob = await fetch(draftAvatar);
      const blob = await responseBlob.blob();

      const formData = new FormData();
      formData.append("profile_picture", blob, "avatar.jpg");

      const response = await privateApi.patch(uploadEndpoint, formData);
      if (onSuccess) await onSuccess();
      setDraftAvatar(null);
      toast.success("Profile picture saved successfully!");
      console.log("Profile picture saved:", response.data);
    } catch (error) {
      console.error("Error saving profile picture:", error);
      if (error.response?.status === 400 && error.response?.data?.profile_picture) {
        setAvatarError(error.response.data.profile_picture[0]);
        toast.error("Failed to save: Invalid image.");
      } else {
        toast.error("Upload Failed.");
      }
    } finally {
      setIsSavingAvatar(false);
    }
  }

  async function handleRemoveAvatar() {
    setShowRemoveModal(false);
    setIsSavingAvatar(true);
    try {
      const payload = {
        profile: {
          profile_picture: null,
        },
      };
      await privateApi.delete(uploadEndpoint, { data: payload });
      if (onSuccess) await onSuccess();
      if (fileInputRef.current) fileInputRef.current.value = "";
      toast.success("Profile picture removed.");
    } catch (error) {
      console.error("Error removing profile picture:", error);
      toast.error("Failed to remove photo. Please try again.");
    } finally {
      setIsSavingAvatar(false);
    }
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar — click to view full size */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => setViewAvatar(true)}
              aria-label="View profile picture"
              className="group relative w-24 sm:w-28 h-24 sm:h-28 rounded-2xl overflow-hidden
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
                <span className="text-3xl sm:text-4xl font-bold text-violet-600 dark:text-violet-400 select-none">
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
              {displayName}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              Photo is always changeable · JPG, PNG or WEBP · Max 2 MB
            </p>
            {avatarError && (
              <p className="mt-1 text-xs text-red-500 font-medium">
                {avatarError}
              </p>
            )}
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
                      {isSavingAvatar ? " Removing..." : "Remove Photo"}
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

      {/* Modals associated with Avatar */}
      {cropSrc && (
        <CropModal
          imageSrc={cropSrc}
          onApply={handleCropApply}
          onCancel={handleCropCancel}
        />
      )}

      {showRemoveModal && (
        <ConfirmModal
          open={showRemoveModal}
          onCancel={() => setShowRemoveModal(false)}
          onConfirm={handleRemoveAvatar}
          title="Remove Profile Picture"
          message="Are you sure you want to remove your profile picture? This action cannot be undone."
          confirmText={isSavingAvatar ? "Removing..." : "Yes, Remove"}
          cancelText="Cancel"
          variant="danger"
        />
      )}

      {viewAvatar && (
        <AvatarLightbox
          src={displayAvatar}
          initials={initials}
          onClose={() => setViewAvatar(false)}
        />
      )}
    </>
  );
}

export default AvatarManager;
