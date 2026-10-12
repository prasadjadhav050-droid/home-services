import { FaCalendarAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa'
import { formatMoney, formatDate } from '../../utils/format'
import { CATEGORIES } from '../../data/categories'
import { icons } from '../../utils/iconMap'
import StatusBadge from '../common/StatusBadge'

const BookingCard = ({ booking, service, providerName, actions, onClick, showMeta = true }) => {
  if (!booking) return null
  const cat = CATEGORIES.find((c) => c.id === service?.category || c.id === booking.category)
  const Icon = icons[service?.img] || icons.FaTools
  return (
    <div className={`card card-plain p-3 h-100 ${onClick ? 'card-hover' : ''}`} onClick={onClick} role={onClick ? 'button' : undefined}>
      <div className="d-flex justify-content-between align-items-start mb-2">
        <div className="d-flex align-items-center gap-2">
          <span className="stat-icon" style={{ background: `${service?.color || '#0d6efd'}1a`, color: service?.color || '#0d6efd' }}>
            <Icon />
          </span>
          <div>
            <div className="fw-semibold small">{booking.bookingId}</div>
            <div className="text-muted small">{service?.name || cat?.name || 'Service'}</div>
          </div>
        </div>
        <StatusBadge status={booking.status} />
      </div>
      {showMeta && (
        <div className="text-muted small mb-3" style={{ fontSize: '0.78rem', lineHeight: 1.8 }}>
          <div className="d-flex align-items-center gap-2">
            <FaCalendarAlt size={11} /> {formatDate(booking.date)}
            {booking.time && <><FaClock size={11} /> {booking.time}</>}
          </div>
          <div className="d-flex align-items-center gap-2">
            <FaMapMarkerAlt size={11} /> {booking.location?.city} · by {providerName || '—'}
          </div>
        </div>
      )}
      <div className="d-flex justify-content-between align-items-center border-top pt-2">
        <span className="money text-primary">{formatMoney(booking.price)}</span>
        {actions && <div className="d-flex gap-2 flex-wrap justify-content-end">{actions}</div>}
      </div>
    </div>
  )
}

export default BookingCard