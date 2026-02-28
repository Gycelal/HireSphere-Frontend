import { useState } from "react";
import { Link } from "react-router-dom";
import GoogleButton from "../../components/common/GoogleButton";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../validation/authSchemas";
import axios from "axios";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const { register, handleSubmit,setError, formState: {errors} } = useForm({
    resolver: zodResolver(loginSchema)
  })

  const onSubmit = async (data)=>{
    try{
      setLoading(true)
      console.log("Form data:", data);
      const response = await axios.post('http://127.0.0.1:8000/api/accounts/login/', data)
    }catch(error){
      setError("root", {type: "server", message: error.response?.data?.detail || "Login failed. Please try again."})
      console.log("Login failed:", error.response.data);
    }finally{
      setLoading(false)
    }
  }

  
  return (
    <div className="flex flex-col gap-7">

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Log in
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          Welcome back — enter your details below.
        </p>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="email"
            className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide"
          >
            Email
          </label>
          {errors.email && (
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">
              {errors.email.message}
            </p>
          )}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[1.1rem] text-gray-400 dark:text-gray-500 pointer-events-none">
              mail
            </span>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register("email")}
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
          {errors.password && (
            <p className="text-xs text-red-600 dark:text-red-400 font-medium">
              {errors.password.message}
            </p>
          )}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[1.1rem] text-gray-400 dark:text-gray-500 pointer-events-none">
              lock
            </span>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="••••••••"
              {...register("password")}
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

          {/* Forgot password */}
          <div className="flex justify-end">
            <Link
              to="/auth/forgot-password"
              className="text-xs font-medium text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        {errors.root && (
          <p className="text-sm text-red-600 dark:text-red-400 font-medium text-center">
            {errors.root.message}
          </p>
        )}

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
              Logging in…
            </>
          ) : (
            <>
              Log in
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

      {/* ── Google OAuth Button ── */}
      <GoogleButton />
      {/* ── Register Link ── */}
      <p className="text-center text-sm text-gray-400 dark:text-gray-500">
        Don't have an account?{" "}
        <Link
          to="/auth/register"
          className="font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors duration-200"
        >
          Register
        </Link>
      </p>

    </div>
  );
}