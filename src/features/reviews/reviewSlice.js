import { createSlice, createSelector } from '@reduxjs/toolkit'
import { loadState, uid } from '../../utils/storage'
import { initialData } from '../../data/seed'

export const REVIEWS_KEY = 'reviews'

const initialState = {
  list: loadState(REVIEWS_KEY, initialData.reviews),
  loading: false,
  error: null,
}

export const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    addReview: (state, action) => {
      state.list.push({ id: uid('rev'), status: 'visible', date: new Date().toISOString(), ...action.payload })
    },
    updateReview: (state, action) => {
      const idx = state.list.findIndex((r) => r.id === action.payload.id)
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...action.payload }
    },
    respondToReview: (state, action) => {
      const { id, response } = action.payload
      const r = state.list.find((x) => x.id === id)
      if (r) r.response = response
    },
    flagReview: (state, action) => {
      const r = state.list.find((x) => x.id === action.payload)
      if (r) r.status = r.status === 'flagged' ? 'visible' : 'flagged'
    },
    removeReview: (state, action) => {
      state.list = state.list.filter((r) => r.id !== action.payload)
    },
  },
})

export const { addReview, updateReview, respondToReview, flagReview, removeReview } = reviewSlice.actions

export const selectReviews = (state) => state.reviews.list
export const selectReviewsForProvider = createSelector(
  [selectReviews, (_, providerId) => providerId, (_, __, providerType) => providerType],
  (list, providerId, providerType) =>
    list.filter(
      (r) =>
        (r.providerType === providerType || !providerType) &&
        (r.providerId === providerId ||
          r.agencyId === providerId ||
          (providerType === 'agency' && r.agencyId === providerId)),
    ),
)

export const selectAverageRating = createSelector(
  [selectReviews, (_, providerId) => providerId],
  (list, providerId) => {
    const own = list.filter((r) => r.providerId === providerId || r.agencyId === providerId)
    if (!own.length) return 0
    return Number((own.reduce((s, r) => s + r.rating, 0) / own.length).toFixed(1))
  },
)

export const selectRatingDistribution = createSelector(
  [selectReviews, (_, providerId) => providerId],
  (list, providerId) => {
    const own = list.filter((r) => r.providerId === providerId || r.agencyId === providerId)
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    own.forEach((r) => { if (dist[r.rating] !== undefined) dist[r.rating] += 1 })
    return dist
  },
)

export const selectFlaggedReviews = createSelector([selectReviews], (list) =>
  list.filter((r) => r.status === 'flagged'),
)

export default reviewSlice.reducer