import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { FaTools, FaCheckCircle, FaTimesCircle, FaPlus } from 'react-icons/fa'
import { selectServices } from '../../features/services/serviceSlice'
import { selectProfessionals } from '../../features/professionals/professionalSlice'
import { useCatalog } from '../../hooks/useCatalog'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import Avatar from '../../components/common/Avatar'

const AgencyCatalogPage = () => {
  const services = useSelector(selectServices)
  const professionals = useSelector(selectProfessionals)
  const catalog = useCatalog()

  const groups = useMemo(() => {
    const map = new Map()
    services.forEach((s) => {
      const key = s.category || 'General'
      if (!map.has(key)) map.set(key, [])
      map.get(key).push(s)
    })
    return Array.from(map.entries())
  }, [services])

  const providersForCategory = (category, providerType) => {
    if (providerType === 'professional') {
      return professionals.filter((p) => (p.services || []).some((s) => s.category === category || s.title?.split(' ')[0] === category))
    }
    return []
  }

  return (
    <div>
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mb-4">
        <PageHeader title="Service Catalog" subtitle="Browse and manage services provided by your agency." />
        <button className="btn btn-brand d-inline-flex align-items-center gap-1"><FaPlus /> Add Service</button>
      </div>

      <div className="row g-3 mb-4">
        <StatCard title="Services" value={services.length} icon={<FaTools />} tone="brand" />
        <StatCard title="Professionals" value={professionals.length} icon={<FaUsersIcon />} tone="primary" />
      </div>

      {groups.map(([category, list]) => (
        <div className="mb-4">
          <h6 className="fw-semibold text-muted text-uppercase small mb-2" style={{ letterSpacing: '.05em' }}>{category} · {list.length}</h6>
          <div className="row g-3">
            {list.map((s) => (
              <div className="col-md-6 col-xl-3" key={s.id}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body">
                    <div className="d-flex align-items-start justify-content-between mb-2">
                      <div className="rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: 40, height: 40, background: 'var(--soft-brand)', color: 'var(--brand)' }}><FaTools /></div>
                      <span className="text-success small fw-semibold d-inline-flex align-items-center gap-1"><FaCheckCircle /> Active</span>
                    </div>
                    <h6 className="fw-bold mb-1" style={{ color: 'var(--text)' }}>{s.title}</h6>
                    <p className="small text-muted mb-2 text-truncate">{s.description || 'Service offered by your agency.'}</p>
                    <span className="fw-bold" style={{ color: 'var(--brand)' }}>${Number(s.price || 0).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {groups.length === 0 && <p className="text-muted text-center py-5 mb-0">No services available yet.</p>}
    </div>
  )
}

export default AgencyCatalogPage
