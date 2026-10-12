import { createSlice, createSelector } from '@reduxjs/toolkit'
import { loadState, uid } from '../../utils/storage'
import { initialData } from '../../data/seed'
import { STATUS_META } from '../../data/categories'

export const SERVICES_KEY = 'services'

const initialState = {
  list: loadState(SERVICES_KEY, initialData.services),
  filters: {
    search: '',
    category: 'all',
    location: 'all',
    minPrice: 0,
    maxPrice: 5000,
    availabilityOnly: false,
    sort: 'popular',
  },
  loading: false,
  error: null,
}

export const serviceSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    addService: (state, action) => {
      state.list.push({
        id: uid('svc'),
        availability: true,
        rating: 0,
        reviews: 0,
        featured: false,
        createdAt: new Date().toISOString(),
        ...action.payload,
      })
    },
    updateService: (state, action) => {
      const idx = state.list.findIndex((s) => s.id === action.payload.id)
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...action.payload }
    },
    removeService: (state, action) => {
      state.list = state.list.filter((s) => s.id !== action.payload)
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetFilters: (state) => {
      state.filters = initialState.filters
    },
  },
})

export const { addService, updateService, removeService, setFilters, resetFilters } = serviceSlice.actions

export const selectServices = (state) => state.services.list
export const selectFilters = (state) => state.services.filters
export const selectServiceById = (state, id) => state.services.list.find((s) => s.id === id)
export const selectServicesByCategory = (state, category) => state.services.list.filter((s) => s.category === category)

export const selectFilteredServices = createSelector(
  [selectServices, selectFilters],
  (list, f) => {
    let out = [...list]
    const q = String(f.search || '').toLowerCase()
    if (q) {
      out = out.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.description?.toLowerCase().includes(q) ||
          s.location?.toLowerCase().includes(q),
      )
    }
    if (f.category && f.category !== 'all') out = out.filter((s) => s.category === f.category)
    if (f.location && f.location !== 'all') out = out.filter((s) => s.location === f.location)
    if (f.availabilityOnly) out = out.filter((s) => s.availability)
    if (f.minPrice) out = out.filter((s) => s.price >= Number(f.minPrice))
    if (f.maxPrice) out = out.filter((s) => s.price <= Number(f.maxPrice))
    switch (f.sort) {
      case 'price_low': out.sort((a, b) => a.price - b.price); break
      case 'price_high': out.sort((a, b) => b.price - a.price); break
      case 'rating': out.sort((a, b) => b.rating - a.rating); break
      case 'duration': out.sort((a, b) => a.duration - b.duration); break
      default: out.sort((a, b) => Number(b.rating) * b.reviews - Number(a.rating) * a.reviews)
    }
    return out
  },
)

export const selectLocations = createSelector([selectServices], (list) =>
  [...new Set(list.map((s) => s.location).filter(Boolean))].sort(),
)

export { STATUS_META }
export default serviceSlice.reducer