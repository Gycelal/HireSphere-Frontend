import { Routes, Route } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import OtpVerificationPage from './pages/auth/OtpVerificationPage'
import VerifyEmailPage from './pages/auth/VerifyEmailPage'
import AdminLoginPage from './pages/auth/AdminLoginPage'
import HomeLayout from './layouts/HomeLayout'
import LandingPageBody from './pages/LandingPage'
import ProtectedRoutes from './routes/ProtectedRoutes'
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard'
import { useSelector } from 'react-redux'
import { useEffect } from 'react'
import { Toaster } from 'react-hot-toast'
import ResetPasswordPage from './pages/auth/ResetPasswordPage'
import DashboardLayout from './layouts/DashboardLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import CandidateDashboard from './pages/candidate/CandidateDashboard'
import PublicRoutes from './routes/PublicRoutes'
import { Navigate } from 'react-router-dom'
import { PersistGate } from 'redux-persist/integration/react'
import { persistor } from './store/store'
import AdminRecruiterApprovalsPage from './pages/admin/AdminRecruiterApprovals'
import RoleSelectionPage from './pages/common/RoleSelectionPage'
import RecruiterProfile from './pages/recruiter/RecruiterProfile'
import CandidateProfile from './pages/candidate/CandidateProfile'
import UserManagementPage from './pages/admin/UserManagementPage'
import AdminUserProfilePage from './pages/admin/AdminUserProfilePage'
import FindJobs from './pages/candidate/FindJobs'
import MyJobPosts from './pages/recruiter/MyJobPosts'
import PostJobPage from './pages/recruiter/PostJobPage'
import EditJobPage from './pages/recruiter/EditJobPage'
import RecruiterJobDetailsPage from './pages/recruiter/RecruiterJobDetailsPage'
import ApplicationsJobDetailsPage from './pages/candidate/ApplicationsJobDetailsPage'
import HomeJobDetailsPage from './pages/candidate/HomeJobDetailsPage'

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
            {/* route to common page */}
            <Route element={<HomeLayout />}>
              <Route path='/' element={<LandingPageBody />} />
              <Route path='find-jobs' element={<FindJobs />} />
            </Route>
            {/* Routes to all auth related pages */}
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

          {/* Role Selection */}
          <Route element={<ProtectedRoutes />}>
            <Route path='select-role' element={<RoleSelectionPage />} />
          </Route>

          {/* Candidate routes */}
          <Route element={<ProtectedRoutes allowedRole={'candidate'} />}>
            <Route path='candidate'>
              {/* Home layouts  */}
              <Route element={<HomeLayout />}>
                <Route path='find-jobs' element={<FindJobs />} />
                <Route path='jobs/:id' element={<HomeJobDetailsPage />} />
              </Route>
              {/* dashboard routes */}Then your behavior becomes:
              <Route element={<DashboardLayout />}>
                <Route path='overview' element={<CandidateDashboard />} />
                <Route path='profile' element={<CandidateProfile />} />
                <Route path='jobs/:id' element={<ApplicationsJobDetailsPage />} />
              </Route>
            </Route>
          </Route>
          {/* recruiter dashboard routes */}
          <Route element={<ProtectedRoutes allowedRole={'recruiter'} />}>
            <Route path='recruiter'>
              <Route element={<DashboardLayout />}>
                <Route path='overview' element={<RecruiterDashboard />} />
                <Route path='profile' element={<RecruiterProfile />} />
                <Route path='my-job-posts' element={<MyJobPosts/>}/>
                <Route path='jobs/:id' element={<RecruiterJobDetailsPage />} />
                <Route path='post-job' element={<PostJobPage />} />
                <Route path='edit-job/:id' element={<EditJobPage />} />
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
              <Route path='users' element={<UserManagementPage />} />
              <Route path='users/:role/:id' element={<AdminUserProfilePage />} />
            </Route>
          </Route>
          <Route path='*' element={<Navigate to='/' replace />} />
        </Routes>
      </PersistGate>
    </>
  )
}

export default App
