import { useState, useEffect } from 'react'
import Logo from '../../components/common/Logo'
import ThemeToggle from '../../components/common/ThemeToggle'
import MiniFooter from '../../components/common/MiniFooter'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setUser, logout } from '../../store/slices/authSlice'
import { privateApi } from '../../services/api'
import toast from 'react-hot-toast'
import { navigateBasedOnRole } from '../../utils/navigations'
/**
 * RoleSelectionPage
 *
 * A complete self-contained page that reuses your existing Logo,
 * ThemeToggle, and Footer components. Adds a Logout button next
 * to ThemeToggle in the header.
 *
 * Props:
 *   onRoleSelect  (role: "candidate" | "recruiter") => void
 *   onLogout      () => void
 */
export default function RoleSelectionPage () {
  const [selected, setSelected] = useState(null)

  const user = useSelector(state => state.auth.user)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const roles = [
    {
      value: 'candidate',
      icon: 'person_search',
      title: 'I am a Candidate',
      description: 'Looking for jobs and opportunities'
    },
    {
      value: 'recruiter',
      icon: 'business_center',
      title: 'I am a Recruiter',
      description: 'Hiring and managing candidates'
    }
  ]

  useEffect(()=>{
    console.log("user after google auth:", user)
  })

  useEffect(() => {
    if (user?.role) {
      // already has role → redirect away
      if (user.role === 'candidate') navigate('/candidate/home')
      else if (user.role === 'recruiter') navigate('/recruiter/overview')
      else if (user.role === 'admin') navigate('/admin/dashboard')
    }
  }, [user])

  const onLogout = async () => {
    try {
      await privateApi.post('accounts/logout/')
    } catch (error) {
      console.log(
        'log out api failed but user already loged out',
        error.response?.data
      )
    } finally {
      dispatch(logout())
      navigate('/login')
      toast.success('Logged out successfully.')
    }
  }

  const onContinue = async()=>{
    try{
        const res = await privateApi.post("accounts/set-role/",{"role":selected})
        console.log("user after set role:", res)
        dispatch(setUser(res.data?.user))
    }catch(error){
      console.log("backend error:", error)
        toast.error("Something went wrong.")
    }
  }
  return (
    <div className='min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors duration-200'>
      {/* ── Header ── */}
      <header className='w-full px-6 py-4 flex items-center justify-between border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'>
        <Logo />

        <div className='flex items-center gap-3'>
          <ThemeToggle />

          <button
            onClick={onLogout}
            className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl
              text-sm font-semibold
              text-gray-500 dark:text-gray-400
              hover:bg-gray-100 dark:hover:bg-gray-800
              hover:text-gray-700 dark:hover:text-gray-200
              transition-colors duration-200'
          >
            <span className='material-symbols-outlined text-[1.1rem]'>
              logout
            </span>
            Logout
          </button>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className='flex-1 flex items-center justify-center px-4 py-12'>
        <div className='w-full max-w-md flex flex-col gap-6'>
          {/* Heading */}
          <div className='flex flex-col gap-1.5'>
            <h1 className='text-2xl font-bold tracking-tight text-gray-900 dark:text-white'>
              Choose your role
            </h1>
            <p className='text-sm text-gray-400 dark:text-gray-500 leading-relaxed'>
              This helps us personalise your experience on HireSphere.
            </p>
          </div>

          {/* Role cards */}
          <div className='flex flex-col gap-3'>
            {roles.map(role => {
              const isSelected = selected === role.value
              return (
                <button
                  key={role.value}
                  type='button'
                  onClick={() => setSelected(role.value)}
                  aria-pressed={isSelected}
                  className={`
                    group relative flex items-center gap-4 w-full text-left
                    px-5 py-4 rounded-xl border-2
                    transition-all duration-200
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500
                    focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950
                    ${
                      isSelected
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/40'
                        : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-violet-300 dark:hover:border-violet-700 hover:bg-violet-50/40 dark:hover:bg-violet-950/20'
                    }
                  `}
                >
                  {/* Icon */}
                  <div
                    className={`
                    w-12 h-12 rounded-xl flex items-center justify-center shrink-0
                    transition-colors duration-200
                    ${
                      isSelected
                        ? 'bg-violet-100 dark:bg-violet-900/60'
                        : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/40'
                    }
                  `}
                  >
                    <span
                      className={`material-symbols-outlined text-[1.4rem] transition-colors duration-200 ${
                        isSelected
                          ? 'text-violet-600 dark:text-violet-400'
                          : 'text-gray-500 dark:text-gray-400 group-hover:text-violet-600 dark:group-hover:text-violet-400'
                      }`}
                    >
                      {role.icon}
                    </span>
                  </div>

                  {/* Text */}
                  <div className='flex flex-col gap-0.5 min-w-0 flex-1'>
                    <span
                      className={`text-sm font-semibold transition-colors duration-200 ${
                        isSelected
                          ? 'text-violet-700 dark:text-violet-300'
                          : 'text-gray-900 dark:text-white'
                      }`}
                    >
                      {role.title}
                    </span>
                    <span className='text-xs text-gray-400 dark:text-gray-500 leading-relaxed'>
                      {role.description}
                    </span>
                  </div>

                  {/* Radio indicator */}
                  <div
                    className={`
                    shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center
                    transition-all duration-200
                    ${
                      isSelected
                        ? 'border-violet-500 bg-violet-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }
                  `}
                  >
                    {isSelected && (
                      <span
                        className='material-symbols-outlined text-white'
                        style={{
                          fontSize: '0.7rem',
                          fontVariationSettings:
                            "'FILL' 1,'wght' 700,'GRAD' 0,'opsz' 24"
                        }}
                      >
                        check
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Continue button */}
          <button
            type='button'
            disabled={!selected}
            onClick={onContinue}
            className='w-full flex items-center justify-center gap-2 py-2.5 rounded-xl
              text-sm font-bold text-white
              bg-violet-600 hover:bg-violet-700 active:bg-violet-800
              disabled:opacity-40 disabled:cursor-not-allowed
              transition-all duration-200
              shadow-md shadow-violet-200 dark:shadow-violet-900/30'
          >
            Continue
            <span className='material-symbols-outlined text-[1rem]'>
              arrow_forward
            </span>
          </button>
        </div>
      </main>

      {/* ── Footer ── */}
      <MiniFooter />
    </div>
  )
}
