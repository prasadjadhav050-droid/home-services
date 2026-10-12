import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FaChevronDown, FaArrowRight, FaInbox } from 'react-icons/fa'
import Avatar from './Avatar'

const StatDropdown = ({ icon, label, value, accent = '#0d6efd', sub, to, items = [], sections = [], variant = 'card' }) => {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const groups = sections.length ? sections : [{ title: null, rows: items }]
  const hasRows = groups.some((g) => g.rows.length)

  return (
    <div className="position-relative h-100" ref={ref}>
      {variant === 'tile' ? (
        <div
          className={`overview-tile ${open ? 'active' : ''}`}
          onClick={() => setOpen((o) => !o)}
          role="button"
          aria-expanded={open}
        >
          <span className="overview-tile-icon" style={{ background: `${accent}1a`, color: accent }}>
            {icon}
          </span>
          <span className="overview-tile-value">{value}</span>
          <span className="overview-tile-label">{label}</span>
          {sub && <span className="overview-tile-sub">{sub}</span>}
        </div>
      ) : (
        <div
          className={`stat-card d-flex align-items-center gap-3 ${open ? 'border-primary' : ''}`}
          style={{ cursor: 'pointer', border: open ? '2px solid var(--brand)' : '2px solid transparent' }}
          onClick={() => setOpen((o) => !o)}
          role="button"
          aria-expanded={open}
        >
          <div className="stat-icon" style={{ background: `${accent}1a`, color: accent }}>
            {icon}
          </div>
          <div className="d-flex flex-column flex-grow-1">
            <span className="text-muted small fw-semibold">{label}</span>
            <span className="fs-5 fw-bold money">{value}</span>
            {sub && <span className="small text-muted">{sub}</span>}
          </div>
          <FaChevronDown size={12} className="text-muted" style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
        </div>
      )}

      {open && (
        <div className="dropdown-menu show shadow p-2" style={{ left: 0, top: '100%', right: 0, borderRadius: 14, zIndex: 20, maxHeight: 340, overflowY: 'auto', marginTop: 4 }}>
          {!hasRows && (
            <div className="text-center py-4 text-muted small">
              <FaInbox size={24} className="mb-1" />
              <div>No records yet.</div>
            </div>
          )}
          {groups.map((group, gi) => (
            <div key={group.title || gi}>
              {group.title && (
                <div className="small fw-semibold text-muted px-2 pt-2 pb-1" style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: 0.4 }}>
                  {group.title}
                </div>
              )}
              {group.rows.map((it) => (
                <Link
                  key={it.key || it.name}
                  to={to || '#'}
                  className="d-flex align-items-center gap-2 px-2 py-1 rounded-2 text-decoration-none"
                  style={{ color: 'inherit' }}
                >
                  {it.avatar ? (
                    <Avatar name={it.avatar} id={it.avatarId} size="sm" />
                  ) : it.icon ? (
                    <span className="stat-icon" style={{ width: 30, height: 30, fontSize: '0.7rem', background: `${accent}1a`, color: accent }}>
                      {it.icon}
                    </span>
                  ) : null}
                  <div className="flex-grow-1 lh-sm">
                    <div className="fw-semibold small" style={{ color: 'var(--text)' }}>{it.name}</div>
                    {it.meta && <div className="text-muted small" style={{ fontSize: '0.72rem' }}>{it.meta}</div>}
                  </div>
                  {it.right && <span className="small fw-semibold text-truncate" style={{ maxWidth: 90 }}>{it.right}</span>}
                </Link>
              ))}
            </div>
          ))}
          {to && (
            <Link
              to={to}
              className="d-flex align-items-center justify-content-center gap-1 small fw-semibold py-2 mt-1"
              style={{ color: 'var(--brand)', borderTop: '1px solid #eef1f6' }}
            >
              View all <FaArrowRight size={10} />
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default StatDropdown