import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaMoneyBillWave, FaWallet, FaClock, FaPlus, FaScroll, FaChartLine } from 'react-icons/fa'
import { selectBookingsByProfessional } from '../../features/bookings/bookingSlice'
import { selectPaymentsForUser, addPayment } from '../../features/payments/paymentSlice'
import { toast } from '../../features/ui/uiSlice'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import Modal from '../../components/common/Modal'
import ChartCard from '../../components/common/ChartCard'
import { ChartBar } from '../../components/charts/Recharts'
import { useCatalog } from '../../hooks/useCatalog'
import { formatMoney, formatDateTime } from '../../utils/format'
import { PAYMENT_METHODS } from '../../data/categories'

const ProfessionalEarningsPage = () => {
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.currentUser)
  const bookings = useSelector((s) => selectBookingsByProfessional(s, user?.id))
  const payouts = useSelector((s) => selectPaymentsForUser(s, user?.id, 'payout'))
  const withdrawals = useSelector((s) => selectPaymentsForUser(s, user?.id, 'withdrawal'))
  const catalog = useCatalog()

  const [withdrawOpen, setWithdrawOpen] = useState(false)
  const [amount, setAmount] = useState('')
  const [receipt, setReceipt] = useState(null)

  const earned = payouts.reduce((s, p) => s + Number(p.amount || 0), 0)
  const withdrawn = withdrawals.filter((w) => w.status === 'completed').reduce((s, p) => s + Number(p.amount || 0), 0)
  const pendingWithdraw = withdrawals.filter((w) => w.status === 'pending').reduce((s, p) => s + Number(p.amount || 0), 0)
  const balance = earned - withdrawn
  const pendingPayout = payouts.filter((p) => p.status === 'pending').reduce((s, p) => s + Number(p.amount || 0), 0)

  const monthData = []
  for (let i = 5; i >= 0; i -= 1) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const key = d.toISOString().slice(0, 7)
    const month = d.toLocaleDateString('en-IN', { month: 'short' })
    const earn = payouts.filter((p) => (p.date || '').slice(0, 7) === key).reduce((s, p) => s + Number(p.amount || 0), 0)
    const jobs = bookings.filter((b) => b.status === 'completed' && (b.date || '').slice(0, 7) === key).length
    monthData.push({ month, earn, jobs })
  }

  const bookingFor = (p) => bookings.find((b) => b.bookingId === p.bookingId)

  const withdraw = () => {
    const amt = Number(amount)
    if (!amt || amt <= 0) {
      toast(dispatch, 'Enter a valid amount.', 'error')
      return
    }
    if (amt > balance) {
      toast(dispatch, `Amount exceeds your available balance of ${formatMoney(balance)}.`, 'error')
      return
    }
    dispatch(addPayment({
      bookingId: null,
      userId: user.id,
      userRole: 'professional',
      type: 'withdrawal',
      amount: amt,
      commission: 0,
      status: 'pending',
      method: 'bank',
    }))
    toast(dispatch, `Withdrawal of ${formatMoney(amt)} requested. It will be processed via bank transfer.`, 'success', 'Request Submitted')
    setWithdrawOpen(false)
    setAmount('')
  }

  const sortedPayouts = [...payouts].sort((a, b) => new Date(b.date) - new Date(a.date))
  const sortedWithdrawals = [...withdrawals].sort((a, b) => new Date(b.date) - new Date(a.date))

  return (
    <div>
      <PageHeader
        title="Earnings"
        subtitle="Track your payouts, commissions and withdraw your balance (simulated)."
        actions={<button type="button" className="btn btn-brand btn-sm btn-pill" onClick={() => setWithdrawOpen(true)}><FaPlus className="me-1" size={11} /> Request Withdrawal</button>}
      />

      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3"><StatCard icon={<FaChartLine />} label="Total Earnings" value={formatMoney(earned)} accent="#0d6efd" sub={`${payouts.length} payouts`} /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaWallet />} label="Available Balance" value={formatMoney(balance)} accent="#20c997" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaClock />} label="Pending Payouts" value={formatMoney(pendingPayout)} accent="#f5a623" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaBank />} label="Withdrawn" value={formatMoney(withdrawn)} accent="#d63384" sub={pendingWithdraw ? `${formatMoney(pendingWithdraw)} pending` : 'all done'} /></div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <ChartCard title="Earnings & Completed Jobs" subtitle="Last 6 months">
            <ChartBar data={monthData} xKey="month" series={[{ key: 'earn', name: 'Earnings', color: '#0aa2a0' }, { key: 'jobs', name: 'Jobs', color: '#0d6efd' }]} height={240} />
          </ChartCard>
        </div>
        <div className="col-lg-4">
          <div className="card card-plain p-4 h-100">
            <h6 className="fw-bold mb-3">Balance details</h6>
            <div className="d-flex justify-content-between border-bottom py-2 small"><span className="text-muted">Gross earnings</span><strong>{formatMoney(earned)}</strong></div>
            <div className="d-flex justify-content-between border-bottom py-2 small"><span className="text-muted">Withdrawn to bank</span><strong>{formatMoney(withdrawn)}</strong></div>
            <div className="d-flex justify-content-between border-bottom py-2 small"><span className="text-muted">Pending withdrawal</span><strong>{formatMoney(pendingWithdraw)}</strong></div>
            <div className="d-flex justify-content-between py-2"><span className="fw-semibold">Available</span><span className="money text-primary fs-5">{formatMoney(balance)}</span></div>
            <button type="button" className="btn btn-brand w-100 mt-2" onClick={() => setWithdrawOpen(true)}><FaBank className="me-1" /> Withdraw to bank</button>
          </div>
        </div>
      </div>

      <h6 className="fw-bold mb-3"><FaMoneyBillWave className="text-primary me-1" /> Payout history</h6>
      <div className="table-responsive card card-plain p-0 overflow-hidden mb-4">
        <table className="table table-hover mb-0">
          <thead>
            <tr><th>Booking</th><th>Service</th><th>Date</th><th>Status</th><th>Amount</th><th /></tr>
          </thead>
          <tbody>
            {sortedPayouts.map((p) => {
              const b = bookingFor(p)
              return (
                <tr key={p.id} className="table-row">
                  <td className="small fw-semibold">{p.bookingId}</td>
                  <td className="small">{b ? catalog.serviceById(b.serviceId)?.name : '—'}</td>
                  <td className="small">{formatDateTime(p.date)}</td>
                  <td><span className={`badge ${p.status === 'completed' || p.status === 'paid' ? 'bg-soft-success' : 'bg-soft-warning'}`}>{p.status}</span></td>
                  <td className="money">{formatMoney(p.amount)}</td>
                  <td><button type="button" className="btn btn-light border btn-sm" onClick={() => setReceipt(p)}><FaScroll className="me-1" size={11} /> Receipt</button></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <h6 className="fw-bold mb-3"><FaBank className="text-primary me-1" /> Withdrawals</h6>
      <div className="table-responsive card card-plain p-0 overflow-hidden">
        <table className="table table-hover mb-0">
          <thead>
            <tr><th>Request #</th><th>Date</th><th>Method</th><th>Status</th><th>Amount</th></tr>
          </thead>
          <tbody>
            {sortedWithdrawals.map((w) => (
              <tr key={w.id} className="table-row">
                <td className="small fw-semibold">{w.id}</td>
                <td className="small">{formatDateTime(w.date)}</td>
                <td className="small text-capitalize">{PAYMENT_METHODS.find((m) => m.id === w.method)?.label || w.method}</td>
                <td><span className={`badge ${w.status === 'completed' ? 'bg-soft-success' : 'bg-soft-warning'}`}>{w.status}</span></td>
                <td className="money">{formatMoney(w.amount)}</td>
              </tr>
            ))}
            {!sortedWithdrawals.length && <tr><td colSpan={5} className="text-center text-muted py-4 small">No withdrawal requests yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <Modal show={withdrawOpen} onClose={() => setWithdrawOpen(false)} title="Request Withdrawal (demo)" footer={<button type="button" className="btn btn-brand" onClick={withdraw}>Submit request</button>}>
        <p className="text-muted small mb-3">This is a simulation. Your request is recorded locally and stays <strong>pending</strong> until a bank transfer is simulated.</p>
        <label className="form-label">Amount (₹)</label>
        <input type="number" className="form-control mb-2" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0" />
        <div className="text-muted small">Available balance: <strong>{formatMoney(balance)}</strong></div>
        <div className="d-flex gap-2 mt-3">
          {[500, 1000, 2500].map((n) => (
            <button key={n} type="button" className="btn btn-light border btn-sm" onClick={() => setAmount(String(n))}>{formatMoney(n)}</button>
          ))}
        </div>
      </Modal>

      <Modal show={Boolean(receipt)} onClose={() => setReceipt(null)} title="Payout Receipt" footer={<button type="button" className="btn btn-brand" onClick={() => window.print()}>Print</button>}>
        {receipt && (() => {
          const b = bookingFor(receipt)
          return (
            <div>
              <div className="text-center mb-3">
                <div className="fw-bold h5">ServiceSprint</div>
                <div className="text-muted small">Payout statement · {formatDateTime(receipt.date)}</div>
              </div>
              <div className="d-flex justify-content-between small py-1 border-bottom"><span className="text-muted">Statement #</span><strong>{receipt.id}</strong></div>
              <div className="d-flex justify-content-between small py-1 border-bottom"><span className="text-muted">Booking</span><strong>{receipt.bookingId}</strong></div>
              <div className="d-flex justify-content-between small py-1 border-bottom"><span className="text-muted">Service</span><strong>{b ? catalog.serviceById(b.serviceId)?.name : '—'}</strong></div>
              <div className="d-flex justify-content-between small py-1 border-bottom"><span className="text-muted">Commission</span><strong>{formatMoney(receipt.commission)}</strong></div>
              <div className="d-flex justify-content-between small py-1 border-bottom"><span className="text-muted">Net payout</span><strong className="text-primary fs-5">{formatMoney(receipt.amount)}</strong></div>
              <div className="d-flex justify-content-between small py-1"><span className="text-muted">Status</span><span className={`badge ${receipt.status === 'completed' || receipt.status === 'paid' ? 'bg-soft-success' : 'bg-soft-warning'}`}>{receipt.status}</span></div>
            </div>
          )
        })()}
      </Modal>
    </div>
  )
}

export default ProfessionalEarningsPage