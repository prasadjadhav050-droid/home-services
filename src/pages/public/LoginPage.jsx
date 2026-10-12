import { useEffect, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import clsx from 'clsx'
import { FaUser, FaBriefcase, FaBuilding, FaShieldAlt, FaLock, FaEnvelope, FaMapMarkerAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import { login, loginDemo, selectAuthLoading, selectAuthError, setError } from '../../features/auth/authSlice'
import { demoAccounts } from '../../data/seed'
import { INDIA_CITIES } from '../../data/indianCities'

const ROLES = [
  { key: 'customer', label: 'Customer', icon: <FaUser />, desc: 'Book home services' },
  { key: 'professional', label: 'Professional', icon: <FaBriefcase />, desc: 'Get booked & earn' },
  { key: 'agency', label: 'Agency', icon: <FaBuilding />, desc: 'Manage your team' },
  { key: 'admin', label: 'Admin', icon: <FaShieldAlt />, desc: 'Platform control center' },
]

const loginSchema = z.object({
  email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  city: z.string().min(1, 'Select your city.'),
})

const customerDemo = demoAccounts.find((d) => d.role === 'customer')

const LoginPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const loading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onTouched',
    defaultValues: { email: customerDemo?.email || '', password: customerDemo?.password || '', city: 'Delhi' },
  })

  const [role, setRole] = useState('customer')

  const from = location.state?.from || `/${role}/dashboard`

  useEffect(() => () => dispatch(setError(null)), [dispatch])

  const selectRole = (key) => {
    setRole(key)
    const demo = demoAccounts.find((d) => d.role === key)
    if (demo) {
      setValue('email', demo.email)
      setValue('password', demo.password)
    }
  }

  const onSubmit = async (data) => {
    const res = await dispatch(login(data))
    if (res.meta.requestStatus === 'fulfilled') {
      navigate(from, { replace: true })
    }
  }

  const submitDemo = async () => {
    const res = await dispatch(loginDemo(role))
    if (res.meta.requestStatus === 'fulfilled') navigate(`/${role}/dashboard`, { replace: true })
  }

  const active = ROLES.find((r) => r.key === role)
  const demo = demoAccounts.find((d) => d.role === role)

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="card shadow rounded-4 border-0 w-100" style={{ maxWidth: 460 }}>
        <div className="card-header bg-primary text-white text-center py-4 rounded-top-4 border-0">
          <h4 className="fw-bold mb-1">Welcome back</h4>
          <p className="text-white-50 small mb-0">Sign in to your ServiceSprint {active?.label} account</p>
        </div>
        <div className="card-body p-4">
          <label className="form-label small fw-semibold">I am a…</label>
          <div className="row g-2 mb-4">
            {ROLES.map((r) => (
              <div className="col-6" key={r.key}>
                <button
                  type="button"
                  className={clsx(
                    'btn w-100 d-flex flex-column align-items-center gap-1 py-3',
                    role === r.key ? 'btn-primary' : 'btn-outline-secondary border',
                  )}
                  onClick={() => selectRole(r.key)}
                >
                  <span className="fs-5">{r.icon}</span>
                  <span className="fw-semibold small">{r.label}</span>
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="mb-3">
              <label className="form-label">City</label>
              <div className="input-group">
                <span className="input-group-text"><FaMapMarkerAlt /></span>
                <select
                  className={clsx('form-select', errors.city && 'is-invalid')}
                  {...register('city')}
                >
                  {INDIA_CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                {errors.city && <div className="invalid-feedback">{errors.city.message}</div>}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Email address</label>
              <div className="input-group">
                <span className="input-group-text"><FaEnvelope /></span>
                <input
                  type="email"
                  className={clsx('form-control', errors.email && 'is-invalid')}
                  placeholder="you@example.com"
                  {...register('email')}
                />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Password</label>
              <div className="input-group">
                <span className="input-group-text"><FaLock /></span>
                <input
                  type="password"
                  className={clsx('form-control', errors.password && 'is-invalid')}
                  placeholder="Min 6 characters"
                  {...register('password')}
                />
                {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
              </div>
            </div>

            {error && (
              <div className="alert alert-danger py-2 small d-flex align-items-center gap-2">
                <FaExclamationTriangle /> {error}
              </div>
            )}

            <button type="submit" className="btn btn-primary w-100 py-2" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <div className="text-center mt-3 small">
            <Link to="/forgot-password" className="text-decoration-none">Forgot password?</Link>
          </div>

          <hr className="my-4" />
          <div className="text-center small text-muted mb-2">Demo one-click access</div>
          <button type="button" className="btn btn-outline-primary w-100" disabled={loading} onClick={submitDemo}>
            <FaCheckCircle className="me-1" /> Login as {active?.label} ({demo?.email})
          </button>

          <div className="text-center mt-3 small">
            New here? <Link to="/register" className="fw-semibold text-decoration-none">Create an account</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage