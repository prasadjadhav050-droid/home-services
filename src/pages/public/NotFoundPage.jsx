import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { FaSearch, FaHome } from 'react-icons/fa'
import { selectCurrentUser } from '../../features/auth/authSlice'

const NotFoundPage = () => {
  const user = useSelector(selectCurrentUser)
  const backHome = user ? `/${user.role}/dashboard` : '/'

  return (
    <div className="auth-wrap">
      <div className="text-center card shadow p-5" style={{ maxWidth: 480, borderRadius: 18 }}>
        <span className="mx-auto mb-3 stat-icon" style={{ background: '#eef4ff', color: '#0d6efd', width: 72, height: 72, fontSize: '2rem', borderRadius: 18 }}>
          <FaSearch />
        </span>
        <h4 className="fw-bold display-6 m-0">404</h4>
        <p className="text-muted mb-4">The page you're looking for doesn't exist or was moved.</p>
        <div className="d-flex gap-2 justify-content-center">
          <Link to={backHome} className="btn btn-brand"><FaHome className="me-1" /> Back Home</Link>
          <Link to="/services" className="btn btn-light border">Browse Services</Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage