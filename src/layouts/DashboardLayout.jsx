import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { NAV } from '../config/navigations'
import Topbar from '../components/common/Topbar'
import DesktopSidebar from '../components/common/DesktopSidebar'
import MobileDrawer from '../components/common/MobileDrawer'



export default function DashboardLayout () {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const user = useSelector((state)=> state.auth.user)
  const navItems = NAV[user.role]["main"]
  const bottomItems = NAV[user.role]["bottom"]
  const notificationCount = null

  return (
    <div className='flex h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-200 overflow-hidden'>
      <DesktopSidebar
        navItems={navItems}
        bottomItems={bottomItems}
        collapsed={collapsed}
        onToggle={() => setCollapsed(v => !v)}
      />

      <MobileDrawer
        navItems={navItems}
        bottomItems={bottomItems}
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Right column — topbar + scrollable content */}
      <div className='flex flex-col flex-1 min-w-0 overflow-hidden'>
        <Topbar
          user={user}
          notificationCount={notificationCount}
          onMobileMenuOpen={() => setMobileOpen(true)}
        />
        {/* Main content Area */}
        <main className='flex-1 overflow-y-auto'>
          <div className='p-5 sm:p-6 lg:p-8 max-w-screen-2xl mx-auto'>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
