import { Link } from "react-router-dom"
import { useLocation } from "react-router-dom"



export default function NavItem ({ item, collapsed, onNavigate }) {
  const { pathname } = useLocation()
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + '/')

  return (
    <Link
      to={item.href}
      onClick={onNavigate}
      className={[
        'group relative flex items-center rounded-xl text-sm font-medium',
        'transition-all duration-200 overflow-hidden',
        collapsed ? 'justify-center p-2.5 mx-1' : 'gap-3 px-3 py-2.5 mx-2',
        isActive
          ? 'bg-violet-50 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300'
          : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
      ].join(' ')}
    >
      {/* Active pill */}
      {isActive && !collapsed && (
        <span className='absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-violet-500 rounded-r-full' />
      )}

      {/* Icon — always visible */}
      <span
        className={`material-symbols-outlined shrink-0 text-[1.25rem] ${
          isActive ? 'text-violet-600 dark:text-violet-400' : ''
        }`}
      >
        {item.icon}
      </span>

      {/* Label — hidden when collapsed */}
      {!collapsed && <span className='truncate'>{item.label}</span>}

      {/* Tooltip — collapsed desktop only */}
      {collapsed && (
        <span
          className='
          pointer-events-none absolute left-full ml-3 z-50
          whitespace-nowrap rounded-lg bg-gray-900 dark:bg-gray-700
          px-2.5 py-1.5 text-xs font-medium text-white shadow-lg
          opacity-0 group-hover:opacity-100 transition-opacity duration-150
        '
        >
          {item.label}
        </span>
      )}
    </Link>
  )
}