import { NavLink, Link } from 'react-router-dom'
import { FaClipboardList, FaTimes } from 'react-icons/fa'
import { icons } from '../../utils/iconMap'

const Sidebar = ({ open, onClose, brand, items }) => {
  return (
    <>
      {open && <div className="sidebar-backdrop d-xl-none" onClick={onClose} />}
      <aside className={`dash-sidebar ${open ? 'open' : ''}`}>
        <div className="d-flex align-items-center justify-content-between px-3 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link to="/" className="side-brand d-flex align-items-center gap-2" style={{ textDecoration: 'none' }}>
            {brand || (
              <>
                <span className="stat-icon" style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', width: 34, height: 34, borderRadius: 10 }}>
                  <FaClipboardList />
                </span>
                <span>Service<span style={{ color: '#7ab8ff' }}>Sprint</span></span>
              </>
            )}
          </Link>
          <button type="button" className="btn btn-link p-0 text-light d-xl-none" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <nav className="side-nav pb-4">
          {items.map((section, si) => (
            <div key={si}>
              {section.label && <div className="side-section-label">{section.label}</div>}
              {section.items.map((item) => {
                const Icon = icons[item.icon] || icons.FaThLarge
                return (
                  <NavLink key={item.to} to={item.to} end={item.end} onClick={onClose}>
                    <span className="side-ico"><Icon className="icon" /></span>
                    <span className="flex-grow-1">{item.label}</span>
                    {item.badge ? (
                      <span className="badge bg-danger rounded-pill" style={{ fontSize: '0.62rem' }}>{item.badge}</span>
                    ) : null}
                  </NavLink>
                )
              })}
            </div>
          ))}
        </nav>
        <div className="position-absolute bottom-0 start-0 end-0 p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="small text-light-50 text-white-50 px-1" style={{ fontSize: '0.72rem' }}>
            <FaClipboardList className="me-1" /> ServiceSprint v2.0 · Frontend Demo
          </div>
        </div>
      </aside>
    </>
  )
}

export default Sidebar