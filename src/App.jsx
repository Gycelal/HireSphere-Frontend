import { Routes, Route, useNavigate, replace } from 'react-router-dom'
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
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import DashboardLayout from './layouts/DashboardLayout'
import Profile from './components/common/Profile'
import AdminDashboard from './pages/admin/AdminDashboard'
import CandidateDashboard from './pages/candidate/CandidateDashboard'
import PublicRoutes from './routes/PublicRoutes'
import { Navigate } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from './store/store'
import AdminRecruiterApprovalsPage from './pages/admin/AdminRecruiterApprovals'

function App () {

  const mode = useSelector(state => state.theme.mode)
  
  useEffect(() => {
    document.documentElement.classList.toggle('dark', mode === 'dark')
  }, [mode])

  return (
    <>
      <Toaster position='top-right' />
      <PersistGate loading={null} persistor={persistor}>
        <Routes>
          <Route element={<PublicRoutes />}>
            {/* Route to Common Landing Page */}
            <Route element={<HomeLayout />}>
              <Route path='/' element={<LandingPageBody />} />
            </Route>

            {/* Route To All Pages Related To Authentication */}
            <Route element={<AuthLayout />}>
              <Route path='login' element={<LoginPage />} />
              <Route path='register' element={<RegisterPage />} />
              <Route path='verify-otp' element={<OtpVerificationPage />} />
              <Route path='verify-email' element={<VerifyEmailPage />} />
              <Route
                path='reset-password/:token'
                element={<ResetPasswordPage />}
              />
              <Route path='admin-login' element={<AdminLoginPage />} />
            </Route>
          </Route>

          {/* Candidate routes */}
          <Route element={<ProtectedRoutes allowedRole={'candidate'} />}>
            <Route path='candidate'>
              {/* Home layouts  */}
              <Route element={<HomeLayout />}>
                <Route path='home' element={<CandidateHome />} />
              </Route>
              {/* dashboard routes */}
              <Route element={<DashboardLayout />}>
                <Route path='overview' element={<CandidateDashboard />} />
                <Route path='profile' element={<Profile />} />
              </Route>
            </Route>
          </Route>

          {/* Recruiter Dashbaord layout rotues */}
          <Route element={<ProtectedRoutes allowedRole={'recruiter'} />}>
            {/* recruiter dashboard routes */}
            <Route path='recruiter'>
              <Route element={<DashboardLayout />}>
                <Route path='overview' element={<RecruiterDashboard />} />
              </Route>
            </Route>
          </Route>

          {/* Admin Dashboard routes */}
          <Route element={<ProtectedRoutes allowedRole={'admin'} />}>
            <Route path='admin' element={<DashboardLayout />}>
              <Route path='dashboard' element={<AdminDashboard />} />
              <Route
                path='recruiter-approvals'
                element={<AdminRecruiterApprovalsPage />}
              />
            </Route>
          </Route>
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </PersistGate>
    </>
  )
}

export default App
