import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { FaClipboardList, FaEnvelope, FaUserPlus, FaSignInAlt, FaRoute } from 'react-icons/fa'
import { useAuth } from '../../hooks/useAuth'

const NAV = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/how-it-works', label: 'How It Works' },
]

const PublicNavbar = () => {
  const [open, setOpen] = useState(false)
  const { isAuthenticated, role } = useAuth()
  const dash = role ? `/${role}/dashboard` : null

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white sticky-top border-bottom shadow-sm">
      <div className="container-lg">
        <Link to="/" className="navbar-brand fw-bold d-flex align-items-center gap-2">
          <span
            className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-2"
            style={{ width: 36, height: 36 }}
          >
            <FaClipboardList size={16} />
          </span>
          Service<span className="text-primary">Sprint</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          aria-controls="publicNavbar"
          aria-expanded={open}
          aria-label="Toggle navigation"
          onClick={() => setOpen((o) => !o)}
        >
          <span className="navbar-toggler-icon" />
        </button>

        <div className={clsx('collapse navbar-collapse', open && 'show')} id="publicNavbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 gap-lg-1">
            {NAV.map((n) => (
              <li className="nav-item" key={n.to}>
                <NavLink
                  to={n.to}
                  end={n.to === '/'}
                  className={({ isActive }) =>
                    clsx('nav-link fw-semibold rounded-2 px-3', isActive ? 'text-primary active' : 'link-dark')
                  }
                  onClick={() => setOpen(false)}
                >
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <div className="d-flex align-items-center gap-2 mt-2 mt-lg-0 flex-wrap">
            {isAuthenticated && dash ? (
              <>
                <Link to={dash} className="btn btn-outline-primary btn-sm rounded-pill" onClick={() => setOpen(false)}>
                  <FaRoute className="me-1" size={11} /> Dashboard
                </Link>
                <Link to="/profile" className="btn btn-primary btn-sm rounded-pill" onClick={() => setOpen(false)}>
                  My Profile
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline-primary btn-sm rounded-pill" onClick={() => setOpen(false)}>
                  <FaSignInAlt className="me-1" size={11} /> Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm rounded-pill" onClick={() => setOpen(false)}>
                  <FaUserPlus className="me-1" size={11} /> Sign Up
                </Link>
                <Link to="/contact" className="btn btn-primary btn-sm rounded-pill text-light" onClick={() => setOpen(false)}>
                  <FaEnvelope className="me-1" size={11} /> Contact
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default PublicNavbar