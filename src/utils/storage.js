const PREFIX = 'sprint_'

export const loadState = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export const saveState = (key, value) => {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(value))
  } catch {
    /* storage full or unavailable — ignore in-memory only cases */
  }
}

export const removeState = (key) => {
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {
    /* noop */
  }
}

export const clearAllState = () => {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith(PREFIX))
      .forEach((k) => localStorage.removeItem(k))
  } catch {
    /* noop */
  }
}

export const uid = (prefix = 'id') => {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase()
  const time = Date.now().toString(36).slice(-4).toUpperCase()
  return `${prefix}_${time}${rand}`
}

export const generateBookingId = () => {
  const t = Date.now().toString().slice(-6)
  const r = Math.floor(1000 + Math.random() * 9000)
  return `SB-${t}${r}`
}