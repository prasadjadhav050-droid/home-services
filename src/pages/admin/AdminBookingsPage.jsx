import { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { FaClipboardList, FaHourglassHalf, FaCheckCircle, FaMoneyBillWave, FaEye, FaSearch } from 'react-icons/fa'
import { selectBookings } from '../../features/bookings/bookingSlice'
import { selectAllUsers } from '../../features/users/userSlice'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import BookingTable from '../../components/cards/BookingTable'
import Modal from '../../components/common/Modal'
import StatusBadge from '../../components/common/StatusBadge'
import { EmptyState } from '../../components/common/Feedback'
import { useCatalog } from '../../hooks/useCatalog'
import { formatMoney, formatDate } from '../../utils/format'

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
]

const ACTIVE = ['accepted', 'assigned', 'on_the_way', 'arrived', 'in_progress']

const AdminBookingsPage = () => {
  const bookings = useSelector(selectBookings)
  const users = useSelector(selectAllUsers)
  const catalog = useCatalog()
  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')
  const [detail, setDetail] = useState(null)

  const customerName = (b) => users.find((u) => u.id === b.customerId)?.name || '—'

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return bookings
      .filter((b) => {
        if (tab === 'pending') return b.status === 'pending'
        if (tab === 'active') return ACTIVE.includes(b.status)
        if (tab === 'completed') return b.status === 'completed'
        if (tab === 'cancelled') return b.status === 'cancelled'
        return true
      })
      .filter((b) => {
        if (!q) return true
        const cName = users.find((u) => u.id === b.customerId)?.name || ''
        const haystack = `${b.bookingId} ${cName} ${catalog.serviceById(b.serviceId)?.name || ''}`.toLowerCase()
        return haystack.includes(q)
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }, [bookings, tab, query, users, catalog])

  const revenue = bookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + Number(b.price || 0), 0)

  return (
    <div>
      <PageHeader
        title="Bookings"
        subtitle="Every booking placed on the platform, across all customers and providers."
        actions={
          <div className="input-group input-group-sm" style={{ maxWidth: 280 }}>
            <span className="input-group-text bg-white"><FaSearch className="text-muted" /></span>
            <input
              type="search"
              className="form-control"
              placeholder="Search ID, customer, service…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        }
      />

      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3"><StatCard icon={<FaClipboardList />} label="Total Bookings" value={bookings.length} accent="#0d6efd" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaHourglassHalf />} label="Pending" value={bookings.filter((b) => b.status === 'pending').length} accent="#f5a623" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaCheckCircle />} label="Completed" value={bookings.filter((b) => b.status === 'completed').length} accent="#20c997" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaMoneyBillWave />} label="Completed Value" value={formatMoney(revenue)} accent="#6f42c1" /></div>
      </div>

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
        <ul className="nav nav-pills gap-1 flex-nowrap overflow-auto">
          {TABS.map((t) => (
            <li className="nav-item" key={t.key}>
              <button type="button" className={`nav-link py-1 px-3 ${tab === t.key ? 'active' : 'text-muted'}`} onClick={() => setTab(t.key)}>{t.label}</button>
            </li>
          ))}
        </ul>
        <span className="text-muted small">{filtered.length} shown</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<FaSearch />} title="No bookings found" message="Try a different tab or search term." />
      ) : (
        <BookingTable
          bookings={filtered}
          getService={(id) => catalog.serviceById(id)}
          getProvider={(b) => catalog.providerNameForBooking(b)}
          actionsFor={(b) => (
            <button type="button" className="btn btn-light border btn-icon" title="Details" onClick={() => setDetail(b)}><FaEye /></button>
          )}
        />
      )}

      <Modal
        show={Boolean(detail)}
        onClose={() => setDetail(null)}
        title={`Booking ${detail?.bookingId || ''}`}
        size="lg"
        footer={<button type="button" className="btn btn-brand" onClick={() => setDetail(null)}>Close</button>}
      >
        {detail && (
          <div className="row g-3">
            <div className="col-md-6">
              <div className="bg-light rounded p-3">
                <div className="small text-muted mb-2 fw-semibold">Customer</div>
                <div className="fw-bold">{customerName(detail)}</div>
                <div className="small text-muted mt-1">{detail.location?.city}</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="bg-light rounded p-3">
                <div className="small text-muted mb-2 fw-semibold">Service</div>
                <div className="fw-bold">{catalog.serviceById(detail.serviceId)?.name || '—'}</div>
                <div className="small text-muted mt-1 text-capitalize">{detail.category}</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="border rounded p-3">
                <div className="small text-muted mb-2 fw-semibold">Provider</div>
                <div className="fw-bold">{catalog.providerNameForBooking(detail)}</div>
                <div className="small text-muted mt-1">{detail.providerType === 'agency' ? 'Agency' : 'Professional'}</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="border rounded p-3">
                <div className="small text-muted mb-2 fw-semibold">Schedule</div>
                <div>{formatDate(detail.date)} · {detail.time || detail.preferredTime}</div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="border rounded p-3">
                <div className="small text-muted mb-2 fw-semibold">Price & Payment</div>
                <div className="fw-bold text-primary">{formatMoney(detail.price)}</div>
                <div className="small text-muted mt-1 text-capitalize">
                  {detail.paymentMethod} · <span className={detail.paymentStatus === 'paid' ? 'text-success fw-semibold' : 'text-warning fw-semibold'}>{detail.paymentStatus}</span>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="border rounded p-3">
                <div className="small text-muted mb-2 fw-semibold">Status</div>
                <StatusBadge status={detail.status} />
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default AdminBookingsPage
