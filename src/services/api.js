import axios from "axios";


export const publicApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
})

export const privateApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
})





// Request interceptor
privateApi.interceptors.request.use(
    (config)=>{
        const access = localStorage.getItem("access")
        if (access){
            config.headers.Authorization = `Bearer ${access}`;
        }
        return config
    },
    (error)=> Promise.reject(error)
)


// Response interceptor
privateApi.interceptors.response.use(
    (response)=> response,
    async(error)=>{
        if(error.response?.status === 401){
            try{
                const res = await publicApi.post("token/refresh/",
                    {},
                    {withCredentials: true}
                );
                localStorage.setItem("access", res.data.access);
                error.config.headers.Authorization = `Bearer ${res.data.access}`
                return api(error.config)
            }catch(err){
                localStorage.removeItem("access")
                window.location.href = "auth/login"
            }
        }
        return Promise.reject(error)
    }
)