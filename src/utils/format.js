export const formatMoney = (n, currency = '₹') =>
  `${currency}${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 })}`

export const formatDate = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}

export const formatDateTime = (iso) => {
  if (!iso) return '—'
  const d = new Date(iso)
  return `${d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · ${d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
}

export const timeAgo = (iso) => {
  if (!iso) return ''
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export const initials = (name = '?') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')

export const addDays = (iso, days) => {
  const d = iso ? new Date(iso) : new Date()
  d.setDate(d.getDate() + days)
  return d.toISOString()
}

export const monthKey = (iso) => {
  const d = new Date(iso)
  return d.toISOString().slice(0, 7)
}

export const monthLabel = (key) => {
  const [y, m] = key.split('-')
  const d = new Date(y, Number(m) - 1, 1)
  return d.toLocaleDateString('en-IN', { month: 'short' })
}

export const getInitialsColor = (name = '?') => {
  const colors = [
    '#0d6efd', '#6f42c1', '#d63384', '#dc3545', '#fd7e14',
    '#198754', '#0dcaf0', '#6610f2', '#e83e8c', '#20c997',
  ]
  let sum = 0
  for (let i = 0; i < name.length; i += 1) sum += name.charCodeAt(i)
  return colors[sum % colors.length]
}