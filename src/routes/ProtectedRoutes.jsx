import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

export const ProtectedRoutes = ({allowedRole}) => {
    const user = useSelector((state)=> state.auth.user)
    if(!user){    
        if(window.location.pathname.startsWith("/admin")){
            return <Navigate to={"admin-login"} replace/>
        }
            return <Navigate to={"login"} replace/>
    }

    if (allowedRole && user.role !== allowedRole) {

    // If role not assigned
    if (!user.role) {
        return <Navigate to="/select-role" replace />
    }

    // Redirect based on role
    if (user.role === "candidate") {
        return <Navigate to="/candidate/home" replace />
    }

    if (user.role === "recruiter") {
        return <Navigate to="/recruiter/overview" replace />
    }

    if (user.role === "admin") {
        return <Navigate to="/admin/dashboard" replace />
    }

    return <Navigate to="/" replace />
}
  return <Outlet/>
}


export default ProtectedRoutes