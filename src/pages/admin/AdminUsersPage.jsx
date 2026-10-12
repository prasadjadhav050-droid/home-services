import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaUsers, FaUserCheck, FaUserClock, FaCheck, FaTimes, FaBan, FaUndo, FaSearch, FaShieldAlt } from 'react-icons/fa'
import PageHeader from '../../components/common/PageHeader'
import Avatar from '../../components/common/Avatar'
import { EmptyState } from '../../components/common/Feedback'
import {
  selectAllUsers,
  selectPendingVerifications,
  selectActiveUsersCount,
  setStatus,
  setVerification,
} from '../../features/users/userSlice'

const ROLE_LABEL = { customer: 'Customer', professional: 'Professional', agency: 'Agency', admin: 'Admin' }

const ROLE_TABS = [
  { key: 'all', label: 'All' },
  { key: 'customer', label: 'Customers' },
  { key: 'professional', label: 'Professionals' },
  { key: 'agency', label: 'Agencies' },
]

const STATUS_TABS = [
  { key: 'all', label: 'Everyone' },
  { key: 'active', label: 'Active' },
  { key: 'suspended', label: 'Suspended' },
  { key: 'pending', label: 'Pending' },
]

const VERIFICATION_META = {
  verified: { cls: 'bg-soft-success', label: 'Verified' },
  pending: { cls: 'bg-soft-warning', label: 'Pending' },
  rejected: { cls: 'bg-soft-danger', label: 'Rejected' },
}

const statusMeta = (status) =>
  status === 'active'
    ? { cls: 'bg-soft-success', label: 'Active' }
    : status === 'suspended'
      ? { cls: 'bg-soft-danger', label: 'Suspended' }
      : { cls: 'bg-soft-secondary', label: 'Inactive' }

const StatCard = ({ title, value, icon, tone }) => (
  <div className="col-6 col-xl-3">
    <div className="card border-0 shadow-sm h-100">
      <div className="card-body d-flex align-items-center justify-content-between">
        <div>
          <p className="small text-muted fw-semibold text-uppercase mb-1" style={{ fontSize: '.68rem', letterSpacing: '.04em' }}>{title}</p>
          <div className="fw-bold fs-5" style={{ color: 'var(--text)' }}>{value}</div>
        </div>
        <div className="rounded-circle d-flex align-items-center justify-content-center" style={{ background: `rgba(${tone}, .1)`, color: `rgb(${tone})`, width: 42, height: 42 }}>{icon}</div>
      </div>
    </div>
  </div>
)

const AdminUsersPage = () => {
  const dispatch = useDispatch()
  const users = useSelector(selectAllUsers)
  const pending = useSelector(selectPendingVerifications)
  const activeCount = useSelector(selectActiveUsersCount)

  const [query, setQuery] = useState('')
  const [roleTab, setRoleTab] = useState('all')
  const [statusTab, setStatusTab] = useState('all')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return users.filter((u) => {
      if (roleTab !== 'all' && u.role !== roleTab) return false
      if (statusTab === 'active' && u.status !== 'active') return false
      if (statusTab === 'suspended' && u.status !== 'suspended') return false
      if (statusTab === 'pending' && u.verification !== 'pending') return false
      if (q) {
        const haystack = `${u.name} ${u.email} ${u.location || ''}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [users, query, roleTab, statusTab])

  const approve = (id) => dispatch(setVerification({ id, verification: 'verified' }))
  const reject = (id) => dispatch(setVerification({ id, verification: 'rejected' }))
  const toggleStatus = (u) => dispatch(setStatus({ id: u.id, status: u.status === 'active' ? 'suspended' : 'active' }))

  return (
    <div>
      <PageHeader
        title="User Management"
        subtitle="Approve verifications and manage access across the platform."
        icon={<FaShieldAlt />}
        actions={
          <div className="input-group input-group-sm" style={{ maxWidth: 280 }}>
            <span className="input-group-text bg-white"><FaSearch className="text-muted" /></span>
            <input
              type="search"
              className="form-control"
              placeholder="Search name, email, city…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        }
      />

      <div className="row g-3 mb-4">
        <StatCard title="Total Users" value={users.length} icon={<FaUsers />} tone="13,110,253" />
        <StatCard title="Active" value={activeCount} icon={<FaUserCheck />} tone="25,135,84" />
        <StatCard title="Pending" value={pending.length} icon={<FaUserClock />} tone="253,126,20" />
        <StatCard title="Suspended" value={users.filter((u) => u.status === 'suspended').length} icon={<FaBan />} tone="220,53,69" />
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent border-0 py-3 d-flex flex-wrap gap-2 justify-content-between">
          <ul className="nav nav-pills gap-1">
            {ROLE_TABS.map((t) => (
              <li className="nav-item" key={t.key}>
                <button
                  type="button"
                  className={`nav-link py-1 px-3 ${roleTab === t.key ? 'active' : 'text-muted'}`}
                  onClick={() => setRoleTab(t.key)}
                >
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
          <ul className="nav nav-pills gap-1">
            {STATUS_TABS.map((t) => (
              <li className="nav-item" key={t.key}>
                <button
                  type="button"
                  className={`nav-link py-1 px-3 ${statusTab === t.key ? 'active' : 'text-muted'}`}
                  onClick={() => setStatusTab(t.key)}
                >
                  {t.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="table-responsive">
          {filtered.length === 0 ? (
            <EmptyState title="No users found" message="Try adjusting your search or filters." />
          ) : (
            <table className="table align-middle mb-0">
              <thead>
                <tr className="text-muted small text-uppercase">
                  <th className="ps-4">User</th>
                  <th>Role</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Verification</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((u) => {
                  const vMeta = VERIFICATION_META[u.verification] || { cls: 'bg-soft-secondary', label: '—' }
                  const sMeta = statusMeta(u.status)
                  return (
                    <tr key={u.id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-2">
                          <Avatar name={u.name} id={u.id} size="sm" />
                          <div>
                            <div className="fw-semibold small" style={{ color: 'var(--text)' }}>{u.name}</div>
                            <div className="small text-muted">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><span className="badge bg-soft-primary">{ROLE_LABEL[u.role] || u.role}</span></td>
                      <td className="small text-muted">{u.location || '—'}</td>
                      <td><span className={`badge ${sMeta.cls}`}>{sMeta.label}</span></td>
                      <td><span className={`badge ${vMeta.cls}`}>{vMeta.label}</span></td>
                      <td className="text-end pe-4">
                        <div className="d-inline-flex gap-1">
                          {u.verification === 'pending' && (
                            <>
                              <button type="button" className="btn btn-sm btn-success" onClick={() => approve(u.id)} title="Approve verification">
                                <FaCheck />
                              </button>
                              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => reject(u.id)} title="Reject verification">
                                <FaTimes />
                              </button>
                            </>
                          )}
                          {u.role !== 'admin' && (
                            <button
                              type="button"
                              className={`btn btn-sm ${u.status === 'active' ? 'btn-outline-danger' : 'btn-outline-success'}`}
                              onClick={() => toggleStatus(u)}
                              title={u.status === 'active' ? 'Suspend user' : 'Reactivate user'}
                            >
                              {u.status === 'active' ? <FaBan /> : <FaUndo />}
                            </button>
                          )}
                        </div>
                      </td>
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

export default AdminUsersPage
