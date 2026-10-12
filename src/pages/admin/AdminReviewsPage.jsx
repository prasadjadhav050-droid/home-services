import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaStar, FaComments, FaFlag, FaCheckCircle, FaTrash, FaGavel, FaSearch } from 'react-icons/fa'
import { selectReviews, flagReview, removeReview } from '../../features/reviews/reviewSlice'
import { selectBookings, resolveDispute } from '../../features/bookings/bookingSlice'
import { selectAllUsers } from '../../features/users/userSlice'
import { toast, openConfirm } from '../../features/ui/uiSlice'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import RatingStars from '../../components/common/RatingStars'
import { EmptyState } from '../../components/common/Feedback'
import { useCatalog } from '../../hooks/useCatalog'
import { formatDate } from '../../utils/format'

const TABS = [
  { key: 'all', label: 'All Reviews' },
  { key: 'flagged', label: 'Flagged' },
  { key: 'disputes', label: 'Disputes' },
]

const AdminReviewsPage = () => {
  const dispatch = useDispatch()
  const reviews = useSelector(selectReviews)
  const bookings = useSelector(selectBookings)
  const users = useSelector(selectAllUsers)
  const catalog = useCatalog()

  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')

  const userName = (id) => users.find((u) => u.id === id)?.name || '—'
  const disputes = bookings.filter((b) => b.dispute)

  const avgRating = reviews.length
    ? Number((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1))
    : 0

  const flagged = reviews.filter((r) => r.status === 'flagged')
  const visible = reviews.filter((r) => r.status !== 'flagged')

  const flaggedReviews = useMemo(() => {
    const q = query.trim().toLowerCase()
    return flagged.filter((r) => {
      if (!q) return true
      const cName = users.find((u) => u.id === r.customerId)?.name || ''
      const haystack = `${cName} ${catalog.serviceById(r.serviceId)?.name || ''} ${r.comment || ''}`.toLowerCase()
      return haystack.includes(q)
    })
  }, [flagged, query, users, catalog])

  const onFlag = (r) => {
    dispatch(flagReview(r.id))
    toast(dispatch, r.status === 'flagged' ? 'Review restored to visible.' : 'Review flagged for moderation.', 'info', 'Moderation')
  }

  const onRemove = (r) => {
    dispatch(openConfirm({
      title: 'Delete this review?',
      message: 'The review will be permanently removed from the platform.',
      confirmText: 'Yes, delete',
      onConfirm: () => {
        dispatch(removeReview(r.id))
        toast(dispatch, 'Review deleted.', 'warning', 'Deleted')
      },
    }))
  }

  const onResolve = (b) => {
    dispatch(resolveDispute(b.id))
    toast(dispatch, `Dispute on ${b.bookingId} marked as resolved.`, 'success', 'Resolved')
  }

  const renderReview = (r) => (
    <div key={r.id} className="card card-plain p-3">
      <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
        <div>
          <div className="fw-semibold small" style={{ color: 'var(--text)' }}>{catalog.serviceById(r.serviceId)?.name || 'Service'}</div>
          <div className="text-muted small">
            by {userName(r.customerId)} · for {catalog.proName(r.providerId) !== '—' ? catalog.proName(r.providerId) : catalog.agencyName(r.providerId)}
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <RatingStars value={r.rating} size={12} />
          {r.status === 'flagged' && <span className="badge bg-soft-danger">Flagged</span>}
        </div>
      </div>
      <p className="small mb-2 mt-2">{r.comment}</p>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <span className="text-muted small" style={{ fontSize: '0.74rem' }}>Booking {r.bookingId} · {formatDate(r.date)}</span>
        <div className="d-flex gap-1">
          <button type="button" className={`btn btn-sm ${r.status === 'flagged' ? 'btn-outline-success' : 'btn-light border'}`} onClick={() => onFlag(r)} title={r.status === 'flagged' ? 'Restore' : 'Flag'}>
            <FaFlag className="me-1" size={11} /> {r.status === 'flagged' ? 'Restore' : 'Flag'}
          </button>
          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => onRemove(r)} title="Delete">
            <FaTrash size={11} />
          </button>
        </div>
      </div>
    </div>
  )

  const search = (
    <div className="input-group input-group-sm" style={{ maxWidth: 280 }}>
      <span className="input-group-text bg-white"><FaSearch className="text-muted" /></span>
      <input
        type="search"
        className="form-control"
        placeholder="Search reviews…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  )

  return (
    <div>
      <PageHeader
        title="Reviews & Disputes"
        subtitle="Moderate customer feedback and resolve booking disputes."
        actions={search}
      />

      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3"><StatCard icon={<FaComments />} label="Total Reviews" value={reviews.length} accent="#0d6efd" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaStar />} label="Avg Rating" value={avgRating} accent="#f5a623" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaFlag />} label="Flagged" value={flagged.length} accent="#dc3545" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaGavel />} label="Open Disputes" value={disputes.length} accent="#6f42c1" /></div>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <ul className="nav nav-pills gap-1 flex-nowrap overflow-auto">
          {TABS.map((t) => (
            <li className="nav-item" key={t.key}>
              <button type="button" className={`nav-link py-1 px-3 ${tab === t.key ? 'active' : 'text-muted'}`} onClick={() => setTab(t.key)}>{t.label}</button>
            </li>
          ))}
        </ul>
      </div>

      {tab === 'all' && (
        visible.length === 0
          ? <EmptyState icon={<FaComments />} title="No reviews yet" message="Customer reviews will appear here." />
          : <div className="d-flex flex-column gap-3">{visible.map(renderReview)}</div>
      )}

      {tab === 'flagged' && (
        flaggedReviews.length === 0
          ? <EmptyState icon={<FaCheckCircle />} title="No flagged reviews" message="Great — nothing needs your attention right now." />
          : <div className="d-flex flex-column gap-3">{flaggedReviews.map(renderReview)}</div>
      )}

      {tab === 'disputes' && (
        disputes.length === 0
          ? <EmptyState icon={<FaGavel />} title="No open disputes" message="There are no disputes awaiting resolution." />
          : (
            <div className="d-flex flex-column gap-3">
              {disputes.map((b) => (
                <div key={b.id} className="card card-plain p-3">
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-2">
                    <div>
                      <div className="fw-semibold small" style={{ color: 'var(--text)' }}>Booking {b.bookingId}</div>
                      <div className="text-muted small">{userName(b.customerId)} · {catalog.providerNameForBooking(b)}</div>
                    </div>
                    <span className={`badge ${b.dispute?.status === 'resolved' ? 'bg-soft-success' : 'bg-soft-danger'}`}>
                      {b.dispute?.status === 'resolved' ? 'Resolved' : 'Open'}
                    </span>
                  </div>
                  {b.dispute?.reason && <p className="small mb-2 mt-2">{b.dispute.reason}</p>}
                  {b.dispute?.status !== 'resolved' && (
                    <div className="text-end">
                      <button type="button" className="btn btn-sm btn-brand" onClick={() => onResolve(b)}>
                        <FaCheckCircle className="me-1" size={11} /> Mark resolved
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
      )}
    </div>
  )
}

export default AdminReviewsPage
