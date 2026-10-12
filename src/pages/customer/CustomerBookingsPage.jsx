import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaEye, FaBan, FaTruck, FaStar, FaSearch } from 'react-icons/fa'
import { selectBookingsByCustomer, cancelBooking } from '../../features/bookings/bookingSlice'
import { openConfirm, toast } from '../../features/ui/uiSlice'
import PageHeader from '../../components/common/PageHeader'
import BookingTable from '../../components/cards/BookingTable'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import { useCatalog } from '../../hooks/useCatalog'
import { formatMoney, formatDate } from '../../utils/format'
import { EmptyState } from '../../components/common/Feedback'

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
]

const CustomerBookingsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((s) => s.auth.currentUser)
  const bookings = useSelector((s) => selectBookingsByCustomer(s, user?.id))
  const catalog = useCatalog()
  const [tab, setTab] = useState('all')
  const [q, setQ] = useState('')
  const [detail, setDetail] = useState(null)

  const FLOW = ['pending', 'accepted', 'assigned', 'on_the_way', 'arrived', 'in_progress']
  const filtered = bookings
    .filter((b) => tab === 'all' || (tab === 'upcoming' && FLOW.includes(b.status)) || (tab === 'completed' && b.status === 'completed') || (tab === 'cancelled' && b.status === 'cancelled'))
    .filter((b) => {
      const qq = q.toLowerCase()
      return !qq || b.bookingId.toLowerCase().includes(qq) || catalog.serviceById(b.serviceId)?.name.toLowerCase().includes(qq)
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const canCancel = (b) => ['pending', 'accepted', 'assigned'].includes(b.status)

  const onCancel = (b) => {
    dispatch(openConfirm({
      title: 'Cancel this booking?',
      message: `Booking ${b.bookingId} will be cancelled and any amount paid will be refunded (simulated).`,
      confirmText: 'Yes, cancel',
      onConfirm: () => {
        dispatch(cancelBooking(b.id))
        dispatch({ type: 'bookings/updateBooking', payload: { id: b.id, paymentStatus: 'refunded' } })
        toast(dispatch, `Booking ${b.bookingId} cancelled.`, 'warning', 'Cancelled')
      },
    }))
  }

  return (
    <div>
      <PageHeader title="My Bookings" subtitle={`${bookings.length} total bookings`} />

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <ul className="nav nav-pills pill-tabs flex-nowrap overflow-auto">
          {TABS.map((t) => (
            <li className="nav-item" key={t.key}>
              <button type="button" className={`nav-link ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>{t.label}</button>
            </li>
          ))}
        </ul>
        <div className="input-group-icon" style={{ width: 260 }}>
          <FaSearch />
          <input type="search" className="form-control form-control-sm" placeholder="Search by ID or service…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<FaSearch />} title="No bookings found" message="Try a different tab or book a service to get started." action actionLabel="Browse services" actionTo="/services" />
      ) : (
        <BookingTable
          bookings={filtered}
          getService={(id) => catalog.serviceById(id)}
          getProvider={(b) => catalog.providerNameForBooking(b)}
          actionsFor={(b) => (
            <>
              <button type="button" className="btn btn-light border btn-icon" title="Details" onClick={() => setDetail(b)}><FaEye /></button>
              {FLOW.includes(b.status) && (
                <button type="button" className="btn btn-soft-brand btn-icon" title="Track" onClick={() => navigate(`/customer/tracking/${b.id}`)}><FaTruck /></button>
              )}
              {canCancel(b) && (
                <button type="button" className="btn btn-soft-danger btn-icon" title="Cancel" onClick={() => onCancel(b)}><FaBan /></button>
              )}
              {b.status === 'completed' && (
                <button type="button" className="btn btn-soft-warning btn-icon" title="Review" onClick={() => navigate('/customer/reviews')}><FaStar /></button>
              )}
            </>
          )}
        />
      )}

      <Modal
        show={Boolean(detail)}
        onClose={() => setDetail(null)}
        title={`Booking ${detail?.bookingId || ''}`}
        size="lg"
        footer={<button type="button" className="btn btn-brand" onClick={() => setDetail(null)}>Close</button>}
      >
        {detail && (
          <div className="row g-3">
            <div className="col-md-6">
              <div className="bg-light rounded p-3">
                <div className="small text-muted mb-2 fw-semibold">Service</div>
                <div className="fw-bold">{catalog.serviceById(detail.serviceId)?.name}</div>
                <div className="small text-muted mt-1">{detail.category}</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="bg-light rounded p-3">
                <div className="small text-muted mb-2 fw-semibold">Provider</div>
                <div className="fw-bold">{catalog.providerNameForBooking(detail)}</div>
                <div className="small text-muted mt-1">{detail.providerType === 'agency' ? 'Agency' : 'Professional'}</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="border rounded p-3">
                <div className="small text-muted mb-2 fw-semibold">Schedule</div>
                <div>{formatDate(detail.date)} · {detail.time || detail.preferredTime}</div>
                <div className="small text-muted mt-1">{detail.preferredTime} request</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="border rounded p-3">
                <div className="small text-muted mb-2 fw-semibold">Location</div>
                <div>{detail.location?.address}, {detail.location?.city}</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="border rounded p-3">
                <div className="small text-muted mb-2 fw-semibold">Price & Payment</div>
                <div className="fw-bold text-primary">{formatMoney(detail.price)}</div>
                <div className="small text-muted mt-1">
                  Payment: <span className="text-capitalize">{detail.paymentMethod}</span> · <span className={`text-capitalize fw-semibold ${detail.paymentStatus === 'paid' ? 'text-success' : 'text-warning'}`}>{detail.paymentStatus}</span>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="border rounded p-3">
                <div className="small text-muted mb-2 fw-semibold">Status</div>
                <StatusBadge status={detail.status} />
                {detail.issueDescription && <div className="small text-muted mt-2">{detail.issueDescription}</div>}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default CustomerBookingsPage