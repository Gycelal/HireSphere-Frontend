import { useNavigate } from "react-router-dom"
import SplitText from "../ui/SplitText"

const LanderContent = () => {

const navigate = useNavigate()
const handleRegisterAsCandidate = ()=>{
  navigate('/register',{state:{initialRole:'candidate'}})
}
const handleRegisterAsCompany = ()=>{
  navigate('/register',{state:{initialRole:'company'}})
}

  return (
    <>
      {/* Main Content Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-4">
        {/* Animated Hello Text */}
        <div className="mb-4 sm:mb-6">
          <div className="text-white text-3xl sm:text-5xl lg:text-6xl font-bold text-center">
            <SplitText
              text="Hello, you!"
              className="text-inherit"
              delay={100}
              duration={0.6}
              ease="power3.out"
              splitType="chars"
              from={{ opacity: 0, y: 40 }}
              to={{ opacity: 1, y: 0 }}
              threshold={0.1}
              rootMargin="-100px"
              textAlign="center"
            />
          </div>
        </div>

        {/* Tagline */}
        <div className="max-w-4xl mx-auto mb-8 sm:mb-12">
          <p className="text-base sm:text-lg lg:text-xl text-gray-300/90 text-center leading-relaxed font-light tracking-wide px-4">
            Your all-in-one hiring ecosystem — personalized job search for candidates,
            <br className="hidden sm:block" />
            and a powerful, collaborative hiring suite for companies.
          </p>

          {/* Subtle accent line */}
          <div className="w-24 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4 rounded-full opacity-60" />
        </div>

        {/* Navigation Options */}
        <div className="w-full max-w-4xl px-4">
          <div className="flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-8">
            {/* Job Seeker Card */}
            <div className="group relative w-full max-w-xs">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

              <button
                onClick={handleRegisterAsCandidate}
                className="relative w-full p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl cursor-pointer"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1">Find Your Dream Job</h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                      Discover opportunities tailored to your skills
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center text-blue-400 group-hover:text-blue-300 transition-colors">
                    <span className="text-xs font-medium mr-1">Get Started</span>
                    <svg
                      className="w-3 h-3 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>

            {/* Divider */}
            <div className="hidden lg:block w-px h-24 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
            <div className="lg:hidden w-24 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Employer Card */}
            <div className="group relative w-full max-w-xs">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

              <button
                onClick={handleRegisterAsCompany}
                className="relative w-full p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl cursor-pointer"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  {/* Icon */}
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>
                  </div>

                  {/* Text */}
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white mb-1">Build Your Team</h3>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                      Connect with top talent and streamline hiring
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center text-purple-400 group-hover:text-purple-300 transition-colors">
                    <span className="text-xs font-medium mr-1">Get Started</span>
                    <svg
                      className="w-3 h-3 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LanderContent
