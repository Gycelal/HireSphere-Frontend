import { useDispatch, useSelector } from "react-redux"
import { toggleTheme } from "../../store/slices/themeSlice"



const ThemeToggle =()=> {
    const mode = useSelector((state)=> state.theme.mode)
    const dispatch = useDispatch()

  return (
    <button
      onClick={()=> dispatch(toggleTheme())}
      aria-label='Toggle dark mode'
      className='relative flex items-center justify-center w-9 h-9 rounded-md text-gray-500 dark:text-gray-400 hover:text-violet-600 dark:hover:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950 transition-all duration-200'
    >
      <span
        className='material-symbols-outlined text-[1.25rem] transition-transform duration-300'
        
      >
        {mode === "dark" ? 'light_mode' : 'dark_mode'}
      </span>
    </button>
  )
}

export default ThemeToggle