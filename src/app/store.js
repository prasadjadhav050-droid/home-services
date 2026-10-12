import { configureStore } from '@reduxjs/toolkit'
import { saveState, loadState } from '../utils/storage'
import authReducer, { AUTH_KEY } from '../features/auth/authSlice'
import usersReducer, { USERS_KEY } from '../features/users/userSlice'
import servicesReducer, { SERVICES_KEY } from '../features/services/serviceSlice'
import bookingsReducer, { BOOKINGS_KEY } from '../features/bookings/bookingSlice'
import professionalsReducer, { PROFESSIONALS_KEY } from '../features/professionals/professionalSlice'
import agenciesReducer, { AGENCIES_KEY } from '../features/agencies/agencySlice'
import paymentsReducer, { PAYMENTS_KEY } from '../features/payments/paymentSlice'
import reviewsReducer, { REVIEWS_KEY } from '../features/reviews/reviewSlice'
import notificationsReducer, { NOTIFICATIONS_KEY } from '../features/notifications/notificationSlice'
import dashboardReducer from '../features/dashboard/dashboardSlice'
import uiReducer from '../features/ui/uiSlice'

const PersistKeys = {
  [AUTH_KEY]: AUTH_KEY,
  [USERS_KEY]: USERS_KEY,
  [SERVICES_KEY]: SERVICES_KEY,
  [BOOKINGS_KEY]: BOOKINGS_KEY,
  [PROFESSIONALS_KEY]: PROFESSIONALS_KEY,
  [AGENCIES_KEY]: AGENCIES_KEY,
  [PAYMENTS_KEY]: PAYMENTS_KEY,
  [REVIEWS_KEY]: REVIEWS_KEY,
  [NOTIFICATIONS_KEY]: NOTIFICATIONS_KEY,
}

export const persistedKeys = Object.values(PersistKeys)

const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    services: servicesReducer,
    bookings: bookingsReducer,
    professionals: professionalsReducer,
    agencies: agenciesReducer,
    payments: paymentsReducer,
    reviews: reviewsReducer,
    notifications: notificationsReducer,
    dashboard: dashboardReducer,
    ui: uiReducer,
  },
  middleware: (getDefault) => getDefault({ serializableCheck: false }),
})

store.subscribe(() => {
  const state = store.getState()
  Object.keys(PersistKeys).forEach((key) => {
    const value = PersistKeys[key] === AUTH_KEY
      ? { currentUser: state.auth.currentUser, token: state.auth.token }
      : state[PersistKeys[key]].list
    saveState(PersistKeys[key], value)
  })
})

export {
  loadState,
}

export default store