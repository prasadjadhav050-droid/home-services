import { Link } from 'react-router-dom'
import { FaSearch, FaPlus, FaCalendarAlt, FaArrowRight } from 'react-icons/fa'
import Avatar from './Avatar'
import { formatDate, formatMoney } from '../../utils/format'

const WelcomeBanner = ({ user, next, nextService, nextProvider }) => {
  const firstName = user?.name?.split(' ')[0] || 'there'
  return (
    <div className="welcome-banner mb-4">
      <span className="welcome-blob welcome-blob-1" />
      <span className="welcome-blob welcome-blob-2" />
      <div className="d-flex align-items-center gap-3 flex-wrap position-relative">
        <Avatar name={user?.name} size="lg" id={user?.id} />
        <div className="flex-grow-1">
          <h4 className="fw-bold text-white mb-1">Welcome back, {firstName} 👋</h4>
          <div className="text-white-50 small">Here's what's happening with your home services today.</div>
        </div>
        <div className="d-flex gap-2 flex-wrap">
          <Link to="/services" className="btn btn-light btn-pill fw-semibold">
            <FaSearch className="me-1" size={11} /> Browse services
          </Link>
          <Link to="/book" className="btn btn-white-outline btn-pill fw-semibold">
            <FaPlus className="me-1" size={11} /> Book a service
          </Link>
        </div>
      </div>

      {next ? (
        <Link to={`/customer/tracking/${next.id}`} className="welcome-next mt-3 d-flex align-items-center gap-3 position-relative">
          <span className="welcome-next-ico"><FaCalendarAlt /></span>
          <div className="flex-grow-1 min-w-0">
            <div className="text-white-50" style={{ fontSize: '0.72rem' }}>
              Next appointment · {formatDate(next.date)} · {next.time || next.preferredTime}
            </div>
            <div className="fw-semibold text-white text-truncate">
              {nextService?.name || 'Your service'} · {nextProvider || '—'} · {formatMoney(next.price)}
            </div>
          </div>
          <span className="welcome-next-cta">Track <FaArrowRight size={10} /></span>
        </Link>
      ) : (
        <Link to="/services" className="welcome-next mt-3 d-flex align-items-center gap-3 position-relative">
          <span className="welcome-next-ico"><FaCalendarAlt /></span>
          <div className="flex-grow-1">
            <div className="text-white-50" style={{ fontSize: '0.72rem' }}>No upcoming appointments</div>
            <div className="fw-semibold text-white">Book your next service in seconds</div>
          </div>
          <span className="welcome-next-cta">Browse <FaArrowRight size={10} /></span>
        </Link>
      )}
    </div>
  )
}

export default WelcomeBanner
