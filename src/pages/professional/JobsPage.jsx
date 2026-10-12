import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaChevronRight, FaCheckDouble, FaTruck, FaHome, FaWrench, FaCheckCircle, FaMapMarkerAlt, FaUser, FaCalendarAlt, FaSearch } from 'react-icons/fa'
import { selectBookingsByProfessional, updateBooking } from '../../features/bookings/bookingSlice'
import { selectPayments, addPayment } from '../../features/payments/paymentSlice'
import { selectAllUsers } from '../../features/users/userSlice'
import { addNotification } from '../../features/notifications/notificationSlice'
import { toast } from '../../features/ui/uiSlice'
import { useCatalog } from '../../hooks/useCatalog'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import EmptyState from '../../components/common/Feedback'
import { formatMoney, formatDate } from '../../utils/format'
import { COMMISSION_PRO } from '../../data/categories'

const FLOW = [
  { status: 'accepted', icon: <FaCheckDouble />, label: 'Accept' },
  { status: 'on_the_way', icon: <FaTruck />, label: 'Mark On the Way' },
  { status: 'arrived', icon: <FaHome />, label: 'Mark Arrived' },
  { status: 'in_progress', icon: <FaWrench />, label: 'Start Service' },
  { status: 'completed', icon: <FaCheckCircle />, label: 'Complete Job' },
]

const TABS = [
  { key: 'all', label: 'All Jobs' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
]

const JobsPage = () => {
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.currentUser)
  const bookings = useSelector((s) => selectBookingsByProfessional(s, user?.id))
  const payments = useSelector(selectPayments)
  const users = useSelector(selectAllUsers)
  const catalog = useCatalog()
  const [tab, setTab] = useState('all')

  const FLOW_KEYS = FLOW.map((f) => f.status)
  const filtered = bookings
    .filter((b) => {
      if (tab === 'active') return FLOW_KEYS.includes(b.status)
      if (tab === 'completed') return b.status === 'completed'
      if (tab === 'upcoming') return b.status === 'pending' || b.status === 'accepted'
      return true
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const custName = (id) => users.find((u) => u.id === id)?.name || 'Customer'

  const advance = (b) => {
    const idx = FLOW_KEYS.indexOf(b.status)
    if (idx === -1) return
    const next = FLOW_KEYS[idx + 1]
    dispatch(updateBooking({ id: b.id, status: next }))
    toast(dispatch, `Booking ${b.bookingId} → ${next.replace(/_/g, ' ')}`, 'info', 'Status updated')
    if (next === 'completed') {
      const existing = payments.find((p) => p.bookingId === b.bookingId && p.type === 'payout')
      if (!existing) {
        const payout = Math.round(b.price * (1 - COMMISSION_PRO))
        dispatch(addPayment({
          bookingId: b.bookingId,
          userId: user.id,
          userRole: 'professional',
          type: 'payout',
          amount: payout,
          commission: Math.round(b.price * COMMISSION_PRO),
          status: 'completed',
          method: 'bank',
        }))
      }
      dispatch(addNotification({ userId: b.customerId, type: 'tracking', title: 'Service Completed', message: `Your booking ${b.bookingId} has been completed.` }))
      toast(dispatch, `Payout of ${formatMoney(Math.round(b.price * (1 - COMMISSION_PRO)))} added to your balance.`, 'success', 'Payment received')
    }
  }

  return (
    <div>
      <PageHeader title="My Jobs" subtitle="Manage your bookings and update job progress." />
      <div className="d-flex justify-content-between align-items-center gap-2 mb-3 flex-wrap">
        <ul className="nav nav-pills pill-tabs">
          {TABS.map((t) => <li className="nav-item" key={t.key}><button type="button" className={`nav-link ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>{t.label}</button></li>)}
        </ul>
      </div>

      {!filtered.length ? (
        <EmptyState icon={<FaSearch />} title="No jobs in this view" message="New bookings will appear here once accepted." />
      ) : (
        <div className="d-grid gap-3">
          {filtered.map((b) => {
            const svc = catalog.serviceById(b.serviceId)
            const curIdx = FLOW_KEYS.indexOf(b.status)
            const nextStep = curIdx >= 0 && curIdx < FLOW_KEYS.length - 1 ? FLOW[curIdx] : null
            return (
              <div key={b.id} className="card card-plain p-3">
                <div className="d-flex flex-wrap gap-3 align-items-center">
                  <div className="flex-grow-1" style={{ minWidth: 220 }}>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span className="fw-bold small">{svc?.name}</span>
                      {b.urgent && <span className="badge bg-soft-danger">Urgent</span>}
                      <StatusBadge status={b.status} />
                    </div>
                    <div className="text-muted small d-flex flex-wrap gap-3 mt-1">
                      <span><FaUser className="me-1 text-primary" size={11} /> {custName(b.customerId)}</span>
                      <span><FaCalendarAlt className="me-1 text-primary" size={11} /> {formatDate(b.date)}{b.time ? ` · ${b.time}` : ''}</span>
                      <span><FaMapMarkerAlt className="me-1 text-primary" size={11} /> {b.location?.city}</span>
                    </div>
                  </div>
                  <div className="text-end">
                    <div className="money text-primary">{formatMoney(b.price)}</div>
                    <div className="text-muted small">pay {b.paymentStatus}</div>
                  </div>
                  <div className="d-flex flex-column align-items-end gap-1">
                    {nextStep ? (
                      <button type="button" className="btn btn-brand btn-sm" onClick={() => advance(b)}>
                        {nextStep.icon} {nextStep.label} <FaChevronRight size={10} />
                      </button>
                    ) : b.status === 'completed' ? (
                      <span className="badge bg-soft-success"><FaCheckCircle className="me-1" size={10} /> Completed</span>
                    ) : null}
                    {b.status === 'pending' && (
                      <button type="button" className="btn btn-light border btn-sm" onClick={() => dispatch(updateBooking({ id: b.id, status: 'accepted' }))}>Accept now</button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default JobsPage