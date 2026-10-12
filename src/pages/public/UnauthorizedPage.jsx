import { Link } from 'react-router-dom'
import { FaShieldAlt, FaExclamationTriangle } from 'react-icons/fa'

const UnauthorizedPage = () => (
  <div className="auth-wrap">
    <div className="text-center card shadow p-5" style={{ maxWidth: 480, borderRadius: 18 }}>
      <span className="mx-auto mb-3 stat-icon" style={{ background: '#fde8e8', color: '#dc3545', width: 72, height: 72, fontSize: '2rem', borderRadius: 18 }}>
        <FaExclamationTriangle />
      </span>
      <h4 className="fw-bold">Access Denied</h4>
      <p className="text-muted">You don't have permission to view this page. Your account role doesn't allow access here.</p>
      <div className="d-flex gap-2 justify-content-center flex-wrap">
        <Link to="/" className="btn btn-light border">Go Home</Link>
        <Link to="/dashboard" className="btn btn-brand">My Dashboard</Link>
      </div>
      <div className="alert alert-info small mt-3 text-start d-flex align-items-center gap-2 mb-0">
        <FaShieldAlt /> Try signing in with a different demo role to explore that area.
      </div>
    </div>
  </div>
)

export default UnauthorizedPage