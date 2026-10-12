import { useSelector, useDispatch } from 'react-redux'
import { selectCurrentUser, selectRole, logout } from '../features/auth/authSlice'

export const useAuth = () => {
  const user = useSelector(selectCurrentUser)
  const role = useSelector(selectRole)
  return { user, role, isAuthenticated: Boolean(user) }
}

export const useRequireRole = (allowedRoles) => {
  const { role } = useAuth()
  return allowedRoles.includes(role)
}