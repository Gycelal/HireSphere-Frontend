import axios from 'axios';


const baseURL = import.meta.env.VITE_API_BASE_URL;

export const registerUser = (data) =>{
    return axios.post(`${baseURL}/api/accounts/register/`,data)
}

export const verifyOtp = (data) =>{
    return axios.post(`${baseURL}/api/accounts/verify-otp/`,data)
}

export const resendOtp = (data) =>{
    return axios.post(`${baseURL}/api/accounts/resend-otp/`,data)
}


export const loginUser = (data) =>{
    return axios.post(`${baseURL}/api/accounts/login/`,data)
}

export const forgotPassword = (data) =>{
    return axios.post(`${baseURL}/api/accounts/forgot-password/`,data)
}

export const resetPassword = (data) =>{
    return axios.post(`${baseURL}/api/accounts/reset-password/`,data)
}
