import { STATUS_META } from '../../data/categories'

const StatusBadge = ({ status, dot = true }) => {
  const meta = STATUS_META[status] || { label: String(status || 'unknown').replace(/_/g, ' '), cls: 'bg-soft-secondary' }
  return (
    <span className={`badge ${meta.cls}`}>
      {dot && <span className="status-dot" style={{ background: 'currentColor' }} />}
      {meta.label}
    </span>
  )
}

export default StatusBadge