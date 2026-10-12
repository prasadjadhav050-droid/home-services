import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaMapMarkerAlt, FaHome, FaPhoneAlt, FaClock, FaRoute, FaCheckCircle, FaSpinner } from 'react-icons/fa'
import { setTracking, selectBookingsByCustomer } from '../../features/bookings/bookingSlice'
import { addNotification } from '../../features/notifications/notificationSlice'
import { toast } from '../../features/ui/uiSlice'
import StatusBadge from '../../components/common/StatusBadge'
import Avatar from '../../components/common/Avatar'
import { useCatalog } from '../../hooks/useCatalog'
import PageHeader from '../../components/common/PageHeader'
import { formatMoney } from '../../utils/format'
import { EmptyState } from '../../components/common/Feedback'

const SEQUENCE = [
  { status: 'on_the_way', at: 0, label: 'Accepted' },
  { status: 'on_the_way', at: 0.08, label: 'On the Way' },
  { status: 'arrived', at: 0.55, label: 'Arrived' },
  { status: 'in_progress', at: 0.62, label: 'In Progress' },
  { status: 'completed', at: 1, label: 'Completed' },
]

const TOTAL_DIST = 3.4
const BASE_ETA_MIN = 13

const TrackingPage = () => {
  const { bookingId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((s) => s.auth.currentUser)
  const all = useSelector((s) => selectBookingsByCustomer(s, user?.id))
  const catalog = useCatalog()

  const booking = useMemo(() => {
    if (bookingId === 'latest') {
      const FLOW = ['accepted', 'assigned', 'on_the_way', 'arrived', 'in_progress']
      const active = all.filter((b) => FLOW.includes(b.status)).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      return active[0] || all[0]
    }
    return all.find((b) => b.id === bookingId) || all.find((b) => b.bookingId === bookingId)
  }, [bookingId, all])

  const [progress, setProgress] = useState(() => (booking ? initialProgress(booking.status) : 0))
  const [timerOn, setTimerOn] = useState(true)
  const doneRef = useRef(false)

  function initialProgress(status) {
    switch (status) {
      case 'assigned': return 0.02
      case 'accepted': return 0.04
      case 'on_the_way': return 0.15
      case 'arrived': return 0.55
      case 'in_progress': return 0.65
      default: return 0
    }
  }

  useEffect(() => {
    if (booking) setProgress(initialProgress(booking.status))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking?.id])

  useEffect(() => {
    if (!booking || timerOn === false) return undefined
    const t = setInterval(() => {
      setProgress((p) => {
        const np = Math.min(1, p + 0.018)
        for (const step of SEQUENCE) {
          if (np >= step.at && p < step.at) {
            dispatch(setTracking({ id: booking.id, status: step.status, step: SEQUENCE.indexOf(step) }))
            if (step.status === 'completed' && !doneRef.current) {
              doneRef.current = true
              dispatch(addNotification({
                userId: user?.id,
                type: 'tracking',
                title: 'Service Completed',
                message: `Your booking ${booking.bookingId} has been completed. Please rate your experience.`,
              }))
              toast(dispatch, `${booking.bookingId} completed — rate your provider!`, 'success', 'Service Completed')
            }
          }
        }
        return np
      })
    }, 900)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [booking?.id, timerOn, user?.id])

  if (!booking) {
    return <EmptyState icon={<FaMapMarkerAlt />} title="No active service to track" message="Once you book a service you'll be able to track your professional live here." action actionLabel="Book a service" actionTo="/services" />
  }

  const service = catalog.serviceById(booking.serviceId)
  const provider = booking.providerType === 'agency'
    ? catalog.professionals.find((p) => p.id === booking.professionalId) || { name: catalog.agencyName(booking.agencyId || booking.providerId) }
    : catalog.professionals.find((p) => p.id === booking.professionalId || p.id === booking.providerId) || { name: catalog.proName(booking.providerId) }

  const traveled = (progress * TOTAL_DIST).toFixed(1)
  const remaining = Math.max(0, (1 - progress) * TOTAL_DIST).toFixed(1)
  const etaMin = Math.max(1, Math.round((1 - progress) * BASE_ETA_MIN + (booking.urgent ? 2 : 0)))
  const arrived = progress >= 0.55 && progress < 1
  const completed = progress >= 1

  const proLeft = 12 + progress * 72
  const proTop = 42 - progress * 6
  const pulse = !completed

  return (
    <div>
      <PageHeader
        title="Track Your Service"
        subtitle={`${booking.bookingId} · ${service?.name}`}
        back="/customer/bookings"
        actions={
          <>
            <StatusBadge status={completed ? 'completed' : arrived ? 'in_progress' : progress >= 0.08 ? 'on_the_way' : 'accepted'} />
            <button type="button" className="btn btn-outline-brand btn-sm btn-pill">
              <FaPhoneAlt className="me-1" size={11} /> {provider?.name}
            </button>
          </>
        }
      />

      {/* MAP */}
      <div className="track-map">
        <div className="map-road" style={{ left: '5%', right: '5%', top: '46%', height: 12 }} />
        <div className="map-road" style={{ top: '20%', bottom: '20%', left: '12%', width: 10, transform: 'rotate(18deg)' }} />
        <div className="map-road" style={{ top: '30%', bottom: '30%', left: '70%', width: 10, transform: 'rotate(-24deg)' }} />
        <div className="map-road" style={{ left: '30%', right: '30%', top: '12%', height: 6, opacity: 0.5 }} />
        <div className="map-road" style={{ left: '50%', right: '50%', top: '60%', bottom: '12%', width: 6, opacity: 0.5 }} />

        <div className="track-pin pin-home" style={{ left: '8%', top: '40%' }}>
          <span className="ten"><FaHome /></span>
        </div>
        <div className="position-absolute badge bg-dark mt-2" style={{ left: '11%', top: '32%', fontSize: '0.65rem' }}>Your home</div>

        {pulse && (
          <div className="track-pin" style={{ left: `${proLeft}%`, top: `${proTop}%`, zIndex: 2 }}>
            <span className="ten"><FaMapMarkerAlt /></span>
            <span className="pulse-ring" />
          </div>
        )}

        <div className="position-absolute bottom-0 start-0 end-0 p-3 d-flex flex-wrap gap-2 justify-content-around">
          <div className="card card-plain px-3 py-2 small">
            <FaRoute className="text-primary me-1" /> Distance<br />
            <strong>{completed ? TOTAL_DIST.toFixed(1) : traveled} km</strong>
          </div>
          <div className="card card-plain px-3 py-2 small">
            <FaMapMarkerAlt className="text-primary me-1" /> ETA<br />
            <strong>{completed ? 'Completed' : arrived ? 'On-site' : `${etaMin} min`}</strong>
          </div>
        </div>
      </div>

      {/* INFO CARDS */}
      <div className="row g-3 mt-1">
        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="text-muted small fw-semibold"><FaRoute className="me-1" />Remaining</div>
            <div className="fs-5 fw-bold">{completed ? '0.0' : remaining} km</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="text-muted small fw-semibold"><FaClock className="me-1" />ETA</div>
            <div className="fs-5 fw-bold">{completed ? 'Done' : arrived ? 'On-site' : `${etaMin} min`}</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-card">
            <div className="text-muted small fw-semibold"><FaMapMarkerAlt className="me-1" />Progress</div>
            <div className="fs-5 fw-bold">{Math.round(progress * 100)}%</div>
            <div className="progress mt-1" style={{ height: 6 }}>
              <div className="progress-bar" style={{ width: `${progress * 100}%` }} />
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="stat-card d-flex align-items-center gap-2">
            <Avatar name={provider?.name} id={booking.providerId} />
            <div>
              <div className="fw-semibold small">{provider?.name}</div>
              <a className="btn btn-outline-brand btn-sm btn-pill mt-1" href={`tel:${provider?.phone || '1800123456'}`}><FaPhoneAlt className="me-1" size={11} /> Call provider</a>
            </div>
          </div>
        </div>
      </div>

      {/* TIMELINE */}
      <div className="card card-plain p-4 mt-3">
        <h6 className="fw-bold mb-3">Job status</h6>
        <div className="d-flex flex-wrap align-items-center gap-2">
          {SEQUENCE.filter((s, i, arr) => arr.findIndex((x) => x.status === s.status && x.at === s.at) === i).map((step) => {
            const done = progress >= step.at || (step.at === 0 && progress > 0)
            return (
              <div key={step.label} className="d-flex align-items-center gap-2">
                <span className={`d-inline-flex align-items-center justify-content-center ${done ? 'bg-success text-white' : 'bg-light border text-muted'}`} style={{ width: 26, height: 26, borderRadius: '50%' }}>
                  {done ? <FaCheckCircle size={12} /> : <FaSpinner size={10} />}
                </span>
                <span className={`small fw-semibold ${done ? '' : 'text-muted'}`}>{step.label}</span>
                {step.label !== 'Completed' && <span className="border-bottom" style={{ width: 28 }} />}
              </div>
            )
          })}
        </div>

        {completed && (
          <div className="alert alert-success d-flex align-items-center gap-2 mt-3 mb-0">
            <FaCheckCircle /> Service complete! Please take a moment to <Link to="/customer/reviews">rate your provider</Link>.
          </div>
        )}
      </div>

      <div className="d-flex gap-2 mt-3 flex-wrap">
        <button type="button" className="btn btn-light border" onClick={() => setTimerOn((t) => !t)}>
          {timerOn ? 'Pause simulation' : 'Resume simulation'}
        </button>
        <button type="button" className="btn btn-light border" onClick={() => navigate('/customer/bookings')}>My Bookings</button>
        <a className="ms-auto btn btn-outline-brand" href={`tel:${provider?.phone || '1800123456'}`}><FaPhoneAlt className="me-1" /> Emergency call</a>
      </div>
    </div>
  )
}

export default TrackingPage