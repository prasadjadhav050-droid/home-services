import { FaTimes } from 'react-icons/fa'

const Modal = ({ show, onClose, title, children, footer, size = 'md', backdrop = true }) => {
  if (!show) return null
  return (
    <>
      {backdrop && <div className="modal-backdrop fade show" onClick={onClose} />}
      <div className={`modal fade d-block show`} tabIndex="-1" role="dialog" style={{ zIndex: 1055 }}>
        <div className={`modal-dialog modal-dialog-centered modal-${size} modal-dialog-scrollable`} role="document">
          <div className="modal-content" style={{ borderRadius: 16, overflow: 'hidden' }}>
            <div className="modal-header" style={{ borderBottom: '1px solid #eef1f6' }}>
              <h6 className="modal-title m-0 fw-bold">{title}</h6>
              {onClose && (
                <button type="button" className="btn btn-ghost btn-icon" onClick={onClose} aria-label="Close">
                  <FaTimes />
                </button>
              )}
            </div>
            <div className="modal-body">{children}</div>
            {footer && <div className="modal-footer bg-light" style={{ borderTop: '1px solid #eef1f6' }}>{footer}</div>}
          </div>
        </div>
      </div>
    </>
  )
}

export default Modal