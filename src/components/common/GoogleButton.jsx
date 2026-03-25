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
      dispatch(loginSuccess({user: res.data.user}))
      console.log("access:", res.data.access)
      navigate('select-role')
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
