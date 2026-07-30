import { GoogleLogin } from '@react-oauth/google'
import { publicApi } from '../../services/api'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../../store/slices/authSlice'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const GoogleButton = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSuccess = async credentialResponse => {
    try {
      const res = await publicApi.post('/accounts/google/', {
        id_token: credentialResponse.credential
      })
      const user = res.data.user
      dispatch(loginSuccess(res.data))

      // Check if user already has a role
      if (!user.role) {
        navigate('/select-role', { replace: true })
      } else if (user.role === "candidate") {
        navigate("/candidate/find-jobs", { replace: true })
      } else if (user.role === "recruiter") {
        if (user.approval_status !== "approved") {
          navigate("/recruiter/profile", { replace: true })
        } else {
          navigate("/recruiter/overview", { replace: true })
        }
      } else {
        // Fallback for admin or unknown roles
        navigate('/', { replace: true })
      }
    } catch (error) {
      console.error('Google login failed', error)
      toast.error("Google failed.")
    }
  }

  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log('Login Failed')}
    />
  )
}

export default GoogleButton
