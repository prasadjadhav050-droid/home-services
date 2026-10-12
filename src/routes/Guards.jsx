import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '../features/auth/authSlice'
import { LoadingSpinner } from '../components/common/Feedback'

const RoleProtectedRoute = ({ roles, children }) => {
  const user = useSelector(selectCurrentUser)
  const location = useLocation()

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />
  if (!roles.includes(user.role)) {
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : `/${user.role}/dashboard`} replace />
  }
  return children
}

const DASHBOARD_ROLES = ['customer', 'professional', 'agency', 'admin']

const PublicOnlyRoute = ({ children }) => {
  const user = useSelector(selectCurrentUser)
  if (!user) return children
  const dest = DASHBOARD_ROLES.includes(user.role) ? `/${user.role}/dashboard` : '/services'
  return <Navigate to={dest} replace />
}

const DemoSplash = () => <LoadingSpinner label="Checking your session…" />

export { RoleProtectedRoute, PublicOnlyRoute, DemoSplash }