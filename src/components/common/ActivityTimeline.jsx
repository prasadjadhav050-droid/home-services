import { Link } from 'react-router-dom'
import { FaBell } from 'react-icons/fa'
import { icons } from '../../utils/iconMap'
import { NOTIF_ICONS } from '../../features/notifications/notificationSlice'
import { timeAgo } from '../../utils/format'

const ActivityTimeline = ({ items = [], to = '/customer/notifications' }) => (
  <div className="card card-plain p-3">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h6 className="fw-bold m-0 d-flex align-items-center gap-2"><FaBell className="text-primary" /> Recent activity</h6>
      <Link to={to} className="small">View all</Link>
    </div>
    {items.length ? (
      <div className="activity-timeline">
        {items.map((n) => {
          const Icon = icons[NOTIF_ICONS[n.type]] || FaBell
          return (
            <div key={n.id} className="activity-item">
              <span className={`activity-dot ${n.read ? '' : 'unread'}`} />
              <div className="activity-body">
                <div className="d-flex align-items-center gap-2">
                  <Icon className="text-primary" size={12} />
                  <span className="fw-semibold small">{n.title}</span>
                </div>
                <div className="text-muted small activity-msg">{n.message}</div>
                <div className="text-muted" style={{ fontSize: '0.7rem' }}>{timeAgo(n.date)}</div>
              </div>
            </div>
          )
        })}
      </div>
    ) : (
      <div className="text-muted small text-center py-3">No recent activity.</div>
    )}
  </div>
)

export default ActivityTimeline
