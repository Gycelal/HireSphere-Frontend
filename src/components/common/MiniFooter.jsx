import React from 'react'

export const MiniFooter = () => {
  return (
    <footer className="py-5 flex items-center justify-center border-t border-gray-100 dark:border-gray-800">
        <p className="text-xs text-gray-400 dark:text-gray-600 tracking-wide">
          © {new Date().getFullYear()} HireSphere. All rights reserved.
        </p>
      </footer>
  )
}

export default MiniFooter