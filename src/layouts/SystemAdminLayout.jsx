// import { Sidebar } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../components/common/SideBar'
import { useState } from 'react'
import Navbar from '../components/common/Navbar'
import ThemeProvider from '../components/common/ThemeProvider'
const SystemAdminLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  const onToggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  return (
    <ThemeProvider>
  <div className="flex h-screen bg-gray-100 dark:bg-gray-800">
    {/* Sidebar with border on right */}
    <Sidebar
      isCollapsed={isCollapsed}
      role="system_admin"
      onToggleSidebar={onToggleSidebar}
    />

    {/* Main Section */}
    <div className="flex flex-col flex-1 border-l border-gray-200 dark:border-gray-800">
      {/* Navbar with shadow */}
      <Navbar onToggleSidebar={onToggleSidebar} />

      {/* Main content with padding and muted background */}
      <main className="flex-1 overflow-auto bg-white dark:bg-gray-900 p-4">
        <Outlet />
      </main>
    </div>
  </div>
</ThemeProvider>

  )
}

export default SystemAdminLayout
