import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { passwordResetSchema } from '../../validation/authSchemas'
import { publicApi } from '../../services/api'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { zodResolver } from '@hookform/resolvers/zod'

export default function ResetPasswordPage () {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { token } = useParams()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(passwordResetSchema),
    mode: 'onTouched',
    reValidationMode: 'onChange',
    shouldFocusError: true
  })
  const onSubmit = async data => {
    setIsSubmitting(true)
    try {
      const res = await publicApi.post('accounts/reset-password/', {
        token: token,
        password: data.password,
        confirm_password: data.confirm_password
      })
      if (res.status === 200) {
        toast.success(res.data?.message)
        navigate('login')
      }
    } catch (error) {
      const err = error.response?.data

      if (err) {
        Object.entries(err).forEach(([key, value]) => {
          if (key === 'error') {
            toast.error(value)
          } else {
            setError(key, { message: value })
          }
        })
      } else {
        toast.error('Something went wrong.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }
  return (
    <div className='flex flex-col gap-6'>
      {/* Back */}
      <Link
        to='/login'
        className='inline-flex items-center gap-1.5 text-sm text-gray-400 dark:text-gray-500 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200 w-fit'
      >
        <span className='material-symbols-outlined text-[1.1rem]'>
          arrow_back
        </span>
        Back to Login
      </Link>

      {/* Heading */}
      <div className='flex flex-col gap-1'>
        <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
          Reset Password
        </h1>
        <p className='text-sm text-gray-400 dark:text-gray-500'>
          Choose a strong new password for your account.
        </p>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className='flex flex-col gap-4'
      >
        {/* New Password */}
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='password'
            className='text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide'
          >
            New Password
          </label>
          <div className='relative'>
            <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[1.1rem] text-gray-400 dark:text-gray-500 pointer-events-none select-none'>
              lock
            </span>
            <input
              id='password'
              type={showPassword ? 'text' : 'password'}
              autoComplete='new-password'
              placeholder='Min. 8 characters'
              {...register('password')}
              aria-invalid={!!errors.password}
              className={`w-full pl-9 pr-10 py-2.5 rounded-xl text-sm bg-white dark:bg-gray-900 border text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                errors.password
                  ? 'border-red-300 dark:border-red-700 focus:ring-red-400'
                  : 'border-gray-200 dark:border-gray-700 focus:ring-violet-500'
              }`}
            />
            <button
              type='button'
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'
            >
              <span className='material-symbols-outlined text-[1.1rem]'>
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {errors.password && (
            <p className='flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400 mt-0.5'>
              <span className='material-symbols-outlined text-[0.9rem] shrink-0'>
                error
              </span>
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className='flex flex-col gap-1.5'>
          <label
            htmlFor='confirm_password'
            className='text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide'
          >
            Confirm Password
          </label>
          <div className='relative'>
            <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[1.1rem] text-gray-400 dark:text-gray-500 pointer-events-none select-none'>
              lock_reset
            </span>
            <input
              id='confirm_password'
              type={showConfirm ? 'text' : 'password'}
              autoComplete='new-password'
              placeholder='Re-enter your password'
              {...register('confirm_password')}
              aria-invalid={!!errors.confirm_password}
              className={`w-full pl-9 pr-10 py-2.5 rounded-xl text-sm bg-white dark:bg-gray-900 border text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                errors.confirm_password
                  ? 'border-red-300 dark:border-red-700 focus:ring-red-400'
                  : 'border-gray-200 dark:border-gray-700 focus:ring-violet-500'
              }`}
            />
            <button
              type='button'
              onClick={() => setShowConfirm(v => !v)}
              aria-label={showConfirm ? 'Hide password' : 'Show password'}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'
            >
              <span className='material-symbols-outlined text-[1.1rem]'>
                {showConfirm ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          </div>
          {errors.confirm_password && (
            <p className='flex items-center gap-1.5 text-xs text-red-500 dark:text-red-400 mt-0.5'>
              <span className='material-symbols-outlined text-[0.9rem] shrink-0'>
                error
              </span>
              {errors.confirm_password.message}
            </p>
          )}
        </div>

        {/* Submit */}
        <button
          type='submit'
          disabled={isSubmitting}
          className='w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md shadow-violet-200 dark:shadow-violet-900/30 mt-1'
        >
          {isSubmitting ? (
            <>
              <span className='material-symbols-outlined text-[1rem] animate-spin'>
                progress_activity
              </span>
              Resetting…
            </>
          ) : (
            <>
              Reset Password
              <span className='material-symbols-outlined text-[1rem]'>
                lock_open
              </span>
            </>
          )}
        </button>
      </form>
    </div>
  )
}
