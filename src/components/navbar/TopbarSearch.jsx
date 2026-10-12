import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaSearch, FaTools, FaClipboardList, FaUserTie, FaUsers, FaBuilding, FaArrowRight } from 'react-icons/fa'
import { selectServices } from '../../features/services/serviceSlice'
import { selectBookings } from '../../features/bookings/bookingSlice'
import { selectAllUsers } from '../../features/users/userSlice'
import { useAuth } from '../../hooks/useAuth'

const TopbarSearch = () => {
  const navigate = useNavigate()
  const { role } = useAuth()
  const services = useSelector(selectServices)
  const bookings = useSelector(selectBookings)
  const users = useSelector(selectAllUsers)

  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const ref = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  const results = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (term.length < 1) return []
    const groups = []
    const bkTgt = role === 'admin' ? '/admin/bookings' : role === 'professional' ? '/professional/jobs' : '/customer/bookings'
    const svc = services
      .filter((s) => s.name.toLowerCase().includes(term))
      .slice(0, 5)
      .map((s) => ({ key: s.id, type: 'service', label: s.name, to: `/services/${s.id}`, meta: s.category, icon: <FaTools /> }))
    const bks = bookings
      .filter((b) => b.bookingId.toLowerCase().includes(term))
      .slice(0, 4)
      .map((b) => ({
        key: b.id,
        type: 'booking',
        label: b.bookingId,
        to: bkTgt,
        meta: `#${b.bookingId} · ${b.status}`,
        icon: <FaClipboardList />,
      }))
    const usrs = users
      .filter((u) => u.name.toLowerCase().includes(term))
      .slice(0, 5)
      .map((u) => ({
        key: u.id,
        type: 'user',
        label: u.name,
        to: u.role === 'admin' ? '/admin/dashboard' : `/${u.role}/dashboard`,
        meta: `${u.role === 'agency' ? 'Agency' : u.role === 'professional' ? 'Professional' : 'Customer'} · ${u.location || '—'}`,
        icon: u.role === 'agency' ? <FaBuilding /> : u.role === 'professional' ? <FaUserTie /> : <FaUsers />,
      }))
    if (svc.length) groups.push({ title: 'Services', items: svc })
    if (bks.length) groups.push({ title: 'Bookings', items: bks })
    if (usrs.length) groups.push({ title: 'Users', items: usrs })
    return groups
  }, [q, services, bookings, users, role])

  const flat = useMemo(() => results.flatMap((g) => g.items), [results])

  const go = (item) => {
    setOpen(false)
    setQ('')
    setActive(0)
    navigate(item.to)
  }

  const onKeyDown = (e) => {
    if (!flat.length) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => (a + 1) % flat.length) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => (a - 1 + flat.length) % flat.length) }
    else if (e.key === 'Enter') { e.preventDefault(); go(flat[active]) }
    else if (e.key === 'Escape') { setOpen(false) }
  }

  const showPanel = open && q.trim().length > 0

  return (
    <div className="flex-grow-1 d-none d-md-block position-relative" ref={ref}>
      <div className="topbar-search input-group-icon" style={{ maxWidth: 380 }}>
        <FaSearch className="input-icon text-muted" />
        <input
          ref={inputRef}
          type="search"
          className="form-control form-control-sm w-100"
          placeholder="Search services, bookings, users…"
          value={q}
          onFocus={() => setOpen(true)}
          onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(0) }}
          onKeyDown={onKeyDown}
        />
        {q && (
          <button type="button" className="topbar-search-clear" onClick={() => { setQ(''); setOpen(false); inputRef.current?.focus() }} aria-label="Clear search">
            &times;
          </button>
        )}
      </div>

      {showPanel && (
        <div className="dropdown-menu show shadow p-2" style={{ left: 12, top: 'calc(100% + 6px)', width: 380, maxHeight: 420, overflowY: 'auto', borderRadius: 14, zIndex: 30 }}>
          {flat.length === 0 && (
            <div className="text-center py-4 text-muted small">No matches for “{q}”</div>
          )}
          {results.map((group) => (
            <div key={group.title}>
              <div className="small fw-semibold text-muted px-2 pt-2 pb-1" style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: 0.4 }}>
                {group.title}
              </div>
              {group.items.map((item) => {
                const i = flat.indexOf(item)
                const isActive = i === active
                return (
                  <div
                    key={item.key}
                    className="d-flex align-items-center gap-2 px-2 py-2 rounded-2 text-decoration-none"
                    style={{ cursor: 'pointer', background: isActive ? '#eef4ff' : 'transparent', color: 'inherit' }}
                    onMouseEnter={() => setActive(i)}
                    onClick={() => go(item)}
                  >
                    <span className="stat-icon" style={{ width: 30, height: 30, fontSize: '0.72rem', background: '#e8f1ff', color: '#0d6efd' }}>
                      {item.icon}
                    </span>
                    <div className="flex-grow-1 lh-sm">
                      <div className="fw-semibold small" style={{ color: 'var(--text)' }}>{item.label}</div>
                      {item.meta && <div className="text-muted small text-capitalize" style={{ fontSize: '0.72rem' }}>{item.meta}</div>}
                    </div>
                    <FaArrowRight size={10} className="text-muted" />
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TopbarSearch