import React from 'react'

export default function Field ({ id, label, icon, children }) {
  return (
    <div className='flex flex-col gap-1.5'>
      <label
        htmlFor={id}
        className='text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide'
      >
        {label}
      </label>
      <div className='relative'>
        <span className='material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[1.1rem] text-gray-400 dark:text-gray-500 pointer-events-none select-none'>
          {icon}
        </span>
        {children}
      </div>
    </div>
  )
}

export const inputClass =
  'w-full pl-9 pr-4 py-2.5 rounded-xl text-sm bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200'