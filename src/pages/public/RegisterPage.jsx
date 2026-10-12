import { useEffect, useMemo, useState } from 'react'
import { useNavigate, Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import clsx from 'clsx'
import { registerUser, selectAuthLoading, selectAuthError, setError } from '../../features/auth/authSlice'
import { FaUser, FaBriefcase, FaBuilding } from 'react-icons/fa'
import { CATEGORIES } from '../../data/categories'
import { INDIA_CITIES } from '../../data/indianCities'
import { toast } from '../../features/ui/uiSlice'
import { icons } from '../../utils/iconMap'

const TABS = [
  { key: 'customer', label: 'Customer', icon: <FaUser /> },
  { key: 'professional', label: 'Professional', icon: <FaBriefcase /> },
  { key: 'agency', label: 'Agency', icon: <FaBuilding /> },
]

const SKILLS = ['Electrical Wiring', 'Plumbing', 'Cleaning', 'Carpentry', 'Painting', 'AC Repair', 'Appliance Repair', 'Home Maintenance']

const toggleIn = (arr, v) => (arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v])

const registerSchema = (role) =>
  z
    .object({
      name: z.string().trim().min(2, 'Must be at least 2 characters.'),
      email: z.string().trim().min(1, 'Email is required.').email('Enter a valid email address.'),
      phone: z.string().trim().optional(),
      location: z.string().trim().min(1, 'Select a city.'),
      password: z.string().min(6, 'Password must be at least 6 characters.'),
      confirm: z.string(),
      preferences: z.array(z.string()),
      skills: z.array(z.string()),
      servicesOffered: z.array(z.string()),
      experience: z.string().optional(),
      certifications: z.string().optional(),
      hourlyRate: z.string().optional(),
      companyName: z.string().optional(),
      registration: z.string().optional(),
      address: z.string().optional(),
      website: z.string().optional(),
      availability: z.string().default('available'),
    })
    .superRefine((data, ctx) => {
      if (data.password !== data.confirm) {
        ctx.addIssue({ code: 'custom', path: ['confirm'], message: 'Passwords do not match.' })
      }
      if (data.phone && !/^[+\d\s-]{10,15}$/.test(data.phone)) {
        ctx.addIssue({ code: 'custom', path: ['phone'], message: 'Enter a valid phone number.' })
      }
      if (role === 'professional') {
        if (!data.skills.length) {
          ctx.addIssue({ code: 'custom', path: ['skills'], message: 'Select at least one skill.' })
        }
        if (!String(data.hourlyRate).trim() || Number(data.hourlyRate) < 100) {
          ctx.addIssue({ code: 'custom', path: ['hourlyRate'], message: 'Set an hourly rate of at least ₹100.' })
        }
      }
      if (role === 'agency' && !data.servicesOffered.length) {
        ctx.addIssue({ code: 'custom', path: ['servicesOffered'], message: 'Select at least one service.' })
      }
    })

const RegisterPage = () => {
  const { role: roleParam } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const loading = useSelector(selectAuthLoading)
  const error = useSelector(selectAuthError)
  const [tab, setTab] = useState(roleParam && TABS.some((t) => t.key === roleParam) ? roleParam : 'customer')

  useEffect(() => () => dispatch(setError(null)), [dispatch])

  const resolver = useMemo(() => zodResolver(registerSchema(tab)), [tab])

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver,
    mode: 'onTouched',
    shouldUnregister: false,
    defaultValues: {
      name: '', email: '', phone: '', location: 'Delhi', password: '', confirm: '',
      preferences: [], skills: [], experience: '', certifications: '', availability: 'available', hourlyRate: '',
      companyName: '', registration: '', address: '', website: '', servicesOffered: [],
    },
  })

  const preferences = useWatch({ control, name: 'preferences' }) || []
  const skills = useWatch({ control, name: 'skills' }) || []
  const servicesOffered = useWatch({ control, name: 'servicesOffered' }) || []
  const availability = useWatch({ control, name: 'availability' }) || 'available'

  const onSubmit = async (data) => {
    const payload = {
      role: tab,
      name: data.name,
      email: data.email,
      phone: data.phone,
      location: data.location,
      password: data.password,
      preferences: data.preferences,
      skills: data.skills,
      experience: data.experience,
      certifications: data.certifications,
      availability: data.availability,
      hourlyRate: data.hourlyRate,
      companyName: data.companyName,
      registration: data.registration,
      address: data.address,
      website: data.website,
      servicesOffered: data.servicesOffered,
    }
    const res = await dispatch(registerUser(payload))
    if (res.meta.requestStatus === 'fulfilled') {
      toast(dispatch, `Welcome to ServiceSprint! Your ${tab} account is ready.`, 'success')
      navigate(`/${tab}/dashboard`, { replace: true })
    }
  }

  const inputClass = (name) => clsx('form-control', errors[name] && 'is-invalid')
  const chipClass = (active) => clsx('btn btn-sm rounded-pill border', active ? 'btn-primary' : 'btn-outline-secondary')

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="card shadow rounded-4 border-0 w-100" style={{ maxWidth: 640 }}>
        <div className="card-header bg-primary text-white text-center py-4 rounded-top-4 border-0">
          <h4 className="fw-bold mb-1">Join ServiceSprint</h4>
          <p className="text-white-50 small mb-0">Create your account — it takes less than a minute</p>
        </div>
        <div className="card-body p-4">
          <div className="row g-2 mb-4">
            {TABS.map((t) => (
              <div className="col" key={t.key}>
                <button
                  type="button"
                  className={clsx(
                    'btn w-100 py-2 fw-semibold small',
                    tab === t.key ? 'btn-primary' : 'btn-outline-secondary border',
                  )}
                  onClick={() => setTab(t.key)}
                >
                  <span className="me-1">{t.icon}</span> {t.label}
                </button>
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <input type="hidden" {...register('preferences')} />
            <input type="hidden" {...register('skills')} />
            <input type="hidden" {...register('servicesOffered')} />
            <input type="hidden" {...register('availability')} />

            {tab === 'customer' && (
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Full name <span className="text-danger">*</span></label>
                  <input className={inputClass('name')} placeholder="e.g. Priya Sharma" {...register('name')} />
                  {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Email <span className="text-danger">*</span></label>
                  <input className={inputClass('email')} placeholder="you@example.com" {...register('email')} />
                  {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Phone</label>
                  <input className={inputClass('phone')} placeholder="+91 98xxx xxxxx" {...register('phone')} />
                  {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                </div>
                <div className="col-12">
                  <label className="form-label">Location</label>
                  <select className={clsx('form-select', errors.location && 'is-invalid')} {...register('location')}>
                    {INDIA_CITIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Service preferences (optional)</label>
                  <div className="d-flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        className={chipClass(preferences.includes(c.name))}
                        onClick={() => setValue('preferences', toggleIn(preferences, c.name), { shouldValidate: true })}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'professional' && (
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">Full name <span className="text-danger">*</span></label>
                  <input className={inputClass('name')} placeholder="e.g. Arjun Mehta" {...register('name')} />
                  {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Email <span className="text-danger">*</span></label>
                  <input className={inputClass('email')} placeholder="you@example.com" {...register('email')} />
                  {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Phone</label>
                  <input className={inputClass('phone')} placeholder="+91 98xxx xxxxx" {...register('phone')} />
                  {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Experience (years)</label>
                  <input type="number" min="0" className={clsx('form-control', errors.experience && 'is-invalid')} placeholder="e.g. 5" {...register('experience')} />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Hourly rate (₹) <span className="text-danger">*</span></label>
                  <input type="number" min="100" className={inputClass('hourlyRate')} placeholder="e.g. 500" {...register('hourlyRate')} />
                  {errors.hourlyRate && <div className="invalid-feedback">{errors.hourlyRate.message}</div>}
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Certifications</label>
                  <input className={clsx('form-control', errors.certifications && 'is-invalid')} placeholder="Comma separated (optional)" {...register('certifications')} />
                </div>
                <div className="col-12">
                  <label className="form-label">Location</label>
                  <select className={clsx('form-select', errors.location && 'is-invalid')} {...register('location')}>
                    {INDIA_CITIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Skills <span className="text-danger">*</span></label>
                  <div className="d-flex flex-wrap gap-2">
                    {SKILLS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        className={chipClass(skills.includes(s))}
                        onClick={() => setValue('skills', toggleIn(skills, s), { shouldValidate: true })}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                  {errors.skills && <div className="text-danger small mt-1">{errors.skills.message}</div>}
                </div>
                <div className="col-12">
                  <label className="form-label">Availability</label>
                  <div className="d-flex gap-2">
                    {[['available', 'Available now'], ['away', 'Offline']].map(([v, l]) => (
                      <button
                        key={v}
                        type="button"
                        className={clsx('btn btn-sm rounded-pill border', availability === v ? 'btn-primary' : 'btn-outline-secondary')}
                        onClick={() => setValue('availability', v, { shouldValidate: true })}
                      >
                        {l}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === 'agency' && (
              <div className="row g-3">
                <div className="col-12">
                  <label className="form-label">Agency name <span className="text-danger">*</span></label>
                  <input className={inputClass('name')} placeholder="e.g. QuickFix Pros" {...register('name')} />
                  {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Company / legal name</label>
                  <input className={clsx('form-control', errors.companyName && 'is-invalid')} placeholder="e.g. QuickFix Pros Pvt Ltd" {...register('companyName')} />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Registration no.</label>
                  <input className={clsx('form-control', errors.registration && 'is-invalid')} placeholder="Optional" {...register('registration')} />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Email <span className="text-danger">*</span></label>
                  <input className={inputClass('email')} placeholder="agency@example.com" {...register('email')} />
                  {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Phone</label>
                  <input className={inputClass('phone')} placeholder="+91 98xxx xxxxx" {...register('phone')} />
                  {errors.phone && <div className="invalid-feedback">{errors.phone.message}</div>}
                </div>
                <div className="col-12">
                  <label className="form-label">Address</label>
                  <input className={clsx('form-control', errors.address && 'is-invalid')} placeholder="Registered office address (optional)" {...register('address')} />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Website</label>
                  <input className={clsx('form-control', errors.website && 'is-invalid')} placeholder="www.yourcompany.in (optional)" {...register('website')} />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Headquarters</label>
                  <select className={clsx('form-select', errors.location && 'is-invalid')} {...register('location')}>
                    {INDIA_CITIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="col-12">
                  <label className="form-label">Services offered <span className="text-danger">*</span></label>
                  <div className="d-flex flex-wrap gap-2">
                    {CATEGORIES.map((c) => {
                      const Icon = icons[c.icon]
                      return (
                        <button
                          key={c.id}
                          type="button"
                          className={clsx(chipClass(servicesOffered.includes(c.id)), 'd-inline-flex align-items-center gap-1')}
                          onClick={() => setValue('servicesOffered', toggleIn(servicesOffered, c.id), { shouldValidate: true })}
                        >
                          <Icon size={10} style={{ color: c.color }} /> {c.name}
                        </button>
                      )
                    })}
                  </div>
                  {errors.servicesOffered && <div className="text-danger small mt-1">{errors.servicesOffered.message}</div>}
                </div>
              </div>
            )}

            <hr className="my-4" />
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label">Password <span className="text-danger">*</span></label>
                <input type="password" className={inputClass('password')} placeholder="Min 6 characters" {...register('password')} />
                {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
              </div>
              <div className="col-12 col-md-6">
                <label className="form-label">Confirm password <span className="text-danger">*</span></label>
                <input type="password" className={inputClass('confirm')} placeholder="Repeat password" {...register('confirm')} />
                {errors.confirm && <div className="invalid-feedback">{errors.confirm.message}</div>}
              </div>
            </div>

            {error && <div className="alert alert-danger py-2 small mt-3">{error}</div>}

            <button type="submit" className="btn btn-primary w-100 py-2 mt-3" disabled={loading}>
              {loading ? 'Creating account…' : `Create ${tab} account`}
            </button>
          </form>

          <div className="text-center mt-3 small">
            Already have an account? <Link to="/login" className="fw-semibold text-decoration-none">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage