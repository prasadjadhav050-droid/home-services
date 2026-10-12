import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from 'react-icons/fa'
import { selectToasts, dismissToast } from '../../features/ui/uiSlice'

const ICONS = {
  success: <FaCheckCircle />,
  error: <FaExclamationTriangle />,
  info: <FaInfoCircle />,
  warning: <FaExclamationTriangle />,
}

const COLOR = {
  success: { border: '#198754', icon: '#198754', bg: '#f0fdf6' },
  error: { border: '#dc3545', icon: '#dc3545', bg: '#fef2f2' },
  info: { border: '#0dcaf0', icon: '#0b7fa0', bg: '#f0f9ff' },
  warning: { border: '#ffc107', icon: '#a57000', bg: '#fffbeb' },
}

const ToastItem = ({ t }) => {
  const dispatch = useDispatch()
  const c = COLOR[t.type] || COLOR.info
  useEffect(() => {
    const timer = setTimeout(() => dispatch(dismissToast(t.id)), 4200)
    return () => clearTimeout(timer)
  }, [t.id, dispatch])
  return (
    <div
      className="toast show align-items-center"
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        borderLeft: `4px solid ${c.border}`,
        borderRadius: 12,
        boxShadow: '0 10px 30px rgba(15,23,42,0.14)',
        minWidth: 300,
      }}
    >
      <div className="d-flex p-2 px-3 align-items-top">
        <span className="me-2 mt-1" style={{ color: c.icon }}>{ICONS[t.type]}</span>
        <div className="flex-grow-1">
          <div className="fw-semibold" style={{ fontSize: '0.85rem', color: '#111827' }}>{t.title}</div>
          <div className="text-muted" style={{ fontSize: '0.8rem' }}>{t.message}</div>
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-icon p-0 ms-2"
          style={{ width: 24, height: 24 }}
          onClick={() => dispatch(dismissToast(t.id))}
        >
          <FaTimes size={12} />
        </button>
      </div>
    </div>
  )
}

const ToastContainer = () => {
  const toasts = useSelector(selectToasts)
  if (!toasts.length) return null
  return (
    <div
      className="toast-container position-fixed top-0 end-0 p-3"
      style={{ zIndex: 1090, gap: 10, display: 'flex', flexDirection: 'column' }}
    >
      {toasts.map((t) => <ToastItem key={t.id} t={t} />)}
    </div>
  )
}

export default ToastContainer