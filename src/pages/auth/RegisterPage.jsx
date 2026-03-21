import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import GoogleButton from '../../components/common/GoogleButton'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registerSchema } from '../../validation/authSchemas'
import { publicApi } from '../../services/api'
import toast from 'react-hot-toast'
import Field from '../../components/common/Field'
import { inputClass } from '../../components/common/Field'

//RegisterPage
export default function RegisterPage () {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors },
    watch
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onTouched',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    defaultValues: {
      role: 'candidate'
    }
  })

  const role = watch('role')
  const navigate = useNavigate()

  const onSubmit = async data => {
    try {
      setLoading(true)
      console.log('form data:', data)
      const response = await publicApi.post('accounts/register/', data)
      console.log(response.data)
      if (response.status === 201) {
        navigate('/verify-otp', {
          state: { user_id: response.data?.user_id }
        })
        toast.success(response.data?.message)
      }
    } catch (error) {
      const serverErrors = error.response?.data
      if (serverErrors) {
        Object.entries(serverErrors).forEach(([field, messages]) => {
          setError(field, {
            type: 'server',
            message: messages[0]
          })
        })
      }
      toast.error('Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-col gap-6'>
      {/* Heading */}
      <div className='flex flex-col gap-1'>
        <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
          Create account
        </h1>
        <p className='text-sm text-gray-400 dark:text-gray-500'>
          Get started...
        </p>
      </div>

      {/* Role Segmented Control */}
      <div
        role='group'
        aria-label='Select your role'
        className='flex rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden bg-gray-50 dark:bg-gray-900 p-1 gap-1'
      >
        {[
          { value: 'candidate', label: "I'm a Candidate" },
          { value: 'recruiter', label: "I'm a Recruiter" }
        ].map(({ value, label }) => (
          <button
            key={value}
            type='button'
            onClick={() => {
              setValue('role', value)
            }}
            aria-pressed={role === value}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              role === value
                ? 'bg-white dark:bg-gray-800 text-violet-600 dark:text-violet-400 shadow-sm border border-gray-200 dark:border-gray-700'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className='flex flex-col gap-4'
      >
        {/* Hidden Field for role */}
        <input type='hidden' {...register('role')} />
        {/* First + Last Name row */}
        <div className='grid grid-cols-2 gap-3'>
          <Field id='firstName' label='First Name' icon='person'>
            <input
              id='firstName'
              type='text'
              autoComplete='given-name'
              placeholder='Alex'
              {...register('first_name')}
              className={inputClass}
            />
          </Field>
          <Field id='lastName' label='Last Name' icon='badge'>
            <input
              id='lastName'
              type='text'
              autoComplete='family-name'
              placeholder='Kumar'
              {...register('last_name')}
              className={inputClass}
            />
          </Field>
          {(errors.first_name || errors.last_name) && (
            <p className='text-xs text-red-600 dark:text-red-400 font-medium'>
              {errors.first_name?.message || errors.last_name?.message}
            </p>
          )}
        </div>

        {/* Email */}
        <Field id='email' label='Email' icon='mail'>
          <input
            id='email'
            type='email'
            autoComplete='email'
            required
            placeholder='you@example.com'
            {...register('email')}
            className={inputClass}
          />
        </Field>
        {errors.email && (
          <p className='text-xs text-red-600 dark:text-red-400 font-medium'>
            {errors.email.message}
          </p>
        )}

        {/* Password */}
        <Field id='password' label='Password' icon='lock'>
          <input
            id='password'
            type={showPassword ? 'text' : 'password'}
            autoComplete='new-password'
            placeholder='Min. 8 characters'
            {...register('password')}
            className={`${inputClass} pr-10`}
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
        </Field>
        {errors.password && (
          <p className='text-xs text-red-600 dark:text-red-400 font-medium'>
            {errors.password.message}
          </p>
        )}

        {/* Confirm Password */}
        <Field id='confirm' label='Confirm Password' icon='lock_reset'>
          <input
            id='confirm'
            type={showConfirm ? 'text' : 'password'}
            autoComplete='new-password'
            placeholder='Re-enter your password'
            {...register('confirm_password')}
            className={`${inputClass} pr-10`}
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
        </Field>
        {errors.confirm_password && (
          <p className='text-xs text-red-600 dark:text-red-400 font-medium'>
            {errors.confirm_password.message}
          </p>
        )}
        {/* Submit */}
        <button
          type='submit'
          disabled={loading}
          className='w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 shadow-md shadow-violet-200 dark:shadow-violet-900/30 mt-1'
        >
          {loading ? (
            <>
              <span className='material-symbols-outlined text-[1rem] animate-spin'>
                progress_activity
              </span>
              Creating account…
            </>
          ) : (
            <>
              Create account
              <span className='material-symbols-outlined text-[1rem]'>
                arrow_forward
              </span>
            </>
          )}
        </button>
      </form>

      {/* ── Divider ── */}
      <div className='flex items-center gap-3'>
        <div className='flex-1 h-px bg-gray-200 dark:bg-gray-800' />
        <span className='text-xs font-medium text-gray-400 dark:text-gray-600'>
          or
        </span>
        <div className='flex-1 h-px bg-gray-200 dark:bg-gray-800' />
      </div>

      {/* ── Continue with Google ── */}
      <GoogleButton />
      {/* ── Login Link ── */}
      <p className='text-center text-sm text-gray-400 dark:text-gray-500'>
        Already have an account?{' '}
        <Link
          to='/login'
          className='font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 dark:hover:text-violet-300 transition-colors duration-200'
        >
          Log in
        </Link>
      </p>
    </div>
  )
}
