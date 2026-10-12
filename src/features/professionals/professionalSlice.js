import { createSlice, createSelector } from '@reduxjs/toolkit'
import { loadState } from '../../utils/storage'
import { initialData } from '../../data/seed'

export const PROFESSIONALS_KEY = 'professionals'

const initialState = {
  list: loadState(PROFESSIONALS_KEY, initialData.professionals),
  loading: false,
  error: null,
}

export const professionalSlice = createSlice({
  name: 'professionals',
  initialState,
  reducers: {
    addProfessional: (state, action) => {
      state.list.push(action.payload)
    },
    updateProfessional: (state, action) => {
      const idx = state.list.findIndex((p) => p.id === action.payload.id)
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...action.payload }
    },
    removeProfessional: (state, action) => {
      state.list = state.list.filter((p) => p.id !== action.payload)
    },
    toggleAvailability: (state, action) => {
      const p = state.list.find((x) => x.id === action.payload)
      if (p) p.availability = !p.availability
    },
    setSchedule: (state, action) => {
      const { id, schedule } = action.payload
      const p = state.list.find((x) => x.id === id)
      if (p) p.schedule = { ...p.schedule, ...schedule }
    },
    addBlockedSlot: (state, action) => {
      const { id, date, time } = action.payload
      const p = state.list.find((x) => x.id === id)
      if (!p) return
      p.blockedSlots = p.blockedSlots || []
      if (!p.blockedSlots.some((b) => b.date === date && b.time === time)) {
        p.blockedSlots.push({ date, time, id: `${date}_${time}` })
      }
    },
    removeBlockedSlot: (state, action) => {
      const { id, slotId } = action.payload
      const p = state.list.find((x) => x.id === id)
      if (p) p.blockedSlots = (p.blockedSlots || []).filter((b) => b.id !== slotId)
    },
    setAgency: (state, action) => {
      const { id, agencyId } = action.payload
      const p = state.list.find((x) => x.id === id)
      if (p) p.agencyId = agencyId
    },
  },
})

export const { addProfessional, updateProfessional, removeProfessional, toggleAvailability, setSchedule, addBlockedSlot, removeBlockedSlot, setAgency } = professionalSlice.actions

export const selectProfessionals = (state) => state.professionals.list
export const selectProfessionalById = (state, id) => state.professionals.list.find((p) => p.id === id)
export const selectProfessionalsByAgency = createSelector(
  [selectProfessionals, (_, agencyId) => agencyId],
  (list, agencyId) => list.filter((p) => p.agencyId === agencyId),
)
export const selectProfessionalsByServiceCategory = createSelector(
  [selectProfessionals, (_, category) => category],
  (list, category) => list.filter((p) => p.skills.some((s) => s.toLowerCase().includes((category || '').replace('-', ' ') || ''))),
)
export const selectAvailableProfessionals = createSelector(
  [selectProfessionals, (_, category) => category, (_, __, agencyId) => agencyId],
  (list, _category, _agencyId) => list.filter((p) => p.availability),
)

export const selectSkillMatched = (state, category, agencyId) => {
  const keyword = (category || '').replace('-', ' ')
  return state.professionals.list.filter(
    (p) =>
      p.availability &&
      (!agencyId || p.agencyId === agencyId || !p.agencyId) &&
      (p.skills.some((s) => s.toLowerCase().includes(keyword)) ||
        p.name.toLowerCase().includes(keyword)),
  )
}

export default professionalSlice.reducer