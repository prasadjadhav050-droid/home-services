import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaTools, FaCheckCircle, FaEyeSlash, FaTrash, FaSearch, FaStar, FaStore } from 'react-icons/fa'
import { selectServices, updateService, removeService } from '../../features/services/serviceSlice'
import { selectAllUsers } from '../../features/users/userSlice'
import { toast, openConfirm } from '../../features/ui/uiSlice'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import { EmptyState } from '../../components/common/Feedback'
import { CATEGORIES } from '../../data/categories'
import { icons } from '../../utils/iconMap'
import { formatMoney } from '../../utils/format'

const AdminServicesPage = () => {
  const dispatch = useDispatch()
  const services = useSelector(selectServices)
  const users = useSelector(selectAllUsers)

  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')

  const providerName = (s) => users.find((u) => u.id === s.providerId)?.name || '—'

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return services.filter((s) => {
      if (category !== 'all' && s.category !== category) return false
      if (q) {
        const pName = users.find((u) => u.id === s.providerId)?.name || ''
        const haystack = `${s.name} ${s.location || ''} ${pName}`.toLowerCase()
        if (!haystack.includes(q)) return false
      }
      return true
    })
  }, [services, category, query, users])

  const available = services.filter((s) => s.availability).length
  const avgRating = services.length
    ? Number((services.reduce((sum, s) => sum + Number(s.rating || 0), 0) / services.length).toFixed(1))
    : 0

  const toggleAvailability = (s) => {
    dispatch(updateService({ id: s.id, availability: !s.availability }))
    toast(dispatch, `"${s.name}" is now ${s.availability ? 'hidden' : 'available'}.`, 'info', 'Availability')
  }

  const remove = (s) => {
    dispatch(openConfirm({
      title: 'Remove this service?',
      message: `"${s.name}" will be removed from the platform catalogue.`,
      confirmText: 'Yes, remove',
      onConfirm: () => {
        dispatch(removeService(s.id))
        toast(dispatch, `Service "${s.name}" removed.`, 'warning', 'Removed')
      },
    }))
  }

  return (
    <div>
      <PageHeader
        title="Services"
        subtitle="Monitor and curate every service offered across the platform."
        actions={
          <div className="input-group input-group-sm" style={{ maxWidth: 280 }}>
            <span className="input-group-text bg-white"><FaSearch className="text-muted" /></span>
            <input
              type="search"
              className="form-control"
              placeholder="Search service, city, provider…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        }
      />

      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3"><StatCard icon={<FaTools />} label="Total Services" value={services.length} accent="#0d6efd" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaCheckCircle />} label="Available" value={available} accent="#20c997" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaStore />} label="Categories" value={new Set(services.map((s) => s.category)).size} accent="#6f42c1" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaStar />} label="Avg Rating" value={avgRating} accent="#f5a623" /></div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-header bg-transparent border-0 py-3">
          <ul className="nav nav-pills gap-1 flex-nowrap overflow-auto">
            <li className="nav-item">
              <button type="button" className={`nav-link py-1 px-3 ${category === 'all' ? 'active' : 'text-muted'}`} onClick={() => setCategory('all')}>All</button>
            </li>
            {CATEGORIES.map((c) => (
              <li className="nav-item" key={c.id}>
                <button type="button" className={`nav-link py-1 px-3 text-nowrap ${category === c.id ? 'active' : 'text-muted'}`} onClick={() => setCategory(c.id)}>{c.name}</button>
              </li>
            ))}
          </ul>
        </div>

        <div className="table-responsive">
          {filtered.length === 0 ? (
            <EmptyState title="No services found" message="Try a different category or search term." />
          ) : (
            <table className="table align-middle mb-0">
              <thead>
                <tr className="text-muted small text-uppercase">
                  <th className="ps-4">Service</th>
                  <th>Provider</th>
                  <th>Category</th>
                  <th>Location</th>
                  <th>Price</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th className="text-end pe-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => {
                  const cat = CATEGORIES.find((c) => c.id === s.category)
                  const Icon = icons[s.img] || icons.FaTools
                  return (
                    <tr key={s.id}>
                      <td className="ps-4">
                        <div className="d-flex align-items-center gap-2">
                          <span className="stat-icon" style={{ background: `${s.color || '#0d6efd'}1a`, color: s.color || '#0d6efd', width: 38, height: 38 }}>
                            <Icon />
                          </span>
                          <div className="fw-semibold small" style={{ color: 'var(--text)' }}>{s.name}</div>
                        </div>
                      </td>
                      <td className="small">{providerName(s)}</td>
                      <td><span className="badge bg-soft-dark">{cat?.name || s.category}</span></td>
                      <td className="small text-muted">{s.location || '—'}</td>
                      <td className="money">{formatMoney(s.price)}</td>
                      <td className="small">{s.rating || '—'}</td>
                      <td>
                        {s.availability
                          ? <span className="badge bg-soft-success">Available</span>
                          : <span className="badge bg-soft-secondary">Hidden</span>}
                      </td>
                      <td className="text-end pe-4">
                        <div className="d-inline-flex gap-1">
                          <button type="button" className="btn btn-sm btn-light border" onClick={() => toggleAvailability(s)} title={s.availability ? 'Hide' : 'Publish'}>
                            {s.availability ? <FaEyeSlash /> : <FaCheckCircle />}
                          </button>
                          <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => remove(s)} title="Remove"><FaTrash /></button>
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

export default AdminServicesPage
