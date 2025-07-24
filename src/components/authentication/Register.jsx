// components/auth/Register.jsx
import { Field, Formik, Form, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useState } from 'react'
import RoleToggle from './RoleToggle'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { LoaderCircle } from 'lucide-react'
import { registerUser } from '../../api/auth'

const Register = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const initialRole = location.state?.initialRole || 'candidate'
  const [role, setRole] = useState(initialRole)

  const getValidationSchema = role => {
    const baseSchema = {
      email: Yup.string().email('Invalid email').required('Required'),
      password: Yup.string().min(8, 'Min 8 characters').required('Required'),
      confirm_password: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Required')
    }

    if (role === 'candidate') {
      return Yup.object({
        ...baseSchema,
        first_name: Yup.string().required('Required'),
        last_name: Yup.string().required('Required')
      })
    } else {
      return Yup.object({
        ...baseSchema,
        company_name: Yup.string().required('Required'),
        registration_number: Yup.string()
      })
    }
  }

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    setSubmitting(true)

    // Construct minimal payload based on role
    const baseData = {
      email: values.email,
      password: values.password,
      confirm_password: values.confirm_password,
      role: role === 'company' ? 'company_admin' : 'candidate'
    }

    const roleData =
      role === 'candidate'
        ? {
            first_name: values.first_name,
            last_name: values.last_name
          }
        : {
            company_name: values.company_name,
            registration_number: values.registration_number
          }

    const data = { ...baseData, ...roleData }
    console.log('Registering user with data:', data)
    try {
      console.log('Registering user with data:', data)
      const response = await registerUser(data)
      toast.success(response.data.message)
      navigate('/verify-otp', { state: { email: values.email } })
    } catch (err) {
      console.log('err',err)
      const backendErrors = err.response?.data
      // setting backendErrors
      if (typeof backendErrors === 'object') {
        setErrors(backendErrors)
      }
      toast.error(
        typeof backendErrors === 'string'
          ? backendErrors
          : 'Please correct the highlighted errors'
      )
    } finally {
      setSubmitting(false)
    }
  }


  return (
    <div className='flex-1 flex items-center justify-center px-6 py-8'>
      <div className='w-full max-w-md'>
        <div className='text-center mb-8'>
          <h2 className='text-3xl font-bold text-white mb-2'>
            Join HireSphere
          </h2>
          <p className='text-gray-400'>Create your {role} account</p>
        </div>

        <div className='bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-6 shadow-2xl'>
          <Formik
            initialValues={{
              email: '',
              password: '',
              confirm_password: '',
              first_name: '',
              last_name: '',
              company_name: '',
              registration_number: ''
            }}
            validationSchema={getValidationSchema(role)}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ errors, touched, setFieldValue, isSubmitting, resetForm }) => (
              <Form className='space-y-4'>
                <RoleToggle
                  role={role}
                  setRole={setRole}
                  setFieldValue={setFieldValue}
                  resetForm={resetForm}
                />

                {role === 'candidate' && (
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Field
                        name='first_name'
                        placeholder='First Name'
                        className={`input ${
                          errors.first_name && touched.first_name ? 'error' : ''
                        }`}
                      />
                      <ErrorMessage
                        name='first_name'
                        component='div'
                        className='error-text'
                      />
                    </div>
                    <div>
                      <Field
                        name='last_name'
                        placeholder='Last Name'
                        className={`input ${
                          errors.last_name && touched.last_name ? 'error' : ''
                        }`}
                      />
                      <ErrorMessage
                        name='last_name'
                        component='div'
                        className='error-text'
                      />
                    </div>
                  </div>
                )}

                {role === 'company' && (
                  <>
                    <Field
                      name='company_name'
                      placeholder='Company Name'
                      className={`input ${
                        errors.company_name && touched.company_name
                          ? 'error'
                          : ''
                      }`}
                    />
                    <ErrorMessage
                      name='company_name'
                      component='div'
                      className='error-text'
                    />

                    <Field
                      name='registration_number'
                      placeholder='Registration Number'
                      className={`input ${
                        errors.registration_number &&
                        touched.registration_number
                          ? 'error'
                          : ''
                      }`}
                    />
                    <ErrorMessage
                      name='registration_number'
                      component='div'
                      className='error-text'
                    />
                  </>
                )}

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

                <Field
                  name='confirm_password'
                  type='password'
                  placeholder='Confirm Password'
                  className={`input ${
                    errors.confirm_password && touched.confirm_password
                      ? 'error'
                      : ''
                  }`}
                />
                <ErrorMessage
                  name='confirm_password'
                  component='div'
                  className='error-text'
                />

                <button
                  type='submit'
                  disabled={isSubmitting}
                  className='bg-white text-black px-8 py-2 rounded font-medium hover:bg-gray-400 w-full flex items-center justify-center gap-2 text-center disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer'
                >
                  {isSubmitting ? (
                    <LoaderCircle className='animate-spin w-5 h-5' />
                  ) : (
                    'Create Account'
                  )}
                </button>
              </Form>
            )}
          </Formik>
        </div>
        <div className='text-center mt-6 text-gray-400'>
          Already have an account?{' '}
          <a
            onClick={() => navigate('/login')}
            className='text-blue-400 hover:underline'
          >
            Sign in
          </a>
        </div>
      </div>
    </div>
  )
}

export default Register
