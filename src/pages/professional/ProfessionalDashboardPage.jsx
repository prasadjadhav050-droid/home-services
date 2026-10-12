import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { FaBriefcase, FaHourglassHalf, FaUserClock, FaCheckDouble, FaMoneyBillWave, FaClock, FaStar, FaInbox, FaArrowRight, FaToggleOn, FaToggleOff } from 'react-icons/fa'
import { selectBookingsByProfessional } from '../../features/bookings/bookingSlice'
import { selectPaymentsForUser } from '../../features/payments/paymentSlice'
import { selectProfessionalById, toggleAvailability } from '../../features/professionals/professionalSlice'
import { selectAllUsers } from '../../features/users/userSlice'
import { toast } from '../../features/ui/uiSlice'
import StatCard from '../../components/common/StatCard'
import PageHeader from '../../components/common/PageHeader'
import Avatar from '../../components/common/Avatar'
import StatusBadge from '../../components/common/StatusBadge'
import RatingStars from '../../components/common/RatingStars'
import { useCatalog } from '../../hooks/useCatalog'
import { formatMoney, timeAgo } from '../../utils/format'
import { ChartBar } from '../../components/charts/Recharts'
import ChartCard from '../../components/common/ChartCard'

const ProfessionalDashboardPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.currentUser)
  const profile = useSelector((s) => selectProfessionalById(s, user?.id))
  const bookings = useSelector((s) => selectBookingsByProfessional(s, user?.id))
  const payouts = useSelector((s) => selectPaymentsForUser(s, user?.id, 'payout'))
  const withdrawals = useSelector((s) => selectPaymentsForUser(s, user?.id, 'withdrawal'))
  const catalog = useCatalog()
  const users = useSelector(selectAllUsers)
  const custName = (id) => users.find((u) => u.id === id)?.name || 'Customer'

  const pending = bookings.filter((b) => b.status === 'pending')
  const active = bookings.filter((b) => ['accepted', 'assigned', 'on_the_way', 'arrived', 'in_progress'].includes(b.status))
  const completed = bookings.filter((b) => b.status === 'completed')
  const earned = payouts.reduce((s, p) => s + Number(p.amount || 0), 0)
  const withdrawn = withdrawals.filter((w) => w.status === 'completed').reduce((s, p) => s + Number(p.amount || 0), 0)
  const balance = earned - withdrawn
  const pendingPayout = payouts.filter((p) => p.status === 'pending').reduce((s, p) => s + Number(p.amount || 0), 0)

  const monthData = []
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const key = d.toISOString().slice(0, 7)
    const month = d.toLocaleDateString('en-IN', { month: 'short' })
    const earn = payouts.filter((p) => (p.date || '').slice(0, 7) === key).reduce((s, p) => s + Number(p.amount || 0), 0)
    const jobs = completed.filter((b) => (b.date || '').slice(0, 7) === key).length
    monthData.push({ month, earn, jobs })
  }

  const recent = [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5)

  return (
    <div>
      <PageHeader
        title={`Hi ${profile?.name?.split(' ')[0] || 'there'} 👋`}
        subtitle={`${profile?.skills?.[0] || 'Service professional'} · ${profile?.location}`}
        actions={
          <>
            <Link to="/professional/requests" className="btn btn-outline-brand btn-sm btn-pill"><FaInbox className="me-1" size={11} /> Requests {pending.length > 0 && <span className="badge bg-danger ms-1">{pending.length}</span>}</Link>
            <Link to="/professional/schedule" className="btn btn-brand btn-sm btn-pill">Manage Schedule</Link>
          </>
        }
      />

      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3"><StatCard icon={<FaBriefcase />} label="Total Jobs" value={bookings.length} accent="#0d6efd" sub={`${completed.length} completed`} /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaHourglassHalf />} label="Pending Requests" value={pending.length} accent="#f5a623" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaUserClock />} label="Active Jobs" value={active.length} accent="#20c997" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaCheckDouble />} label="Completed Jobs" value={completed.length} accent="#7a5af8" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaMoneyBillWave />} label="Total Earnings" value={formatMoney(earned)} accent="#0aa2a0" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaClock />} label="Pending Payments" value={formatMoney(pendingPayout)} accent="#d63384" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaWalletIcon />} label="Available Balance" value={formatMoney(balance)} accent="#6c5ce7" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaStar />} label="Average Rating" value={profile?.rating || '—'} accent="#f5a623" sub={`${profile?.reviewCount || 0} reviews`} /></div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h6 className="fw-bold m-0"><FaInbox className="text-primary me-1" /> Recent bookings</h6>
            <Link to="/professional/jobs" className="small">View jobs <FaArrowRight size={10} /></Link>
          </div>
          <div className="card card-plain p-2">
            {recent.map((b) => (
              <div key={b.id} className="border-bottom py-2 px-2 last:border-0 d-flex align-items-center gap-3">
                <Avatar name={custName(b.customerId)} id={b.customerId} size="sm" />
                <div className="flex-grow-1">
                  <div className="fw-semibold small">{catalog.serviceById(b.serviceId)?.name}</div>
                  <div className="text-muted small">{b.bookingId} · {timeAgo(b.createdAt)}</div>
                </div>
                <span className="money small">{formatMoney(b.price)}</span>
                <StatusBadge status={b.status} />
              </div>
            ))}
            {!recent.length && <div className="text-muted text-center py-4 small">No bookings yet.</div>}
          </div>
        </div>
        <div className="col-lg-4">
          <ChartCard title="Monthly Earnings & Jobs" subtitle="Last 6 months">
            <ChartBar data={monthData} xKey="month" series={[{ key: 'earn', name: 'Earnings', color: '#0aa2a0' }, { key: 'jobs', name: 'Jobs', color: '#0d6efd' }]} height={230} />
          </ChartCard>
          <div className="card card-plain p-3 mt-3 d-flex flex-row align-items-center gap-3">
            <Avatar name={profile?.name} id={profile?.id} size="lg" />
            <div className="flex-grow-1">
              <div className="fw-bold small">{profile?.name}</div>
              <div className="d-flex align-items-center gap-2">
                <RatingStars value={profile?.rating || 0} size={11} />
                <span className="small">{profile?.rating || '—'}</span>
              </div>
              <div className="text-muted small">Availability: {profile?.availability ? 'Available' : 'Offline'}</div>
            </div>
            <button
              type="button"
              className={`btn ${profile?.availability ? 'btn-light border' : 'btn-success'} btn-sm `}
              onClick={() => {
                dispatch(toggleAvailability(profile.id))
                toast(dispatch, profile?.availability ? 'You are now offline. New requests are paused.' : 'You are now online. Start accepting requests!', 'info', 'Availability')
              }}
            >
              {profile?.availability ? <><FaToggleOn /> Go offline</> : <><FaToggleOff /> Go online</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const FaWalletIcon = () => <FaMoneyBillWave />

export default ProfessionalDashboardPage