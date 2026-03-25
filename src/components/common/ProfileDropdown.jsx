import { useDispatch, useSelector } from 'react-redux'
import { useRef, useState, useEffect } from 'react'
import { Link, replace, useNavigate } from 'react-router-dom'
import { privateApi } from '../../services/api'
import { logout } from '../../store/slices/authSlice'
import toast from 'react-hot-toast'

export default function ProfileDropdown () {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const { user } = useSelector(state => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    function handle (e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handle)
    return () => document.removeEventListener('mousedown', handle)
  }, [])

  const initials =
    user?.name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? 'U'

  const onLogout = async () => {
    const isAdmin = location.pathname.startsWith('/admin')

    setOpen(false)
    try {
      await privateApi.post('accounts/logout/')
    } catch (error) {
      // ignore error
      console.log(
        'log out api failed but user already loged out',
        error.response?.data
      )
    } finally {
       dispatch(logout())
    if (isAdmin) {
      navigate('/admin-lgoin', { replace: true })
    } else {
      navigate('/login', { replace: true })
    }
      toast.success('Loged out successfully.')
    }
  }

  return (
    <div ref={ref} className='relative'>
      <button
        onClick={() => setOpen(v => !v)}
        className='flex items-center gap-2 rounded-xl px-2 py-1.5
          hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200'
      >
        <div
          className='w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-950
          border border-violet-200 dark:border-violet-800
          flex items-center justify-center shrink-0'
        >
          <span className='text-xs font-bold text-violet-700 dark:text-violet-300'>
            {initials}
          </span>
        </div>
        <div className='hidden sm:flex flex-col items-start leading-none gap-0.5'>
          <span className='text-sm font-semibold text-gray-800 dark:text-white leading-none'>
            {user?.name ?? 'User'}
          </span>
          <span className='text-[0.7rem] text-gray-400 dark:text-gray-500 capitalize leading-none'>
            {user?.role ?? 'member'}
          </span>
        </div>
        <span
          className={`material-symbols-outlined text-[1rem] text-gray-400
          transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          expand_more
        </span>
      </button>

      {open && (
        <div
          className='absolute right-0 top-full mt-2 w-48
          bg-white dark:bg-gray-900
          border border-gray-100 dark:border-gray-800
          rounded-2xl shadow-xl shadow-gray-200/60 dark:shadow-black/30
          py-1.5 z-50'
        >
          <Link
            to='/dashboard/profile'
            onClick={() => setOpen(false)}
            className='flex items-center gap-2.5 px-4 py-2.5 text-sm
              text-gray-600 dark:text-gray-300
              hover:bg-gray-50 dark:hover:bg-gray-800
              hover:text-gray-900 dark:hover:text-white transition-colors'
          >
            <span className='material-symbols-outlined text-[1.1rem]'>
              person
            </span>
            Profile
          </Link>
          <Link
            to='/dashboard/settings'
            onClick={''}
            className='flex items-center gap-2.5 px-4 py-2.5 text-sm
              text-gray-600 dark:text-gray-300
              hover:bg-gray-50 dark:hover:bg-gray-800
              hover:text-gray-900 dark:hover:text-white transition-colors'
          >
            <span className='material-symbols-outlined text-[1.1rem]'>
              settings
            </span>
            Settings
          </Link>
          <div className='my-1 border-t border-gray-100 dark:border-gray-800' />
          <button
            onClick={onLogout}
            className='w-full flex items-center gap-2.5 px-4 py-2.5 text-sm
              text-red-500 dark:text-red-400
              hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors'
          >
            <span className='material-symbols-outlined text-[1.1rem]'>
              logout
            </span>
            Logout
          </button>
        </div>
      )}
    </div>
  )
}
