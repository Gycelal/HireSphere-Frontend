export const getInitialValues = (authMode, role) => {
  const base = {
    email: '',
    password: '',
    role: role || '',
  };

  if (authMode === 'login') return base;

  if (role === 'candidate') {
    return {
      ...base,
      confirm_password: '',
      first_name: '',
      last_name: '',
    };
  }

  if (role === 'company') {
    return {
      ...base,
      confirm_password: '',
      company_name: '',
      registration_number: '',
    };
  }

  return base;
};
