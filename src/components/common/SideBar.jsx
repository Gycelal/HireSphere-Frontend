import React from 'react'
import { sidebarMenuConfig } from '../../constants/sidebarMenuConfig'
import { PanelLeftClose } from 'lucide-react'
import { toast } from 'sonner'

// Sidebar Header Component
import { PanelLeftOpen } from 'lucide-react'

const SidebarHeader = ({ isCollapsed, isHovered, onToggleSidebar }) => {
  return (
    <div className='p-4 pb-2 border-b border-gray-300 dark:border-gray-700'>
      <div className='flex items-center justify-between'>
        {/* Logo box / Icon Toggle */}
        <div className='flex-shrink-0 w-10 h-10 rounded-md flex items-center justify-center cursor-pointer'>
          {isCollapsed && isHovered ? (
            <PanelLeftOpen
              className='text-gray-800 dark:text-gray-200 w-6 h-6'
              onClick={onToggleSidebar}
            />
          ) : (
            <img
              src='/icon.png'
              alt='HireSphere Icon'
              className='w-10 h-10 object-contain'
            />
          )}
        </div>

        {/* Titles + Collapse Icon */}
        {!isCollapsed && (
          <div className='flex items-center justify-between flex-1 ml-4'>
            <div>
              <h1 className='text-gray-900 dark:text-white font-semibold text-base leading-tight'>
                HireSphere
              </h1>
              <p className='text-gray-600 dark:text-gray-300 text-xs'>
                Admin Panel
              </p>
            </div>
            <button
              className='p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition'
              aria-label='Collapse Sidebar'
              onClick={onToggleSidebar}
            >
              <PanelLeftClose className='text-gray-800 dark:text-gray-200 w-6 h-6' />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

// Section Label Component
const SectionLabel = ({ label, isCollapsed }) => {
  if (isCollapsed) return null

  return (
    <div className='px-4 py-2'>
      <span className='text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider'>
        {label}
      </span>
    </div>
  )
}

// Menu Item Component
const MenuItem = ({
  icon,
  label,
  path,
  isCollapsed,
  hasSubmenu = false,
  isActive = false
}) => {
  const Icon = icon
  const navigate = useNavigate()

  const handleClick = ()=>{
    if(path) navigate(path)
  }

  return (
    <div
    onClick={handleClick}
      className={`
        mx-3 mb-1 flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors duration-150
        ${
          isActive
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
        }
      `}
    >
      <span className='text-base flex-shrink-0'>
        {Icon && <Icon className='w-5 h-5 text-gray-700 dark:text-gray-300' />}
      </span>
      {!isCollapsed && (
        <>
          <span className='text-sm font-medium flex-1'>{label}</span>
          {hasSubmenu && (
            <svg
              className='w-4 h-4 text-gray-400'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          )}
        </>
      )}
    </div>
  )
}

// Sidebar Menu Component
const SidebarMenu = ({ isCollapsed, menuItems }) => (

  <nav className='flex-1 py-2'>
    {menuItems.map((item, idx) => (
      <React.Fragment key={idx}>
        <MenuItem
          icon={item.icon}
          label={item.label}
          path={item.path}
          isCollapsed={isCollapsed}
          hasSubmenu={!!item.children}
        />
        {item.children && !isCollapsed && (
          <div className='ml-8'>
            {item.children.map((child, i) => (
              <MenuItem
                key={i}
                icon={child.icon}
                path={child.path}
                label={child.label}
                isCollapsed={isCollapsed}
              />
            ))}
          </div>
        )}
      </React.Fragment>
    ))}
  </nav>
)

// User profile section
import { LogOut } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../features/auth/authSlice'
import { useSelector } from 'react-redux'

const UserProfileDropdown = ({ isCollapsed }) => {
  const user = useSelector(state => state.auth.user)
  const role = user.role
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const initials = user?.name?.[0]?.toUpperCase() || 'A'

  const handleLogout = () => {
    const logoutUser = async () => {
      try {
        if (role === 'admin') {
          await dispatch(adminLogoutThunk()).unwrap()
        } else {
          await dispatch(userLogoutthunk()).unwrap()
        }
        dispatch(logout())
        toast.success('Loged out successfully.')
        navigate(role === 'admin' ? '/admin-login' : '/login')
      } catch (err) {
        toast.error('Logout failed.')
      }
    }
    logoutUser()
  }

  if (isCollapsed) {
    return (
      <div className='p-3'>
        <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold cursor-pointer'>
          {initials}
        </div>
      </div>
    )
  }

  return (
    <div className='p-3'>
      <div className='flex items-center justify-between p-2 rounded-lg hover:bg-gray-300 transition-colors duration-150'>
        <div className='flex items-center gap-3 overflow-hidden'>
          <div className='w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0'>
            {initials}
          </div>
          <div className='flex flex-col overflow-hidden'>
            <p className='text-gray-800 dark:text-gray-100 font-medium text-sm truncate'>
              {user.first_name || user.last_name
                ? `${user.first_name || ''} ${user.last_name || ''}`.trim()
                : 'Admin'}
            </p>
            <p className='text-gray-800 dark:text-gray-500 text-xs truncate'>
              {user.email}
            </p>
          </div>
        </div>
        <LogOut
          onClick={handleLogout}
          className='w-6 h-6 text-red-600 hover:text-red-800 cursor-pointer'
        />
      </div>
    </div>
  )
}

// Main Sidebar Component
import { useState } from 'react'
import {
  adminLogoutThunk,
  userLogoutthunk
} from '../../features/auth/authThunks'

export const Sidebar = ({ isCollapsed = false, role, onToggleSidebar }) => {
  const menuItems = sidebarMenuConfig[role] || []
  const [isHovered, setIsHovered] = useState(false)

  return (
    <aside
      className={`
        bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-700
        ${isCollapsed ? 'w-16' : 'w-64 sm:w-65 md:w-70 lg:w-75'}
        min-h-screen transition-all duration-300
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='flex flex-col h-full'>
        <SidebarHeader
          isCollapsed={isCollapsed}
          isHovered={isHovered}
          onToggleSidebar={onToggleSidebar}
        />
        <SidebarMenu isCollapsed={isCollapsed} menuItems={menuItems} />
        <div className='border-t border-gray-800'>
          <UserProfileDropdown isCollapsed={isCollapsed} />
        </div>
      </div>
    </aside>
  )
}
