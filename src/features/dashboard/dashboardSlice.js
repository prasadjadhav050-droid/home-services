import { createSlice, createSelector } from '@reduxjs/toolkit'

const initialState = {
  reportRange: 6,
  reportTab: 'overview',
  loading: false,
  error: null,
}

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setReportRange: (state, action) => {
      state.reportRange = action.payload
    },
    setReportTab: (state, action) => {
      state.reportTab = action.payload
    },
  },
})

export const { setReportRange, setReportTab } = dashboardSlice.actions
export const selectReportRange = (state) => state.dashboard.reportRange
export const selectReportTab = (state) => state.dashboard.reportTab

export const selectDashboardSummary = createSelector(
  [(s) => s.bookings.list, (s) => s.payments.list, (s) => s.users.list, (s) => s.reviews.list, (s) => s.services.list],
  (bookings, payments, users, reviews, services) => ({
    bookings,
    payments,
    users,
    reviews,
    services,
    customers: users.filter((u) => u.role === 'customer').length,
    professionals: users.filter((u) => u.role === 'professional').length,
    agencies: users.filter((u) => u.role === 'agency').length,
    activeBookings: bookings.filter((b) => ['pending', 'accepted', 'assigned', 'on_the_way', 'arrived', 'in_progress'].includes(b.status)).length,
    completedBookings: bookings.filter((b) => b.status === 'completed').length,
    pendingBookings: bookings.filter((b) => b.status === 'pending').length,
    revenue: bookings.filter((b) => b.status === 'completed').reduce((s, b) => s + Number(b.price || 0), 0),
    commission: payments.filter((p) => p.type === 'payment').reduce((s, p) => s + Number(p.commission || 0), 0),
    pendingVerifications: users.filter((u) => u.verification === 'pending').length,
    avgRating: reviews.length
      ? Number((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1))
      : 0,
  }),
)

export default dashboardSlice.reducer