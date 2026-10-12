import { useDispatch } from 'react-redux'
import { FaCheckDouble, FaTrash, FaInbox, FaBell } from 'react-icons/fa'
import { useNotifications } from '../../hooks/useNotifications'
import { markAllRead, markRead, clearForUser } from '../../features/notifications/notificationSlice'
import PageHeader from './PageHeader'
import { NOTIF_ICONS } from '../../features/notifications/notificationSlice'
import { icons } from '../../utils/iconMap'
import { timeAgo } from '../../utils/format'

const NotificationsView = ({ title = 'Notifications', sub = 'Stay up to date with your activity.' }) => {
  const dispatch = useDispatch()
  const { list, unread } = useNotifications()
  const userId = list[0]?.userId

  return (
    <div>
      <PageHeader
        title={title}
        subtitle={sub}
        actions={
          <>
            <button type="button" className="btn btn-outline-brand btn-sm btn-pill" onClick={() => dispatch(markAllRead(userId))}><FaCheckDouble className="me-1" size={11} /> Mark all read</button>
            <button type="button" className="btn btn-light border btn-sm btn-pill" onClick={() => dispatch(clearForUser(userId))}><FaTrash className="me-1" size={11} /> Clear all</button>
          </>
        }
      />
      <div className="card card-plain p-2" style={{ maxWidth: 760 }}>
        {!list.length && (
          <div className="text-center py-5 text-muted">
            <FaInbox size={36} className="mb-2" />
            <div>No notifications yet.</div>
          </div>
        )}
        {list.map((n) => {
          const Icon = icons[NOTIF_ICONS[n.type]] || FaBell
          return (
            <div key={n.id} className={`notif-item d-flex gap-3 ${n.read ? '' : 'unread'}`} style={{ borderRadius: 10 }} onClick={() => dispatch(markRead(n.id))}>
              <span className="stat-icon" style={{ background: n.read ? '#eef1f6' : '#e8f1ff', color: n.read ? '#6b7280' : '#0d6efd', width: 40, height: 40, flex: '0 0 40px' }}>
                <Icon />
              </span>
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between">
                  <span className="fw-semibold small">{n.title}</span>
                  <span className="text-muted small">{timeAgo(n.date)}</span>
                </div>
                <div className="small text-muted">{n.message}</div>
              </div>
              {!n.read && <span className="bg-primary rounded-circle align-self-center" style={{ width: 8, height: 8 }} />}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default NotificationsView