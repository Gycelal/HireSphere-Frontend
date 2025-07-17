import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import LanderContent from './components/authentication/LanderContent'
import VerifyEmail from './components/authentication/VerifyEmail'
import VerifyOtp from './components/authentication/VerifyOtp'
import Login from './components/authentication/Login'
import Register from './components/authentication/Register'
import ResetPassword from './components/authentication/ResetPassword'
import {Toaster} from 'sonner'
import Home from './pages/user/Home'
import AuthPage from './pages/user/UserAuth'
import AdminAuth from './pages/admin/AdminAuth'

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
        </Route>
        <Route path='/home' element={<Home/>}/>
        <Route path='/admin-login' element={<AdminAuth/>}/>
      </Routes>
    </Router>
  )
}

export default App