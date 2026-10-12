import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { FaCheck, FaTimes, FaEye, FaMapMarkerAlt, FaCalendarAlt, FaUser, FaClock, FaSearch } from 'react-icons/fa'
import { selectBookingsByProfessional, updateBooking } from '../../features/bookings/bookingSlice'
import { selectAllUsers } from '../../features/users/userSlice'
import { addNotification } from '../../features/notifications/notificationSlice'
import { toast } from '../../features/ui/uiSlice'
import PageHeader from '../../components/common/PageHeader'
import StatusBadge from '../../components/common/StatusBadge'
import Modal from '../../components/common/Modal'
import Avatar from '../../components/common/Avatar'
import { useCatalog } from '../../hooks/useCatalog'
import { formatMoney } from '../../utils/format'
import { EmptyState } from '../../components/common/Feedback'

const RequestsPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((s) => s.auth.currentUser)
  const bookings = useSelector((s) => selectBookingsByProfessional(s, user?.id))
  const users = useSelector(selectAllUsers)
  const catalog = useCatalog()
  const [detail, setDetail] = useState(null)
  const [q, setQ] = useState('')

  const pending = bookings.filter((b) => b.status === 'pending')
  const handled = bookings.filter((b) => b.status === 'accepted' || b.status === 'rejected')
  const list = [...pending, ...handled]
    .filter((b) => !q || b.bookingId.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

  const custName = (id) => users.find((u) => u.id === id)?.name || 'Customer'

  const respond = (b, accept) => {
    dispatch(updateBooking({
      id: b.id,
      status: accept ? 'accepted' : 'rejected',
      professionalId: user.id,
    }))
    dispatch(addNotification({
      userId: b.customerId,
      type: 'booking',
      title: accept ? 'Request Accepted' : 'Request Declined',
      message: `Booking ${b.bookingId} was ${accept ? 'accepted by' : 'declined by'} ${user.name}.`,
    }))
    toast(dispatch, accept ? `Booking ${b.bookingId} accepted.` : `Booking ${b.bookingId} declined.`, accept ? 'success' : 'warning', accept ? 'Accepted' : 'Declined')
    setDetail(null)
  }

  return (
    <div>
      <PageHeader title="Booking Requests" subtitle={`${pending.length} new request${pending.length === 1 ? '' : 's'} waiting for your response`} />
      <div className="mb-3 input-group-icon d-md-none">
        <FaSearch />
        <input type="search" className="form-control" placeholder="Search requests…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      {!list.length ? (
        <EmptyState icon={<FaInboxIcon />} title="No requests yet" message="When customers book one of your services you'll see the request here to accept or decline." />
      ) : (
        <div className="d-grid gap-3">
          {list.map((b) => {
            const svc = catalog.serviceById(b.serviceId)
            const cust = custName(b.customerId)
            return (
              <div key={b.id} className="card card-plain p-3">
                <div className="d-flex flex-wrap gap-3 align-items-center">
                  <Avatar name={cust} id={b.customerId} size="lg" />
                  <div className="flex-grow-1" style={{ minWidth: 220 }}>
                    <div className="d-flex align-items-center gap-2 flex-wrap">
                      <span className="fw-bold small">{svc?.name}</span>
                      {b.urgent && <span className="badge bg-soft-danger">Urgent</span>}
                      <StatusBadge status={b.status} />
                    </div>
                    <div className="text-muted small d-flex flex-wrap gap-3 mt-1">
                      <span><FaUser className="me-1 text-primary" size={11} /> {cust}</span>
                      <span><FaCalendarAlt className="me-1 text-primary" size={11} /> {b.preferredTime}{b.time ? ` · ${b.time}` : ''}</span>
                      <span><FaMapMarkerAlt className="me-1 text-primary" size={11} /> {b.location?.city}</span>
                    </div>
<span className="text-muted small mt-1 d-flex align-items-center gap-2">
  <FaClock className="text-primary" size={11} /> {b.bookingId} · {b.date}
</span>
                  </div>
                  <div className="text-end">
                    <div className="money text-primary">{formatMoney(b.price)}</div>
                    <div className="text-muted small">{svc?.duration} min</div>
                  </div>
                  <div className="d-flex gap-2 flex-wrap">
                    <button type="button" className="btn btn-light border btn-sm" onClick={() => setDetail(b)}><FaEye className="me-1" size={11} /> View</button>
                    {b.status === 'pending' && (
                      <>
                        <button type="button" className="btn btn-success btn-sm" onClick={() => respond(b, true)}><FaCheck className="me-1" size={11} /> Accept</button>
                        <button type="button" className="btn btn-outline-danger btn-sm" onClick={() => respond(b, false)}><FaTimes className="me-1" size={11} /> Reject</button>
                      </>
                    )}
                    {b.status === 'accepted' && (
                      <button type="button" className="btn btn-soft-brand btn-sm" onClick={() => navigate('/professional/jobs')}>Go to job progress</button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal show={Boolean(detail)} onClose={() => setDetail(null)} title={`Request · ${detail?.bookingId || ''}`} footer={<button type="button" className="btn btn-brand" onClick={() => setDetail(null)}>Close</button>}>
        {detail && (
          <div className="row g-3">
            <div className="col-6"><div className="bg-light rounded p-3"><div className="small text-muted">Customer</div><strong>{custName(detail.customerId)}</strong></div></div>
            <div className="col-6"><div className="bg-light rounded p-3"><div className="small text-muted">Service</div><strong>{catalog.serviceById(detail.serviceId)?.name}</strong></div></div>
            <div className="col-6"><div className="border rounded p-3"><div className="small text-muted">Location</div><strong>{detail.location?.address}<br /><span className="text-muted">{detail.location?.city}</span></strong></div></div>
            <div className="col-6"><div className="border rounded p-3"><div className="small text-muted">Schedule</div><strong>{detail.preferredTime} · {detail.date}</strong></div></div>
            <div className="col-6"><div className="border rounded p-3"><div className="small text-muted">Price</div><strong className="text-primary">{formatMoney(detail.price)}</strong></div></div>
            <div className="col-6"><div className="border rounded p-3"><div className="small text-muted">Payment</div><strong className="text-capitalize">{detail.paymentMethod}</strong></div></div>
            <div className="col-12">
              <div className="border rounded p-3">
                <div className="small text-muted">Issue description</div>
                <p className="mb-0">{detail.issueDescription || 'No description provided.'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

const FaInboxIcon = () => <FaSearch />
export default RequestsPage