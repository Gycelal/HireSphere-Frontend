
import { Link } from 'react-router-dom'

const MyJobPosts = () => {
  return (
    <div className='flex flex-col gap-6'>
      {/* Page header */}
      <div className='flex items-center justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>My Job Posts</h1>
          <p className='text-sm text-gray-400 dark:text-gray-500 mt-0.5'>
            Manage and track all your job listings
          </p>
        </div>

        <Link
          to='/recruiter/post-job'
          className='inline-flex items-center gap-2 px-4 py-2 rounded-xl
            border border-violet-400 dark:border-violet-500
            text-violet-600 dark:text-violet-400
            text-sm font-medium
            hover:bg-violet-50 dark:hover:bg-violet-950/40
            transition-all duration-200 shrink-0'
        >
          <span className='material-symbols-outlined text-[1.1rem]'>add</span>
          Post a Job
        </Link>
      </div>

      {/* Placeholder content */}
      <div className='flex items-center justify-center h-64 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700'>
        <p className='text-gray-400 dark:text-gray-600 text-sm'>No job posts yet. Create your first one!</p>
      </div>
    </div>
  )
}

export default MyJobPosts