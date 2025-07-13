import { Field, Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginThunk } from '../../features/auth/authThunks'
import { loginUser } from '../../api/auth'

const Login = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleForgotPassword = () => navigate('/verify-email',{})

  const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required')
  })

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const resultAction = await dispatch(loginThunk(values))
      if (!loginUser.fulfilled.match(resultAction)) {
        setErrors({ general: resultAction.payload || 'Login failed' })
      }
    } catch (err) {
      setErrors({ general: 'Something went wrong' })
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleSignIn = () => {
    console.log('Google sign in clicked')
    // TODO: implement Google OAuth
  }

  const handleSignUp = ()=>{
    navigate('/register',{state:{initialRole:'candidate'}})
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

                <button type='submit' className='btn-primary w-full'>
                  Sign In
                </button>

                <div className='relative my-6'>
                  <div className='absolute inset-0 flex items-center'>
                    <div className='w-full border-t border-white/20'></div>
                  </div>
                  <div className='relative flex justify-center text-sm'>
                    <span className='px-2 text-gray-400'>Or continue with</span>
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
                  onClick={handleForgotPassword}
                  className='text-center text-red-500 hover:underline cursor-pointer'
                >
                  Forgot password?
                </p>
              </Form>
            )}
          </Formik>
        </div>
        <div className='text-center mt-6 text-gray-400'>
          Don’t have an account?{' '}
          <a onClick={handleSignUp} className='text-blue-400 hover:underline'>
            Sign up
          </a>
        </div>
      </div>
    </div>
  )
}

export default Login
