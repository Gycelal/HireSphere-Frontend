import LandingPage  from './pages/LandingPage'
import {Routes, Route} from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import OtpVerificationPage from './pages/auth/OtpVerificationPage'
import VerifyEmailPage from './pages/auth/VerifyEmailPage'
import AdminLoginPage from './pages/auth/AdminLoginPage'

function App() {

  return (
    
    <Routes>
      {/* Route to Common Landing Page */}
      <Route path='/' element={<LandingPage />} />
      {/* Route To All Pages Related To Authentication */}
      <Route path='/auth/' element={<AuthLayout />}>
        <Route path='login' element={<LoginPage />} />
        <Route path='register' element={<RegisterPage />} />
        <Route path='verify-otp' element={<OtpVerificationPage />} />
        <Route path='verify-email' element={<VerifyEmailPage />} />
        <Route path='admin-login' element={<AdminLoginPage />} />
      </Route>

      
    </Routes>
  
  )
}

export default App
