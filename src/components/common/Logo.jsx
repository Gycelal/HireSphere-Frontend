

export default function Logo () {
  return (
    <a
      href='/'
      className='flex items-center gap-2 group select-none'
      aria-label='HireSphere Home'
    >
      
      <span className='relative flex items-center justify-center w-8 h-8'>
        <img src='/icon.png' alt='icon' className='w-8 h-8' />
      </span>
      
      <span className='text-[1.2rem] font-bold tracking-tight text-gray-900 dark:text-white transition-colors'>
        Hire<span className='text-violet-500'>Sphere</span>
      </span>
    </a>
  )
}