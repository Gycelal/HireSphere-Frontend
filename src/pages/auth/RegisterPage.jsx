import { useState } from "react";
import { Link } from "react-router-dom";

// ── Shared input wrapper ──────────────────────────────────────────────────────
function Field({ id, label, icon, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide"
      >
        {label}
      </label>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[1.1rem] text-gray-400 dark:text-gray-500 pointer-events-none select-none">
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}

const inputClass =
  "w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200";

// ── RegisterPage ──────────────────────────────────────────────────────────────
export default function RegisterPage() {
  const [role, setRole]               = useState("candidate"); // "candidate" | "recruiter"
  const [form, setForm]               = useState({ firstName: "", lastName: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword]   = useState(false);
  const [showConfirm, setShowConfirm]     = useState(false);
  const [loading, setLoading]             = useState(false);

  const handleChange = (e) =>
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // TODO: wire up registration logic
    await new Promise((r) => setTimeout(r, 1400));
    setLoading(false);
  };

  const handleGoogle = () => {
    // TODO: Google OAuth with role param
  };

  return (
    <div className="flex flex-col gap-6">

      {/* ── Heading ── */}
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Create account
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Get started...
        </p>
      </div>

      {/* ── Role Segmented Control ── */}
      <div
        role="group"
        aria-label="Select your role"
        className="flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-900 p-1 gap-1"
      >
        {[
          { value: "candidate", label: "I'm a Candidate" },
          { value: "recruiter", label: "I'm a Recruiter" },
        ].map(({ value, label }) => (
          <button
            key={value}
            type="button"
            onClick={() => setRole(value)}
            aria-pressed={role === value}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              role === value
                ? "bg-white dark:bg-gray-800 text-violet-600 dark:text-violet-400 shadow-sm border border-gray-200 dark:border-gray-700"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* ── Form ── */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

        {/* First + Last Name row */}
        <div className="grid grid-cols-2 gap-3">
          <Field id="firstName" label="First Name" icon="person">
            <input
              id="firstName"
              name="firstName"
              type="text"
              autoComplete="given-name"
              required
              placeholder="Alex"
              value={form.firstName}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
          <Field id="lastName" label="Last Name" icon="badge">
            <input
              id="lastName"
              name="lastName"
              type="text"
              autoComplete="family-name"
              required
              placeholder="Kumar"
              value={form.lastName}
              onChange={handleChange}
              className={inputClass}
            />
          </Field>
        </div>

        {/* Email */}
        <Field id="email" label="Email" icon="mail">
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>

        {/* Password */}
        <Field id="password" label="Password" icon="lock">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            placeholder="Min. 8 characters"
            value={form.password}
            onChange={handleChange}
            className={`${inputClass} pr-10`}
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
        </Field>

        {/* Confirm Password */}
        <Field id="confirm" label="Confirm Password" icon="lock_reset">
          <input
            id="confirm"
            name="confirm"
            type={showConfirm ? "text" : "password"}
            autoComplete="new-password"
            required
            placeholder="Re-enter your password"
            value={form.confirm}
            onChange={handleChange}
            className={`${inputClass} pr-10`}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            aria-label={showConfirm ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
          >
            <span className="material-symbols-outlined text-[1.1rem]">
              {showConfirm ? "visibility_off" : "visibility"}
            </span>
          </button>
        </Field>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-md shadow-violet-200 dark:shadow-violet-900/30 mt-1"
        >
          {loading ? (
            <>
              <span className="material-symbols-outlined text-[1rem] animate-spin">
                progress_activity
              </span>
              Creating account…
            </>
          ) : (
            <>
              Create account
              <span className="material-symbols-outlined text-[1rem]">arrow_forward</span>
            </>
          )}
        </button>
      </form>

      {/* ── Divider ── */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
        <span className="text-xs font-medium text-gray-400 dark:text-gray-600">or</span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
      </div>

      {/* ── Continue with Google ── */}
      <button
        type="button"
        onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl text-sm font-semibold text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 shadow-sm"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
          <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
        Continue with Google
      </button>

      {/* ── Login Link ── */}
      <p className="text-center text-sm text-gray-400 dark:text-gray-500">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors duration-200"
        >
          Log in
        </Link>
      </p>

    </div>
  );
}