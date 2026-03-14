import { useState } from 'react'
import { Link } from 'react-router-dom'
import ThemeToggle from '../common/ThemeToggle'
import { useSelector } from 'react-redux'
import Logo from '../common/Logo'



const NAV_CONFIG = {
  public: {
    links: ['About', 'Features']
  },
  candidate: {
    links: ['Find Jobs', 'Find Recruiters', 'About']
  }
}


// Nav Link
function NavLink ({ label, mobile = false }) {
  const base = mobile
    ? 'block w-full px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 text-gray-700 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-950 hover:text-violet-600 dark:hover:text-violet-400'
    : 'text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-400 transition-colors duration-200 relative group'

  return (
    <a href={`#${label.toLowerCase().replace(' ', '-')}`} className={base}>
      {label}
      {!mobile && (
        <span className='absolute -bottom-1 left-0 w-0 h-0.5 bg-violet-500 rounded-full transition-all duration-300 group-hover:w-full' />
      )}
    </a>
  )
}


// Notification Bell
function NotificationBell () {
  const [hasNew] = useState(true)
  return (
    <button
      aria-label='Notifications'
      className='relative flex items-center justify-center w-9 h-9 rounded-full text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950 transition-all duration-200'
    >
      <span className='material-symbols-outlined text-[1.25rem]'>
        notifications
      </span>
      {hasNew && (
        <span className='absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-violet-500 ring-2 ring-white dark:ring-gray-900' />
      )}
    </button>
  )
}

// Profile Avatar
function ProfileAvatar () {
  return (
    <Link to={"profile"}  aria-label='Go to profile dashboard'
      className='flex items-center justify-center w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/60 text-violet-600 dark:text-violet-300 font-bold text-xs ring-2 ring-transparent hover:ring-violet-400 dark:hover:ring-violet-500 transition-all duration-200'>
    AK
    </Link>
    
  )

}

// Public Actions
function PublicActions ({mobile = false }) {
  if (mobile) {
    return (
      <div className='flex flex-col gap-2 mt-2 px-1'>
        <Link
          to={"register"}
          className='flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold text-violet-600 dark:text-violet-400 border-2 border-violet-400 dark:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950 transition-all duration-200'
        >
          Login
        </Link>
        <Link
          to={"register"}
          className='flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 transition-all duration-200 shadow-md shadow-violet-200 dark:shadow-violet-900/40'
        >
          Get Started
        </Link>
      </div>
    )
  }
  return (
    <div className='flex items-center gap-2'>
      <Link
        to={"login/"}
        className='px-4 py-2 rounded-lg text-sm font-semibold text-violet-600 dark:text-violet-400 border-2 border-violet-400 dark:border-violet-500 hover:bg-violet-50 dark:hover:bg-violet-950 transition-all duration-200'
      >
        Login
      </Link>
      <Link
        to={"register/"}
        className='px-4 py-2 rounded-lg text-sm font-semibold text-white bg-violet-600 hover:bg-violet-700 active:bg-violet-800 transition-all duration-200 shadow-md shadow-violet-200 dark:shadow-violet-900/40'
      >
        Get Started
      </Link>
      <ThemeToggle />
    </div>
  )
}

// Candidate Actions
function CandidateActions () {
  return (
    <div className='flex items-center gap-1'>
      <NotificationBell />
      <ThemeToggle  />
      <div className='w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1' />
      <ProfileAvatar />
    </div>
  )
}


// Hamburger
function Hamburger ({ open, onToggle }) {
  return (
    <button
      onClick={onToggle}
      aria-label='Toggle menu'
      aria-expanded={open}
      className='flex items-center justify-center w-9 h-9 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-violet-50 dark:hover:bg-violet-950 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200'
    >
      <span className='material-symbols-outlined text-[1.5rem]'>
        {open ? 'close' : 'menu'}
      </span>
    </button>
  )
}

// Mobile Menu
function MobileMenu ({ open, userRole, dark, onToggle }) {
  const links = NAV_CONFIG[userRole]?.links ?? []

  return (
    <div
      className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
        open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}
    >
      <div className='pb-4 pt-1 space-y-0.5 border-t border-gray-100 dark:border-gray-800'>
        {links.map(link => (
          <NavLink key={link} label={link} mobile />
        ))}

        {userRole === 'candidate' && (
          <div className='flex items-center gap-2 px-4 py-3 mt-1'>
            <ThemeToggle />
            <span className='text-sm text-gray-500 dark:text-gray-400'>
              {dark ? 'Light mode' : 'Dark mode'}
            </span>
          </div>
        )}

        {userRole === 'public' && <PublicActions mobile />}
      </div>
    </div>
  )
}

// Main Navbar
export default function HireSphereNavbar () {
  const [menuOpen, setMenuOpen] = useState(false)
  
  const {user} = useSelector((state)=>state.auth)
  const role = user?.role

  
  const links = NAV_CONFIG[role]?.links ?? []


  return (
    <nav className='sticky top-0 z-50 w-full bg-white/90 dark:bg-gray-950/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 shadow-sm shadow-gray-100/60 dark:shadow-black/30 transition-colors duration-300'>
      {/* Full-width background above — centered inner content below */}
      <div className='max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-12'>
        <div className='flex items-center justify-between h-16'>
          {/* Left: Logo */}
          <Logo />

          {/* Center: Desktop Nav Links */}
          <div className='hidden md:flex items-center gap-8'>
            {links.map(link => (
              <NavLink key={link} label={link} />
            ))}
          </div>

          {/* Right: Actions */}
          <div className='hidden md:flex items-center gap-3'>
            {role === 'candidate' ? (
              <CandidateActions  />
            ): <PublicActions />}
          </div>

          {/* Mobile: Hamburger */}
          <div className='md:hidden'>
            <Hamburger open={menuOpen} onToggle={() => setMenuOpen(v => !v)} />
          </div>
        </div>
      </div>

      {/* Mobile Menu — same centered container */}
      <div className='max-w-7xl mx-auto w-full px-5 sm:px-8 lg:px-12'>
        <MobileMenu
          open={menuOpen}
          userRole={role}
        />
      </div>
    </nav>
  )
}
