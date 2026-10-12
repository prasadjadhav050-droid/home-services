import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaTools, FaLock, FaUnlockAlt,
  FaBriefcase, FaIdCard, FaShieldAlt, FaAward, FaClock, FaMoneyBillWave,
} from 'react-icons/fa'
import { updateProfessional, toggleAvailability } from '../../features/professionals/professionalSlice'
import { updateUser } from '../../features/users/userSlice'
import { toast } from '../../features/ui/uiSlice'
import PageHeader from '../../components/common/PageHeader'
import Avatar from '../../components/common/Avatar'
import RatingStars from '../../components/common/RatingStars'
import { formatDate } from '../../utils/format'
import { INDIA_CITIES } from '../../data/indianCities'
import { useCatalog } from '../../hooks/useCatalog'

const ProfessionalProfilePage = () => {
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.currentUser)
  const catalog = useCatalog()
  const pro = catalog.proById(user?.id)

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || pro?.phone || '',
    location: pro?.location || user?.location || 'Delhi',
    skills: pro?.skills?.join(', ') || '',
    certifications: pro?.certifications?.join(', ') || '',
    experience: pro?.experience || '',
    hourlyRate: pro?.hourlyRate || '',
  })
  const [pass, setPass] = useState({ next: '', confirm: '' })
  const [passMsg, setPassMsg] = useState('')


  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const save = () => {
    const skills = form.skills.split(',').map((s) => s.trim()).filter(Boolean)
    const certifications = form.certifications.split(',').map((s) => s.trim()).filter(Boolean)
    dispatch(updateProfessional({
      id: user.id,
      ...form,
      skills,
      certifications,
      name: form.name,
      location: form.location,
    }))
    dispatch(updateUser({ id: user.id, name: form.name, email: form.email, phone: form.phone, location: form.location }))
    toast(dispatch, 'Profile updated successfully.', 'success')
  }

  const savePass = () => {
    if (pass.next.length < 6) return setPassMsg('New password must be at least 6 characters.')
    if (pass.next !== pass.confirm) return setPassMsg('Passwords do not match.')
    dispatch(updateUser({ id: user.id, password: pass.next }))
    setPassMsg('')
    setPass({ next: '', confirm: '' })
    toast(dispatch, 'Password changed (simulated).', 'info', 'Password Updated')
  }

  const toggleAvail = () => {
    dispatch(toggleAvailability(user.id))
    toast(dispatch, pro?.availability ? 'You are now offline. New requests are paused.' : 'You are online. Start accepting requests!', 'info', 'Availability')
  }

  
  return (
    <div>
      <PageHeader title="My Profile" subtitle="Manage your professional profile, skills and availability." />

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card card-plain p-4 text-center">
            <Avatar name={pro?.name || user?.name} size="lg" id={user?.id} />
            <h5 className="fw-bold mt-3 mb-0">{pro?.name || user?.name}</h5>
            <div className="text-muted small">{user?.email}</div>
            <div className="d-flex justify-content-center align-items-center gap-2 mt-2">
              <RatingStars value={pro?.rating || 0} size={12} />
              <span className="small fw-semibold">{pro?.rating || '—'}</span>
              <span className="text-muted small">({pro?.reviewCount || 0})</span>
            </div>
            <span className={`badge mt-2 ${pro?.availability ? 'bg-soft-success' : 'bg-soft-secondary'}`}>{pro?.availability ? 'Available for new bookings' : 'Offline'}</span>
            {pro?.verification && <span className="badge bg-soft-primary mt-1"><FaShieldAlt className="me-1" size={9} /> {pro.verification}</span>}
            <hr />
            <div className="text-start small text-muted">
              <div className="mb-2"><FaIdCard className="me-2 text-primary" /> {pro?.experience || 0} yrs experience</div>
              <div className="mb-2"><FaMoneyBillWave className="me-2 text-primary" /> ₹{pro?.hourlyRate || 0}/hr</div>
              <div className="mb-2"><FaBriefcase className="me-2 text-primary" /> {pro?.jobsCompleted || 0} jobs completed</div>
              <div className="mb-2"><FaMapMarkerAlt className="me-2 text-primary" /> {pro?.location || user?.location}</div>
              <div><FaClock className="me-2 text-primary" /> Member since {formatDate(user?.joinedAt)}</div>
            </div>
            <button type="button" className={`btn w-100 mt-3 ${pro?.availability ? 'btn-outline-danger' : 'btn-brand'}`} onClick={toggleAvail}>
              <FaUnlockAlt className="me-1" /> {pro?.availability ? 'Go offline' : 'Go online'}
            </button>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card card-plain p-4 mb-4">
            <h6 className="fw-bold mb-3"><FaUser className="text-primary me-1" /> Personal information</h6>
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Full name</label>
                <div className="input-group-icon"><FaUser className="input-icon" /><input className="form-control" value={form.name} onChange={(e) => set('name', e.target.value)} /></div>
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <div className="input-group-icon"><FaEnvelope className="input-icon" /><input className="form-control" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></div>
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone</label>
                <div className="input-group-icon"><FaPhone className="input-icon" /><input className="form-control" value={form.phone} onChange={(e) => set('phone', e.target.value)} /></div>
              </div>
              <div className="col-md-6">
                <label className="form-label">Location</label>
                <select className="form-select" value={form.location} onChange={(e) => set('location', e.target.value)}>
                  {INDIA_CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="col-12">
                <label className="form-label">Skills <span className="text-muted">(comma-separated)</span></label>
                <div className="input-group-icon"><FaTools className="input-icon" /><input className="form-control" value={form.skills} onChange={(e) => set('skills', e.target.value)} /></div>
                {pro?.skills?.length > 0 && (
                  <div className="d-flex flex-wrap gap-2 mt-2">
                    {pro.skills.map((s) => <span key={s} className="badge bg-soft-brand">{s}</span>)}
                  </div>
                )}
              </div>
              <div className="col-12">
                <label className="form-label">Certifications <span className="text-muted">(comma-separated)</span></label>
                <div className="input-group-icon"><FaAward className="input-icon" /><input className="form-control" value={form.certifications} onChange={(e) => set('certifications', e.target.value)} /></div>
              </div>
              <div className="col-md-6">
                <label className="form-label">Experience (years)</label>
                <input type="number" className="form-control" value={form.experience} onChange={(e) => set('experience', e.target.value)} />
              </div>
              <div className="col-md-6">
                <label className="form-label">Hourly rate (₹)</label>
                <input type="number" className="form-control" value={form.hourlyRate} onChange={(e) => set('hourlyRate', e.target.value)} />
              </div>
            </div>
            <button type="button" className="btn btn-brand mt-3" onClick={save}>Save changes</button>
          </div>

          <div className="card card-plain p-4">
            <h6 className="fw-bold mb-3"><FaLock className="text-primary me-1" /> Change password (demo)</h6>
            <div className="row g-3">
              <div className="col-md-6"><label className="form-label">New password</label><input type="password" className="form-control" value={pass.next} onChange={(e) => setPass({ ...pass, next: e.target.value })} placeholder="Min 6 characters" /></div>
              <div className="col-md-6"><label className="form-label">Confirm password</label><input type="password" className="form-control" value={pass.confirm} onChange={(e) => setPass({ ...pass, confirm: e.target.value })} placeholder="Repeat" /></div>
            </div>
            {passMsg && <div className="text-danger small mt-2">{passMsg}</div>}
            <button type="button" className="btn btn-outline-brand mt-3" onClick={savePass}>Update password</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfessionalProfilePage