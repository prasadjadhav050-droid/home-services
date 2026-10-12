import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaCheckCircle, FaHeart } from 'react-icons/fa'
import { updateProfile } from '../../features/auth/authSlice'
import { updateUser } from '../../features/users/userSlice'
import { toast } from '../../features/ui/uiSlice'
import PageHeader from '../../components/common/PageHeader'
import Avatar from '../../components/common/Avatar'
import { CATEGORIES } from '../../data/categories'
import { INDIA_CITIES } from '../../data/indianCities'
import { formatDate } from '../../utils/format'

const CustomerProfilePage = () => {
  const dispatch = useDispatch()
  const user = useSelector((s) => s.auth.currentUser)
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', phone: user?.phone || '',
    location: user?.location || 'Delhi', preferences: user?.preferences || [],
  })
  const [pass, setPass] = useState({ current: '', next: '', confirm: '' })
  const [passMsg, setPassMsg] = useState('')

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const togglePref = (v) => setForm((f) => ({
    ...f,
    preferences: f.preferences.includes(v) ? f.preferences.filter((x) => x !== v) : [...f.preferences, v],
  }))

  const save = () => {
    dispatch(updateProfile(form))
    dispatch(updateUser({ id: user.id, ...form }))
    toast(dispatch, 'Profile updated successfully.', 'success')
  }

  const savePass = () => {
    if (pass.next.length < 6) return setPassMsg('New password must be at least 6 characters.')
    if (pass.next !== pass.confirm) return setPassMsg('Passwords do not match.')
    setPassMsg('')
    dispatch(updateUser({ id: user.id, password: pass.next }))
    toast(dispatch, 'Password changed (simulated).', 'info', 'Password Updated')
    setPass({ next: '', confirm: '' })
  }

  const Field = ({ icon, label, children }) => (
    <div className="mb-3">
      <label className="form-label">{label}</label>
      <div className="input-group-icon">{icon}{children}</div>
    </div>
  )

  return (
    <div>
      <PageHeader title="My Profile" subtitle="Manage your personal information and preferences." />
      <div className="row g-4">
        <div className="col-lg-4">
          <div className="card card-plain p-4 text-center">
            <Avatar name={user?.name} size="lg" id={user?.id} />
            <h5 className="fw-bold mt-3 mb-0">{user?.name}</h5>
            <div className="text-muted small">{user?.email}</div>
            <span className="badge bg-soft-success mt-2"><FaCheckCircle className="me-1" size={10} /> {user?.role} · active</span>
            <hr />
            <div className="text-start small text-muted">
              <div className="mb-1"><FaUser className="me-2 text-primary" /> {user?.role}</div>
              <div className="mb-1"><FaPhone className="me-2 text-primary" /> {user?.phone || '—'}</div>
              <div className="mb-1"><FaMapMarkerAlt className="me-2 text-primary" /> {user?.location || '—'}</div>
              <div>Member since {formatDate(user?.joinedAt)}</div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card card-plain p-4 mb-4">
            <h6 className="fw-bold mb-3">Personal information</h6>
            <div className="row g-2">
              <div className="col-md-6">
                <Field icon={<FaUser />} label="Full name"><input className="form-control" value={form.name} onChange={(e) => set('name', e.target.value)} /></Field>
              </div>
              <div className="col-md-6">
                <Field icon={<FaEnvelope />} label="Email"><input className="form-control" type="email" value={form.email} onChange={(e) => set('email', e.target.value)} /></Field>
              </div>
              <div className="col-md-6">
                <Field icon={<FaPhone />} label="Phone"><input className="form-control" value={form.phone} onChange={(e) => set('phone', e.target.value)} /></Field>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label className="form-label">Location</label>
                  <select className="form-select" value={form.location} onChange={(e) => set('location', e.target.value)}>
                    {INDIA_CITIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </div>
            <label className="form-label"><FaHeart className="me-1 text-danger" size={12} /> Service preferences</label>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {CATEGORIES.map((c) => (
                <button key={c.id} type="button" className={`badge border ${form.preferences.includes(c.name) ? 'bg-soft-brand border-primary' : 'bg-soft-dark'}`} onClick={() => togglePref(c.name)}>
                  {c.name}
                </button>
              ))}
            </div>
            <button type="button" className="btn btn-brand" onClick={save}>Save changes</button>
          </div>

          <div className="card card-plain p-4">
            <h6 className="fw-bold mb-3"><FaLock className="me-1 text-primary" size={14} /> Change password (demo)</h6>
            <div className="row g-2">
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

export default CustomerProfilePage