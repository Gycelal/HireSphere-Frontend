import React from 'react'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

export const PublicRoutes = () => {
  const user = useSelector(state => state.auth.user)
  if (user) {
    if (user.role === 'candidate') return <Navigate to={'/candidate/home'} replace/>
    if (user.role === 'recruiter') return <Navigate to={'/recruiter/overview'} replace/>
    return <Navigate to={'/admin/dashboard'} replace />
  }
  return <Outlet/>
}


export default PublicRoutes