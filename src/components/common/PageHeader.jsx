import React from 'react'
import { ArrowLeft } from 'lucide-react'

const PageHeader = ({ title, itsDashboard = false }) => {
  return (
    <div className='flex items-center gap-3 sm:gap-4 md:gap-6 mb-2 sm:mb-4 dark:text-white'>
      {!itsDashboard && (
        <div>
          <ArrowLeft className='sm:w-6 sm:h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 hover:cursor-pointer' />
        </div>
      )}

      <h1 className='text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold'>{title}</h1>
    </div>
  )
}

export default PageHeader
