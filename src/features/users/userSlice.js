import { createSlice, createSelector } from '@reduxjs/toolkit'
import { loadState, uid } from '../../utils/storage'
import { initialData } from '../../data/seed'

export const USERS_KEY = 'users'

const initialState = {
  list: loadState(USERS_KEY, initialData.users),
  loading: false,
  error: null,
}

export const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.list.push(action.payload)
    },
    updateUser: (state, action) => {
      const idx = state.list.findIndex((u) => u.id === action.payload.id)
      if (idx !== -1) state.list[idx] = { ...state.list[idx], ...action.payload }
    },
    removeUser: (state, action) => {
      state.list = state.list.filter((u) => u.id !== action.payload)
    },
    setStatus: (state, action) => {
      const { id, status } = action.payload
      const u = state.list.find((x) => x.id === id)
      if (u) u.status = status
    },
    setVerification: (state, action) => {
      const { id, verification } = action.payload
      const u = state.list.find((x) => x.id === id)
      if (u) u.verification = verification
      if (verification === 'verified' && u) u.status = 'active'
    },
    persistNow: (state) => state,
  },
})

export const { addUser, updateUser, removeUser, setStatus, setVerification, persistNow, selectCurrentUser } = userSlice.actions

export const selectAllUsers = (state) => state.users.list
export const selectUserById = (state, id) => state.users.list.find((u) => u.id === id)
export const selectUsersByRole = createSelector(
  [selectAllUsers, (_, role) => role],
  (list, role) => list.filter((u) => u.role === role),
)
export const selectCustomers = (state) => state.users.list.filter((u) => u.role === 'customer')
export const selectProfessionalsUsers = (state) => state.users.list.filter((u) => u.role === 'professional')
export const selectAgenciesUsers = (state) => state.users.list.filter((u) => u.role === 'agency')
export const selectPendingVerifications = createSelector([selectAllUsers], (list) =>
  list.filter((u) => u.verification === 'pending' || u.verification === 'rejected'),
)
export const selectActiveUsersCount = createSelector([selectAllUsers], (list) =>
  list.filter((u) => u.status === 'active').length,
)

export default userSlice.reducer