import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit'
import { loadState, uid } from '../../utils/storage'
import { demoAccounts } from '../../data/seed'

export const AUTH_KEY = 'auth'

const persisted = loadState(AUTH_KEY, { currentUser: null, token: null })

const initialState = {
  currentUser: persisted?.currentUser ?? null,
  token: persisted?.token ?? null,
  loading: false,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, city }, { getState, rejectWithValue, dispatch }) => {
    const users = getState().users.list
    const user = users.find(
      (u) => u.email?.toLowerCase() === String(email).toLowerCase() && u.password === password,
    )
    if (!user) return rejectWithValue('Invalid email or password.')
    if (user.status === 'suspended') return rejectWithValue('Your account has been suspended. Contact support.')
    if (city) {
      dispatch({ type: 'users/updateUser', payload: { id: user.id, location: city } })
      return { user: { ...user, location: city }, token: uid('tok') }
    }
    return { user, token: uid('tok') }
  },
)

export const loginDemo = createAsyncThunk(
  'auth/loginDemo',
  async (role, { getState }) => {
    const email = demoAccounts.find((d) => d.role === role)?.email
    const users = getState().users.list
    const user = users.find((u) => u.email === email) ?? getState().users.list[0]
    return { user, token: uid('tok') }
  },
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload, { getState, rejectWithValue, dispatch }) => {
    const users = getState().users.list
    const exists = users.some((u) => u.email?.toLowerCase() === payload.email.toLowerCase())
    if (exists) return rejectWithValue('An account with this email already exists.')
    const { role } = payload
    const user = {
      id: uid('usr'),
      role,
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      location: payload.location || 'Delhi',
      password: payload.password,
      status: role === 'customer' ? 'active' : 'pending',
      verification: role === 'customer' ? undefined : 'pending',
      joinedAt: new Date().toISOString(),
    }
    dispatch({ type: 'users/addUser', payload: user })
    if (role === 'professional') {
      dispatch({
        type: 'professionals/addProfessional',
        payload: {
          id: user.id,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          location: payload.location,
          skills: (payload.skills || []).filter(Boolean),
          experience: Number(payload.experience || 0),
          hourlyRate: Number(payload.hourlyRate || 0),
          certifications: (payload.certifications || '').split(',').map((s) => s.trim()).filter(Boolean),
          bio: payload.bio || '',
          availability: payload.availability === 'available',
          rating: 0,
          reviewCount: 0,
          jobsCompleted: 0,
          schedule: { workingDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], start: '09:00', end: '18:00' },
          blockedSlots: [],
          agencyId: payload.agencyId || null,
        },
      })
    }
    if (role === 'agency') {
      dispatch({
        type: 'agencies/addAgency',
        payload: {
          id: user.id,
          name: payload.name,
          email: payload.email,
          phone: payload.phone,
          legalName: payload.companyName || payload.name,
          registration: payload.registration || '',
          address: payload.address || payload.location || '',
          website: payload.website || '',
          description: payload.description || '',
          servicesOffered: (payload.servicesOffered || []).filter(Boolean),
          locations: [payload.location || 'Delhi'],
          rating: 0,
          reviewCount: 0,
          staff: [],
        },
      })
    }
    dispatch({ type: 'users/persistNow' })
    return { user, token: uid('tok') }
  },
)

const PROFILE_LABEL = {
  customer: 'Preferred Service Grid',
  professional: 'Skill Expertise',
  agency: 'Agency Operations',
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setError: (state, action) => {
      state.error = action.payload
    },
    logout: (state) => {
      state.currentUser = null
      state.token = null
      state.error = null
    },
    updateProfile: (state, action) => {
      state.currentUser = { ...state.currentUser, ...action.payload }
    },
    setSession: (state, action) => {
      state.currentUser = action.payload.user
      state.token = action.payload.token
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (s) => { s.loading = true; s.error = null })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false
        s.currentUser = a.payload.user
        s.token = a.payload.token
      })
      .addCase(login.rejected, (s, a) => { s.loading = false; s.error = a.payload })
      .addCase(loginDemo.pending, (s) => { s.loading = true; s.error = null })
      .addCase(loginDemo.fulfilled, (s, a) => {
        s.loading = false
        s.currentUser = a.payload.user
        s.token = a.payload.token
      })
      .addCase(registerUser.pending, (s) => { s.loading = true; s.error = null })
      .addCase(registerUser.fulfilled, (s, a) => {
        s.loading = false
        s.currentUser = a.payload.user
        s.token = a.payload.token
      })
      .addCase(registerUser.rejected, (s, a) => { s.loading = false; s.error = a.payload })
  },
})

export const { logout, updateProfile, setSession, setError } = authSlice.actions

export const selectAuth = (state) => state.auth
export const selectCurrentUser = (state) => state.auth.currentUser
export const selectRole = (state) => state.auth.currentUser?.role
export const selectIsAuthenticated = (state) => Boolean(state.auth.currentUser)
export const selectAuthLoading = (state) => state.auth.loading
export const selectAuthError = (state) => state.auth.error
export const selectProfileLabel = createSelector([selectRole], (role) => PROFILE_LABEL[role] || 'Account')

export default authSlice.reducer