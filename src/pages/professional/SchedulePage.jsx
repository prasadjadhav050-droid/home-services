import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaChevronLeft, FaChevronRight, FaCalendarAlt, FaBan, FaClock, FaPlus, FaTrash, FaSave, FaBriefcase } from 'react-icons/fa'
import { selectProfessionalById, setSchedule, addBlockedSlot, removeBlockedSlot } from '../../features/professionals/professionalSlice'
import { selectBookingsByProfessional } from '../../features/bookings/bookingSlice'
import { toast } from '../../features/ui/uiSlice'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import { formatMoney, formatDate } from '../../utils/format'
import { useCatalog } from '../../hooks/useCatalog'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const SchedulePage = () => {
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.currentUser)
  const profile = useSelector((s) => selectProfessionalById(s, user?.id))
  const bookings = useSelector((s) => selectBookingsByProfessional(s, user?.id))
  const catalog = useCatalog()

  const [offset, setOffset] = useState(0)
  const [selectedDate, setSelectedDate] = useState(null)
  const [workDays, setWorkDays] = useState(profile?.schedule?.workingDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'])
  const [start, setStart] = useState(profile?.schedule?.start || '09:00')
  const [end, setEnd] = useState(profile?.schedule?.end || '18:00')
  const [blockTime, setBlockTime] = useState('10:00')

  const now = new Date()
  const view = new Date(now.getFullYear(), now.getMonth() + offset, 1)
  const month = view.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
  const firstDay = new Date(view.getFullYear(), view.getMonth(), 1).getDay()
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate()

  const cells = []
  for (let i = 0; i < firstDay; i += 1) cells.push({ day: null, iso: null })
  for (let d = 1; d <= daysInMonth; d += 1) {
    const iso = `${view.getFullYear()}-${String(view.getMonth() + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    cells.push({ day: d, iso })
  }

  const dayBookings = (iso) => bookings.filter((b) => (b.date || '').slice(0, 10) === iso)
  const isBlocked = (iso) => (profile?.blockedSlots || []).some((b) => b.date === iso)

  const selectedBookings = selectedDate ? dayBookings(selectedDate) : []
  const selectedBlocked = selectedDate ? (profile?.blockedSlots || []).filter((b) => b.date === selectedDate) : []

  const saveWorking = () => {
    dispatch(setSchedule({ id: profile.id, schedule: { workingDays: workDays, start, end } }))
    toast(dispatch, 'Working hours updated.', 'success')
  }

  const addBlock = () => {
    if (!selectedDate) return
    dispatch(addBlockedSlot({ id: profile.id, date: selectedDate, time: blockTime }))
    toast(dispatch, `Blocked ${formatDate(selectedDate)} at ${blockTime}.`, 'info', 'Unavailable')
  }

  const toggleDay = (d) => setWorkDays((w) => (w.includes(d) ? w.filter((x) => x !== d) : [...w, d]))

  const toggleBlock = (slotId) => dispatch(removeBlockedSlot({ id: profile.id, slotId }))

  const todayISO = new Date().toISOString().slice(0, 10)

  return (
    <div>
      <PageHeader title="My Schedule & Availability" subtitle="Set working hours, block busy slots and see your bookings." />

      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3"><StatCard icon={<FaCalendarAlt />} label="Working Days" value={workDays.length} accent="#0d6efd" sub={`${start}–${end}`} /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaBan />} label="Blocked Slots" value={(profile?.blockedSlots || []).length} accent="#dc3545" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaBriefcase />} label="Scheduled Jobs" value={bookings.filter((b) => ['pending', 'accepted', 'assigned', 'on_the_way', 'arrived', 'in_progress'].includes(b.status)).length} accent="#20c997" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaClock />} label="Work Hours" value={<>{start} → {end}</>} accent="#f5a623" /></div>
      </div>

      <div className="row g-4">
        {/* Calendar */}
        <div className="col-lg-8">
          <div className="card card-plain p-4">
            <div className="d-flex align-items-center justify-content-between mb-3">
              <button type="button" className="btn btn-light border btn-icon" onClick={() => setOffset((o) => o - 1)}><FaChevronLeft /></button>
              <h6 className="fw-bold m-0">{month}</h6>
              <button type="button" className="btn btn-light border btn-icon" onClick={() => setOffset((o) => o + 1)}><FaChevronRight /></button>
            </div>
            <div className="cal-grid mb-2">
              {DAYS.map((d) => <div key={d} className="text-center small fw-semibold text-muted">{d}</div>)}
            </div>
            <div className="cal-grid">
              {cells.map((c, i) => {
                const has = c.iso ? dayBookings(c.iso).length : 0
                const blocked = c.iso ? isBlocked(c.iso) : false
                const isToday = c.iso === todayISO
                const past = c.iso && c.iso < todayISO
                return (
                  <button key={i} disabled={!c.iso} onClick={() => setSelectedDate(c.iso)}
                    className={`cal-day ${has ? 'has-booking' : ''} ${blocked ? 'blocked' : ''} ${past ? 'other-month' : ''}`}
                    style={{ borderColor: selectedDate === c.iso ? '#0d6efd' : undefined, boxShadow: selectedDate === c.iso ? '0 0 0 2px #0d6efd33' : undefined }}>
                    <span className="num">{c.day}</span>
                    {has > 0 && <span className="badge bg-soft-brand">{has} job{has > 1 ? 's' : ''}</span>}
                    {!has && blocked && <span className="badge bg-soft-warning"><FaBan size={8} /> blocked</span>}
                    {isToday && <small className="text-primary fw-bold d-block">today</small>}
                  </button>
                )
              })}
            </div>
            <div className="mt-3 d-flex gap-3 small text-muted">
              <span><span className="status-dot rounded" style={{ background: '#0d6efd' }} /> Jobs booked</span>
              <span><span className="status-dot rounded" style={{ background: '#f5a623' }} /> Blocked</span>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div className="col-lg-4">
          <div className="card card-plain p-4 mb-4">
            <h6 className="fw-bold mb-3"><FaCalendarAlt className="text-primary me-1" /> {selectedDate ? formatDate(selectedDate) : 'Select a date'}</h6>
            {selectedDate ? (
              <>
                <label className="form-label">Bookings</label>
                {selectedBookings.length ? (
                  selectedBookings.map((b) => (
                    <div key={b.id} className="border rounded p-2 mb-2 small">
                      <div className="fw-semibold">{catalog.serviceById(b.serviceId)?.name}</div>
                      <div className="text-muted">{b.preferredTime} · {formatMoney(b.price)} · {b.location?.city}</div>
                    </div>
                  ))
                ) : (
                  <div className="text-muted small mb-2">No bookings this day.</div>
                )}
                <label className="form-label mt-2">Block a time slot</label>
                <div className="d-flex gap-2">
                  <input type="time" className="form-control form-control-sm" value={blockTime} onChange={(e) => setBlockTime(e.target.value)} />
                  <button type="button" className="btn btn-outline-danger btn-sm flex-shrink-0" onClick={addBlock}><FaPlus className="me-1" size={11} /> Block</button>
                </div>
                {selectedBlocked.length > 0 && (
                  <div className="mt-2 d-flex flex-column gap-1">
                    {selectedBlocked.map((s) => (
                      <div key={s.id} className="small bg-light rounded px-2 py-1 d-flex justify-content-between align-items-center">
                        <span><FaBan className="me-1 text-danger" size={10} /> {s.time} — unavailable</span>
                        <button type="button" className="btn btn-ghost btn-icon p-0" style={{ width: 22, height: 22 }} onClick={() => toggleBlock(s.id)}><FaTrash size={10} className="text-danger" /></button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-muted small">Click any day to view its bookings and block slots.</div>
            )}
          </div>

          <div className="card card-plain p-4">
            <h6 className="fw-bold mb-3"><FaClock className="text-primary me-1" /> Working hours</h6>
            <label className="form-label">Working days</label>
            <div className="d-flex flex-wrap gap-1 mb-3">
              {ALL_DAYS.map((d) => (
                <button key={d} type="button" className={`btn btn-sm ${workDays.includes(d) ? 'btn-brand' : 'btn-light border'}`} onClick={() => toggleDay(d)}>{d.slice(0, 2)}</button>
              ))}
            </div>
            <div className="row g-2 mb-3">
              <div className="col-6"><label className="form-label small">Start time</label><input type="time" className="form-control" value={start} onChange={(e) => setStart(e.target.value)} /></div>
              <div className="col-6"><label className="form-label small">End time</label><input type="time" className="form-control" value={end} onChange={(e) => setEnd(e.target.value)} /></div>
            </div>
            <button type="button" className="btn btn-brand w-100" onClick={saveWorking}><FaSave className="me-1" /> Save working hours</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SchedulePage