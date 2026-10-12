import { createSlice } from '@reduxjs/toolkit'
import { uid } from '../../utils/storage'

const initialState = {
  toasts: [],
  confirm: null,
}

let TOAST_SEQ = 0

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    pushToast: (state, action) => {
      const { message, type = 'success', title } = action.payload
      state.toasts.push({
        id: `t${Date.now()}_${TOAST_SEQ}`,
        message,
        type,
        title: title || (type === 'success' ? 'Success' : type === 'error' ? 'Error' : type === 'info' ? 'Info' : 'Attention'),
      })
      TOAST_SEQ += 1
      if (state.toasts.length > 4) state.toasts.shift()
    },
    dismissToast: (state, action) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload)
    },
    openConfirm: (state, action) => {
      state.confirm = { ...action.payload, id: uid('cfm') }
    },
    closeConfirm: (state) => {
      state.confirm = null
    },
  },
})

export const { pushToast, dismissToast, openConfirm, closeConfirm } = uiSlice.actions

export const toast = (dispatch, message, type = 'success', title) =>
  dispatch(pushToast({ message, type, title }))

export const selectToasts = (state) => state.ui.toasts
export const selectConfirm = (state) => state.ui.confirm
export default uiSlice.reducer