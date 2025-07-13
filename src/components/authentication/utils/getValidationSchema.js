import * as Yup from 'yup';

export const getValidationSchema = (authMode, role) => {
  const base = {
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string()
      .min(6, 'Min 6 characters')
      .required('Password is required'),
  };

  const confirmPassword = {
    confirm_password: Yup.string()
      .oneOf([Yup.ref('password')], 'Passwords must match')
      .required('Confirm your password'),
  };

  if (authMode === 'login') return Yup.object().shape(base);

  if (role === 'candidate') {
    return Yup.object().shape({
      ...base,
      ...confirmPassword,
      first_name: Yup.string().required('First name is required'),
      last_name: Yup.string().required('Last name is required'),
    });
  }

  if (role === 'company') {
    return Yup.object().shape({
      ...base,
      ...confirmPassword,
      company_name: Yup.string().required('Company name is required'),
      registration_number: Yup.string(), // optional
    });
  }

  return Yup.object().shape(base);
};
