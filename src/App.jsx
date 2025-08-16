import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import LanderContent from './components/authentication/LanderContent'
import VerifyEmail from './components/authentication/VerifyEmail'
import VerifyOtp from './components/authentication/VerifyOtp'
import Login from './components/authentication/Login'
import Register from './components/authentication/Register'
import ResetPassword from './components/authentication/ResetPassword'
import {Toaster} from 'sonner'
import Home from './pages/user/candidate/Home'
import AuthPage from './pages/user/UserAuth'
import AdminAuth from './pages/admin/AdminAuth'
import {CompleteProfile} from './components/authentication/CompleteProfile'
import SystemAdminLayout from './layouts/SystemAdminLayout'
import Dashboard from './pages/admin/Dashboard'
import AdminCompanyApprovals from './pages/admin/AdminCompanyApprovals'
import CompanyAdminLayout from './layouts/CompanyAdminLayout'
import CompanyDashboard from './pages/user/company/CompanyDashboard'
import PostJobFlow from './pages/user/company/PostJobFlow'

function App() {
  return (
    <Router>
      <Toaster position='top-center' richColors/>
      <Routes>
        {/* Routes that share AuthPage */}
        <Route element={<AuthPage/>}>
          <Route path='/' element={<LanderContent/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/verify-email' element={<VerifyEmail/>}/>
          <Route path='/verify-otp' element={<VerifyOtp/>}/>
          <Route path='/reset-password/:uid/:token' element={<ResetPassword/>}/>
          <Route path='/complete-profile' element={<CompleteProfile/>}/>
        </Route>

        {/* System admin login */}
        <Route path='/admin-login' element={<AdminAuth/>}/>

        {/* Routes that share admin layout */}
        <Route element={<SystemAdminLayout/>}>
          <Route path='/admin-dashboard' element={<Dashboard/>}/>
          <Route path='/approvals' element={<AdminCompanyApprovals/>}/>
        </Route>

        {/* Routes that share company admin layout */}
        <Route element={<CompanyAdminLayout/>}>
          <Route path='/company-dashboard' element={<CompanyDashboard/>}/>
          <Route path='/post-job' element={<PostJobFlow/>}/>
        </Route>


        <Route path='/home' element={<Home/>}/>
        
        
      </Routes>
    </Router>
  )
}

export default App