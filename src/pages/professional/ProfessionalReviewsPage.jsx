import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaStar, FaQuoteLeft, FaPaperPlane, FaFlag } from 'react-icons/fa'
import { selectReviewsForProvider, selectRatingDistribution, respondToReview } from '../../features/reviews/reviewSlice'
import { selectBookings } from '../../features/bookings/bookingSlice'
import { selectAllUsers } from '../../features/users/userSlice'
import { addNotification } from '../../features/notifications/notificationSlice'
import { toast } from '../../features/ui/uiSlice'
import PageHeader from '../../components/common/PageHeader'
import RatingStars from '../../components/common/RatingStars'
import StatCard from '../../components/common/StatCard'
import ChartCard from '../../components/common/ChartCard'
import { ChartPie } from '../../components/charts/Recharts'
import Avatar from '../../components/common/Avatar'
import { useCatalog } from '../../hooks/useCatalog'
import { formatDate } from '../../utils/format'

const ProfessionalReviewsPage = () => {
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.currentUser)
  const reviews = useSelector((s) => selectReviewsForProvider(s, user?.id, 'professional'))
  const dist = useSelector((s) => selectRatingDistribution(s, user?.id))
  const users = useSelector(selectAllUsers)
  const bookings = useSelector(selectBookings)
  const catalog = useCatalog()

  const [replying, setReplying] = useState(null)
  const [text, setText] = useState('')

  const custName = (id) => users.find((u) => u.id === id)?.name || 'Customer'
  const bookingById = (rid) => bookings.find((b) => b.bookingId === rid)
  const sorted = [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date))

  const avg = reviews.length ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : '—'
  const flagged = reviews.filter((r) => r.status === 'flagged').length
  const responded = reviews.filter((r) => r.response).length

  const submitReply = (r) => {
    if (!text.trim()) return
    dispatch(respondToReview({ id: r.id, response: text.trim() }))
    dispatch(addNotification({
      userId: r.customerId,
      type: 'review',
      title: 'Provider Response',
      message: `${user?.name || 'The provider'} responded to your review on ${r.bookingId}.`,
    }))
    toast(dispatch, 'Your response has been published.', 'success', 'Reply Posted')
    setReplying(null)
    setText('')
  }

  return (
    <div>
      <PageHeader title="Reviews" subtitle="See what customers say and respond to build trust." />

      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3"><StatCard icon={<FaStar />} label="Average Rating" value={avg} accent="#f5a623" sub={`${reviews.length} reviews`} /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaPaperPlane />} label="Responded" value={responded} accent="#0d6efd" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaFlag />} label="Flagged" value={flagged} accent="#dc3545" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaQuoteLeft />} label="5-Star" value={dist[5] || 0} accent="#20c997" /></div>
      </div>

      <div className="row g-4">
        <div className="col-lg-4">
          <ChartCard title="Rating distribution" subtitle="All ratings">
            <ChartPie
              data={[5, 4, 3, 2, 1].map((n) => ({ name: `${n} star`, value: dist[n] || 0 })).filter((d) => d.value > 0)}
              colors={['#20c997', '#0d6efd', '#f5a623', '#fd7e14', '#dc3545']}
              height={240}
            />
          </ChartCard>
          <div className="card card-plain p-4 mt-3">
            <h6 className="fw-bold mb-3">Rating breakdown</h6>
            {[5, 4, 3, 2, 1].map((n) => (
              <div key={n} className="d-flex align-items-center gap-2 mb-2">
                <span className="small flex-shrink-0" style={{ width: 18 }}>{n}★</span>
                <div className="progress flex-grow-1" style={{ height: 6 }}>
                  <div className="progress-bar" style={{ width: `${reviews.length ? (dist[n] / reviews.length) * 100 : 0}%`, background: ['#20c997', '#0d6efd', '#f5a623', '#fd7e14', '#dc3545'][5 - n] }} />
                </div>
                <span className="small text-muted flex-shrink-0" style={{ width: 24 }}>{dist[n]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-8">
          {!sorted.length ? (
            <div className="text-muted small border rounded p-4 text-center">No reviews yet. They'll appear once customers finish their bookings.</div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {sorted.map((r) => {
                const booking = bookingById(r.bookingId)
                return (
                  <div key={r.id} className={`card card-plain p-3 ${r.status === 'flagged' ? 'border-danger' : ''}`}>
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                      <div className="d-flex align-items-center gap-2">
                        <Avatar name={custName(r.customerId)} id={r.customerId} size="sm" />
                        <div>
                          <div className="fw-semibold small">{custName(r.customerId)}</div>
                          <div className="text-muted small">{catalog.serviceById(r.serviceId)?.name}</div>
                        </div>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        {r.status === 'flagged' && <span className="badge bg-soft-danger"><FaFlag className="me-1" size={10} /> Flagged</span>}
                        <RatingStars value={r.rating} size={12} />
                        <span className="text-muted small">{formatDate(r.date)}</span>
                      </div>
                    </div>
                    <p className="small mb-1 mt-2">{r.comment}</p>
                    <div className="text-muted small" style={{ fontSize: '0.74rem' }}>Booking {r.bookingId}{booking?.location?.city ? ` · ${booking.location.city}` : ''}</div>
                    {r.response && (
                      <div className="bg-light rounded p-2 small mt-2"><strong>Your reply: </strong>{r.response}</div>
                    )}
                    {r.status !== 'flagged' && !r.response && (
                      <div className="mt-2">
                        {replying === r.id ? (
                          <div className="d-flex gap-2">
                            <input className="form-control form-control-sm" value={text} onChange={(e) => setText(e.target.value)} placeholder="Write your response…" />
                            <button type="button" className="btn btn-brand btn-sm flex-shrink-0" onClick={() => submitReply(r)}><FaPaperPlane className="me-1" size={11} /> Reply</button>
                          </div>
                        ) : (
                          <button type="button" className="btn btn-outline-brand btn-sm" onClick={() => { setReplying(r.id); setText('') }}>Respond</button>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProfessionalReviewsPage
