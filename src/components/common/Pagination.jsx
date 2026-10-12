import { useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'

const Pagination = ({ page, total, perPage = 9, onChange }) => {
  const pages = Math.max(1, Math.ceil(total / perPage))
  if (pages <= 1) return null
  const nums = []
  const start = Math.max(1, page - 2)
  const end = Math.min(pages, page + 2)
  for (let i = start; i <= end; i += 1) nums.push(i)

  return (
    <nav className="d-flex justify-content-center mt-4">
      <ul className="pagination mb-0">
        <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onChange(page - 1)}>
            <FaChevronLeft size={11} />
          </button>
        </li>
        {start > 1 && (
          <li className="page-item"><button className="page-link" onClick={() => onChange(1)}>1</button></li>
        )}
        {start > 2 && <li className="page-item disabled"><span className="page-link">…</span></li>}
        {nums.map((n) => (
          <li key={n} className={`page-item ${n === page ? 'active' : ''}`}>
            <button className="page-link" onClick={() => onChange(n)}>{n}</button>
          </li>
        ))}
        {end < pages - 1 && <li className="page-item disabled"><span className="page-link">…</span></li>}
        {end < pages && (
          <li className="page-item"><button className="page-link" onClick={() => onChange(pages)}>{pages}</button></li>
        )}
        <li className={`page-item ${page === pages ? 'disabled' : ''}`}>
          <button className="page-link" onClick={() => onChange(page + 1)}>
            <FaChevronRight size={11} />
          </button>
        </li>
      </ul>
    </nav>
  )
}

export const usePagination = (list, perPage = 9) => {
  const [page, setPage] = useState(1)
  const total = list.length
  const effective = Math.min(page, Math.max(1, Math.ceil(total / perPage)))
  const index = (effective - 1) * perPage
  const slice = list.slice(index, index + perPage)
  return { page: effective, setPage, slice, total, perPage }
}

export default Pagination