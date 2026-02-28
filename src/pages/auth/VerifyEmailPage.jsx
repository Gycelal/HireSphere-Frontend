import { useState } from "react";
import { Link } from "react-router-dom";

export default function VerifyEmailPage() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // TODO: call send-reset-link API
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
    setSent(true);
  };

  // ── Post-send confirmation state ─────────────────────────────────────────
  if (sent) {
    return (
      <div className="flex flex-col gap-6">

        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-violet-50 dark:bg-violet-950/60 border border-violet-100 dark:border-violet-900">
          <span className="material-symbols-outlined text-violet-600 dark:text-violet-400 text-[1.8rem]">
            mark_email_read
          </span>
        </div>

        {/* Message */}
        <div className="flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Check your inbox
          </h1>
          <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed">
            We sent a password reset link to{" "}
            <span className="font-medium text-gray-600 dark:text-gray-300">{email}</span>.
            The link expires in 30 minutes.
          </p>
        </div>

        {/* Hint */}
        <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800">
          <span className="material-symbols-outlined text-gray-400 dark:text-gray-500 text-[1.1rem] mt-0.5 flex-shrink-0">
            info
          </span>
          <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
            Can't find it? Check your spam folder or{" "}
            <button
              type="button"
              onClick={() => setSent(false)}
              className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors duration-200"
            >
              try another email address
            </button>
            .
          </p>
        </div>

        {/* Back to login */}
        <Link
          to="/auth/login"
          className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200 w-fit"
        >
          <span className="material-symbols-outlined text-[1.1rem]">arrow_back</span>
          Back to Login
        </Link>
      </div>
    );
  }

  // ── Default: email entry state ────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6">

      {/* Back */}
      <Link
        to="/auth/login"
        className="inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200 w-fit"
      >
        <span className="material-symbols-outlined text-[1.1rem]">arrow_back</span>
        Back to Login
      </Link>

      {/* Heading */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Verify Email
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed">
          Enter your account email and we'll send you a link to reset your password.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* Email field */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide"
          >
            Email
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[1.1rem] text-gray-400 dark:text-gray-500 pointer-events-none select-none">
              mail
            </span>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!email.trim() || loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md shadow-violet-200 dark:shadow-violet-900/30 mt-1"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined text-[1rem] animate-spin">
                progress_activity
              </span>
              Sending…
            </>
          ) : (
            <>
              Send Verification Link
              <span className="material-symbols-outlined text-[1rem]">send</span>
            </>
          )}
        </button>
      </form>

    </div>
  );
}