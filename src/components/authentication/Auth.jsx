import { Field, Formik, Form, ErrorMessage } from 'formik'
import { useState } from 'react'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginThunk, registerThunk } from '../../features/auth/authThunks'
import { loginUser } from '../../api/auth'
import RoleToggle from './RoleToggle'

export const Auth = ({ initialRole }) => {
  const [authMode, setAuthMode] = useState('register')
  const [role, setRole] = useState(initialRole)

  const dispatch = useDispatch()

  const navigate = useNavigate()
  const handleFortgotPassword = () => {
    navigate('/verify-email')
  }

  console.log('initial role in auth:', role)

  // Returns Yup validation schema on the basis of authMode and role
  const getValidationSchema = (authMode, role) => {
    if (authMode === 'login') {
      return Yup.object().shape({
        email: Yup.string()
          .email('Invalid email')
          .required('Email is required'),
        password: Yup.string().required('Password is required')
      })
    }

    if (authMode === 'register') {
      const baseSchema = {
        email: Yup.string()
          .email('Invalid email')
          .required('Email is required'),
        password: Yup.string()
          .min(6, 'Min 6 characters')
          .required('Password is required'),
        confirm_password: Yup.string()
          .oneOf([Yup.ref('password')], 'Passwords must match')
          .required('Confirm your password')
      }

      if (role === 'candidate') {
        return Yup.object().shape({
          ...baseSchema,
          first_name: Yup.string().required('First name is required'),
          last_name: Yup.string().required('Last name is required')
        })
      }

      if (role === 'company') {
        return Yup.object().shape({
          ...baseSchema,
          company_name: Yup.string().required('Company name is required'),
          registration_number: Yup.string()
        })
      }
    }
    return Yup.object()
  }

  const handleGoogleSignIn = () => {
    console.log('Google sign in clicked')
    // Implement Google OAuth logic here
  }

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    console.log('The role in handleSubmit:', values.role)
    const formattedValues = {
      ...values,
      role: values.role === 'company' ? 'company_admin' : values.role
    }
    try {
      if (authMode === 'login') {
        const resultAction = dispatch(loginThunk(formattedValues))
        if (loginUser.fulfilled.match(resultAction)) {
          console.log('Logged in:', resultAction.payload)
        } else {
          setErrors({ general: resultAction.payload || 'Login failed' })
        }
      } else if (authMode === 'register') {
        const registrationData = { ...formattedValues }
        console.log(registrationData)
        const resultAction = await dispatch(registerThunk(registrationData))
        if (registerThunk.fulfilled.match(resultAction)) {
          console.log('Registered:', resultAction.payload)
        } else {
          setErrors({ general: resultAction.payload || 'Registration failed' })
        }
      }
    } catch (err) {
      setErrors({ general: 'Something went wrong' })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className='flex-1 flex items-center justify-center px-6 py-8'>
      <div className='w-full max-w-md'>
        {/* Header */}
        <div className='text-center mb-8'>
          <h2 className='text-3xl font-bold text-white mb-2'>
            {authMode === 'login' ? 'Welcome Back' : 'Join HireSphere'}
          </h2>
          <p className='text-gray-400'>
            {authMode === 'login'
              ? 'Sign in to your account'
              : `Create your ${role} account`}
          </p>
        </div>

        {/* Role Toggle for Registration */}

        {/* Form Container */}
        <div className='bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-2xl'>
          <Formik
            initialValues={{
              email: '',
              password: '',
              confirm_password: '',
              first_name: '',
              last_name: '',
              company_name: '',
              registration_number: '',
              role: role||'',
            }}
            validationSchema={getValidationSchema(authMode, role)}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched, setFieldValue, resetForm }) => (
              <Form className='space-y-4'>
                {authMode === 'register' && (
                  <RoleToggle
                    role={role}
                    setRole={setRole}
                    setFieldValue={setFieldValue}
                    resetForm={resetForm}
                  />
                )}
                {/* Register – Candidate Fields */}
                {authMode === 'register' && role === 'candidate' && (
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Field
                        name='first_name'
                        placeholder='First Name'
                        className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.first_name && touched.first_name
                            ? 'border-red-500'
                            : 'border-white/20'
                        }`}
                      />
                      <ErrorMessage
                        name='first_name'
                        component='div'
                        className='text-red-400 text-xs mt-1'
                      />
                    </div>
                    <div>
                      <Field
                        name='last_name'
                        placeholder='Last Name'
                        className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          errors.last_name && touched.last_name
                            ? 'border-red-500'
                            : 'border-white/20'
                        }`}
                      />
                      <ErrorMessage
                        name='last_name'
                        component='div'
                        className='text-red-400 text-xs mt-1'
                      />
                    </div>
                  </div>
                )}

                {/* Register – Company Fields */}
                {authMode === 'register' && role === 'company' && (
                  <div>
                    <Field
                      name='company_name'
                      placeholder='Company Name'
                      className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                        errors.company_name && touched.company_name
                          ? 'border-red-500'
                          : 'border-white/20'
                      }`}
                    />
                    <ErrorMessage
                      name='company_name'
                      component='div'
                      className='text-red-400 text-xs mt-1'
                    />
                  </div>
                )}

                {/* Email Field */}
                <div>
                  <Field
                    name='email'
                    type='email'
                    placeholder='Email Address'
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.email && touched.email
                        ? 'border-red-500'
                        : 'border-white/20'
                    }`}
                  />
                  <ErrorMessage
                    name='email'
                    component='div'
                    className='text-red-400 text-xs mt-1'
                  />
                </div>

                {/* Company Registration Number */}
                {authMode === 'register' && role === 'company' && (
                  <div>
                    <Field
                      name='registration_number'
                      placeholder='Registration Number'
                      className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all ${
                        errors.registration_number &&
                        touched.registration_number
                          ? 'border-red-500'
                          : 'border-white/20'
                      }`}
                    />
                    <ErrorMessage
                      name='registration_number'
                      component='div'
                      className='text-red-400 text-xs mt-1'
                    />
                  </div>
                )}

                {/* Password Field */}

                <div>
                  <Field
                    name='password'
                    type='password'
                    placeholder='Password'
                    className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                      errors.password && touched.password
                        ? 'border-red-500'
                        : 'border-white/20'
                    }`}
                  />
                  <ErrorMessage
                    name='password'
                    component='div'
                    className='text-red-400 text-xs mt-1'
                  />
                </div>

                {/* Confirm Password (Only for Register) */}
                {authMode === 'register' && (
                  <div>
                    <Field
                      name='confirm_password'
                      type='password'
                      placeholder='Confirm Password'
                      className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        errors.confirm_password && touched.confirm_password
                          ? 'border-red-500'
                          : 'border-white/20'
                      }`}
                    />
                    <ErrorMessage
                      name='confirm_password'
                      component='div'
                      className='text-red-400 text-xs mt-1'
                    />
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type='submit'
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] ${
                    authMode === 'login'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                      : role === 'candidate'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600'
                  }`}
                >
                  {authMode === 'login' ? 'Sign In' : 'Create Account'}
                </button>

                {/* Google Sign In (Only for Login) */}
                {authMode === 'login' && (
                  <>
                    <div className='relative my-6'>
                      <div className='absolute inset-0 flex items-center'>
                        <div className='w-full border-t border-white/20'></div>
                      </div>
                      <div className='relative flex justify-center text-sm'>
                        <span className='px-2 bg-transparent text-gray-400'>
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <button
                      type='button'
                      onClick={handleGoogleSignIn}
                      className='w-full py-3 px-4 bg-white/10 border border-white/20 rounded-xl text-white font-medium hover:bg-white/20 transition-all duration-200 flex items-center justify-center gap-3'
                    >
                      <svg className='w-5 h-5' viewBox='0 0 24 24'>
                        <path
                          fill='currentColor'
                          d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                        />
                        <path
                          fill='currentColor'
                          d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                        />
                        <path
                          fill='currentColor'
                          d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                        />
                        <path
                          fill='currentColor'
                          d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                        />
                      </svg>
                      Continue with Google
                    </button>
                    <p
                      onClick={handleFortgotPassword}
                      className='text-center text-red-500 hover:underline cursor-pointer'
                    >
                      Forgot password?
                    </p>
                  </>
                )}

                {/* Toggle Auth Mode */}
                <div className='text-center mt-6'>
                  <p className='text-gray-400'>
                    {authMode === 'login' ? (
                      <>
                        Don't have an account?{' '}
                        <button
                          onClick={() => {
                            setAuthMode('register')
                            resetForm()
                          }}
                          className='text-blue-400 hover:text-blue-300 font-medium cursor-pointer transition-colors'
                        >
                          Sign up
                        </button>
                      </>
                    ) : (
                      <>
                        Already have an account?{' '}
                        <button
                          onClick={() => {
                            setAuthMode('login')
                            resetForm()}}
                          className='text-blue-400 hover:text-blue-300  cursor-pointer font-medium transition-colors '
                        >
                          Sign in
                        </button>
                      </>
                    )}
                  </p>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  )
}
