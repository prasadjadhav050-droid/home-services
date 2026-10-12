import { useMemo } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  FaClipboardCheck, FaCalendarCheck, FaHourglassHalf, FaWallet, FaArrowRight,
  FaStar, FaTruck, FaCheckDouble, FaBell, FaFire, FaCheck, FaAward,
  FaChartLine, FaChartPie, FaChartBar, FaThLarge, FaHeart,
  FaSearch, FaPlus, FaMoneyBillWave, FaComments, FaUser,
} from 'react-icons/fa'
import { selectBookingsByCustomer } from '../../features/bookings/bookingSlice'
import { selectReviews } from '../../features/reviews/reviewSlice'
import { selectNotificationsForUser } from '../../features/notifications/notificationSlice'
import StatCard from '../../components/common/StatCard'
import BookingCard from '../../components/cards/BookingCard'
import ServiceCard from '../../components/cards/ServiceCard'
import ProfessionalCard from '../../components/cards/ProfessionalCard'
import WelcomeBanner from '../../components/common/WelcomeBanner'
import QuickActions from '../../components/common/QuickActions'
import ActivityTimeline from '../../components/common/ActivityTimeline'
import ChartCard from '../../components/common/ChartCard'
import { ChartArea, ChartBar, ChartPie } from '../../components/charts/Recharts'
import { useCatalog } from '../../hooks/useCatalog'
import { CATEGORIES } from '../../data/categories'
import { formatMoney, formatDate } from '../../utils/format'

const FLOW = ['pending', 'accepted', 'assigned', 'on_the_way', 'arrived', 'in_progress']

const STEPS = [
  { key: 'pending', label: 'Requested' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'assigned', label: 'Assigned' },
  { key: 'on_the_way', label: 'On the way' },
  { key: 'arrived', label: 'Arrived' },
  { key: 'in_progress', label: 'In progress' },
]

const QUICK_ACTIONS = [
  { label: 'Browse', to: '/services', icon: <FaSearch />, accent: '#1a56db' },
  { label: 'Book', to: '/book', icon: <FaPlus />, accent: '#20c997' },
  { label: 'Bookings', to: '/customer/bookings', icon: <FaClipboardCheck />, accent: '#0d6efd' },
  { label: 'Payments', to: '/customer/payments', icon: <FaMoneyBillWave />, accent: '#7a5af8' },
  { label: 'Reviews', to: '/customer/reviews', icon: <FaComments />, accent: '#f5a623' },
  { label: 'Profile', to: '/customer/profile', icon: <FaUser />, accent: '#d63384' },
]

const CustomerDashboardPage = () => {
  const navigate = useNavigate()
  const user = useSelector((s) => s.auth.currentUser)
  const bookings = useSelector((s) => selectBookingsByCustomer(s, user?.id))
  const reviews = useSelector(selectReviews).filter((r) => r.customerId === user?.id)
  const notifications = useSelector((s) => selectNotificationsForUser(s, user?.id))
  const catalog = useCatalog()

  const upcoming = useMemo(
    () => bookings.filter((b) => FLOW.includes(b.status)).sort((a, b) => new Date(a.date) - new Date(b.date)),
    [bookings],
  )
  const completed = useMemo(() => bookings.filter((b) => b.status === 'completed'), [bookings])
  const pending = useMemo(() => bookings.filter((b) => b.status === 'pending'), [bookings])
  const totalSpent = completed.reduce((s, b) => s + Number(b.price || 0), 0) + pending.reduce((s, b) => s + Number(b.price || 0), 0)
  const avgValue = bookings.length ? Math.round(bookings.reduce((s, b) => s + Number(b.price || 0), 0) / bookings.length) : 0
  const unread = notifications.filter((n) => !n.read).length

  const next = upcoming[0]
  const stepIndex = Math.max(0, STEPS.findIndex((s) => s.key === next?.status))

  const chart = useMemo(() => {
    const map = {}
    bookings.forEach((b) => {
      if (b.status === 'completed') {
        const m = (b.date || '').slice(0, 7)
        map[m] = (map[m] || 0) + Number(b.price || 0)
      }
    })
    return Object.entries(map).sort().slice(-8).map(([m, v]) => ({
      month: new Date(m + '-01').toLocaleDateString('en-IN', { month: 'short' }),
      spent: v,
    }))
  }, [bookings])

  const categoryChart = useMemo(() => {
    const counts = {}
    bookings.forEach((b) => {
      const catId = catalog.serviceById(b.serviceId)?.category || b.category
      counts[catId] = (counts[catId] || 0) + 1
    })
    return CATEGORIES
      .filter((c) => counts[c.id])
      .map((c) => ({ name: c.name, value: counts[c.id], color: c.color }))
  }, [bookings, catalog])

  const monthlyChart = useMemo(() => {
    const map = {}
    bookings.forEach((b) => {
      const key = (b.createdAt || b.date || '').slice(0, 7)
      if (!key) return
      map[key] = (map[key] || 0) + 1
    })
    return Object.entries(map).sort().slice(-8).map(([m, v]) => ({
      month: new Date(m + '-01').toLocaleDateString('en-IN', { month: 'short' }),
      count: v,
    }))
  }, [bookings])

  const recent = useMemo(
    () => [...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 4),
    [bookings],
  )

  const recommended = useMemo(() => {
    const featured = catalog.services.filter((s) => s.featured)
    return (featured.length ? featured : catalog.services).slice(0, 4)
  }, [catalog])

  const topPros = useMemo(
    () => [...catalog.professionals].sort((a, b) => (b.rating || 0) - (a.rating || 0)).slice(0, 3),
    [catalog],
  )

  const reviewable = completed.filter((b) => !reviews.some((r) => r.bookingId === b.bookingId))

  return (
    <div>
      <WelcomeBanner
        user={user}
        next={next}
        nextService={next ? catalog.serviceById(next.serviceId) : null}
        nextProvider={next ? catalog.providerNameForBooking(next) : ''}
      />

      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3">
          <StatCard icon={<FaClipboardCheck />} label="Total Bookings" value={bookings.length} accent="#0d6efd" sub={`${completed.length} completed`} onClick={() => navigate('/customer/bookings')} />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard icon={<FaCalendarCheck />} label="Upcoming" value={upcoming.length} accent="#20c997" sub="active services" />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard icon={<FaHourglassHalf />} label="Pending" value={pending.length} accent="#f5a623" sub="awaiting response" />
        </div>
        <div className="col-6 col-xl-3">
          <StatCard icon={<FaWallet />} label="Total Spending" value={formatMoney(totalSpent)} accent="#7a5af8" sub="completed + pending" />
        </div>
      </div>

      <div className="row g-4">
        <div className="col-xl-8">
          {next && (
            <div className="card card-plain p-4 mb-4 next-up-card">
              <div className="d-flex justify-content-between align-items-start flex-wrap gap-2 mb-3">
                <div className="d-flex align-items-center gap-2">
                  <span className="stat-icon" style={{ background: '#20c9971a', color: '#0ca678' }}><FaTruck /></span>
                  <div>
                    <h6 className="fw-bold m-0">Up next</h6>
                    <div className="text-muted small">{next.bookingId} · {formatDate(next.date)} · {next.time || next.preferredTime}</div>
                  </div>
                </div>
                <button type="button" className="btn btn-brand btn-sm btn-pill" onClick={() => navigate(`/customer/tracking/${next.id}`)}>
                  <FaTruck className="me-1" size={11} /> Track service
                </button>
              </div>

              <div className="mini-stepper mb-3">
                {STEPS.map((s, i) => (
                  <div key={s.key} className={`mini-step ${i < stepIndex ? 'done' : ''} ${i === stepIndex ? 'active' : ''}`}>
                    <span className="mini-step-dot">{i < stepIndex ? <FaCheck size={8} /> : null}</span>
                    <span className="mini-step-label">{s.label}</span>
                  </div>
                ))}
              </div>

              <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 border-top pt-3">
                <div className="d-flex align-items-center gap-2">
                  <span className="fw-semibold small">{catalog.serviceById(next.serviceId)?.name}</span>
                  <span className="badge bg-soft-dark">{next.category}</span>
                </div>
                <div className="text-muted small">Provider: <strong>{catalog.providerNameForBooking(next)}</strong> · {formatMoney(next.price)}</div>
              </div>
            </div>
          )}

          <div className="row g-4">
            <div className="col-md-6">
              <ChartCard title={<><FaChartLine className="text-primary me-1" />Spending Trend</>} subtitle="Completed bookings">
                <ChartArea data={chart} xKey="month" series={[{ key: 'spent', name: 'Spent', color: '#7a5af8' }]} height={220} />
              </ChartCard>
            </div>
            <div className="col-md-6">
              <ChartCard title={<><FaChartPie className="text-primary me-1" />Bookings by Category</>} subtitle="Your service mix">
                {categoryChart.length ? (
                  <ChartPie data={categoryChart} height={220} />
                ) : (
                  <div className="text-muted small text-center py-5">No data yet.</div>
                )}
              </ChartCard>
            </div>
          </div>

          <div className="mt-4">
            <ChartCard title={<><FaChartBar className="text-primary me-1" />Booking Activity</>} subtitle="Bookings per month" className="h-auto">
              <ChartBar data={monthlyChart} xKey="month" series={[{ key: 'count', name: 'Bookings', color: '#1a56db' }]} height={220} />
            </ChartCard>
          </div>

          <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
            <h6 className="fw-bold m-0 d-flex align-items-center gap-2"><FaCalendarCheck className="text-primary" /> Recent bookings</h6>
            <Link to="/customer/bookings" className="small">View all <FaArrowRight size={10} /></Link>
          </div>
          <div className="row g-3">
            {recent.map((b) => (
              <div className="col-12 col-md-6" key={b.id}>
                <BookingCard
                  booking={b}
                  service={catalog.serviceById(b.serviceId)}
                  providerName={catalog.providerNameForBooking(b)}
                  onClick={() => navigate('/customer/bookings')}
                />
              </div>
            ))}
            {!recent.length && (
              <div className="col-12 text-muted text-center py-5">
                No bookings yet. <Link to="/services">Book your first service →</Link>
              </div>
            )}
          </div>
        </div>

        <div className="col-xl-4">
          <QuickActions items={QUICK_ACTIONS} />

          <div className="card card-plain p-3 mt-3">
            <h6 className="fw-bold mb-3">Your snapshot</h6>
            <div className="row g-2">
              <div className="col-6">
                <div className="mini-stat">
                  <span className="mini-stat-ico bg-soft-success"><FaCheckDouble /></span>
                  <div><div className="mini-stat-value">{completed.length}</div><div className="mini-stat-label">Completed</div></div>
                </div>
              </div>
              <div className="col-6">
                <div className="mini-stat">
                  <span className="mini-stat-ico bg-soft-warning"><FaStar /></span>
                  <div><div className="mini-stat-value">{reviews.length}</div><div className="mini-stat-label">Reviews given</div></div>
                </div>
              </div>
              <div className="col-6">
                <div className="mini-stat">
                  <span className="mini-stat-ico bg-soft-danger"><FaBell /></span>
                  <div><div className="mini-stat-value">{unread}</div><div className="mini-stat-label">Unread alerts</div></div>
                </div>
              </div>
              <div className="col-6">
                <div className="mini-stat">
                  <span className="mini-stat-ico bg-soft-brand"><FaFire /></span>
                  <div><div className="mini-stat-value">{formatMoney(avgValue)}</div><div className="mini-stat-label">Avg. value</div></div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3">
            <ActivityTimeline items={notifications.slice(0, 5)} />
          </div>

          <div className="card card-plain p-3 mt-3">
            <h6 className="fw-bold mb-3 d-flex align-items-center gap-2"><FaAward className="text-primary" /> Top rated professionals</h6>
            <div className="d-flex flex-column gap-2">
              {topPros.map((p) => (
                <ProfessionalCard key={p.id} pro={p} showSkills={false} />
              ))}
            </div>
          </div>

          {reviewable.length > 0 ? (
            <div className="card card-brand p-3 mt-3">
              <div className="d-flex align-items-center gap-3">
                <span className="stat-icon" style={{ background: '#f5a62322', color: '#f5a623' }}><FaHeart /></span>
                <div className="flex-grow-1">
                  <div className="fw-semibold small">Rate your completed service</div>
                  <div className="text-muted small">{reviewable.length} booking{reviewable.length > 1 ? 's' : ''} awaiting your review</div>
                </div>
                <Link to="/customer/reviews" className="btn btn-brand btn-sm btn-pill">Review</Link>
              </div>
            </div>
          ) : (
            <div className="d-flex align-items-center gap-2 bg-soft-success rounded px-3 py-2 mt-3 small">
              <FaStar className="text-success" />
              <span>All caught up! Thanks for your reviews.</span>
            </div>
          )}
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mt-4 mb-3">
        <h6 className="fw-bold m-0 d-flex align-items-center gap-2"><FaThLarge className="text-primary" /> Recommended for you</h6>
        <Link to="/services" className="small">Explore all <FaArrowRight size={10} /></Link>
      </div>
      <div className="row g-3">
        {recommended.map((s) => (
          <div className="col-12 col-sm-6 col-lg-3" key={s.id}>
            <ServiceCard service={s} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default CustomerDashboardPage
