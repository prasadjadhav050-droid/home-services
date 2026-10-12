import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectNotificationsForUser, selectUnreadCount } from '../features/notifications/notificationSlice'
import { useAuth } from './useAuth'

export const useNotifications = () => {
  const { user } = useAuth()
  const userId = user?.id
  const list = useSelector((s) => selectNotificationsForUser(s, userId))
  const unread = useSelector((s) => selectUnreadCount(s, userId))
  return useMemo(() => ({ list, unread }), [list, unread])
}

export const useDebounce = (value, delay = 350) => {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}