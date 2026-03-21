import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

 const PublicRoutes = () => {
  const auth = useSelector(state => state.auth)

  if (auth.isAuthenticated && auth.user) {
    if (auth.user.role === 'candidate')
      return <Navigate to="/candidate/home" replace />

    if (auth.user.role === 'recruiter')
      return <Navigate to="/recruiter/overview" replace />

    return <Navigate to="/admin/dashboard" replace />
  }

  return <Outlet />
}


export default PublicRoutes