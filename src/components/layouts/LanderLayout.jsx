import { Outlet } from "react-router-dom"
const LanderLayout = () => {


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-gray-900 to-slate-800 flex flex-col relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%)]" />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between p-6 sm:p-8 lg:p-10">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300" />
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 shadow-2xl">
              <img
                src="/icon.png"
                alt="HireSphere Icon"
                className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain"
              />
            </div>
          </div>

          {/* Brand Name */}
          <div className="flex flex-col">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent leading-none tracking-tight">
              HireSphere
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1 font-medium tracking-wide">
              Talent Meets Opportunity
            </p>
          </div>
        </div>

        {/* Decorative element */}
        <div className="hidden sm:block">
          <div className="w-20 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </header>

      {/* Main content area with vertical center */}
      <main className="relative z-10 flex-1 flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4 transition-all duration-500 ease-in-out">
          <Outlet/>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm font-medium">
              © 2025 HireSphere. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <span className="hover:text-gray-300 transition-colors cursor-pointer">
                Privacy
              </span>
              <span className="hover:text-gray-300 transition-colors cursor-pointer">
                Terms
              </span>
              <span className="hover:text-gray-300 transition-colors cursor-pointer">
                Support
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LanderLayout
