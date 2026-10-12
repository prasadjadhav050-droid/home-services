import { FaSpinner, FaSearch } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export const LoadingSpinner = ({ label = 'Loading…', tall = true }) => (
  <div className={`${tall ? 'loading-wrap' : 'p-4 text-center'}`}>
    <div className="text-center">
      <FaSpinner className="text-primary mb-2" size={28} style={{ animation: 'spin 1s linear infinite' }} />
      <div className="text-muted small">{label}</div>
    </div>
  </div>
)

export const EmptyState = ({ icon, title, message, action, actionLabel, actionTo }) => {
  const navigate = useNavigate()
  return (
    <div className="empty-state">
      <div className="icon">{icon || <FaSearch />}</div>
      <h5 className="fw-bold mb-1">{title || 'Nothing here'}</h5>
      <p className="text-muted mb-3 mt-2" style={{ maxWidth: 420, margin: '0 auto' }}>{message}</p>
      {action && (
        <button type="button" className="btn btn-brand mt-2" onClick={() => (actionTo ? navigate(actionTo) : action())}>
          {actionLabel || 'Go back'}
        </button>
      )}
    </div>
  )
}

export const InlineSpinner = () => (
  <span className="text-primary" style={{ animation: 'spin 1s linear infinite' }}>
    <FaSpinner />
  </span>
)

export default LoadingSpinner