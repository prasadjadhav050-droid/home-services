import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { FaBell, FaRegBell, FaCheckDouble, FaInbox } from 'react-icons/fa'
import { useNotifications } from '../../hooks/useNotifications'
import { useAuth } from '../../hooks/useAuth'
import { markAllRead, markRead } from '../../features/notifications/notificationSlice'
import { NOTIF_ICONS } from '../../features/notifications/notificationSlice'
import { timeAgo } from '../../utils/format'
import { icons } from '../../utils/iconMap'

const NotificationDropdown = () => {
  const { list, unread } = useNotifications()
  const { role } = useAuth()
  const dispatch = useDispatch()
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const openAll = (n) => {
    dispatch(markRead(n.id))
    window.open(`/${role}/notifications`, '_blank', 'noopener')
  }

  return (
    <div className="position-relative" ref={ref}>
      <button type="button" className="btn btn-ghost btn-icon" onClick={() => setOpen((o) => !o)}>
        {unread ? <FaBell className="text-warning" /> : <FaRegBell />}
        {unread > 0 && (
          <span className="badge bg-danger rounded-pill position-absolute" style={{ top: 0, right: 0, fontSize: '0.6rem' }}>
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>
      {open && (
        <div
          className="dropdown-menu show shadow"
          style={{ right: 0, left: 'auto', width: 340, maxHeight: 420, overflowY: 'auto', borderRadius: 14, border: '1px solid #eef1f6' }}
        >
          <div className="d-flex align-items-center justify-content-between px-3 py-2" style={{ borderBottom: '1px solid #eef1f6' }}>
            <strong className="small">Notifications</strong>
            <button type="button" className="btn btn-sm btn-soft-brand" onClick={() => dispatch(markAllRead(list[0]?.userId))}>
              <FaCheckDouble /> Mark all read
            </button>
          </div>
          {!list.length && (
            <div className="p-4 text-center text-muted small">
              <FaInbox size={28} className="mb-2" />
              <div>No notifications yet</div>
            </div>
          )}
          {list.slice(0, 12).map((n) => {
            const Icon = icons[NOTIF_ICONS[n.type]] || icons.FaBell
            return (
              <div key={n.id} className={`notif-item d-flex gap-2 ${n.read ? '' : 'unread'}`}>
                <span className="mt-1"><Icon className="text-primary" /></span>
                <div className="flex-grow-1" onClick={() => openAll(n)} style={{ cursor: 'pointer' }} title="Open in new tab">
                  <div className="small fw-semibold">{n.title}</div>
                  <div className="small text-muted" style={{ fontSize: '0.76rem' }}>{n.message}</div>
                  <div className="small text-muted" style={{ fontSize: '0.7rem' }}>{timeAgo(n.date)}</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown