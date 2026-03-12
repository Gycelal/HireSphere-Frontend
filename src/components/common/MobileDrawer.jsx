import NavItem from "./NavItem"
import Logo from "./Logo"



export default function MobileDrawer ({ navItems, bottomItems, open, onClose }) {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        aria-hidden='true'
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 40,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(2px)',
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 300ms ease'
        }}
      />

      {/* Drawer panel */}
      <aside
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          height: '100%',
          width: 280,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          background: 'white',
          borderRight: '1px solid #f3f4f6',
          transform: open ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 300ms ease'
        }}
        // className='dark:bg-gray-900 dark:border-gray-800'
        className='md:hidden dark:bg-gray-900 dark:border-gray-800'
      >
        {/* Header: logo + close */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            flexShrink: 0,
            borderBottom: '1px solid #f3f4f6'
          }}
          className='dark:border-gray-800'
        >
          <Logo />
          <button
            onClick={onClose}
            aria-label='Close menu'
            className='w-8 h-8 flex items-center justify-center rounded-lg
              text-gray-400 hover:text-gray-700 dark:hover:text-gray-200
              hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200'
          >
            <span className='material-symbols-outlined text-[1.2rem]'>
              close
            </span>
          </button>
        </div>

        {/* Nav — never collapsed on mobile */}
        <nav className='flex-1 overflow-y-auto overflow-x-hidden py-3 flex flex-col gap-0.5'>
          {navItems.map(item => (
            <NavItem
              key={item.href}
              item={item}
              collapsed={false}
              onNavigate={onClose}
            />
          ))}
        </nav>

        {bottomItems?.length > 0 && (
          <div className='py-3 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-0.5'>
            {bottomItems.map(item => (
              <NavItem
                key={item.href}
                item={item}
                collapsed={false}
                onNavigate={onClose}
              />
            ))}
          </div>
        )}
      </aside>
    </>
  )
}