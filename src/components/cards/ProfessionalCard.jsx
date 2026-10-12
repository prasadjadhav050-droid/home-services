import { FaMapMarkerAlt, FaBriefcase, FaCheckCircle, FaHourglassHalf } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import RatingStars from '../common/RatingStars'
import Avatar from '../common/Avatar'

const ProfessionalCard = ({ pro, showSkills = true, actions }) => {
  const navigate = useNavigate()
  if (!pro) return null
  return (
    <div className="card card-hover card-plain p-3 h-100">
      <div className="d-flex gap-3">
        <Avatar name={pro.name} size="lg" id={pro.id} />
        <div className="flex-grow-1">
          <div className="d-flex justify-content-between align-items-start">
            <h6 className="fw-bold m-0">{pro.name}</h6>
            {pro.availability ? (
              <span className="badge bg-soft-success">Available</span>
            ) : (
              <span className="badge bg-soft-secondary">Busy</span>
            )}
          </div>
          <div className="text-muted small">
            <FaMapMarkerAlt size={11} /> {pro.location}
          </div>
          <div className="d-flex align-items-center gap-2 mt-1">
            <RatingStars value={pro.rating || 0} size={12} />
            <span className="small fw-semibold">{pro.rating || '—'}</span>
            <span className="text-muted small">({pro.reviewCount || 0})</span>
          </div>
        </div>
      </div>
      {showSkills && pro.skills?.length > 0 && (
        <div className="mt-2 d-flex flex-wrap gap-1">
          {pro.skills.slice(0, 3).map((s) => (
            <span key={s} className="badge bg-soft-dark">{s}</span>
          ))}
        </div>
      )}
      <div className="d-flex align-items-center justify-content-between mt-3 small">
        <span className="text-muted"><FaBriefcase size={11} /> {pro.experience || 0}+ yrs</span>
        {pro.verification === 'verified' ? (
          <span className="verified-badge fw-semibold"><FaCheckCircle /> Verified</span>
        ) : pro.verification === 'pending' ? (
          <span className="text-muted fw-semibold"><FaHourglassHalf /> Pending</span>
        ) : null}
      </div>
      {actions && <div className="mt-2">{actions}</div>}
    </div>
  )
}

export default ProfessionalCard