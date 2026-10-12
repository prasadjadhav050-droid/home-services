import { useEffect, useMemo, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  FaSearch, FaCheck, FaChevronLeft, FaChevronRight, FaMapMarkerAlt, FaClock, FaCalendarAlt,
  FaUserTie, FaBuilding, FaShieldAlt, FaMoneyBillWave, FaSpinner, FaPrint, FaCheckCircle, FaInfoCircle,
} from 'react-icons/fa'
import { selectServices, selectServiceById } from '../features/services/serviceSlice'
import { selectProfessionals, selectProfessionalById } from '../features/professionals/professionalSlice'
import { selectAgencies, selectAgencyById } from '../features/agencies/agencySlice'
import { addBooking } from '../features/bookings/bookingSlice'
import { addPayment } from '../features/payments/paymentSlice'
import { addNotification } from '../features/notifications/notificationSlice'
import { toast } from '../features/ui/uiSlice'
import { PAYMENT_METHODS, CATEGORIES } from '../data/categories'
import { INDIA_CITIES } from '../data/indianCities'
import { formatMoney, formatDate } from '../utils/format'
import { generateBookingId, uid } from '../utils/storage'
import Avatar from '../components/common/Avatar'
import RatingStars from '../components/common/RatingStars'
import { icons } from '../utils/iconMap'

const STEPS = ['Service', 'Professional', 'Schedule', 'Location', 'Details', 'Payment']

const StepHeader = ({ current }) => (
  <div className="stepper">
    {STEPS.map((s, i) => (
      <div key={s} className={`step ${i < current ? 'done' : ''} ${i === current ? 'active' : ''}`}>
        <div className="dot">{i < current ? <FaCheck size={14} /> : i + 1}</div>
        <div className="label">{s}</div>
      </div>
    ))}
  </div>
)

const BookingFlowPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const user = useSelector((s) => s.auth.currentUser)

  const services = useSelector(selectServices)
  const professionals = useSelector(selectProfessionals)
  const agencies = useSelector(selectAgencies)

  const [step, setStep] = useState(params.get('service') ? 0 : 0)
  const [serviceId, setServiceId] = useState(params.get('service') || '')
  const [providerId, setProviderId] = useState('')
  const [date, setDate] = useState('Today')
  const [time, setTime] = useState('10:00 AM')
  const [city, setCity] = useState(user?.location || 'Delhi')
  const [address, setAddress] = useState('')
  const [issue, setIssue] = useState('')
  const [preferred, setPreferred] = useState('Morning')
  const [urgent, setUrgent] = useState(false)
  const [payMethod, setPayMethod] = useState('wallet')
  const [searchQ, setSearchQ] = useState('')

  const [processing, setProcessing] = useState(false)
  const [placed, setPlaced] = useState(null)

  const service = useSelector((s) => selectServiceById(s, serviceId))
  const availableProviders = useMemo(() => {
    if (!service) return []
    return service.providerType === 'agency'
      ? agencies.filter((a) => a.id === service.providerId)
      : professionals.filter((p) => p.id === service.providerId)
  }, [service, agencies, professionals])

  const provider = service
    ? (service.providerType === 'agency'
        ? agencies.find((a) => a.id === service.providerId)
        : professionals.find((p) => p.id === service.providerId))
    : null

  const price = service ? (urgent ? service.emergency || service.price : service.price) : 0

  useEffect(() => {
    if (service && service.providerType === 'professional' && !providerId) setProviderId(service.providerId)
  }, [service, providerId])

  const pickService = (id) => {
    setServiceId(id)
    const svc = services.find((s) => s.id === id)
    if (svc?.providerType === 'professional') setProviderId(svc.providerId)
    else setProviderId('')
    setStep(1)
  }

  const futureISO = (n) => {
    const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString()
  }

  const slotList = ['07:00 AM', '09:00 AM', '10:00 AM', '12:00 PM', '02:00 PM', '04:00 PM', '06:00 PM', '08:00 PM']
  const dayOptions = [
    { label: 'Today', days: 0 }, { label: 'Tomorrow', days: 1 }, { label: 'Day after', days: 2 },
  ]
  for (let i = 3; i <= 13; i += 1) dayOptions.push({ label: formatDate(futureISO(i)), days: i })

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length))
  const back = () => setStep((s) => Math.max(s - 1, 0))

  const confirm = () => {
    setProcessing(true)
    setTimeout(async () => {
      const bookingId = generateBookingId()
      const b = {
        id: uid('bk'),
        bookingId,
        customerId: user.id,
        serviceId: service.id,
        providerType: service.providerType,
        providerId: service.providerId,
        professionalId: service.providerType === 'professional' ? service.providerId : undefined,
        agencyId: service.providerType === 'agency' ? service.providerId : undefined,
        category: service.category,
        location: { city, address, lat: 28.62, lng: 77.21 },
        issueDescription: issue,
        preferredTime: preferred,
        urgent,
        price,
        paymentMethod: payMethod,
        paymentStatus: payMethod === 'pay_later' || payMethod === 'on_completion' ? 'pending' : 'paid',
        status: 'pending',
        date: futureISO(0).slice(0, 10),
        time,
        paymentSimulated: true,
      }
      dispatch(addBooking(b))
      dispatch(addPayment({
        bookingId,
        userId: user.id,
        userRole: 'customer',
        type: 'payment',
        amount: price,
        commission: Math.round(price * 0.2),
        status: b.paymentStatus,
        method: payMethod,
      }))
      dispatch(addNotification({
        userId: user.id,
        type: 'booking',
        title: 'Booking Confirmed',
        message: `Your booking ${bookingId} for ${service.name} is confirmed.`,
      }))
      dispatch(addNotification({
        userId: provider?.id || service.providerId,
        type: 'request',
        title: 'New Booking Request',
        message: `${user.name} requested ${service.name} (${bookingId}).`,
      }))
      toast(dispatch, `Booking ${bookingId} confirmed 🎉`, 'success', 'Booking Confirmed')
      setPlaced(b)
      setProcessing(false)
    }, 1800)
  }

  const filteredServices = services.filter((s) => {
    const q = searchQ.toLowerCase()
    return !q || s.name.toLowerCase().includes(q) || s.description?.toLowerCase().includes(q)
  })

  const cat = service ? CATEGORIES.find((c) => c.id === service.category) : null
  const ServiceIcon = service ? icons[service.img] || icons.FaTools : null

  /* ---------- SUCCESS SCREEN ---------- */
  if (placed) {
    return (
      <div className="auth-wrap">
        <div className="card shadow p-4 p-md-5 text-center" style={{ maxWidth: 560, borderRadius: 22 }}>
          <div className="mx-auto mb-3" style={{ width: 84, height: 84, borderRadius: '50%', background: '#e7f8ef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FaCheckCircle size={44} className="text-success" />
          </div>
          <h3 className="fw-bold mb-1">Booking Confirmed</h3>
          <p className="text-muted mb-4">Your service has been booked successfully.</p>

          <div className="border rounded-3 p-3 mb-3 text-start" style={{ background: '#f8fafc' }}>
            <div className="d-flex justify-content-between small mb-1">
              <span className="text-muted">Booking ID</span>
              <strong>{placed.bookingId}</strong>
            </div>
            <div className="d-flex justify-content-between small mb-1">
              <span className="text-muted">Service</span>
              <strong>{service?.name}</strong>
            </div>
            <div className="d-flex justify-content-between small mb-1">
              <span className="text-muted">Provider</span>
              <strong>{provider?.name}</strong>
            </div>
            <div className="d-flex justify-content-between small mb-1">
              <span className="text-muted">Schedule</span>
              <strong>{formatDate(placed.date)} · {placed.time}</strong>
            </div>
            <div className="d-flex justify-content-between small mb-1">
              <span className="text-muted">Amount</span>
              <strong className="text-primary">{formatMoney(placed.price)}</strong>
            </div>
            <div className="d-flex justify-content-between small">
              <span className="text-muted">Payment</span>
              <strong className="text-capitalize">{placed.paymentStatus} · {placed.paymentMethod}</strong>
            </div>
          </div>

          <div className="d-grid gap-2">
            <button type="button" className="btn btn-brand" onClick={() => navigate(`/customer/tracking/${placed.id}`)}>
              <FaMapMarkerAlt className="me-1" /> Track Service
            </button>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-outline-brand flex-grow-1" onClick={() => window.print()}><FaPrint className="me-1" /> Print receipt</button>
              <Link to="/customer/bookings" className="btn btn-light border flex-grow-1">My Bookings</Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container-lg py-4" style={{ maxWidth: 960 }}>
      <h4 className="fw-bold mb-1">Book Your Service</h4>
      <p className="text-muted small mb-4">Complete {STEPS.length} quick steps to confirm your booking.</p>
      <StepHeader current={step} />

      <div className="card card-plain p-4">
        {/* STEP 1 — Service */}
        {step === 0 && (
          <>
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><FaSearch className="text-primary" /> Choose a service</h6>
            <div className="input-group-icon mb-3" style={{ maxWidth: 400 }}>
              <FaSearch />
              <input type="search" className="form-control" placeholder="Search services…" value={searchQ} onChange={(e) => setSearchQ(e.target.value)} />
            </div>
            <div className="row g-3">
              {filteredServices.map((s) => {
                const Icon = icons[s.img] || icons.FaTools
                return (
                  <div className="col-12 col-md-6" key={s.id}>
                    <button type="button" className="btn w-100 text-start p-3 d-flex align-items-center gap-3" style={{ border: serviceId === s.id ? '2px solid #0d6efd' : '2px solid #e5e7eb', borderRadius: 14, background: serviceId === s.id ? '#eef4ff' : '#fff' }} onClick={() => pickService(s.id)}>
                      <span className="stat-icon" style={{ background: `${s.color}1a`, color: s.color }}><Icon /></span>
                      <div className="flex-grow-1">
                        <div className="fw-semibold small">{s.name}</div>
                        <div className="text-muted small">{s.providerType === 'agency' ? 'Agency' : 'Professional'} · {s.location}</div>
                      </div>
                      <div className="text-end">
                        <div className="fw-bold text-primary">{formatMoney(s.price)}</div>
                        <div className="text-muted" style={{ fontSize: '0.68rem' }}>{s.duration} min</div>
                      </div>
                    </button>
                  </div>
                )
              })}
            </div>
          </>
        )}

        {/* STEP 2 — Professional/Agency */}
        {step === 1 && (
          <>
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><FaUserTie className="text-primary" /> Select provider</h6>
            <div className="d-flex align-items-center gap-3 mb-4">
              <ServiceIcon />
              <div>
                <div className="fw-semibold">{service?.name}</div>
                <div className="text-muted small">{cat?.name} · {formatMoney(service?.price)}</div>
              </div>
            </div>
            <div className="d-grid gap-3">
              {availableProviders.map((p) => (
                <div key={p.id} className={`d-flex align-items-center gap-3 p-3 ${providerId === p.id ? 'border border-primary' : 'border'}`} style={{ borderRadius: 14, cursor: 'pointer' }} onClick={() => setProviderId(p.id)}>
                  <Avatar name={p.name} size="lg" id={p.id} />
                  <div className="flex-grow-1">
                    <div className="fw-semibold d-flex align-items-center gap-2">
                      {p.name}
                      {p.legalName && <span className="badge bg-soft-brand"><FaBuilding className="me-1" size={10} /> Agency</span>}
                      {p.verification === 'verified' && <FaShieldAlt className="text-success" title="Verified" />}
                    </div>
                    <div className="text-muted small">
                      {p.skills ? p.skills.slice(0, 3).join(' · ') : (p.servicesOffered || []).map((c) => CATEGORIES.find((x) => x.id === c)?.name).filter(Boolean).join(' · ')}
                    </div>
                    <div className="d-flex align-items-center gap-2 mt-1">
                      <RatingStars value={p.rating || 0} size={11} />
                      <span className="small fw-semibold">{p.rating || '—'}</span>
                      <span className="text-muted small">({p.reviewCount || 0})</span>
                      {p.availability !== false && <span className="badge bg-soft-success">Available</span>}
                    </div>
                  </div>
                  {providerId === p.id && <FaCheck className="text-primary fs-4" />}
                </div>
              ))}
            </div>
          </>
        )}

        {/* STEP 3 — Schedule */}
        {step === 2 && (
          <>
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><FaCalendarAlt className="text-primary" /> Pick date & time</h6>
            <label className="form-label">Select date</label>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {dayOptions.map((d) => (
                <button key={d.days} type="button" className={`btn btn-sm btn-pill ${date === d.label ? 'btn-brand' : 'btn-light border'}`} onClick={() => setDate(d.label)}>
                  {d.label}
                </button>
              ))}
            </div>
            <label className="form-label">Preferred time slot</label>
            <div className="d-flex flex-wrap gap-2">
              {slotList.map((t) => (
                <button key={t} type="button" className={`btn btn-sm ${time === t ? 'btn-brand' : 'btn-light border'}`} onClick={() => setTime(t)}>
                  <FaClock className="me-1" size={11} /> {t}
                </button>
              ))}
            </div>
          </>
        )}

        {/* STEP 4 — Location */}
        {step === 3 && (
          <>
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><FaMapMarkerAlt className="text-primary" /> Service location</h6>
            <div className="row g-3">
              <div className="col-12 col-md-4">
                <label className="form-label">City</label>
                <select className="form-select" value={city} onChange={(e) => setCity(e.target.value)}>
                  {INDIA_CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-12 col-md-8">
                <label className="form-label">Street address</label>
                <input type="text" className="form-control" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="House no, street, area" />
              </div>
            </div>
          </>
        )}

        {/* STEP 5 — Details */}
        {step === 4 && (
          <>
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><FaInfoCircle className="text-primary" /> Additional details</h6>
            <div className="mb-3">
              <label className="form-label">Describe the issue / instructions</label>
              <textarea className="form-control" rows={4} value={issue} onChange={(e) => setIssue(e.target.value)} placeholder="e.g. Two socket points stopped working, plus a ceiling fan wobbles…" />
            </div>
            <div className="row g-3">
              <div className="col-12 col-md-6">
                <label className="form-label">Preferred time</label>
                <select className="form-select" value={preferred} onChange={(e) => setPreferred(e.target.value)}>
                  {['Morning', 'Afternoon', 'Evening', 'Immediate'].map((v) => <option key={v}>{v}</option>)}
                </select>
              </div>
              <div className="col-12 col-md-6 d-flex align-items-end">
                <div className="form-check form-switch">
                  <input className="form-check-input" type="checkbox" id="urgent" checked={urgent} onChange={(e) => setUrgent(e.target.checked)} />
                  <label className="form-check-label" htmlFor="urgent">
                    Urgent (24×7) — additional charge <strong className="text-primary">{service ? formatMoney(Math.max(0, (service.emergency || service.price) - service.price)) : ''}</strong>
                  </label>
                </div>
              </div>
            </div>
          </>
        )}

        {/* STEP 6 — Payment */}
        {step === 5 && (
          <>
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><FaMoneyBillWave className="text-primary" /> Payment method</h6>
            <div className="alert alert-light small">
              This is a simulation — no real payment is processed. A mock transaction is recorded locally.
            </div>
            <div className="price-grid">
              {PAYMENT_METHODS.map((m) => {
                const Icon = icons[m.icon]
                return (
                  <button key={m.id} type="button" className={`price-item d-flex flex-column align-items-center gap-1 ${payMethod === m.id ? 'selected' : ''}`} onClick={() => setPayMethod(m.id)}>
                    <Icon className="text-primary fs-4" />
                    <span className="small fw-semibold text-center">{m.label}</span>
                  </button>
                )
              })}
            </div>
            <div className="row mt-4">
              <div className="col-md-6">
                <div className="border rounded-3 p-3">
                  <div className="d-flex justify-content-between small">
                    <span className="text-muted">Service price</span>
                    <strong>{formatMoney(service?.price)}</strong>
                  </div>
                  {urgent && service?.emergency && (
                    <div className="d-flex justify-content-between small">
                      <span className="text-muted">Urgent surcharge</span>
                      <strong>{formatMoney(service.emergency - service.price)}</strong>
                    </div>
                  )}
                  <hr className="my-2" />
                  <div className="d-flex justify-content-between">
                    <span className="fw-bold">Total</span>
                    <span className="fw-bold text-primary fs-5">{formatMoney(price)}</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Footer nav */}
        <div className="d-flex justify-content-between align-items-center mt-4 pt-3" style={{ borderTop: '1px solid #eef1f6' }}>
          <button type="button" className="btn btn-ghost" onClick={back} disabled={step === 0}><FaChevronLeft className="me-1" /> Back</button>
          <div className="d-flex align-items-center gap-3">
            <div className="text-end d-none d-md-block">
              <div className="text-muted small">Order total</div>
              <div className="fw-bold text-primary">{formatMoney(price)}</div>
            </div>
            {step < STEPS.length - 1 ? (
              <button type="button" className="btn btn-brand px-4" onClick={next} disabled={step === 0 && !serviceId || step === 1 && !providerId || step === 3 && !address}>
                Continue <FaChevronRight className="ms-1" size={12} />
              </button>
            ) : processing ? (
              <button className="btn btn-brand px-4" disabled><FaSpinner className="me-2" style={{ animation: 'spin 1s linear infinite' }} /> Processing…</button>
            ) : (
              <button type="button" className="btn btn-brand px-4" onClick={confirm}>Pay {formatMoney(price)}</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingFlowPage