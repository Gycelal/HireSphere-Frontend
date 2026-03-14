import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

export const ProtectedRoutes = ({allowedRole}) => {
    const user = useSelector((state)=> state.auth.user)
    if(!user){
        return <Navigate to={"login"} replace/>
    }

    if(allowedRole && user.role !== allowedRole){
        return <Navigate to={"candidate/home"} replace/>
    }
  return <Outlet/>
}


export default ProtectedRoutes