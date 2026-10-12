import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaTools, FaCheckCircle, FaExclamationTriangle, FaStar, FaPlus, FaEdit, FaTrash, FaToggleOn, FaToggleOff } from 'react-icons/fa'
import { selectServices, addService, updateService, removeService } from '../../features/services/serviceSlice'
import { toast, openConfirm } from '../../features/ui/uiSlice'
import PageHeader from '../../components/common/PageHeader'
import StatCard from '../../components/common/StatCard'
import Modal from '../../components/common/Modal'
import { useCatalog } from '../../hooks/useCatalog'
import { formatMoney, formatDate } from '../../utils/format'
import { CATEGORIES } from '../../data/categories'
import { icons } from '../../utils/iconMap'

const SERVICE_ICONS = [
  'FaBolt', 'FaBroom', 'FaFaucet', 'FaHammer', 'FaHome', 'FaUtensils', 'FaLightbulb',
  'FaPaintRoller', 'FaPaintbrush', 'FaPlug', 'FaShower', 'FaSnowflake', 'FaSoap', 'FaTools',
  'FaWater', 'FaWind', 'FaWashingMachine', 'FaScrewdriver', 'FaWrench', 'FaCouch',
]

const emptyForm = () => ({
  category: 'electrical', name: '', price: 499, duration: 60, emergency: 899,
  description: '', img: 'FaBolt', location: '', availability: true, featured: false,
})

const ProfessionalServicesPage = () => {
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.currentUser)
  const services = useSelector(selectServices)
  const catalog = useCatalog()
  const profile = catalog.proMap[user?.id]

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm())

  const own = services.filter((s) => s.providerType === 'professional' && s.providerId === user?.id)

  const openAdd = () => {
    setForm({ ...emptyForm(), location: profile?.location || user?.location || 'Delhi' })
    setEditing(null)
    setOpen(true)
  }
  const openEdit = (s) => {
    setForm({
      category: s.category, name: s.name, price: s.price, duration: s.duration,
      emergency: s.emergency, description: s.description || '', img: s.img || 'FaBolt',
      location: s.location, availability: s.availability !== false, featured: !!s.featured,
    })
    setEditing(s)
    setOpen(true)
  }

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const save = () => {
    if (!form.name.trim()) return
    const payload = {
      category: form.category,
      name: form.name.trim(),
      price: Number(form.price) || 0,
      duration: Number(form.duration) || 60,
      emergency: Number(form.emergency) || Number(form.price) || 0,
      description: form.description.trim(),
      img: form.img,
      location: form.location,
      color: CATEGORIES.find((c) => c.id === form.category)?.color || '#0d6efd',
    }
    if (editing) {
      dispatch(updateService({ id: editing.id, ...payload, availability: form.availability, featured: form.featured }))
      toast(dispatch, `Service "${form.name}" updated.`, 'success')
    } else {
      dispatch(addService({ ...payload, providerType: 'professional', providerId: user.id, availability: form.availability, featured: form.featured }))
      toast(dispatch, `Service "${form.name}" added to your catalogue.`, 'success', 'Service Created')
    }
    setOpen(false)
    setEditing(null)
  }

  const toggleAvailability = (s) => {
    dispatch(updateService({ id: s.id, availability: !s.availability }))
    toast(dispatch, `${s.name} is now ${s.availability ? 'unavailable' : 'available'} for bookings.`, 'info', 'Availability')
  }

  const remove = (s) => {
    dispatch(openConfirm({
      title: 'Delete this service?',
      message: `"${s.name}" will be removed from your catalogue. Existing bookings are not affected.`,
      confirmText: 'Yes, delete',
      onConfirm: () => {
        dispatch(removeService(s.id))
        toast(dispatch, `Service "${s.name}" deleted.`, 'warning', 'Deleted')
      },
    }))
  }

  const available = own.filter((s) => s.availability).length
  const emergencyOn = own.filter((s) => s.emergency).length

  return (
    <div>
      <PageHeader
        title="My Services"
        subtitle="Add, edit and manage the services customers can book from you."
        actions={<button type="button" className="btn btn-brand btn-sm btn-pill" onClick={openAdd}><FaPlus className="me-1" size={11} /> Add Service</button>}
      />

      <div className="row g-3 mb-4">
        <div className="col-6 col-xl-3"><StatCard icon={<FaTools />} label="Total Services" value={own.length} accent="#0d6efd" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaCheckCircle />} label="Available" value={available} accent="#20c997" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaExclamationTriangle />} label="Emergency Pricing" value={emergencyOn} accent="#f5a623" /></div>
        <div className="col-6 col-xl-3"><StatCard icon={<FaStar />} label="Avg Rating" value={profile?.rating || '—'} accent="#d63384" sub={`${profile?.reviewCount || 0} reviews`} /></div>
      </div>

      {!own.length ? (
        <div className="text-center card card-plain p-5 text-muted">
          <FaTools size={34} className="mb-3 mx-auto d-block" />
          You haven't added any services yet. Click <strong>Add Service</strong> to publish your first one.
        </div>
      ) : (
        <div className="row g-3">
          {own.map((s) => {
            const cat = CATEGORIES.find((c) => c.id === s.category)
            const Icon = icons[s.img] || icons.FaTools
            return (
              <div key={s.id} className="col-12 col-md-6 col-xl-4">
                <div className="card card-plain h-100 p-3">
                  <div className="d-flex align-items-center gap-3">
                    <span className="stat-icon" style={{ background: `${s.color}1a`, color: s.color, width: 46, height: 46 }}>
                      <Icon />
                    </span>
                    <div className="flex-grow-1">
                      <div className="fw-semibold small" style={{ lineHeight: 1.3 }}>{s.name}</div>
                      <div className="text-muted small d-flex align-items-center gap-2">
                        <span className="badge bg-soft-dark">{cat?.name}</span>
                        {s.availability ? <span className="badge bg-soft-success">Available</span> : <span className="badge bg-soft-secondary">Hidden</span>}
                      </div>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mt-3 gap-2 flex-wrap">
                    <div>
                      <span className="price-tag">{formatMoney(s.price)}</span>
                      <span className="text-muted small"> / {s.duration} min</span>
                      {s.emergency ? (
                        <div className="text-muted small"><FaExclamationTriangle className="text-danger me-1" size={10} /> Emergency {formatMoney(s.emergency)}</div>
                      ) : (
                        <div className="text-muted small">Added {formatDate(s.createdAt)}</div>
                      )}
                    </div>
                    <div className="d-flex gap-1">
                      <button type="button" className="btn btn-light border btn-icon" style={{ width: 32, height: 32 }} onClick={() => toggleAvailability(s)} title="Toggle availability">
                        {s.availability ? <FaToggleOn className="text-success" /> : <FaToggleOff className="text-muted" />}
                      </button>
                      <button type="button" className="btn btn-light border btn-icon" style={{ width: 32, height: 32 }} onClick={() => openEdit(s)} title="Edit"><FaEdit /></button>
                      <button type="button" className="btn btn-light border btn-icon" style={{ width: 32, height: 32, color: '#dc3545' }} onClick={() => remove(s)} title="Delete"><FaTrash /></button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <Modal
        show={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit Service' : 'Add New Service'}
        footer={<button type="button" className="btn btn-brand" onClick={save}>{editing ? 'Save changes' : 'Add service'}</button>}
      >
        <div className="row g-2">
          <div className="col-md-6">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={(e) => set('category', e.target.value)}>
              {CATEGORIES.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">Service icon</label>
            <select className="form-select" value={form.img} onChange={(e) => set('img', e.target.value)}>
              {SERVICE_ICONS.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="col-12">
            <label className="form-label">Service name</label>
            <input className="form-control" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="e.g. Ceiling Fan Installation" />
          </div>
          <div className="col-md-4">
            <label className="form-label">Price (₹)</label>
            <input type="number" className="form-control" value={form.price} onChange={(e) => set('price', e.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Duration (min)</label>
            <input type="number" className="form-control" value={form.duration} onChange={(e) => set('duration', e.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="form-label">Emergency price (₹)</label>
            <input type="number" className="form-control" value={form.emergency} onChange={(e) => set('emergency', e.target.value)} />
          </div>
          <div className="col-12">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows={2} value={form.description} onChange={(e) => set('description', e.target.value)} placeholder="Short blurb shown to customers…" />
          </div>
          <div className="col-12 d-flex gap-2">
            <button type="button" className={`badge border ${form.availability ? 'bg-soft-success border-success' : 'bg-soft-dark'}`} onClick={() => set('availability', !form.availability)}>Visible to bookings</button>
            <button type="button" className={`badge border ${form.featured ? 'bg-soft-warning border-warning' : 'bg-soft-dark'}`} onClick={() => set('featured', !form.featured)}>Featured</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ProfessionalServicesPage