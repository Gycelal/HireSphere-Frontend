import { useState, useEffect } from 'react'
import { resendOtp, verifyOtp } from '../../api/auth'
import { toast } from 'sonner'
import { LoaderCircle } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function VerifyOtp() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [timer, setTimer] = useState(60)
  const [canResendOtp, setCanResendOtp] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const email = location.state?.email || ''


  useEffect(()=>{
    if(!email){
      navigate('/register',{ state: { initialRole: 'candidate' } })
    }
  })

  // Countdown for resend OTP
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setCanResendOtp(true)
    }
  }, [timer])

  const handleInputChange = (index, value) => {
    if (!/^\d*$/.test(value)) return // allow only digits

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (otp.some(digit => !digit)) {
      toast.error('Please enter the complete OTP.')
      return
    }

    setIsLoading(true)

    try {
      const response = await verifyOtp({ email, otp: otp.join('') })
      toast.success(response.data.message || 'OTP verified successfully!')
      navigate('/login',{replace: true})
    } catch (error) {
      const errMsg =
        error.response?.data?.non_field_errors?.[0] ||
        error.response?.data?.message ||
        'OTP verification failed.'
      toast.error(errMsg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    try {
      setCanResendOtp(false)
      setTimer(60)
      await resendOtp({ email })
      toast.success('OTP resent successfully!')
      setOtp(['', '', '', '', '', ''])
    } catch (error) {
      const errMsg =
        error.response?.data?.non_field_errors?.[0] ||
        error.response?.data?.message ||
        'Failed to resend OTP.'
      toast.error(errMsg)
    }
  }

  return (
    <div className='flex flex-col items-center justify-center w-full px-4 py-8'>
      <div className='w-full max-w-md'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='text-center'>
            <h1 className='text-xl font-medium text-white mb-6'>
              Verify your OTP
            </h1>

            <div className='flex justify-center gap-3 mb-6'>
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type='text'
                  maxLength='1'
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className='w-12 h-12 text-center text-white text-lg bg-transparent border border-gray-600 rounded focus:outline-none focus:border-white transition-colors'
                  disabled={isLoading}
                />
              ))}
            </div>

            <p className='text-gray-400 text-sm mb-8'>
              Please enter the one-time password sent to your email.
            </p>
          </div>

          <div className='flex flex-col items-center space-y-3'>
            <button
              type='submit'
              disabled={isLoading || otp.some(digit => !digit)}
              className='bg-white text-black px-8 py-2 rounded font-medium hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer'
            >
              {isLoading ? (
                <LoaderCircle className='animate-spin' />
              ) : (
                'Verify OTP'
              )}
            </button>

            <p className='text-gray-400 text-sm'>
              Didn’t get the OTP?{' '}
              <button
                type='button'
                onClick={handleResend}
                disabled={!canResendOtp}
                className={`ml-1 font-medium ${
                  canResendOtp
                    ? 'text-white hover:underline cursor-pointer'
                    : 'text-gray-500 cursor-not-allowed'
                }`}
              >
                Resend OTP {canResendOtp ? '' : `(${timer}s)`}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  )
}
