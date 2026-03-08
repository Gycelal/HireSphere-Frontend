import React from 'react'
import { useSelector } from 'react-redux'

export const RecruiterDashboard = () => {
  const {user} = useSelector((state)=> state.auth.user)
  return (
    <div>RecruiterDashboard and his role is {user.role}</div>
    
  )
}


export default RecruiterDashboard
