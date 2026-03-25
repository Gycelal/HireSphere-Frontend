import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../validation/authSchemas";
import { publicApi } from "../../services/api";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../store/slices/authSlice";

export default function AdminLoginPage() {

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = async (data) => {
  try {

    const res = await publicApi.post("accounts/login/", data)
    console.log("the data:", res.data)
    const user = res.data.user

    if (user.role !== "admin") {
      setError("root", {
        type: "server",
        message: "You are not authorized to access admin portal."
      })
      return
    }
    localStorage.setItem("access", res.data.access)
    dispatch(loginSuccess(res.data))
    navigate("/admin/dashboard", { replace: true })
    toast.success("Login Success!")

  } catch (err) {
    console.error("err:",err)
    if (!err.response) {
      toast.error("Unable to connect to the server.")
      return
    }

    setError("root", {
      type: "server",
      message: "Invalid admin credentials."
    })
  }
}

  return (
    <div className="flex flex-col gap-6">

      {/* Restricted badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 w-fit">
        <span className="material-symbols-outlined text-gray-500">
          shield_lock
        </span>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">
          Restricted Access
        </span>
      </div>

      {/* Heading */}
      <div className="flex flex-col gap-1.5">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Admin Login
        </h1>
        <p className="text-sm text-gray-400 dark:text-gray-500">
          This portal is permitted to authorised platform administrators only.
        </p>
      </div>

      {/* Global Error */}
      {errors.root && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/60">
          <span className="material-symbols-outlined text-red-500">error</span>
          <p className="text-sm text-red-600 dark:text-red-400">
            {errors.root.message}
          </p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Admin Email
          </label>

          {errors.email && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          )}

          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              mail
            </span>

            <input
              type="email"
              placeholder="admin@hiresphere.io"
              {...register("email")}
              autoComplete="username"
              className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
            Password
          </label>

          {errors.password && (
            <p className="text-xs text-red-600 dark:text-red-400">
              {errors.password.message}
            </p>
          )}

          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              lock
            </span>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              {...register("password")}
              className="w-full pl-9 pr-10 py-2.5 rounded-xl text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200"
            />

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            >
              <span className="material-symbols-outlined">
                {showPassword ? "visibility_off" : "visibility"}
              </span>
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center py-2.5 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "Authenticating..." : "Log in"}
        </button>

      </form>

      {/* Footer */}
      <p className="text-center text-xs text-gray-300 dark:text-gray-700">
        Not an admin?{" "}
        <Link to={"login"} className="text-gray-400 hover:text-violet-600">Return to regular login</Link>
      </p>

    </div>
  );
}