import { createSlice, createSelector } from '@reduxjs/toolkit'
import { loadState, uid } from '../../utils/storage'
import { initialData } from '../../data/seed'

export const PAYMENTS_KEY = 'payments'

const initialState = {
  list: loadState(PAYMENTS_KEY, initialData.payments),
  loading: false,
  error: null,
}

export const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    addPayment: (state, action) => {
      state.list.push({ id: uid('pay'), date: new Date().toISOString(), ...action.payload })
    },
    updatePayment: (state, action) => {
      const idx = state.list.findIndex((p) => p.id === action.payload.id)
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...action.payload }
    },
    removePayment: (state, action) => {
      state.list = state.list.filter((p) => p.id !== action.payload)
    },
  },
})

export const { addPayment, updatePayment, removePayment } = paymentSlice.actions

export const selectPayments = (state) => state.payments.list
export const selectPaymentsByBooking = (state, bookingId) =>
  state.payments.list.filter((p) => p.bookingId === bookingId)

export const selectPaymentsForUser = createSelector(
  [selectPayments, (_, userId) => userId, (_, __, type) => type],
  (list, userId, type) => list.filter((p) => p.userId === userId && (!type || p.type === type)),
)

export const selectTotalUserRevenue = createSelector([selectPayments, (_, userId) => userId], (list, userId) =>
  list
    .filter((p) => p.userId === userId && p.type === 'payout')
    .reduce((s, p) => s + Number(p.amount || 0), 0),
)

export const selectPlatformCommission = createSelector([selectPayments], (list) =>
  list.filter((p) => p.type === 'payment').reduce((s, p) => s + Number(p.commission || 0), 0),
)

export const selectPendingPayouts = createSelector([selectPayments], (list) =>
  list.filter((p) => p.status === 'pending').reduce((s, p) => s + Number(p.amount || 0), 0),
)

export const selectTotalTransactions = createSelector([selectPayments], (list) =>
  list.filter((p) => p.type === 'payment').reduce((s, p) => s + Number(p.amount || 0), 0),
)

export default paymentSlice.reducer