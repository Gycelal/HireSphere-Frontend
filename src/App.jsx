import {Routes, Route} from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import OtpVerificationPage from './pages/auth/OtpVerificationPage'
import VerifyEmailPage from './pages/auth/VerifyEmailPage'
import AdminLoginPage from './pages/auth/AdminLoginPage'
import HomeLayout from './layouts/HomeLayout'
import CandidateHome from './pages/candidate/CandidateHome'
import LandingPageBody from './pages/LandingPage'
import ProtectedRoutes from './routes/ProtectedRoutes'
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard'
import { DashboardLayout } from './layouts/DashboardLayout'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Toaster } from "react-hot-toast"



function App() {
  const mode = useSelector((state) => state.theme.mode);

  useEffect(() => {
  document.documentElement.classList.toggle("dark", mode === "dark");
}, [mode]);

  return (
    <>
    <Toaster position='top-right'/>
      <Routes>
        {/* Route to Common Landing Page */}
        <Route element={<HomeLayout/>}>
          <Route path='/' element={<LandingPageBody />}/>
        </Route>
        {/* Route To All Pages Related To Authentication */}
        <Route path='auth' element={<AuthLayout />}>
          <Route path='login' element={<LoginPage />} />
          <Route path='register' element={<RegisterPage />} />
          <Route path='verify-otp' element={<OtpVerificationPage />} />
          <Route path='verify-email' element={<VerifyEmailPage />} />
          <Route path='admin-login' element={<AdminLoginPage />} />
        </Route>
        {/* Candidate Home layout routes */}
        <Route element={<ProtectedRoutes allowedRole={"candidate"}/>}>
          <Route path='candidate' element={<HomeLayout/>}>
            <Route path='home' element={<CandidateHome/>}/>
          </Route>
        </Route>

        {/* Candidate Dashbaord layout rotues */}
        <Route element={<ProtectedRoutes allowedRole={"candidate"}/>}></Route>

        {/* Admin Dashboard routes */}
        <Route element={<ProtectedRoutes allowedRole={"recruiter"}/>}>
          <Route path='recruiter' element={<DashboardLayout/>}>
            <Route path='dashboard' element={<RecruiterDashboard/>}/>
          </Route>
        </Route>



        
      </Routes>
    </>
  
  )
}

export default App
