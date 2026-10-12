import { useSelector, useDispatch } from 'react-redux'
import { selectConfirm, closeConfirm } from '../../features/ui/uiSlice'
import Modal from './Modal'

const ConfirmDialog = () => {
  const confirm = useSelector(selectConfirm)
  const dispatch = useDispatch()
  if (!confirm) return null
  const { title = 'Are you sure?', message, confirmText = 'Confirm', cancelText = 'Cancel', tone = 'danger' } = confirm
  const btnCls = tone === 'danger' ? 'btn-danger' : 'btn-brand'
  return (
    <Modal
      show
      onClose={() => dispatch(closeConfirm())}
      title={title}
      size="sm"
      footer={
        <>
          <button type="button" className="btn btn-light border" onClick={() => dispatch(closeConfirm())}>
            {cancelText}
          </button>
          <button
            type="button"
            className={`btn ${btnCls}`}
            onClick={() => {
              confirm.onConfirm?.()
              dispatch(closeConfirm())
            }}
          >
            {confirmText}
          </button>
        </>
      }
    >
      <p className="mb-0 text-muted" style={{ lineHeight: 1.6 }}>{message}</p>
    </Modal>
  )
}

export default ConfirmDialog