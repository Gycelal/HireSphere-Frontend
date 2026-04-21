import { Link } from "react-router-dom"
import NavItem from "./NavItem"
import { useSelector } from "react-redux";



export default function DesktopSidebar ({ navItems, bottomItems, collapsed, onToggle }) {
  const user = useSelector((state) => state.auth.user);
  const isRecruiterPending =
  user.role === "recruiter" && user.approval_status !== "approved";
  return (
    <aside
      style={{ width: collapsed ? 64 : 240 }}
      className='hidden md:flex flex-col shrink-0 h-screen sticky top-0 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 transition-all duration-300 ease-in-out overflow-visible'
    >
      {/* Logo */}
      <div
        className={`flex items-center h-16 shrink-0 border-b border-gray-100 dark:border-gray-800 ${
          collapsed ? 'justify-center' : 'px-4'
        }`}
      >
        <Link
          to='/dashboard'
          className='flex items-center gap-2.5 hover:opacity-80 transition-opacity select-none min-w-0'
        >
          <span className='relative flex items-center justify-center w-8 h-8'>
            <img src='/icon.png' alt='icon' className='w-8 h-8' />
          </span>
          {!collapsed && (
            <span className='text-[1.1rem] font-bold tracking-tight text-gray-900 dark:text-white truncate'>
              Hire<span className='text-violet-500'>Sphere</span>
            </span>
          )}
        </Link>
      </div>

      {/* Collapse / expand toggle */}
      <div
        className={`flex shrink-0 py-2 border-b border-gray-100 dark:border-gray-800 ${
          collapsed ? 'justify-center' : 'justify-end px-3'
        }`}
      >
        <button
          onClick={onToggle}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className='w-8 h-8 flex items-center justify-center rounded-lg
            text-gray-400 hover:text-violet-600 dark:hover:text-violet-400
            hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200'
        >
          <span className='material-symbols-outlined text-[1.1rem]'>
            {collapsed
              ? 'keyboard_double_arrow_right'
              : 'keyboard_double_arrow_left'}
          </span>
        </button>
      </div>

      {/* Main nav */}
      <nav className='flex-1 overflow-y-auto overflow-x-hidden py-3 flex flex-col gap-0.5'>
        {navItems.map(item => (
          <NavItem
            key={item.href}
            item={item}
            collapsed={collapsed}
            onNavigate={null}
            disabled={isRecruiterPending}
          />
        ))}
      </nav>

      {/* Bottom nav */}
      {bottomItems?.length > 0 && (
        <div className='py-3 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-0.5'>
          {bottomItems.map(item => (
            <NavItem
              key={item.href}
              item={item}
              collapsed={collapsed}
              onNavigate={null}
            />
          ))}
        </div>
      )}
    </aside>
  )
}