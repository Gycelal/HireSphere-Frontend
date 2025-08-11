import React from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/common/SideBar'
import { useState } from 'react'
import Navbar from '../components/common/Navbar'
import ThemeProvider from '../components/common/ThemeProvider'
import { useSelector } from 'react-redux'


 const CompanyAdminLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false)
      const user = useSelector(state => state.auth.user)
      const role = user.role
    
      const onToggleSidebar = () => {
        setIsCollapsed(!isCollapsed)
      }
    
  return (
    <ThemeProvider>
      <div className='flex h-screen bg-gray-100 dark:bg-gray-800'>
        <Sidebar
          isCollapsed={isCollapsed}
          role={role}
          onToggleSidebar={onToggleSidebar}
        />
        <div className='flex flex-col flex-1 border-l border-gray-200 dark:border-gray-800'>
          <Navbar />

          <main className='flex-1 overflow-auto bg-white dark:bg-gray-900 p-4'>
            <Outlet />
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}


export default CompanyAdminLayout