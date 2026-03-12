import ThemeToggle from "./ThemeToggle"
import ProfileDropdown from "./ProfileDropdown"



export default function Topbar ({onMobileMenuOpen}) {
    
  return (
    <header
      className='
      sticky top-0 z-20 h-16 shrink-0
      flex items-center justify-between px-4 sm:px-6
      bg-white/90 dark:bg-gray-950/90 backdrop-blur-md
      border-b border-gray-100 dark:border-gray-800
    '
    >
      {/* hamburger for mobile */}
      <div className='flex items-center'>
        <button
          onClick={onMobileMenuOpen}
          aria-label='Open menu'
          className='md:hidden w-9 h-9 flex items-center justify-center rounded-xl
              text-gray-500 dark:text-gray-400
              hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
        >
          <span className='material-symbols-outlined text-[1.2rem]'>menu</span>
        </button>
      </div>

      {/* Right: actions */}
      <div className='flex items-center gap-1 sm:gap-1.5'>
        {/* Notifications */}
        <button
          aria-label='Notifications'
          className='relative w-9 h-9 flex items-center justify-center rounded-xl
            text-gray-500 dark:text-gray-400
            hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200'
        >
          <span className='material-symbols-outlined text-[1.2rem]'>
            notifications
          </span>
          {notificationCount > 0 && (
            <span
              className='absolute top-1.5 right-1.5 w-2 h-2 rounded-full
              bg-violet-500 ring-2 ring-white dark:ring-gray-950'
            />
          )}
        </button>
        <ThemeToggle />
        <div className='w-px h-6 bg-gray-100 dark:bg-gray-800 mx-1' />
        <ProfileDropdown />
      </div>
    </header>
  )
}