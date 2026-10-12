import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaStar, FaRegStar, FaEdit, FaCheckCircle, FaQuoteLeft } from 'react-icons/fa'
import { selectBookingsByCustomer } from '../../features/bookings/bookingSlice'
import { selectReviews } from '../../features/reviews/reviewSlice'
import { addReview } from '../../features/reviews/reviewSlice'
import { addNotification } from '../../features/notifications/notificationSlice'
import { toast } from '../../features/ui/uiSlice'
import { useCatalog } from '../../hooks/useCatalog'
import PageHeader from '../../components/common/PageHeader'
import RatingStars from '../../components/common/RatingStars'
import { formatDate } from '../../utils/format'

const CustomerReviewsPage = () => {
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.currentUser)
  const bookings = useSelector((s) => selectBookingsByCustomer(s, user?.id))
  const reviews = useSelector(selectReviews).filter((r) => r.customerId === user?.id)
  const catalog = useCatalog()

  const reviewable = bookings
    .filter((b) => b.status === 'completed' && !reviews.some((r) => r.bookingId === b.bookingId))

  const [bookingId, setBookingId] = useState('')
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')

  const submit = () => {
    if (!bookingId) return setError('Select a completed booking to review.')
    if (!rating) return setError('Please select a star rating.')
    if (comment.trim().length < 10) return setError('Please write a short review (min 10 characters).')
    const b = bookings.find((x) => x.id === bookingId)
    const providerId = b.agencyId || b.professionalId || b.providerId
    dispatch(addReview({
      bookingId: b.bookingId,
      customerId: user.id,
      providerType: b.providerType,
      providerId,
      agencyId: b.agencyId,
      serviceId: b.serviceId,
      rating,
      comment: comment.trim(),
    }))
    dispatch(addNotification({
      userId: providerId,
      type: 'review',
      title: 'New Review',
      message: `You received a ${rating}-star review for ${b.bookingId}.`,
    }))
    toast(dispatch, 'Thanks! Your review has been published.', 'success', 'Review Posted')
    setBookingId(''); setRating(0); setHover(0); setComment(''); setError('')
  }

  return (
    <div>
      <PageHeader title="My Reviews" subtitle="Rate your experiences and help others choose better." />
      <div className="row g-4">
        <div className="col-lg-5">
          <div className="card card-plain p-4">
            <h6 className="fw-bold mb-3">Write a review</h6>
            {!reviewable.length ? (
              <div className="text-muted small text-center py-4">
                <FaCheckCircle className="text-success mb-2" size={28} />
                You've reviewed all your completed services.<br />Your next booking can be rated once complete.
              </div>
            ) : (
              <>
                <label className="form-label">Completed booking</label>
                <select className="form-select mb-3" value={bookingId} onChange={(e) => setBookingId(e.target.value)}>
                  <option value="">Select a booking…</option>
                  {reviewable.map((b) => (
                    <option key={b.id} value={b.id}>{b.bookingId} · {catalog.serviceById(b.serviceId)?.name}</option>
                  ))}
                </select>

                <label className="form-label">Rating</label>
                <div className="d-flex gap-1 mb-3 fs-3">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <span key={n} style={{ cursor: 'pointer', color: (hover || rating) >= n ? '#f5a623' : '#d0d5dd' }}
                      onMouseEnter={() => setHover(n)} onMouseLeave={() => setHover(0)} onClick={() => setRating(n)}>
                      {(hover || rating) >= n ? <FaStar /> : <FaRegStar />}
                    </span>
                  ))}
                </div>

                <label className="form-label">Your review</label>
                <textarea className="form-control mb-3" rows={4} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience…" />
                {error && <div className="text-danger small mb-2">{error}</div>}
                <button type="button" className="btn btn-brand w-100" onClick={submit}><FaEdit className="me-1" /> Submit Review</button>
              </>
            )}
          </div>
        </div>

        <div className="col-lg-7">
          <h6 className="fw-bold mb-3"><FaQuoteLeft className="text-primary me-1" /> Previous reviews ({reviews.length})</h6>
          {!reviews.length && <div className="text-muted small border rounded p-4 text-center">You haven't written any reviews yet.</div>}
          <div className="d-flex flex-column gap-3">
            {reviews.sort((a, b) => new Date(b.date) - new Date(a.date)).map((r) => {
              const b = bookings.find((x) => x.bookingId === r.bookingId)
              return (
                <div key={r.id} className="card card-plain p-3">
                  <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                    <div className="fw-semibold small">{catalog.serviceById(r.serviceId)?.name}</div>
                    <div className="d-flex align-items-center gap-2">
                      <RatingStars value={r.rating} size={12} />
                      <span className="text-muted small">{formatDate(r.date)}</span>
                    </div>
                  </div>
                  <p className="small mb-1 mt-2">{r.comment}</p>
                  <div className="text-muted small" style={{ fontSize: '0.74rem' }}>Booking {r.bookingId} · {b ? catalog.providerNameForBooking(b) : '—'}</div>
                  {r.response && (
                    <div className="bg-light rounded p-2 small mt-2"><strong>Provider: </strong>{r.response}</div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CustomerReviewsPage