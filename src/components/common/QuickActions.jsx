import { Link } from 'react-router-dom'

const QuickActions = ({ items = [] }) => (
  <div className="card card-plain p-3">
    <h6 className="fw-bold mb-3">Quick actions</h6>
    <div className="quick-actions">
      {items.map((it) => (
        <Link key={it.label} to={it.to} className="quick-action">
          <span className="quick-action-ico" style={{ background: `${it.accent}1a`, color: it.accent }}>
            {it.icon}
          </span>
          <span className="quick-action-label">{it.label}</span>
        </Link>
      ))}
    </div>
  </div>
)

export default QuickActions
