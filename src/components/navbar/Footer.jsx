import { Link } from 'react-router-dom'
import { FaClipboardList, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope } from 'react-icons/fa'
import { CATEGORIES } from '../../data/categories'

const PAGES = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Browse Services' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/book', label: 'Book a Service' },
  { to: '/contact', label: 'Contact Us' },
  { to: '/login', label: 'Login' },
  { to: '/register', label: 'Create Account' },
]

const DASHBOARDS = [
  { to: '/customer/dashboard', label: 'Customer Dashboard' },
  { to: '/professional/dashboard', label: 'Professional Dashboard' },
  { to: '/agency/dashboard', label: 'Agency Dashboard' },
  { to: '/admin/dashboard', label: 'Admin Dashboard' },
]

const Footer = () => (
  <footer className="footer-main pt-5 pb-3 mt-5">
    <div className="container-lg">
      <div className="row g-4">
        <div className="col-12 col-md-4">
          <div className="d-flex align-items-center gap-2 mb-2 fw-bold text-white" style={{ fontSize: '1.1rem' }}>
            <FaClipboardList /> Service<span style={{ color: '#7ab8ff' }}>Sprint</span>
          </div>
          <p className="mb-3" style={{ maxWidth: 320 }}>
            Find trusted professionals for all your home services — plumbing, electrical, cleaning and more, backed by verified providers.
          </p>
          <div className="d-flex gap-2">
            {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
              <span key={i} className="d-inline-flex align-items-center justify-content-center" style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(255,255,255,0.08)' }}>
                <Icon size={14} />
              </span>
            ))}
          </div>
        </div>
        <div className="col-6 col-md-2">
          <h6 className="text-white fw-semibold mb-3">Pages</h6>
          <ul className="list-unstyled d-flex flex-column gap-2">
            {PAGES.map((p) => (
              <li key={p.to}><Link to={p.to}>{p.label}</Link></li>
            ))}
          </ul>
        </div>
        <div className="col-6 col-md-2">
          <h6 className="text-white fw-semibold mb-3">Dashboards</h6>
          <ul className="list-unstyled d-flex flex-column gap-2">
            {DASHBOARDS.map((d) => (
              <li key={d.to}><Link to={d.to}>{d.label}</Link></li>
            ))}
          </ul>
        </div>
        <div className="col-6 col-md-2">
          <h6 className="text-white fw-semibold mb-3">Categories</h6>
          <ul className="list-unstyled d-flex flex-column gap-2">
            {CATEGORIES.map((c) => (
              <li key={c.id}><Link to={`/services?category=${c.id}`}>{c.name}</Link></li>
            ))}
          </ul>
        </div>
        <div className="col-6 col-md-2">
          <h6 className="text-white fw-semibold mb-3">Contact</h6>
          <ul className="list-unstyled d-flex flex-column gap-2">
            <li><FaMapMarkerAlt className="me-2" /> 2nd Floor, Service Tower, Connaught Place, Delhi</li>
            <li><FaPhoneAlt className="me-2" /> 1800-123-456 (Toll Free)</li>
            <li><FaEnvelope className="me-2" /> support@servicesprint.in</li>
          </ul>
        </div>
      </div>
      <hr style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      <div className="d-flex flex-wrap justify-content-between gap-2">
        <span>© 2026 ServiceSprint. Frontend college project demo — all data is simulated locally.</span>
        <span>Made with React · Redux · Bootstrap</span>
      </div>
    </div>
  </footer>
)

export default Footer