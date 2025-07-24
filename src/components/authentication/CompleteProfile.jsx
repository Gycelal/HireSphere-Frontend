import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import Modal from '../ui/Modal'
import { useNavigate } from 'react-router-dom'
import { UserRoundPen, UserRoundSearch, Building2 } from 'lucide-react'
import * as Yup from 'yup'
import { useDispatch } from 'react-redux'
import { completeProfileThunk } from '../../features/auth/authThunks'
import { toast } from 'sonner'

export const CompleteProfile = () => {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(true)
  const [role, setRole] = useState(null)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const candidateSchema = Yup.object({
    first_name: Yup.string()
      .trim()
      .required('First name is required')
      .test(
        'not-empty',
        'First name cannot be empty',
        value => value && value.trim().length > 0
      ),

    last_name: Yup.string()
      .trim()
      .required('Last name is required')
      .test(
        'not-empty',
        'Last name cannot be empty',
        value => value && value.trim().length > 0
      )
  })

  const employerSchema = Yup.object({
    company_name: Yup.string()
      .trim()
      .required('Company name is required')
      .test(
        'not-empty',
        'Company name cannot be empty',
        value => value && value.trim().length > 0
      ),

    registration_number: Yup.string()
      .transform(value => value?.trim())
      .notRequired()
      .test(
        'no-whitespace-only',
        'Register number cannot be just whitespace',
        value => !value || value.trim().length > 0
      )
  })

  const handleRoleSelect = selectedRole => {
    setRole(selectedRole)
    setIsRoleModalOpen(false)
  }

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
  const roleData =
    role === 'candidate'
      ? { first_name: values.first_name, last_name: values.last_name }
      : {
          company_name: values.company_name,
          registration_number: values.registration_number
        }

  const data = {
    ...roleData,
    role: role 
  }
  console.log('data:',data)
  try {
    const response = await dispatch(completeProfileThunk(data)).unwrap()
    toast.success(response.message)
    navigate('/home')
  } catch (err) {
    if (typeof err === 'object') {
      setErrors(err) // sets field-specific errors
      console.log(err)
    }
    toast.error(
      typeof err === 'string'
        ? err
        : 'Please correct the highlighted errors.'
    )
  } finally {
    setSubmitting(false)
  }
}

  return (
    <div className='w-full flex items-center justify-center'>
      {/* Role Selection Modal */}
      <Modal isOpen={isRoleModalOpen} onClose={() => navigate('/login')}>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-white mb-2'>
            Choose Your Role
          </h2>
          <p className='text-gray-300 mb-8'>
            Select how you want to use HireSphere
          </p>

          <div className='space-y-4'>
            <button
              onClick={() => handleRoleSelect('candidate')}
              className='flex items-center justify-center gap-2 w-full px-6 py-4 bg-emerald-500 hover:bg-emerald-700 text-white font-semibold rounded-lg border-2 border-emerald-500 hover:border-emerald-400 transition-all duration-300'
            >
              <UserRoundSearch />

              <span>I'm here to Find Job</span>
            </button>

            <button
              onClick={() => handleRoleSelect('company_admin')}
              className='flex items-center justify-center gap-2 w-full px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg border-2 border-purple-500 hover:border-purple-400 transition-all duration-300'
            >
              <Building2 />
              <span>I'm here to Hire Talent</span>
            </button>
          </div>
        </div>
      </Modal>

      {/* Profile Form */}
      {role && (
        <div className='w-full max-w-md bg-white/10 backdrop-blur-sm rounded-xl shadow-2xl border border-white/20 p-6'>
          <div className='text-center mb-8'>
            <h1 className='text-2xl font-bold text-white mb-2'>
              Complete Your Profile
            </h1>
            <p className='text-gray-300'>
              {role === 'candidate'
                ? 'Tell us about yourself'
                : 'Set up your company profile'}
            </p>
          </div>

          <Formik
            initialValues={{
              first_name: '',
              last_name: '',
              company_name: '',
              registration_number: ''
            }}
            validationSchema={
              role === 'candidate' ? candidateSchema : employerSchema
            }
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className='space-y-6'>
                {role === 'candidate' ? (
                  <>
                    {/* First Name */}
                    <div>
                      <Field
                        name='first_name'
                        type='text'
                        className='w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        placeholder='Enter your first name'
                      />
                      <ErrorMessage
                        name='first_name'
                        component='div'
                        className='text-sm text-red-400 mt-1'
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <Field
                        name='last_name'
                        type='text'
                        className='w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                        placeholder='Enter your last name'
                      />
                      <ErrorMessage
                        name='last_name'
                        component='div'
                        className='text-sm text-red-400 mt-1'
                      />
                    </div>
                  </>
                ) : (
                  <>
                    {/* Company Name */}
                    <div>
                      <Field
                        name='company_name'
                        type='text'
                        className='w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                        placeholder='Company Name'
                      />
                      <ErrorMessage
                        name='company_name'
                        component='div'
                        className='text-sm text-red-400 mt-1'
                      />
                    </div>

                    {/* Company Size */}
                    <div>
                      <Field
                        name='registration_number'
                        type='text'
                        className='w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'
                        placeholder='Register Number'
                      />
                    </div>
                    <ErrorMessage
                      name='registration_number'
                      component='div'
                      className='text-sm text-red-400 mt-1'
                    />
                  </>
                )}

                {/* Submit Button */}
                <button
                  type='submit'
                  disabled={isSubmitting}
                  className={`w-full px-6 py-3 font-semibold rounded-lg transition-all duration-300 ${
                    role === 'candidate'
                      ? 'bg-blue-600 hover:bg-blue-700 border-2 border-blue-500 hover:border-blue-400'
                      : 'bg-purple-600 hover:bg-purple-700 border-2 border-purple-500 hover:border-purple-400'
                  } text-white ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? 'Saving...' : 'Complete Profile'}
                </button>
              </Form>
            )}
          </Formik>

          {/* Back Button */}
          <button
            onClick={() => {
              setRole(null)
              setIsRoleModalOpen(true)
            }}
            className='w-full mt-4 px-6 py-2 flex items-center justify-center gap-2 text-gray-400 hover:text-white transition-colors duration-300 cursor-pointer'
          >
            <UserRoundPen />
            <span>Change Role</span>
          </button>
        </div>
      )}
    </div>
  )
}
