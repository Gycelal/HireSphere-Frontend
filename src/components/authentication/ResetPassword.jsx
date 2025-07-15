import { Formik,Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Resetting password for:', values)
    // Here you would typically call an API to reset the password
    setSubmitting(false)
    // Navigate to a success page or show a success message
  }
  return (
    <div className='flex-1 flex items-center justify-center px-6 py-10'>
  <div className='w-full max-w-md bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-lg'>
    <h2 className='text-2xl text-white font-bold mb-4 text-center'>
      Reset Your Password
    </h2>

    <Formik
      initialValues={{ newPassword: '', confirmPassword: '' }}
      validationSchema={Yup.object({
        newPassword: Yup.string()
          .min(8, 'Password must be at least 8 characters')
          .required('Required'),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
          .required('Required'),
      })}
      onSubmit={handleSubmit}
    >
      {({ errors, touched, isSubmitting }) => (
        <Form className='space-y-4'>
          <div>
            <Field
              type='password'
              name='newPassword'
              placeholder='New Password'
              className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.newPassword && touched.newPassword
                  ? 'border-red-500'
                  : 'border-white/20'
              }`}
            />
            <ErrorMessage
              name='newPassword'
              component='div'
              className='text-red-400 text-xs mt-1'
            />
          </div>

          <div>
            <Field
              type='password'
              name='confirmPassword'
              placeholder='Confirm Password'
              className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                errors.confirmPassword && touched.confirmPassword
                  ? 'border-red-500'
                  : 'border-white/20'
              }`}
            />
            <ErrorMessage
              name='confirmPassword'
              component='div'
              className='text-red-400 text-xs mt-1'
            />
          </div>

          <div className='flex justify-center'>
            <button
              type='submit'
              disabled={isSubmitting}
              className='bg-white text-black px-8 py-2 rounded font-medium hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
            >
              {isSubmitting ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword
