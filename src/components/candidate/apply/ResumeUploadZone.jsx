import React, { useState, useRef } from 'react';
import toast from 'react-hot-toast';
import { privateApi } from '../../../services/api';

export default function ResumeUploadZone({
  onUploadSuccess,
  uploadEndpoint = '/candidate/resumes/',
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef(null);

  const validateAndUpload = async (file) => {
    if (!file) return;

    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    const isAllowedExt = /\.(pdf|doc|docx)$/i.test(file.name);

    if (!allowedMimeTypes.includes(file.type) && !isAllowedExt) {
      toast.error('Only PDF or Word documents (.pdf, .doc, .docx) are allowed.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be under 5 MB.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(15);

    try {
      // 1. Upload to Cloudinary
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`;
      const cloudData = new FormData();
      cloudData.append('file', file);
      cloudData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

      setUploadProgress(40);
      const cloudRes = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: cloudData,
      });

      if (!cloudRes.ok) {
        throw new Error('Failed to upload file to storage.');
      }

      const cloudJson = await cloudRes.json();
      setUploadProgress(75);

      // 2. Post to backend endpoint
      const payload = {
        public_id: cloudJson.public_id,
        file_url: cloudJson.secure_url,
        file_name: file.name,
        file_size: file.size,
      };

      let savedResume = {
        id: `upload_${Date.now()}`,
        file_name: file.name,
        file_url: cloudJson.secure_url,
        public_id: cloudJson.public_id,
        created_at: new Date().toISOString(),
      };

      try {
        const backendRes = await privateApi.post(uploadEndpoint, payload);
        if (backendRes?.data) {
          savedResume = {
            ...savedResume,
            ...(typeof backendRes.data === 'object' ? backendRes.data : {}),
            id: backendRes.data?.id || savedResume.id,
            file_name: backendRes.data?.file_name || file.name,
            file_url: backendRes.data?.file_url || cloudJson.secure_url,
          };
        }
      } catch (backendErr) {
        console.warn('Backend sync failed, falling back to uploaded storage metadata:', backendErr);
      }

      setUploadProgress(100);
      toast.success('Resume uploaded successfully!');

      if (onUploadSuccess) {
        onUploadSuccess(savedResume);
      }
    } catch (err) {
      console.error('Resume upload error:', err);
      toast.error(err?.message || 'Resume upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndUpload(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        if (!isUploading) setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`relative rounded-2xl border-2 border-dashed p-6 sm:p-8 transition-all duration-200 text-center
        ${
          isDragging
            ? 'border-violet-500 bg-violet-50/80 dark:bg-violet-950/40 ring-4 ring-violet-500/10'
            : 'border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 hover:border-violet-300 dark:hover:border-violet-700/60'
        }
      `}
    >
      <div className="flex flex-col items-center justify-center gap-3">
        {/* Icon */}
        <div
          className={`w-13 h-13 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-200
            ${
              isUploading
                ? 'bg-violet-100 dark:bg-violet-950 text-violet-600 animate-pulse'
                : isDragging
                ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                : 'bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400'
            }
          `}
        >
          <span className="material-symbols-outlined text-[1.8rem]">
            {isUploading ? 'autorenew' : isDragging ? 'file_download' : 'cloud_upload'}
          </span>
        </div>

        {/* Text */}
        <div className="space-y-1">
          <p className="text-sm sm:text-base font-semibold text-gray-800 dark:text-gray-100">
            {isUploading ? 'Uploading and processing resume…' : 'Upload a new resume'}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 max-w-sm mx-auto">
            {isUploading
              ? 'Please wait while we upload your file'
              : 'Drag & drop your PDF or Word document here, or browse from your device (Max 5 MB)'}
          </p>
        </div>

        {/* Progress Bar when uploading */}
        {isUploading && (
          <div className="w-full max-w-xs bg-gray-100 dark:bg-gray-800 rounded-full h-2 mt-2 overflow-hidden">
            <div
              className="bg-violet-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        {/* Upload Button */}
        {!isUploading && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-2 inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-sm font-semibold
              text-violet-700 dark:text-violet-300
              bg-violet-50 dark:bg-violet-950/70
              border border-violet-200 dark:border-violet-800
              hover:bg-violet-100 dark:hover:bg-violet-900/50
              hover:border-violet-300 dark:hover:border-violet-700
              active:scale-[0.98] transition-all duration-200 shadow-sm"
          >
            <span className="material-symbols-outlined text-[1.15rem]">
              folder_open
            </span>
            Browse Resume
          </button>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) validateAndUpload(file);
        }}
      />
    </div>
  );
}
