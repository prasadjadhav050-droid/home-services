import { FaBuilding, FaMapMarkerAlt, FaUserTie } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import RatingStars from '../common/RatingStars'
import Avatar from '../common/Avatar'
import { CATEGORIES } from '../../data/categories'

const AgencyCard = ({ agency, staffCount }) => {
  const navigate = useNavigate()
  if (!agency) return null
  const cats = (agency.servicesOffered || [])
    .map((c) => CATEGORIES.find((x) => x.id === c)?.name)
    .filter(Boolean)
  return (
    <div className="card card-hover card-plain p-3 h-100" onClick={() => navigate(`/agencies/${agency.id}`)} style={{ cursor: 'pointer' }}>
      <div className="d-flex gap-3">
        <Avatar name={agency.name} size="lg" id={agency.id} />
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <h6 className="fw-bold m-0">{agency.name}</h6>
              <div className="text-muted small"><FaBuilding size={11} /> {agency.legalName || agency.name}</div>
            </div>
            <span className="badge bg-soft-brand"><FaUserTie /> {staffCount ?? agency.staff?.length ?? 0} pros</span>
          </div>
          <div className="d-flex align-items-center gap-2 mt-2">
            <RatingStars value={agency.rating || 0} size={12} />
            <span className="small fw-semibold">{agency.rating || '—'}</span>
            <span className="text-muted small">({agency.reviewCount || 0})</span>
          </div>
        </div>
      </div>
      <div className="text-muted small mt-2">
        <FaMapMarkerAlt size={11} /> {(agency.locations || []).join(', ')}
      </div>
      <div className="mt-2 d-flex flex-wrap gap-1">
        {cats.slice(0, 4).map((c) => (
          <span key={c} className="badge bg-soft-secondary">{c}</span>
        ))}
      </div>
    </div>
  )
}

export default AgencyCard