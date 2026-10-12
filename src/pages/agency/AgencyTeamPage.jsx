import { useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FaUserPlus, FaStar, FaTools, FaCalendarCheck } from 'react-icons/fa'
import { useCatalog } from '../../hooks/useCatalog'
import { selectBookings } from '../../features/bookings/bookingSlice'
import { selectAllUsers } from '../../features/users/userSlice'
import { updateAgency } from '../../features/agencies/agencySlice'
import { selectCurrentUser } from '../../features/users/userSlice'
import { toast } from 'react-toastify'

const AgencyTeamPage = () => {
  const dispatch = useDispatch()
  const catalog = useCatalog()
  const currentUser = useSelector(selectCurrentUser)
  const bookings = useSelector(selectBookings)
  const users = useSelector(selectAllUsers)

  const agency = useMemo(
    () => catalog.agencyById?.(currentUser?.agencyId) || catalog.agencyById?.(currentUser?.id) || null,
    [catalog, currentUser],
  )

  const team = agency?.staff || []
  const memberIds = new Set(team.map((m) => m.professionalId || m.id))

  const candidates = useMemo(
    () => (catalog.professionals || []).filter((p) => !memberIds.has(p.id)),
    [catalog, memberIds],
  )

  const memberStats = (proId) => {
    const mine = bookings.filter((b) => b.professionalId === proId || b.providerId === proId)
    const revenue = mine.reduce((s, b) => s + Number(b.price || 0), 0)
    const done = mine.filter((b) => b.status === 'completed').length
    return { count: mine.length, revenue, done }
  }

  const addToTeam = (pro) => {
    dispatch(updateAgency({ id: agency.id, staff: [...team, { professionalId: pro.id, joinedAt: new Date().toISOString() }] }))
    toast({ type: 'success', title: 'Added to team', message: `${pro.name} is now on your agency team.` })
  }

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-4">
        <div>
          <h5 className="fw-bold mb-1" style={{ color: 'var(--text)' }}>Agency Team</h5>
          <p className="text-muted mb-0">Manage the professionals contracted under your agency.</p>
        </div>
        <span className="badge badge-soft-brand">{team.length} members</span>
      </div>

      {team.length > 0 && (
        <div className="row g-3 mb-4">
          {team.map((m) => {
            const s = memberStats(m.professionalId || m.id)
            const pro = catalog.proById?.(m.professionalId || m.id)
            return (
              <div className="col-md-6 col-xl-4" key={m.professionalId || m.id}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body">
                    <div className="d-flex align-items-center gap-3 mb-3">
                      <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white" style={{ width: 46, height: 46, background: 'var(--brand)' }}>
                        {(pro?.name || '?')[0]}
                      </div>
                      <div className="flex-grow-1">
                        <h6 className="fw-bold mb-0" style={{ color: 'var(--text)' }}>{pro?.name || 'Team member'}</h6>
                        <span className="small text-muted">{pro?.specialty || 'General'}</span>
                      </div>
                      <div className="text-warning small fw-bold"><FaStar /> {Number(pro?.rating || 0).toFixed(1)}</div>
                    </div>
                    <div className="d-flex justify-content-between small text-muted">
                      <span><FaCalendarCheck className="me-1" />{s.count} jobs</span>
                      <span><FaTools className="me-1" />{s.done} done</span>
                      <span className="fw-bold" style={{ color: 'var(--brand)' }}>${s.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent py-3">
          <h6 className="fw-bold mb-0" style={{ color: 'var(--text)' }}>Add Professionals</h6>
        </div>
        <div className="table-responsive">
          <table className="table align-middle mb-0">
            <thead className="small text-muted">
              <tr><th className="ps-3">Professional</th><th>Specialty</th><th>Rating</th><th className="text-end pe-3"></th></tr>
            </thead>
            <tbody>
              {candidates.slice(0, 8).map((p) => (
                <tr key={p.id}>
                  <td className="ps-3">
                    <div className="d-flex align-items-center gap-2">
                      <div className="rounded-circle d-flex align-items-center justify-content-center fw-bold text-white" style={{ width: 34, height: 34, background: 'var(--brand-soft)' }}>{p.name?.[0]}</div>
                      <span className="fw-semibold" style={{ color: 'var(--text)' }}>{p.name}</span>
                    </div>
                  </td>
                  <td className="small text-muted">{p.specialty || 'General'}</td>
                  <td className="small text-warning fw-semibold"><FaStar /> {Number(p.rating || 0).toFixed(1)}</td>
                  <td className="text-end pe-3">
                    <button className="btn btn-sm btn-soft-brand" onClick={() => addToTeam(p)}><FaUserPlus className="me-1" /> Add</button>
                  </td>
                </tr>
              ))}
              {candidates.length === 0 && (
                <tr><td colSpan={4} className="text-center text-muted py-4">No more professionals available to add.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default AgencyTeamPage
