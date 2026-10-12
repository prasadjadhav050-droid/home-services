import { createSlice, createSelector } from '@reduxjs/toolkit'
import { loadState, uid } from '../../utils/storage'
import { initialData } from '../../data/seed'

export const NOTIFICATIONS_KEY = 'notifications'

const initialState = {
  list: loadState(NOTIFICATIONS_KEY, initialData.notifications),
  loading: false,
  error: null,
}

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.list.unshift({ id: uid('notif'), read: false, date: new Date().toISOString(), ...action.payload })
    },
    markRead: (state, action) => {
      const n = state.list.find((x) => x.id === action.payload)
      if (n) n.read = true
    },
    markAllRead: (state, action) => {
      state.list.forEach((n) => { if (n.userId === action.payload) n.read = true })
    },
    removeNotification: (state, action) => {
      state.list = state.list.filter((n) => n.id !== action.payload)
    },
    clearForUser: (state, action) => {
      state.list = state.list.filter((n) => n.userId !== action.payload)
    },
  },
})

export const { addNotification, markRead, markAllRead, removeNotification, clearForUser } = notificationSlice.actions

export const selectNotifications = (state) => state.notifications.list
export const selectNotificationsForUser = createSelector(
  [selectNotifications, (_, userId) => userId],
  (list, userId) => list.filter((n) => n.userId === userId).sort((a, b) => new Date(b.date) - new Date(a.date)),
)
export const selectUnreadCount = createSelector(
  [selectNotifications, (_, userId) => userId],
  (list, userId) => list.filter((n) => n.userId === userId && !n.read).length,
)

export const NOTIF_ICONS = {
  booking: 'FaClipboardCheck',
  payment: 'FaCreditCard',
  tracking: 'FaMapMarkerAlt',
  review: 'FaStar',
  request: 'FaInbox',
  verification: 'FaShieldAlt',
  dispute: 'FaGavel',
  assign: 'FaUserCheck',
}

export default notificationSlice.reducer