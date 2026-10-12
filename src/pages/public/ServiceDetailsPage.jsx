import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaArrowLeft, FaClock, FaMapMarkerAlt, FaShieldAlt, FaQuoteLeft, FaPhoneAlt, FaCommentAlt, FaHeart, FaRegHeart, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa'
import { selectServiceById, selectServices } from '../../features/services/serviceSlice'
import { selectProfessionalById } from '../../features/professionals/professionalSlice'
import { selectAgencyById } from '../../features/agencies/agencySlice'
import { selectReviewsForProvider } from '../../features/reviews/reviewSlice'
import { CATEGORIES } from '../../data/categories'
import { icons } from '../../utils/iconMap'
import { formatMoney } from '../../utils/format'
import RatingStars from '../../components/common/RatingStars'
import ServiceCard from '../../components/cards/ServiceCard'
import Avatar from '../../components/common/Avatar'
import { useState } from 'react'

const ServiceDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [wish, setWish] = useState(false)
  const service = useSelector((s) => selectServiceById(s, id))
  const allServices = useSelector(selectServices)
  const providerPro = useSelector((s) => service?.providerType === 'professional' ? selectProfessionalById(s, service.providerId) : null)
  const providerAgency = useSelector((s) => service?.providerType === 'agency' ? selectAgencyById(s, service.providerId) : null)
  const reviews = useSelector((s) => selectReviewsForProvider(s, service?.providerId, service?.providerType))

  if (!service) {
    return (
      <div className="container-lg py-5 text-center">
        <h5>Service not found</h5>
        <Link to="/services" className="btn btn-brand mt-3">Back to services</Link>
      </div>
    )
  }

  const cat = CATEGORIES.find((c) => c.id === service.category)
  const Icon = icons[service.img] || icons.FaTools
  const related = allServices.filter((s) => s.category === service.category && s.id !== service.id).slice(0, 4)

  return (
    <div className="container-lg py-4">
      <button type="button" className="btn btn-ghost mb-3" onClick={() => navigate(-1)}><FaArrowLeft className="me-1" /> Back</button>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card card-plain overflow-hidden">
            <div className="p-4 d-flex flex-column flex-md-row gap-4">
              <div
                className="srv-img flex-shrink-0 mx-auto"
                style={{ background: `linear-gradient(135deg, ${service.color}22, ${service.color}33)`, width: 150, height: 150 }}
              >
                <Icon style={{ color: service.color }} />
              </div>
              <div className="flex-grow-1">
                <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                  <span className="badge bg-soft-dark">{cat?.name}</span>
                  <span className="badge bg-soft-brand">{service.providerType === 'agency' ? 'Agency service' : 'Independent professional'}</span>
                  {service.rating > 0 && <span className="srv-rating"><RatingStars value={service.rating} size={12} /> {service.rating} · {service.reviews} reviews</span>}
                </div>
                <h3 className="fw-bold">{service.name}</h3>
                <p className="text-muted">{service.description}</p>
                <div className="d-flex flex-wrap gap-3 small text-muted">
                  <span><FaMapMarkerAlt className="me-1 text-primary" /> {service.location}</span>
                  <span><FaClock className="me-1 text-primary" /> {service.duration} mins</span>
                  {providerPro && <span><FaShieldAlt className="me-1 text-primary" /> {providerPro.experience}+ years experience</span>}
                </div>
              </div>
            </div>
            <div className="p-4 border-top bg-light" style={{ background: '#f8fafc' }}>
              <div className="row g-3 text-center">
                <div className="col-4">
                  <div className="text-muted small">Base Price</div>
                  <div className="fs-5 fw-bold text-primary">{formatMoney(service.price)}</div>
                </div>
                <div className="col-4">
                  <div className="text-muted small">Duration</div>
                  <div className="fs-5 fw-bold">{service.duration} min</div>
                </div>
                <div className="col-4">
                  <div className="text-muted small">Emergency</div>
                  <div className="fs-5 fw-bold" style={{ color: '#e3562a' }}>{formatMoney(service.emergency)}</div>
                </div>
              </div>
              {service.additionalCharges && (
                <div className="alert alert-warning small mt-3 mb-0 d-flex align-items-center gap-2">
                  <FaExclamationTriangle /> {service.additionalCharges}
                </div>
              )}
            </div>
          </div>

          {/* Reviews */}
          <div className="card card-plain p-4 mt-4">
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><FaQuoteLeft className="text-primary" /> Customer Reviews</h6>
            {!reviews.length && <div className="text-muted small">No reviews yet — be the first to book!</div>}
            {reviews.map((r) => (
              <div key={r.id} className="border-bottom py-3">
                <div className="d-flex align-items-center gap-2 mb-1">
                  <RatingStars value={r.rating} size={12} />
                  <span className="small fw-semibold">Customer</span>
                  <span className="text-muted small ms-auto">{r.comment && 'Verified booking'}</span>
                </div>
                <p className="small mb-1">{r.comment}</p>
                {r.response && <div className="bg-light rounded p-2 small mt-1"><FaCommentAlt className="me-1 text-primary" size={11} /> <strong>Provider:</strong> {r.response}</div>}
              </div>
            ))}
          </div>
        </div>

        <div className="col-lg-4">
          {/* Booking / provider card */}
          <div className="card card-plain bg-white p-4 sticky-under-navbar">
            <h6 className="fw-bold">Provider</h6>
            {(providerPro || providerAgency) ? (
              <>
                <div className="d-flex align-items-center gap-3 mb-3">
                  <Avatar name={providerPro?.name || providerAgency?.name} size="lg" id={providerPro?.id || providerAgency?.id} />
                  <div>
                    <div className="fw-bold">{providerPro?.name || providerAgency?.name}</div>
                    <div className="text-muted small">{providerPro ? `${providerPro.experience} yrs · ${providerPro.hourlyRate}/hr` : providerAgency?.locations?.join(', ')}</div>
                    {providerPro?.verification === 'verified' && <span className="verified-badge small"><FaCheckCircle /> Verified pro</span>}
                  </div>
                </div>
                {providerPro && (
                  <div className="mb-3">
                    {providerPro.skills?.slice(0, 4).map((sk) => <span key={sk} className="badge bg-soft-dark me-1 mb-1">{sk}</span>)}
                  </div>
                )}
              </>
            ) : null}

            <div className="d-grid gap-2">
              <button type="button" className="btn btn-brand btn-lg" onClick={() => navigate(`/book?service=${service.id}`)}>
                Book Now · {formatMoney(service.price)}
              </button>
              <div className="d-flex gap-2">
                <button type="button" className="btn btn-outline-brand flex-grow-1">
                  <FaPhoneAlt className="me-1" /> Contact
                </button>
                <button
                  type="button"
                  className="btn btn-outline-brand flex-grow-1"
                  onClick={() => setWish((w) => !w)}
                  style={{ color: wish ? '#e11d48' : undefined, borderColor: wish ? '#e11d48' : undefined }}
                >
                  {wish ? <><FaHeart /> Saved</> : <><FaRegHeart /> Wishlist</>}
                </button>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 text-muted small mt-3">
              <FaShieldAlt className="text-primary" /> Free cancellation up to 2 hrs before service.
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-5">
          <h5 className="fw-bold mb-3">Similar services</h5>
          <div className="row g-3 g-md-4">
            {related.map((s) => <div className="col-12 col-md-6 col-lg-3" key={s.id}><ServiceCard service={s} /></div>)}
          </div>
        </section>
      )}
    </div>
  )
}

export default ServiceDetailsPage