import { Field, Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginThunk, adminLoginThunk } from '../../features/auth/authThunks'
import { toast } from 'sonner'
import GoogleButton from '../ui/GoogleButton'

const Login = ({ isAdmin = false }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleForgotPassword = () => navigate('/verify-email')

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required')
  })

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const thunkToUse = isAdmin ? adminLoginThunk : loginThunk
      const response = await dispatch(thunkToUse(values))

      console.log('Login response:', response)

      if (thunkToUse.fulfilled.match(response)) {
        toast.success('Login successful!')
        const role = response.payload.user.role
        console.log('User role:', role)
        switch (role) {
          case 'admin':
            navigate('/admin-dashboard')
            break
          case 'company_admin':
            navigate('/company-dashboard')
            break
          case 'candidate':
            navigate('/home')
            break
          default:
            navigate('/')
            break
        }
      } else {
        const errors = response.payload

        if (
          Array.isArray(errors?.code) &&
          errors.code.includes('unverified_user')
        ) {
          toast.warning(errors.detail?.[0] || 'Please verify your account.')
          navigate('/verify-otp', { state: { email: values.email } })
        } else if (errors?.email) {
          setErrors({ email: errors.email[0] })
          toast.error('Please fix the email field.')
        } else if (errors?.non_field_errors) {
          toast.error(errors.non_field_errors[0])
        } else {
          toast.error('Login failed. Please try again.')
        }
      }
    } catch (err) {
      console.error('Unexpected error during login:', err)
      toast.error('Unexpected error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }
  const handleSignUp = () => {
    navigate('/register', { state: { initialRole: 'candidate' } })
  }

  return (
    <div className='flex-1 flex items-center justify-center px-6 py-8'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <h2 className='text-3xl font-bold text-white mb-2'>Welcome Back</h2>
          <p className='text-gray-400'>Sign in to your account</p>
        </div>

        <div className='bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-2xl'>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ errors, touched }) => (
              <Form className='space-y-4'>
                <div>
                  <Field
                    name='email'
                    type='email'
                    placeholder='Email'
                    className={`input ${
                      errors.email && touched.email ? 'error' : ''
                    }`}
                  />
                  <ErrorMessage
                    name='email'
                    component='div'
                    className='error-text'
                  />
                </div>

                <div>
                  <Field
                    name='password'
                    type='password'
                    placeholder='Password'
                    className={`input ${
                      errors.password && touched.password ? 'error' : ''
                    }`}
                  />
                  <ErrorMessage
                    name='password'
                    component='div'
                    className='error-text'
                  />
                </div>

                <button
                  type='submit'
                  className='bg-white text-black px-8 py-2 rounded font-medium w-full cursor-pointer hover:bg-gray-400 transition-colors'
                >
                  Sign In
                </button>
                {!isAdmin && (
                  <>
                    <div className='relative my-6'>
                      <div className='absolute inset-0 flex items-center'>
                        <div className='w-full border-t border-white/20'></div>
                      </div>
                      <div className='relative flex justify-center text-sm'>
                        <span className='px-2 text-gray-400'>
                          Or continue with
                        </span>
                      </div>
                    </div>

                    <GoogleButton />
                    <p
                      onClick={handleForgotPassword}
                      className='text-center text-red-500 hover:underline cursor-pointer'
                    >
                      Forgot password?
                    </p>
                  </>
                )}
              </Form>
            )}
          </Formik>
        </div>

        {!isAdmin && (
          <div className='text-center mt-6 text-gray-400'>
            Don’t have an account?{' '}
            <a onClick={handleSignUp} className='text-blue-400 hover:underline'>
              Sign up
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login
