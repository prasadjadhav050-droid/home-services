import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { FaUsers, FaBriefcase, FaDollarSign, FaStar, FaClipboardCheck, FaUserClock, FaCalendarAlt, FaBell, FaTools, FaArrowUp } from 'react-icons/fa'
import { selectBookings } from '../../features/bookings/bookingSlice'
import { selectPayments } from '../../features/payments/paymentSlice'
import { selectProfessionals } from '../../features/professionals/professionalSlice'
import { selectAllUsers } from '../../features/users/userSlice'
import { useCatalog } from '../../hooks/useCatalog'
import StatCard from '../../components/common/StatCard'
import PageHeader from '../../components/common/PageHeader'
import Avatar from '../../components/common/Avatar'
import StatusBadge from '../../components/common/StatusBadge'
import RatingStars from '../../components/common/RatingStars'
import ChartCard from '../../components/common/ChartCard'

const MiniStat = ({ title, value, icon, tone }) => (
  <div className="col-sm-6 col-xl-3">
    <StatCard title={title} value={Number(value).toLocaleString()} icon={icon} tone={tone} />
  </div>
)

const AgencyDashboardPage = () => {
  const bookings = useSelector(selectBookings)
  const payments = useSelector(selectPayments)
  const professionals = useSelector(selectProfessionals)
  const users = useSelector(selectAllUsers)
  const catalog = useCatalog()

  const stats = useMemo(() => {
    const team = professionals.filter((p) => p.agencyId || users.some((u) => u.role === 'agency' && (u.id === p.agencyId || u.agencyId === p.agencyId)))
    const active = bookings.filter((b) => b.status === 'active').length
    const pending = bookings.filter((b) => b.status === 'pending').length
    const revenue = payments.filter((p) => p.type === 'payment').reduce((s, p) => s + Number(p.amount || 0), 0)
    const commission = payments.filter((p) => p.type === 'payout').reduce((s, p) => s + Number(p.amount || 0), 0)
    return { team: team.length, active, pending, revenue, commission }
  }, [bookings, payments, professionals, users])

  const recent = useMemo(
    () => [...bookings].sort((a, b) => new Date(b.createdAt || b.bookingDate) - new Date(a.createdAt || a.bookingDate)).slice(0, 6),
    [bookings],
  )

  const rating = useMemo(() => {
    const all = professionals.filter((p) => p.agencyId)
    if (!all.length) return 0
    return all.reduce((s, p) => s + Number(p.rating || 0), 0) / all.length
  }, [professionals])

  return (
    <div>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
        <div>
          <PageHeader title="Agency Overview" subtitle="Track agency bookings, team performance, and revenue." />
        </div>
        <span className="badge badge-soft-brand d-inline-flex align-items-center gap-1"><FaBell /> 3</span>
      </div>

      <div className="row g-3 mb-4">
        <MiniStat title="Professionals" value={stats.team} icon={<FaUsers />} tone="brand" />
        <MiniStat title="Active Bookings" value={stats.active} icon={<FaBriefcase />} tone="primary" />
        <MiniStat title="Pending" value={stats.pending} icon={<FaClipboardCheck />} tone="warning" />
        <MiniStat title="Revenue" value={stats.revenue} icon={<FaDollarSign />} tone="success" />
      </div>

      <div className="row g-3">
        <div className="col-lg-7">
          <ChartCard
            title="Revenue Trend"
            subtitle="Commission-adjusted agency revenue"
            type="area"
            data={[5400, 6100, 7800, 6900, 9200, 8600, 10400, 11800, 13500, 12900, 15200, 17600]}
            labels={['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']}
          />
        </div>
        <div className="col-lg-5">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-header bg-transparent py-3">
              <h6 className="fw-bold mb-0" style={{ color: 'var(--text)' }}>Team Pulse</h6>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="text-muted small">Avg. Rating</span>
                <RatingStars value={rating} />
              </div>
              <div className="d-flex align-items-center justify-content-between mb-3">
                <span className="text-muted small">Professionals</span>
                <span className="fw-semibold" style={{ color: 'var(--text)' }}>{stats.team}</span>
              </div>
              <div className="d-flex align-items-center justify-content-between">
                <span className="text-muted small">Commission owed</span>
                <span className="fw-semibold" style={{ color: 'var(--brand)' }}>${stats.commission.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card border-0 shadow-sm mt-4">
        <div className="card-header bg-transparent py-3">
          <h6 className="fw-bold mb-0" style={{ color: 'var(--text)' }}>Recent Bookings</h6>
        </div>
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="small text-muted">
              <tr><th className="ps-3">#</th><th>Customer</th><th>Professional</th><th>Amount</th><th className="text-end pe-3">Status</th></tr>
            </thead>
            <tbody>
              {recent.map((b) => (
                <tr key={b.id}>
                  <td className="ps-3 small text-muted">{b.id}</td>
                  <td className="small">{b.customerName || '—'}</td>
                  <td className="small">{catalog.proName(b.professionalId || b.providerId)}</td>
                  <td className="small fw-semibold" style={{ color: 'var(--text)' }}>${Number(b.amount || b.price || 0).toLocaleString()}</td>
                  <td className="text-end pe-3"><StatusBadge status={b.status} /></td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr><td colSpan={5} className="text-center py-4 text-muted">No bookings yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AgencyDashboardPage
