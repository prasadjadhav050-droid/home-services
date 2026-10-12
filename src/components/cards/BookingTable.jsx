import { formatMoney, formatDate } from '../../utils/format'
import StatusBadge from '../common/StatusBadge'
import { CATEGORIES } from '../../data/categories'
import { icons } from '../../utils/iconMap'

const BookingTable = ({ bookings, getService, getProvider, actionsFor, empty }) => {
  const rows = Array.isArray(bookings) ? bookings : []
  if (!rows.length) {
    return empty || <div className="text-muted text-center py-5">No bookings.</div>
  }
  return (
    <>
      <div className="table-responsive card card-plain p-0 overflow-hidden">
        <table className="table table-hover mb-0">
          <thead>
            <tr>
              <th>Booking</th>
              <th>Service</th>
              <th>Provider</th>
              <th>Schedule</th>
              <th>Location</th>
              <th>Amount</th>
              <th>Payment</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((b) => {
              const svc = getService?.(b.serviceId)
              const provider = getProvider?.(b)
              return (
                <tr key={b.id} className="table-row">
                  <td><span className="fw-semibold small">{b.bookingId}</span></td>
                  <td>
                    <div className="fw-semibold small">{svc?.name || CATEGORIES.find((c) => c.id === b.category)?.name}</div>
                    <div className="text-muted" style={{ fontSize: '0.72rem' }}>{formatDate(b.date)}{b.time && ` · ${b.time}`}</div>
                  </td>
                  <td className="small">{provider || '—'}</td>
                  <td className="small">{b.preferredTime || '—'}</td>
                  <td className="small">{b.location?.city}</td>
                  <td className="money">{formatMoney(b.price)}</td>
                  <td>
                    <span className={`badge ${b.paymentStatus === 'paid' ? 'bg-soft-success' : b.paymentStatus === 'pending' ? 'bg-soft-warning' : 'bg-soft-secondary'}`}>
                      {b.paymentStatus}
                    </span>
                  </td>
                  <td><StatusBadge status={b.status} /></td>
                  <td>
                    {actionsFor && (
                      <div className="d-flex gap-1 justify-content-end">{actionsFor(b)}</div>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <div className="d-md-none d-grid gap-3">
        {rows.map((b) => {
          const svc = getService?.(b.serviceId)
          const provider = getProvider?.(b)
          const Icon = icons[svc?.img] || icons.FaTools
          return (
            <div key={b.id} className="card card-plain p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-semibold small">{b.bookingId}</span>
                <StatusBadge status={b.status} />
              </div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="stat-icon" style={{ background: `${svc?.color || '#0d6efd'}1a`, color: svc?.color || '#0d6efd' }}>
                  <Icon />
                </span>
                <div>
                  <div className="fw-semibold small">{svc?.name}</div>
                  <div className="text-muted small">{provider} · {b.location?.city}</div>
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="money text-primary">{formatMoney(b.price)}</span>
                  <span className={`badge ms-2 ${b.paymentStatus === 'paid' ? 'bg-soft-success' : 'bg-soft-warning'}`}>{b.paymentStatus}</span>
                </div>
                {actionsFor && <div className="d-flex gap-1">{actionsFor(b)}</div>}
              </div>
            </div>
          )
        })}
      </div>
    </>
  )
}

export default BookingTable