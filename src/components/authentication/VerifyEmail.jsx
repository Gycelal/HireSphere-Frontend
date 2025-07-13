import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const VerifyEmail = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false)

  const initialValues = {
    email: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
  });

  const handleSubmit = (values) => {
    console.log('Email submitted for verification:', values.email);
    setIsLoading(true)
    navigate('/verify-otp', { state: { email: values.email } });
  };

  const handleBack = () => {
    navigate(-1); // Go back to previous page
  };

  return (
  <div className="flex-1 flex items-center justify-center px-6 py-i">
    <div className="w-full max-w-md bg-white/5 backdrop-blur-sm p-6 rounded-xl border border-white/10 shadow-lg">
      {/* Back Button */}
      <h2 className="text-2xl text-white font-bold mb-4 text-center">
        Verify Your Email
      </h2>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ errors, touched }) => (
          <Form className="space-y-4">
            <div>
              <Field
                name="email"
                type="email"
                placeholder="Enter your email"
                className={`w-full px-4 py-3 bg-white/10 border rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.email && touched.email
                    ? 'border-red-500'
                    : 'border-white/20'
                }`}
              />
              <ErrorMessage
                name="email"
                component="div"
                className="text-red-400 text-xs mt-1"
              />
            </div>
            <div className="flex justify-center">
        <button
          type="submit"
          className="bg-white text-black px-8 py-2 rounded font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Verifying...':'Verify Email'}

        </button>
      </div>

            {/* <button
              type="submit"
              className="bg-white text-black px-8 py-2 rounded font-medium hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Send Verification Code
            </button> */}
            <p onClick={handleBack} className='text-center text-green-800 cursor-pointer hover:underline'>Back to Sign in?</p>
          </Form>
        )}
      </Formik>
    </div>
  </div>
);
}
export default VerifyEmail;
