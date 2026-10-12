import { createSlice, createSelector } from '@reduxjs/toolkit'
import { loadState } from '../../utils/storage'
import { initialData } from '../../data/seed'

export const AGENCIES_KEY = 'agencies'

const initialState = {
  list: loadState(AGENCIES_KEY, initialData.agencies),
  loading: false,
  error: null,
}

export const agencySlice = createSlice({
  name: 'agencies',
  initialState,
  reducers: {
    addAgency: (state, action) => {
      state.list.push(action.payload)
    },
    updateAgency: (state, action) => {
      const idx = state.list.findIndex((a) => a.id === action.payload.id)
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...action.payload }
    },
    removeAgency: (state, action) => {
      state.list = state.list.filter((a) => a.id !== action.payload)
    },
    addStaff: (state, action) => {
      const { id, proId } = action.payload
      const a = state.list.find((x) => x.id === id)
      if (a && !a.staff.includes(proId)) a.staff.push(proId)
    },
    removeStaff: (state, action) => {
      const { id, proId } = action.payload
      const a = state.list.find((x) => x.id === id)
      if (a) a.staff = a.staff.filter((s) => s !== proId)
    },
    setServices: (state, action) => {
      const { id, servicesOffered } = action.payload
      const a = state.list.find((x) => x.id === id)
      if (a) a.servicesOffered = servicesOffered
    },
    setLocations: (state, action) => {
      const { id, locations } = action.payload
      const a = state.list.find((x) => x.id === id)
      if (a) a.locations = locations
    },
  },
})

export const { addAgency, updateAgency, removeAgency, addStaff, removeStaff, setServices, setLocations } = agencySlice.actions

export const selectAgencies = (state) => state.agencies.list
export const selectAgencyById = (state, id) => state.agencies.list.find((a) => a.id === id)
export const selectAgencyByOwner = createSelector(
  [selectAgencies, (_, userId) => userId],
  (list, userId) => list.find((a) => a.ownerId === userId || a.id === userId),
)

export default agencySlice.reducer