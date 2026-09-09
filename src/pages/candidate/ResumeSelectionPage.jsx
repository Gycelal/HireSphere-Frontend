import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { privateApi } from '../../services/api';
import ResumeSelectCard from '../../components/candidate/apply/ResumeSelectCard';
import ResumeUploadZone from '../../components/candidate/apply/ResumeUploadZone';

export default function ResumeSelectionPage() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();

  // Job details state
  const [job, setJob] = useState(null);
  const [loadingJob, setLoadingJob] = useState(true);

  // Resume states
  const [defaultResume, setDefaultResume] = useState(null);
  const [recentResumes, setRecentResumes] = useState([]);
  const [newlyUploadedResumes, setNewlyUploadedResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState(null);
  const [loadingResumes, setLoadingResumes] = useState(true);

  // Fetch job details using jobId
  useEffect(() => {
    const fetchJobDetails = async () => {
      if (!jobId) return;
      setLoadingJob(true);
      try {
        const res = await privateApi.get(`jobs/${jobId}/`);
        setJob(res.data);
      } catch (err) {
        toast.error('Failed to load job details');
        navigate('/find-jobs');
      } finally {
        setLoadingJob(false);
      }
    };

    fetchJobDetails();
  }, [jobId, navigate]);

  // Fetch default resume and recently used resumes
  useEffect(() => {
    let isMounted = true;

    const fetchAllResumes = async () => {
      setLoadingResumes(true);

      let fetchedDefault = null;
      let fetchedRecents = [];

      //Fetches Candidate Profile and get default resume from profile if exists
      try {
        const profileRes = await privateApi.get('candidate/profile/');
        const defaultResume = profileRes.data?.profile?.default_resume;
        if (defaultResume) {
          fetchedDefault = defaultResume;
        }
      } catch (err) {
        console.error('Failed to load default resume:', err);
        toast.error('Failed to load default resume');
      }

      // Fetch Recently Used Resumes
      try {
        const recentRes = await privateApi.get('candidate/resume/recent/');
        console.log("recentRes", recentRes.data)
        fetchedRecents = recentRes.data || [];
      } catch (err) {
        console.warn('Could not fetch recently used resumes from endpoint:', err);
      }

      if (isMounted) {
        setDefaultResume(fetchedDefault);
        setRecentResumes(fetchedRecents);

        if (fetchedDefault) {
          setSelectedResume(fetchedDefault);
        }

        setLoadingResumes(false);
      }
    };

    fetchAllResumes();

    return () => {
      isMounted = false;
    };
  }, []);

  
  const handleSelectResume = (resumeItem) => {
    setSelectedResume(resumeItem);
  };

  const handleUploadSuccess = (uploadedResume) => {
    setNewlyUploadedResumes((prev) => [uploadedResume, ...prev]);
    setSelectedResume(uploadedResume);
  };

  const handleContinue = () => {
    if (!selectedResume) {
      toast.error('Please select or upload a resume to proceed.');
      return;
    }

    // Pass chosen resume & jobId to the next stage (AI analysis / review)
    navigate(`/candidate/jobs/${jobId}/ai-analysis`, {
      state: {
        jobId,
        selectedResume,
      },
    });
  };
  const recruiterInfo = job?.recruiter;
  const companyName = recruiterInfo?.company_or_brand_name || job?.company_name || recruiterInfo?.first_name + ' ' + recruiterInfo?.last_name ;

  return (
    <div className="min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => navigate(`/candidate/jobs/${jobId}`)}
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200 w-fit font-medium"
        >
          <span className="material-symbols-outlined text-[1.15rem]">arrow_back</span>
          Back to Job Details
        </button>

        {/* ── Step Progress Indicator ── */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[0.7rem] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                Application Process
              </span>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mt-0.5">
                Select Your Resume
              </h1>
            </div>
          </div>

          {/* Job Banner Summary */}
          {loadingJob ? (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 animate-pulse flex items-center gap-3">
              <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-4 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
            </div>
          ) : job ? (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  Applying for:
                </span>
                <span className="text-violet-600 dark:text-violet-400 font-bold">
                  {job.title}
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600 dark:text-gray-400">
                  {companyName}
                </span>
              </div>
              {job.location && (
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <span className="material-symbols-outlined text-[1rem] text-violet-500">
                    location_on
                  </span>
                  <span>{job.location}</span>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>

      {/* ── Main Content Area ── */}
      {loadingResumes ? (
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 animate-pulse space-y-4">
            <div className="h-5 w-40 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            <div className="h-20 bg-gray-100 dark:bg-gray-800/60 rounded-xl" />
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 animate-pulse space-y-4">
            <div className="h-5 w-48 bg-gray-200 dark:bg-gray-800 rounded-lg" />
            <div className="h-20 bg-gray-100 dark:bg-gray-800/60 rounded-xl" />
            <div className="h-20 bg-gray-100 dark:bg-gray-800/60 rounded-xl" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Default Resume Section */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-violet-600 dark:text-violet-400 text-[1.25rem]">
                  star
                </span>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Default Resume
                </h2>
              </div>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                From your candidate profile
              </span>
            </div>

            {defaultResume ? (
              <ResumeSelectCard
                resume={defaultResume}
                isSelected={selectedResume?.id === defaultResume.id}
                onSelect={handleSelectResume}
                badgeLabel="Default Resume"
                badgeVariant="violet"
              />
            ) : (
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-dashed border-gray-200 dark:border-gray-700 text-center">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  No default resume found in your profile. You can pick from recently used or upload a new one below.
                </p>
              </div>
            )}
          </div>

          {/* Recently Used Resumes Section */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-violet-600 dark:text-violet-400 text-[1.25rem]">
                  history
                </span>
                <h2 className="text-base font-bold text-gray-900 dark:text-white">
                  Recently Used
                </h2>
              </div>
              {recentResumes.length > 0 && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {recentResumes.length} {recentResumes.length === 1 ? 'resume' : 'resumes'} found
                </span>
              )}
            </div>

            {recentResumes.length > 0 ? (
              <div className="flex flex-col gap-3">
                {recentResumes.map((item) => (
                  <ResumeSelectCard
                    key={item.id}
                    resume={item}
                    isSelected={selectedResume?.id === item.id}
                    onSelect={handleSelectResume}
                    badgeLabel="Recently Used"
                    badgeVariant="blue"
                  />
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-dashed border-gray-200 dark:border-gray-700 text-center">
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  No recently used resumes found.
                </p>
              </div>
            )}
          </div>

          {/* Newly Uploaded Section */}
          {newlyUploadedResumes.length > 0 && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-emerald-100 dark:border-emerald-950/40 p-6 shadow-sm bg-gradient-to-br from-emerald-50/30 to-transparent dark:from-emerald-950/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[1.25rem]">
                    upload_file
                  </span>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">
                    Newly Uploaded
                  </h2>
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Selected
                </span>
              </div>

              <div className="flex flex-col gap-3">
                {newlyUploadedResumes.map((item) => (
                  <ResumeSelectCard
                    key={item.id}
                    resume={item}
                    isSelected={selectedResume?.id === item.id}
                    onSelect={handleSelectResume}
                    badgeLabel="Newly Uploaded"
                    badgeVariant="emerald"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Upload a New Resume Section */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-4">
              <span className="material-symbols-outlined text-violet-600 dark:text-violet-400 text-[1.25rem]">
                add_circle
              </span>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Upload a New Resume
              </h2>
            </div>

            <ResumeUploadZone onUploadSuccess={handleUploadSuccess} />
          </div>
        </div>
      )}

      {/*  Bottom Sticky Action Bar */}
      <div className="sticky bottom-4 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-gray-800 p-4 sm:p-5 shadow-xl shadow-gray-900/5 dark:shadow-black/40">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors
                ${
                  selectedResume
                    ? 'bg-violet-100 dark:bg-violet-950/70 text-violet-600 dark:text-violet-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                }
              `}
            >
              <span className="material-symbols-outlined text-[1.3rem]">
                {selectedResume ? 'task_alt' : 'touch_app'}
              </span>
            </div>

            <div className="min-w-0">
              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                Selected Resume
              </p>
              <p
                className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[200px] sm:max-w-xs md:max-w-md"
                title={selectedResume?.file_name || 'No resume selected'}
              >
                {selectedResume ? selectedResume.file_name : 'Please select a resume above'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => navigate(`/candidate/jobs/${jobId}`)}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl text-sm font-semibold
                text-gray-600 dark:text-gray-300
                border border-gray-200 dark:border-gray-700
                hover:bg-gray-50 dark:hover:bg-gray-800
                transition-all duration-200"
            >
              Cancel
            </button>

            <button
              type="button"
              id="continue-to-analysis-btn"
              onClick={handleContinue}
              disabled={!selectedResume}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white
                transition-all duration-200 shadow-md
                ${
                  selectedResume
                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 active:scale-[0.98] shadow-violet-500/25 dark:shadow-violet-950/50 cursor-pointer'
                    : 'bg-gray-300 dark:bg-gray-800 text-gray-500 dark:text-gray-600 opacity-60 cursor-not-allowed shadow-none'
                }
              `}
            >
              <span>Continue</span>
              <span className="material-symbols-outlined text-[1.1rem]">
                arrow_forward
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
