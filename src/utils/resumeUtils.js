import toast from "react-hot-toast";

export const ALLOWED_RESUME_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const MAX_RESUME_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

/**
 * Validates whether the given file is an allowed resume format and within size limits.
 * Shows a toast error if validation fails.
 * 
 * @param {File} file 
 * @returns {boolean} true if valid, false otherwise
 */
export const validateResumeFile = (file) => {
  if (!file) return false;

  const isAllowedExt = /\.(pdf|docx)$/i.test(file.name);
  
  // Browsers sometimes fail to infer file.type for docx; check if MIME is allowed or empty
  const isAllowedMime = ALLOWED_RESUME_TYPES.includes(file.type);

  // Require valid extension AND (valid MIME or empty MIME)
  if (!isAllowedExt || (!isAllowedMime && file.type !== "")) {
    toast.error("Only PDF or Word documents (.pdf, .docx) are allowed.");
    return false;
  }

  if (file.size === 0) {
    toast.error("File cannot be empty.");
    return false;
  }

  if (file.size > MAX_RESUME_SIZE_BYTES) {
    toast.error("File must be under 5 MB.");
    return false;
  }

  return true;
};

/**
 * Uploads a validated resume file to Cloudinary.
 * 
 * @param {File} file 
 * @returns {Promise<{ public_id: string, secure_url: string }>} Cloudinary response JSON
 */
export const uploadResumeToCloudinary = async (file) => {
  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`;
  const cloudData = new FormData();
  cloudData.append("file", file);
  cloudData.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

  const cloudRes = await fetch(cloudinaryUrl, {
    method: "POST",
    body: cloudData,
  });

  if (!cloudRes.ok) {
    throw new Error("Failed to upload file to storage.");
  }

  return await cloudRes.json();
};
