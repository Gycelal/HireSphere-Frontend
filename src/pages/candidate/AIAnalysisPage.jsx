import React, { useState, useEffect, useCallback, useId } from 'react';
import { useParams, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { privateApi } from '../../services/api';

export default function AIAnalysisPage() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const selectedResumeId = searchParams.get('selectedResumeId');

  // Job & Resume states from router navigation state or fetched
  const [job, setJob] = useState(location.state?.job || null);
  const [selectedResume, setSelectedResume] = useState(location.state?.selectedResume || null);
  const [loadingJob, setLoadingJob] = useState(!location.state?.job);

  const [analysis, setAnalysis] = useState(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);
  const [analysisError, setAnalysisError] = useState(null);

  // Stable ID for SVG gradient definitions to avoid collisions across multiple instances
  const rawId = useId();
  const gradId = `scoreGrad-${rawId.replace(/[^a-zA-Z0-9_-]/g, '')}` ;

  // Fetches job details by id if it is not available
  useEffect(() => {
    if (job || !jobId) return;

    let isMounted = true;
    const fetchJob = async () => {
      setLoadingJob(true);
      try {
        const res = await privateApi.get(`jobs/${jobId}/`);
        if (isMounted) {
          setJob(res.data);
        }
      } catch (err) {
        console.error('Failed to load job details:', err);
        toast.error('Failed to load job details');
        navigate('/find-jobs');
      } finally {
        if (isMounted) {
          setLoadingJob(false);
        }
      }
    };

    fetchJob();

    return () => {
      isMounted = false;
    };
  }, [jobId, job, navigate]);

  // Fetches selected resume by its id if not available
  useEffect(() => {
    if (selectedResume) return;

    if (!selectedResumeId) {
      toast.error('Please select a resume to proceed.');
      navigate(`/candidate/jobs/${jobId}/apply`);
      return;
    }

    let isMounted = true;
    const fetchSelectedResume = async () => {
      try {
        const res = await privateApi.get(`candidate/resumes/${selectedResumeId}/`);
        if (isMounted) {
          setSelectedResume(res.data);
        }
      } catch (err) {
        if (isMounted) {
          toast.error('Failed to load selected resume.');
          navigate(`/candidate/jobs/${jobId}/apply`);
        }
      }
    };

    fetchSelectedResume();

    return () => {
      isMounted = false;
    };
  }, [selectedResume, selectedResumeId, jobId, navigate]);

  const runAIAnalysis = useCallback(async () => {
    if (!jobId || !selectedResume?.id) return;

    setLoadingAnalysis(true);
    setAnalysisError(null);

    try {
      const payload = {
        job_id: jobId,
        resume_id: selectedResume.id,
      };

      const res = await privateApi.post('candidate/ai/analyze-match/', payload);
      console.log("ai analysis res:", res)
      const data = res.data;

      if (data) {
        setAnalysis({
          match_score: typeof data.match_score === 'number' ? data.match_score : 0,
          matching_strengths: Array.isArray(data.matching_strengths) ? data.matching_strengths : [],
          gaps_identified: Array.isArray(data.gaps_identified) ? data.gaps_identified : [],
          suggestions: Array.isArray(data.suggestions) ? data.suggestions : [],
        });
      } else {
        throw new Error('Invalid analysis data received.');
      }
    } catch (err) {
      console.error('AI Analysis failed:', err);
      const errorMsg = err?.response?.detail || 'Failed to generate AI match analysis. Please try again.';
      setAnalysisError(errorMsg);
      toast.error('AI analysis request failed');
    } finally {
      setLoadingAnalysis(false);
    }
  }, [jobId, selectedResume?.id]);

  useEffect(() => {
    if (jobId && selectedResume?.id) {
      runAIAnalysis();
    }
  }, [jobId, selectedResume?.id, runAIAnalysis]);

  // Helper for score badge & colors
  const getScoreMeta = (score = 0) => {
    if (score >= 80) {
      return {
        label: 'Strong Match',
        textColor: 'text-emerald-600 dark:text-emerald-400',
        bgColor: 'bg-emerald-50 dark:bg-emerald-950/50',
        borderColor: 'border-emerald-200 dark:border-emerald-800',
        gradientStart: '#10b981',
        gradientEnd: '#059669',
        summary: 'Your profile and technical background closely align with the core requirements of this role.',
      };
    }
    if (score >= 60) {
      return {
        label: 'Good Match',
        textColor: 'text-violet-600 dark:text-violet-400',
        bgColor: 'bg-violet-50 dark:bg-violet-950/50',
        borderColor: 'border-violet-200 dark:border-violet-800',
        gradientStart: '#8b5cf6',
        gradientEnd: '#6d28d9',
        summary: 'You have solid matching qualifications with a few areas that can be highlighted or improved.',
      };
    }
    return {
      label: 'Moderate Match',
      textColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50 dark:bg-amber-950/50',
      borderColor: 'border-amber-200 dark:border-amber-800',
      gradientStart: '#f59e0b',
      gradientEnd: '#d97706',
      summary: 'Some overlap exists, but tailoring your resume and writing a targeted cover letter is recommended.',
    };
  };

  const recruiterInfo = job?.recruiter;
  const companyName =
    recruiterInfo?.company_or_brand_name ||
    job?.company_name ||
    (recruiterInfo?.first_name ? `${recruiterInfo.first_name} ${recruiterInfo.last_name || ''}` : 'Company');

  const scoreMeta = getScoreMeta(analysis?.match_score || 0);

  // SVG Circular Meter calculations
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const scorePercent = Math.min(Math.max(analysis?.match_score || 0, 0), 100);
  const strokeDashoffset = circumference - (scorePercent / 100) * circumference;

  return (
    <div className="min-h-[calc(100vh-140px)] py-8 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full flex flex-col gap-8">
      {/* ── Top Back & Step Progress Header ── */}
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => navigate(`/candidate/jobs/${jobId}/apply`)}
          className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200 w-fit font-medium cursor-pointer"
        >
          <span className="material-symbols-outlined text-[1.15rem]">arrow_back</span>
          Back to Resume Selection
        </button>

        {/* Header Banner */}
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/70 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[1.25rem]">auto_awesome</span>
              </div>
              <div>
                <span className="text-[0.7rem] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                  Application Process • Step 2
                </span>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  AI Match Analysis
                </h1>
              </div>
            </div>

            {/* AI badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 border border-violet-200 dark:border-violet-800 w-fit">
              <span className="material-symbols-outlined text-[1rem] text-violet-500">
                psychology
              </span>
              <span>Intelligent Role Comparison</span>
            </div>
          </div>

          {/* Job summary bar */}
          {loadingJob ? (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 animate-pulse flex items-center gap-3">
              <div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded" />
              <div className="h-4 w-24 bg-gray-100 dark:bg-gray-800 rounded" />
            </div>
          ) : job ? (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800 dark:text-gray-200">
                  Target Role:
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

      {/* ── Used / Selected Resume Banner ── */}
      <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 rounded-xl bg-violet-50 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0 border border-violet-100 dark:border-violet-900/50">
              <span className="material-symbols-outlined text-[1.4rem]">
                {selectedResume?.file_name?.toLowerCase()?.endsWith('.pdf')
                  ? 'picture_as_pdf'
                  : 'description'}
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs uppercase tracking-wider font-semibold text-gray-400 dark:text-gray-500">
                  Selected Resume
                </p>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[0.68rem] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  Active for this application
                </span>
              </div>
              <p
                className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate max-w-sm sm:max-w-md md:max-w-lg mt-0.5"
                title={selectedResume?.file_name || 'No resume selected'}
              >
                {selectedResume?.file_name || 'No resume selected'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
            {selectedResume?.file_url && selectedResume?.file_url !== '#' && (
              <a
                href={selectedResume.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold
                  text-gray-700 dark:text-gray-300
                  bg-gray-50 dark:bg-gray-800/80
                  border border-gray-200 dark:border-gray-700
                  hover:bg-gray-100 dark:hover:bg-gray-700
                  transition-all duration-200"
              >
                <span className="material-symbols-outlined text-[1rem]">open_in_new</span>
                <span>View Resume</span>
              </a>
            )}

            <button
              type="button"
              onClick={() => navigate(`/candidate/jobs/${jobId}/apply`)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold
                text-violet-700 dark:text-violet-300
                bg-violet-50 dark:bg-violet-950/60
                border border-violet-200 dark:border-violet-800
                hover:bg-violet-100 dark:hover:bg-violet-900/50
                transition-all duration-200 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[1rem]">swap_horiz</span>
              <span>Change Resume</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main AI Analysis Content ── */}
      {loadingAnalysis ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-8 sm:p-12 shadow-sm text-center flex flex-col items-center justify-center gap-6">
          <div className="relative flex items-center justify-center">
            <div className="w-20 h-20 rounded-full border-4 border-violet-100 dark:border-violet-950 border-t-violet-600 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl text-violet-600 dark:text-violet-400 animate-pulse">
                auto_awesome
              </span>
            </div>
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">
              Analyzing Resume with AI
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Evaluating your skills, relevant experience, and project background against the job description...
            </p>
          </div>

          {/* Shimmer skeleton lines */}
          <div className="w-full max-w-lg space-y-3 pt-4 border-t border-gray-100 dark:border-gray-800">
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse w-full" />
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse w-4/5 mx-auto" />
            <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full animate-pulse w-3/5 mx-auto" />
          </div>
        </div>
      ) : analysisError ? (
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-rose-100 dark:border-rose-950/50 p-8 shadow-sm text-center flex flex-col items-center justify-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
            <span className="material-symbols-outlined text-[1.8rem]">error_outline</span>
          </div>

          <div className="space-y-1 max-w-md">
            <h3 className="text-base font-bold text-gray-900 dark:text-white">
              AI Analysis Unavailable
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              {analysisError}
            </p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={runAIAnalysis}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold
                text-white bg-violet-600 hover:bg-violet-700 active:scale-[0.98] transition-all duration-200 shadow-md shadow-violet-500/20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[1.1rem]">refresh</span>
              Try Again
            </button>
            <button
              type="button"
              onClick={() => navigate(`/candidate/jobs/${jobId}/apply`)}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 cursor-pointer"
            >
              Change Resume
            </button>
          </div>
        </div>
      ) : analysis ? (
        <div className="flex flex-col gap-6">
          {/* ── Match Score Card ── */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8 shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-6 sm:gap-8">
              {/* Circular Gauge */}
              <div className="relative flex items-center justify-center shrink-0">
                <svg className="w-36 h-36 -rotate-90 transform" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    className="stroke-gray-100 dark:stroke-gray-800"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r={radius}
                    stroke={`url(#${gradId})`}
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={scoreMeta.gradientStart} />
                      <stop offset="100%" stopColor={scoreMeta.gradientEnd} />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Score in Center */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    {scorePercent}%
                  </span>
                  <span className="text-[0.68rem] uppercase font-bold text-gray-400 dark:text-gray-500 tracking-wider">
                    Match Score
                  </span>
                </div>
              </div>

              {/* Score Description */}
              <div className="flex flex-col items-center md:items-start text-center md:text-left gap-2.5">
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${scoreMeta.bgColor} ${scoreMeta.textColor} ${scoreMeta.borderColor}`}
                  >
                    <span className="w-2 h-2 rounded-full bg-current inline-block" />
                    {scoreMeta.label}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                    AI Evaluation
                  </span>
                </div>

                <h2 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                  Resume Alignment Overview
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 max-w-xl">
                  {scoreMeta.summary}
                </p>
              </div>
            </div>
          </div>

          {/* ── 3 Insight Cards Grid ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1. Matching Strengths */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[1.2rem]">check_circle</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Matching Strengths
                  </h3>
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900">
                  {analysis.matching_strengths?.length || 0} Strengths
                </span>
              </div>

              {analysis.matching_strengths?.length > 0 ? (
                <ul className="flex flex-col gap-3">
                  {analysis.matching_strengths.map((strength, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100/60 dark:border-emerald-900/30"
                    >
                      <span className="material-symbols-outlined text-emerald-600 dark:text-emerald-400 text-[1.15rem] shrink-0 mt-0.5">
                        task_alt
                      </span>
                      <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                        {strength}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-gray-400 dark:text-gray-500 italic py-2">
                  No explicit matching strengths highlighted.
                </p>
              )}
            </div>

            {/* 2. Gaps Identified */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/70 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[1.2rem]">warning_amber</span>
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Gaps Identified
                  </h3>
                </div>
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-full border border-amber-100 dark:border-amber-900">
                  {analysis.gaps_identified?.length || 0} Areas
                </span>
              </div>

              {analysis.gaps_identified?.length > 0 ? (
                <ul className="flex flex-col gap-3">
                  {analysis.gaps_identified.map((gap, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-100/60 dark:border-amber-900/30"
                    >
                      <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-[1.15rem] shrink-0 mt-0.5">
                        info
                      </span>
                      <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                        {gap}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-dashed border-gray-200 dark:border-gray-700 text-center">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    No significant gaps identified.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 3. Actionable Framing Suggestions */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-gray-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-violet-50 dark:bg-violet-950/70 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[1.2rem]">lightbulb</span>
                </div>
                <div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Actionable Framing Suggestions
                  </h3>
                  <p className="text-xs text-gray-400 dark:text-gray-500">
                    How you can optimize your application narrative
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/50 px-2 py-0.5 rounded-full border border-violet-100 dark:border-violet-900">
                {analysis.suggestions?.length || 0} Tips
              </span>
            </div>

            {analysis.suggestions?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {analysis.suggestions.map((suggestion, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 p-4 rounded-xl bg-violet-50/30 dark:bg-violet-950/20 border border-violet-100/70 dark:border-violet-900/30"
                  >
                    <span className="material-symbols-outlined text-violet-600 dark:text-violet-400 text-[1.2rem] shrink-0 mt-0.5">
                      tips_and_updates
                    </span>
                    <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-medium">
                      {suggestion}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 dark:text-gray-500 italic py-2">
                No specific suggestions provided.
              </p>
            )}
          </div>
        </div>
      ) : null}

      {/* ── Cover Letter Option & Bottom Sticky Action Bar ── */}
      <div className="sticky bottom-4 z-20 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl border border-gray-200/80 dark:border-gray-800 p-4 sm:p-5 shadow-xl shadow-gray-900/5 dark:shadow-black/40">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left summary chip */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="w-10 h-10 rounded-xl bg-violet-100 dark:bg-violet-950/70 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[1.3rem]">
                {analysis?.match_score ? 'insights' : 'description'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">
                Ready to Proceed
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-white truncate max-w-[220px] sm:max-w-xs">
                {selectedResume ? selectedResume.file_name : 'No resume selected'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end flex-wrap">
            {/* Minimal Add Cover Letter Button */}
            <button
              type="button"
              id="add-cover-letter-btn"
              onClick={() => {
                navigate(`/candidate/jobs/${jobId}/cover-letter`, {
                  state: {
                    jobId,
                    selectedResume,
                    job,
                    aiAnalysis: analysis,
                  },
                });
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-xl text-sm font-semibold
                text-violet-700 dark:text-violet-300
                bg-violet-50 dark:bg-violet-950/60
                border border-violet-200 dark:border-violet-800
                hover:bg-violet-100 dark:hover:bg-violet-900/60
                active:scale-[0.98] transition-all duration-200 shadow-sm cursor-pointer"
            >
              <span className="material-symbols-outlined text-[1.15rem]">
                edit_note
              </span>
              <span>Add Cover Letter</span>
            </button>

            {/* Direct Proceed Button */}
            <button
              type="button"
              id="proceed-application-btn"
              onClick={() => {
                navigate(`/candidate/jobs/${jobId}/review`, {
                  state: {
                    jobId,
                    selectedResume,
                    job,
                    aiAnalysis: analysis,
                  },
                });
              }}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold text-white
                bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700
                active:scale-[0.98] transition-all duration-200 shadow-md shadow-violet-500/25 dark:shadow-violet-950/50 cursor-pointer"
            >
              <span>Continue Application</span>
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
