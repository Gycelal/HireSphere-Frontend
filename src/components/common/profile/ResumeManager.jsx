import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { privateApi } from "../../../services/api";

// ── Resume Manager ────────────────────────────────────────────────────────────
const ResumeManager = ({ savedResume, savedResumeFilename, onSuccess }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const fileInputRef = useRef(null);

  const validateAndUpload = async (file) => {
    if (!file) return;
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
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
      // 1. Upload to Cloudinary
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`;
      const cloudData = new FormData();
      cloudData.append("file", file);
      cloudData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      const cloudRes = await fetch(cloudinaryUrl, {
        method: "POST",
        body: cloudData,
      });
      if (!cloudRes.ok) throw new Error("Failed to upload to Cloudinary");
      const cloudJson = await cloudRes.json();

      // 2. Send public_id, secure_url, and original filename to backend
      await privateApi.patch("/candidate/profile/resume/", {
        resume_public_id: cloudJson.public_id,
        resume_url: cloudJson.secure_url,
        resume_filename: file.name,
      });

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

  const resumeUrl = savedResume || null;
  const resumeFileName = savedResume ? (savedResumeFilename || "Candidate Resume") : null;

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
        <div className="flex flex-col gap-3">
          {/* Section label */}
          <p className="text-[0.65rem] font-bold uppercase tracking-widest text-violet-500 dark:text-violet-400">
            Current Resume
          </p>

          <div className="flex items-center gap-3">
            {/* File icon */}
            <div className="w-11 h-11 rounded-xl bg-violet-100 dark:bg-violet-950/60 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-violet-600 dark:text-violet-400 text-[1.3rem]">
                description
              </span>
            </div>

            {/* File info */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-white truncate" title={resumeFileName}>
                {resumeFileName}
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                PDF / Word document
              </p>
            </div>

            {/* Action icon buttons */}
            <div className="flex items-center gap-0.5 shrink-0">
              {/* View */}
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="View"
                className="w-8 h-8 rounded-lg flex items-center justify-center
                  text-violet-600 dark:text-violet-400
                  hover:bg-violet-100 dark:hover:bg-violet-900/40
                  transition-colors duration-200"
              >
                <span className="material-symbols-outlined text-[1.15rem]">open_in_new</span>
              </a>

              {/* Change */}
              <button
                type="button"
                title="Change"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="w-8 h-8 rounded-lg flex items-center justify-center
                  text-violet-600 dark:text-violet-400
                  hover:bg-violet-100 dark:hover:bg-violet-900/40
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-200"
              >
                <span className="material-symbols-outlined text-[1.15rem]">drive_file_rename_outline</span>
              </button>

              {/* Delete */}
              <button
                type="button"
                title="Delete"
                onClick={handleRemove}
                disabled={isRemoving}
                className="w-8 h-8 rounded-lg flex items-center justify-center
                  text-red-500 dark:text-red-400
                  hover:bg-red-50 dark:hover:bg-red-950/40
                  disabled:opacity-50 disabled:cursor-not-allowed
                  transition-colors duration-200"
              >
                <span className="material-symbols-outlined text-[1.15rem]">
                  {isRemoving ? "autorenew" : "delete"}
                </span>
              </button>
            </div>
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
              PDF or Word · Max 5 MB · Drag &amp; drop or click to browse
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

export default ResumeManager;
