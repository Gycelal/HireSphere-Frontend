import axios from "axios";
import store from '../features/store';
import {logout,tokenRefreshed} from '../features/auth/authSlice';

const baseURL = import.meta.env.VITE_API_BASE_URL

const axiosPrivate = axios.create({
    baseURL:baseURL,
    headers:{
        'Content-Type': 'application/json'
    }

})

// Request Interceptor which inject access_token
axiosPrivate.interceptors.request.use(
    config =>{
        const token = store.getState().auth.token;
        if(token){
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => Promise.reject.error
)


// Response Interceptor - handle 401 and refresh token
axiosPrivate.interceptors.response.use(
    response => response,
    async error =>{
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry){
            originalRequest._retry = true;

            try{
                const refreshResponse = await axios.post(
                    `${baseURL}/api/accounts/token-refresh`,
                    {},
                    {withCredentials:true}
                );

                const newAccessToken = refreshResponse.data.access_token

                store.dispatch(tokenRefreshed(newAccessToken))

                originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`
                return axiosPrivate(originalRequest)

            }catch(refreshError){
                store.dispatch(logout())
                return Promise.reject(refreshError)
            }
        }
        return Promise.reject(error)
    }
)


export default axiosPrivate
