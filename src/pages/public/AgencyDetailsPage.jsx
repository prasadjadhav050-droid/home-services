import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaArrowLeft, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaGlobe, FaUserTie, FaStar } from 'react-icons/fa'
import { selectAgencyById } from '../../features/agencies/agencySlice'
import { selectProfessionalsByAgency } from '../../features/professionals/professionalSlice'
import { selectServices, selectServicesByCategory } from '../../features/services/serviceSlice'
import { selectReviewsForProvider } from '../../features/reviews/reviewSlice'
import { CATEGORIES } from '../../data/categories'
import Avatar from '../../components/common/Avatar'
import ProfessionalCard from '../../components/cards/ProfessionalCard'
import ServiceCard from '../../components/cards/ServiceCard'
import RatingStars from '../../components/common/RatingStars'

const AgencyDetailsPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const agency = useSelector((s) => selectAgencyById(s, id))
  const staff = useSelector((s) => selectProfessionalsByAgency(s, id))
  const reviews = useSelector((s) => selectReviewsForProvider(s, id, 'agency'))
  const agServices = useSelector((s) => selectServicesByCategory(s, '')) // banners independent
  const services = useSelector(selectServices).filter((s) => s.providerId === id)

  if (!agency) {
    return (
      <div className="container-lg py-5 text-center">
        <h5>Agency not found</h5>
        <Link to="/services" className="btn btn-brand mt-3">Back to services</Link>
      </div>
    )
  }
  const avg = reviews.length ? Number((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)) : agency.rating

  return (
    <div className="container-lg py-4">
      <button type="button" className="btn btn-ghost mb-3" onClick={() => navigate(-1)}><FaArrowLeft className="me-1" /> Back</button>
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card card-plain p-4 text-center">
            <Avatar name={agency.name} size="lg" id={agency.id} />
            <h4 className="fw-bold mt-3 mb-0">{agency.name}</h4>
            <div className="text-muted small">{agency.legalName}</div>
            <div className="d-flex justify-content-center align-items-center gap-2 mt-2">
              <RatingStars value={avg} />
              <span className="small fw-semibold">{avg}</span>
              <span className="text-muted small">({reviews.length || agency.reviewCount} reviews)</span>
            </div>
            <hr />
            <div className="text-start small text-muted d-flex flex-column gap-2">
              <span><FaMapMarkerAlt className="me-2 text-primary" /> {(agency.locations || []).join(', ')}</span>
              <span><FaPhoneAlt className="me-2 text-primary" /> {agency.phone}</span>
              <span><FaEnvelope className="me-2 text-primary" /> {agency.email}</span>
              {agency.website && <span><FaGlobe className="me-2 text-primary" /> {agency.website}</span>}
              <span><FaUserTie className="me-2 text-primary" /> {staff.length} professionals on team</span>
            </div>
            <hr />
            <div className="d-flex flex-wrap gap-1 justify-content-center">
              {(agency.servicesOffered || []).map((c) => {
                const cat = CATEGORIES.find((x) => x.id === c)
                return cat ? <span key={c} className="badge bg-soft-brand">{cat.name}</span> : null
              })}
            </div>
          </div>
        </div>
        <div className="col-lg-8">
          <div className="card card-plain p-4 mb-4">
            <h6 className="fw-bold">About {agency.name}</h6>
            <p className="text-muted small mb-0">{agency.description}</p>
          </div>
          {services.length > 0 && (
            <>
              <h6 className="fw-bold mb-3">Services</h6>
              <div className="row g-3 mb-4">
                {services.map((s) => <div className="col-12 col-md-6" key={s.id}><ServiceCard service={s} /></div>)}
              </div>
            </>
          )}
          <h6 className="fw-bold mb-3">Team ({staff.length})</h6>
          <div className="row g-3">
            {staff.map((p) => <div className="col-12 col-md-6" key={p.id}><ProfessionalCard pro={p} /></div>)}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgencyDetailsPage