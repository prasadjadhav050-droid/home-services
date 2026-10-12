import { useState } from 'react'
import { useSelector } from 'react-redux'
import { FaMoneyBillWave, FaPercent, FaHourglassHalf, FaUndoAlt, FaCreditCard, FaSearch } from 'react-icons/fa'
import { selectPayments } from '../../features/payments/paymentSlice'
import { selectAllUsers } from '../../features/users/userSlice'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import { EmptyState } from '../../components/common/Feedback'
import { formatMoney, formatDateTime } from '../../utils/format'

const TYPE_META = {
  payment: { label: 'Payment', cls: 'bg-soft-primary' },
  refund: { label: 'Refund', cls: 'bg-soft-secondary' },
  payout: { label: 'Payout', cls: 'bg-soft-warning' },
}

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'payment', label: 'Payments' },
  { key: 'refund', label: 'Refunds' },
  { key: 'payout', label: 'Payouts' },
]

const AdminPaymentsPage = () => {
  const payments = useSelector(selectPayments)
  const users = useSelector(selectAllUsers)
  const [tab, setTab] = useState('all')
  const [query, setQuery] = useState('')

  const userName = (p) => users.find((u) => u.id === p.userId)?.name || p.userRole || '—'

  const collected = payments.filter((p) => p.type === 'payment' && p.status === 'paid').reduce((s, p) => s + Number(p.amount || 0), 0)
  const commission = payments.filter((p) => p.type === 'payment').reduce((s, p) => s + Number(p.commission || 0), 0)
  const pendingPayouts = payments.filter((p) => p.type === 'payout' && p.status === 'pending').reduce((s, p) => s + Number(p.amount || 0), 0)
  const refunded = payments.filter((p) => p.type === 'refund' || p.status === 'refunded').reduce((s, p) => s + Number(p.amount || 0), 0)

  const q = query.trim().toLowerCase()
  const filtered = payments
    .filter((p) => tab === 'all' || p.type === tab)
    .filter((p) => {
      if (!q) return true
      const uName = users.find((u) => u.id === p.userId)?.name || ''
      const haystack = `${p.id} ${p.bookingId || ''} ${uName} ${p.method || ''}`.toLowerCase()
      return haystack.includes(q)
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const statusCls = (status) => (status === 'paid' ? 'bg-soft-success' : status === 'refunded' ? 'bg-soft-secondary' : 'bg-soft-warning')

  return (
    <div>
      <PageHeader
        title="Payments"
        subtitle="Track transactions, platform commission and provider payouts."
        actions={
          <div className="input-group input-group-sm" style={{ maxWidth: 280 }}>
            <span className="input-group-text bg-white"><FaSearch className="text-muted" /></span>
            <input
              type="search"
              className="form-control"
              placeholder="Search ID, booking, user…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        }
      />

      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3"><StatCard icon={<FaMoneyBillWave />} label="Collected" value={formatMoney(collected)} accent="#0d6efd" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaPercent />} label="Commission" value={formatMoney(commission)} accent="#20c997" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaHourglassHalf />} label="Pending Payouts" value={formatMoney(pendingPayouts)} accent="#f5a623" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaUndoAlt />} label="Refunded" value={formatMoney(refunded)} accent="#d63384" /></div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent border-0 py-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
          <ul className="nav nav-pills gap-1 flex-nowrap overflow-auto">
            {TABS.map((t) => (
              <li className="nav-item" key={t.key}>
                <button type="button" className={`nav-link py-1 px-3 ${tab === t.key ? 'active' : 'text-muted'}`} onClick={() => setTab(t.key)}>{t.label}</button>
              </li>
            ))}
          </ul>
          <span className="text-muted small">{filtered.length} transactions</span>
        </div>

        <div className="table-responsive">
          {filtered.length === 0 ? (
            <EmptyState title="No transactions found" message="Try a different tab or search term." />
          ) : (
            <table className="table align-middle mb-0">
              <thead>
                <tr className="text-muted small text-uppercase">
                  <th className="ps-4">Transaction</th>
                  <th>Booking</th>
                  <th>User</th>
                  <th>Method</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Commission</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const meta = TYPE_META[p.type] || { label: p.type, cls: 'bg-soft-secondary' }
                  return (
                    <tr key={p.id}>
                      <td className="ps-4 small"><FaCreditCard className="me-2 text-primary" /><span className={`badge ${meta.cls}`}>{meta.label}</span></td>
                      <td className="small">{p.bookingId || '—'}</td>
                      <td className="small">{userName(p)}</td>
                      <td className="small text-capitalize">{p.method || '—'}</td>
                      <td className="small text-muted">{formatDateTime(p.date)}</td>
                      <td className="money">{formatMoney(p.amount)}</td>
                      <td className="money text-muted">{formatMoney(p.commission)}</td>
                      <td><span className={`badge ${statusCls(p.status)}`}>{p.status}</span></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminPaymentsPage
