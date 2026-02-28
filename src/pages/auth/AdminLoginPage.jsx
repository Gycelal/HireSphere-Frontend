import { useState } from "react";

export default function AdminLoginPage() {
  const [form, setForm]                 = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    // TODO: call admin auth API
    await new Promise((r) => setTimeout(r, 1400));
    // Simulate wrong credentials for demo
    setError("Invalid credentials. Access denied.");
    setLoading(false);
  };

  const canSubmit = form.email.trim() && form.password.trim();

  return (
    <div className="flex flex-col gap-6">

      {/* ── Restricted access badge ── */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-fit">
        <span className="material-symbols-outlined text-[1rem] text-gray-500 dark:text-gray-400">
          shield_lock
        </span>
        <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-widest">
          Restricted Access
        </span>
      </div>

      {/* ── Heading ── */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Admin Login
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500 leading-relaxed">
          This portal is restricted to authorised platform administrators only.
          Unauthorised access attempts are logged.
        </p>
      </div>

      {/* ── Error alert ── */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/60">
          <span className="material-symbols-outlined text-[1.1rem] text-red-500 dark:text-red-400 flex-shrink-0">
            error
          </span>
          <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
        </div>
      )}

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide"
          >
            Admin Email
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[1.1rem] text-gray-400 dark:text-gray-500 pointer-events-none select-none">
              mail
            </span>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
              placeholder="admin@hiresphere.io"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="password"
            className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide"
          >
            Password
          </label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[1.1rem] text-gray-400 dark:text-gray-500 pointer-events-none select-none">
              lock
            </span>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
            >
              <span className="material-symbols-outlined text-[1.1rem]">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={!canSubmit || loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md shadow-violet-200 dark:shadow-violet-900/30 mt-1"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined text-[1rem] animate-spin">
                progress_activity
              </span>
              Authenticating…
            </>
          ) : (
            <>
              Log in
              <span className="material-symbols-outlined text-[1rem]">arrow_forward</span>
            </>
          )}
        </button>
      </form>

      {/* ── Divider + notice ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
        <span className="material-symbols-outlined text-[1rem] text-gray-300 dark:text-gray-700">
          lock
        </span>
        <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
      </div>

      <p className="text-center text-xs text-gray-300 dark:text-gray-700 leading-relaxed">
        Not an admin?{" "}
        <a
          href="/auth/login"
          className="text-gray-400 dark:text-gray-600 hover:text-violet-600 dark:hover:text-violet-400 font-medium transition-colors duration-200"
        >
          Return to regular login
        </a>
      </p>

    </div>
  );
}