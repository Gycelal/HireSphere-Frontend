import { useSelector, useDispatch } from 'react-redux'
import { Bell, MoonStar, Sun } from 'lucide-react'
import { toggleTheme } from '../../features/theme/themeSlice'
import Button from '../ui/Button'
import { useNavigate } from 'react-router-dom'
const Navbar = () => {
  

  const theme = useSelector((state)=>state.theme.theme)
  const dispatch = useDispatch()

  const user = useSelector((state) => state.auth.user)
  const role = user.role  

  const navigate = useNavigate()


  const handleThemeToggle = ()=>{
    dispatch(toggleTheme())
    const html = document.documentElement
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    html.classList.toggle('dark',newTheme === 'dark')
  }
  return (
    <header
      className='w-full h-16 bg-white dark:bg-gray-900 
      shadow-[0_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_4px_rgba(255,255,255,0.05)] 
      flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10'
    >
      {/* Right Section */}
      <div className='ml-auto flex items-center gap-4'>
        {/* Notifications */}
        <button className='relative p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition'>
          <Bell className='w-5 h-5 text-gray-700 dark:text-gray-300' />
          <span className='absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full' />
        </button>

        {/* Theme Toggle */}
        <button
          onClick={handleThemeToggle}
          className='p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition'
          aria-label='Toggle Theme'
        >
          {theme === 'dark' ? (
            <Sun className='w-5 h-5 text-yellow-400' />
          ) : (
            <MoonStar className='w-5 h-5 text-gray-700 dark:text-gray-300' />
          )}
        </button>
        {role === 'company_admin' && (
        <Button variant='purple' onClick={() => navigate('/post-job')}>
          Post a Job
        </Button>
        )}
      </div>
    </header>
  )
}

export default Navbar
