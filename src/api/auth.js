import axiosPublic from './axiosPublic'
import axiosPrivate from './axiosPrivate'


// Public

export const registerUser = data => {
  return axiosPublic.post('/api/accounts/register/', data)
}

export const googleAuth = data => {
  return axiosPublic.post('/api/accounts/google/', data)
}

export const verifyOtp = data => {
  return axiosPublic.post('/api/accounts/verify-otp/', data)
}

export const resendOtp = data => {
  return axiosPublic.post(`/api/accounts/resend-otp/`, data)
}

export const loginUser = data => {
  return axiosPublic.post('/api/accounts/login/', data)
}

export const forgotPassword = data => {
  return axiosPublic.post('/api/accounts/forgot-password/', data)
}

export const resetPassword = data => {
  return axiosPublic.post('/api/accounts/reset-password/', data)
}



// Private

export const completeProfile = data => {
  return axiosPrivate.post('/api/accounts/complete-profile/', data)
}