import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  FaUsers, FaToolbox, FaUserClock, FaClipboardList, FaCheckCircle, FaMoneyBillWave,
  FaBuilding, FaStar, FaShieldAlt, FaCheck, FaTimes, FaArrowRight, FaChartLine,
} from 'react-icons/fa'
import { selectAllUsers, setVerification } from '../../features/users/userSlice'
import { selectBookings, selectActiveCount, selectCompletedCount, selectPendingCount } from '../../features/bookings/bookingSlice'
import { selectPayments } from '../../features/payments/paymentSlice'
import { selectReviews } from '../../features/reviews/reviewSlice'
import { useCatalog } from '../../hooks/useCatalog'
import { toast } from '../../features/ui/uiSlice'
import StatDropdown from '../../components/common/StatDropdown'
import PageHeader from '../../components/common/PageHeader'
import ChartCard from '../../components/common/ChartCard'
import Avatar from '../../components/common/Avatar'
import StatusBadge from '../../components/common/StatusBadge'
import { ChartArea, ChartBar, ChartPie } from '../../components/charts/Recharts'
import { CATEGORIES } from '../../data/categories'
import { formatMoney } from '../../utils/format'

const AdminDashboardPage = () => {
  const dispatch = useDispatch()
  const users = useSelector(selectAllUsers)
  const bookings = useSelector(selectBookings)
  const payments = useSelector(selectPayments)
  const reviews = useSelector(selectReviews)
  const pendingCount = useSelector(selectPendingCount)
  const activeCount = useSelector(selectActiveCount)
  const completedCount = useSelector(selectCompletedCount)
  const catalog = useCatalog()

  const customers = users.filter((u) => u.role === 'customer').length
  const professionals = users.filter((u) => u.role === 'professional').length
  const agencies = users.filter((u) => u.role === 'agency').length
  const pendingVerification = users.filter((u) => u.verification === 'pending')
  const revenue = payments.filter((p) => p.type === 'payment').reduce((s, p) => s + Number(p.amount || 0), 0)
  const commission = payments.filter((p) => p.type === 'payment').reduce((s, p) => s + Number(p.commission || 0), 0)
  const avgRating = reviews.length
    ? Number((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1))
    : 0

  /* Monthly revenue + booking volume (last 8 months) */
  const monthData = []
  for (let i = 7; i >= 0; i -= 1) {
    const d = new Date()
    d.setDate(1)
    d.setMonth(d.getMonth() - i)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    const label = d.toLocaleDateString('en-IN', { month: 'short' })
    const monthRevenue = bookings
      .filter((b) => b.status === 'completed' && (b.date || '').slice(0, 7) === key)
      .reduce((s, b) => s + Number(b.price || 0), 0)
    const monthBookings = bookings.filter((b) => (b.createdAt || b.date || '').slice(0, 7) === key).length
    monthData.push({ month: label, revenue: monthRevenue, bookings: monthBookings })
  }

  /* Status distribution */
  const statusData = [
    { name: 'Pending', value: pendingCount },
    { name: 'In Progress', value: bookings.filter((b) => ['accepted', 'assigned', 'on_the_way', 'arrived', 'in_progress'].includes(b.status)).length },
    { name: 'Completed', value: completedCount },
    { name: 'Cancelled', value: bookings.filter((b) => ['cancelled', 'rejected'].includes(b.status)).length },
  ].filter((d) => d.value > 0)

  /* Category distribution */
  const categoryData = CATEGORIES
    .map((c) => ({ name: c.name.split(' ')[0], bookings: bookings.filter((b) => b.category === c.id).length }))
    .sort((a, b) => b.bookings - a.bookings)

  /* Top providers by completed revenue */
  const providerMap = {}
  bookings.filter((b) => b.status === 'completed').forEach((b) => {
    const name = catalog.providerNameForBooking(b)
    if (!name || name === '—') return
    if (!providerMap[name]) providerMap[name] = { name, jobs: 0, revenue: 0 }
    providerMap[name].jobs += 1
    providerMap[name].revenue += Number(b.price || 0)
  })
  const topProviders = Object.values(providerMap).sort((a, b) => b.revenue - a.revenue).slice(0, 5)

  /* Top services by bookings */
  const serviceMap = {}
  bookings.forEach((b) => { serviceMap[b.serviceId] = (serviceMap[b.serviceId] || 0) + 1 })
  const topServices = Object.entries(serviceMap)
    .map(([id, count]) => ({ id, name: catalog.serviceById(id)?.name || 'Service', count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
  const maxServiceCount = topServices[0]?.count || 1

  const recent = [...bookings]
    .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
    .slice(0, 6)
  const custName = (id) => users.find((u) => u.id === id)?.name || '—'

  const ACTIVE = ['pending', 'accepted', 'assigned', 'on_the_way', 'arrived', 'in_progress']
  const activeJobs = bookings.filter((b) => ACTIVE.includes(b.status))
  const completedJobs = bookings.filter((b) => b.status === 'completed')

  const rowFromUser = (u) => ({
    key: u.id,
    avatar: u.name,
    avatarId: u.id,
    name: u.name,
    meta: `${u.role} · ${u.location || '—'}`,
    right: u.role === 'agency' ? (u.verification === 'pending' ? 'Pending' : 'Verified') : u.rating ? `${u.rating}★` : 'Active',
  })
  const custRows = users.filter((u) => u.role === 'customer').slice(0, 6).map(rowFromUser)
  const proRows = users.filter((u) => u.role === 'professional').slice(0, 6).map(rowFromUser)
  const agencyRows = users.filter((u) => u.role === 'agency').slice(0, 6).map(rowFromUser)
  const pendingRows = pendingVerification.slice(0, 6).map((u) => ({
    key: u.id, avatar: u.name, avatarId: u.id, name: u.name,
    meta: `${u.role} · ${u.location || '—'}`, right: 'Pending',
  }))
  const jobRow = (b) => ({
    key: b.id,
    icon: <FaClipboardList />,
    name: catalog.serviceById(b.serviceId)?.name || 'Service',
    meta: `${custName(b.customerId)} · ${b.bookingId}`,
    right: formatMoney(b.price),
  })
  const activeJobRows = [...activeJobs].sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)).map(jobRow)
  const completedJobRows = [...completedJobs].sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date)).map(jobRow)
  const paymentRows = payments
    .filter((p) => p.type === 'payment')
    .sort((a, b) => new Date(b.date || b.bookingId) - new Date(a.date || a.bookingId))
    .slice(0, 6)
    .map((p) => ({
      key: p.id,
      icon: <FaMoneyBillWave />,
      name: custName(p.userId),
      meta: `#${p.bookingId || '—'} · ${p.method || '—'} · ${p.status || ''}`,
      right: formatMoney(p.amount),
    }))
  const commissionRows = payments
    .filter((p) => p.type === 'payment' && p.commission)
    .sort((a, b) => new Date(b.date || b.bookingId) - new Date(a.date || a.bookingId))
    .slice(0, 6)
    .map((p) => ({
      key: p.id,
      icon: <FaBuilding />,
      name: custName(p.userId),
      meta: `#${p.bookingId || '—'} · ${p.status || ''}`,
      right: formatMoney(p.commission),
    }))
  const ratingRows = [...reviews]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 6)
    .map((r) => ({
      key: r.id,
      icon: <FaStar />,
      name: users.find((u) => u.id === r.providerId)?.name || 'Provider',
      meta: `${catalog.serviceById(r.serviceId)?.name || 'Service'} · ${r.comment ? `${r.comment.slice(0, 36)}…` : 'No comment'}`,
      right: `${r.rating}★`,
    }))

  const resolveVerification = (u, verification) => {
    dispatch(setVerification({ id: u.id, verification }))
    toast(dispatch, `${u.name} marked ${verification}.`, verification === 'verified' ? 'success' : 'warning', 'Verification')
  }

  return (
    <div>
      <PageHeader
        title="Admin Overview"
        subtitle="Platform-wide monitoring, verification and compliance at a glance."
        actions={
          <>
            <span className="badge badge-soft-brand d-inline-flex align-items-center gap-1"><FaShieldAlt /> Platform</span>
            <Link to="/admin/reports" className="btn btn-brand btn-sm rounded-pill">Reports <FaArrowRight size={10} /></Link>
          </>
        }
      />

      {/* KPI options — single attractive overview box */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="overview-box">
            <div className="overview-box-head">
              <span className="stat-icon"><FaChartLine /></span>
              <div className="flex-grow-1">
                <div className="fw-bold">Platform Overview</div>
                <div className="small" style={{ opacity: 0.85 }}>Click any metric to see customers, professionals, agencies &amp; job details</div>
              </div>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.18)', color: '#fff', fontWeight: 600 }}>LIVE</span>
            </div>
            <div className="overview-box-body">
              <div className="row g-3">
                <div className="col-6 col-md-4 col-xl-3">
                  <StatDropdown
                    variant="tile"
                    icon={<FaUsers />}
                    label="Total Users"
                    value={users.length}
                    accent="#0d6efd"
                    sub={`${customers} customers`}
                    to="/admin/users"
                    sections={[
                      { title: `Customers (${users.filter((u) => u.role === 'customer').length})`, rows: custRows },
                      { title: `Professionals (${professionals})`, rows: proRows },
                      { title: `Agencies (${agencies})`, rows: agencyRows },
                    ]}
                  />
                </div>
                <div className="col-6 col-md-4 col-xl-3">
                  <StatDropdown
                    variant="tile"
                    icon={<FaToolbox />}
                    label="Professionals"
                    value={professionals}
                    accent="#20c997"
                    sub={`${agencies} agencies`}
                    to="/admin/users"
                    sections={[
                      { title: 'Independent pros', rows: proRows.slice(0, 4) },
                      { title: 'Agencies', rows: agencyRows },
                    ]}
                  />
                </div>
                <div className="col-6 col-md-4 col-xl-3">
                  <StatDropdown
                    variant="tile"
                    icon={<FaUserClock />}
                    label="Pending Verif."
                    value={pendingVerification.length}
                    accent="#f5a623"
                    to="/admin/users"
                    items={pendingRows}
                  />
                </div>
                <div className="col-6 col-md-4 col-xl-3">
                  <StatDropdown
                    variant="tile"
                    icon={<FaClipboardList />}
                    label="Active Jobs"
                    value={activeCount}
                    accent="#6f42c1"
                    to="/admin/bookings"
                    items={activeJobRows}
                  />
                </div>
                <div className="col-6 col-md-4 col-xl-3">
                  <StatDropdown
                    variant="tile"
                    icon={<FaCheckCircle />}
                    label="Completed Jobs"
                    value={completedCount}
                    accent="#20c997"
                    sub={`${pendingCount} pending`}
                    to="/admin/bookings"
                    items={completedJobRows}
                  />
                </div>
                <div className="col-6 col-md-4 col-xl-3">
                  <StatDropdown
                    variant="tile"
                    icon={<FaMoneyBillWave />}
                    label="Total Revenue"
                    value={formatMoney(revenue)}
                    accent="#0aa2a0"
                    to="/admin/payments"
                    items={paymentRows}
                  />
                </div>
                <div className="col-6 col-md-4 col-xl-3">
                  <StatDropdown
                    variant="tile"
                    icon={<FaBuilding />}
                    label="Commission"
                    value={formatMoney(commission)}
                    accent="#d63384"
                    to="/admin/payments"
                    items={commissionRows}
                  />
                </div>
                <div className="col-6 col-md-4 col-xl-3">
                  <StatDropdown
                    variant="tile"
                    icon={<FaStar />}
                    label="Avg. Rating"
                    value={avgRating}
                    accent="#f5b942"
                    sub={`${reviews.length} reviews`}
                    to="/admin/reviews"
                    items={ratingRows}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trend + status */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <ChartCard title="Revenue & Bookings" subtitle="Last 8 months">
            <ChartArea
              data={monthData}
              xKey="month"
              series={[
                { key: 'revenue', name: 'Revenue', color: '#0d6efd' },
                { key: 'bookings', name: 'Bookings', color: '#20c997' },
              ]}
              height={260}
            />
          </ChartCard>
        </div>
        <div className="col-lg-4">
          <ChartCard title="Bookings by Status" subtitle="All time">
            <ChartPie data={statusData} height={260} />
          </ChartCard>
        </div>
      </div>

      {/* Category + verification queue */}
      <div className="row g-4 mb-4">
        <div className="col-lg-7">
          <ChartCard title="Services by Category" subtitle="Total bookings per category">
            <ChartBar
              data={categoryData}
              xKey="name"
              series={[{ key: 'bookings', name: 'Bookings', color: '#6f42c1' }]}
              height={280}
            />
          </ChartCard>
        </div>
        <div className="col-lg-5">
          <div className="card card-plain h-100">
            <div className="card-header bg-transparent py-3 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold mb-0">Verification Queue</h6>
              <Link to="/admin/users" className="small">Manage <FaArrowRight size={10} /></Link>
            </div>
            <div className="card-body pt-0" style={{ maxHeight: 320, overflowY: 'auto' }}>
              {pendingVerification.length === 0 && (
                <div className="text-muted text-center py-4">All verifications resolved.</div>
              )}
              {pendingVerification.slice(0, 7).map((u) => (
                <div key={u.id} className="d-flex align-items-center gap-2 py-2 border-bottom">
                  <Avatar name={u.name} id={u.id} size="sm" />
                  <div className="flex-grow-1">
                    <div className="fw-semibold small" style={{ color: 'var(--text)' }}>{u.name}</div>
                    <div className="text-muted small text-capitalize">{u.role} · {u.location || '—'}</div>
                  </div>
                  <button type="button" className="btn btn-sm btn-success btn-icon" onClick={() => resolveVerification(u, 'verified')} title="Approve"><FaCheck /></button>
                  <button type="button" className="btn btn-sm btn-outline-danger btn-icon" onClick={() => resolveVerification(u, 'rejected')} title="Reject"><FaTimes /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent bookings + top lists */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card card-plain h-100">
            <div className="card-header bg-transparent py-3 d-flex justify-content-between align-items-center">
              <h6 className="fw-bold mb-0">Recent Bookings</h6>
              <Link to="/admin/bookings" className="small">View all <FaArrowRight size={10} /></Link>
            </div>
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead className="small text-muted">
                  <tr><th className="ps-3">#</th><th>Customer</th><th>Service</th><th>Amount</th><th className="text-end pe-3">Status</th></tr>
                </thead>
                <tbody>
                  {recent.map((b) => (
                    <tr key={b.id}>
                      <td className="ps-3 small text-muted">{b.bookingId}</td>
                      <td className="small">{custName(b.customerId)}</td>
                      <td className="small">{catalog.serviceById(b.serviceId)?.name || '—'}</td>
                      <td className="money small">{formatMoney(b.price)}</td>
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

        <div className="col-lg-4">
          <div className="card card-plain p-3 mb-4">
            <h6 className="fw-bold mb-3"><FaMoneyBillWave className="text-primary me-1" /> Top Providers</h6>
            {topProviders.map((p, i) => (
              <div key={p.name} className="d-flex align-items-center gap-2 py-2 border-bottom">
                <span className="badge bg-soft-brand">{i + 1}</span>
                <Avatar name={p.name} size="sm" />
                <div className="flex-grow-1">
                  <div className="fw-semibold small" style={{ color: 'var(--text)' }}>{p.name}</div>
                  <div className="text-muted small">{p.jobs} jobs</div>
                </div>
                <span className="money small">{formatMoney(p.revenue)}</span>
              </div>
            ))}
            {topProviders.length === 0 && <div className="text-muted small">No completed jobs yet.</div>}
          </div>

          <div className="card card-plain p-3">
            <h6 className="fw-bold mb-3"><FaClipboardList className="text-primary me-1" /> Top Services</h6>
            {topServices.map((s) => (
              <div key={s.id} className="mb-3">
                <div className="d-flex justify-content-between small mb-1">
                  <span className="text-truncate" style={{ maxWidth: '78%' }}>{s.name}</span>
                  <span className="text-muted">{s.count}</span>
                </div>
                <div className="progress" style={{ height: 6 }}>
                  <div className="progress-bar" role="progressbar" style={{ width: `${(s.count / maxServiceCount) * 100}%`, background: 'var(--brand)' }} aria-valuenow={s.count} aria-valuemin={0} aria-valuemax={maxServiceCount} />
                </div>
              </div>
            ))}
            {topServices.length === 0 && <div className="text-muted small">No service bookings yet.</div>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage
