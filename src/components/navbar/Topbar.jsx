import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaBars, FaChevronDown, FaClipboardList, FaSignOutAlt, FaUserCog } from 'react-icons/fa'
import { useDispatch } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import { useAuth } from '../../hooks/useAuth'
import Avatar from '../common/Avatar'
import NotificationDropdown from '../common/NotificationDropdown'
import TopbarSearch from './TopbarSearch'

const ROLE_LABEL = { customer: 'Customer', professional: 'Professional', agency: 'Agency', admin: 'Admin' }

const Topbar = ({ onToggleSidebar }) => {
  const { user, role } = useAuth()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [menu, setMenu] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const onClick = (e) => { if (ref.current && !ref.current.contains(e.target)) setMenu(false) }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  return (
    <header className="topbar d-flex align-items-center px-3 px-lg-4">
      <div className="d-flex align-items-center gap-3 w-100">
        <button type="button" className="btn btn-ghost btn-icon d-xl-none" onClick={onToggleSidebar} aria-label="Menu">
          <FaBars />
        </button>
        <Link to={role ? `/${role}/dashboard` : '/'} className="brand d-flex align-items-center gap-2 d-xl-none">
          <span className="stat-icon" style={{ background: 'linear-gradient(135deg, #1a56db, #5b8def)', color: '#fff', width: 36, height: 36, borderRadius: 11, boxShadow: '0 4px 10px rgba(26,86,219,0.28)' }}>
            <FaClipboardList />
          </span>
          <span style={{ fontSize: '1.05rem', lineHeight: 1 }}>Service<span className="text-primary">Sprint</span></span>
        </Link>
        <TopbarSearch />
        <div className="ms-auto d-flex align-items-center gap-2">
          <NotificationDropdown />
          <div className="position-relative" ref={ref}>
            <button type="button" className="btn btn-ghost topbar-user d-flex align-items-center gap-2" onClick={() => setMenu((m) => !m)}>
              <Avatar name={user?.name} id={user?.id} size="sm" />
              <div className="d-none d-sm-block text-start lh-1">
                <div className="small fw-semibold">{user?.name}</div>
                <div className="text-muted" style={{ fontSize: '0.68rem' }}>{ROLE_LABEL[role]}</div>
              </div>
              <FaChevronDown size={10} className="text-muted d-none d-sm-block" />
            </button>
            {menu && (
              <div className="dropdown-menu show shadow" style={{ right: 0, left: 'auto', borderRadius: 12, minWidth: 200, padding: 6 }}>
                <div className="px-3 py-2 small text-muted">
                  <strong className="text-dark d-block">{user?.name}</strong>
                  {user?.email}
                </div>
                <hr className="dropdown-divider" />
                {role !== 'admin' && (
                  <Link to={`/${role}/profile`} className="dropdown-item small" onClick={() => setMenu(false)}>
                    <FaUserCog className="me-2" /> My Profile
                  </Link>
                )}
                <Link to={`/${role}/dashboard`} className="dropdown-item small" onClick={() => setMenu(false)}>
                  <FaClipboardList className="me-2" /> Dashboard
                </Link>
                <hr className="dropdown-divider" />
                <button
                  type="button"
                  className="dropdown-item small text-danger"
                  onClick={() => { dispatch(logout()); navigate('/'); setMenu(false) }}
                >
                  <FaSignOutAlt className="me-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Topbar