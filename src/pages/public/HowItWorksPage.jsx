import { Link } from 'react-router-dom'
import { FaUser, FaBriefcase, FaBuilding, FaSearch, FaTruck, FaCheckCircle, FaStar, FaShieldAlt, FaArrowRight } from 'react-icons/fa'

const ROLES = [
  {
    key: 'customer', icon: <FaUser />, color: '#0d6efd', title: 'Customers',
    text: 'Search services, book in minutes, track your professional live and pay securely on completion.',
    points: ['Book instantly or schedule for later', 'Live status tracking', 'Rate & review after service'],
    cta: { label: 'Sign up as Customer', to: '/register/customer' },
  },
  {
    key: 'professional', icon: <FaBriefcase />, color: '#20c997', title: 'Professionals',
    text: 'Get discovered by customers, accept requests you can fulfill, manage your schedule and track earnings.',
    points: ['Accept or reject requests', 'Set working hours & blocked slots', 'Weekly payouts & earning reports'],
    cta: { label: 'Join as Professional', to: '/register/professional' },
  },
  {
    key: 'agency', icon: <FaBuilding />, color: '#7a5af8', title: 'Agencies',
    text: 'Onboard your team, publish services, assign jobs to the right professionals and grow your revenue.',
    points: ['Manage your professional team', 'Skill & availability based assignment', 'Revenue, payouts & reports'],
    cta: { label: 'Register Your Agency', to: '/register/agency' },
  },
]

const STEPS = [
  { n: 1, icon: <FaSearch />, title: 'Discover', text: 'Browse categories, compare ratings and prices, pick the right service.' },
  { n: 2, icon: <FaTruck />, title: 'Book & Track', text: 'Choose date, time and location, pay your way and track live.' },
  { n: 3, icon: <FaCheckCircle />, title: 'Get Done & Rate', text: 'Professional completes the job, you pay on completion and rate them.' },
]

const HowItWorksPage = () => (
  <div>
    <section className="hero py-5" style={{ paddingBottom: 70 }}>
      <div className="container-lg text-center">
        <h1 className="fw-bold display-5">How ServiceSprint Works</h1>
        <p style={{ color: '#cfe0ff', maxWidth: 640, margin: '12px auto 0' }}>
          One platform that connects customers, independent professionals and agencies — with verification, tracking and reviews built in.
        </p>
      </div>
    </section>

    <div className="container-lg py-5">
      <div className="row g-4">
        {STEPS.map((s) => (
          <div className="col-md-4" key={s.n}>
            <div className="card card-plain card-hover h-100 p-4 text-center">
              <div className="step-guide justify-content-center mb-3"><div className="num">{s.n}</div></div>
              <span className="fs-3 text-primary mb-2">{s.icon}</span>
              <h5 className="fw-bold">{s.title}</h5>
              <p className="text-muted small mb-0">{s.text}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="section-head text-center mt-5 mb-4">
        <div className="eyebrow">For everyone</div>
        <h2 className="fw-bold">One Platform, Three Roles</h2>
      </div>

      <div className="row g-4">
        {ROLES.map((r) => (
          <div className="col-md-4" key={r.key}>
            <div className="card card-plain card-hover h-100 p-4">
              <span className="stat-icon mb-3" style={{ background: `${r.color}1a`, color: r.color, width: 52, height: 52, fontSize: '1.4rem' }}>{r.icon}</span>
              <h5 className="fw-bold">{r.title}</h5>
              <p className="text-muted small">{r.text}</p>
              <ul className="list-unstyled small text-muted d-flex flex-column gap-2 mb-4">
                {r.points.map((p) => <li key={p}><FaCheckCircle className="me-2 text-success" />{p}</li>)}
              </ul>
              <Link to={r.cta.to} className="btn btn-outline-brand btn-sm btn-pill mt-auto">
                {r.cta.label} <FaArrowRight className="ms-1" size={11} />
              </Link>
            </div>
          </div>
        ))}
      </div>

      <div className="alert alert-light d-flex align-items-center gap-2 mt-5">
        <FaShieldAlt className="text-primary" />
        All professionals and agencies are verified by our admin team before going live.
        <Link to="/login" className="btn btn-brand btn-sm ms-auto">Try the demo</Link>
      </div>
      <div className="text-center mt-3">
        <span className="text-muted small"><FaStar className="text-warning" /> Rated 4.8/5 by 58,000+ households</span>
      </div>
    </div>
  </div>
)

export default HowItWorksPage