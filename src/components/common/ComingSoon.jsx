import { Link, useLocation } from 'react-router-dom'
import { FaTools, FaArrowLeft, FaClipboardList } from 'react-icons/fa'

const LABELS = {
  reports: 'Reports',
  services: 'Services',
  bookings: 'Bookings',
  payments: 'Payments',
  reviews: 'Reviews & Disputes',
  notifications: 'Notifications',
  catalog: 'Catalog',
  team: 'Team',
  professionals: 'Professionals',
  users: 'Users',
}

const ComingSoon = () => {
  const { pathname } = useLocation()
  const role = pathname.split('/').filter(Boolean)[0] || ''
  const seg = pathname.split('/').filter(Boolean).pop() || ''
  const title = LABELS[seg] || seg.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) || 'This section'

  return (
    <div className="d-flex justify-content-center py-5">
      <div className="card border-0 shadow-sm text-center p-4 p-md-5" style={{ maxWidth: 520 }}>
        <span
          className="mx-auto mb-3 stat-icon d-inline-flex align-items-center justify-content-center"
          style={{ background: '#eef4ff', color: '#0d6efd', width: 72, height: 72, fontSize: '1.8rem', borderRadius: 18 }}
        >
          <FaTools />
        </span>
        <h4 className="fw-bold mb-1">{title}</h4>
        <p className="text-muted mb-4">
          This section is part of the ServiceSprint demo roadmap and is not built yet.
        </p>
        <div className="d-flex gap-2 justify-content-center flex-wrap">
          <Link to={`/${role}/dashboard`} className="btn btn-brand">
            <FaClipboardList className="me-1" /> Back to Dashboard
          </Link>
          <Link to="/" className="btn btn-light border">
            <FaArrowLeft className="me-1" /> Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ComingSoon
