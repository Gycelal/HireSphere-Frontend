import SplitText from '../../components/ui/SplitText'
import Login from '../../components/authentication/Login'

const AdminAuth = () => {
  return (
    <div className='min-h-screen bg-gradient-to-b from-[#0f0c29] to-[#302b63] text-white flex flex-col relative overflow-hidden'>
      {/* Logo Section */}
      <div className='flex justify-center pt-16 pb-6'>
        <div className='flex items-center justify-center'>
          <img
            src='/icon.png'
            alt='HireSphere Icon'
            className='w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 object-contain drop-shadow-lg'
          />
        </div>
      </div>

      {/* Tagline Section */}
      <div className='flex justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-10 sm:py-12 md:py-16'>
        <div className='text-center max-w-4xl'>
          <SplitText
            text='Welcome to the system administration layer of Hiresphere.'
            className='text-white text-base sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold leading-snug sm:leading-snug md:leading-tight lg:leading-tight text-center'
            delay={100}
            duration={0.6}
            ease='power3.out'
            splitType='chars'
            from={{ opacity: 0, y: 40 }}
            to={{ opacity: 1, y: 0 }}
            threshold={0.1}
            rootMargin='-100px'
            textAlign='center'
          />
        </div>
      </div>

      <div className='flex-1 flex items-center justify-center px-4'>
        <div className='w-full max-w-md'>
          <Login isAdmin={true} />
        </div>
      </div>

      <footer className='py-8 text-center'>
        <div className='text-sm text-gray-500'>
          © 2025 Hiresphere. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

export default AdminAuth
