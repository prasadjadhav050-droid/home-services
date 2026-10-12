import { FaChevronLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const PageHeader = ({ title, subtitle, back, actions, icon }) => {
  const navigate = useNavigate()
  return (
    <div className="d-flex align-items-start justify-content-between gap-3 flex-wrap mb-4">
      <div className="d-flex align-items-center gap-3">
        {back && (
          <button type="button" className="btn btn-ghost btn-icon" onClick={() => (back === true ? navigate(-1) : navigate(back))}>
            <FaChevronLeft />
          </button>
        )}
        <div>
          <h4 className="fw-bold m-0 d-flex align-items-center gap-2">
            {icon && <span className="text-primary">{icon}</span>}
            {title}
          </h4>
          {subtitle && <div className="text-muted small">{subtitle}</div>}
        </div>
      </div>
      {actions && <div className="d-flex gap-2 flex-wrap">{actions}</div>}
    </div>
  )
}

export default PageHeader