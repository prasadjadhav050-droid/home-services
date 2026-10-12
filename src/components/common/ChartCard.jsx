const ChartCard = ({ title, subtitle, actions, children, className = '' }) => (
  <div className={`card card-plain p-3 h-100 ${className}`}>
    <div className="d-flex align-items-center justify-content-between mb-2">
      <div>
        <h6 className="fw-bold m-0">{title}</h6>
        {subtitle && <span className="text-muted small">{subtitle}</span>}
      </div>
      {actions}
    </div>
    <div style={{ minHeight: 220 }}>{children}</div>
  </div>
)

export default ChartCard