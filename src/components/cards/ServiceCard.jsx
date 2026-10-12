import { FaClock, FaMapMarkerAlt, FaHeart, FaRegHeart, FaBookOpen } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import RatingStars from '../common/RatingStars'
import { icons } from '../../utils/iconMap'
import { formatMoney } from '../../utils/format'
import { CATEGORIES } from '../../data/categories'
import { useState } from 'react'

const ServiceCard = ({ service }) => {
  const navigate = useNavigate()
  const [wish, setWish] = useState(false)
  const cat = CATEGORIES.find((c) => c.id === service.category)
  const Icon = icons[service.img] || icons.FaTools
  return (
    <div className="card card-hover h-100 overflow-hidden" style={{ cursor: 'pointer' }} onClick={() => navigate(`/services/${service.id}`)}>
      <div
        className="srv-img position-relative"
        style={{ background: `linear-gradient(135deg, ${service.color}22, ${service.color}33)` }}
      >
        <Icon style={{ color: service.color, filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.12))' }} />
        <span className="badge bg-dark position-absolute top-0 start-0 m-2 text-uppercase" style={{ fontSize: '0.62rem' }}>
          {cat?.name}
        </span>
        <button
          type="button"
          className="btn btn-light btn-icon position-absolute top-0 end-0 m-2"
          style={{ borderRadius: '50%', color: wish ? '#e11d48' : '#4b5563' }}
          onClick={(e) => { e.stopPropagation(); setWish((w) => !w) }}
        >
          {wish ? <FaHeart /> : <FaRegHeart />}
        </button>
      </div>
      <div className="card-body p-3">
        <div className="d-flex justify-content-between align-items-start gap-2">
          <h6 className="fw-bold mb-1" style={{ lineHeight: 1.3 }}>{service.name}</h6>
          <span className="srv-rating"><RatingStars value={service.rating} size={11} /> {service.rating}</span>
        </div>
        <div className="text-muted small mb-2" style={{ fontSize: '0.78rem' }}>
          <span className="badge bg-soft-dark me-2">{service.providerType === 'agency' ? 'Agency' : 'Professional'}</span>
          <FaMapMarkerAlt /> {service.location}
        </div>
        <div className="d-flex align-items-center justify-content-between">
          <div>
            <span className="price-tag">{formatMoney(service.price)}</span>
            <span className="text-muted small">/ visit</span>
            <div className="text-muted small"><FaClock size={11} /> {service.duration} mins</div>
          </div>
          <button
            type="button"
            className="btn btn-brand btn-sm btn-pill px-3"
            onClick={(e) => { e.stopPropagation(); navigate(`/services/${service.id}`) }}
          >
            <FaBookOpen className="me-1" size={11} /> Book
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServiceCard