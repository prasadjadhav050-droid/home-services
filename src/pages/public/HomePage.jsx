import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { FaSearch, FaMapMarkerAlt, FaShieldAlt, FaStar, FaCheckCircle, FaClock, FaTruck, FaArrowRight, FaPhoneAlt, FaBolt, FaUsers, FaClipboardCheck, FaMoneyBillWave } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import { selectServices, selectLocations } from '../../features/services/serviceSlice'
import { selectProfessionals } from '../../features/professionals/professionalSlice'
import { selectAgencies } from '../../features/agencies/agencySlice'
import { CATEGORIES } from '../../data/categories'
import { INDIA_CITIES } from '../../data/indianCities'
import { icons } from '../../utils/iconMap'
import ServiceCard from '../../components/cards/ServiceCard'
import ProfessionalCard from '../../components/cards/ProfessionalCard'
import AgencyCard from '../../components/cards/AgencyCard'
import RatingStars from '../../components/common/RatingStars'
import Avatar from '../../components/common/Avatar'

const STATS = [
  { icon: <FaUsers />, value: '12,400+', label: 'Verified Professionals' },
  { icon: <FaClipboardCheck />, value: '58K+', label: 'Services Completed' },
  { icon: <FaStar />, value: '4.8/5', label: 'Average Rating' },
  { icon: <FaMoneyBillWave />, value: '24/7', label: 'On-Demand Support' },
]

const STEPS = [
  { n: 1, icon: <FaSearch />, title: 'Search Services', text: 'Pick from plumbing, electrical, cleaning and more across your city.' },
  { n: 2, icon: <FaTruck />, title: 'Book a Professional', text: 'Choose a verified pro or agency, pick a slot and confirm instantly.' },
  { n: 3, icon: <FaCheckCircle />, title: 'Get It Done', text: 'Track your service live and pay securely after completion.' },
]

const HomePage = () => {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [city, setCity] = useState('Delhi')
  const services = useSelector(selectServices)
  const locations = useSelector(selectLocations)
  const professionals = useSelector(selectProfessionals)
  const agencies = useSelector(selectAgencies)

  const search = (e) => {
    e.preventDefault()
    navigate(`/services?q=${encodeURIComponent(query)}&location=${encodeURIComponent(city)}`)
  }

  const featured = services.filter((s) => s.featured).slice(0, 8)
  const topPros = professionals.slice(0, 4)
  const topAgencies = agencies.slice(0, 3)

  return (
    <div>
      {/* HERO */}
      <section className="hero">
        <div className="container-lg position-relative" style={{ zIndex: 2 }}>
          <div className="row">
            <div className="col-12 col-lg-8">
              <span className="hero-badge d-inline-flex align-items-center gap-2 mb-3">
                <FaShieldAlt /> Trusted by 58,000+ households
              </span>
              <h1 className="fw-bold display-5 mb-3" style={{ lineHeight: 1.15 }}>
                Find Trusted Professionals<br />for Your <span style={{ color: '#ffb703' }}>Home Services</span>
              </h1>
              <p className="mb-4" style={{ color: '#cfe0ff', maxWidth: 560, fontSize: '1.02rem' }}>
                Plumbing, electrical, cleaning, AC repair and more — book verified experts in minutes and track them live.
              </p>
              <form onSubmit={search} className="hero-search">
                {/* <div className="input-group-icon flex-grow-1" style={{ minWidth: 220 }}>
                  <FaSearch className="input-icon" />
                  <input type="search" className="form-control" placeholder="Search for a service…" value={query} onChange={(e) => setQuery(e.target.value)} />
                </div> */}
                <div className="input-group-icon d-flex align-items-center" style={{ minWidth: 150 }}>
                  <FaMapMarkerAlt className="input-icon" />
                  <select className="form-select ps-5" value={city} onChange={(e) => setCity(e.target.value)}>
                    {[...new Set(INDIA_CITIES.concat(locations))].map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>
                <button type="submit" className="btn btn-brand px-4 py-2">
                  <FaSearch className="me-1" /> Search
                </button>
              </form>
              <div className="d-flex flex-wrap gap-2 mt-4">
                <button type="button" className="btn btn-accent btn-pill px-4" onClick={() => navigate('/services')}>
                  Find a Service <FaArrowRight className="ms-2" size={12} />
                </button>
                <button type="button" className="btn btn-light btn-pill px-4" onClick={() => navigate('/register/professional')}>
                  Become a Professional
                </button>
                <button type="button" className="btn btn-light btn-pill px-4" onClick={() => navigate('/register/agency')}>
                  Register Your Agency
                </button>
              </div>
            </div>
            <div className="col-12 col-lg-4 d-none d-lg-flex align-items-center justify-content-center">
              <div className="bg-white p-3 rounded-4 shadow-lg w-100" style={{ maxWidth: 300 }}>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <Avatar name="Arjun Mehta" size="lg" id="pro1" />
                  <div>
                    <div className="fw-bold small">Arjun Mehta</div>
                    <div className="text-muted small">Electrical Expert</div>
                  </div>
                  <span className="badge bg-soft-success ms-auto">Live</span>
                </div>
                <div className="d-flex align-items-center gap-2 bg-light rounded-3 p-2 mb-2">
                  <FaTruck className="text-primary" />
                  <div className="small flex-grow-1">
                    <strong>On the way</strong>
                    <div className="text-muted" style={{ fontSize: '0.72rem' }}>Arriving in 12 min</div>
                  </div>
                </div>
                <RatingStars value={4.8} />
                <span className="small ms-1">4.8 · 46 reviews</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="container-lg" style={{ marginTop: -72 }}>
        <h5 className="fw-bold text-white mb-3 px-2">Popular Services</h5>
        <div className="row g-2 g-md-3">
          {CATEGORIES.slice(0, 6).map((c) => {
            const Icon = icons[c.icon]
            const count = services.filter((s) => s.category === c.id).length
            return (
              <div className="col-6 col-md-4 col-lg-2" key={c.id}>
                <Link to={`/services?category=${c.id}`} className="card card-hover card-plain text-center p-3 h-100" style={{ textDecoration: 'none', cursor: 'pointer' }}>
                  <span className="stat-icon mx-auto mb-2" style={{ background: `${c.color}1a`, color: c.color }}>
                    <Icon />
                  </span>
                  <div className="fw-bold small text-dark">{c.name}</div>
                  <div className="text-muted" style={{ fontSize: '0.72rem' }}>{count} services</div>
                </Link>
              </div>
            )
          })}
        </div>
      </section>

      {/* FEATURED SERVICES */}
      <section className="container-lg py-5">
        <div className="section-head d-flex justify-content-between align-items-end mb-4">
          <div>
            <div className="eyebrow">Hand-picked</div>
            <h2 className="fw-bold">Featured Services</h2>
          </div>
          <Link to="/services" className="btn btn-outline-brand btn-sm btn-pill">View all <FaArrowRight className="ms-1" size={11} /></Link>
        </div>
        <div className="row g-3 g-md-4">
          {featured.map((s) => (
            <div className="col-12 col-sm-6 col-lg-3" key={s.id}><ServiceCard service={s} /></div>
          ))}
        </div>
      </section>

      {/* FEATURED PROFESSIONALS */}
      <section className="py-5" style={{ background: '#fff' }}>
        <div className="container-lg">
          <div className="section-head text-center mb-4">
            <div className="eyebrow">Meet the experts</div>
            <h2 className="fw-bold">Featured Professionals</h2>
            <p className="text-muted mx-auto" style={{ maxWidth: 520 }}>Every professional is background-verified, rated by real customers and ready to help today.</p>
          </div>
          <div className="row g-3 g-md-4">
            {topPros.map((p) => (
              <div className="col-12 col-sm-6 col-lg-3" key={p.id}><ProfessionalCard pro={p} /></div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED AGENCIES */}
      <section className="container-lg py-5">
        <div className="section-head text-center mb-4">
          <div className="eyebrow">Agencies</div>
          <h2 className="fw-bold">Trusted Service Agencies</h2>
        </div>
        <div className="row g-3 g-md-4">
          {topAgencies.map((a) => (
            <div className="col-12 col-md-4" key={a.id}><AgencyCard agency={a} /></div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-5">
        <div className="container-lg">
          <div className="row g-4">
            <div className="col-lg-3">
              <div className="eyebrow">Simple process</div>
              <h2 className="fw-bold mb-2">How ServiceSprint Works</h2>
              <p className="text-muted">From booking to completion in three easy steps — no phone calls, no hassle.</p>
            </div>
            {STEPS.map((s) => (
              <div className="col-lg-3" key={s.n}>
                <div className="card card-plain card-hover h-100 p-4">
                  <div className="step-guide mb-3"><div className="num">{s.n}</div></div>
                  <span className="text-primary fs-4 mb-2">{s.icon}</span>
                  <h6 className="fw-bold">{s.title}</h6>
                  <p className="text-muted small mb-0">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-4" style={{ background: '#0b2247' }}>
        <div className="container-lg">
          <div className="row text-center text-white">
            {STATS.map((s, i) => (
              <div className="col-6 col-lg-3 py-3" key={i}>
                <span className="fs-4 mb-1 d-inline-block" style={{ color: '#ffb703' }}>{s.icon}</span>
                <div className="fw-bold fs-4">{s.value}</div>
                <div className="small" style={{ color: '#b8c6e8' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-lg py-5">
        <div className="rounded-4 p-4 p-md-5 text-white position-relative overflow-hidden" style={{ background: 'linear-gradient(120deg,#0b2a5c,#1a5fc9)' }}>
          <div className="row align-items-center position-relative" style={{ zIndex: 2 }}>
            <div className="col-lg-8">
              <h2 className="fw-bold mb-2" style={{ color: '#ffffff' }}>Ready to fix it today?</h2>
              <p className="mb-0" style={{ color: '#cfe0ff' }}>Book a verified professional now or join our growing network of experts.</p>
            </div>
            <div className="col-lg-4 d-flex gap-2 mt-3 mt-lg-0 justify-content-lg-end">
              <button type="button" className="btn btn-accent btn-pill px-4" onClick={() => navigate('/services')}>Book Now</button>
              <a href="tel:1800123456" className="btn btn-light btn-pill px-4"><FaPhoneAlt className="me-1" /> Call Us</a>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES ROW */}
      <section className="container-lg pb-5">
        <div className="d-flex flex-wrap justify-content-center gap-3 text-center">
          {[
            { icon: <FaShieldAlt />, label: 'Verified Providers' },
            { icon: <FaClock />, label: 'On-Time Guarantee' },
            { icon: <FaStar />, label: 'Quality Backed by Reviews' },
            { icon: <FaBolt />, label: '24×7 Emergency Service' },
          ].map((f, i) => (
            <div key={i} className="d-flex align-items-center gap-2 bg-white border rounded-pill px-3 py-2 small fw-semibold">
              <span className="text-primary">{f.icon}</span> {f.label}
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default HomePage