import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { forgotPassword } from '../../api/auth'
import {toast} from 'sonner'


const VerifyEmail = () => {
  const navigate = useNavigate()

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
  console.log('Email submitted for verification:', values.email);
  setSubmitting(true);

  try {
    const response = await forgotPassword({ email: values.email }); 
    console.log('response:', response);

    toast.success('Verification email sent! Please check your inbox.');
    navigate('/login');
  } catch (error) {
    const errData = error?.response?.data;

    if (typeof errData === 'object') {
      if (errData.email) {
        setErrors({ email: errData.email[0] });
      }

      if (errData.non_field_errors) {
        toast.error(errData.non_field_errors[0]);
      } else if (errData.detail) {
        toast.error(errData.detail);
      }
    } else {
      toast.error('Failed to send verification email.');
    }
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className='flex-1 flex items-center justify-center px-6 py-i'>
      <div className='w-full max-w-md bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-lg'>
        {/* Back Button */}
        <h2 className='text-2xl text-white font-bold mb-4 text-center'>
          Verify Your Email
        </h2>

        <Formik
          initialValues={{ email: '' }}
          validationSchema={Yup.object({
            email: Yup.string()
              .email('Invalid email address')
              .required('Email is required')
          })}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form className='space-y-4'>
              <div>
                <Field
                  name='email'
                  type='email'
                  placeholder='Enter your email'
                  className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
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
              <div className='flex justify-center'>
                <button
                  type='submit'
                  className='bg-white text-black px-8 py-2 rounded font-medium hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer'
                >
                  {isSubmitting ? 'Verifying...' : 'Verify Email'}
                </button>
              </div>
              <p
                onClick={() => navigate('/login')}
                className='text-center text-green-400 cursor-pointer hover:underline'
              >
                Back to Sign in?
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  )
}
export default VerifyEmail
