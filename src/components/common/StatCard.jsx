const StatCard = ({ icon, label, value, accent = '#0d6efd', sub, onClick }) => {
  return (
    <div className="stat-card d-flex align-items-center gap-3" onClick={onClick} role={onClick ? 'button' : undefined}>
      <div className="stat-icon" style={{ background: `${accent}1a`, color: accent }}>
        {icon}
      </div>
      <div className="d-flex flex-column">
        <span className="text-muted small fw-semibold">{label}</span>
        <span className="fs-5 fw-bold money">{value}</span>
        {sub && <span className="small text-muted">{sub}</span>}
      </div>
    </div>
  )
}

export default StatCard