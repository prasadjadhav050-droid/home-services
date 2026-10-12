import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaEnvelope, FaLock, FaCheckCircle, FaExclamationTriangle, FaArrowLeft } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux'
import { selectAllUsers } from '../../features/users/userSlice'
import { toast } from '../../features/ui/uiSlice'

const ForgotPasswordPage = () => {
  const dispatch = useDispatch()
  const users = useSelector(selectAllUsers)
  const [email, setEmail] = useState('')
  const [state, setState] = useState('form') // form | sent | notfound

  const submit = (e) => {
    e.preventDefault()
    const user = users.find((u) => u.email?.toLowerCase() === email.toLowerCase())
    setState(user ? 'sent' : 'notfound')
    if (user) toast(dispatch, `Reset link sent to ${email} (demo mode — no real email is sent).`, 'info')
  }

  return (
    <div className="auth-wrap">
      <div className="auth-card w-100">
        <div className="text-center mb-4">
          <h3 className="fw-bold text-white mb-1">Forgot password?</h3>
          <p className="text-white-50 mb-0">We'll help you get back in</p>
        </div>
        <div className="card shadow-lg p-4" style={{ borderRadius: 18 }}>
          {state === 'form' && (
            <>
              <div className="alert alert-light small">In this frontend demo, password reset is simulated — no email is really sent.</div>
              <form onSubmit={submit}>
                <label className="form-label">Email address</label>
                <div className="input-group-icon mb-3">
                  <FaEnvelope />
                  <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                </div>
                <button type="submit" className="btn btn-brand w-100 py-2">Send reset link</button>
              </form>
            </>
          )}
          {state === 'sent' && (
            <div className="text-center py-3">
              <FaCheckCircle size={44} className="text-success mb-2" />
              <h6 className="fw-bold">Check your inbox</h6>
              <p className="text-muted small">If an account exists for <strong>{email}</strong>, a reset link has been sent.</p>
              <Link to="/login" className="btn btn-brand btn-pill px-4">Back to login</Link>
            </div>
          )}
          {state === 'notfound' && (
            <div className="text-center py-3">
              <FaExclamationTriangle size={44} className="text-danger mb-2" />
              <h6 className="fw-bold">No account found</h6>
              <p className="text-muted small">We couldn't find an account for <strong>{email}</strong>.</p>
              <Link to="/register" className="btn btn-brand px-4">Create account</Link>
            </div>
          )}
          <div className="text-center mt-3">
            <Link to="/login" className="small text-decoration-none"><FaArrowLeft className="me-1" /> Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPasswordPage