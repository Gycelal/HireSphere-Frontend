import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import LanderLayout from './components/layouts/LanderLayout'
import LanderContent from './components/authentication/LanderContent'
import VerifyEmail from './components/authentication/VerifyEmail'
import VerifyOtp from './components/authentication/VerifyOtp'
import Login from './components/authentication/Login'
import Register from './components/authentication/Register'
import {Toaster} from 'sonner'
function App() {
  return (
    <Router>
      <Toaster position='top-center' richColors/>
      <Routes>
        {/* Routes that share LanderLayout */}
        <Route element={<LanderLayout/>}>
          <Route path='/' element={<LanderContent/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/verify-email' element={<VerifyEmail/>}/>
          <Route path='/verify-otp' element={<VerifyOtp/>}/>
        </Route>
      </Routes>
    </Router>
  )
}

export default App