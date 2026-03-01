import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
})





// Request interceptor
api.interceptors.request.use(
    (config)=>{
        const access = localStorage.getItem("access")
        if (access){
            config.headers.Autherization = `Bearer ${access}`;
        }
        return config
    },
    (error)=> Promise.reject(error)
)


// Response interceptor
api.interceptors.response.use(
    (response)=> response,
    async(error)=>{
        if(error.response.status === 401){
            try{
                const res = await axios.post(`${import.meta.VITE_API_BASE_URL}token/refresh/`,
                    {},
                    {withCredentials: true}
                );
                localStorage.setItem("access", res.data.access);
                error.config.headers.Autherization = `Bearer ${res.data.access}`
                return api(error.config)
            }catch(err){
                localStorage.removeItem("access")
                window.location.href = "auth/login"
            }
        }
        return Promise.reject(error)
    }
)