import { useState } from 'react'
import { useSelector } from 'react-redux'
import { FaWallet, FaCheckCircle, FaClock, FaUndoAlt, FaCreditCard, FaScroll } from 'react-icons/fa'
import { selectBookingsByCustomer } from '../../features/bookings/bookingSlice'
import { selectPaymentsForUser } from '../../features/payments/paymentSlice'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import Modal from '../../components/common/Modal'
import { useCatalog } from '../../hooks/useCatalog'
import { formatMoney, formatDateTime } from '../../utils/format'
import { PAYMENT_METHODS } from '../../data/categories'

const CustomerPaymentsPage = () => {
  const user = useSelector((s) => s.auth.currentUser)
  const bookings = useSelector((s) => selectBookingsByCustomer(s, user?.id))
  const payments = useSelector((s) => selectPaymentsForUser(s, user?.id))
  const catalog = useCatalog()
  const [receipt, setReceipt] = useState(null)

  const paid = payments.filter((p) => p.status === 'paid' && p.type === 'payment')
  const pending = payments.filter((p) => p.status === 'pending' && p.type === 'payment')
  const refunded = payments.filter((p) => p.status === 'refunded')
  const total = paid.reduce((s, p) => s + Number(p.amount || 0), 0)

  const rows = payments
    .filter((p) => p.type !== 'payout')
    .sort((a, b) => new Date(b.date) - new Date(a.date))

  const bookingFor = (p) => bookings.find((b) => b.bookingId === p.bookingId)

  return (
    <div>
      <PageHeader title="Payments & Billing" subtitle="Your transactions are simulated and stored locally." />
      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3"><StatCard icon={<FaWallet />} label="Total Paid" value={formatMoney(total)} accent="#0d6efd" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaCheckCircle />} label="Successful" value={paid.length} accent="#20c997" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaClock />} label="Pending" value={formatMoney(pending.reduce((s, p) => s + p.amount, 0))} accent="#f5a623" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaUndoAlt />} label="Refunded" value={formatMoney(refunded.reduce((s, p) => s + p.amount, 0))} accent="#d63384" /></div>
      </div>

      <div className="table-responsive card card-plain p-0 overflow-hidden">
        <table className="table table-hover mb-0">
          <thead>
            <tr><th>Transaction</th><th>Booking</th><th>Service</th><th>Method</th><th>Date</th><th>Amount</th><th>Status</th><th /></tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const b = bookingFor(p)
              const m = PAYMENT_METHODS.find((x) => x.id === (b?.paymentMethod || p.method))
              return (
                <tr key={p.id} className="table-row">
                  <td className="small"><FaCreditCard className="me-2 text-primary" />{p.type}</td>
                  <td className="small">{p.bookingId || '—'}</td>
                  <td className="small">{b ? catalog.serviceById(b.serviceId)?.name : '—'}</td>
                  <td className="small text-capitalize">{m?.label || p.method}</td>
                  <td className="small">{formatDateTime(p.date)}</td>
                  <td className="money">{formatMoney(p.amount)}</td>
                  <td>
                    <span className={`badge ${p.status === 'paid' ? 'bg-soft-success' : p.status === 'refunded' ? 'bg-soft-secondary' : 'bg-soft-warning'}`}>{p.status}</span>
                  </td>
                  <td>
                    {p.type !== 'withdrawal' && (
                      <button type="button" className="btn btn-light border btn-sm" onClick={() => setReceipt(p)}><FaScroll className="me-1" size={11} /> Receipt</button>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Modal
        show={Boolean(receipt)}
        onClose={() => setReceipt(null)}
        title="Payment Receipt"
        footer={<button type="button" className="btn btn-brand" onClick={() => window.print()}>Print</button>}
      >
        {receipt && (() => {
          const b = bookingFor(receipt)
          return (
            <div>
              <div className="text-center mb-3">
                <div className="fw-bold h5">ServiceSprint</div>
                <div className="text-muted small">Payment receipt · {formatDateTime(receipt.date)}</div>
              </div>
              <div className="d-flex justify-content-between small py-1 border-bottom"><span className="text-muted">Receipt #{receipt.id}</span><strong>{receipt.id}</strong></div>
              <div className="d-flex justify-content-between small py-1 border-bottom"><span className="text-muted">Booking</span><strong>{receipt.bookingId}</strong></div>
              <div className="d-flex justify-content-between small py-1 border-bottom"><span className="text-muted">Service</span><strong>{b ? catalog.serviceById(b.serviceId)?.name : '—'}</strong></div>
              <div className="d-flex justify-content-between small py-1 border-bottom"><span className="text-muted">Method</span><strong className="text-capitalize">{receipt.method}</strong></div>
              <div className="d-flex justify-content-between small py-1 border-bottom"><span className="text-muted">Amount</span><strong className="text-primary fs-5">{formatMoney(receipt.amount)}</strong></div>
              <div className="d-flex justify-content-between small py-1"><span className="text-muted">Status</span><span className={`badge ${receipt.status === 'paid' ? 'bg-soft-success' : 'bg-soft-warning'}`}>{receipt.status}</span></div>
            </div>
          )
        })()}
      </Modal>
    </div>
  )
}

export default CustomerPaymentsPage