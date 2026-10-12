import { createSlice, createSelector } from '@reduxjs/toolkit'
import { loadState, uid } from '../../utils/storage'
import { initialData } from '../../data/seed'

export const BOOKINGS_KEY = 'bookings'

const initialState = {
  list: loadState(BOOKINGS_KEY, initialData.bookings),
  loading: false,
  error: null,
}

export const bookingSlice = createSlice({
  name: 'bookings',
  initialState,
  reducers: {
    addBooking: (state, action) => {
      state.list.push({
        id: uid('bk'),
        trackingStep: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...action.payload,
      })
    },
    updateBooking: (state, action) => {
      const idx = state.list.findIndex((b) => b.id === action.payload.id)
      if (idx !== -1) {
        state.list[idx] = { ...state.list[idx], ...action.payload, updatedAt: new Date().toISOString() }
      }
    },
    updateStatus: (state, action) => {
      const { id, status } = action.payload
      const b = state.list.find((x) => x.id === id)
      if (b) {
        b.status = status
        b.updatedAt = new Date().toISOString()
      }
    },
    assignProfessional: (state, action) => {
      const { id, professionalId, agencyId } = action.payload
      const b = state.list.find((x) => x.id === id)
      if (b) {
        b.professionalId = professionalId
        if (agencyId) b.agencyId = agencyId
        b.providerType = b.providerType === 'agency' ? b.providerType : 'agency'
        b.status = b.status === 'pending' ? 'assigned' : b.status
        b.updatedAt = new Date().toISOString()
      }
    },
    cancelBooking: (state, action) => {
      const b = state.list.find((x) => x.id === action.payload)
      if (b) {
        b.status = 'cancelled'
        b.updatedAt = new Date().toISOString()
      }
    },
    setDispute: (state, action) => {
      const { id, dispute } = action.payload
      const b = state.list.find((x) => x.id === id)
      if (b) b.dispute = dispute
    },
    resolveDispute: (state, action) => {
      const b = state.list.find((x) => x.id === action.payload)
      if (b && b.dispute) b.dispute.status = 'resolved'
    },
    setTracking: (state, action) => {
      const { id, status, step } = action.payload
      const b = state.list.find((x) => x.id === id)
      if (b) {
        b.status = status
        b.trackingStep = step ?? b.trackingStep
        b.updatedAt = new Date().toISOString()
      }
    },
  },
})

export const { addBooking, updateBooking, updateStatus, assignProfessional, cancelBooking, setDispute, resolveDispute, setTracking } = bookingSlice.actions

export const selectBookings = (state) => state.bookings.list
export const selectBookingById = (state, id) => state.bookings.list.find((b) => b.id === id)
export const selectBookingByDisplayId = (state, bookingId) => state.bookings.list.find((b) => b.bookingId === bookingId)

export const selectBookingsByCustomer = createSelector(
  [selectBookings, (_, custId) => custId],
  (list, custId) => list.filter((b) => b.customerId === custId),
)

export const selectBookingsByProfessional = createSelector(
  [selectBookings, (_, proId) => proId],
  (list, proId) => list.filter((b) => b.professionalId === proId || (b.providerType === 'professional' && b.providerId === proId)),
)

export const selectBookingsByAgency = createSelector(
  [selectBookings, (_, agencyId) => agencyId],
  (list, agencyId) =>
    list.filter(
      (b) =>
        b.agencyId === agencyId ||
        (b.providerType === 'agency' && b.providerId === agencyId),
    ),
)

export const selectBookingsByStatus = createSelector(
  [selectBookings, (_, status) => status],
  (list, status) => {
    if (Array.isArray(status)) return list.filter((b) => status.includes(b.status))
    return list.filter((b) => b.status === status)
  },
)

export const selectUpcomingForCustomer = createSelector([selectBookings], (list) =>
  list
    .filter((b) => ['pending', 'accepted', 'assigned', 'on_the_way', 'in_progress'].includes(b.status) && b.status !== 'ready')
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
)

export const selectCompletedForCustomer = createSelector([selectBookings], (list) =>
  list.filter((b) => b.status === 'completed'),
)

export const selectPendingForProfessional = createSelector(
  [selectBookings, (_, proId) => proId],
  (list, proId) =>
    list.filter(
      (b) => b.status === 'pending' && (b.professionalId === proId || (b.providerType === 'professional' && b.providerId === proId)),
    ),
)

export const selectActiveForProfessional = createSelector(
  [selectBookings, (_, proId) => proId],
  (list, proId) =>
    list.filter(
      (b) =>
        ['accepted', 'assigned', 'on_the_way', 'arrived', 'in_progress'].includes(b.status) &&
        (b.professionalId === proId || (b.providerType === 'professional' && b.providerId === proId)),
    ),
)

export const selectPendingForAgency = createSelector(
  [selectBookings, (_, agencyId) => agencyId],
  (list, agencyId) => list.filter((b) => b.status === 'pending' && (b.agencyId === agencyId || b.providerId === agencyId)),
)

export const selectCompletedCount = createSelector([selectBookings], (list) =>
  list.filter((b) => b.status === 'completed').length,
)
export const selectActiveCount = createSelector([selectBookings], (list) =>
  list.filter((b) => ['pending', 'accepted', 'assigned', 'on_the_way', 'arrived', 'in_progress'].includes(b.status)).length,
)
export const selectPendingCount = createSelector([selectBookings], (list) =>
  list.filter((b) => b.status === 'pending').length,
)
export const selectTotalRevenue = createSelector([selectBookings], (list) =>
  list.filter((b) => b.status === 'completed').reduce((sum, b) => sum + Number(b.price || 0), 0),
)

export default bookingSlice.reducer